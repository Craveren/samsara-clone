import { useState, useEffect } from 'react'

export function useReadLocalStorage<T>(key: string): T | null {
  const [storedValue, setStoredValue] = useState<T | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const item = window.localStorage.getItem(key)
      setStoredValue(item ? JSON.parse(item) : null)
    } catch (error) {
      console.error(error)
      setStoredValue(null)
    }
  }, [key])

  return storedValue
}

