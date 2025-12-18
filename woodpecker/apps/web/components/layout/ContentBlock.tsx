'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface ContentBlockProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'card' | 'bordered' | 'muted'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  animate?: boolean
}

/**
 * Content block component for organizing related content
 */
export function ContentBlock({
  children,
  title,
  subtitle,
  header,
  footer,
  variant = 'default',
  spacing = 'md',
  className,
  animate = true,
}: ContentBlockProps) {
  const variantClasses = {
    default: '',
    card: 'bg-card border border-border/60 rounded-lg',
    bordered: 'border border-border/40 rounded-lg',
    muted: 'bg-muted/30 rounded-lg',
  }

  const spacingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const content = (
    <>
      {(title || subtitle || header) && (
        <div className="mb-6">
          {header || (
            <>
              {title && (
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </>
          )}
        </div>
      )}

      <div>{children}</div>

      {footer && <div className="mt-6">{footer}</div>}
    </>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          variantClasses[variant],
          spacingClasses[spacing],
          className
        )}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        spacingClasses[spacing],
        className
      )}
    >
      {content}
    </div>
  )
}








