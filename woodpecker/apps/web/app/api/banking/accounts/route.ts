import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'

const createAccountSchema = z.object({
  accountName: z.string().min(1).max(100),
  accountType: z.enum(['checking', 'savings', 'investment']),
  currency: z.string().length(3).optional(),
  bankName: z.string().optional(),
  balance: z.number().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Fetch from database
    // For now, return empty array
    return NextResponse.json({
      accounts: []
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Validate request body
    const validatedData = createAccountSchema.parse(body)

    // TODO: Save to database
    // For now, return success
    return NextResponse.json({
      success: true,
      account: {
        id: `acc-${randomUUID()}`,
        ...validatedData,
        createdAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

