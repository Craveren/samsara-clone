'use client'

import * as React from 'react'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

/**
 * ThemeToggle Component
 * Toggles between light and dark modes using Tailwind's class-based dark mode
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = React.useState(false)

  // Initialize theme from localStorage or system preference
  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || (systemPrefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  // Apply theme to HTML element
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', className)}
        aria-label="Toggle theme"
        disabled
      >
        <Icon icon="solar:sun-bold-duotone" className="h-4 w-4 text-muted-foreground" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn('h-8 w-8 hover:bg-muted/80', className)}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Icon icon="solar:moon-bold-duotone" className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Icon icon="solar:sun-bold-duotone" className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  )
}

