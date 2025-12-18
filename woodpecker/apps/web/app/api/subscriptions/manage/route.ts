import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { getPlanById, getPlanByTier } from '@/lib/subscriptions/plans'
import { addMonths, addYears } from 'date-fns'
import { prisma } from '@/lib/db/client'
import { currentUser } from '@clerk/nextjs/server'
import { getOrganizationContext } from '@/lib/auth/organization-context'

/**
 * GET - Fetch current subscription
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const actualUserType = (user.publicMetadata?.role as string) || 'client'
    
    // Find user in database
    let dbUser
    if (actualUserType === 'client' || actualUserType === 'family') {
      dbUser = await prisma.client.findUnique({
        where: { clerkUserId: userId },
      })
    } else {
      dbUser = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
      })
    }

    if (!dbUser) {
      return NextResponse.json({ subscription: null, plan: null })
    }

    const subscriptionUserType = actualUserType === 'financial-advisor' ? 'financial-advisor' :
                                 actualUserType === 'agency' ? 'agency' :
                                 actualUserType === 'lawyer' ? 'lawyer' : 'client'

    // Get subscription from database with organization context
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        userType: subscriptionUserType,
        organizationId: orgId || null, // Filter by organization for multi-tenancy
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent subscription
      },
    })

    if (!subscription) {
      return NextResponse.json({ subscription: null, plan: null })
    }

    // Get plan details
    const plan = getPlanById(subscription.tier) || getPlanByTier(subscription.tier as any)

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan: subscription.tier,
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
        cancelAtPeriodEnd: !!subscription.cancelAt,
      },
      plan: plan ? {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: plan.features,
      } : null,
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Require organization for subscription management
    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization context required. Please select or create an organization.' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { plan: planId, billingCycle, paymentMethod } = body

    // Validate inputs
    if (!planId || typeof planId !== 'string') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    if (!['monthly', 'annually'].includes(billingCycle)) {
      return NextResponse.json({ error: 'Billing cycle must be monthly or annually' }, { status: 400 })
    }
    if (paymentMethod && typeof paymentMethod !== 'string') {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    // Use centralized plan definitions
    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const price = plan.price

    // Get user to determine userType
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's actual type from metadata or default to client
    const actualUserType = (user.publicMetadata?.role as string) || 'client'
    
    // Find user in database
    let dbUser
    if (actualUserType === 'client' || actualUserType === 'family') {
      dbUser = await prisma.client.findUnique({
        where: { clerkUserId: userId },
      })
    } else {
      dbUser = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
      })
    }

    if (!dbUser) {
      return NextResponse.json({ error: 'User account not found in database' }, { status: 404 })
    }

    // Map userType to subscription userType
    const subscriptionUserType = actualUserType === 'financial_advisor' ? 'financial_advisor' : 
                                 actualUserType === 'executor' ? 'executor' :
                                 actualUserType === 'agency' ? 'agency' :
                                 actualUserType === 'lawyer' ? 'lawyer' : 'client'

    const currentPeriodStart = new Date()
    const currentPeriodEnd = billingCycle === 'monthly' 
      ? addMonths(currentPeriodStart, 1)
      : addYears(currentPeriodStart, 1)

    // Check if subscription exists first (with organization context)
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        userType: subscriptionUserType,
        organizationId: orgId, // Organization-scoped subscription
      },
    })

    // Save to database (using create or update since there's no composite unique constraint)
    const subscription = existingSubscription
      ? await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            tier: plan.tier,
            status: plan.price === 0 ? 'active' : 'pending',
            amount: price,
            currency: plan.currency || 'ZAR',
            interval: billingCycle === 'monthly' ? 'monthly' : 'yearly',
            currentPeriodStart,
            currentPeriodEnd,
          },
        })
      : await prisma.subscription.create({
          data: {
            userId: dbUser.id,
            userType: subscriptionUserType,
            organizationId: orgId, // Associate subscription with organization
            tier: plan.tier,
            status: plan.price === 0 ? 'active' : 'pending',
            amount: price,
            currency: plan.currency || 'ZAR',
            interval: billingCycle === 'monthly' ? 'monthly' : 'yearly',
            currentPeriodStart,
            currentPeriodEnd,
          },
        })

    // Update Clerk metadata
    try {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          subscription: {
            status: subscription.status,
            tier: plan.tier,
            billingCycle,
            price,
            currency: 'ZAR',
            currentPeriodStart: currentPeriodStart.toISOString(),
            currentPeriodEnd: currentPeriodEnd.toISOString(),
            paymentMethod,
          }
        }
      })
    } catch (error) {
      console.error('Error updating Clerk metadata:', error)
    }

    // TODO: Create invoice
    // TODO: Process payment via PayFast (for paid plans)

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        tier: subscription.tier,
        status: subscription.status,
        billingCycle,
        price,
        currency: 'ZAR',
        currentPeriodStart: subscription.currentPeriodStart?.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      }
    })
    
  } catch (error) {
    console.error('Subscription Error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

