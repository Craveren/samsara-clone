'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface EnhancedChartProps {
  title: string
  description?: string
  icon?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
  loading?: boolean
  error?: string | null
}

export function EnhancedChart({
  title,
  description,
  icon,
  children,
  className,
  actions,
  loading,
  error,
}: EnhancedChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn('border border-border/60 hover:border-border transition-colors', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon icon={icon} className="w-4 h-4 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description && (
                  <CardDescription className="mt-0.5">{description}</CardDescription>
                )}
              </div>
            </div>
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="flex flex-col items-center gap-2">
                <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading chart...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="flex flex-col items-center gap-2 text-center">
                <Icon icon="lucide:alert-circle" className="w-6 h-6 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ChartTooltipProps {
  label: string
  payload?: Array<{
    name: string
    value: number | string
    color?: string
  }>
  formatter?: (value: number | string) => string
}

export function ChartTooltip({ label, payload, formatter }: ChartTooltipProps) {
  if (!payload || payload.length === 0) return null

  return (
    <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            {entry.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
            )}
            <span className="text-xs font-medium text-foreground">
              {entry.name}: {formatter ? formatter(entry.value as number) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ChartLegendProps {
  items: Array<{
    name: string
    color: string
  }>
  className?: string
}

export function ChartLegend({ items, className }: ChartLegendProps) {
  return (
    <div className={cn('flex items-center gap-4 flex-wrap', className)}>
      {items.map((item, index) => (
        <TooltipProvider key={index}>
          <UITooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.name}</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

