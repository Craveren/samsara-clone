'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface TwoColumnLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
  leftWidth?: 'narrow' | 'medium' | 'wide' | 'auto'
  rightWidth?: 'narrow' | 'medium' | 'wide' | 'auto'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  reverseOnMobile?: boolean
  className?: string
  leftClassName?: string
  rightClassName?: string
}

/**
 * Two-column layout with flexible widths and responsive behavior
 */
export function TwoColumnLayout({
  left,
  right,
  leftWidth = 'medium',
  rightWidth = 'medium',
  gap = 'md',
  reverseOnMobile = false,
  className,
  leftClassName,
  rightClassName,
}: TwoColumnLayoutProps) {
  const widthClasses = {
    narrow: 'lg:w-1/4',
    medium: 'lg:w-1/3',
    wide: 'lg:w-2/3',
    auto: 'lg:w-auto',
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }

  const orderClasses = reverseOnMobile
    ? 'flex-col-reverse lg:flex-row'
    : 'flex-col lg:flex-row'

  return (
    <div
      className={cn(
        'flex',
        orderClasses,
        gapClasses[gap],
        className
      )}
    >
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'w-full',
          leftWidth !== 'auto' && widthClasses[leftWidth],
          leftClassName
        )}
      >
        {left}
      </motion.aside>

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={cn(
          'w-full flex-1',
          rightWidth !== 'auto' && widthClasses[rightWidth],
          rightClassName
        )}
      >
        {right}
      </motion.main>
    </div>
  )
}








