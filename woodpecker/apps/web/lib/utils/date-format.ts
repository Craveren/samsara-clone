export function formatDate(value: string | number | Date, format?: string): string {
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) return ''
    
    // Use consistent format to prevent hydration errors
    if (format === 'MMM d, yyyy') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }
    
    // Default: YYYY/MM/DD format for consistency
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  } catch {
    return ''
  }
}

export function formatDateTime(value: string | number | Date): string {
  try {
    const date = new Date(value)
    return isNaN(date.getTime()) ? '' : date.toLocaleString()
  } catch {
    return ''
  }
}


