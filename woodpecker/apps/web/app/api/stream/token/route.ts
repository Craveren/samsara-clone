import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { StreamChat } from 'stream-chat'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const requestedUserId = body.userId || userId

    // Validate that the requested user matches authenticated user
    if (requestedUserId !== userId) {
      // For now, only allow users to get their own token
      // In production, add professional-client relationship check
      return NextResponse.json(
        { error: 'Unauthorized to access this chat' },
        { status: 403 }
      )
    }

    // Initialize Stream server-side client
    const apiKey = process.env.STREAM_API_KEY
    const apiSecret = process.env.STREAM_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Stream Chat not configured' },
        { status: 500 }
      )
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret)

    // Create token
    const token = serverClient.createToken(userId)

    // Get user data from Clerk for Stream
    const { user } = await auth()
    const userData = {
      id: userId,
      name: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.username || 'User',
      role: (user?.publicMetadata?.role as string) || 'user',
    }

    return NextResponse.json({
      token,
      user: userData
    })

  } catch (error) {
    console.error('Stream token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate chat token' },
      { status: 500 }
    )
  }
}

