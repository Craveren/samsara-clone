/**
 * Check Account Switch API (Backward Compatibility)
 * Always allows switching - accounts are auto-created
 */

import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getAccountTypeFromQuery } from '@/lib/auth/account-type-handler'
import type { Role } from '@/lib/roles/role-types'

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

    // New system: Always allow switching, accounts are auto-created
    return NextResponse.json({
      success: true,
      requiresSignIn: false, // No sign-in required
      billingSeparate: true,
    })
  } catch (error: any) {
    console.error('Error checking account switch:', error)
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

