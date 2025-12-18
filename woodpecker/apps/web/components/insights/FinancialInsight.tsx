'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

export interface FinancialInsight {
  id: string
  type: 'tip' | 'warning' | 'achievement' | 'suggestion'
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: string
  priority?: 'high' | 'medium' | 'low'
}

interface FinancialInsightProps {
  insight: FinancialInsight
  onDismiss?: (id: string) => void
  className?: string
}

const insightConfig = {
  tip: {
    icon: 'lucide:lightbulb',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  warning: {
    icon: 'lucide:alert-triangle',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/30 dark:bg-muted/20',
    borderColor: 'border-border/60 dark:border-border/40',
  },
  achievement: {
    icon: 'lucide:trophy',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  suggestion: {
    icon: 'lucide:sparkles',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
}

export function FinancialInsightCard({ insight, onDismiss, className }: FinancialInsightProps) {
  const config = insightConfig[insight.type]
  const [isVisible, setIsVisible] = React.useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.(insight.id)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        'relative overflow-hidden border-2',
        config.borderColor,
        config.bgColor,
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn('p-2 rounded-lg', config.bgColor)}>
                <Icon 
                  icon={insight.icon || config.icon} 
                  className={cn('w-5 h-5', config.color)} 
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base font-semibold">
                  {insight.title}
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  {insight.description}
                </CardDescription>
              </div>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        {insight.action && (
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={insight.action.onClick}
              className="w-full"
            >
              {insight.action.label}
            </Button>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}

interface FinancialInsightsListProps {
  insights: FinancialInsight[]
  onDismiss?: (id: string) => void
  maxVisible?: number
}

export function FinancialInsightsList({ 
  insights, 
  onDismiss, 
  maxVisible = 5 
}: FinancialInsightsListProps) {
  const [dismissedIds, setDismissedIds] = React.useState<Set<string>>(new Set())
  
  const visibleInsights = insights.filter(
    insight => !dismissedIds.has(insight.id)
  ).slice(0, maxVisible)

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]))
    onDismiss?.(id)
  }

  if (visibleInsights.length === 0) return null

  return (
    <div className="space-y-3">
      {visibleInsights.map((insight) => (
        <FinancialInsightCard
          key={insight.id}
          insight={insight}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  )
}

