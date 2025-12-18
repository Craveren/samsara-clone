import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

/**
 * Save user preferences (theme, etc.) to Clerk metadata
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { theme } = body

    // Update user's publicMetadata with theme preference
    // Merge with existing metadata to avoid overwriting other preferences
    try {
      const user = await clerkClient.users.getUser(userId)
      const existingMetadata = user.publicMetadata || {}
      
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...existingMetadata,
          theme: theme || 'default',
        },
      })

      return NextResponse.json({ success: true })
    } catch (clerkError: any) {
      // Handle rate limiting gracefully
      if (clerkError.status === 429 || clerkError.clerkError) {
        // Return success anyway - localStorage already saved it
        // This prevents UI errors while localStorage handles persistence
        return NextResponse.json({ 
          success: true, 
          warning: 'Rate limited - saved locally only' 
        }, { status: 200 })
      }
      throw clerkError
    }
  } catch (error: any) {
    // Don't log rate limit errors as errors - they're expected
    if (error.status !== 429 && error.clerkError !== true) {
      console.error('Error saving user preferences:', error)
    }
    
    // Return success for rate limits - localStorage is the fallback
    if (error.status === 429) {
      return NextResponse.json({ 
        success: true, 
        warning: 'Rate limited - saved locally only' 
      }, { status: 200 })
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to save preferences' },
      { status: 500 }
    )
  }
}

/**
 * Get user preferences from Clerk metadata
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await clerkClient.users.getUser(userId)
    const theme = (user.publicMetadata?.theme as string) || 'default'

    return NextResponse.json({ theme })
  } catch (error: any) {
    console.error('Error fetching user preferences:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

