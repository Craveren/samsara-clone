'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface SectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  titleClassName?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'muted' | 'bordered'
}

/**
 * Section component for organizing page content
 */
export function Section({
  children,
  title,
  description,
  action,
  className,
  titleClassName,
  spacing = 'md',
  variant = 'default',
}: SectionProps) {
  const spacingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12',
  }

  const variantClasses = {
    default: '',
    muted: 'bg-muted/30 rounded-lg',
    bordered: 'border border-border/40 rounded-lg bg-card',
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        spacingClasses[spacing],
        variantClasses[variant],
        variant === 'bordered' && 'p-6',
        className
      )}
    >
      {(title || description || action) && (
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {title && (
              <h2
                className={cn(
                  'text-2xl font-bold text-foreground mb-2',
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
      {children}
    </motion.section>
  )
}

