/**
 * Get User Accounts API
 * Returns all account types the user has access to
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getUserAccounts } from '@/lib/auth/account-switching'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const accounts = await getUserAccounts(user.id)

    return NextResponse.json({
      accounts,
    })
  } catch (error: any) {
    console.error('Error fetching user accounts:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

