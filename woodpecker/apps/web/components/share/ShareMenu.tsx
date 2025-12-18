'use client'

import * as React from 'react'
import { Button } from '@woodpecker/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'
import {
  shareContent,
  copyToClipboard,
  downloadFile,
  exportToCSV,
  exportToJSON,
  generateShareableText,
  type FinancialSummary,
} from '@/lib/share/export-utils'

interface ShareMenuProps {
  summary: FinancialSummary
  className?: string
}

export function ShareMenu({ summary, className }: ShareMenuProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSharing, setIsSharing] = React.useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const text = generateShareableText(summary)
      const shared = await shareContent('Woodpecker Financial Summary', text)
      
      if (shared) {
        toast.success('Shared successfully!')
        setIsOpen(false)
      } else {
        // Fallback to clipboard
        const copied = await copyToClipboard(text)
        if (copied) {
          toast.success('Copied to clipboard!')
        } else {
          toast.error('Failed to share')
        }
      }
    } catch (error) {
      toast.error('Failed to share')
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopy = async () => {
    try {
      const text = generateShareableText(summary)
      const copied = await copyToClipboard(text)
      if (copied) {
        toast.success('Copied to clipboard!')
        setIsOpen(false)
      } else {
        toast.error('Failed to copy')
      }
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleExportCSV = () => {
    try {
      const csv = exportToCSV(summary)
      downloadFile(
        csv,
        `woodpecker-summary-${new Date().toISOString().split('T')[0]}.csv`,
        'text/csv'
      )
      toast.success('CSV exported!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to export CSV')
    }
  }

  const handleExportJSON = () => {
    try {
      const json = exportToJSON(summary)
      downloadFile(
        json,
        `woodpecker-summary-${new Date().toISOString().split('T')[0]}.json`,
        'application/json'
      )
      toast.success('JSON exported!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to export JSON')
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('gap-2', className)}
        >
          <Icon icon="lucide:share-2" className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            disabled={isSharing}
            className="w-full justify-start gap-2"
          >
            <Icon 
              icon={isSharing ? 'lucide:loader-2' : 'lucide:share-2'} 
              className={cn('w-4 h-4', isSharing && 'animate-spin')} 
            />
            Share via...
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="w-full justify-start gap-2"
          >
            <Icon icon="lucide:copy" className="w-4 h-4" />
            Copy to clipboard
          </Button>
          <div className="h-px bg-border my-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCSV}
            className="w-full justify-start gap-2"
          >
            <Icon icon="lucide:file-spreadsheet" className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportJSON}
            className="w-full justify-start gap-2"
          >
            <Icon icon="lucide:file-json" className="w-4 h-4" />
            Export JSON
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}



