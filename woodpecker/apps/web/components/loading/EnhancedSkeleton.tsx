'use client'

import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface EnhancedSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart' | 'table'
  width?: number | string
  height?: number | string
  className?: string
  count?: number
  animated?: boolean
}

export function EnhancedSkeleton({
  variant = 'rectangular',
  width,
  height,
  className,
  count = 1,
  animated = true,
}: EnhancedSkeletonProps) {
  const baseClasses = cn(
    'bg-muted',
    animated && 'animate-pulse',
    className
  )

  const variants = {
    text: {
      className: cn(baseClasses, 'rounded', 'h-4'),
      style: { width: width || '100%', height: height || 16 },
    },
    circular: {
      className: cn(baseClasses, 'rounded-full'),
      style: { width: width || 40, height: height || 40 },
    },
    rectangular: {
      className: baseClasses,
      style: { width: width || '100%', height: height || 100 },
    },
    card: {
      className: cn(baseClasses, 'rounded-lg border'),
      style: { width: width || '100%', height: height || 200 },
    },
    chart: {
      className: cn(baseClasses, 'rounded-lg'),
      style: { width: width || '100%', height: height || 300 },
    },
    table: {
      className: cn(baseClasses, 'rounded'),
      style: { width: width || '100%', height: height || 40 },
    },
  }

  const config = variants[variant]

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton
              className={config.className}
              style={config.style}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <Skeleton
      className={config.className}
      style={config.style}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-3">
        <EnhancedSkeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <EnhancedSkeleton variant="text" width="60%" />
          <EnhancedSkeleton variant="text" width="40%" />
        </div>
      </div>
      <EnhancedSkeleton variant="rectangular" height={100} />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="space-y-2">
        <EnhancedSkeleton variant="text" width="40%" height={24} />
        <EnhancedSkeleton variant="text" width="60%" height={16} />
      </div>
      <EnhancedSkeleton variant="chart" height={300} />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="p-4 border-b space-y-2">
        <EnhancedSkeleton variant="text" width="30%" height={20} />
        <EnhancedSkeleton variant="text" width="50%" height={16} />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <EnhancedSkeleton variant="circular" width={32} height={32} />
            <EnhancedSkeleton variant="text" width="30%" />
            <EnhancedSkeleton variant="text" width="20%" />
            <EnhancedSkeleton variant="text" width="15%" />
            <div className="flex-1" />
            <EnhancedSkeleton variant="rectangular" width={80} height={32} />
          </div>
        ))}
      </div>
    </div>
  )
}



