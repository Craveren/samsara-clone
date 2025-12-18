/**
 * Organization Context Utilities
 * Provides organization-aware data access for multi-tenancy
 */

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'

/**
 * Get current organization context from auth
 * Returns orgId if user has an active organization
 */
export async function getOrganizationContext(): Promise<{ orgId: string | null; userId: string | null }> {
  const { orgId, userId } = await auth()
  return { orgId: orgId || null, userId: userId || null }
}

/**
 * Require organization context - throws if no organization
 */
export async function requireOrganizationContext(): Promise<{ orgId: string; userId: string }> {
  const { orgId, userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized: User not authenticated')
  }
  
  if (!orgId) {
    throw new Error('Organization context required. Please select or create an organization.')
  }
  
  return { orgId, userId }
}

/**
 * Get or create user account with organization context
 */
export async function getOrCreateUserAccount(
  userId: string,
  orgId: string | null,
  accountType: 'client' | 'professional',
  professionalRole?: 'lawyer' | 'agency' | 'estate-planner' | 'financial-advisor'
) {
  if (accountType === 'client') {
    // Get or create client account with organization
    const client = await prisma.client.upsert({
      where: { clerkUserId: userId },
      update: {
        organizationId: orgId || undefined,
      },
      create: {
        clerkUserId: userId,
        email: '', // Will be set from Clerk user
        organizationId: orgId || undefined,
      },
    })
    return client
  } else {
    // Get or create professional account with organization
    const professional = await prisma.professional.upsert({
      where: { clerkUserId: userId },
      update: {
        organizationId: orgId || undefined,
        role: professionalRole || 'lawyer',
      },
      create: {
        clerkUserId: userId,
        email: '', // Will be set from Clerk user
        organizationId: orgId || undefined,
        role: professionalRole || 'lawyer',
      },
    })
    return professional
  }
}

/**
 * Add organization filter to Prisma queries
 */
export function withOrganizationFilter<T extends { organizationId?: string | null }>(
  orgId: string | null,
  query: any
): any {
  if (!orgId) {
    // If no organization, only return records without organizationId
    return {
      ...query,
      where: {
        ...query.where,
        organizationId: null,
      },
    }
  }
  
  // Return records for this organization
  return {
    ...query,
    where: {
      ...query.where,
      organizationId: orgId,
    },
  }
}

