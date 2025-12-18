/**
 * API Route: Transactions CRUD
 * GET /api/financial/transactions - Get transactions
 * POST /api/financial/transactions - Create transaction
 * PUT /api/financial/transactions - Update transaction
 * DELETE /api/financial/transactions - Delete transaction
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
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
        console.log('User not found in Clerk, returning empty transactions')
        return NextResponse.json({ data: [] })
      }
      throw error
    }
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database is available
    if (!prisma.bankAccount || typeof prisma.bankAccount.findMany !== 'function') {
      console.log('Database not configured, returning empty transactions')
      return NextResponse.json({ data: [] })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()

    // Get user's accounts first - handle missing organizationId column gracefully
    let accounts
    try {
      accounts = await prisma.bankAccount.findMany({
        where: orgId ? { 
          userId: user.id,
          organizationId: orgId, // Filter by organization
        } : { 
          userId: user.id,
        },
      })
    } catch (error: any) {
      // If organizationId column doesn't exist (P2022), query without it
      if (error?.code === 'P2022' && error?.meta?.column?.includes('organizationId')) {
        console.log('organizationId column not found, querying without organization filter')
        accounts = await prisma.bankAccount.findMany({
          where: { userId: user.id },
        })
      } else {
        throw error
      }
    }

    if (accounts.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // SECURITY: Validate accountId belongs to user
    const accountIds = accountId
      ? accounts.map(acc => acc.id).includes(accountId) ? [accountId] : []
      : accounts.map(acc => acc.id)

    if (accountIds.length === 0 && accountId) {
      return NextResponse.json({ data: [] })
    }

    const where: any = {
      accountId: { in: accountIds },
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        account: {
          select: {
            accountName: true,
            accountType: true,
            bankName: true,
          },
        },
      },
    })

    return NextResponse.json({
      data: transactions.map(txn => ({
        id: txn.id,
        accountId: txn.accountId,
        date: txn.date.toISOString(),
        description: txn.description || txn.merchant || 'Transaction',
        category: txn.category || 'other',
        amount: txn.amount,
        type: txn.type,
        tags: txn.tags || [],
        notes: txn.notes,
        source: txn.source,
        account: txn.account,
      })),
    })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    
    // Handle database connection errors
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database server.' },
        { status: 503 }
      )
    }
    
    // Handle missing column errors
    if (error?.code === 'P2022') {
      return NextResponse.json(
        { error: 'Database schema out of sync. Please run: npx prisma db push' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
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

    const body = await request.json()
    const {
      accountId,
      date,
      description,
      category = 'other',
      amount,
      type,
      tags = [],
      notes,
    } = body

    if (!accountId || !date || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: accountId, date, amount, type' },
        { status: 400 }
      )
    }

    // Get organization context for multi-tenancy
    const { orgId } = await getOrganizationContext()

    // Verify account belongs to user - handle missing organizationId column gracefully
    let account
    try {
      account = await prisma.bankAccount.findFirst({
        where: orgId ? { 
          id: accountId, 
          userId: user.id,
          organizationId: orgId, // Ensure organization match
        } : {
          id: accountId,
          userId: user.id,
        },
      })
    } catch (error: any) {
      // If organizationId column doesn't exist (P2022), query without it
      if (error?.code === 'P2022' && error?.meta?.column?.includes('organizationId')) {
        console.log('organizationId column not found, querying without organization filter')
        account = await prisma.bankAccount.findFirst({
          where: { 
            id: accountId, 
            userId: user.id,
          },
        })
      } else {
        throw error
      }
    }

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Create transaction and update balance atomically
    const balanceChange = type === 'income' ? parseFloat(amount) : -parseFloat(amount)
    
    const transaction = await prisma.$transaction(async (tx) => {
      const txn = await tx.transaction.create({
        data: {
          accountId,
          date: new Date(date),
          description: description || 'Transaction',
          category,
          amount: parseFloat(amount),
          type: type === 'income' ? 'income' : type === 'expense' ? 'expense' : 'transfer',
          tags: Array.isArray(tags) ? tags : [],
          notes: notes || undefined,
          source: 'manual',
          currency: account.currency || 'ZAR',
        },
      })

      await tx.bankAccount.update({
        where: { id: accountId },
        data: {
          balance: { increment: balanceChange },
        },
      })

      return txn
    })

    return NextResponse.json({
      data: {
        id: transaction.id,
        accountId: transaction.accountId,
        date: transaction.date.toISOString(),
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        tags: transaction.tags,
        notes: transaction.notes,
        source: transaction.source,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating transaction:', error)
    
    // Handle specific Prisma errors
    if (error?.code === 'P2021' || error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 503 }
      )
    }
    
    if (error?.message?.includes('Database not configured') || 
        error?.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database not configured. Please run database migrations.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
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

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Verify transaction belongs to user's account
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    })

    if (!existingTransaction || existingTransaction.account.userId !== user.id) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Calculate balance adjustment if amount or type changed
    const needsBalanceUpdate = updates.amount !== undefined || updates.type
    
    let balanceAdjustment = 0
    if (needsBalanceUpdate) {
      const oldBalanceImpact = existingTransaction.type === 'income' 
        ? existingTransaction.amount 
        : existingTransaction.type === 'expense'
        ? -existingTransaction.amount
        : 0 // transfer type doesn't affect balance
      
      const newAmount = updates.amount !== undefined ? parseFloat(updates.amount) : existingTransaction.amount
      const newType = updates.type || existingTransaction.type
      const newBalanceImpact = newType === 'income' 
        ? newAmount 
        : newType === 'expense'
        ? -newAmount
        : 0
      
      balanceAdjustment = newBalanceImpact - oldBalanceImpact
    }

    const updateData: any = {}
    if (updates.date) updateData.date = new Date(updates.date)
    if (updates.description) updateData.description = updates.description
    if (updates.category) updateData.category = updates.category
    if (updates.amount !== undefined) updateData.amount = parseFloat(updates.amount)
    if (updates.type) updateData.type = updates.type
    if (updates.tags) updateData.tags = Array.isArray(updates.tags) ? updates.tags : []
    if (updates.notes !== undefined) updateData.notes = updates.notes

    // Update transaction and balance atomically
    const transaction = await prisma.$transaction(async (tx) => {
      const txn = await tx.transaction.update({
        where: { id },
        data: updateData,
      })

      if (balanceAdjustment !== 0) {
        await tx.bankAccount.update({
          where: { id: existingTransaction.accountId },
          data: {
            balance: { increment: balanceAdjustment },
          },
        })
      }

      return txn
    })

    return NextResponse.json({
      data: {
        id: transaction.id,
        accountId: transaction.accountId,
        date: transaction.date.toISOString(),
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        type: transaction.type,
        tags: transaction.tags,
        notes: transaction.notes,
        source: transaction.source,
      },
    })
  } catch (error: unknown) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Verify transaction belongs to user's account
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    })

    if (!existingTransaction || existingTransaction.account.userId !== user.id) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Delete transaction and reverse balance atomically
    const account = existingTransaction.account
    let balanceChange = 0
    if (existingTransaction.type === 'income') {
      balanceChange = -existingTransaction.amount
    } else if (existingTransaction.type === 'expense') {
      balanceChange = existingTransaction.amount
    }
    // Note: 'transfer' type doesn't affect balance

    await prisma.$transaction(async (tx) => {
      if (balanceChange !== 0) {
        await tx.bankAccount.update({
          where: { id: account.id },
          data: {
            balance: { increment: balanceChange },
          },
        })
      }

      await tx.transaction.delete({
        where: { id },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
