/**
 * User Role Management API
 * Get or update user role
 * Requires authentication
 */

import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { getCurrentUser } from '@/lib/middleware/access-control'
import type { UserRole } from '@/lib/middleware/access-control'

/**
 * GET - Get current user's role
 */
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      role: user.role,
      userId: user.userId,
      email: user.email,
      name: user.name,
    })
  } catch (error: unknown) {
    console.error('Error getting user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST - Update user role (admin only in production)
 * In production, this should be restricted to admins or use invitation system
 */
export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role } = body

    // Validate role
    const validRoles: UserRole[] = ['client', 'lawyer', 'agency', 'executor', 'family']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // SECURITY: Only allow users to update their own role during onboarding
    // Remove targetUserId to prevent privilege escalation
    const userId = clerkUser.id

    // Get current user from database
    const currentDbUser = await getCurrentUser()
    if (!currentDbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // SECURITY: Check if user already has a role set - roles should be immutable after onboarding
    // This prevents users from changing their account type after initial setup
    const existingClient = await prisma.client.findUnique({
      where: { clerkUserId: userId },
    })
    const existingProfessional = await prisma.professional.findUnique({
      where: { clerkUserId: userId },
    })
    const existingExecutor = await prisma.executor.findUnique({
      where: { clerkUserId: userId },
    })

    // If user already has an account type, prevent role changes
    if (existingClient || existingProfessional || existingExecutor) {
      return NextResponse.json(
        { error: 'Account type cannot be changed after initial setup. Please contact support if you need to change your account type.' },
        { status: 403 }
      )
    }

    // Only allow role creation during onboarding (when no account exists)
    // Use the new role system's activateRole function
    const { activateRole } = await import('@/lib/roles/role-system')
    const email = clerkUser.emailAddresses?.[0]?.emailAddress || ''
    const fullName = clerkUser.fullName || undefined
    
    const result = await activateRole(userId, role as any, {
      email,
      name: fullName,
      avatarUrl: clerkUser.imageUrl || undefined,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to set role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      role,
      message: 'Role updated successfully',
    })
  } catch (error: unknown) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

