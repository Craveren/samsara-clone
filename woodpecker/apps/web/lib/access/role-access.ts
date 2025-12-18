/**
 * Role-Based Access Control System
 * Enforces strict access control based on user roles and invitations
 */

import { UserRole } from '@/lib/middleware/access-control'
import { prisma } from '@/lib/db/client'

export interface AccessCheck {
  allowed: boolean
  reason?: string
  redirectTo?: string
}

/**
 * Check if a user can access a specific legacy
 */
export async function canAccessLegacy(
  userId: string,
  role: UserRole,
  legacyId: string
): Promise<AccessCheck> {
  try {
    const legacy = await prisma.legacy.findUnique({
      where: { id: legacyId },
      include: {
        client: true,
        professional: true,
      },
    })

    if (!legacy) {
      return {
        allowed: false,
        reason: 'Legacy not found',
        redirectTo: '/dashboard',
      }
    }

    // Clients can access their own legacies
    if (role === 'client') {
      const client = await prisma.client.findUnique({
        where: { clerkUserId: userId },
      })
      if (client && legacy.clientId === client.id) {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'You can only access your own legacies',
        redirectTo: '/client/dashboard',
      }
    }

    // Lawyers/Agencies can access if they're assigned or through team access
    if (role === 'lawyer' || role === 'agency' || role === 'financial-advisor') {
      const professional = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
      })
      
      if (professional) {
        // Direct access
        if (legacy.professionalId === professional.id) {
          return { allowed: true }
        }
        
        // Check team access - if this professional is a sub-account, check parent teams
        // Note: This requires Prisma client regeneration after schema update
        try {
          const teamMember = await (prisma as any).teamMember?.findFirst({
            where: { subAccountId: professional.id },
            include: { professional: true },
          })
          
          if (teamMember && legacy.professionalId === teamMember.professionalId) {
            return { allowed: true }
          }
        } catch (error) {
          // TeamMember model not yet generated - skip team access check
          console.warn('TeamMember model not available, skipping team access check')
        }
      }
      
      return {
        allowed: false,
        reason: 'You are not assigned to this legacy',
        redirectTo: role === 'financial-advisor' ? '/financial-advisor/dashboard' : '/lawyer/dashboard',
      }
    }

    // Note: Financial advisors are now handled in the lawyer/agency check above
    // This section is kept for backward compatibility but should not be reached

    return {
      allowed: false,
      reason: 'Access denied',
      redirectTo: '/dashboard',
    }
  } catch (error) {
    console.error('Error checking legacy access:', error)
    return {
      allowed: false,
      reason: 'Error checking access',
      redirectTo: '/dashboard',
    }
  }
}

/**
 * Check if a user can perform an action on a legacy
 */
export async function canPerformAction(
  userId: string,
  role: UserRole,
  legacyId: string,
  action: 'view' | 'edit' | 'delete' | 'invite'
): Promise<AccessCheck> {
  const baseAccess = await canAccessLegacy(userId, role, legacyId)
  if (!baseAccess.allowed) {
    return baseAccess
  }

  // Get invitation access level
  const invitation = await prisma.invitation.findFirst({
    where: {
      legacyId,
      recipientId: userId,
      status: 'accepted',
    },
  })

  const accessLevel = invitation?.accessLevel || 'view'

  // Check action permissions
  switch (action) {
    case 'view':
      return { allowed: true }
    case 'edit':
      if (accessLevel === 'edit' || accessLevel === 'full' || role === 'client') {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'You only have view access',
      }
    case 'delete':
      if (accessLevel === 'full' || role === 'client') {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'You do not have permission to delete',
      }
    case 'invite':
      if (accessLevel === 'full' || role === 'client' || role === 'lawyer') {
        return { allowed: true }
      }
      return {
        allowed: false,
        reason: 'You do not have permission to invite others',
      }
    default:
      return { allowed: false, reason: 'Unknown action' }
  }
}

/**
 * Get all legacies a user can access
 */
export async function getAccessibleLegacies(
  userId: string,
  role: UserRole
): Promise<string[]> {
  try {
    if (role === 'client') {
      const client = await prisma.client.findUnique({
        where: { clerkUserId: userId },
        include: { legacies: { select: { id: true } } },
      })
      return client?.legacies.map(l => l.id) || []
    }

    if (role === 'lawyer' || role === 'agency') {
      const professional = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
      })
      if (!professional) return []

      const legacies = await prisma.legacy.findMany({
        where: { professionalId: professional.id },
        select: { id: true },
      })
      return legacies.map(l => l.id)
    }

    if (role === 'financial-advisor') {
      const professional = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
      })
      if (!professional) return []
      
      const legacies = await prisma.legacy.findMany({
        where: { professionalId: professional.id },
        select: { id: true },
      })
      return legacies.map(l => l.id)
    }

    return []
  } catch (error) {
    console.error('Error fetching accessible legacies:', error)
    return []
  }
}








