import { useState, useEffect, useCallback } from 'react'

interface ScreenSize {
  width: number
  height: number
}

interface Breakpoints {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
}

interface Orientation {
  isPortrait: boolean
  isLandscape: boolean
}

interface UseScreenReturn extends ScreenSize, Breakpoints, Orientation {
  isSmall: boolean
  isMedium: boolean
  isLarge: boolean
  isXLarge: boolean
}

// Breakpoint definitions
const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
} as const

/**
 * Debounce function to limit how often a function is called
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

export function useScreen(debounceMs: number = 150): UseScreenReturn {
  const getScreenSize = useCallback((): ScreenSize => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }, [])

  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = debounce(() => {
      setScreenSize(getScreenSize())
    }, debounceMs)

    // Set initial size
    setScreenSize(getScreenSize())

    // Listen for resize events
    window.addEventListener('resize', handleResize, { passive: true })

    // Listen for orientation changes (mobile devices)
    window.addEventListener('orientationchange', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [debounceMs, getScreenSize])

  // Calculate breakpoints
  const breakpoints: Breakpoints = {
    isMobile: screenSize.width < BREAKPOINTS.mobile,
    isTablet: screenSize.width >= BREAKPOINTS.mobile && screenSize.width < BREAKPOINTS.tablet,
    isDesktop: screenSize.width >= BREAKPOINTS.tablet && screenSize.width < BREAKPOINTS.desktop,
    isLargeDesktop: screenSize.width >= BREAKPOINTS.desktop,
  }

  // Calculate orientation
  const orientation: Orientation = {
    isPortrait: screenSize.height > screenSize.width,
    isLandscape: screenSize.width > screenSize.height,
  }

  // Additional convenience flags
  const isSmall = breakpoints.isMobile
  const isMedium = breakpoints.isTablet
  const isLarge = breakpoints.isDesktop
  const isXLarge = breakpoints.isLargeDesktop

  return {
    ...screenSize,
    ...breakpoints,
    ...orientation,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
  }
}
