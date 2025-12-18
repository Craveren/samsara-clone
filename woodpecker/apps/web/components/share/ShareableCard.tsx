'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'

interface ShareableCardProps {
  title: string
  description?: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: string
  shareable?: boolean
  onShare?: () => void
  className?: string
  children?: React.ReactNode
}

export function ShareableCard({
  title,
  description,
  value,
  trend,
  icon,
  shareable = true,
  onShare,
  className,
  children,
}: ShareableCardProps) {
  const { toast } = useToast()
  const [isSharing, setIsSharing] = React.useState(false)

  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }

    setIsSharing(true)
    
    try {
      // Create shareable content
      const shareText = `${title}: ${value}${trend ? ` (${trend.isPositive ? '+' : ''}${trend.value}%)` : ''}`
      const shareData = {
        title: 'Woodpecker Financial Summary',
        text: shareText,
        url: window.location.href,
      }

      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareText)
        toast.success('Copied to clipboard!')
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share')
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Card className={cn('relative overflow-hidden group', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon icon={icon} className="w-5 h-5 text-primary" />
              </div>
            )}
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </div>
          {shareable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon 
                icon={isSharing ? 'lucide:loader-2' : 'lucide:share-2'} 
                className="w-4 h-4" 
              />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold tracking-tight financial-number">
            {value}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              <Icon 
                icon={trend.isPositive ? 'lucide:trending-up' : 'lucide:trending-down'} 
                className="w-4 h-4" 
              />
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

