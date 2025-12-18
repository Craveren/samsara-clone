/**
 * API Route: Activities
 * GET /api/activities - Get user activities
 * POST /api/activities - Create activity (internal use)
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser, auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import { getOrganizationContext } from '@/lib/auth/organization-context'

export async function GET(request: NextRequest) {
  try {
    let user
    try {
      user = await currentUser()
    } catch (error: any) {
      // If currentUser fails (e.g., user not found in Clerk), return empty activities
      if (error?.status === 404 || error?.clerkError) {
        console.log('User not found in Clerk, returning empty activities')
        return NextResponse.json({ data: [] })
      }
      throw error
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get user's role
    const role = (user.publicMetadata?.role as string) || 'client'

    // Fetch activities from database
    let activities: any[] = []
    try {
      // Check if prisma.activity exists and is a function
      if (!prisma || !prisma.activity || typeof prisma.activity.findMany !== 'function') {
        console.log('Database not configured, returning empty activities')
        return NextResponse.json({ data: [] })
      }
      
      // Get organization context for multi-tenancy
      const { orgId } = await getOrganizationContext()
      
      activities = await prisma.activity.findMany({
        where: { 
          userId: user.id,
          organizationId: orgId || null, // Filter by organization
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch (error: any) {
      // Handle Prisma errors (table doesn't exist, connection issues, etc.)
      if (
        error?.code === 'P2021' || // Table does not exist
        error?.code === 'P1001' || // Can't reach database server
        error?.message?.includes('Database not configured') ||
        error?.message?.includes('does not exist') ||
        error?.message?.includes('Closed')
      ) {
        // Silently handle database errors - don't log to console
        return NextResponse.json({ data: [] })
      }
      // For other errors, silently return empty array in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching activities:', error)
      }
      return NextResponse.json({ data: [] })
    }

    // If no activities, return welcome activity (don't try to create in DB if unavailable)
    if (activities.length === 0) {
      // Return welcome activity without trying to create in DB
      return NextResponse.json({
        data: [{
          id: 'welcome',
          type: 'welcome',
          title: 'Welcome to Woodpecker',
          description: 'Start your estate planning journey',
          icon: 'solar:book-bookmark-bold-duotone',
          color: 'bg-foreground/5 text-foreground',
          link: '/legacy',
          timestamp: new Date().toISOString(),
        }],
      })
    }

    return NextResponse.json({
      data: activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        icon: activity.icon || 'solar:history-bold-duotone',
        color: activity.color || 'bg-foreground/5 text-foreground',
        link: activity.link,
        timestamp: activity.createdAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

/**
 * Create activity (internal use - called by other API routes)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      title,
      description,
      icon,
      color,
      link,
      resourceType,
      resourceId,
    } = body

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title' },
        { status: 400 }
      )
    }

    const role = (user.publicMetadata?.role as string) || 'client'

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()
    
    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        userType: role,
        organizationId: orgId || undefined, // Associate with organization
        type,
        title,
        description: description || undefined,
        icon: icon || undefined,
        color: color || undefined,
        link: link || undefined,
        resourceType: resourceType || undefined,
        resourceId: resourceId || undefined,
      },
    })

    return NextResponse.json({ data: activity }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create activity' },
      { status: 500 }
    )
  }
}
