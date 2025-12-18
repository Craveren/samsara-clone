/**
 * Conversations API
 * GET /api/conversations - Get all conversations for current user
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = (user.publicMetadata?.role as string) || 'client'
    
    // Get conversations based on role
    let conversations: any[] = []

    if (role === 'client') {
      // Get conversations with lawyers/professionals
      // Check if prisma is properly initialized
      if (!prisma || !prisma.legacy) {
        return NextResponse.json({ data: [] })
      }
      
      const legacies = await prisma.legacy.findMany({
        where: { client: { clerkUserId: user.id } },
        include: {
          professional: true,
        },
      })

      conversations = legacies
        .filter(l => l.professional)
        .map(legacy => {
          const prof = legacy.professional!
          const nameParts = prof.name?.split(' ') || []
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          return {
            id: prof.clerkUserId || '',
            name: prof.name || 'Professional',
            role: prof.role || 'lawyer',
            lastMessage: 'Start a conversation',
            unread: 0,
            avatar: (firstName[0] || '') + (lastName[0] || '') || 'P',
            userId: prof.clerkUserId || '',
          }
        })
    } else if (role === 'lawyer' || role === 'financial-advisor' || role === 'agency') {
      // Get conversations with clients
      // Check if prisma is properly initialized
      if (!prisma || !prisma.legacy) {
        return NextResponse.json({ data: [] })
      }
      
      const legacies = await prisma.legacy.findMany({
        where: { 
          professional: {
            clerkUserId: user.id,
          },
        },
        include: {
          client: true,
        },
      })

      conversations = legacies.filter(l => l.client).map(legacy => {
        const client = legacy.client!
        const nameParts = client.name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        return {
          id: client.clerkUserId,
          name: client.name || 'Client',
          role: 'client',
          lastMessage: 'Start a conversation',
          unread: 0,
          avatar: (firstName[0] || '') + (lastName[0] || '') || 'C',
          userId: client.clerkUserId,
        }
      })
    }

    // Remove duplicates
    const uniqueConversations = Array.from(
      new Map(conversations.map(c => [c.id, c])).values()
    )

    return NextResponse.json({
      data: uniqueConversations,
    })
  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

