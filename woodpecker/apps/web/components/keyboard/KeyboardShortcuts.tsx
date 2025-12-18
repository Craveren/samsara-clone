'use client'

import * as React from 'react'
import { useToast } from '@/lib/hooks'
import { useNavigation } from '@/lib/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

interface Shortcut {
  keys: string[]
  description: string
  action: () => void
  category: string
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const { navigate } = useNavigation()
  const { toast } = useToast()
  const [showHelp, setShowHelp] = React.useState(false)

  const shortcuts: Shortcut[] = [
    {
      keys: ['g', 'd'],
      description: 'Go to Dashboard',
      action: () => navigate.to('dashboard'),
      category: 'Navigation',
    },
    {
      keys: ['g', 'f'],
      description: 'Go to Financial',
      action: () => navigate.to('financial'),
      category: 'Navigation',
    },
    {
      keys: ['g', 'l'],
      description: 'Go to Legacy',
      action: () => navigate.to('legacy'),
      category: 'Navigation',
    },
    {
      keys: ['g', 'p'],
      description: 'Go to People',
      action: () => navigate.toPath('/people'),
      category: 'Navigation',
    },
    {
      keys: ['g', 't'],
      description: 'Go to Tasks',
      action: () => navigate.to('tasks'),
      category: 'Navigation',
    },
    {
      keys: ['g', 's'],
      description: 'Go to Settings',
      action: () => navigate.toPath('/settings'),
      category: 'Navigation',
    },
    {
      keys: ['?'],
      description: 'Show Keyboard Shortcuts',
      action: () => setShowHelp(true),
      category: 'General',
    },
    {
      keys: ['/'],
      description: 'Search',
      action: () => {
        // TODO: Open search
        toast('Search coming soon!', 'This feature is coming soon', 'default')
      },
      category: 'General',
    },
    {
      keys: ['esc'],
      description: 'Close Dialog / Cancel',
      action: () => {
        // Close any open dialogs
        document.body.click()
      },
      category: 'General',
    },
  ]

  // Register keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for modifier keys
      const isModifier = e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
      
      // Handle '?' for help
      if (e.key === '?' && !isModifier) {
        e.preventDefault()
        setShowHelp(true)
        return
      }

      // Handle 'g' prefix for navigation (g+d, g+f, etc.)
      if (e.key === 'g' && !isModifier) {
        const handleNextKey = (nextEvent: KeyboardEvent) => {
          if (nextEvent.key === 'd') {
            nextEvent.preventDefault()
            navigate.to('dashboard')
          } else if (nextEvent.key === 'f') {
            nextEvent.preventDefault()
            navigate.to('financial')
          } else if (nextEvent.key === 'l') {
            nextEvent.preventDefault()
            navigate.to('legacy')
          } else if (nextEvent.key === 'p') {
            nextEvent.preventDefault()
            navigate.toPath('/people')
          } else if (nextEvent.key === 't') {
            nextEvent.preventDefault()
            navigate.to('tasks')
          } else if (nextEvent.key === 's') {
            nextEvent.preventDefault()
            navigate.toPath('/settings')
          }
          document.removeEventListener('keydown', handleNextKey)
        }
        document.addEventListener('keydown', handleNextKey, { once: true })
        return
      }

      // Handle '/' for search
      if (e.key === '/' && !isModifier) {
        e.preventDefault()
        toast('Search coming soon!', 'This feature is coming soon', 'default')
        return
      }

      // Handle Escape
      if (e.key === 'Escape') {
        // Close dialogs
        const dialogs = document.querySelectorAll('[role="dialog"]')
        if (dialogs.length > 0) {
          const closeButton = document.querySelector('[aria-label="Close"]') as HTMLElement
          closeButton?.click()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate, toast])

  return (
    <>
      {children}
      <KeyboardShortcutsDialog open={showHelp} onOpenChange={setShowHelp} shortcuts={shortcuts} />
    </>
  )
}

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: Shortcut[]
}

function KeyboardShortcutsDialog({ open, onOpenChange, shortcuts }: KeyboardShortcutsDialogProps) {
  const categories = React.useMemo(() => {
    const cats = new Map<string, Shortcut[]>()
    shortcuts.forEach(shortcut => {
      if (!cats.has(shortcut.category)) {
        cats.set(shortcut.category, [])
      }
      cats.get(shortcut.category)!.push(shortcut)
    })
    return Array.from(cats.entries())
  }, [shortcuts])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="lucide:keyboard" className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and interact with the app faster
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {categories.map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          {keyIndex > 0 && (
                            <span className="text-muted-foreground mx-1">+</span>
                          )}
                          <kbd className="px-2 py-1 text-xs font-semibold bg-muted border border-border rounded">
                            {key === 'esc' ? 'Esc' : key.toUpperCase()}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

