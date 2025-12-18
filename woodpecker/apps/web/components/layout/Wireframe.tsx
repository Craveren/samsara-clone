'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'

interface WireframeProps {
  children?: React.ReactNode
  title?: string
  description?: string
  variant?: 'default' | 'dashed' | 'dotted'
  className?: string
}

/**
 * Wireframe component for design mockups
 * Useful for prototyping and design reviews
 */
export function Wireframe({
  children,
  title,
  description,
  variant = 'dashed',
  className,
}: WireframeProps) {
  const variantClasses = {
    default: 'border-2 border-border',
    dashed: 'border-2 border-dashed border-muted-foreground/40',
    dotted: 'border-2 border-dotted border-muted-foreground/40',
  }

  return (
    <div
      className={cn(
        'rounded-lg p-6 bg-muted/20',
        variantClasses[variant],
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children || (
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          Wireframe Content Area
        </div>
      )}
    </div>
  )
}

// Wireframe templates are now in WireframeTemplates.tsx

