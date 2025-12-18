/**
 * React hook for API client
 * Provides loading states and error handling
 */

import * as React from 'react'
import { apiClient, ApiError } from '@/lib/utils/api-client'

interface UseApiClientOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export function useApiClient() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<ApiError | null>(null)

  const request = React.useCallback(
    async <T = any>(
      endpoint: string,
      options?: Parameters<typeof apiClient>[1],
      hookOptions?: UseApiClientOptions
    ): Promise<T | null> => {
      setLoading(true)
      setError(null)

      try {
        const data = await apiClient<T>(endpoint, options)
        hookOptions?.onSuccess?.(data)
        return data
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError('Unknown error', 500)
        setError(apiError)
        hookOptions?.onError?.(apiError)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { request, loading, error, setError }
}

