/**
 * Chart Utilities
 * Centralized chart configuration and scaling logic
 */

export interface ChartDataPoint {
  month: string
  value?: number
  income?: number
  expenses?: number
  total?: number
  [key: string]: any
}

/**
 * Calculate optimal Y-axis domain for chart data
 * Ensures charts scale properly based on actual data values
 */
export function calculateYAxisDomain(
  data: ChartDataPoint[],
  dataKeys: string[] = ['value', 'income', 'expenses', 'total']
): [number, number] {
  if (!data || data.length === 0) {
    return [0, 1000]
  }

  // Find min and max values across all data keys
  let min = Infinity
  let max = -Infinity

  data.forEach(point => {
    dataKeys.forEach(key => {
      const value = point[key]
      if (typeof value === 'number' && !isNaN(value)) {
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
    })
  })

  // If no valid values found, return default
  if (min === Infinity || max === -Infinity) {
    return [0, 1000]
  }

  // Add padding (10% on top, 5% on bottom)
  const padding = (max - min) * 0.1
  const minValue = Math.max(0, min - padding * 0.5)
  const maxValue = max + padding

  return [minValue, maxValue]
}

/**
 * Format currency for Y-axis labels
 */
export function formatCurrencyAxis(value: number): string {
  if (value >= 1000000) {
    return `R${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R${(value / 1000).toFixed(0)}k`
  }
  return `R${value.toFixed(0)}`
}

/**
 * Format currency for tooltips
 */
export function formatCurrencyTooltip(value: number): string {
  return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Get chart colors based on theme
 */
export function getChartColors(theme: 'light' | 'dark' = 'light') {
  if (theme === 'dark') {
    return {
      primary: '#ffffff',
      secondary: '#888888',
      gradient: {
        primary: { start: '#ffffff', end: 'rgba(255,255,255,0)' },
        secondary: { start: '#888888', end: 'rgba(136,136,136,0)' },
      },
    }
  }
  
  return {
    primary: '#000000',
    secondary: '#6A6A6A',
    gradient: {
      primary: { start: '#000000', end: 'rgba(0,0,0,0)' },
      secondary: { start: '#6A6A6A', end: 'rgba(106,106,106,0)' },
    },
  }
}

/**
 * Ensure chart data is reactive and updates when source data changes
 */
export function processChartData<T extends ChartDataPoint>(
  rawData: T[],
  transform?: (item: T) => T
): T[] {
  if (!rawData || rawData.length === 0) {
    return []
  }

  const processed = transform ? rawData.map(transform) : rawData

  // Ensure all numeric values are valid
  return processed.map(item => {
    const cleaned = { ...item }
    Object.keys(cleaned).forEach(key => {
      if (typeof cleaned[key] === 'number' && isNaN(cleaned[key])) {
        cleaned[key] = 0
      }
    })
    return cleaned
  })
}

