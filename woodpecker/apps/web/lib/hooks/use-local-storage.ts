import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Enhanced localStorage hook with SSR safety, cross-tab sync, and better error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // SSR-safe initial state
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
      return initialValue
    }
  })

  // Track if this is the first render
  const isFirstRender = useRef(true)

  // Set value function with error handling
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Error setting localStorage key "${key}":`, error)
        }
      }
    },
    [key, storedValue]
  )

  // Remove value function
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error removing localStorage key "${key}":`, error)
      }
    }
  }, [key, initialValue])

  // Listen for changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Error parsing storage change for key "${key}":`, error)
          }
        }
      } else if (e.key === key && e.newValue === null) {
        // Item was removed
        setStoredValue(initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  // Sync on mount (in case value changed while component was unmounted)
  useEffect(() => {
    if (typeof window === 'undefined' || isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        // Only update if different to avoid unnecessary re-renders
        if (JSON.stringify(parsed) !== JSON.stringify(storedValue)) {
          setStoredValue(parsed)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error syncing localStorage key "${key}":`, error)
      }
    }
  }, [key, storedValue])

  return [storedValue, setValue, removeValue]
}
