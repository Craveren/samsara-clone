export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(value: string | number | Date) {
  try {
    const date = new Date(value)
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString()
  } catch {
    return ''
  }
}















