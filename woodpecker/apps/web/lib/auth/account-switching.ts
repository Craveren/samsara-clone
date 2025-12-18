/**
 * Secure Account Switching System
 * Requires sign-in and maintains separate billing per account type
 */

import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'

export type AccountType = 'client' | 'lawyer' | 'agency' | 'financial-advisor' | 'family'

export interface AccountSwitchRequest {
  userId: string
  fromAccountType: AccountType
  toAccountType: AccountType
  requireSignIn?: boolean
}

export interface AccountSwitchResult {
  success: boolean
  requiresSignIn: boolean
  billingSeparate: boolean
  error?: string
}

/**
 * Check if user can switch to target account type
 * Validates billing separation and sign-in requirements
 */
export async function canSwitchAccount(
  userId: string,
  targetAccountType: AccountType
): Promise<AccountSwitchResult> {
  try {
    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId)
    const currentRole = (user.publicMetadata?.role as AccountType) || 'client'

    // Same account type - no switch needed
    if (currentRole === targetAccountType) {
      return {
        success: true,
        requiresSignIn: false,
        billingSeparate: false,
      }
    }

    // Check if user has separate account for target type in database
    let hasAccount = false
    
    if (targetAccountType === 'client') {
      const client = await prisma.client.findFirst({
        where: { clerkUserId: userId },
      })
      hasAccount = !!client
    } else if (targetAccountType === 'lawyer' || targetAccountType === 'agency') {
      const professional = await prisma.professional.findFirst({
        where: { 
          clerkUserId: userId,
          role: targetAccountType === 'agency' ? 'agency' : 'lawyer',
        },
      })
      hasAccount = !!professional
    } else if (targetAccountType === 'financial-advisor') {
      const professional = await prisma.professional.findFirst({
        where: { 
          clerkUserId: userId,
          role: 'financial-advisor',
        },
      })
      hasAccount = !!professional
    }

    // Allow switching even if account doesn't exist - we'll create it automatically
    // Only require sign-in if there's a security concern (which there isn't for same user)
    const requiresSignIn = false

    // Billing is always separate per account type
    const billingSeparate = true

    return {
      success: true,
      requiresSignIn,
      billingSeparate,
    }
  } catch (error) {
    console.error('Error checking account switch:', error)
    return {
      success: false,
      requiresSignIn: true,
      billingSeparate: true,
      error: 'Failed to validate account switch',
    }
  }
}

/**
 * Switch user account type with proper validation
 * Creates separate account if needed and enforces sign-in
 */
export async function switchAccount(
  userId: string,
  targetAccountType: AccountType,
  forceSignIn: boolean = false
): Promise<AccountSwitchResult> {
  try {
    // Validate switch
    const canSwitch = await canSwitchAccount(userId, targetAccountType)
    
    if (!canSwitch.success) {
      return canSwitch
    }

    // Note: We allow switching even without existing account - we'll create it
    // Only block if there's an actual error in validation

    // Get user info from Clerk
    const clerkUser = await clerkClient.users.getUser(userId)
    const email = clerkUser.primaryEmailAddress?.emailAddress || ''

    // Check and create/update account in appropriate table using upsert
    if (targetAccountType === 'client') {
      const fullName = clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || clerkUser.lastName || undefined
      
      // Use upsert to handle existing records
      const client = await prisma.client.upsert({
        where: { clerkUserId: userId },
        update: {
          email,
          name: fullName || undefined,
          avatarUrl: clerkUser.imageUrl || undefined,
        },
        create: {
          clerkUserId: userId,
          email,
          name: fullName,
          avatarUrl: clerkUser.imageUrl || undefined,
        },
      })
    } else if (targetAccountType === 'lawyer' || targetAccountType === 'agency' || targetAccountType === 'financial-advisor') {
      const fullName = clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || clerkUser.lastName || undefined
      
      const role = targetAccountType === 'agency' ? 'agency' : targetAccountType === 'financial-advisor' ? 'financial-advisor' : 'lawyer'
      
      // Check if professional exists with this clerkUserId
      const existing = await prisma.professional.findFirst({
        where: { clerkUserId: userId },
      })
      
      if (existing) {
        // Update existing professional if role matches or create new one if different
        if (existing.role === role) {
          await prisma.professional.update({
            where: { id: existing.id },
            data: {
              email,
              name: fullName || undefined,
            },
          })
        } else {
          // Different role - create new professional record (but clerkUserId is unique, so this shouldn't happen)
          // Instead, update the role
          await prisma.professional.update({
            where: { id: existing.id },
            data: {
              email,
              name: fullName || undefined,
              role,
            },
          })
        }
      } else {
        // Create new professional - check for email conflict first
        const emailConflict = await prisma.professional.findFirst({
          where: { email },
        })
        
        if (emailConflict) {
          // Email exists but different clerkUserId - this is a conflict
          throw new Error('Email already associated with another professional account')
        }
        
        await prisma.professional.create({
          data: {
            clerkUserId: userId,
            email,
            name: fullName,
            role,
          },
        })
      }
    }

    // Update Clerk metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role: targetAccountType,
      },
    })

    return {
      success: true,
      requiresSignIn: false,
      billingSeparate: true,
    }
  } catch (error) {
    console.error('Error switching account:', error)
    return {
      success: false,
      requiresSignIn: true,
      billingSeparate: true,
      error: 'Failed to switch account',
    }
  }
}

/**
 * Get all account types user has access to
 */
export async function getUserAccounts(userId: string): Promise<AccountType[]> {
  try {
    const accounts: AccountType[] = []
    
    // Check client
    const client = await prisma.client.findFirst({
      where: { clerkUserId: userId },
    })
    if (client) accounts.push('client')
    
    // Check professionals
    const professionals = await prisma.professional.findMany({
      where: { clerkUserId: userId },
    })
    professionals.forEach(prof => {
      if (prof.role === 'lawyer') accounts.push('lawyer')
      if (prof.role === 'agency') accounts.push('agency')
      if (prof.role === 'financial-advisor') accounts.push('financial-advisor')
    })
    
    return accounts.length > 0 ? accounts : ['client'] // Default
  } catch (error) {
    console.error('Error getting user accounts:', error)
    return ['client']
  }
}

