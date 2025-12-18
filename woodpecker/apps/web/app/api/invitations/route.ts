/**
 * Invitations API
 * Handle sending and managing invitations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/middleware/access-control'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'

const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(['lawyer', 'executor', 'agency', 'client', 'estate-planner', 'financial-advisor']),
  accessLevel: z.enum(['view', 'edit', 'full']),
  legacyId: z.string().optional(),
})

/**
 * POST /api/invitations - Send invitation
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json()
    
    const validated = invitationSchema.parse(body)
    
    // Generate unique token using crypto
    const { randomUUID } = await import('crypto')
    const token = randomUUID()
    
    // Determine inviter type based on role
    // Clients, lawyers, agencies, estate planners, and financial advisors can all send invitations
    let inviterType: 'client' | 'professional' = 'client'
    if (['lawyer', 'agency', 'estate-planner', 'financial-advisor'].includes(user.role)) {
      inviterType = 'professional'
    }

    // Validate that user can invite this role
    // Clients can invite lawyers and executors
    // Lawyers can invite clients and other lawyers
    // Agencies can invite clients and lawyers
    // Estate planners can invite clients
    // Financial advisors can invite clients
    if (user.role === 'client' && !['lawyer', 'executor'].includes(validated.role)) {
      return NextResponse.json(
        { error: 'Clients can only invite lawyers or executors' },
        { status: 403 }
      )
    }
    if (user.role === 'lawyer' && !['client', 'lawyer'].includes(validated.role)) {
      return NextResponse.json(
        { error: 'Lawyers can only invite clients or other lawyers' },
        { status: 403 }
      )
    }
    if (user.role === 'agency' && !['client', 'lawyer'].includes(validated.role)) {
      return NextResponse.json(
        { error: 'Agencies can only invite clients or lawyers' },
        { status: 403 }
      )
    }
    if (user.role === 'estate-planner' && validated.role !== 'client') {
      return NextResponse.json(
        { error: 'Estate planners can only invite clients' },
        { status: 403 }
      )
    }
    if (user.role === 'financial-advisor' && validated.role !== 'client') {
      return NextResponse.json(
        { error: 'Financial advisors can only invite clients' },
        { status: 403 }
      )
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        inviterId: user.userId,
        inviterType,
        recipientEmail: validated.email,
        recipientType: validated.role,
        legacyId: validated.legacyId,
        accessLevel: validated.accessLevel,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })
    
    // TODO: Send email notification with invitation link
    // const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invitations/accept/${token}`
    
    return NextResponse.json({
      data: {
        id: invitation.id,
        email: invitation.recipientEmail,
        role: invitation.recipientType,
        accessLevel: invitation.accessLevel,
        status: invitation.status,
        token: invitation.token,
        expiresAt: invitation.expiresAt.toISOString(),
        createdAt: invitation.createdAt.toISOString(),
      },
      message: 'Invitation sent successfully',
    })
  } catch (error) {
    console.error('Error creating invitation:', error)
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/invitations - List invitations
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const invitations = await prisma.invitation.findMany({
      where: {
        inviterId: user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json({
      data: invitations.map((inv) => ({
        id: inv.id,
        email: inv.recipientEmail,
        role: inv.recipientType,
        accessLevel: inv.accessLevel,
        status: inv.status,
        sentAt: inv.createdAt.toISOString(),
        expiresAt: inv.expiresAt?.toISOString(),
        token: inv.token,
        legacyId: inv.legacyId,
        legacyName: inv.legacyId ? 'Legacy Name' : undefined, // TODO: Fetch actual legacy name
      })),
    })
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    )
  }
}

