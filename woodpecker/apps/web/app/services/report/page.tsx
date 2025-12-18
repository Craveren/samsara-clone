'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge, Progress } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useDashboardData } from '@/lib/hooks/use-dashboard-data'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { formatDate } from '@woodpecker/utils'
import { useToast } from '@/lib/hooks'

export default function EstateReportPage() {
  const { toast } = useToast()
  const dashboard = useDashboardData({ autoFetch: true })
  const [reportHistory, setReportHistory] = useLocalStorage<Array<{ id: string; date: string; type: string }>>('report-history', [])

  // Calculate estate metrics from real data
  const estateMetrics = React.useMemo(() => {
    const accounts = dashboard.financial.accounts
    const transactions = dashboard.financial.transactions
    const stats = dashboard.legacy.stats

    const totalAssets = dashboard.financial.metrics.totalBalance
    const documentsCount = stats.documents.total
    const beneficiariesCount = 0 // TODO: Get from people page
    const completion = stats.stories.percentage + stats.documents.percentage + stats.family.percentage + stats.tasks.percentage
    const avgCompletion = completion / 4

    return {
      totalAssets,
      documentsCount,
      beneficiariesCount,
      completion: Math.round(avgCompletion),
      accountsCount: accounts.length,
      transactionsCount: transactions.length,
      monthlyIncome: dashboard.financial.metrics.monthlyIncome,
      monthlyExpenses: dashboard.financial.metrics.monthlyExpenses,
      netWorth: dashboard.financial.metrics.netWorth,
    }
  }, [dashboard])

  // Asset distribution
  const assetDistribution = React.useMemo(() => {
    const accounts = dashboard.financial.accounts
    return [
      {
        name: 'Bank Accounts',
        value: accounts
          .filter(a => ['cheque', 'savings'].includes(a.accountType || ''))
          .reduce((sum, a) => sum + (a.currentBalance || 0), 0),
      },
      {
        name: 'Investments',
        value: accounts
          .filter(a => a.accountType === 'investment')
          .reduce((sum, a) => sum + (a.currentBalance || 0), 0),
      },
      {
        name: 'Credit Cards',
        value: Math.abs(accounts
          .filter(a => a.accountType === 'credit_card')
          .reduce((sum, a) => sum + (a.currentBalance || 0), 0)),
      },
    ].filter(item => item.value > 0)
  }, [dashboard.financial.accounts])

  const COLORS = ['hsl(var(--foreground))', 'hsl(var(--primary))', 'hsl(var(--accent))']

  const handleDownloadPDF = async () => {
    try {
      // Create comprehensive HTML report with styling
      const reportHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Estate Summary Report - ${new Date().toLocaleDateString()}</title>
            <style>
              @media print {
                @page {
                  margin: 1cm;
                  size: A4;
                }
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                padding: 40px;
                color: #1a1a1a;
                line-height: 1.6;
                background: #fff;
              }
              .header {
                border-bottom: 3px solid #1a1a1a;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              h1 {
                font-size: 32px;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 8px;
              }
              .subtitle {
                color: #666;
                font-size: 14px;
                margin-bottom: 4px;
              }
              .generated-date {
                color: #999;
                font-size: 12px;
              }
              .section {
                margin: 30px 0;
                page-break-inside: avoid;
              }
              h2 {
                font-size: 24px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e5e5e5;
              }
              .metrics-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin: 20px 0;
              }
              .metric-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #1a1a1a;
              }
              .metric-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
              }
              .metric-value {
                font-size: 28px;
                font-weight: 700;
                color: #1a1a1a;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background: #fff;
              }
              th {
                background: #f8f9fa;
                padding: 12px;
                text-align: left;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #666;
                border-bottom: 2px solid #e5e5e5;
              }
              td {
                padding: 12px;
                border-bottom: 1px solid #e5e5e5;
                color: #1a1a1a;
              }
              tr:hover {
                background: #f8f9fa;
              }
              .progress-bar {
                width: 100%;
                height: 8px;
                background: #e5e5e5;
                border-radius: 4px;
                overflow: hidden;
                margin: 8px 0;
              }
              .progress-fill {
                height: 100%;
                background: #1a1a1a;
                transition: width 0.3s ease;
              }
              .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 2px solid #e5e5e5;
                text-align: center;
                color: #999;
                font-size: 12px;
              }
              .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                background: #f8f9fa;
                color: #1a1a1a;
                border: 1px solid #e5e5e5;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Estate Summary Report</h1>
              <p class="subtitle">Comprehensive Overview of Your Estate Planning</p>
              <p class="generated-date">Generated: ${new Date().toLocaleDateString('en-ZA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>

            <div class="section">
              <h2>Financial Overview</h2>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">Total Assets</div>
                  <div class="metric-value">R${estateMetrics.totalAssets.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Net Worth</div>
                  <div class="metric-value">R${estateMetrics.netWorth.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Monthly Income</div>
                  <div class="metric-value">R${estateMetrics.monthlyIncome.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Monthly Expenses</div>
                  <div class="metric-value">R${estateMetrics.monthlyExpenses.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </div>
              </div>
              <div class="metric-card" style="margin-top: 20px;">
                <div class="metric-label">Savings Rate</div>
                <div class="metric-value">${dashboard.financial.metrics.savingsRate.toFixed(1)}%</div>
              </div>
            </div>

            <div class="section">
              <h2>Estate Planning Status</h2>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Completion</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Stories</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${dashboard.legacy.stats.stories.percentage}%"></div>
                      </div>
                      ${Math.round(dashboard.legacy.stats.stories.percentage)}%
                    </td>
                    <td><span class="badge">${Math.round(dashboard.legacy.stats.stories.percentage) >= 80 ? 'Excellent' : Math.round(dashboard.legacy.stats.stories.percentage) >= 50 ? 'Good' : 'Needs Attention'}</span></td>
                  </tr>
                  <tr>
                    <td>Documents</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${dashboard.legacy.stats.documents.percentage}%"></div>
                      </div>
                      ${Math.round(dashboard.legacy.stats.documents.percentage)}%
                    </td>
                    <td><span class="badge">${Math.round(dashboard.legacy.stats.documents.percentage) >= 80 ? 'Excellent' : Math.round(dashboard.legacy.stats.documents.percentage) >= 50 ? 'Good' : 'Needs Attention'}</span></td>
                  </tr>
                  <tr>
                    <td>Family & People</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${dashboard.legacy.stats.family.percentage}%"></div>
                      </div>
                      ${Math.round(dashboard.legacy.stats.family.percentage)}%
                    </td>
                    <td><span class="badge">${Math.round(dashboard.legacy.stats.family.percentage) >= 80 ? 'Excellent' : Math.round(dashboard.legacy.stats.family.percentage) >= 50 ? 'Good' : 'Needs Attention'}</span></td>
                  </tr>
                  <tr>
                    <td>Tasks</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${dashboard.legacy.stats.tasks.percentage}%"></div>
                      </div>
                      ${Math.round(dashboard.legacy.stats.tasks.percentage)}%
                    </td>
                    <td><span class="badge">${Math.round(dashboard.legacy.stats.tasks.percentage) >= 80 ? 'Excellent' : Math.round(dashboard.legacy.stats.tasks.percentage) >= 50 ? 'Good' : 'Needs Attention'}</span></td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 20px;">
                <div class="metric-label">Overall Completion</div>
                <div class="progress-bar" style="height: 12px; margin-top: 8px;">
                  <div class="progress-fill" style="width: ${estateMetrics.completion}%"></div>
                </div>
                <div style="font-size: 24px; font-weight: 700; margin-top: 8px;">${estateMetrics.completion}%</div>
              </div>
            </div>

            <div class="section">
              <h2>Account Summary</h2>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Accounts</td>
                    <td><strong>${estateMetrics.accountsCount}</strong></td>
                  </tr>
                  <tr>
                    <td>Total Documents</td>
                    <td><strong>${estateMetrics.documentsCount}</strong></td>
                  </tr>
                  <tr>
                    <td>Beneficiaries</td>
                    <td><strong>${estateMetrics.beneficiariesCount}</strong></td>
                  </tr>
                  <tr>
                    <td>Transactions</td>
                    <td><strong>${estateMetrics.transactionsCount}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>This report was generated by Woodpecker Estate Planning Platform</p>
              <p>For questions or support, please contact your estate planning professional</p>
            </div>
          </body>
        </html>
      `
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(reportHTML)
        printWindow.document.close()
        
        // Wait for content to load, then trigger print dialog
        setTimeout(() => {
          printWindow.print()
          // Also provide download option
          const blob = new Blob([reportHTML], { type: 'text/html' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `estate-report-${new Date().toISOString().split('T')[0]}.html`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 500)
        
        toast.success('Report Ready', 'Your report is ready for printing or download')
      } else {
        // Fallback if popup blocked
        const blob = new Blob([reportHTML], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `estate-report-${new Date().toISOString().split('T')[0]}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Report Downloaded', 'Your estate report has been downloaded')
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Download Failed', 'Could not generate report. Please try again.')
    }
  }

  const handleGenerateReport = () => {
    const newReport = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'full',
    }
    setReportHistory([...reportHistory, newReport])
    toast.success('Report Generated', 'New estate summary report has been generated')
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Estate Summary Report
              </h1>
              <p className="text-muted-foreground">
                Comprehensive overview of your estate planning status and financial health
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateReport}>
                <Icon icon="solar:refresh-bold-duotone" className="h-4 w-4 mr-2" />
                Generate New
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Icon icon="solar:download-bold-duotone" className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
                    <p className="text-2xl font-bold text-foreground">
                      R{estateMetrics.totalAssets.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <Icon icon="solar:wallet-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Documents</p>
                    <p className="text-2xl font-bold text-foreground">{estateMetrics.documentsCount}</p>
                  </div>
                  <Icon icon="solar:folder-with-files-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Beneficiaries</p>
                    <p className="text-2xl font-bold text-foreground">{estateMetrics.beneficiariesCount}</p>
                  </div>
                  <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completion</p>
                    <p className="text-2xl font-bold text-foreground">{estateMetrics.completion}%</p>
                  </div>
                  <Icon icon="solar:check-circle-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Asset Distribution */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>Breakdown of your estate by asset type</CardDescription>
              </CardHeader>
              <CardContent>
                {assetDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assetDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="hsl(var(--foreground))"
                        dataKey="value"
                      >
                        {assetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `R${value.toLocaleString('en-ZA')}`}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <Icon icon="solar:chart-2-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No asset data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>Overall financial wellness metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Health Score</span>
                      <span className="text-2xl font-bold">
                        {Math.round(dashboard.financial.metrics.financialHealth)}/100
                      </span>
                    </div>
                    <Progress value={dashboard.financial.metrics.financialHealth} className="h-3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Monthly Income</p>
                      <p className="text-lg font-semibold text-foreground">
                        R{estateMetrics.monthlyIncome.toLocaleString('en-ZA')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Monthly Expenses</p>
                      <p className="text-lg font-semibold text-foreground">
                        R{estateMetrics.monthlyExpenses.toLocaleString('en-ZA')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Savings Rate</p>
                      <p className="text-lg font-semibold">
                        {dashboard.financial.metrics.savingsRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
                      <p className="text-lg font-semibold">
                        R{estateMetrics.netWorth.toLocaleString('en-ZA')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estate Planning Status */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle>Estate Planning Status</CardTitle>
                <CardDescription>Completion status of key areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Stories', value: dashboard.legacy.stats.stories.percentage },
                    { label: 'Documents', value: dashboard.legacy.stats.documents.percentage },
                    { label: 'Family & People', value: dashboard.legacy.stats.family.percentage },
                    { label: 'Tasks', value: dashboard.legacy.stats.tasks.percentage },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm font-semibold">{Math.round(item.value)}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Financial accounts overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:wallet-money-bold-duotone" className="h-5 w-5 text-foreground" />
                      <span className="text-sm font-medium">Total Accounts</span>
                    </div>
                    <Badge variant="outline">{estateMetrics.accountsCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border/40 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:card-bold-duotone" className="h-5 w-5 text-foreground" />
                      <span className="text-sm font-medium">Transactions</span>
                    </div>
                    <Badge variant="outline">{estateMetrics.transactionsCount}</Badge>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Report Generated</p>
                    <p className="text-sm font-semibold">
                      {new Date().toLocaleDateString('en-ZA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
