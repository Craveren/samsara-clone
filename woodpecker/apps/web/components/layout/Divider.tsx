'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

/**
 * Divider component for visual separation
 */
export function Divider({
  orientation = 'horizontal',
  spacing = 'md',
  label,
  className,
}: DividerProps) {
  const spacingClasses = {
    none: '',
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px bg-border/60',
          spacingClasses[spacing],
          className
        )}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div
        className={cn(
          'flex items-center',
          spacingClasses[spacing],
          className
        )}
      >
        <div className="flex-1 border-t border-border/60" />
        <span className="px-4 text-sm text-muted-foreground">{label}</span>
        <div className="flex-1 border-t border-border/60" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'border-t border-border/60',
        spacingClasses[spacing],
        className
      )}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}








