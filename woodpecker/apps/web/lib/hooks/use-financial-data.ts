/**
 * Unified Financial Data Hook
 * Centralizes all financial data fetching and management
 * Uses REAL database API instead of localStorage
 */

import * as React from 'react'
import { useApi } from './use-api'
import { useToast } from './use-toast'

export interface BankAccount {
  id: string
  bankName: string
  accountNumber?: string
  accountType: 'cheque' | 'savings' | 'transmission' | 'credit_card' | 'investment' | 'retirement' | 'other'
  branchCode?: string
  accountHolder: string
  currentBalance: number
  availableBalance: number
  currency: string
  lastUpdated: string
  isActive: boolean
  isVerified: boolean
}

export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  accountId: string
  tags?: string[]
  notes?: string
}

export interface FinancialMetrics {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  financialHealth: number
  netWorth: number
}

interface UseFinancialDataOptions {
  autoFetch?: boolean
  syncWithAPI?: boolean
}

export function useFinancialData(options: UseFinancialDataOptions = {}) {
  const { autoFetch = true, syncWithAPI = true } = options
  const { toast } = useToast()
  const { request } = useApi()
  
  // State
  const [accounts, setAccounts] = React.useState<BankAccount[]>([])
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [lastSync, setLastSync] = React.useState<Date | null>(null)

  // Fetch accounts from API
  const fetchAccounts = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await request<{ data: BankAccount[] }>(
        '/api/financial/accounts',
        { method: 'GET' }
      )

      if (response?.data) {
        const formatted = response.data.map((acc: any) => ({
          id: acc.id,
          bankName: acc.bankName || 'Manual Entry',
          accountNumber: acc.accountNumber,
          accountType: acc.accountType === 'checking' ? 'cheque' : acc.accountType,
          branchCode: acc.branchCode,
          accountHolder: acc.accountName || 'Account Holder',
          currentBalance: acc.currentBalance || 0,
          availableBalance: acc.availableBalance || acc.currentBalance || 0,
          currency: acc.currency || 'ZAR',
          lastUpdated: acc.lastUpdated || new Date().toISOString(),
          isActive: true,
          isVerified: acc.status === 'connected',
        }))
        setAccounts(formatted)
        setLastSync(new Date())
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching accounts:', error)
      }
      toast.error('Error', 'Failed to fetch accounts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [request, toast])

  // Fetch transactions from API
  const fetchTransactions = React.useCallback(async () => {
    try {
      const response = await request<{ data: Transaction[] }>(
        '/api/financial/transactions?limit=1000',
        { method: 'GET' }
      )

      if (response?.data) {
        const formatted = response.data.map((txn: any) => ({
          id: txn.id,
          accountId: txn.accountId,
          date: txn.date,
          description: txn.description || 'Transaction',
          category: txn.category || 'other',
          amount: txn.amount,
          type: txn.type,
          tags: txn.tags || [],
          notes: txn.notes,
        }))
        setTransactions(formatted)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }, [request])

  // Calculate metrics
  const metrics = React.useMemo<FinancialMetrics>(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0)
    
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const monthlyIncome = transactions
      .filter(t => 
        t.type === 'income' && 
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const monthlyExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const savingsRate = monthlyIncome > 0 
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
      : 0
    
    const financialHealth = Math.min(100, Math.max(0, 50 + (savingsRate * 0.5)))

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      financialHealth,
      netWorth: totalBalance,
    }
  }, [
    accounts.length,
    accounts.map(a => `${a.id}-${a.currentBalance || 0}`).join(','),
    transactions.length,
    transactions.map(t => `${t.id}-${t.amount}`).join(','),
    lastSync?.getTime(), // Include lastSync to force recalculation on account changes
  ])

  // Add account - saves to database with optimistic update
  const addAccount = React.useCallback(async (account: Omit<BankAccount, 'id' | 'lastUpdated' | 'isActive' | 'isVerified'>) => {
    // Optimistic update - create temporary account
    const tempId = `temp-${Date.now()}`
    const optimisticAccount: BankAccount = {
      ...account,
      id: tempId,
      lastUpdated: new Date().toISOString(),
      isActive: true,
      isVerified: false, // Mark as unverified until confirmed
    }

    // Update state immediately for instant UI feedback
    // Use functional update to ensure we get the latest state
    setAccounts(prev => {
      // Check if account already exists to avoid duplicates
      const exists = prev.some(acc => acc.id === tempId || 
        (acc.bankName === account.bankName && acc.accountNumber === account.accountNumber))
      if (exists) return prev
      return [...prev, optimisticAccount]
    })
    setLastSync(new Date())

    try {
      const response = await request<{ data: BankAccount }>(
        '/api/financial/accounts',
        {
          method: 'POST',
          body: JSON.stringify({
            accountName: account.accountHolder || account.bankName,
            bankName: account.bankName,
            accountType: account.accountType,
            accountNumber: account.accountNumber,
            currentBalance: account.currentBalance,
            currency: account.currency || 'ZAR',
          }),
        }
      )

      if (response?.data) {
        const newAccount: BankAccount = {
          ...response.data,
          accountHolder: response.data.accountName || 'Account Holder',
          isActive: true,
          isVerified: true,
        }
        // Replace optimistic account with real one
        setAccounts(prev => {
          const filtered = prev.filter(acc => acc.id !== tempId)
          // Check if account already exists to avoid duplicates
          const exists = filtered.some(acc => acc.id === newAccount.id || 
            (acc.bankName === newAccount.bankName && acc.accountNumber === newAccount.accountNumber))
          if (exists) return filtered
          return [...filtered, newAccount]
        })
        const newSyncTime = new Date()
        setLastSync(newSyncTime)
        // Force metrics recalculation by updating lastSync timestamp
        // The metrics memo will recalculate because lastSync is in its dependency array
        toast.success('Account Added', 'Bank account has been saved to database')
        return newAccount
      }
      throw new Error('Failed to create account')
    } catch (error: any) {
      // Rollback optimistic update on error
      setAccounts(prev => prev.filter(acc => acc.id !== tempId))
      console.error('Error adding account:', error)
      toast.error('Error', error.message || 'Failed to add account')
      throw error
    }
  }, [request, toast])

  // Update account - saves to database with optimistic update
  const updateAccount = React.useCallback(async (accountId: string, updates: Partial<BankAccount>) => {
    // Store previous state for rollback
    const previousAccount = accounts.find(acc => acc.id === accountId)
    if (!previousAccount) {
      throw new Error('Account not found')
    }

    // Optimistic update
    const optimisticAccount: BankAccount = {
      ...previousAccount,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    setAccounts(prev => prev.map(acc => acc.id === accountId ? optimisticAccount : acc))
    setLastSync(new Date())

    try {
      const response = await request<{ data: BankAccount }>(
        '/api/financial/accounts',
        {
          method: 'PUT',
          body: JSON.stringify({
            id: accountId,
            accountName: updates.accountHolder || updates.bankName,
            bankName: updates.bankName,
            accountType: updates.accountType,
            accountNumber: updates.accountNumber,
            currentBalance: updates.currentBalance,
            currency: updates.currency,
          }),
        }
      )

      if (response?.data) {
        const updatedAccount: BankAccount = {
          ...response.data,
          accountHolder: response.data.accountName || 'Account Holder',
          isActive: true,
          isVerified: true,
        }
        setAccounts(prev => prev.map(acc => acc.id === accountId ? updatedAccount : acc))
        setLastSync(new Date())
        toast.success('Account Updated', 'Bank account has been updated in database')
      }
    } catch (error: any) {
      // Rollback on error
      if (previousAccount) {
        setAccounts(prev => prev.map(acc => acc.id === accountId ? previousAccount : acc))
      }
      console.error('Error updating account:', error)
      toast.error('Error', error.message || 'Failed to update account')
      throw error
    }
  }, [request, toast, accounts])

  // Delete account - removes from database with optimistic update
  const deleteAccount = React.useCallback(async (accountId: string) => {
    // Store previous state for rollback
    const previousAccount = accounts.find(acc => acc.id === accountId)
    const previousTransactions = transactions.filter(txn => txn.accountId === accountId)

    // Optimistic update
    setAccounts(prev => prev.filter(acc => acc.id !== accountId))
    setTransactions(prev => prev.filter(txn => txn.accountId !== accountId))
    setLastSync(new Date())

    try {
      await request(
        `/api/financial/accounts?id=${accountId}`,
        { method: 'DELETE' }
      )

      toast.success('Account Removed', 'Bank account has been deleted from database')
    } catch (error: any) {
      // Rollback on error
      if (previousAccount) {
        setAccounts(prev => [...prev, previousAccount])
        setTransactions(prev => [...prev, ...previousTransactions])
      }
      console.error('Error deleting account:', error)
      toast.error('Error', error.message || 'Failed to delete account')
      throw error
    }
  }, [request, toast, accounts, transactions])

  // Add transaction - saves to database
  const addTransaction = React.useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await request<{ data: Transaction }>(
        '/api/financial/transactions',
        {
          method: 'POST',
          body: JSON.stringify({
            accountId: transaction.accountId,
            date: transaction.date,
            description: transaction.description,
            category: transaction.category || 'other',
            amount: transaction.amount,
            type: transaction.type,
            tags: transaction.tags || [],
            notes: transaction.notes,
          }),
        }
      )

      if (response?.data) {
        setTransactions(prev => [...prev, response.data!])
        // Refresh accounts to get updated balances
        await fetchAccounts()
        toast.success('Transaction Added', 'Transaction has been saved to database')
        return response.data
      }
      throw new Error('Failed to create transaction')
    } catch (error: any) {
      console.error('Error adding transaction:', error)
      toast.error('Error', error.message || 'Failed to add transaction')
      throw error
    }
  }, [request, toast, fetchAccounts])

  // Refresh all data
  const refresh = React.useCallback(async () => {
    await Promise.all([fetchAccounts(), fetchTransactions()])
  }, [fetchAccounts, fetchTransactions])

  // Auto-fetch on mount if enabled
  React.useEffect(() => {
    if (autoFetch && syncWithAPI) {
      refresh()
    }
  }, [autoFetch, syncWithAPI, refresh])

  return {
    // Data
    accounts,
    manualAccounts: accounts, // For backward compatibility
    apiAccounts: accounts, // For backward compatibility
    transactions,
    metrics,
    
    // State
    isLoading,
    lastSync,
    
    // Actions
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    fetchApiAccounts: fetchAccounts, // For backward compatibility
    refresh,
    
    // Helpers
    getAccountById: (id: string) => accounts.find(a => a.id === id),
    getTransactionsByAccount: (accountId: string) => transactions.filter(t => t.accountId === accountId),
    getTransactionsByDateRange: (start: Date, end: Date) =>
      transactions.filter(t => {
        const date = new Date(t.date)
        return date >= start && date <= end
      }),
  }
}
