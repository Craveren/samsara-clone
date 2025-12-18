'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

export interface CardGridItem {
  id: string
  title: string
  description?: string
  content: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

interface CardGridProps {
  items: CardGridItem[]
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
  cardClassName?: string
}

/**
 * Grid of cards with consistent styling and animations
 */
export function CardGrid({
  items,
  columns = 3,
  gap = 'md',
  className,
  cardClassName,
}: CardGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card
            className={cn(
              'border border-border/60 hover:border-border/80 transition-all duration-200',
              'hover:shadow-lg',
              cardClassName,
              item.className
            )}
          >
            {(item.title || item.description || item.icon) && (
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {item.icon && (
                      <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40 flex-shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold">
                        {item.title}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className="mt-1 text-xs">
                          {item.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  {item.action && (
                    <div className="ml-2 flex-shrink-0">{item.action}</div>
                  )}
                </div>
              </CardHeader>
            )}
            <CardContent>{item.content}</CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

