/**
 * Shared Page Layout Component
 * Provides consistent layout structure for all pages
 */

'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  showSidebar?: boolean
  header?: React.ReactNode
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

export function PageLayout({
  children,
  className,
  maxWidth = '7xl',
  showSidebar = true,
  header,
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {showSidebar && <RoleBasedSidebar />}
      <main className="flex-1 overflow-y-auto">
        {header && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/60"
          >
            {header}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'mx-auto px-4 sm:px-6 py-8 sm:py-12',
            maxWidthClasses[maxWidth],
            className
          )}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

