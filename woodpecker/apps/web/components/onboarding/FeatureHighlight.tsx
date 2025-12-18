'use client'

import * as React from 'react'
import { Card, CardContent } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface FeatureHighlightProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  onDismiss?: () => void
}

const positions = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
}

export function FeatureHighlight({
  icon,
  title,
  description,
  action,
  position = 'top-right',
  onDismiss,
}: FeatureHighlightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn('fixed z-50', positions[position])}
    >
      <Card className="border-2 border-primary shadow-2xl max-w-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 shrink-0">
              <Icon icon={icon} className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">{title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{description}</p>
              <div className="flex items-center gap-2">
                {action && (
                  <Button size="sm" onClick={action.onClick}>
                    {action.label}
                  </Button>
                )}
                {onDismiss && (
                  <Button size="sm" variant="ghost" onClick={onDismiss}>
                    Dismiss
                  </Button>
                )}
              </div>
            </div>
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="h-6 w-6 p-0 shrink-0"
              >
                <Icon icon="lucide:x" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}



