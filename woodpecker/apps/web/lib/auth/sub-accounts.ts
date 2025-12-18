/**
 * Sub-Account Management for Professionals
 * Allows lawyers, estate planners, and financial advisors to have team members/sub-accounts
 */

import { prisma } from '@/lib/db/client'
import { clerkClient } from '@clerk/nextjs/server'

export interface SubAccountMember {
  id: string
  email: string
  name: string | null
  role: string
  permissions: string[]
  status: string
  joinedAt: Date | null
  clerkUserId: string
}

export interface CreateSubAccountRequest {
  email: string
  name?: string
  role?: string
  permissions?: string[]
}

/**
 * Get all sub-accounts for a professional
 */
export async function getSubAccounts(professionalId: string): Promise<SubAccountMember[]> {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { professionalId },
      include: {
        subAccount: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    })

    return teamMembers.map((tm) => ({
      id: tm.id,
      email: tm.subAccount.email,
      name: tm.subAccount.name,
      role: tm.role,
      permissions: tm.permissions,
      status: tm.status,
      joinedAt: tm.joinedAt,
      clerkUserId: tm.subAccount.clerkUserId,
    }))
  } catch (error) {
    console.error('Error getting sub-accounts:', error)
    return []
  }
}

/**
 * Check if a professional has a specific sub-account
 */
export async function hasSubAccount(
  professionalId: string,
  subAccountEmail: string
): Promise<boolean> {
  try {
    const subAccount = await prisma.professional.findFirst({
      where: { email: subAccountEmail },
    })

    if (!subAccount) return false

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        professionalId,
        subAccountId: subAccount.id,
      },
    })

    return !!teamMember
  } catch (error) {
    console.error('Error checking sub-account:', error)
    return false
  }
}

/**
 * Create a new sub-account for a professional
 * The sub-account must already exist as a Professional in the system
 */
export async function createSubAccount(
  professionalId: string,
  request: CreateSubAccountRequest
): Promise<{ success: boolean; error?: string; teamMemberId?: string }> {
  try {
    // Find the sub-account professional by email
    const subAccount = await prisma.professional.findFirst({
      where: { email: request.email },
    })

    if (!subAccount) {
      return {
        success: false,
        error: 'Professional account not found. The user must sign up as a professional first.',
      }
    }

    // Check if already a team member
    const existing = await prisma.teamMember.findFirst({
      where: {
        professionalId,
        subAccountId: subAccount.id,
      },
    })

    if (existing) {
      return {
        success: false,
        error: 'This professional is already a team member',
      }
    }

    // Create team member relationship
    const teamMember = await prisma.teamMember.create({
      data: {
        professionalId,
        subAccountId: subAccount.id,
        role: request.role || 'member',
        permissions: request.permissions || [],
        status: 'pending',
        invitedAt: new Date(),
      },
    })

    return {
      success: true,
      teamMemberId: teamMember.id,
    }
  } catch (error: any) {
    console.error('Error creating sub-account:', error)
    return {
      success: false,
      error: error.message || 'Failed to create sub-account',
    }
  }
}

/**
 * Update sub-account permissions and role
 */
export async function updateSubAccount(
  teamMemberId: string,
  updates: {
    role?: string
    permissions?: string[]
    status?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: {
        ...(updates.role && { role: updates.role }),
        ...(updates.permissions && { permissions: updates.permissions }),
        ...(updates.status && { status: updates.status }),
        ...(updates.status === 'active' && !updates.joinedAt && { joinedAt: new Date() }),
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error updating sub-account:', error)
    return {
      success: false,
      error: error.message || 'Failed to update sub-account',
    }
  }
}

/**
 * Remove a sub-account from a professional's team
 */
export async function removeSubAccount(
  teamMemberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.teamMember.delete({
      where: { id: teamMemberId },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error removing sub-account:', error)
    return {
      success: false,
      error: error.message || 'Failed to remove sub-account',
    }
  }
}

/**
 * Get all professionals that a user is a sub-account of
 */
export async function getParentTeams(clerkUserId: string): Promise<string[]> {
  try {
    const professional = await prisma.professional.findFirst({
      where: { clerkUserId },
    })

    if (!professional) return []

    const teamMembers = await prisma.teamMember.findMany({
      where: { subAccountId: professional.id },
      select: { professionalId: true },
    })

    return teamMembers.map((tm) => tm.professionalId)
  } catch (error) {
    console.error('Error getting parent teams:', error)
    return []
  }
}

/**
 * Check if current user can access a legacy through their parent team
 */
export async function canAccessThroughTeam(
  clerkUserId: string,
  legacyId: string
): Promise<boolean> {
  try {
    const professional = await prisma.professional.findFirst({
      where: { clerkUserId },
    })

    if (!professional) return false

    // Check if this professional or any parent team has access
    const parentTeams = await getParentTeams(clerkUserId)
    const allProfessionalIds = [professional.id, ...parentTeams]

    const hasAccess = await prisma.legacy.findFirst({
      where: {
        id: legacyId,
        professionalId: {
          in: allProfessionalIds,
        },
      },
    })

    return !!hasAccess
  } catch (error) {
    console.error('Error checking team access:', error)
    return false
  }
}

