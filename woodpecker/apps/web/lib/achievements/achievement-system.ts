/**
 * Achievement System
 * Creates iconic, shareable moments for users
 */

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'financial' | 'savings' | 'debt' | 'milestone' | 'streak'
  unlockedAt?: Date
  shareable: boolean
  shareMessage?: string
}

export interface AchievementProgress {
  achievementId: string
  current: number
  target: number
  percentage: number
}

/**
 * Check and unlock achievements based on financial data
 */
export function checkAchievements(data: {
  totalAssets: number
  netWorth: number
  savingsRate: number
  emergencyFundMonths: number
  debtRatio: number
  accountsCount: number
  daysActive: number
  transactionsCount: number
}): Achievement[] {
  const achievements: Achievement[] = []

  // Net Worth Milestones
  if (data.netWorth >= 1000000) {
    achievements.push({
      id: 'millionaire',
      title: 'Millionaire Status',
      description: 'Reached R1,000,000 net worth!',
      icon: 'lucide:trophy',
      rarity: 'legendary',
      category: 'milestone',
      shareable: true,
      shareMessage: '🎉 I just reached R1,000,000 net worth! Track your finances with Woodpecker!',
    })
  } else if (data.netWorth >= 500000) {
    achievements.push({
      id: 'half-million',
      title: 'Half Millionaire',
      description: 'Reached R500,000 net worth!',
      icon: 'lucide:trending-up',
      rarity: 'epic',
      category: 'milestone',
      shareable: true,
    })
  } else if (data.netWorth >= 100000) {
    achievements.push({
      id: 'hundred-k',
      title: 'Hundred Thousand',
      description: 'Reached R100,000 net worth!',
      icon: 'lucide:target',
      rarity: 'rare',
      category: 'milestone',
      shareable: true,
    })
  } else if (data.netWorth >= 10000) {
    achievements.push({
      id: 'ten-k',
      title: 'Ten Thousand Club',
      description: 'Reached R10,000 net worth!',
      icon: 'lucide:check-circle',
      rarity: 'common',
      category: 'milestone',
      shareable: true,
    })
  }

  // Emergency Fund Achievements
  if (data.emergencyFundMonths >= 6) {
    achievements.push({
      id: 'emergency-fund-6',
      title: 'Emergency Fund Master',
      description: 'Built 6+ months of emergency fund!',
      icon: 'lucide:shield-check',
      rarity: 'epic',
      category: 'savings',
      shareable: true,
      shareMessage: '🛡️ I built a 6-month emergency fund! Financial security achieved!',
    })
  } else if (data.emergencyFundMonths >= 3) {
    achievements.push({
      id: 'emergency-fund-3',
      title: 'Emergency Fund Builder',
      description: 'Built 3+ months of emergency fund!',
      icon: 'lucide:shield',
      rarity: 'rare',
      category: 'savings',
      shareable: true,
    })
  }

  // Savings Rate Achievements
  if (data.savingsRate >= 50) {
    achievements.push({
      id: 'savings-rate-50',
      title: 'Savings Superstar',
      description: 'Saving 50%+ of income!',
      icon: 'lucide:star',
      rarity: 'legendary',
      category: 'savings',
      shareable: true,
      shareMessage: '⭐ I\'m saving 50%+ of my income! Financial freedom here I come!',
    })
  } else if (data.savingsRate >= 30) {
    achievements.push({
      id: 'savings-rate-30',
      title: 'Savings Champion',
      description: 'Saving 30%+ of income!',
      icon: 'lucide:award',
      rarity: 'epic',
      category: 'savings',
      shareable: true,
    })
  } else if (data.savingsRate >= 20) {
    achievements.push({
      id: 'savings-rate-20',
      title: 'Savings Expert',
      description: 'Saving 20%+ of income!',
      icon: 'lucide:trending-up',
      rarity: 'rare',
      category: 'savings',
      shareable: true,
    })
  }

  // Debt-Free Achievement
  if (data.debtRatio === 0 && data.netWorth > 0) {
    achievements.push({
      id: 'debt-free',
      title: 'Debt Free!',
      description: 'Achieved zero debt!',
      icon: 'lucide:check-circle-2',
      rarity: 'legendary',
      category: 'debt',
      shareable: true,
      shareMessage: '🎊 I\'m debt-free! Financial freedom achieved!',
    })
  }

  // Account Management
  if (data.accountsCount >= 10) {
    achievements.push({
      id: 'account-master',
      title: 'Account Master',
      description: 'Managing 10+ accounts!',
      icon: 'lucide:wallet',
      rarity: 'rare',
      category: 'financial',
      shareable: true,
    })
  } else if (data.accountsCount >= 5) {
    achievements.push({
      id: 'account-pro',
      title: 'Account Pro',
      description: 'Managing 5+ accounts!',
      icon: 'lucide:credit-card',
      rarity: 'common',
      category: 'financial',
      shareable: true,
    })
  }

  // Activity Achievements
  if (data.daysActive >= 365) {
    achievements.push({
      id: 'one-year',
      title: 'One Year Strong',
      description: 'Active for 365+ days!',
      icon: 'lucide:calendar',
      rarity: 'epic',
      category: 'streak',
      shareable: true,
      shareMessage: '📅 One year of tracking my finances with Woodpecker!',
    })
  } else if (data.daysActive >= 100) {
    achievements.push({
      id: 'hundred-days',
      title: '100 Day Streak',
      description: 'Active for 100+ days!',
      icon: 'lucide:flame',
      rarity: 'rare',
      category: 'streak',
      shareable: true,
    })
  } else if (data.daysActive >= 30) {
    achievements.push({
      id: 'thirty-days',
      title: '30 Day Streak',
      description: 'Active for 30+ days!',
      icon: 'lucide:zap',
      rarity: 'common',
      category: 'streak',
      shareable: true,
    })
  }

  // Transaction Tracking
  if (data.transactionsCount >= 1000) {
    achievements.push({
      id: 'transaction-master',
      title: 'Transaction Master',
      description: 'Tracked 1000+ transactions!',
      icon: 'lucide:list-checks',
      rarity: 'epic',
      category: 'financial',
      shareable: true,
    })
  }

  return achievements
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(
  achievementId: string,
  data: {
    totalAssets: number
    netWorth: number
    savingsRate: number
    emergencyFundMonths: number
    debtRatio: number
    accountsCount: number
    daysActive: number
    transactionsCount: number
  }
): AchievementProgress | null {
  const progressMap: Record<string, (d: typeof data) => AchievementProgress> = {
    millionaire: (d) => ({
      achievementId: 'millionaire',
      current: d.netWorth,
      target: 1000000,
      percentage: Math.min((d.netWorth / 1000000) * 100, 100),
    }),
    'emergency-fund-6': (d) => ({
      achievementId: 'emergency-fund-6',
      current: d.emergencyFundMonths,
      target: 6,
      percentage: Math.min((d.emergencyFundMonths / 6) * 100, 100),
    }),
    'savings-rate-50': (d) => ({
      achievementId: 'savings-rate-50',
      current: d.savingsRate,
      target: 50,
      percentage: Math.min((d.savingsRate / 50) * 100, 100),
    }),
  }

  const getProgress = progressMap[achievementId]
  return getProgress ? getProgress(data) : null
}

/**
 * Share achievement
 */
export async function shareAchievement(achievement: Achievement): Promise<boolean> {
  const message = achievement.shareMessage || 
    `${achievement.title}: ${achievement.description} - Track your finances with Woodpecker! 🪶`

  try {
    if (navigator.share) {
      await navigator.share({
        title: achievement.title,
        text: message,
        url: window.location.href,
      })
      return true
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(message)
      return true
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Share failed:', error)
    }
    return false
  }
}



