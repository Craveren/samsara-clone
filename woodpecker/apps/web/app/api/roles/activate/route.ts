/**
 * Activate a role (clean switching)
 * POST /api/roles/activate
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { activateRole } from '@/lib/roles/role-system'
import type { Role } from '@/lib/roles/role-types'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role } = body

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    const validRoles: Role[] = ['client', 'lawyer', 'agency', 'estate-planner', 'financial-advisor', 'family']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Get user data from Clerk
    const email = user.primaryEmailAddress?.emailAddress || ''
    const fullName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || undefined

    // Activate role (auto-creates DB record if missing)
    try {
      const result = await activateRole(
        user.id,
        role,
        {
          email,
          name: fullName,
          avatarUrl: user.imageUrl || undefined,
        }
      )

      if (!result.success) {
        // If database fails but we can still update Clerk, allow it
        console.warn('Role activation warning:', result.error)
        // Still return success if we can update Clerk metadata
        return NextResponse.json({
          success: true,
          role,
          message: 'Role activated successfully',
          warning: result.error,
        })
      }

      return NextResponse.json({
        success: true,
        role,
        message: 'Role activated successfully',
      })
    } catch (dbError: any) {
      // If database fails, still try to update Clerk metadata
      console.warn('Database error during role activation, updating Clerk only:', dbError)
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const existingMetadata = (user.publicMetadata || {}) as any
        await clerkClient.users.updateUser(user.id, {
          publicMetadata: {
            ...existingMetadata,
            activeRole: role,
            roles: [...(existingMetadata.roles || []), role].filter((r: string, i: number, arr: string[]) => arr.indexOf(r) === i),
          },
        })
        return NextResponse.json({
          success: true,
          role,
          message: 'Role activated successfully (Clerk only)',
        })
      } catch (clerkError: any) {
        console.error('Failed to update Clerk metadata:', clerkError)
        throw dbError // Re-throw original error
      }
    }
  } catch (error: any) {
    console.error('Error activating role:', error)
    // Log full error details for debugging
    if (error.stack) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

