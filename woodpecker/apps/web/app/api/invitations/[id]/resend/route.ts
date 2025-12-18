/**
 * POST /api/invitations/[id]/resend - Resend an invitation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/middleware/access-control'
import { prisma } from '@/lib/db/client'
import { randomUUID } from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Find invitation and verify ownership
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    if (invitation.inviterId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to resend this invitation' },
        { status: 403 }
      )
    }

    // Update invitation with new token and expiry
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: {
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: 'pending', // Reset status if it was expired
      },
    })

    // TODO: Send email notification with new token

    return NextResponse.json({
      success: true,
      data: {
        id: updatedInvitation.id,
        email: updatedInvitation.recipientEmail,
        role: updatedInvitation.recipientType,
        accessLevel: updatedInvitation.accessLevel,
        status: updatedInvitation.status,
        token: updatedInvitation.token,
        expiresAt: updatedInvitation.expiresAt?.toISOString(),
        createdAt: updatedInvitation.createdAt.toISOString(),
      },
      message: 'Invitation resent successfully',
    })
  } catch (error: unknown) {
    console.error('Error resending invitation:', error)
    return NextResponse.json(
      { error: 'Failed to resend invitation' },
      { status: 500 }
    )
  }
}

