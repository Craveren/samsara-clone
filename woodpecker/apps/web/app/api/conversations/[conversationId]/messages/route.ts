/**
 * Messages API
 * GET /api/conversations/[conversationId]/messages - Get messages for a conversation
 * POST /api/conversations/[conversationId]/messages - Send a message
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const conversationId = params.conversationId

    // Get messages from database (using Message model if exists, or fallback to localStorage pattern)
    // For now, return empty array - messages will be stored in database
    const messages: any[] = []

    // TODO: Implement proper message storage in database
    // const messages = await prisma.message.findMany({
    //   where: {
    //     OR: [
    //       { senderId: user.id, recipientId: conversationId },
    //       { senderId: conversationId, recipientId: user.id },
    //     ],
    //   },
    //   orderBy: { createdAt: 'asc' },
    // })

    return NextResponse.json({
      data: messages,
    })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const conversationId = params.conversationId
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      )
    }

    // TODO: Store message in database
    // const message = await prisma.message.create({
    //   data: {
    //     senderId: user.id,
    //     recipientId: conversationId,
    //     text,
    //     read: false,
    //   },
    // })

    // For now, return success
    return NextResponse.json({
      success: true,
      message: {
        id: Date.now().toString(),
        text,
        user: {
          id: user.id,
          name: user.firstName || 'You',
          role: (user.publicMetadata?.role as string) || 'user',
        },
        createdAt: new Date().toISOString(),
        read: false,
      },
    })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

