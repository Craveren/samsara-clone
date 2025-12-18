'use client'

import * as React from 'react'
import { Card, CardContent } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

export interface StatItem {
  id: string
  label: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
    period?: string
  }
  icon?: string
  description?: string
  onClick?: () => void
  className?: string
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4 | 6
  variant?: 'default' | 'minimal' | 'elevated'
  className?: string
}

/**
 * Beautiful stats grid component with animations and trend indicators
 */
export function StatsGrid({
  stats,
  columns = 4,
  variant = 'default',
  className,
}: StatsGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  const variantClasses = {
    default: 'border border-border/60 hover:border-border/80',
    minimal: 'border-0 bg-transparent',
    elevated: 'border border-border/60 shadow-md hover:shadow-lg',
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'solar:arrow-up-bold'
      case 'down':
        return 'solar:arrow-down-bold'
      default:
        return 'solar:minus-bold'
    }
  }

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        'gap-4',
        className
      )}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            className={cn(
              'transition-all duration-200',
              variantClasses[variant],
              stat.onClick && 'cursor-pointer hover:scale-[1.02]',
              stat.className
            )}
            onClick={stat.onClick}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                </div>
                {stat.icon && (
                  <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40 flex-shrink-0 ml-3">
                    <Icon icon={stat.icon} className="h-5 w-5 text-foreground" />
                  </div>
                )}
              </div>

              {stat.change && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Icon
                    icon={getTrendIcon(stat.change.trend)}
                    className={cn('h-3.5 w-3.5', getTrendColor(stat.change.trend))}
                  />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      getTrendColor(stat.change.trend)
                    )}
                  >
                    {Math.abs(stat.change.value)}%
                  </span>
                  {stat.change.period && (
                    <span className="text-xs text-muted-foreground">
                      {stat.change.period}
                    </span>
                  )}
                </div>
              )}

              {stat.description && (
                <p className="text-[10px] text-muted-foreground mt-2 line-clamp-1">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}








