/**
 * Set Account Type API (Backward Compatibility)
 * Now uses the new clean role activation system
 */

import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { activateRole } from '@/lib/roles/role-system'
import type { Role } from '@/lib/roles/role-types'
import { getAccountTypeFromQuery } from '@/lib/auth/account-type-handler'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', requiresSignIn: true },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { accountType } = body

    if (!accountType) {
      return NextResponse.json(
        { error: 'Account type is required' },
        { status: 400 }
      )
    }

    const validType = getAccountTypeFromQuery(accountType) as Role
    if (!validType) {
      return NextResponse.json(
        { error: 'Invalid account type' },
        { status: 400 }
      )
    }

    // Get user data from Clerk
    const email = user.primaryEmailAddress?.emailAddress || ''
    const fullName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.lastName || undefined

    // Use new clean role activation system
    const result = await activateRole(
      user.id,
      validType,
      {
        email,
        name: fullName,
        avatarUrl: user.imageUrl || undefined,
      }
    )

    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.error || 'Failed to activate role',
          requiresSignIn: false,
          billingSeparate: true,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      accountType: validType,
      requiresSignIn: false,
      billingSeparate: true,
      message: 'Account type set successfully',
    })
  } catch (error: any) {
    console.error('Error setting account type:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        requiresSignIn: false,
        billingSeparate: true,
      },
      { status: 500 }
    )
  }
}

