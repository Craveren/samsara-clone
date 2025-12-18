/**
 * Shared Page Header Component
 * Consistent header styling across pages
 */

'use client'

import * as React from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex items-start justify-between', className)}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
              <Icon icon={icon} className="h-5 w-5 text-foreground" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

