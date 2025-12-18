'use client'

import * as React from 'react'
import { Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  shareable?: boolean
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
  onShare?: (achievement: Achievement) => void
  className?: string
}

const rarityConfig = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    icon: 'text-gray-600 dark:text-gray-400',
  },
  rare: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  epic: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-700 dark:text-purple-300',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  legendary: {
    bg: 'bg-muted/40 dark:bg-muted/30',
    border: 'border-border/60 dark:border-border/50',
    text: 'text-foreground dark:text-foreground',
    icon: 'text-foreground/80 dark:text-foreground/80',
  },
}

const sizeConfig = {
  sm: {
    container: 'p-2',
    icon: 'w-4 h-4',
    text: 'text-xs',
  },
  md: {
    container: 'p-3',
    icon: 'w-5 h-5',
    text: 'text-sm',
  },
  lg: {
    container: 'p-4',
    icon: 'w-6 h-6',
    text: 'text-base',
  },
}

export function AchievementBadge({
  achievement,
  size = 'md',
  showDescription = false,
  onShare,
  className,
}: AchievementBadgeProps) {
  const config = rarityConfig[achievement.rarity]
  const sizeStyle = sizeConfig[size]
  const [isHovered, setIsHovered] = React.useState(false)

  const handleShare = () => {
    if (achievement.shareable && onShare) {
      onShare(achievement)
    }
  }

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative rounded-lg border-2 transition-all cursor-pointer',
        config.bg,
        config.border,
        sizeStyle.container,
        className
      )}
      onClick={handleShare}
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex-shrink-0', config.icon)}>
          <Icon icon={achievement.icon} className={cn(sizeStyle.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn('font-semibold truncate', config.text, sizeStyle.text)}>
            {achievement.title}
          </div>
          {showDescription && (
            <div className={cn('text-xs mt-1 line-clamp-2', config.text, 'opacity-80')}>
              {achievement.description}
            </div>
          )}
        </div>
        {achievement.shareable && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <Icon icon="lucide:share-2" className={cn('w-4 h-4', config.icon)} />
          </motion.div>
        )}
      </div>
      {achievement.unlockedAt && (
        <div className={cn('text-xs mt-2 opacity-60', config.text)}>
          Unlocked {achievement.unlockedAt.toLocaleDateString()}
        </div>
      )}
    </motion.div>
  )
}

interface AchievementGridProps {
  achievements: Achievement[]
  onShare?: (achievement: Achievement) => void
}

export function AchievementGrid({ achievements, onShare }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          showDescription
          onShare={onShare}
        />
      ))}
    </div>
  )
}

