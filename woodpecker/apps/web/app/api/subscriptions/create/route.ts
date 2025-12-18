import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { getPlanById } from '@/lib/subscriptions/plans'

/**
 * Create a subscription
 * This integrates with Clerk's payment system
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    const userId = user?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, clerkPriceId, userType = 'client' } = body

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Validate userType
    const validUserTypes = ['client', 'lawyer', 'agency', 'financial_advisor', 'executor']
    if (!validUserTypes.includes(userType)) {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's actual type from metadata or use provided userType
    const actualUserType = (user.publicMetadata?.role as string) || userType

    // Check if user exists in database based on type
    let dbUser
    if (actualUserType === 'client' || actualUserType === 'family') {
      dbUser = await prisma.client.findUnique({
        where: { clerkUserId: userId },
      })

      if (!dbUser) {
        // Create user if doesn't exist
        const email = user.emailAddresses?.[0]?.emailAddress
        if (!email) {
          return NextResponse.json(
            { error: 'Email is required for account creation' },
            { status: 400 }
          )
        }
        dbUser = await prisma.client.create({
          data: {
            clerkUserId: userId,
            email,
            name: user.fullName || undefined,
          },
        })
      }
    } else {
      // For professionals, find in Professional table
      dbUser = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
      })

      if (!dbUser) {
        const email = user.emailAddresses?.[0]?.emailAddress
        if (!email) {
          return NextResponse.json(
            { error: 'Email is required for account creation' },
            { status: 400 }
          )
        }
        dbUser = await prisma.professional.create({
          data: {
            clerkUserId: userId,
            email,
            name: user.fullName || undefined,
            role: actualUserType === 'agency' ? 'agency' : 'lawyer',
          },
        })
      }
    }

    // Map userType to subscription userType
    const subscriptionUserType = actualUserType === 'financial_advisor' ? 'financial_advisor' : 
                                 actualUserType === 'executor' ? 'executor' :
                                 actualUserType === 'agency' ? 'agency' :
                                 actualUserType === 'lawyer' ? 'lawyer' : 'client'

    // For free plans, just update the subscription
    if (plan.price === 0) {
      await prisma.subscription.upsert({
        where: {
          userId_userType: {
            userId: dbUser.id,
            userType: subscriptionUserType,
          },
        },
        create: {
          userId: dbUser.id,
          userType: subscriptionUserType,
          tier: plan.tier,
          status: 'active',
          amount: 0,
          currency: plan.currency,
          interval: plan.interval,
        },
        update: {
          tier: plan.tier,
          status: 'active',
        },
      })

      return NextResponse.json({ success: true, tier: plan.tier })
    }

    // For paid plans, integrate with Clerk's payment system
    // TODO: Implement Clerk payment API integration
    // This would typically:
    // 1. Create a checkout session with Clerk
    // 2. Store the subscription in pending state
    // 3. Return the checkout URL

    // For now, we'll create a subscription record
    // In production, this would be created after successful payment
    // SECURITY: Set status to 'pending' for paid plans until payment is processed
    const subscription = await prisma.subscription.upsert({
      where: {
        userId_userType: {
          userId: dbUser.id,
          userType: subscriptionUserType,
        },
      },
      create: {
        userId: dbUser.id,
        userType: subscriptionUserType,
        tier: plan.tier,
        status: 'pending', // Changed from 'active' - requires payment
        amount: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      },
      update: {
        tier: plan.tier,
        status: 'pending', // Changed from 'active' - requires payment
        amount: plan.price,
        interval: plan.interval,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({
      success: true,
      subscription: {
        tier: subscription.tier,
        status: subscription.status,
      },
      // In production, this would include checkout URL
      // checkoutUrl: checkoutSession.url,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

