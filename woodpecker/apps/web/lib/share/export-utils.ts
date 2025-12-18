/**
 * Export Utilities for Shareable Content
 * Creates beautiful, shareable reports and summaries
 */

export interface ExportOptions {
  format: 'json' | 'csv' | 'text' | 'image'
  includeCharts?: boolean
  includeInsights?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface FinancialSummary {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  accounts: Array<{
    name: string
    balance: number
    type: string
  }>
  insights?: Array<{
    title: string
    description: string
  }>
}

/**
 * Generate shareable text summary
 */
export function generateShareableText(summary: FinancialSummary): string {
  const lines = [
    '💰 Woodpecker Financial Summary',
    '',
    `Total Assets: R ${summary.totalAssets.toLocaleString()}`,
    `Net Worth: R ${summary.netWorth.toLocaleString()}`,
    `Monthly Income: R ${summary.monthlyIncome.toLocaleString()}`,
    `Monthly Expenses: R ${summary.monthlyExpenses.toLocaleString()}`,
    `Savings Rate: ${summary.savingsRate.toFixed(1)}%`,
    '',
    'Accounts:',
    ...summary.accounts.map(acc => 
      `  • ${acc.name}: R ${acc.balance.toLocaleString()}`
    ),
  ]

  if (summary.insights && summary.insights.length > 0) {
    lines.push('', '💡 Insights:')
    summary.insights.forEach(insight => {
      lines.push(`  • ${insight.title}: ${insight.description}`)
    })
  }

  lines.push('', 'Track your finances with Woodpecker! 🪶')

  return lines.join('\n')
}

/**
 * Export to CSV
 */
export function exportToCSV(summary: FinancialSummary): string {
  const rows = [
    ['Metric', 'Value'],
    ['Total Assets', `R ${summary.totalAssets.toLocaleString()}`],
    ['Total Liabilities', `R ${summary.totalLiabilities.toLocaleString()}`],
    ['Net Worth', `R ${summary.netWorth.toLocaleString()}`],
    ['Monthly Income', `R ${summary.monthlyIncome.toLocaleString()}`],
    ['Monthly Expenses', `R ${summary.monthlyExpenses.toLocaleString()}`],
    ['Savings Rate', `${summary.savingsRate.toFixed(1)}%`],
    [],
    ['Account', 'Balance', 'Type'],
    ...summary.accounts.map(acc => [
      acc.name,
      `R ${acc.balance.toLocaleString()}`,
      acc.type,
    ]),
  ]

  return rows.map(row => row.join(',')).join('\n')
}

/**
 * Export to JSON
 */
export function exportToJSON(summary: FinancialSummary): string {
  return JSON.stringify(summary, null, 2)
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Share via Web Share API
 */
export async function shareContent(
  title: string,
  text: string,
  url?: string
): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href,
      })
      return true
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share failed:', error)
      }
      return false
    }
  }
  return false
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Copy failed:', error)
    return false
  }
}

/**
 * Generate shareable image (canvas-based)
 */
export async function generateShareableImage(
  summary: FinancialSummary,
  options?: { width?: number; height?: number }
): Promise<string> {
  const width = options?.width || 1200
  const height = options?.height || 800

  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f8f9fa')
  gradient.addColorStop(1, '#e9ecef')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Title
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 48px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('💰 Woodpecker Financial Summary', width / 2, 80)

  // Summary stats
  ctx.font = '32px Inter, sans-serif'
  const stats = [
    `Net Worth: R ${summary.netWorth.toLocaleString()}`,
    `Monthly Income: R ${summary.monthlyIncome.toLocaleString()}`,
    `Savings Rate: ${summary.savingsRate.toFixed(1)}%`,
  ]

  let y = 200
  stats.forEach(stat => {
    ctx.fillText(stat, width / 2, y)
    y += 60
  })

  // Convert to data URL
  return canvas.toDataURL('image/png')
}

/**
 * Download shareable image
 */
export async function downloadShareableImage(summary: FinancialSummary) {
  try {
    const dataUrl = await generateShareableImage(summary)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `woodpecker-summary-${new Date().toISOString().split('T')[0]}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to generate image:', error)
    throw error
  }
}



