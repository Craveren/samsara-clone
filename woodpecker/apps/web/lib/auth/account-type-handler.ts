/**
 * Account Type Handler
 * Handles account type assignment during signup
 * Stores account type in Clerk metadata for role detection
 */

import { currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import type { UserRole } from '@/lib/middleware/access-control'

/**
 * Set account type for a user
 * Updates Clerk publicMetadata with the role
 */
export async function setAccountType(
  clerkUserId: string,
  accountType: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await clerkClient()
    
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: accountType,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error setting account type:', error)
    return {
      success: false,
      error: error.message || 'Failed to set account type',
    }
  }
}

/**
 * Get account type from URL or Clerk metadata
 */
export function getAccountTypeFromQuery(query: string | null): UserRole | null {
  if (!query) return null
  
  const validTypes: UserRole[] = ['client', 'lawyer', 'agency', 'financial-advisor', 'family']
  if (validTypes.includes(query as UserRole)) {
    return query as UserRole
  }
  
  return null
}

/**
 * Validate account type matches user's actual role
 */
export async function validateAccountType(
  clerkUserId: string,
  requestedType: UserRole
): Promise<boolean> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(clerkUserId)
    
    const actualRole = (user.publicMetadata as any)?.role as UserRole | undefined
    
    if (!actualRole) {
      // If no role set, allow if it's the first time (signup)
      return true
    }
    
    return actualRole === requestedType
  } catch (error) {
    console.error('Error validating account type:', error)
    return false
  }
}

