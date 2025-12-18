/**
 * Utilities for checking team access and permissions
 */

import { prisma } from '@/lib/db/client'

/**
 * Check if a professional can access a legacy through team membership
 */
export async function canAccessLegacyThroughTeam(
  professionalId: string,
  legacyId: string
): Promise<boolean> {
  try {
    // Check direct access
    const directAccess = await prisma.legacy.findFirst({
      where: {
        id: legacyId,
        professionalId,
      },
    })

    if (directAccess) return true

    // Check if this professional is a sub-account and parent has access
    const teamMember = await (prisma as any).teamMember?.findFirst({
      where: { subAccountId: professionalId },
    })

    if (teamMember) {
      const parentAccess = await prisma.legacy.findFirst({
        where: {
          id: legacyId,
          professionalId: teamMember.professionalId,
        },
      })

      if (parentAccess) return true
    }

    // Check if any sub-accounts of this professional have access
    const subAccounts = await (prisma as any).teamMember?.findMany({
      where: { professionalId },
      select: { subAccountId: true },
    })

    if (subAccounts && subAccounts.length > 0) {
      const subAccountIds = subAccounts.map((sa: any) => sa.subAccountId)
      const subAccountAccess = await prisma.legacy.findFirst({
        where: {
          id: legacyId,
          professionalId: {
            in: subAccountIds,
          },
        },
      })

      if (subAccountAccess) return true
    }

    return false
  } catch (error) {
    console.error('Error checking team access:', error)
    return false
  }
}

/**
 * Get all legacies accessible through team membership
 */
export async function getTeamAccessibleLegacies(professionalId: string): Promise<string[]> {
  try {
    const legacyIds: string[] = []

    // Direct legacies
    const directLegacies = await prisma.legacy.findMany({
      where: { professionalId },
      select: { id: true },
    })
    legacyIds.push(...directLegacies.map((l) => l.id))

    // Legacies through parent team
    const teamMember = await (prisma as any).teamMember?.findFirst({
      where: { subAccountId: professionalId },
    })

    if (teamMember) {
      const parentLegacies = await prisma.legacy.findMany({
        where: { professionalId: teamMember.professionalId },
        select: { id: true },
      })
      legacyIds.push(...parentLegacies.map((l) => l.id))
    }

    // Legacies through sub-accounts
    const subAccounts = await (prisma as any).teamMember?.findMany({
      where: { professionalId },
      select: { subAccountId: true },
    })

    if (subAccounts && subAccounts.length > 0) {
      const subAccountIds = subAccounts.map((sa: any) => sa.subAccountId)
      const subAccountLegacies = await prisma.legacy.findMany({
        where: {
          professionalId: {
            in: subAccountIds,
          },
        },
        select: { id: true },
      })
      legacyIds.push(...subAccountLegacies.map((l) => l.id))
    }

    return [...new Set(legacyIds)] // Remove duplicates
  } catch (error) {
    console.error('Error getting team accessible legacies:', error)
    return []
  }
}

/**
 * Check if a professional has permission to perform an action
 */
export async function hasTeamPermission(
  professionalId: string,
  permission: string
): Promise<boolean> {
  try {
    // Check if this professional is a sub-account
    const teamMember = await (prisma as any).teamMember?.findFirst({
      where: { subAccountId: professionalId },
      include: { professional: true },
    })

    if (!teamMember) return false

    // Check if permission is in the permissions array
    if (teamMember.permissions && teamMember.permissions.includes(permission)) {
      return true
    }

    // Check role-based permissions
    if (teamMember.role === 'admin' || teamMember.role === 'manager') {
      return true
    }

    return false
  } catch (error) {
    console.error('Error checking team permission:', error)
    return false
  }
}

