/**
 * Theme System
 * Account-specific theme management with 10 color palettes
 * Each theme is stored per account and applies globally
 */

export interface ThemePalette {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    card: string
    popover: string
    destructive: string
  }
}

export const THEMES: ThemePalette[] = [
  {
    id: 'nature-green',
    name: 'Nature Green',
    colors: {
      primary: '#628141',
      secondary: '#8bae66',
      accent: '#ebd5ab',
      background: '#1b211a',
      foreground: '#ebd5ab',
      muted: '#628141',
      border: '#8bae66',
      card: '#1b211a',
      popover: '#1b211a',
      destructive: '#bf1a1a',
    },
  },
  {
    id: 'warm-red',
    name: 'Warm Red',
    colors: {
      primary: '#ff6c0c',
      secondary: '#ffe08f',
      accent: '#060771',
      background: '#bf1a1a',
      foreground: '#ffe08f',
      muted: '#ff6c0c',
      border: '#ffe08f',
      card: '#bf1a1a',
      popover: '#bf1a1a',
      destructive: '#ff5555',
    },
  },
  {
    id: 'beige-cream',
    name: 'Beige Cream',
    colors: {
      primary: '#d9cfc7',
      secondary: '#c9b59c',
      accent: '#f9f8f6',
      background: '#f9f8f6',
      foreground: '#1b211a',
      muted: '#efe9e3',
      border: '#d9cfc7',
      card: '#efe9e3',
      popover: '#f9f8f6',
      destructive: '#bf1a1a',
    },
  },
  {
    id: 'orange-blue',
    name: 'Orange Blue',
    colors: {
      primary: '#fe7743',
      secondary: '#447d9b',
      accent: '#d7d7d7',
      background: '#273f4f',
      foreground: '#d7d7d7',
      muted: '#447d9b',
      border: '#fe7743',
      card: '#273f4f',
      popover: '#273f4f',
      destructive: '#ff5555',
    },
  },
  {
    id: 'teal',
    name: 'Teal',
    colors: {
      primary: '#018790',
      secondary: '#00b7b5',
      accent: '#f4f4f4',
      background: '#005461',
      foreground: '#f4f4f4',
      muted: '#018790',
      border: '#00b7b5',
      card: '#005461',
      popover: '#005461',
      destructive: '#ff5555',
    },
  },
  {
    id: 'cream-orange',
    name: 'Cream Orange',
    colors: {
      primary: '#ff6d1f',
      secondary: '#f5e7c6',
      accent: '#222222',
      background: '#faf3e1',
      foreground: '#222222',
      muted: '#f5e7c6',
      border: '#ff6d1f',
      card: '#faf3e1',
      popover: '#faf3e1',
      destructive: '#bf1a1a',
    },
  },
  {
    id: 'red-green',
    name: 'Red Green',
    colors: {
      primary: '#ff937e',
      secondary: '#c1e59f',
      accent: '#a3d78a',
      background: '#ff5555',
      foreground: '#ffffff',
      muted: '#ff937e',
      border: '#c1e59f',
      card: '#ff5555',
      popover: '#ff5555',
      destructive: '#bf1a1a',
    },
  },
  {
    id: 'blue-pink',
    name: 'Blue Pink',
    colors: {
      primary: '#3291b6',
      secondary: '#bb8ed0',
      accent: '#f1e2e2',
      background: '#e0a8a8',
      foreground: '#1b211a',
      muted: '#bb8ed0',
      border: '#3291b6',
      card: '#e0a8a8',
      popover: '#e0a8a8',
      destructive: '#bf1a1a',
    },
  },
  {
    id: 'brown-beige',
    name: 'Brown Beige',
    colors: {
      primary: '#57595b',
      secondary: '#e8d1c5',
      accent: '#f3e8df',
      background: '#452829',
      foreground: '#f3e8df',
      muted: '#e8d1c5',
      border: '#57595b',
      card: '#452829',
      popover: '#452829',
      destructive: '#bf1a1a',
    },
  },
  {
    id: 'blue-orange',
    name: 'Blue Orange',
    colors: {
      primary: '#0046ff',
      secondary: '#ff8040',
      accent: '#f5f1dc',
      background: '#001bb7',
      foreground: '#f5f1dc',
      muted: '#0046ff',
      border: '#ff8040',
      card: '#001bb7',
      popover: '#001bb7',
      destructive: '#ff5555',
    },
  },
]

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21 (WCAG standards)
 */
function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val = val / 255
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Ensure text is readable by adjusting foreground color if needed
 */
export function ensureContrast(background: string, foreground: string): string {
  const contrast = getContrastRatio(background, foreground)
  
  // WCAG AA requires at least 4.5:1 for normal text, 3:1 for large text
  if (contrast < 4.5) {
    // If contrast is too low, use white or black based on background brightness
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(background)
    if (rgb) {
      const r = parseInt(rgb[1], 16)
      const g = parseInt(rgb[2], 16)
      const b = parseInt(rgb[3], 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      
      // Use white text on dark backgrounds, black on light
      return brightness < 128 ? '#ffffff' : '#000000'
    }
  }
  
  return foreground
}

/**
 * Convert hex to HSL
 */
function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0 0% 0%'
  
  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)
  
  return `${h} ${s}% ${l}%`
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ThemePalette, userId?: string) {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  const adjustedForeground = ensureContrast(theme.colors.background, theme.colors.foreground)
  
  // Convert hex colors to HSL format for CSS variables
  root.style.setProperty('--background', hexToHsl(theme.colors.background))
  root.style.setProperty('--foreground', hexToHsl(adjustedForeground))
  root.style.setProperty('--primary', hexToHsl(theme.colors.primary))
  root.style.setProperty('--secondary', hexToHsl(theme.colors.secondary))
  root.style.setProperty('--accent', hexToHsl(theme.colors.accent))
  root.style.setProperty('--muted', hexToHsl(theme.colors.muted))
  root.style.setProperty('--border', hexToHsl(theme.colors.border))
  root.style.setProperty('--card', hexToHsl(theme.colors.card))
  root.style.setProperty('--popover', hexToHsl(theme.colors.popover))
  root.style.setProperty('--destructive', hexToHsl(theme.colors.destructive))
  
  // Also set card-foreground and popover-foreground for proper contrast
  root.style.setProperty('--card-foreground', hexToHsl(ensureContrast(theme.colors.card, adjustedForeground)))
  root.style.setProperty('--popover-foreground', hexToHsl(ensureContrast(theme.colors.popover, adjustedForeground)))
  root.style.setProperty('--primary-foreground', hexToHsl(ensureContrast(theme.colors.primary, adjustedForeground)))
  root.style.setProperty('--secondary-foreground', hexToHsl(ensureContrast(theme.colors.secondary, adjustedForeground)))
  root.style.setProperty('--muted-foreground', hexToHsl(ensureContrast(theme.colors.muted, adjustedForeground)))
  root.style.setProperty('--accent-foreground', hexToHsl(ensureContrast(theme.colors.accent, adjustedForeground)))
  
  // Store theme preference
  if (userId) {
    localStorage.setItem(`theme-${userId}`, theme.id)
  }
  localStorage.setItem('current-theme', theme.id)
}

/**
 * Get saved theme for user
 */
export function getSavedTheme(userId?: string): ThemePalette | null {
  if (typeof window === 'undefined') return null
  
  const themeId = userId 
    ? localStorage.getItem(`theme-${userId}`) 
    : localStorage.getItem('current-theme')
  
  if (themeId) {
    return THEMES.find(t => t.id === themeId) || null
  }
  
  return null
}

/**
 * Get theme by ID
 */
export function getThemeById(id: string): ThemePalette | null {
  return THEMES.find(t => t.id === id) || null
}

