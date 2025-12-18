'use client'

import * as React from 'react'
import { useToast } from './use-toast'
import { handleApiError } from '../utils/api-error'
import { logger } from '../utils/logger'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showToast?: boolean
  cache?: boolean
  cacheTTL?: number
  retries?: number
  retryDelay?: number
  timeout?: number
}

interface CacheEntry {
  data: any
  timestamp: number
  promise?: Promise<any>
}

// Request cache to prevent duplicate calls
const requestCache = new Map<string, CacheEntry>()
const CACHE_TTL = 30000 // 30 seconds default
const MAX_CACHE_SIZE = 500

// Request deduplication - prevent multiple identical requests
const pendingRequests = new Map<string, Promise<any>>()

// Abort controllers for request cancellation
const abortControllers = new Map<string, AbortController>()

/**
 * Clean old cache entries to prevent memory leaks
 */
function cleanCache(): void {
  if (requestCache.size <= MAX_CACHE_SIZE) return

  const now = Date.now()
  const entriesToDelete: string[] = []

  for (const [key, entry] of requestCache.entries()) {
    // Remove entries older than 5 minutes
    if (now - entry.timestamp > 300000) {
      entriesToDelete.push(key)
    }
  }

  entriesToDelete.forEach(key => requestCache.delete(key))
}

/**
 * Create a timeout promise for request timeout handling
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
  })
}

export function useApi() {
  const { toast } = useToast()

  const request = React.useCallback(
    async <T>(
      url: string,
      options?: RequestInit,
      apiOptions?: UseApiOptions
    ): Promise<T | null> => {
      const method = options?.method || 'GET'
      const cacheKey = `${method}:${url}`
      const shouldCache = apiOptions?.cache !== false && method === 'GET'
      const cacheTTL = apiOptions?.cacheTTL || CACHE_TTL
      const retries = apiOptions?.retries ?? 0
      const retryDelay = apiOptions?.retryDelay ?? 1000
      const timeout = apiOptions?.timeout ?? 30000

      // Clean cache periodically
      if (requestCache.size > MAX_CACHE_SIZE) {
        cleanCache()
      }

      // Check cache first
      if (shouldCache) {
        const cached = requestCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < cacheTTL) {
          return cached.data as T
        }
      }

      // Check if request is already pending (deduplication)
      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey) as Promise<T | null>
      }

      // Create abort controller for this request
      const abortController = new AbortController()
      abortControllers.set(cacheKey, abortController)

      // Create request promise with retry logic
      const requestPromise = (async (): Promise<T | null> => {
        let lastError: Error | null = null

        for (let attempt = 0; attempt <= retries; attempt++) {
          // Skip delay for first attempt
          if (attempt > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
          }

          try {
            logger.debug('API Request:', { url, method, attempt: attempt + 1 })

            // Create fetch with timeout
            const fetchPromise = fetch(url, {
              ...options,
              signal: abortController.signal,
              headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
              },
            })

            // Race between fetch and timeout
            const response = await Promise.race([
              fetchPromise,
              createTimeoutPromise(timeout),
            ]) as Response

            // Check if request was aborted
            if (abortController.signal.aborted) {
              throw new Error('Request was cancelled')
            }

            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type')
            let data: any

            if (contentType && contentType.includes('application/json')) {
              data = await response.json()
            } else {
              // If not JSON, read as text to see what we got
              const text = await response.text()
              if (process.env.NODE_ENV === 'development') {
                console.error('Non-JSON response received:', {
                  url,
                  status: response.status,
                  text: text.substring(0, 200),
                })
              }

              // Try to parse as JSON anyway (might be JSON with wrong content-type)
              try {
                data = JSON.parse(text)
              } catch {
                // If parsing fails, create error object
                data = {
                  error: `Server returned ${response.status}: ${text.substring(0, 100)}`,
                  status: response.status,
                }
              }
            }

            if (!response.ok) {
              const error = handleApiError(data)
              lastError = new Error(error.message)

              // Retry on 5xx errors or network errors
              if (attempt < retries && (response.status >= 500 || response.status === 429)) {
                logger.warn(`API Error (retrying):`, error)
                continue
              }

              logger.error('API Error:', error)

              if (apiOptions?.showToast !== false) {
                toast.error(error.message || 'An error occurred')
              }

              apiOptions?.onError?.(lastError)
              return null
            }

            logger.debug('API Success:', { url, data })

            // Cache successful GET requests
            if (shouldCache && response.ok) {
              requestCache.set(cacheKey, {
                data,
                timestamp: Date.now(),
              })
            }

            if (apiOptions?.showToast !== false && apiOptions?.onSuccess) {
              toast.success('Operation successful')
            }

            apiOptions?.onSuccess?.(data)
            return data as T
          } catch (error: any) {
            lastError = error

            // Don't retry on abort or timeout errors
            if (error.message?.includes('aborted') || error.message?.includes('timeout')) {
              break
            }

            // Retry on network errors
            if (attempt < retries && (error.name === 'TypeError' || error.message?.includes('fetch'))) {
              logger.warn(`Network error (retrying):`, error)
              continue
            }

            const handled = handleApiError(error)
            logger.error('API Request Failed:', handled)

            if (apiOptions?.showToast !== false) {
              toast.error(handled.message)
            }

            apiOptions?.onError?.(new Error(handled.message))
            return null
          }
        }

        // All retries failed
        if (lastError) {
          const handled = handleApiError(lastError)
          if (apiOptions?.showToast !== false) {
            toast.error(handled.message)
          }
          apiOptions?.onError?.(lastError)
        }

        return null
      })()

      // Store pending request for deduplication
      pendingRequests.set(cacheKey, requestPromise)

      // Clean up after request completes
      requestPromise.finally(() => {
        pendingRequests.delete(cacheKey)
        abortControllers.delete(cacheKey)
      })

      return requestPromise
    },
    [toast]
  )

  // Cancel a specific request
  const cancelRequest = React.useCallback((url: string, method: string = 'GET') => {
    const cacheKey = `${method}:${url}`
    const controller = abortControllers.get(cacheKey)
    if (controller) {
      controller.abort()
      abortControllers.delete(cacheKey)
      pendingRequests.delete(cacheKey)
    }
  }, [])

  // Clear cache function
  const clearCache = React.useCallback((url?: string) => {
    if (url) {
      const method = 'GET'
      requestCache.delete(`${method}:${url}`)
    } else {
      requestCache.clear()
    }
  }, [])

  // Prefetch data (useful for optimistic loading)
  const prefetch = React.useCallback(
    async <T>(url: string): Promise<T | null> => {
      return request<T>(url, { method: 'GET' }, { cache: true, showToast: false })
    },
    [request]
  )

  return {
    request,
    cancelRequest,
    clearCache,
    prefetch,
  }
}
