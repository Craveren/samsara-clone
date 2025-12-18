'use client'

import * as React from 'react'
import { Button } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  // noop for diff

  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Beautiful empty state component for when there's no content
 */
export function EmptyState({
  icon = 'solar:document-text-bold-duotone',
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg',
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full bg-muted/50 p-4 mb-4',
          sizeClasses[size].icon
        )}
      >
        <Icon
          icon={icon}
          className={cn('text-muted-foreground', sizeClasses[size].icon)}
        />
      </div>

      <h3
        className={cn(
          'font-semibold text-foreground mb-2',
          sizeClasses[size].title
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'text-muted-foreground max-w-md mb-6',
            sizeClasses[size].description
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}








