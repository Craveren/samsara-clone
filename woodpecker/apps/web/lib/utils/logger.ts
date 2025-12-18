type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
}

const isDevelopment = process.env.NODE_ENV === 'development'

function createLogger(level: LogLevel): (...args: any[]) => void {
  return (...args: any[]) => {
    // Only log in development or if it's an error/warn
    if (isDevelopment || level === 'error' || level === 'warn') {
      const consoleMethod = console[level] || console.log
      consoleMethod(`[${level.toUpperCase()}]`, ...args)
    }
  }
}

export const logger: Logger = {
  debug: createLogger('debug'),
  info: createLogger('info'),
  warn: createLogger('warn'),
  error: createLogger('error'),
}

