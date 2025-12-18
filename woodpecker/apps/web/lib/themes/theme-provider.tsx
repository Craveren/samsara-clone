'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { colorPalettes, type ColorPalette } from './color-palettes'

interface ThemeContextType {
  currentPalette: ColorPalette | null
  setPalette: (palette: ColorPalette | string | null) => void
  palettes: ColorPalette[]
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useUser must be called unconditionally - it's safe even if ClerkProvider isn't present
  // It will return { user: null, isLoaded: false } in that case
  const { user, isLoaded } = useUser()
  
  // Debounce timer for API calls to prevent rate limiting - MUST be before useState
  const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  
  const [currentPalette, setCurrentPaletteState] = React.useState<ColorPalette | null>(() => {
    if (typeof window === 'undefined') return null
    
    // On initial load, try to get theme from localStorage
    // Don't depend on user.id in initial state since user might not be loaded yet
    const saved = localStorage.getItem('woodpecker-theme')
    
    if (saved && saved !== 'default' && saved !== null) {
      const palette = colorPalettes.find(p => p.name === saved)
      if (palette) {
        // Apply immediately on initial load
        setTimeout(() => applyPalette(palette), 0)
        return palette
      }
    }
    return null // No theme selected - use original color scheme
  })

  // Load theme from user when user loads (after Clerk is ready)
  // This effect only loads theme, doesn't apply it (that's handled by the next effect)
  React.useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return
    
    // If user is loaded, check for user-specific theme and update state
    if (user?.id) {
      const saved = localStorage.getItem(`woodpecker-theme-${user.id}`)
      if (saved && saved !== 'default' && saved !== null) {
        const palette = colorPalettes.find(p => p.name === saved)
        if (palette && palette.name !== currentPalette?.name) {
          // Only update state, don't apply here (let the next effect handle it)
          setCurrentPaletteState(palette)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]) // Only depend on isLoaded and user.id

  // Apply theme immediately when it changes and save per user
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Only apply theme if user has explicitly selected one
    if (currentPalette) {
      // Clear everything first, then apply ONLY this palette
      applyPalette(currentPalette)
      
      // Save theme per user (always save to both user-specific and general)
      const themeName = currentPalette.name
      if (user?.id) {
        localStorage.setItem(`woodpecker-theme-${user.id}`, themeName)
      }
      // Also save general theme for consistency
      localStorage.setItem('woodpecker-theme', themeName)
      
      // Debounce API call to prevent rate limiting (wait 2 seconds after last change)
      if (user?.id) {
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current)
        }
        saveTimerRef.current = setTimeout(() => {
          saveThemeToUser(themeName, user.id)
        }, 2000)
      }
    } else {
      // Reset to original/default colors - clear ALL theme variables
      resetToDefaultTheme()
      const defaultTheme = 'default'
      if (user?.id) {
        localStorage.setItem(`woodpecker-theme-${user.id}`, defaultTheme)
      }
      localStorage.setItem('woodpecker-theme', defaultTheme)
      
      // Debounce API call
      if (user?.id) {
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current)
        }
        saveTimerRef.current = setTimeout(() => {
          saveThemeToUser(defaultTheme, user.id)
        }, 2000)
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPalette, user?.id]) // Include user?.id to ensure theme saves correctly

  const setPalette = React.useCallback((palette: ColorPalette | string | null) => {
    if (palette === null || palette === 'default') {
      setCurrentPaletteState(null)
      return
    }
    if (typeof palette === 'string') {
      const found = colorPalettes.find(p => p.name === palette)
      if (found) {
        setCurrentPaletteState(found)
      }
    } else {
      setCurrentPaletteState(palette)
    }
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        currentPalette,
        setPalette,
        palettes: colorPalettes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Helper to apply palette - CLEAR ALL VARIABLES FIRST, then apply only the selected palette
function applyPalette(palette: ColorPalette) {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  
  // FIRST: Clear ALL possible theme variables to prevent mixing
  const allPossibleKeys = [
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--accent',
    '--accent-foreground',
    '--background',
    '--foreground',
    '--muted',
    '--muted-foreground',
    '--card',
    '--card-foreground',
    '--popover',
    '--popover-foreground',
    '--destructive',
    '--destructive-foreground',
    '--border',
    '--input',
    '--ring',
  ]
  
  // Clear everything first - remove all inline styles completely
  allPossibleKeys.forEach((key) => {
    root.style.removeProperty(key)
  })
  
  // Also clear body and html background colors that might be set
  document.body.style.removeProperty('background-color')
  document.body.style.removeProperty('background')
  root.style.removeProperty('background-color')
  root.style.removeProperty('background')
  
  // Remove any classes that might be applying colors
  root.classList.remove('dark', 'light')
  
  // Force a reflow to ensure styles are cleared
  void root.offsetHeight
  
  // Apply immediately - no delay needed
  // THEN: Apply ONLY the variables from the selected palette
  Object.entries(palette.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  
  // Also ensure body uses the background color (HSL format)
  const bgValue = palette.cssVariables['--background']
  if (bgValue) {
    document.body.style.backgroundColor = `hsl(${bgValue})`
  }
}

// Helper to reset to default theme - CLEAR EVERYTHING
function resetToDefaultTheme() {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  // Remove ALL possible CSS variable keys that themes might set
  // This ensures we go back to the original globals.css values
  const allPossibleKeys = [
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--accent',
    '--accent-foreground',
    '--background',
    '--foreground',
    '--muted',
    '--muted-foreground',
    '--card',
    '--card-foreground',
    '--popover',
    '--popover-foreground',
    '--destructive',
    '--destructive-foreground',
    '--border',
    '--input',
    '--ring',
  ]
  
  // Remove any inline styles that might have been set by themes
  allPossibleKeys.forEach((key) => {
    root.style.removeProperty(key)
  })
  
  // Also clear body and html background colors
  document.body.style.removeProperty('background-color')
  document.body.style.removeProperty('background')
  root.style.removeProperty('background-color')
  root.style.removeProperty('background')
}

// Save theme to user's Clerk metadata (with rate limit handling)
async function saveThemeToUser(themeName: string, userId: string) {
  try {
    const response = await fetch('/api/users/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId,
        theme: themeName 
      }),
    })
    
    // If rate limited, don't retry - localStorage already saved the theme
    if (!response.ok && response.status === 429) {
      // Silently fail - localStorage is the fallback and already saved
      return
    }
    
    if (!response.ok) {
      throw new Error(`Failed to save: ${response.statusText}`)
    }
  } catch (error: any) {
    // Silently fail - localStorage is the fallback and already saved
    // Only log non-rate-limit errors in development
    if (process.env.NODE_ENV === 'development' && error?.status !== 429) {
      console.error('Failed to save theme to user:', error)
    }
  }
}
