/**
 * API Route: Lawyers
 * GET /api/lawyers - Get all lawyers registered in the app
 */

import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'

export async function GET(request: NextRequest) {
  try {
    // Get all users with lawyer role from Clerk
    let clerkLawyers: any[] = []
    try {
      const users = await clerkClient.users.getUserList({
        limit: 100,
      })
      
      if (users && users.data && Array.isArray(users.data)) {
        clerkLawyers = users.data.filter(user => {
          const role = (user.publicMetadata?.role || user.publicMetadata?.activeRole) as string
          return role === 'lawyer'
        })
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching lawyers from Clerk:', error)
      }
    }

    // Also try to get from database
    let dbLawyers: any[] = []
    try {
      if (prisma && prisma.professional) {
        dbLawyers = await prisma.professional.findMany({
          where: { role: 'lawyer' },
          take: 100,
        })
      }
    } catch (error) {
      // Database not available, continue with Clerk data only
    }

    // Combine and deduplicate
    const lawyerMap = new Map<string, any>()
    
    // Add database lawyers first
    dbLawyers.forEach(lawyer => {
      if (lawyer.clerkUserId) {
        lawyerMap.set(lawyer.clerkUserId, {
          id: lawyer.clerkUserId,
          name: lawyer.name || 'Lawyer',
          firm: lawyer.firm || 'Law Firm',
          email: lawyer.email || '',
          specialty: lawyer.specialty || ['Estate Planning'],
          verified: true,
          location: lawyer.location || 'South Africa',
          experience: lawyer.experience || '5+ years',
          rating: 4.5,
          reviews: 0,
          price: 'R2,500/hr',
          responseTime: '< 24 hours',
          description: lawyer.description || 'Experienced estate planning lawyer',
          availableNow: true,
        })
      }
    })

    // Add Clerk lawyers (override with more complete data if available)
    clerkLawyers.forEach(user => {
      const existing = lawyerMap.get(user.id)
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Lawyer'
      const email = user.emailAddresses[0]?.emailAddress || ''
      
      lawyerMap.set(user.id, {
        id: user.id,
        name: existing?.name || name,
        firm: existing?.firm || (user.publicMetadata?.firm as string) || 'Law Firm',
        email: existing?.email || email,
        specialty: existing?.specialty || (user.publicMetadata?.specialty as string[]) || ['Estate Planning'],
        verified: user.publicMetadata?.verified !== false,
        location: existing?.location || (user.publicMetadata?.location as string) || 'South Africa',
        experience: existing?.experience || (user.publicMetadata?.experience as string) || '5+ years',
        rating: existing?.rating || 4.5,
        reviews: existing?.reviews || 0,
        price: existing?.price || 'R2,500/hr',
        responseTime: existing?.responseTime || '< 24 hours',
        description: existing?.description || (user.publicMetadata?.description as string) || 'Experienced estate planning lawyer',
        availableNow: true,
        image: user.imageUrl,
      })
    })

    const lawyers = Array.from(lawyerMap.values())

    return NextResponse.json({ data: lawyers })
  } catch (error: any) {
    console.error('Error fetching lawyers:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lawyers', data: [] },
      { status: 500 }
    )
  }
}

