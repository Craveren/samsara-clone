/**
 * API Route: Bank Accounts CRUD
 * GET /api/financial/accounts - Get all accounts
 * POST /api/financial/accounts - Create new account
 * PUT /api/financial/accounts - Update account
 * DELETE /api/financial/accounts - Delete account
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser, auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/client'
import { getOrganizationContext } from '@/lib/auth/organization-context'

export async function GET(request: NextRequest) {
  try {
    let user
    try {
      user = await currentUser()
    } catch (error: any) {
      // If currentUser fails, return empty array
      if (error?.status === 404 || error?.clerkError) {
        console.log('User not found in Clerk, returning empty accounts')
        return NextResponse.json({ data: [] })
      }
      throw error
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database is available
    if (!prisma.bankAccount || typeof prisma.bankAccount.findMany !== 'function') {
      console.log('Database not configured, returning empty accounts')
      return NextResponse.json({ data: [] })
    }

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()

    // Build where clause - handle missing organizationId column gracefully
    const whereClause: any = { userId: user.id }
    
    // Only add organizationId filter if column exists (will be caught by try-catch if not)
    try {
      // Try to query with organizationId - if column doesn't exist, fall back to query without it
      const accounts = await prisma.bankAccount.findMany({
        where: orgId ? { 
          userId: user.id,
          organizationId: orgId, // Filter by organization
        } : { 
          userId: user.id,
        },
        orderBy: { updatedAt: 'desc' },
        include: {
          transactions: {
            orderBy: { date: 'desc' },
            take: 10, // Recent transactions
          },
        },
      })
      
      return NextResponse.json({
        data: accounts.map((acc) => ({
          id: acc.id,
          accountName: acc.accountName,
          bankName: acc.bankName || 'Manual Entry',
          accountType: acc.accountType,
          accountNumber: acc.accountNumber,
          currentBalance: acc.balance || 0,
          availableBalance: acc.balance || 0,
          currency: acc.currency || 'ZAR',
          status: acc.status,
          lastUpdated: acc.updatedAt.toISOString(),
          createdAt: acc.createdAt.toISOString(),
        })),
      })
    } catch (error: any) {
      // If organizationId column doesn't exist (P2022), query without it
      if (error?.code === 'P2022' && error?.meta?.column?.includes('organizationId')) {
        console.log('organizationId column not found, querying without organization filter')
        const accounts = await prisma.bankAccount.findMany({
          where: { userId: user.id },
          orderBy: { updatedAt: 'desc' },
          include: {
            transactions: {
              orderBy: { date: 'desc' },
              take: 10,
            },
          },
        })
        
        return NextResponse.json({
          data: accounts.map((acc) => ({
            id: acc.id,
            accountName: acc.accountName,
            bankName: acc.bankName || 'Manual Entry',
            accountType: acc.accountType,
            accountNumber: acc.accountNumber,
            currentBalance: acc.balance || 0,
            availableBalance: acc.balance || 0,
            currency: acc.currency || 'ZAR',
            status: acc.status,
            lastUpdated: acc.updatedAt.toISOString(),
            createdAt: acc.createdAt.toISOString(),
          })),
        })
      }
      throw error
    }

  } catch (error: any) {
    console.error('Error fetching accounts:', error)
    
    // Handle database connection errors
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database server.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()

    const body = await request.json()
    const {
      accountName,
      bankName,
      accountType,
      accountNumber,
      currentBalance,
      currency = 'ZAR',
    } = body

    if (!accountName || accountType === undefined || currentBalance === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: accountName, accountType, currentBalance' },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!prisma.bankAccount || typeof prisma.bankAccount.create !== 'function') {
      console.error('Database not configured - prisma.bankAccount.create is not available')
      return NextResponse.json(
        { error: 'Database not configured. Please check your DATABASE_URL environment variable.' },
        { status: 503 }
      )
    }

    // Normalize account type
    const normalizedAccountType = accountType === 'cheque' ? 'checking' : 
                                  accountType === 'credit_card' ? 'credit' : 
                                  accountType

    // Build account data - handle missing organizationId column gracefully
    const accountData: any = {
      userId: user.id,
      userType: 'client',
      accountName,
      bankName: bankName || 'Manual Entry',
      accountType: normalizedAccountType,
      accountNumber: accountNumber || undefined,
      balance: parseFloat(currentBalance) || 0,
      currency,
      status: 'connected',
    }
    
    // Only add organizationId if column exists (will be caught by try-catch if not)
    if (orgId) {
      accountData.organizationId = orgId
    }

    let account
    try {
      account = await prisma.bankAccount.create({
        data: accountData,
      })
    } catch (error: any) {
      // If organizationId column doesn't exist (P2022), create without it
      if (error?.code === 'P2022' && error?.meta?.column?.includes('organizationId')) {
        console.log('organizationId column not found, creating account without organizationId')
        delete accountData.organizationId
        account = await prisma.bankAccount.create({
          data: accountData,
        })
      } else {
        throw error
      }
    }

    return NextResponse.json({
      data: {
        id: account.id,
        accountName: account.accountName,
        bankName: account.bankName,
        accountType: account.accountType,
        accountNumber: account.accountNumber,
        currentBalance: account.balance || 0,
        availableBalance: account.balance || 0,
        currency: account.currency,
        status: account.status,
        lastUpdated: account.updatedAt.toISOString(),
        createdAt: account.createdAt.toISOString(),
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating account:', error)
    
    // Handle specific Prisma errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Account with this information already exists' },
        { status: 409 }
      )
    }
    
    if (error?.code === 'P2021' || error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 503 }
      )
    }
    
    // Check if it's a database not configured error
    if (error?.message?.includes('Database not configured') || 
        error?.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database not configured. Please run database migrations.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    // Verify account belongs to user and organization
    const existingAccount = await prisma.bankAccount.findFirst({
      where: { 
        id, 
        userId: user.id,
        organizationId: orgId || null, // Ensure organization match
      },
    })

    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const updateData: any = {}
    if (updates.accountName) updateData.accountName = updates.accountName
    if (updates.bankName) updateData.bankName = updates.bankName
    if (updates.accountType) {
      const normalizedType = updates.accountType === 'cheque' ? 'checking' : 
                            updates.accountType === 'credit_card' ? 'credit' : 
                            updates.accountType
      updateData.accountType = normalizedType
    }
    if (updates.accountNumber !== undefined) updateData.accountNumber = updates.accountNumber
    if (updates.currentBalance !== undefined) updateData.balance = parseFloat(updates.currentBalance) || 0
    if (updates.currency) updateData.currency = updates.currency
    // Update organizationId if provided
    if (orgId !== null) updateData.organizationId = orgId

    const account = await prisma.bankAccount.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      data: {
        id: account.id,
        accountName: account.accountName,
        bankName: account.bankName,
        accountType: account.accountType,
        accountNumber: account.accountNumber,
        currentBalance: account.balance || 0,
        availableBalance: account.balance || 0,
        currency: account.currency,
        status: account.status,
        lastUpdated: account.updatedAt.toISOString(),
        createdAt: account.createdAt.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update account' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    // Verify account belongs to user and organization
    const existingAccount = await prisma.bankAccount.findFirst({
      where: { 
        id, 
        userId: user.id,
        organizationId: orgId || null, // Ensure organization match
      },
    })

    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Delete account (transactions will be cascade deleted)
    await prisma.bankAccount.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    )
  }
}
