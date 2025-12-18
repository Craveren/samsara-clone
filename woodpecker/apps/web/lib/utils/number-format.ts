/**
 * Number formatting utilities
 * Ensures consistent formatting between server and client to prevent hydration errors
 */

export function formatNumber(value: number | string | null | undefined, options?: {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}): string {
  if (value === null || value === undefined) return '0'
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    locale = 'en-US'
  } = options || {}
  
  // Use consistent formatting to prevent hydration errors
  return num.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

export function formatCurrency(value: number | string | null | undefined, currency: string = 'ZAR'): string {
  if (value === null || value === undefined) return '0.00'
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0.00'
  
  // Use consistent formatting to prevent hydration errors
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

