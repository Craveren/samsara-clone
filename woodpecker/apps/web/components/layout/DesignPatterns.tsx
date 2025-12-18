'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

/**
 * Common design patterns for consistent UI
 */

/**
 * Feature Card Pattern
 */
interface FeatureCardProps {
  icon: string
  title: string
  description: string
  badge?: string
  onClick?: () => void
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  onClick,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('cursor-pointer', className)}
      onClick={onClick}
    >
      <Card className="h-full border border-border/60 hover:border-border/80 transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="h-12 w-12 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40">
              <Icon icon={icon} className="h-6 w-6 text-foreground" />
            </div>
            {badge && (
              <Badge variant="outline" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <CardTitle className="mt-4 text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Metric Card Pattern
 */
interface MetricCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  className,
}: MetricCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card className={cn('border border-border/60', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <Icon
                  icon={
                    trend.direction === 'up'
                      ? 'solar:arrow-up-bold'
                      : trend.direction === 'down'
                      ? 'solar:arrow-down-bold'
                      : 'solar:minus-bold'
                  }
                  className={cn('h-3.5 w-3.5', trendColors[trend.direction])}
                />
                <span
                  className={cn('text-xs font-medium', trendColors[trend.direction])}
                >
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40">
              <Icon icon={icon} className="h-5 w-5 text-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Action Card Pattern
 */
interface ActionCardProps {
  title: string
  description?: string
  icon?: string
  action: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  className?: string
}

export function ActionCard({
  title,
  description,
  icon,
  action,
  className,
}: ActionCardProps) {
  return (
    <Card className={cn('border border-border/60 hover:border-border/80 transition-all', className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          {icon && (
            <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40 flex-shrink-0">
              <Icon icon={icon} className="h-5 w-5 text-foreground" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="w-full"
        >
          {action.label}
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * List Item Pattern
 */
interface ListItemProps {
  title: string
  subtitle?: string
  description?: string
  icon?: string
  badge?: React.ReactNode
  action?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ListItem({
  title,
  subtitle,
  description,
  icon,
  badge,
  action,
  onClick,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border border-border/60 hover:border-border/80 transition-all',
        onClick && 'cursor-pointer hover:bg-muted/30',
        className
      )}
      onClick={onClick}
    >
      {icon && (
        <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40 flex-shrink-0">
          <Icon icon={icon} className="h-5 w-5 text-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {title}
          </h4>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

/**
 * Status Badge Pattern
 */
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  label: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const statusClasses = {
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    neutral: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        statusClasses[status],
        className
      )}
    >
      {label}
    </span>
  )
}








