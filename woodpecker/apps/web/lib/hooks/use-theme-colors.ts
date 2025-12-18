'use client'

import * as React from 'react'

/**
 * Hook to get theme colors as HSL strings for use in charts and components
 * Returns colors that automatically update when theme changes
 */
export function useThemeColors() {
  const [colors, setColors] = React.useState({
    foreground: '0 0% 6%',
    background: '40 15% 96%',
    border: '40 12% 82%',
    mutedForeground: '0 0% 38%',
    primary: '0 0% 6%',
    secondary: '40 12% 90%',
    accent: '40 12% 90%',
    muted: '40 12% 90%',
    card: '40 20% 98%',
    destructive: '0 72% 51%',
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const updateColors = () => {
      const root = document.documentElement
      setColors({
        foreground: getComputedStyle(root).getPropertyValue('--foreground').trim() || '0 0% 6%',
        background: getComputedStyle(root).getPropertyValue('--background').trim() || '40 15% 96%',
        border: getComputedStyle(root).getPropertyValue('--border').trim() || '40 12% 82%',
        mutedForeground: getComputedStyle(root).getPropertyValue('--muted-foreground').trim() || '0 0% 38%',
        primary: getComputedStyle(root).getPropertyValue('--primary').trim() || '0 0% 6%',
        secondary: getComputedStyle(root).getPropertyValue('--secondary').trim() || '40 12% 90%',
        accent: getComputedStyle(root).getPropertyValue('--accent').trim() || '40 12% 90%',
        muted: getComputedStyle(root).getPropertyValue('--muted').trim() || '40 12% 90%',
        card: getComputedStyle(root).getPropertyValue('--card').trim() || '40 20% 98%',
        destructive: getComputedStyle(root).getPropertyValue('--destructive').trim() || '0 72% 51%',
      })
    }

    // Initial update
    updateColors()

    // Watch for theme changes via MutationObserver
    const observer = new MutationObserver(() => {
      updateColors()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    // Also listen for storage changes (theme selection)
    const handleStorageChange = () => {
      setTimeout(updateColors, 100) // Small delay to let theme apply
    }
    window.addEventListener('storage', handleStorageChange)

    // Poll for changes (fallback)
    const interval = setInterval(updateColors, 500)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return colors
}









