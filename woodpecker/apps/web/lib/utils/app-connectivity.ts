/**
 * App Connectivity Utilities
 * Centralized functions for connecting different parts of the app
 */

import { prisma } from '@/lib/db/client'

/**
 * Get all connected accounts for a user (including sub-accounts)
 */
export async function getConnectedAccounts(clerkUserId: string) {
  try {
    const accounts: any[] = []

    // Get client account
    const client = await prisma.client.findFirst({
      where: { clerkUserId },
    })
    if (client) {
      accounts.push({
        type: 'client',
        id: client.id,
        email: client.email,
        name: client.name,
      })
    }

    // Get professional accounts
    const professionals = await prisma.professional.findMany({
      where: { clerkUserId },
    })
    professionals.forEach((prof) => {
      accounts.push({
        type: prof.role,
        id: prof.id,
        email: prof.email,
        name: prof.name,
      })
    })

    // Get sub-accounts (team members)
    for (const prof of professionals) {
      try {
        const teamMembers = await (prisma as any).teamMember?.findMany({
          where: { professionalId: prof.id },
          include: {
            subAccount: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            },
          },
        })

        if (teamMembers) {
          teamMembers.forEach((tm: any) => {
            accounts.push({
              type: `${prof.role}-sub`,
              id: tm.subAccount.id,
              email: tm.subAccount.email,
              name: tm.subAccount.name,
              parentId: prof.id,
              role: tm.role,
            })
          })
        }
      } catch (error) {
        // TeamMember model not available yet
        console.warn('TeamMember model not available')
      }
    }

    return accounts
  } catch (error) {
    console.error('Error getting connected accounts:', error)
    return []
  }
}

/**
 * Check if two users are connected (through any relationship)
 */
export async function areUsersConnected(
  user1ClerkId: string,
  user2ClerkId: string
): Promise<boolean> {
  try {
    // Check if they share a legacy
    const user1Client = await prisma.client.findFirst({
      where: { clerkUserId: user1ClerkId },
    })
    const user2Professional = await prisma.professional.findFirst({
      where: { clerkUserId: user2ClerkId },
    })

    if (user1Client && user2Professional) {
      const sharedLegacy = await prisma.legacy.findFirst({
        where: {
          clientId: user1Client.id,
          professionalId: user2Professional.id,
        },
      })
      if (sharedLegacy) return true
    }

    // Check if they're in the same team
    if (user2Professional) {
      try {
        const teamMember = await (prisma as any).teamMember?.findFirst({
          where: { subAccountId: user2Professional.id },
        })

        if (teamMember) {
          const parentProf = await prisma.professional.findUnique({
            where: { id: teamMember.professionalId },
          })

          if (parentProf?.clerkUserId === user1ClerkId) {
            return true
          }
        }
      } catch (error) {
        // TeamMember not available
      }
    }

    return false
  } catch (error) {
    console.error('Error checking user connection:', error)
    return false
  }
}

/**
 * Get all accessible legacies for a user (including through teams)
 */
export async function getAllAccessibleLegacies(clerkUserId: string): Promise<string[]> {
  try {
    const legacyIds: string[] = []

    // Client legacies
    const client = await prisma.client.findFirst({
      where: { clerkUserId },
    })
    if (client) {
      const legacies = await prisma.legacy.findMany({
        where: { clientId: client.id },
        select: { id: true },
      })
      legacyIds.push(...legacies.map((l) => l.id))
    }

    // Professional legacies (direct and through teams)
    const professional = await prisma.professional.findFirst({
      where: { clerkUserId },
    })
    if (professional) {
      // Direct legacies
      const directLegacies = await prisma.legacy.findMany({
        where: { professionalId: professional.id },
        select: { id: true },
      })
      legacyIds.push(...directLegacies.map((l) => l.id))

      // Team legacies
      try {
        const teamMember = await (prisma as any).teamMember?.findFirst({
          where: { subAccountId: professional.id },
        })

        if (teamMember) {
          const teamLegacies = await prisma.legacy.findMany({
            where: { professionalId: teamMember.professionalId },
            select: { id: true },
          })
          legacyIds.push(...teamLegacies.map((l) => l.id))
        }
      } catch (error) {
        // TeamMember not available
      }
    }

    return [...new Set(legacyIds)]
  } catch (error) {
    console.error('Error getting accessible legacies:', error)
    return []
  }
}

