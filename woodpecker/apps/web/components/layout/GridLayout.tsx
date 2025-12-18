'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'

interface GridLayoutProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  responsive?: boolean
}

/**
 * Responsive grid layout component
 * Automatically adjusts columns based on screen size
 */
export function GridLayout({
  children,
  columns = 3,
  gap = 'md',
  className,
  responsive = true,
}: GridLayoutProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12',
  }

  return (
    <div
      className={cn(
        'grid',
        responsive ? columnClasses[columns] : `grid-cols-${columns}`,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

