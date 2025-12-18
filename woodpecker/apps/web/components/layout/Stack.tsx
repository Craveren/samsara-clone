'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'

interface StackProps {
  children: React.ReactNode
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  className?: string
  wrap?: boolean
}

/**
 * Stack component for vertical or horizontal layouts with consistent spacing
 */
export function Stack({
  children,
  spacing = 'md',
  direction = 'column',
  align = 'stretch',
  justify = 'start',
  className,
  wrap = false,
}: StackProps) {
  const spacingClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  return (
    <div
      className={cn(
        'flex',
        direction === 'column' ? 'flex-col' : 'flex-row',
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  )
}








