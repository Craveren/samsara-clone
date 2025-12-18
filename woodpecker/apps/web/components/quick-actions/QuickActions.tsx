'use client'

import * as React from 'react'
import { Button } from '@woodpecker/ui'
import { Card, CardContent } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface QuickAction {
  id: string
  label: string
  icon: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
  color?: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function QuickActions({ 
  actions, 
  className,
  orientation = 'horizontal' 
}: QuickActionsProps) {
  return (
    <div 
      className={cn(
        'flex gap-2',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            className={cn(
              'gap-2',
              action.color && `text-${action.color} border-${action.color}`
            )}
          >
            <Icon icon={action.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
  color?: string
  className?: string
}

export function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  color = 'primary',
  className,
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          'cursor-pointer border-2 hover:border-primary transition-all',
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-lg bg-primary/10',
              `text-${color}`
            )}>
              <Icon icon={icon} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
            <Icon 
              icon="lucide:arrow-right" 
              className="w-4 h-4 text-muted-foreground shrink-0" 
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}



