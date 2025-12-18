/**
 * Access Control Middleware
 * Role-based access control for different user types
 * Now with database integration
 */

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import { ensureUserInDatabase } from '@/lib/auth/user-sync'

export type UserRole = 'client' | 'lawyer' | 'agency' | 'financial-advisor' | 'family'

export interface AccessContext {
  userId: string
  role: UserRole
  email: string
  name?: string
  professionalId?: string
  financialAdvisorId?: string
}

/**
 * Get current user with role from database
 * Can be called from middleware (with auth context) or server components
 * Returns null if user not found or not authenticated
 */
export async function getCurrentUser(authContext?: { userId: string | null }): Promise<AccessContext | null> {
  let userId: string | null = null
  let clerkUser: any = null

  // If called from middleware, use the auth context
  if (authContext) {
    userId = authContext.userId
  } else {
    // Otherwise, get from Clerk (server component context)
    try {
      const { auth } = await import('@clerk/nextjs/server')
      const authResult = auth()
      userId = authResult.userId || null
      
      // Try to get full user object if userId exists
      if (userId) {
        try {
          const { currentUser } = await import('@clerk/nextjs/server')
          clerkUser = await currentUser()
        } catch (error) {
          // If currentUser fails, we'll use what we have from auth()
          console.warn('Could not get currentUser, using auth() result:', error)
        }
      }
    } catch (error) {
      // If we can't get auth (e.g., in edge runtime), return null
      console.warn('Could not get auth context:', error)
      return null
    }
  }

  if (!userId) {
    return null
  }

  try {
    // Get Clerk user data if not already provided
    if (!clerkUser && !authContext) {
      try {
        const { currentUser } = await import('@clerk/nextjs/server')
        clerkUser = await currentUser()
      } catch (error) {
        console.warn('Could not get currentUser in getCurrentUser:', error)
        // Continue without clerkUser - we'll use metadata from session if available
      }
    }

    // STRICT IDENTITY ENFORCEMENT: Each account type is a separate identity
    // Check Clerk metadata first for role (set during account type selection)
    const clerkRole = clerkUser?.publicMetadata?.role as UserRole | undefined
    
    // Ensure user exists in database (creates if doesn't exist)
    // This is async but we don't need to wait for it to complete
    ensureUserInDatabase(userId, clerkRole).catch(err => {
      console.warn('Failed to ensure user in database:', err)
    })
    
    // Try to find as Client
    const client = await prisma.client.findUnique({
      where: { clerkUserId: userId },
    })

    if (client) {
      return {
        userId,
        role: 'client',
        email: client.email,
        name: client.name || undefined,
      }
    }

    // Try to find as Professional (Lawyer/Agency)
    const professional = await prisma.professional.findUnique({
      where: { clerkUserId: userId },
    })

    if (professional) {
      return {
        userId,
        role: professional.role === 'agency' ? 'agency' : 'lawyer',
        email: professional.email,
        name: professional.name || undefined,
        professionalId: professional.id,
      }
    }

    // Try to find as Financial Advisor (replaced executor)
    const financialAdvisor = await prisma.professional.findUnique({
      where: { 
        clerkUserId: userId,
        role: 'financial-advisor',
      },
    })

    if (financialAdvisor) {
      return {
        userId,
        role: 'financial-advisor',
        email: financialAdvisor.email,
        name: financialAdvisor.name || undefined,
        professionalId: financialAdvisor.id,
      }
    }

    // User not found in database - use Clerk metadata or default
    // This should only happen during initial setup
    if (clerkRole && ['client', 'lawyer', 'agency', 'financial-advisor'].includes(clerkRole)) {
      return {
        userId,
        role: clerkRole,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress || '',
        name: clerkUser?.firstName || undefined,
      }
    }

    // Fallback: return null to trigger account type selection
    return null
  } catch (error) {
    console.error('Error fetching user:', error)
    // Return null to trigger account type selection
    return null
  }
}

/**
 * Require authentication - redirects instead of throwing
 * Use this in Server Components and layouts
 */
export async function requireAuth(): Promise<AccessContext> {
  const user = await getCurrentUser()
  
  if (!user) {
    // Redirect to sign-in instead of throwing
    const { redirect } = await import('next/navigation')
    redirect('/onboarding/account-type?mode=signin')
  }
  
  return user as AccessContext
}

/**
 * Require specific role(s) - redirects instead of throwing
 * Use this in Server Components and layouts
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AccessContext> {
  const user = await getCurrentUser()
  
  if (!user) {
    // Redirect to sign-in if not authenticated
    const { redirect } = await import('next/navigation')
    redirect('/onboarding/account-type?mode=signin')
  }
  
  const userContext = user as AccessContext
  
  if (!allowedRoles.includes(userContext.role)) {
    // Redirect to user's dashboard if wrong role
    const { redirect } = await import('next/navigation')
    const dashboardPath = userContext.role === 'client' ? '/client/dashboard' : `/${userContext.role}/dashboard`
    redirect(dashboardPath)
  }
  
  return userContext
}

/**
 * Check if user has access to a specific legacy
 */
export async function canAccessLegacy(
  userId: string,
  role: UserRole,
  legacyId: string
): Promise<boolean> {
  try {
    if (role === 'client') {
      // Clients can access their own legacies
      const legacy = await prisma.legacy.findFirst({
        where: {
          id: legacyId,
          client: { clerkUserId: userId },
        },
      })
      return !!legacy
    }

    if (role === 'lawyer' || role === 'agency' || role === 'financial-advisor') {
      // Professionals can access legacies they're assigned to or through team access
      const professional = await prisma.professional.findFirst({
        where: { clerkUserId: userId },
      })
      
      if (!professional) return false
      
      // Direct access
      const directAccess = await prisma.legacy.findFirst({
        where: {
          id: legacyId,
          professionalId: professional.id,
        },
      })
      
      if (directAccess) return true
      
      // Check team access - if this professional is a sub-account
      // Note: This requires Prisma client regeneration after schema update
      try {
        const teamMember = await (prisma as any).teamMember?.findFirst({
          where: { subAccountId: professional.id },
        })
        
        if (teamMember) {
          const teamAccess = await prisma.legacy.findFirst({
            where: {
              id: legacyId,
              professionalId: teamMember.professionalId,
            },
          })
          if (teamAccess) return true
        }
      } catch (error) {
        // TeamMember model not yet generated - skip team access check
        console.warn('TeamMember model not available, skipping team access check')
      }
      
      return false
    }

    if (role === 'financial-advisor') {
      // Financial Advisors can access legacies they're assigned to
      const professional = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
        include: { managedClients: { include: { legacies: true } } },
      })
      return professional?.managedClients.some(client => 
        client.legacies.some(l => l.id === legacyId)
      ) ?? false
    }

    return false
  } catch (error) {
    console.error('Error checking legacy access:', error)
    return false
  }
}

/**
 * Get accessible legacies for a user
 */
export async function getAccessibleLegacies(
  userId: string,
  role: UserRole
): Promise<string[]> {
  try {
    if (role === 'client') {
      const legacies = await prisma.legacy.findMany({
        where: { client: { clerkUserId: userId } },
        select: { id: true },
      })
      return legacies.map(l => l.id)
    }

    if (role === 'lawyer' || role === 'agency') {
      const legacies = await prisma.legacy.findMany({
        where: { professional: { clerkUserId: userId } },
        select: { id: true },
      })
      return legacies.map(l => l.id)
    }

    if (role === 'financial-advisor') {
      const professional = await prisma.professional.findUnique({
        where: { clerkUserId: userId },
        include: { managedClients: { include: { legacies: { select: { id: true } } } } },
      })
      const allLegacies = professional?.managedClients.flatMap(client => 
        client.legacies.map(l => l.id)
      ) ?? []
      return [...new Set(allLegacies)] // Remove duplicates
    }

    return []
  } catch (error) {
    console.error('Error fetching accessible legacies:', error)
    return []
  }
}
