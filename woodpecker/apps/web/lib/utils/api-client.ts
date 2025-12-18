/**
 * Centralized API Client
 * Provides consistent error handling and response formatting
 */

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions {
  method?: RequestMethod
  body?: any
  headers?: Record<string, string>
  cache?: RequestCache
}

interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Centralized API client with error handling
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    cache = 'no-store',
  } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache,
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(endpoint, config)
    const result: ApiResponse<T> = await response.json()

    if (!response.ok) {
      throw new ApiError(
        result.error || result.message || 'Request failed',
        response.status,
        result
      )
    }

    return result.data ?? (result as T)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new ApiError('Network error. Please check your connection.', 0)
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    )
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),
}

