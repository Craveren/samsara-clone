'use client'

import * as React from 'react'
import { Button } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

interface EnhancedPageHeaderProps {
  title: string
  description?: string
  icon?: string
  action?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  badge?: React.ReactNode
  className?: string
}

/**
 * Enhanced page header with breadcrumbs, actions, and better visual hierarchy
 */
export function EnhancedPageHeader({
  title,
  description,
  icon,
  action,
  breadcrumbs,
  badge,
  className,
}: EnhancedPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('mb-6 sm:mb-8', className)}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Icon icon="solar:alt-arrow-right-linear" className="h-4 w-4" />
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {icon && (
            <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40 flex-shrink-0">
              <Icon icon={icon} className="h-6 w-6 text-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                {title}
              </h1>
              {badge && <div className="flex-shrink-0">{badge}</div>}
            </div>
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  )
}

