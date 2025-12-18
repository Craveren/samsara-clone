/**
 * Unified Dashboard Data Hook
 * Aggregates all dashboard data sources into a single hook
 * Reduces redundant fetching and provides consistent data flow
 */

import * as React from 'react'
import { useFinancialData } from './use-financial-data'
import { useActivityFeed } from './use-activity-feed'
import { useLocalStorage } from './use-local-storage'

export interface DashboardStats {
  stories: { completed: number; total: number; percentage: number }
  documents: { completed: number; total: number; percentage: number }
  family: { completed: number; total: number; percentage: number }
  tasks: { completed: number; total: number; percentage: number }
}

interface UseDashboardDataOptions {
  autoFetch?: boolean
  syncFinancialWithAPI?: boolean
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { autoFetch = true, syncFinancialWithAPI = false } = options

  // Financial data - ALWAYS use real API now
  const financial = useFinancialData({
    autoFetch,
    syncWithAPI: true, // Always use real database
  })

  // Activity feed
  const activities = useActivityFeed({
    limit: 10,
    autoFetch,
  })

  // Legacy stats - will be fetched from API
  const [legacyStats, setLegacyStats] = React.useState<DashboardStats>({
    stories: { completed: 0, total: 0, percentage: 0 },
    documents: { completed: 0, total: 0, percentage: 0 },
    family: { completed: 0, total: 0, percentage: 0 },
    tasks: { completed: 0, total: 0, percentage: 0 },
  })

  // Fetch legacy stats from API
  React.useEffect(() => {
    if (!autoFetch) return
    
    const fetchStats = async () => {
      try {
        const { useApi } = await import('./use-api')
        const { useToast } = await import('./use-toast')
        // This will be implemented when API route is ready
        // For now, stats remain at 0
      } catch (err) {
        console.error('Error fetching legacy stats:', err)
      }
    }
    fetchStats()
  }, [autoFetch])

  // Chart data derived from financial data - REACTIVE to account changes
  // This memo ensures charts update when accounts/transactions change
  const chartData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const monthKey = date.toISOString().slice(0, 7)
      
      // Calculate income and expenses from actual transactions
      const income = financial.transactions
        .filter(t => t.type === 'income' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      const expenses = financial.transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      // Use ACTUAL account balances - this will update when accounts are added/changed
      const baseValue = financial.metrics.totalBalance || 0
      
      // Calculate actual account type breakdowns from real accounts (REACTIVE)
      const savingsAccounts = financial.accounts.filter(a => a.accountType === 'savings' || a.accountType === 'investment')
      const savings = savingsAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0)
      
      const chequeAccounts = financial.accounts.filter(a => a.accountType === 'cheque')
      const cheque = chequeAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0)
      
      const creditAccounts = financial.accounts.filter(a => a.accountType === 'credit_card')
      const credit = creditAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0)
      
      // Check if this is the current month
      const isCurrentMonth = date.getMonth() === new Date().getMonth() && 
                             date.getFullYear() === new Date().getFullYear()
      
      // For current month, use ACTUAL values (no growth factor)
      // For historical months, show gradual growth from current total
      const monthsAgo = 5 - i
      const growthFactor = isCurrentMonth ? 1 : Math.max(0.7, 1 - (monthsAgo * 0.05))

      // Use consistent month formatting to prevent hydration errors
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return {
        month: months[date.getMonth()],
        total: Math.round(baseValue * growthFactor),
        savings: Math.round(savings * growthFactor),
        cheque: Math.round(cheque * growthFactor),
        credit: Math.round(credit * growthFactor),
        income,
        expenses,
        // Add actual account count for reactivity
        accountCount: financial.accounts.length,
        // Add timestamp for change detection
        timestamp: date.getTime(),
      }
    })
    return last6Months
  }, [
    financial.transactions.length, 
    financial.metrics.totalBalance, 
    financial.accounts.length,
    // Create a reactive key from all account data - ensures charts update when ANY account changes
    JSON.stringify(financial.accounts.map(a => ({
      id: a.id,
      balance: a.currentBalance || 0,
      type: a.accountType,
      updated: a.lastUpdated
    }))),
  ])

  // Combined loading state
  const isLoading = financial.isLoading || activities.isLoading

  // Refresh all data
  const refresh = React.useCallback(() => {
    financial.refresh()
    activities.refresh()
  }, [financial, activities])

  return {
    // Financial
    financial: {
      accounts: financial.accounts,
      transactions: financial.transactions,
      metrics: financial.metrics,
      isLoading: financial.isLoading,
      addAccount: financial.addAccount,
      updateAccount: financial.updateAccount,
      deleteAccount: financial.deleteAccount,
      addTransaction: financial.addTransaction,
    },
    
    // Activities
    activities: {
      items: activities.activities,
      isLoading: activities.isLoading,
      addActivity: activities.addActivity,
    },
    
    // Legacy
    legacy: {
      stats: legacyStats,
      setStats: setLegacyStats,
    },
    
    // Charts
    charts: {
      data: chartData,
    },
    
    // Combined
    isLoading,
    refresh,
  }
}

