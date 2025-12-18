import { useState, useEffect, useCallback } from 'react'

export function usePageData<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Memoize the fetch function to prevent unnecessary re-renders
  const memoizedFetchFn = useCallback(fetchFn, deps)

  useEffect(() => {
    let cancelled = false
    
    setLoading(true)
    setError(null)
    
    memoizedFetchFn()
      .then((result) => {
        if (!cancelled) {
          setData(result)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [memoizedFetchFn])

  return { data, loading, error }
}

