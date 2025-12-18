'use client'

import * as React from 'react'
import { useTheme } from '@/lib/themes/theme-provider'
import { Button } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface ThemePickerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ThemePicker({ open: controlledOpen, onOpenChange }: ThemePickerProps = {}) {
  const { currentPalette, setPalette, palettes } = useTheme()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }
  
  // Add "Default" option to reset to original colors
  const allOptions = [
    { name: 'Default', description: 'Original color scheme', colors: { primary: 'transparent', secondary: 'transparent', accent: 'transparent', background: 'transparent', surface: 'transparent', text: 'transparent', textSecondary: 'transparent' }, cssVariables: {} },
    ...palettes,
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Theme</DialogTitle>
          <DialogDescription>
            Select a color theme to customize your app's appearance
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {allOptions.map((palette) => {
            const isActive = palette.name === (currentPalette?.name || 'Default')
            return (
              <motion.button
                key={palette.name}
                onClick={() => {
                  if (palette.name === 'Default') {
                    setPalette(null)
                  } else {
                    setPalette(palette)
                  }
                  setIsOpen(false)
                }}
                className={cn(
                  'relative p-4 rounded-lg border-2 transition-all text-left group',
                  'hover:shadow-lg hover:scale-[1.02]',
                  isActive
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Color Preview Strip */}
                <div className="mb-3 rounded-md overflow-hidden border border-border/50">
                  {palette.name === 'Default' ? (
                    <div className="flex h-16">
                      <div className="flex-1 bg-background border-r border-border/50" />
                      <div className="flex-1 bg-muted border-r border-border/50" />
                      <div className="flex-1 bg-foreground/10" />
                    </div>
                  ) : (
                    <div className="flex h-16">
                      <div 
                        className="flex-1 border-r border-border/30"
                        style={{ backgroundColor: palette.colors.primary }}
                        title="Primary"
                      />
                      <div 
                        className="flex-1 border-r border-border/30"
                        style={{ backgroundColor: palette.colors.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: palette.colors.accent }}
                        title="Accent"
                      />
                    </div>
                  )}
                </div>

                {/* Theme Name and Description */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-foreground">
                      {palette.name}
                    </h4>
                    {isActive && (
                      <Icon 
                        icon="solar:check-circle-bold" 
                        className="h-5 w-5 text-primary" 
                      />
                    )}
                  </div>
                  {palette.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {palette.description}
                    </p>
                  )}
                </div>

                {/* Color Palette Preview */}
                {palette.name !== 'Default' && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        {[
                          { color: palette.colors.primary, label: 'Primary' },
                          { color: palette.colors.secondary, label: 'Secondary' },
                          { color: palette.colors.accent, label: 'Accent' },
                          { color: palette.colors.background, label: 'Background' },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border border-border/50 shadow-sm"
                            style={{ backgroundColor: item.color }}
                            title={item.label}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {palette.colors.primary}
                      </span>
                    </div>
                  </div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
