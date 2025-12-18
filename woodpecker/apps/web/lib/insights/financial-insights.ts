/**
 * Financial Insights Generator
 * Creates intelligent, actionable insights based on user's financial data
 */

export interface FinancialData {
  totalAssets: number
  totalLiabilities: number
  monthlyIncome: number
  monthlyExpenses: number
  accounts: Array<{
    id: string
    balance: number
    type: string
    lastUpdated: string
  }>
  transactions: Array<{
    id: string
    amount: number
    category: string
    date: string
  }>
}

export interface Insight {
  id: string
  type: 'tip' | 'warning' | 'achievement' | 'suggestion'
  title: string
  description: string
  action?: {
    label: string
    route: string
  }
  priority: 'high' | 'medium' | 'low'
  icon?: string
}

/**
 * Generate financial insights based on user data
 */
export function generateFinancialInsights(data: FinancialData): Insight[] {
  const insights: Insight[] = []
  const netWorth = data.totalAssets - data.totalLiabilities
  const savingsRate = data.monthlyIncome > 0 
    ? ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100 
    : 0

  // Emergency Fund Check
  const emergencyFundMonths = data.monthlyExpenses > 0
    ? (data.totalAssets / data.monthlyExpenses)
    : 0

  if (emergencyFundMonths < 3) {
    insights.push({
      id: 'emergency-fund-low',
      type: 'warning',
      title: 'Build Your Emergency Fund',
      description: `You have ${emergencyFundMonths.toFixed(1)} months of expenses saved. Aim for 3-6 months for better financial security.`,
      action: {
        label: 'Set Up Savings Goal',
        route: '/client/financial',
      },
      priority: 'high',
      icon: 'lucide:shield-alert',
    })
  } else if (emergencyFundMonths >= 6) {
    insights.push({
      id: 'emergency-fund-strong',
      type: 'achievement',
      title: 'Excellent Emergency Fund!',
      description: `You have ${emergencyFundMonths.toFixed(1)} months of expenses saved. You're well-prepared for unexpected events.`,
      priority: 'medium',
      icon: 'lucide:trophy',
    })
  }

  // Savings Rate Insights
  if (savingsRate < 10) {
    insights.push({
      id: 'savings-rate-low',
      type: 'warning',
      title: 'Low Savings Rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% for better financial growth.`,
      action: {
        label: 'Review Expenses',
        route: '/client/financial',
      },
      priority: 'high',
      icon: 'lucide:trending-down',
    })
  } else if (savingsRate >= 20) {
    insights.push({
      id: 'savings-rate-excellent',
      type: 'achievement',
      title: 'Great Savings Rate!',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income. This is excellent for building wealth.`,
      priority: 'medium',
      icon: 'lucide:trending-up',
    })
  }

  // Account Balance Warnings
  const lowBalanceAccounts = data.accounts.filter(acc => acc.balance < 100)
  if (lowBalanceAccounts.length > 0) {
    insights.push({
      id: 'low-balance-accounts',
      type: 'warning',
      title: 'Low Balance Alert',
      description: `${lowBalanceAccounts.length} account${lowBalanceAccounts.length > 1 ? 's have' : ' has'} a balance below $100. Consider reviewing your account balances.`,
      action: {
        label: 'View Accounts',
        route: '/client/financial',
      },
      priority: 'medium',
      icon: 'lucide:alert-circle',
    })
  }

  // Net Worth Growth
  if (netWorth > 0 && netWorth < 10000) {
    insights.push({
      id: 'net-worth-building',
      type: 'tip',
      title: 'Building Your Net Worth',
      description: `Your net worth is $${netWorth.toLocaleString()}. Keep building by increasing savings and reducing debt.`,
      action: {
        label: 'Track Progress',
        route: '/client/dashboard',
      },
      priority: 'low',
      icon: 'lucide:target',
    })
  }

  // Debt-to-Asset Ratio
  const debtRatio = data.totalAssets > 0
    ? (data.totalLiabilities / data.totalAssets) * 100
    : 0

  if (debtRatio > 50) {
    insights.push({
      id: 'high-debt-ratio',
      type: 'warning',
      title: 'High Debt-to-Asset Ratio',
      description: `Your debt is ${debtRatio.toFixed(1)}% of your assets. Consider a debt reduction strategy.`,
      action: {
        label: 'Plan Debt Payoff',
        route: '/client/financial',
      },
      priority: 'high',
      icon: 'lucide:credit-card',
    })
  }

  // Spending Patterns
  const recentTransactions = data.transactions
    .filter(t => {
      const date = new Date(t.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return date >= thirtyDaysAgo
    })

  const totalSpending = recentTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const avgDailySpending = totalSpending / 30

  if (avgDailySpending > data.monthlyIncome / 30) {
    insights.push({
      id: 'overspending',
      type: 'warning',
      title: 'Spending Above Income',
      description: `Your average daily spending is higher than your daily income. Review your expenses to avoid debt.`,
      action: {
        label: 'Analyze Spending',
        route: '/client/financial',
      },
      priority: 'high',
      icon: 'lucide:alert-octagon',
    })
  }

  // Positive Insights
  if (netWorth > 100000 && savingsRate > 15) {
    insights.push({
      id: 'financial-strength',
      type: 'achievement',
      title: 'Strong Financial Position',
      description: `With a net worth of $${netWorth.toLocaleString()} and ${savingsRate.toFixed(1)}% savings rate, you're in excellent financial shape!`,
      priority: 'low',
      icon: 'lucide:star',
    })
  }

  // Sort by priority
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  insights.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])

  return insights
}

/**
 * Get shareable insight message
 */
export function getShareableInsight(insight: Insight): string {
  return `${insight.title}: ${insight.description} - Track your finances with Woodpecker!`
}

