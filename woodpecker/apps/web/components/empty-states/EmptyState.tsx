'use client'

import * as React from 'react'
import { Card, CardContent } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon = 'lucide:inbox',
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const textSizes = {
    sm: {
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      title: 'text-lg',
      description: 'text-base',
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center justify-center py-12 px-4', className)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className={cn(
          'p-4 rounded-full bg-muted mb-4',
          iconSizes[size]
        )}
      >
        <Icon icon={icon} className={cn('text-muted-foreground', iconSizes[size])} />
      </motion.div>
      <h3 className={cn('font-semibold text-foreground mb-2', textSizes[size].title)}>
        {title}
      </h3>
      <p className={cn('text-muted-foreground text-center max-w-md mb-6', textSizes[size].description)}>
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} size={size === 'sm' ? 'sm' : 'default'}>
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}

interface EmptyStateCardProps extends EmptyStateProps {
  variant?: 'default' | 'bordered' | 'minimal'
}

export function EmptyStateCard(props: EmptyStateCardProps) {
  const { variant = 'default', ...emptyStateProps } = props

  const cardVariants = {
    default: 'border border-border/60',
    bordered: 'border-2 border-dashed border-border',
    minimal: 'border-0 bg-transparent',
  }

  return (
    <Card className={cardVariants[variant]}>
      <CardContent className="p-8">
        <EmptyState {...emptyStateProps} />
      </CardContent>
    </Card>
  )
}



