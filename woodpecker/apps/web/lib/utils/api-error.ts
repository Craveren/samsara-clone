export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

export function handleApiError(error: any): ApiError {
  // If it's already an ApiError
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: error.message || 'An error occurred',
      status: error.status,
      code: error.code,
      details: error.details,
    }
  }

  // If it's a string
  if (typeof error === 'string') {
    return { message: error }
  }

  // If it's an Error object
  if (error instanceof Error) {
    return {
      message: error.message || 'An error occurred',
    }
  }

  // If it's a response-like object
  if (error && typeof error === 'object') {
    // Check for common error response formats
    if (error.error) {
      return {
        message: typeof error.error === 'string' ? error.error : error.error.message || 'An error occurred',
        status: error.status,
        code: error.code,
      }
    }

    if (error.message) {
      return {
        message: error.message,
        status: error.status,
        code: error.code,
      }
    }
  }

  // Default fallback
  return {
    message: 'An unexpected error occurred',
  }
}

