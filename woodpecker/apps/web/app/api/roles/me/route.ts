/**
 * Get current user's role information
 * GET /api/roles/me
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getRoleMetadata, getAvailableRoles } from '@/lib/roles/role-system'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      const metadata = await getRoleMetadata(user.id)
      const availableRoles = await getAvailableRoles(user.id)

      return NextResponse.json({
        activeRole: metadata.activeRole,
        roles: availableRoles,
      })
    } catch (dbError: any) {
      // If database fails, fall back to Clerk metadata only
      console.warn('Database error, falling back to Clerk metadata:', dbError)
      const metadata = user.publicMetadata as any
      return NextResponse.json({
        activeRole: (metadata?.activeRole || metadata?.role) || null,
        roles: (metadata?.roles || []) as string[],
      })
    }
  } catch (error: any) {
    console.error('Error getting role info:', error)
    // Always return JSON, never HTML
    return NextResponse.json(
      { 
        error: error.message || 'Failed to get role information',
        activeRole: null,
        roles: [],
      },
      { status: 500 }
    )
  }
}

