/**
 * Team Access API
 * Checks if a professional can access a legacy through team membership
 */

import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { canAccessLegacyThroughTeam, getTeamAccessibleLegacies } from '@/lib/utils/team-access'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const legacyId = searchParams.get('legacyId')

    // Get professional record
    const professional = await prisma.professional.findFirst({
      where: { clerkUserId: user.id },
    })

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional account not found' },
        { status: 404 }
      )
    }

    if (legacyId) {
      // Check access to specific legacy
      const hasAccess = await canAccessLegacyThroughTeam(professional.id, legacyId)
      return NextResponse.json({ hasAccess })
    } else {
      // Get all accessible legacies
      const legacyIds = await getTeamAccessibleLegacies(professional.id)
      return NextResponse.json({ legacyIds })
    }
  } catch (error: any) {
    console.error('Error checking team access:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

