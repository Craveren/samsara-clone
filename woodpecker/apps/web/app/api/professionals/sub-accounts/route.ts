/**
 * Sub-Account Management API
 * Handles creating, updating, and removing sub-accounts for professionals
 */

import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import {
  getSubAccounts,
  createSubAccount,
  updateSubAccount,
  removeSubAccount,
} from '@/lib/auth/sub-accounts'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Get all sub-accounts
    const subAccounts = await getSubAccounts(professional.id)

    return NextResponse.json({ subAccounts })
  } catch (error: any) {
    console.error('Error getting sub-accounts:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const body = await request.json()
    const { email, name, role, permissions } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create sub-account
    const result = await createSubAccount(professional.id, {
      email,
      name,
      role,
      permissions,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sub-account added successfully',
      teamMemberId: result.teamMemberId,
    })
  } catch (error: any) {
    console.error('Error creating sub-account:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { teamMemberId, role, permissions, status } = body

    if (!teamMemberId) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      )
    }

    // Verify the team member belongs to this professional
    const professional = await prisma.professional.findFirst({
      where: { clerkUserId: user.id },
    })

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional account not found' },
        { status: 404 }
      )
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: teamMemberId,
        professionalId: professional.id,
      },
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Update sub-account
    const result = await updateSubAccount(teamMemberId, {
      role,
      permissions,
      status,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sub-account updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating sub-account:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teamMemberId = searchParams.get('teamMemberId')
    
    // Also try body for DELETE requests
    let bodyTeamMemberId: string | null = null
    try {
      const body = await request.json().catch(() => ({}))
      bodyTeamMemberId = body.teamMemberId || null
    } catch {
      // Ignore JSON parse errors
    }
    
    const finalTeamMemberId = teamMemberId || bodyTeamMemberId

    if (!finalTeamMemberId) {
      return NextResponse.json(
        { error: 'Team member ID is required' },
        { status: 400 }
      )
    }

    // Verify the team member belongs to this professional
    const professional = await prisma.professional.findFirst({
      where: { clerkUserId: user.id },
    })

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional account not found' },
        { status: 404 }
      )
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: finalTeamMemberId,
        professionalId: professional.id,
      },
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Remove sub-account
    const result = await removeSubAccount(finalTeamMemberId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sub-account removed successfully',
    })
  } catch (error: any) {
    console.error('Error removing sub-account:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

