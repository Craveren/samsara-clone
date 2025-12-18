'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface PageContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animate?: boolean
}

/**
 * Page container with consistent max-width and padding
 */
export function PageContainer({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className,
  animate = true,
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-6 sm:px-8',
    xl: 'px-8 sm:px-12',
  }

  const content = (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}








