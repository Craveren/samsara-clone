'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  showSidebar?: boolean
}

/**
 * Main application layout component
 * Provides consistent structure across all pages
 */
export function AppLayout({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
  showSidebar = true,
}: AppLayoutProps) {
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
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {showSidebar && <RoleBasedSidebar />}
      <main
        className={cn(
          'flex-1 overflow-y-auto',
          'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'mx-auto w-full',
            maxWidthClasses[maxWidth],
            paddingClasses[padding],
            'py-6 sm:py-8'
          )}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

