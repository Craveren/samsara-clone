/**
 * DELETE /api/invitations/[id] - Delete/Cancel an invitation
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/middleware/access-control'
import { prisma } from '@/lib/db/client'

export async function DELETE(
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
        { error: 'Unauthorized to delete this invitation' },
        { status: 403 }
      )
    }

    // Delete invitation
    await prisma.invitation.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Invitation cancelled successfully',
    })
  } catch (error: unknown) {
    console.error('Error deleting invitation:', error)
    return NextResponse.json(
      { error: 'Failed to delete invitation' },
      { status: 500 }
    )
  }
}

