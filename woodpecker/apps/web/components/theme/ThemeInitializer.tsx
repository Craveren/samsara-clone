'use client'

import * as React from 'react'

/**
 * ThemeInitializer - No longer applies themes automatically
 * Themes are now only applied when user explicitly selects one in Settings
 * This ensures the app remains colorless by default
 */
export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


