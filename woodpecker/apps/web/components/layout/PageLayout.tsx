'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface PageLayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
}

/**
 * Enhanced page layout with header, content, and optional sidebar/footer
 */
export function PageLayout({
  children,
  header,
  sidebar,
  footer,
  className,
  headerClassName,
  contentClassName,
}: PageLayoutProps) {
  return (
    <div className={cn('flex flex-col min-h-screen bg-background', className)}>
      {header && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
            headerClassName
          )}
        >
          {header}
        </motion.header>
      )}

      <div className="flex flex-1">
        {sidebar && (
          <aside className="hidden lg:block w-64 border-r border-border/40 bg-muted/30">
            {sidebar}
          </aside>
        )}

        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
            contentClassName
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {footer && (
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="border-t border-border/40 bg-muted/30"
        >
          {footer}
        </motion.footer>
      )}
    </div>
  )
}

