/**
 * Clear all theme colors from the document
 * Ensures the app remains colorless by default
 */

export function clearAllThemeColors() {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  
  // Clear all possible theme CSS variables
  const themeVariableKeys = [
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
  themeVariableKeys.forEach((key) => {
    root.style.removeProperty(key)
  })
  
  // Also clear old theme system localStorage keys
  if (typeof window !== 'undefined') {
    localStorage.removeItem('current-theme')
    // Keep woodpecker-theme for Settings page, but clear old system
    const userId = (window as any).__clerk?.user?.id
    if (userId) {
      localStorage.removeItem(`theme-${userId}`)
    }
  }
}

// DON'T auto-clear themes on page load - let ThemeProvider handle it
// The ThemeProvider will apply the saved theme or clear if needed
// This prevents clearing themes that should be applied

