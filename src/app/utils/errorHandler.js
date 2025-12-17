/**
 * Centralized error handling utility
 * Replaces console.log/error/warn with proper error handling
 */

class ErrorHandler {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.errorReportingService = null; // Can be initialized with Sentry, LogRocket, etc.
  }

  /**
   * Initialize error reporting service
   */
  init(reportingService) {
    this.errorReportingService = reportingService;
  }

  /**
   * Log error with proper handling
   */
  logError(error, context = {}) {
    const errorInfo = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    if (this.isDevelopment) {
      console.error('Error:', errorInfo);
    } else if (this.errorReportingService) {
      // Send to error reporting service in production
      this.errorReportingService.captureException(error, { extra: context });
    }

    return errorInfo;
  }

  /**
   * Log warning
   */
  logWarning(message, context = {}) {
    if (this.isDevelopment) {
      console.warn('Warning:', message, context);
    } else if (this.errorReportingService) {
      this.errorReportingService.captureMessage(message, {
        level: 'warning',
        extra: context,
      });
    }
  }

  /**
   * Log info (only in development)
   */
  logInfo(message, data = {}) {
    if (this.isDevelopment) {
      console.log('Info:', message, data);
    }
  }

  /**
   * Handle API errors
   */
  handleApiError(error, context = {}) {
    const errorInfo = {
      message: error?.response?.data?.message || error?.message || 'API request failed',
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method,
      ...context,
    };

    this.logError(error, errorInfo);

    // Return user-friendly error message
    if (error?.response?.status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    if (error?.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error?.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error?.response?.status >= 500) {
      return 'Server error. Please try again later.';
    }

    return errorInfo.message;
  }

  /**
   * Handle async errors
   */
  async handleAsyncError(asyncFn, context = {}) {
    try {
      return await asyncFn();
    } catch (error) {
      this.logError(error, context);
      throw error;
    }
  }
}

// Export singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;

