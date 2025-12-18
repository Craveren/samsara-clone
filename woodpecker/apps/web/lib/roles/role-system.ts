/**
 * Server-Only Role System Functions
 * Three-layer architecture: Auth (Clerk) → Database (Prisma) → UI (Modals)
 * 
 * ⚠️ This file contains server-only code and cannot be imported in client components
 * Use role-types.ts for client-safe types and constants
 */

import 'server-only'

import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import type { Role, RoleMetadata } from './role-types'

/**
 * Get role metadata from Clerk
 */
export async function getRoleMetadata(userId: string): Promise<RoleMetadata> {
  try {
    const user = await clerkClient.users.getUser(userId)
    const metadata = user.publicMetadata as any
    
    return {
      activeRole: (metadata?.activeRole as Role) || null,
      roles: (metadata?.roles as Role[]) || [],
    }
  } catch (error) {
    console.error('Error getting role metadata:', error)
    return {
      activeRole: null,
      roles: [],
    }
  }
}

/**
 * Check if user has a role in database
 */
export async function hasRoleInDatabase(userId: string, role: Role): Promise<boolean> {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured, skipping database check')
      return false
    }

    if (role === 'client') {
      const client = await prisma.client.findFirst({
        where: { clerkUserId: userId },
      })
      return !!client
    } else if (role === 'lawyer' || role === 'agency' || role === 'financial-advisor') {
      const professional = await prisma.professional.findFirst({
        where: {
          clerkUserId: userId,
          role: role === 'agency' ? 'agency' : role === 'financial-advisor' ? 'financial-advisor' : 'lawyer',
        },
      })
      return !!professional
    }
    return false
  } catch (error: any) {
    // If database is not available, return false (graceful degradation)
    if (error.message?.includes('not configured') || error.code === 'P1001') {
      console.warn('Database not available, skipping database check')
      return false
    }
    // Handle missing column errors (P2022) - happens when schema has columns that don't exist in DB yet
    if (error.code === 'P2022' || error.message?.includes('does not exist')) {
      console.warn('Database schema out of sync (missing columns), skipping database check. Run: npx prisma migrate dev')
      return false
    }
    console.error('Error checking role in database:', error)
    return false
  }
}

/**
 * Create role record in database (auto-create on switch)
 */
export async function createRoleInDatabase(
  userId: string,
  role: Role,
  userData: { email: string; name?: string; avatarUrl?: string }
): Promise<boolean> {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured, skipping database creation')
      return true // Return true to allow role activation without DB
    }

    if (role === 'client') {
      await prisma.client.upsert({
        where: { clerkUserId: userId },
        update: {
          email: userData.email,
          name: userData.name || undefined,
          avatarUrl: userData.avatarUrl || undefined,
        },
        create: {
          clerkUserId: userId,
          email: userData.email,
          name: userData.name || undefined,
          avatarUrl: userData.avatarUrl || undefined,
        },
      })
    } else if (role === 'lawyer' || role === 'agency' || role === 'financial-advisor') {
      const professionalRole = role === 'agency' ? 'agency' : role === 'financial-advisor' ? 'financial-advisor' : 'lawyer'
      
      // Check if professional exists with this clerkUserId
      const existing = await prisma.professional.findFirst({
        where: { clerkUserId: userId },
      })
      
      if (existing) {
        // Update existing if role matches, or update role if different
        await prisma.professional.update({
          where: { id: existing.id },
          data: {
            email: userData.email,
            name: userData.name || undefined,
            role: professionalRole,
          },
        })
      } else {
        // Create new professional
        await prisma.professional.create({
          data: {
            clerkUserId: userId,
            email: userData.email,
            name: userData.name || undefined,
            role: professionalRole,
          },
        })
      }
    }
    
    return true
  } catch (error: any) {
    // If database is not available, return true to allow role activation
    if (error.message?.includes('not configured') || error.code === 'P1001') {
      console.warn('Database not available, allowing role activation without DB')
      return true
    }
    // Handle missing column errors (P2022) - happens when schema has columns that don't exist in DB yet
    if (error.code === 'P2022' || error.message?.includes('does not exist')) {
      console.warn('Database schema out of sync (missing columns), allowing role activation. Run: npx prisma migrate dev')
      return true
    }
    console.error('Error creating role in database:', error)
    return false
  }
}

/**
 * Get all roles user has in database
 */
export async function getUserRolesFromDatabase(userId: string): Promise<Role[]> {
  const roles: Role[] = []
  
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured, returning empty roles')
      return []
    }

    // Check client
    const client = await prisma.client.findFirst({
      where: { clerkUserId: userId },
    })
    if (client) roles.push('client')
    
    // Check professionals
    const professionals = await prisma.professional.findMany({
      where: { clerkUserId: userId },
    })
    professionals.forEach(prof => {
      if (prof.role === 'lawyer') roles.push('lawyer')
      if (prof.role === 'agency') roles.push('agency')
      if (prof.role === 'financial-advisor') roles.push('financial-advisor')
    })
    
    return roles // Return empty array if no roles found
  } catch (error: any) {
    // If database is not available, return empty array
    if (error.message?.includes('not configured') || error.code === 'P1001') {
      console.warn('Database not available, returning empty roles')
      return []
    }
    // Handle missing column errors (P2022) - happens when schema has columns that don't exist in DB yet
    if (error.code === 'P2022' || error.message?.includes('does not exist')) {
      console.warn('Database schema out of sync (missing columns), returning empty roles. Run: npx prisma migrate dev')
      return []
    }
    console.error('Error getting user roles from database:', error)
    return []
  }
}

/**
 * Activate a role (the clean way)
 * 1. Creates DB record if missing
 * 2. Updates Clerk metadata with activeRole and roles array
 */
export async function activateRole(
  userId: string,
  role: Role,
  userData: { email: string; name?: string; avatarUrl?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Try to ensure role exists in database (auto-create if missing)
    // This is optional - if DB fails, we'll still update Clerk
    let dbRoles: Role[] = []
    try {
      const hasRole = await hasRoleInDatabase(userId, role)
      if (!hasRole) {
        await createRoleInDatabase(userId, role, userData)
      }
      // Get current roles from database
      dbRoles = await getUserRolesFromDatabase(userId)
    } catch (dbError: any) {
      // Database is optional - log warning but continue
      // Handle missing column errors gracefully
      if (dbError.code === 'P2022' || dbError.message?.includes('does not exist')) {
        console.warn('Database schema out of sync (missing columns), continuing with Clerk only. Run: npx prisma migrate dev')
      } else {
        console.warn('Database operation failed, continuing with Clerk only:', dbError.message)
      }
      // Use empty array - we'll use Clerk metadata instead
    }
    
    // Step 2: Update Clerk metadata (this is required)
    try {
      const user = await clerkClient.users.getUser(userId)
      const existingMetadata = (user.publicMetadata || {}) as any
      const existingRoles = (existingMetadata.roles || []) as Role[]
      
      // Merge database roles with existing Clerk roles
      const allRoles = Array.from(new Set([...dbRoles, ...existingRoles, role]))
      
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...existingMetadata,
          activeRole: role,
          roles: allRoles, // Sync with database + existing roles
        },
      })
      
      return { success: true }
    } catch (clerkError: any) {
      console.error('Error updating Clerk metadata:', clerkError)
      return { success: false, error: clerkError.message || 'Failed to update role in Clerk' }
    }
  } catch (error: any) {
    console.error('Error activating role:', error)
    return { success: false, error: error.message || 'Failed to activate role' }
  }
}

/**
 * Get all available roles for user (from database + metadata)
 */
export async function getAvailableRoles(userId: string): Promise<Role[]> {
  try {
    // Get from database (source of truth)
    const dbRoles = await getUserRolesFromDatabase(userId)
    
    // Also check metadata to see if there are any pending roles
    const metadata = await getRoleMetadata(userId)
    
    // Combine and deduplicate
    const allRoles = Array.from(new Set([...dbRoles, ...metadata.roles]))
    
    return allRoles // Return empty array if no roles found
  } catch (error) {
    console.error('Error getting available roles:', error)
    return []
  }
}

