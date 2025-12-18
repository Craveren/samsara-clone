'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { AchievementGrid, AchievementBadge } from './AchievementBadge'
import { checkAchievements, shareAchievement, type Achievement } from '@/lib/achievements/achievement-system'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface AchievementPanelProps {
  financialData: {
    totalAssets: number
    netWorth: number
    savingsRate: number
    emergencyFundMonths: number
    debtRatio: number
    accountsCount: number
    daysActive: number
    transactionsCount: number
  }
  className?: string
}

export function AchievementPanel({ financialData, className }: AchievementPanelProps) {
  const { toast } = useToast()
  const [unlockedAchievements, setUnlockedAchievements] = React.useState<Achievement[]>([])
  const [recentUnlock, setRecentUnlock] = React.useState<Achievement | null>(null)

  React.useEffect(() => {
    // Check for new achievements
    const newAchievements = checkAchievements(financialData)
    
    // Load previously unlocked achievements
    const stored = localStorage.getItem('unlocked-achievements')
    const previousIds = stored ? JSON.parse(stored) : []
    
    // Find newly unlocked achievements
    const newlyUnlocked = newAchievements.filter(
      ach => !previousIds.includes(ach.id)
    )

    if (newlyUnlocked.length > 0) {
      // Store new achievements
      const allIds = [...previousIds, ...newlyUnlocked.map(a => a.id)]
      localStorage.setItem('unlocked-achievements', JSON.stringify(allIds))
      
      // Mark as unlocked
      newlyUnlocked.forEach(ach => {
        ach.unlockedAt = new Date()
      })
      
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked])
      
      // Show notification for first new achievement
      if (newlyUnlocked[0]) {
        setRecentUnlock(newlyUnlocked[0])
        toast.success('Achievement Unlocked!', newlyUnlocked[0].title)
      }
    }

    // Load all unlocked achievements
    const allUnlocked = newAchievements
      .filter(ach => previousIds.includes(ach.id))
      .map(ach => ({
        ...ach,
        unlockedAt: new Date(), // In real app, load from storage
      }))
    
    setUnlockedAchievements(allUnlocked)
  }, [financialData, toast])

  const handleShare = async (achievement: Achievement) => {
    const shared = await shareAchievement(achievement)
    if (shared) {
      toast.success('Shared!', 'Achievement shared successfully')
    } else {
      toast.error('Failed to share')
    }
  }

  if (unlockedAchievements.length === 0) {
    return null
  }

  return (
    <>
      {/* Recent Achievement Notification */}
      <AnimatePresence>
        {recentUnlock && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <Card className="border-2 border-foreground/30 shadow-2xl bg-background/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-foreground/10 border border-foreground/20 flex-shrink-0">
                    <Icon 
                      icon={recentUnlock.icon} 
                      className="w-8 h-8 text-foreground" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-bold text-lg text-foreground">{recentUnlock.title}</h4>
                      <Icon 
                        icon="solar:star-bold-duotone" 
                        className="w-5 h-5 text-foreground flex-shrink-0" 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {recentUnlock.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => {
                          shareAchievement(recentUnlock)
                          setRecentUnlock(null)
                        }}
                        className="flex-1 min-w-[100px] bg-foreground text-background hover:bg-foreground/90"
                      >
                        <Icon icon="solar:share-bold-duotone" className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRecentUnlock(null)}
                        className="flex-1 min-w-[100px] border-border/60 hover:bg-foreground/5"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Panel */}
      <Card className={cn('border border-border/60', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Icon icon="lucide:trophy" className="h-4 w-4" />
                Achievements
              </CardTitle>
              <CardDescription>
                {unlockedAchievements.length} achievement{unlockedAchievements.length !== 1 ? 's' : ''} unlocked
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Scroll to achievements section
                const element = document.getElementById('achievements-section')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Icon icon="lucide:arrow-down" className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlockedAchievements.slice(0, 6).map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="sm"
                onShare={() => handleShare(achievement)}
              />
            ))}
          </div>
          {unlockedAchievements.length > 6 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => {
                // Navigate to full achievements page
                window.location.href = '/client/achievements'
              }}
            >
              View All {unlockedAchievements.length} Achievements
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  )
}

