/**
 * Accept Invitation API
 * Allows users to accept invitations and gain access to legacies
 * Supports multi-account: same email can have different account types
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import { z } from 'zod'
import { hasAccountType } from '@/lib/auth/multi-account'

const acceptSchema = z.object({
  token: z.string(),
})

/**
 * GET /api/invitations/accept?token=xxx - Get invitation details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find invitation by token
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        legacy: true,
      },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: invitation })
  } catch (error) {
    console.error('Error fetching invitation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitation' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/invitations/accept - Accept an invitation
 * Supports multi-account: if user doesn't have the required account type, they can create it
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to accept this invitation.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { token } = acceptSchema.parse(body)

    const userEmail = user.emailAddresses[0]?.emailAddress

    // Find invitation by token
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        legacy: true,
      },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    // Check if invitation is expired
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'expired' },
      })
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      )
    }

    // Check if already accepted
    if (invitation.status === 'accepted') {
      return NextResponse.json(
        { error: 'Invitation already accepted' },
        { status: 400 }
      )
    }

    // Verify email matches (multi-account: same email can have different account types)
    if (invitation.recipientEmail !== userEmail) {
      return NextResponse.json(
        { 
          error: 'This invitation is for a different email address',
          expectedEmail: invitation.recipientEmail,
          yourEmail: userEmail,
        },
        { status: 403 }
      )
    }

    // Check if user already has this account type
    const hasAccount = await hasAccountType(userEmail, invitation.recipientType as any)
    
    // Handle based on recipient type
    if (invitation.recipientType === 'lawyer' || invitation.recipientType === 'agency') {
      // Create or update Professional
      let professional = await prisma.professional.findUnique({
        where: { clerkUserId: user.id },
      })

      if (!professional) {
        // User doesn't have this account type yet - create it
        professional = await prisma.professional.create({
          data: {
            clerkUserId: user.id,
            email: userEmail || '',
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username || 'Professional',
            role: invitation.recipientType === 'agency' ? 'agency' : 'lawyer',
          },
        })
      } else {
        // Update existing professional if role changed
        if (professional.role !== (invitation.recipientType === 'agency' ? 'agency' : 'lawyer')) {
          professional = await prisma.professional.update({
            where: { id: professional.id },
            data: {
              role: invitation.recipientType === 'agency' ? 'agency' : 'lawyer',
            },
          })
        }
      }

      // Link legacy to professional if legacy exists
      if (invitation.legacyId) {
        await prisma.legacy.update({
          where: { id: invitation.legacyId },
          data: { professionalId: professional.id },
        })
      }

      // Update invitation
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
          recipientId: user.id,
          recipientProfessionalId: professional.id,
        },
      })

      return NextResponse.json({
        message: 'Invitation accepted successfully',
        accountCreated: !hasAccount,
        redirectUrl: invitation.recipientType === 'agency' 
          ? '/agency/dashboard'
          : '/lawyer/dashboard',
      })
    } else if (invitation.recipientType === 'client') {
      // Create or update Client account
      // Check if user already has a client account
      const existingClient = await prisma.client.findFirst({
        where: { clerkUserId: user.id },
      })

      const isSubAccount = invitation.inviterType === 'professional'

      if (!existingClient) {
        // Create client account
        await prisma.client.create({
          data: {
            clerkUserId: user.id,
            email: userEmail || '',
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username || 'Client',
          },
        })
      }

      // If this is a sub-account (invited by professional), we track it via the invitation
      // Client sub-accounts use the Client model but are managed by professionals
      // The relationship is tracked via the invitation's inviterId and inviterType
      // This allows professionals to manage their client sub-accounts

      // Update invitation
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
          recipientId: user.id,
        },
      })

      return NextResponse.json({
        message: 'Invitation accepted successfully',
        accountCreated: !existingClient,
        isSubAccount,
        redirectUrl: '/client/dashboard',
      })
    } else if (invitation.recipientType === 'estate-planner' || invitation.recipientType === 'financial-advisor') {
      // Create or update Professional account for estate planner or financial advisor
      let professional = await prisma.professional.findFirst({
        where: { clerkUserId: user.id },
      })

      if (!professional) {
        professional = await prisma.professional.create({
          data: {
            clerkUserId: user.id,
            email: userEmail || '',
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username || 'Professional',
            role: invitation.recipientType === 'estate-planner' ? 'estate-planner' : 'financial-advisor',
          },
        })
      } else {
        // Update role if needed
        if (professional.role !== invitation.recipientType) {
          professional = await prisma.professional.update({
            where: { id: professional.id },
            data: {
              role: invitation.recipientType === 'estate-planner' ? 'estate-planner' : 'financial-advisor',
            },
          })
        }
      }

      // Link legacy to professional if legacy exists
      if (invitation.legacyId) {
        await prisma.legacy.update({
          where: { id: invitation.legacyId },
          data: { professionalId: professional.id },
        })
      }

      // Update invitation
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
          recipientId: user.id,
          recipientProfessionalId: professional.id,
        },
      })

      return NextResponse.json({
        message: 'Invitation accepted successfully',
        accountCreated: !hasAccount,
        redirectUrl: invitation.recipientType === 'estate-planner' 
          ? '/estate-planner/dashboard'
          : '/financial-advisor/dashboard',
      })
    } else if (invitation.recipientType === 'executor') {
      // Create or update Executor
      let executor = await prisma.executor.findUnique({
        where: { clerkUserId: user.id },
      })

      if (!executor) {
        // User doesn't have executor account yet - create it
        executor = await prisma.executor.create({
          data: {
            clerkUserId: user.id,
            email: userEmail || '',
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username || 'Executor',
          },
        })
      }

      // Link legacy to executor if legacy exists
      if (invitation.legacyId) {
        await prisma.legacy.update({
          where: { id: invitation.legacyId },
          data: { executorId: executor.id },
        })
      }

      // Update invitation
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
          recipientId: user.id,
          executorId: executor.id,
        },
      })

      return NextResponse.json({
        message: 'Invitation accepted successfully',
        accountCreated: !hasAccount,
        redirectUrl: '/executor/dashboard',
      })
    }

    return NextResponse.json(
      { error: 'Invalid recipient type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error accepting invitation:', error)
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    )
  }
}
