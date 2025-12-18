/**
 * User Sync Utility
 * Syncs Clerk users with Neon database
 * Handles role-based user creation and updates
 */

import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import type { UserRole } from '@/lib/middleware/access-control'

export interface ClerkUserData {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string | null
  publicMetadata?: Record<string, any>
}

/**
 * Get user role from Clerk metadata
 * Checks publicMetadata.role or defaults to 'client'
 */
function getUserRoleFromMetadata(metadata?: Record<string, any>): UserRole {
  if (!metadata) return 'client'
  
  const role = metadata.role as string
  if (['client', 'lawyer', 'agency', 'executor', 'family'].includes(role)) {
    return role as UserRole
  }
  
  return 'client'
}

/**
 * Sync user from Clerk to database
 * Creates or updates user in the appropriate table based on role
 */
export async function syncUserToDatabase(userData: ClerkUserData): Promise<{
  success: boolean
  userId: string
  role: UserRole
  error?: string
}> {
  try {
    const role = getUserRoleFromMetadata(userData.publicMetadata)
    const email = userData.email
    const name = userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData.firstName || userData.lastName || undefined

    // Check if user already exists in any table
    const existingClient = await prisma.client.findUnique({
      where: { clerkUserId: userData.id },
    })
    
    const existingProfessional = await prisma.professional.findUnique({
      where: { clerkUserId: userData.id },
    })
    
    const existingExecutor = await prisma.executor.findUnique({
      where: { clerkUserId: userData.id },
    })

    // If user exists in wrong table, we need to handle migration
    // For now, we'll update the existing record
    if (existingClient) {
      if (role === 'client') {
        // Update client
        await prisma.client.update({
          where: { clerkUserId: userData.id },
          data: {
            email,
            name,
            avatarUrl: userData.imageUrl || undefined,
          },
        })
        return { success: true, userId: existingClient.id, role: 'client' }
      }
      // Role changed - would need migration logic here
    }

    if (existingProfessional) {
      if (role === 'lawyer' || role === 'agency') {
        await prisma.professional.update({
          where: { clerkUserId: userData.id },
          data: {
            email,
            name,
            role: role === 'agency' ? 'agency' : 'lawyer',
          },
        })
        return { success: true, userId: existingProfessional.id, role }
      }
    }

    if (existingExecutor) {
      if (role === 'executor') {
        await prisma.executor.update({
          where: { clerkUserId: userData.id },
          data: {
            email,
            name,
          },
        })
        return { success: true, userId: existingExecutor.id, role: 'executor' }
      }
    }

    // User doesn't exist - create in appropriate table using upsert to handle race conditions
    if (role === 'client' || role === 'family') {
      const client = await prisma.client.upsert({
        where: { clerkUserId: userData.id },
        update: {
          email,
          name,
          avatarUrl: userData.imageUrl || undefined,
        },
        create: {
          clerkUserId: userData.id,
          email,
          name,
          avatarUrl: userData.imageUrl || undefined,
        },
      })
      return { success: true, userId: client.id, role: 'client' }
    }

    if (role === 'lawyer' || role === 'agency' || role === 'financial-advisor') {
      // Use upsert on clerkUserId since it's unique
      const professional = await prisma.professional.upsert({
        where: { clerkUserId: userData.id },
        update: {
          email,
          name,
          role: role === 'agency' ? 'agency' : role === 'financial-advisor' ? 'financial-advisor' : 'lawyer',
        },
        create: {
          clerkUserId: userData.id,
          email,
          name,
          role: role === 'agency' ? 'agency' : role === 'financial-advisor' ? 'financial-advisor' : 'lawyer',
        },
      })
      return { success: true, userId: professional.id, role }
    }

    if (role === 'executor') {
      const executor = await prisma.executor.upsert({
        where: { clerkUserId: userData.id },
        update: {
          email,
          name,
        },
        create: {
          clerkUserId: userData.id,
          email,
          name,
        },
      })
      return { success: true, userId: executor.id, role: 'executor' }
    }

    // Default to client if role is unknown
    const client = await prisma.client.upsert({
      where: { clerkUserId: userData.id },
      update: {
        email,
        name,
        avatarUrl: userData.imageUrl || undefined,
      },
      create: {
        clerkUserId: userData.id,
        email,
        name,
        avatarUrl: userData.imageUrl || undefined,
      },
    })
    return { success: true, userId: client.id, role: 'client' }
  } catch (error: any) {
    console.error('Error syncing user to database:', error)
    return {
      success: false,
      userId: '',
      role: 'client',
      error: error.message || 'Unknown error',
    }
  }
}

/**
 * Sync current user from Clerk
 * Convenience function that gets current user and syncs
 */
export async function syncCurrentUser() {
  const user = await currentUser()
  
  if (!user) {
    return null
  }

  const userData: ClerkUserData = {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    publicMetadata: user.publicMetadata as Record<string, any> | undefined,
  }

  return await syncUserToDatabase(userData)
}

/**
 * Ensure user exists in database
 * Creates user if they don't exist, updates if they do
 * STRICT IDENTITY: Each account type is a separate identity
 */
export async function ensureUserInDatabase(clerkUserId: string, role?: UserRole) {
  const user = await currentUser()
  
  if (!user || user.id !== clerkUserId) {
    return null
  }

  // Determine role from parameter, Clerk metadata, or default
  const userRole = role || getUserRoleFromMetadata(user.publicMetadata as Record<string, any> | undefined)

  // Check if user exists in the correct table for their role
  if (userRole === 'client' || userRole === 'family') {
    const existingClient = await prisma.client.findUnique({
      where: { clerkUserId },
    })
    if (existingClient) {
      return { exists: true, role: 'client' }
    }
  }

  if (userRole === 'lawyer' || userRole === 'agency') {
    const existingProfessional = await prisma.professional.findUnique({
      where: { clerkUserId },
    })
    if (existingProfessional) {
      return { exists: true, role: userRole }
    }
  }

  if (userRole === 'executor') {
    const existingExecutor = await prisma.executor.findUnique({
      where: { clerkUserId },
    })
    if (existingExecutor) {
      return { exists: true, role: 'executor' }
    }
  }

  // User doesn't exist - sync them with their role
  const userData: ClerkUserData = {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    publicMetadata: {
      ...(user.publicMetadata as Record<string, any> | undefined),
      role: userRole, // Ensure role is set in metadata
    },
  }

  return await syncUserToDatabase(userData)
}

