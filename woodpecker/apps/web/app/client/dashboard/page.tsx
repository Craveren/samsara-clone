'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@woodpecker/ui'
// Icons now use @iconify/react (Akar Icons + Flat Color Icons)
import { Button, Badge, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useDashboardData } from '@/lib/hooks/use-dashboard-data'
import { cn } from '@woodpecker/utils'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
// Chart components removed - using inline charts instead
import { FinancialAIChat } from '@/components/ai/FinancialAIChat'
import { PageIntro } from '@/components/onboarding/PageIntro'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { WelcomeTour } from '@/components/onboarding/WelcomeTour'
import { PeckLogWidget } from '@/components/dashboard/PeckLogWidget'
import { Progress } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { ShareableCard } from '@/components/share/ShareableCard'
import { ShareMenu } from '@/components/share/ShareMenu'
import { FinancialInsightsList } from '@/components/insights/FinancialInsight'
import { generateFinancialInsights } from '@/lib/insights/financial-insights'
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AchievementPanel } from '@/components/achievements/AchievementPanel'
import { QuickActions, QuickActionCard } from '@/components/quick-actions/QuickActions'
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import * as React from 'react'
import { Icon } from '@iconify/react'
import { useUser } from '@clerk/nextjs'
import { useNavigation } from '@/lib/hooks'
import { formatDate } from '@/lib/utils/date-format'
import { formatNumber } from '@/lib/utils/number-format'
import { motion } from 'framer-motion'
import { useThemeColors } from '@/lib/hooks/use-theme-colors'
import { DashboardSkeleton } from '@/components/ui/loading-skeleton'

// Financial data table component - using manual entry
const FinancialTable = React.memo(function FinancialTable({ 
  onRefresh, 
  refreshing,
  isAddAccountOpen,
  setIsAddAccountOpen,
  accounts,
  addAccount,
  updateAccount,
  deleteAccount
}: {
  onRefresh?: () => void
  refreshing?: boolean
  isAddAccountOpen: boolean
  setIsAddAccountOpen: (open: boolean) => void
  accounts: any[]
  addAccount: (account: any) => any
  updateAccount: (id: string, updates: any) => void
  deleteAccount: (id: string) => void
}) {
  const { toast } = useToast()
  const rawAccounts = accounts || []
  const [viewAccount, setViewAccount] = React.useState<any | null>(null)
  const [editAccount, setEditAccount] = React.useState<any | null>(null)
  const [editFormData, setEditFormData] = React.useState<any>({
    accountName: '',
    accountType: 'cheque',
    currentBalance: '',
  })
  const [newAccountData, setNewAccountData] = React.useState<any>({
    accountName: '',
    accountType: 'cheque',
    currentBalance: '',
  })

  // Transform raw accounts to financial data format
  const financialData = React.useMemo(() => {
    if (!rawAccounts || rawAccounts.length === 0) return []
    return rawAccounts.map((acc: any) => ({
      id: acc.id,
      account: acc.accountName || acc.bankName || 'Account',
      institution: acc.bankName || 'Manual Entry',
      balance: acc.currentBalance || acc.balance || 0,
      type: acc.accountType || 'checking',
      lastUpdated: acc.lastUpdated || new Date().toISOString(),
    }))
  }, [rawAccounts])

  // Calculate total value from financial accounts
  const totalValue = React.useMemo(() => {
    if (financialData && financialData.length > 0) {
      return financialData.reduce((sum, item) => sum + (item.balance || 0), 0)
    }
    return 0
  }, [financialData])


  return (
    <Card className="border border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Financial Overview</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Connected accounts and balances</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8 border-border/60 hover:border-border"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <Icon icon="solar:refresh-bold" className={cn('h-3.5 w-3.5 mr-1.5', refreshing && 'animate-spin')} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8 bg-foreground text-background hover:bg-foreground/90 border-foreground"
              onClick={() => setIsAddAccountOpen(true)}
            >
              <Icon icon="solar:add-circle-bold" className="h-3.5 w-3.5 mr-1.5" />
              Add account
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {false ? (
          <div className="flex items-center justify-center py-16">
            <Icon icon="solar:refresh-bold" className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : financialData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-6 px-4">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Icon icon="solar:wallet-bold-duotone" className="h-10 w-10 text-muted-foreground" />
            </div>
              <div className="space-y-3 max-w-md">
                <h3 className="text-lg font-semibold text-foreground">
                  Start a manual financial profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter balances, account numbers, and account types manually. We focus on clarity over automation so you control every data point.
                </p>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border text-left space-y-2">
                  <p className="text-xs font-semibold text-foreground mb-2">What to capture:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Account name, number (masked), and institution</li>
                    <li>Current balance and account type</li>
                    <li>Last updated date for audit trail</li>
                  </ul>
                </div>
              </div>
              <Button
                size="sm"
                className="text-xs h-9 bg-foreground text-background hover:bg-foreground/90"
                onClick={() => setIsAddAccountOpen(true)}
              >
                <Icon icon="solar:add-circle-bold" className="h-4 w-4 mr-2" />
                Add first account
              </Button>
              <p className="text-xs text-muted-foreground">
                Data stays in your browser until you choose to sync it.
              </p>
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Account</th>
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Institution</th>
                  <th className="text-right text-xs font-semibold text-foreground px-4 py-3">Balance</th>
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-foreground px-4 py-3">Last Updated</th>
                  <th className="text-right text-xs font-semibold text-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {financialData.map((item) => (
                  <tr key={item.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                          <Icon icon="solar:card-bold-duotone" className="h-4 w-4 text-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">{item.account}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-muted-foreground">{item.institution}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-semibold text-foreground financial-number">
                        R {formatNumber(item.balance)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-foreground/5 text-foreground capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">{item.lastUpdated}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-muted/60"
                          title="View Details"
                          onClick={() => {
                            const account = rawAccounts.find((acc: any) => acc.id === item.id)
                            setViewAccount(account || item)
                          }}
                        >
                          <Icon icon="solar:eye-bold" className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-muted/60"
                          title="Edit Account"
                          onClick={() => {
                            const account = rawAccounts.find((acc: any) => acc.id === item.id)
                            if (account) {
                              setEditFormData({
                                accountName: account.accountName || account.bankName || '',
                                accountType: account.accountType || 'cheque',
                                currentBalance: account.currentBalance || 0,
                              })
                              setEditAccount(account)
                            }
                          }}
                        >
                          <Icon icon="solar:pen-bold" className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                          title="Remove Account"
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this account?')) {
                              deleteAccount(item.id)
                              if (onRefresh) onRefresh()
                            }
                          }}
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-foreground/5 border-t-2 border-border">
                  <td colSpan={2} className="px-4 py-4">
                    <p className="text-sm font-bold text-foreground">Total Value</p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-lg font-bold text-foreground">
                      R {formatNumber(totalValue)}
                    </p>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>

      {/* View Account Dialog */}
      <Dialog open={!!viewAccount} onOpenChange={(open) => !open && setViewAccount(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>
              View detailed information about this account
            </DialogDescription>
          </DialogHeader>
          {viewAccount && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Bank Name</Label>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {viewAccount.bankName || viewAccount.institution || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Account Type</Label>
                  <p className="text-sm font-medium text-foreground mt-1 capitalize">
                    {viewAccount.accountType || viewAccount.type || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Account Number</Label>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {viewAccount.accountNumber ? `•••• ${viewAccount.accountNumber.slice(-4)}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Branch Code</Label>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {viewAccount.branchCode || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Account Holder</Label>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {viewAccount.accountHolder || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Balance</Label>
                  <p className="text-sm font-semibold text-foreground mt-1 financial-number">
                    R {formatNumber((viewAccount.currentBalance || viewAccount.balance || 0), { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Last Updated</Label>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {viewAccount.lastUpdated ? formatDate(viewAccount.lastUpdated, 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {viewAccount.isActive !== false ? (
                      <Badge className="border-border/60">Active</Badge>
                    ) : (
                      <Badge className="border-border/60">Inactive</Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setViewAccount(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={!!editAccount} onOpenChange={(open) => !open && setEditAccount(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account information
            </DialogDescription>
          </DialogHeader>
          {editAccount && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-accountName">Account Name</Label>
                <Input
                  id="edit-accountName"
                  value={editFormData.accountName}
                  onChange={(e) => setEditFormData({ ...editFormData, accountName: e.target.value })}
                  placeholder="e.g., Main Savings, Investment Portfolio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-accountType">Account Type</Label>
                <Select
                  value={editFormData.accountType}
                  onValueChange={(value) => setEditFormData({ ...editFormData, accountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cheque">Cheque Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="retirement">Retirement Fund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-balance">Current Balance (ZAR)</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  step="0.01"
                  value={editFormData.currentBalance}
                  onChange={(e) => setEditFormData({ ...editFormData, currentBalance: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              className="text-foreground border-border/60 hover:bg-muted/50 hover:text-foreground/80"
              onClick={() => {
                if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
                  deleteAccount(editAccount.id)
                  setEditAccount(null)
                  if (onRefresh) onRefresh()
                }
              }}
            >
              <Icon icon="solar:trash-bin-trash-bold" className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditAccount(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!editFormData.accountName || !editFormData.currentBalance) {
                    toast.error('Missing Information', 'Please provide an account name and balance')
                    return
                  }
                  updateAccount(editAccount.id, {
                    accountName: editFormData.accountName,
                    bankName: editFormData.accountName,
                    accountType: editFormData.accountType,
                    currentBalance: parseFloat(editFormData.currentBalance) || 0,
                    availableBalance: parseFloat(editFormData.currentBalance) || 0,
                  })
                  setEditAccount(null)
                  if (onRefresh) onRefresh()
                }}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Account Manually</DialogTitle>
            <DialogDescription>Capture balances without any third-party connections.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-accountName">Account Name</Label>
              <Input
                id="new-accountName"
                value={newAccountData.accountName}
                onChange={(e) => setNewAccountData({ ...newAccountData, accountName: e.target.value })}
                placeholder="e.g., Main Savings, Investment Portfolio"
              />
              <p className="text-xs text-muted-foreground">Give your account a descriptive name</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-accountType">Account Type</Label>
              <Select
                value={newAccountData.accountType}
                onValueChange={(value) => setNewAccountData({ ...newAccountData, accountType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cheque">Cheque Account</SelectItem>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="investment">Investment Account</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="retirement">Retirement Fund</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-balance">Current Balance (ZAR)</Label>
              <Input
                id="new-balance"
                type="number"
                step="0.01"
                value={newAccountData.currentBalance}
                onChange={(e) => setNewAccountData({ ...newAccountData, currentBalance: e.target.value })}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">Enter the current balance for this account</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newAccountData.accountName || !newAccountData.currentBalance) {
                  toast.error('Missing Information', 'Please provide an account name and balance')
                  return
                }
                addAccount({
                  bankName: newAccountData.accountName,
                  accountName: newAccountData.accountName,
                  accountType: newAccountData.accountType,
                  accountHolder: 'Account Holder',
                  currentBalance: parseFloat(newAccountData.currentBalance) || 0,
                  availableBalance: parseFloat(newAccountData.currentBalance) || 0,
                  currency: 'ZAR',
                })
                setIsAddAccountOpen(false)
                setNewAccountData({
                  accountName: '',
                  accountType: 'cheque',
                  currentBalance: '',
                })
                if (onRefresh) onRefresh()
              }}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Save Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
})

// Asset Distribution Pie Chart - Now using AssetDistributionPieChart component

// Monthly Growth Chart - Beautiful area chart matching lawyer dashboard style
const MonthlyGrowthChart = React.memo(function MonthlyGrowthChart({ chartData, accounts, totalValue }: { chartData: any[], accounts: any[], totalValue?: number }) {
  // Calculate totalValue from accounts if not provided
  const calculatedTotalValue = React.useMemo(() => {
    if (totalValue !== undefined) return totalValue
    return accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0)
  }, [
    totalValue, 
    // Include actual account data for reactivity
    JSON.stringify(accounts.map(a => ({
      id: a.id,
      balance: a.currentBalance || 0,
      type: a.accountType
    })))
  ])

  const processedData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) {
      // Fallback to empty data
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (5 - i))
        // Use consistent month formatting to prevent hydration errors
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return {
          month: months[date.getMonth()],
          value: 0,
          growth: 0,
        }
      })
    }

    return chartData.map((item, idx) => ({
      month: item.month,
      value: item.total || 0,
      growth: idx > 0 && chartData[idx - 1].total > 0 
        ? Math.round(((item.total - chartData[idx - 1].total) / chartData[idx - 1].total) * 100) 
        : 0,
    }))
  }, [
    chartData, 
    // Include actual account data for reactivity - ensures chart updates when accounts change
    JSON.stringify(accounts.map(a => ({
      id: a.id,
      balance: a.currentBalance || 0,
      type: a.accountType
    }))),
  ])

  // Calculate Y-axis domain for proper scaling
  const yAxisDomain = React.useMemo(() => {
    const values = processedData.map(d => d.value).filter(v => v > 0)
    if (values.length === 0) return [0, 1000]
    
    const max = Math.max(...values)
    const min = Math.min(...values)
    const padding = (max - min) * 0.1
    
    return [Math.max(0, min - padding * 0.5), max + padding]
  }, [processedData])

  // Get theme colors dynamically
  const themeColors = useThemeColors()

  return (
    <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon icon="solar:graph-up-bold-duotone" className="h-4 w-4" />
          Monthly Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full" style={{ minHeight: '300px', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={0} key={`monthly-growth-${chartData.length}-${chartData[chartData.length - 1]?.total || 0}-${accounts.length}-${calculatedTotalValue}-${accounts.map(a => `${a.id}-${a.currentBalance || 0}`).join(',')}`}>
            <AreaChart data={processedData}>
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0.95}/>
                  <stop offset="50%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0.5}/>
                  <stop offset="100%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={`hsl(${themeColors.border})`} opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: `hsl(${themeColors.mutedForeground})` }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: `hsl(${themeColors.mutedForeground})` }}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `R${(value / 1000).toFixed(0)}k`
                  return `R${value.toFixed(0)}`
                }}
                tickLine={false}
                axisLine={false}
                domain={yAxisDomain}
                allowDataOverflow={false}
              />
              <RechartsTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {payload[0].payload.month}
                        </p>
                        <p className="text-xs font-medium text-foreground">
                                      Value: R {formatNumber(payload[0].value)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Growth: +{payload[0].payload.growth}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={`hsl(${themeColors.foreground})`}
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorGrowth)" 
                dot={false}
                activeDot={{ r: 5, fill: `hsl(${themeColors.foreground})`, strokeWidth: 2, stroke: `hsl(${themeColors.background})` }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

export default function ClientDashboardPage() {
  const { toast } = useToast()
  const { navigate } = useNavigation()
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const themeColors = useThemeColors()
  
  // Only fetch dashboard data if we're actually on the dashboard page (not sub-pages)
  const isOnDashboard = pathname === '/client/dashboard'
  
  // Unified dashboard data hook - replaces all individual state management
  // Only auto-fetch if we're on the exact dashboard page
  const dashboard = useDashboardData({
    autoFetch: isOnDashboard && !!user,
    syncFinancialWithAPI: isOnDashboard && !!user, // Only sync when on dashboard and user is authenticated
  })

  // Legacy stats from dashboard hook
  const legacyStats = dashboard.legacy.stats

  // Derived data from unified hook
  const financialData = React.useMemo(() => {
    return dashboard.financial.accounts.map(acc => ({
      id: acc.id,
      account: acc.bankName || 'Account',
      institution: acc.bankName || 'Manual Entry',
      balance: acc.currentBalance || 0,
      type: acc.accountType || 'cheque',
      lastUpdated: acc.lastUpdated || new Date().toISOString(),
    }))
  }, [dashboard.financial.accounts])

  const manualAccounts = dashboard.financial.accounts
  const manualTransactions = dashboard.financial.transactions
  const recentActivities = dashboard.activities.items.map(activity => {
    const timestamp = activity.timestamp instanceof Date 
      ? activity.timestamp 
      : new Date(activity.timestamp || Date.now())
    
    return {
      id: activity.id,
      type: activity.type,
      icon: activity.icon,
      text: activity.description,
      time: formatDate(timestamp, 'MMM d, yyyy'),
      color: activity.color,
      link: activity.link || '#',
    }
  })
  const activitiesLoading = dashboard.activities.isLoading
  const financialLoading = dashboard.financial.isLoading
  const isLoading = activitiesLoading || financialLoading

  // Handle manual account updates - only run once on mount and only if on dashboard page
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    // Only run if we're actually on the dashboard page (not sub-pages)
    if (pathname !== '/client/dashboard') return
    
    const params = new URLSearchParams(window.location.search)
    const connected = params.get('connected')
    const error = params.get('error')
    
    // Only show toast if we have URL params (from redirect) and we're on dashboard
    if (connected === 'true') {
      toast.success('Account Connected', 'Your bank account has been successfully connected!')
      dashboard.refresh()
      // Clean URL immediately
      window.history.replaceState({}, '', '/client/dashboard')
    } else if (error) {
      toast.error('Connection Failed', decodeURIComponent(error))
      window.history.replaceState({}, '', '/client/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // Only run when pathname changes and is dashboard

  // Use chart data from unified hook
  const chartData = React.useMemo(() => {
    const data = dashboard.charts.data
    // Ensure chart data is valid and has at least some values
    if (!data || data.length === 0) {
      // Return default data structure for charts
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (5 - i))
        // Use consistent month formatting to prevent hydration errors
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return {
          month: months[date.getMonth()],
          total: 0,
          savings: 0,
          cheque: 0,
          credit: 0,
          income: 0,
          expenses: 0,
        }
      })
    }
    return data
  }, [dashboard.charts.data])

  // Calculate total value from unified hook metrics
  const totalValue = dashboard.financial.metrics.totalBalance

  // Generate financial insights
  const financialInsights = React.useMemo(() => {
    const financialData = {
      totalAssets: dashboard.financial.metrics.totalBalance,
      totalLiabilities: 0, // TODO: Add liabilities tracking
      monthlyIncome: dashboard.financial.metrics.monthlyIncome,
      monthlyExpenses: dashboard.financial.metrics.monthlyExpenses,
      accounts: dashboard.financial.accounts.map(acc => ({
        id: acc.id,
        balance: acc.currentBalance || 0,
        type: acc.accountType || 'other',
        lastUpdated: acc.lastUpdated || new Date().toISOString(),
      })),
      transactions: dashboard.financial.transactions.map(t => ({
        id: t.id,
        amount: t.amount || 0,
        category: t.category || 'other',
        date: t.date || new Date().toISOString(),
      })),
    }
    return generateFinancialInsights(financialData)
  }, [
    dashboard.financial.metrics.totalBalance,
    dashboard.financial.metrics.monthlyIncome,
    dashboard.financial.metrics.monthlyExpenses,
    dashboard.financial.accounts,
    dashboard.financial.transactions,
  ])

  // Calculate achievement data
  const achievementData = React.useMemo(() => {
    const monthlyExpenses = dashboard.financial.metrics.monthlyExpenses
    const emergencyFundMonths = monthlyExpenses > 0
      ? (dashboard.financial.metrics.totalBalance / monthlyExpenses)
      : 0
    const savingsRate = dashboard.financial.metrics.monthlyIncome > 0
      ? ((dashboard.financial.metrics.monthlyIncome - monthlyExpenses) / dashboard.financial.metrics.monthlyIncome) * 100
      : 0
    const debtRatio = dashboard.financial.metrics.totalBalance > 0
      ? (0 / dashboard.financial.metrics.totalBalance) * 100 // TODO: Add liabilities
      : 0

    return {
      totalAssets: dashboard.financial.metrics.totalBalance,
      netWorth: dashboard.financial.metrics.totalBalance,
      savingsRate,
      emergencyFundMonths,
      debtRatio,
      accountsCount: dashboard.financial.accounts.length,
      daysActive: 30, // TODO: Track actual days
      transactionsCount: dashboard.financial.transactions.length,
    }
  }, [
    dashboard.financial.metrics.totalBalance,
    dashboard.financial.metrics.monthlyIncome,
    dashboard.financial.metrics.monthlyExpenses,
    dashboard.financial.accounts.length,
    dashboard.financial.transactions.length,
  ])

  // Financial summary for sharing
  const financialSummary = React.useMemo(() => {
    const monthlyExpenses = dashboard.financial.metrics.monthlyExpenses
    const savingsRate = dashboard.financial.metrics.monthlyIncome > 0
      ? ((dashboard.financial.metrics.monthlyIncome - monthlyExpenses) / dashboard.financial.metrics.monthlyIncome) * 100
      : 0

    return {
      totalAssets: dashboard.financial.metrics.totalBalance,
      totalLiabilities: 0,
      netWorth: dashboard.financial.metrics.totalBalance,
      monthlyIncome: dashboard.financial.metrics.monthlyIncome,
      monthlyExpenses,
      savingsRate,
      accounts: dashboard.financial.accounts.map(acc => ({
        name: acc.bankName || 'Account',
        balance: acc.currentBalance || 0,
        type: acc.accountType || 'other',
      })),
      insights: financialInsights.slice(0, 3).map(insight => ({
        title: insight.title,
        description: insight.description,
      })),
    }
  }, [
    dashboard.financial.metrics,
    dashboard.financial.accounts,
    financialInsights,
  ])

  // Extract inline useMemo calls to top level
  // Income vs Expenses chart data
  // Force chart updates when accounts change - use a reactive key
  // This key changes whenever accounts are added/updated, forcing chart re-renders
  const chartUpdateKey = React.useMemo(() => {
    const accountIds = dashboard.financial.accounts.map(a => a.id).join(',')
    const accountBalances = dashboard.financial.accounts.map(a => a.currentBalance || 0).join(',')
    const accountTypes = dashboard.financial.accounts.map(a => a.accountType).join(',')
    const lastUpdated = dashboard.financial.accounts.length > 0 
      ? dashboard.financial.accounts.map(a => a.lastUpdated || '').join(',')
      : ''
    return `${dashboard.financial.accounts.length}-${dashboard.financial.metrics.totalBalance}-${accountIds}-${accountBalances}-${accountTypes}-${lastUpdated}`
  }, [
    dashboard.financial.accounts.length,
    dashboard.financial.metrics.totalBalance,
    // Include full account data to detect any changes - ensures charts update immediately
    JSON.stringify(dashboard.financial.accounts.map(a => ({
      id: a.id,
      balance: a.currentBalance || 0,
      type: a.accountType,
      updated: a.lastUpdated
    }))),
  ])

  const incomeExpenseChartData = React.useMemo(() => {
    const processed = chartData.map(item => ({
      month: item.month,
      income: item.income || 0,
      expenses: item.expenses || 0,
      savings: (item.income || 0) - (item.expenses || 0),
    }))
    
    // If all values are 0, show account balance trend instead
    const hasData = processed.some(d => d.income > 0 || d.expenses > 0)
    if (!hasData && totalValue > 0) {
      // Show account balance growth over time
      return chartData.map((item, idx) => {
        const monthsAgo = 5 - idx
        const growthFactor = Math.max(0.7, 1 - (monthsAgo * 0.05))
        return {
          month: item.month,
          income: Math.round(totalValue * growthFactor * 0.6), // Simulated income
          expenses: Math.round(totalValue * growthFactor * 0.4), // Simulated expenses
          savings: Math.round(totalValue * growthFactor * 0.2),
        }
      })
    }
    
    return processed
  }, [
    chartData, 
    totalValue, 
    dashboard.financial.accounts.length,
    chartUpdateKey,
  ])

  // Y-axis domain for income/expenses chart
  const incomeExpenseYAxisDomain = React.useMemo(() => {
    const data = chartData.map(item => ({
      income: item.income || 0,
      expenses: item.expenses || 0,
    }))
    const allValues = data.flatMap(d => [d.income, d.expenses])
    const max = Math.max(...allValues, totalValue * 0.6, 1000)
    const min = 0
    const padding = max * 0.1
    return [min, max + padding]
  }, [chartData, totalValue])

  // Expense categories pie chart data - REACTIVE to transaction changes
  const expenseCategoriesData = React.useMemo(() => {
    const transactions = dashboard.financial.transactions
    const categoryMap = new Map<string, number>()
    transactions
      .filter((t: any) => t.type === 'expense')
      .forEach((t: any) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Math.abs(t.amount))
      })

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [
    // Include actual transaction data for reactivity - ensures chart updates when transactions change
    JSON.stringify(dashboard.financial.transactions.map(t => ({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: t.amount
    }))),
    chartUpdateKey,
  ])

  // Expense categories pie chart colors - REACTIVE to transaction changes
  const expenseCategoriesColors = React.useMemo(() => {
    const transactions = dashboard.financial.transactions
    const categoryMap = new Map<string, number>()
    transactions
      .filter((t: any) => t.type === 'expense')
      .forEach((t: any) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Math.abs(t.amount))
      })

    const sorted = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    // Use theme colors for chart - create gradient from foreground to muted
    const getThemeColor = (idx: number) => {
      // Create a gradient of shades from foreground to muted-foreground
      const baseColors = [
        themeColors.foreground,
        themeColors.mutedForeground,
        themeColors.border,
        themeColors.muted,
      ]
      return baseColors[idx % baseColors.length]
    }
    return sorted.map((_, idx) => getThemeColor(idx))
  }, [
    // Include actual transaction data for reactivity
    JSON.stringify(dashboard.financial.transactions.map(t => ({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: t.amount
    }))),
    chartUpdateKey,
    themeColors.foreground,
    themeColors.mutedForeground,
    themeColors.border,
    themeColors.muted,
  ])

  // Asset distribution pie chart data - REACTIVE to account changes
  const assetDistributionData = React.useMemo(() => {
    const accounts = dashboard.financial.accounts
    if (accounts.length === 0) {
      return [
        { name: 'No Accounts', value: 0 },
      ]
    }
    
    const accountMap = new Map<string, number>()
    accounts.forEach((acc: any) => {
      const type = acc.accountType || 'other'
      const current = accountMap.get(type) || 0
      accountMap.set(type, current + (acc.currentBalance || 0))
    })

    return Array.from(accountMap.entries())
      .map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '), 
        value 
      }))
      .filter(item => item.value > 0)
  }, [
    // Include actual account data for reactivity - ensures chart updates when accounts/balances change
    JSON.stringify(dashboard.financial.accounts.map(a => ({
      id: a.id,
      type: a.accountType,
      balance: a.currentBalance || 0
    }))),
    totalValue,
    chartUpdateKey,
  ])

  // Asset distribution pie chart colors - REACTIVE to account changes
  const assetDistributionColors = React.useMemo(() => {
    const accounts = dashboard.financial.accounts
    const accountMap = new Map<string, number>()
    accounts.forEach((acc: any) => {
      const type = acc.accountType || 'other'
      const current = accountMap.get(type) || 0
      accountMap.set(type, current + (acc.currentBalance || 0))
    })

    const sorted = Array.from(accountMap.entries())
      .map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '), 
        value 
      }))
      .filter(item => item.value > 0)

    // Use theme colors for chart - create gradient from foreground to muted
    const getThemeColor = (idx: number) => {
      // Create a gradient of shades from foreground to muted-foreground
      const baseColors = [
        themeColors.foreground,
        themeColors.mutedForeground,
        themeColors.border,
        themeColors.muted,
      ]
      return baseColors[idx % baseColors.length]
    }
    return sorted.map((_, idx) => getThemeColor(idx))
  }, [
    // Include actual account data for reactivity
    JSON.stringify(dashboard.financial.accounts.map(a => ({
      id: a.id,
      type: a.accountType,
      balance: a.currentBalance || 0
    }))),
    chartUpdateKey,
    themeColors.foreground,
    themeColors.mutedForeground,
    themeColors.border,
    themeColors.muted,
  ])

  // Monthly income vs expenses chart data (for growth tab)
  const monthlyIncomeExpenseData = React.useMemo(() => {
    return chartData.map(item => ({
      month: item.month,
      income: item.income || 0,
      expenses: item.expenses || 0,
      savings: (item.income || 0) - (item.expenses || 0),
    }))
  }, [
    chartData,
    chartUpdateKey, // Include reactive key
    dashboard.financial.accounts.length,
  ])

  // Category breakdown area chart data - REACTIVE to transaction changes
  const transactionsKey = React.useMemo(() => {
    return JSON.stringify(dashboard.financial.transactions.map(t => ({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: t.amount
    })))
  }, [dashboard.financial.transactions])
  
  const categoryBreakdownData = React.useMemo(() => {
    const categoryMap = new Map<string, number>()
    dashboard.financial.transactions
      .filter((t: any) => t.type === 'expense')
      .forEach((t: any) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Math.abs(t.amount))
      })

    const sorted = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
    
    // Convert to area chart format with months
    return sorted.map((item, idx) => ({
      category: item.name,
      value: item.value,
      index: idx,
    }))
  }, [
    transactionsKey,
    chartUpdateKey,
  ])

  // Check if onboarding was already completed
  const [onboardingComplete, setOnboardingComplete] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const storedByUser = user?.id ? localStorage.getItem(`onboarding-completed-client-${user.id}`) === 'true' : false
    const legacyStored = localStorage.getItem('onboarding-completed-client') === 'true'
    return storedByUser || legacyStored
  })
  const [tourComplete, setTourComplete] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    // Check per-user tour completion
    if (user?.id) {
      return localStorage.getItem(`welcome-tour-completed-${user.id}`) === 'true' || 
             localStorage.getItem('welcome-tour-completed') === 'true'
    }
    return localStorage.getItem('welcome-tour-completed') === 'true'
  })
  const [refreshing, setRefreshing] = React.useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = React.useState(false)
  
  const handleRefresh = React.useCallback(() => {
    setRefreshing(true)
    if (dashboard && dashboard.refresh) {
      dashboard.refresh()
    }
    setTimeout(() => {
      setRefreshing(false)
      if (toast && toast.success) {
        toast.success('Refreshed', 'Financial data updated')
      }
    }, 1000)
  }, [dashboard, toast])

  // Show loading skeleton while data is loading (AFTER ALL hooks)
  if (isLoading && !dashboard.financial.accounts.length && !dashboard.activities.items.length) {
    return (
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      {/* Guest fallback - show only when not authenticated */}
      {!user ? (
        <PageIntro
          pageId="dashboard-guest"
          pageName="DASHBOARD"
          description="Please sign in and choose your account to continue."
          highlights={[]}
        >
          <div className="flex h-screen bg-background">
            <RoleBasedSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <Card className="border border-border/60 bg-background/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>Sign in and pick an account to access your dashboard.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Button variant="default" onClick={() => router.push('/sign-in')}>
                      <Icon icon="solar:login-2-bold-duotone" className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/onboarding/account-type')}>
                      <Icon icon="solar:play-bold-duotone" className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </PageIntro>
      ) : null}

      {/* Authenticated content */}
      {user && (
        <>
      {/* Always render onboarding flow - it will overlay on top */}
      <OnboardingFlow 
        onComplete={() => {
          setOnboardingComplete(true)
          if (user?.id) {
            localStorage.setItem(`onboarding-completed-client-${user.id}`, 'true')
          }
          localStorage.setItem('onboarding-completed-client', 'true')
        }} 
        accountType="client"
        skipIfCompleted={true}
        userId={user?.id}
      />
      
      {/* Welcome tour - only shows after onboarding completes, once per user */}
      {onboardingComplete && !tourComplete ? (
        <WelcomeTour
          steps={[
            {
              selector: '[data-intro="stats-grid"]',
              title: 'Financial Overview',
              description: "View your key financial metrics and legacy statistics at a glance. Click any card to explore that section.",
              position: 'bottom'
            },
            {
              selector: '[data-intro="financial-chart"]',
              title: 'Interactive Charts',
              description: "These charts show your financial trends over time. Switch between Overview, Distribution, and Growth tabs to see different perspectives.",
              position: 'bottom'
            },
            {
              selector: '[data-intro="ai-chat"]',
              title: 'AI Financial Assistant',
              description: "Get AI-powered financial insights and recommendations based on your data. Ask questions about your finances or get suggestions.",
              position: 'left'
            },
            {
              selector: '[data-intro="recent-activity"]',
              title: 'Activity Feed',
              description: "See your recent actions and updates across your estate planning workflow. Stay informed about all changes.",
              position: 'top'
            }
          ]}
          onComplete={() => {
            setTourComplete(true)
            // Store completion per user
            if (user?.id) {
              localStorage.setItem(`welcome-tour-completed-${user.id}`, 'true')
            }
            localStorage.setItem('welcome-tour-completed', 'true')
          }}
          enabled={!tourComplete}
        />
      ) : null}
      <PageIntro 
            pageId="dashboard" 
            pageName="DASHBOARD"
            description="Your central hub for managing your estate and financial information. Track your assets, view insights, and manage your legacy planning."
            highlights={[
              {
                selector: '[data-intro="stats-grid"]',
                description: "View your key financial metrics and legacy statistics at a glance",
                position: 'bottom'
              },
              {
                selector: '[data-intro="financial-chart"]',
                description: "Interactive charts show your financial trends over time. Switch between different chart types using the templates above.",
                position: 'bottom'
              },
              {
                selector: '[data-intro="ai-chat"]',
                description: "Get AI-powered financial insights and recommendations based on your data",
                position: 'bottom'
              },
              {
                selector: '[data-intro="recent-activity"]',
                description: "See your recent actions and updates across your estate planning workflow",
                position: 'bottom'
              }
            ]}
          >
          <div className="flex h-screen bg-background">
            <RoleBasedSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Header - Matching My Lawyers Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                    Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Overview of your estate and financial information
                  </p>
                </div>
                 <div className="flex items-center gap-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => navigate.to('documents')}
                     className="border-border/60 hover:border-border hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                   >
                     <Icon icon="solar:folder-with-files-bold-duotone" className="h-4 w-4 mr-2" />
                     Documents
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => navigate.to('tasks')}
                     className="border-border/60 hover:border-border hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                   >
                     <Icon icon="solar:checklist-bold-duotone" className="h-4 w-4 mr-2" />
                     Tasks
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={handleRefresh}
                     disabled={refreshing}
                     className="border-border/60 hover:border-border hover:shadow-md hover:scale-[1.02] transition-all duration-200 disabled:hover:scale-100"
                   >
                       <Icon icon="solar:refresh-bold" className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
                     Refresh
                   </Button>
                 </div>
              </div>
            </div>

            {/* Stats Grid - Enhanced Design with Subtle Animations */}
            {financialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border border-border/60 bg-background/50">
                    <CardContent className="p-5">
                      <div className="animate-pulse space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-muted/30" />
                        <div className="h-6 w-20 bg-muted/30 rounded" />
                        <div className="h-2 w-full bg-muted/30 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8" 
              data-intro="stats-grid"
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border border-border/60 hover:border-border/80 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 cursor-pointer group bg-background/50 backdrop-blur-sm hover:scale-[1.02] relative overflow-hidden"
                  onClick={() => navigate.to('legacy')}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center border border-border/40"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon icon="solar:book-bookmark-bold-duotone" className="h-6 w-6 text-foreground" />
                      </motion.div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Stories</p>
                        <p className="text-2xl font-bold text-foreground">{legacyStats.stories.completed}/{legacyStats.stories.total}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={legacyStats.stories.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{legacyStats.stories.percentage}% complete</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border border-border/60 hover:border-border/80 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 cursor-pointer bg-background/50 backdrop-blur-sm hover:scale-[1.02] relative overflow-hidden"
                  onClick={() => navigate.to('documents')}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center border border-border/40"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon icon="solar:folder-with-files-bold-duotone" className="h-6 w-6 text-foreground" />
                      </motion.div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Documents</p>
                        <p className="text-2xl font-bold text-foreground">{legacyStats.documents.completed}/{legacyStats.documents.total}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={legacyStats.documents.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{legacyStats.documents.percentage}% complete</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border border-border/60 hover:border-border/80 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 cursor-pointer bg-background/50 backdrop-blur-sm hover:scale-[1.02] relative overflow-hidden"
                  onClick={() => navigate.toPath('/people')}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center border border-border/40"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                      </motion.div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Family</p>
                        <p className="text-2xl font-bold text-foreground">{legacyStats.family.completed}/{legacyStats.family.total}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={legacyStats.family.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{legacyStats.family.percentage}% complete</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Financial Card - Enhanced with Subtle Animations */}
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border border-border/60 bg-background/95 backdrop-blur-sm hover:border-border/80 hover:shadow-xl transition-all duration-300 cursor-pointer group text-foreground relative overflow-hidden rounded-2xl aspect-[85.60/53.98] min-h-[200px]">
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-foreground rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-foreground rounded-full blur-2xl" />
                </div>
                <CardContent className="p-5 relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="h-7 w-7 rounded-lg bg-muted/40 flex items-center justify-center border border-border/40"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon icon="solar:wallet-bold-duotone" className="h-3.5 w-3.5 text-foreground" />
                      </motion.div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/30 backdrop-blur-sm text-[10px] font-semibold border border-border/40">
                        <motion.div 
                          className="h-1.5 w-1.5 rounded-full bg-foreground"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-foreground">Live</span>
                      </div>
                    </div>
                    {/* Subtle Icon - Far Right */}
                    <motion.div 
                      className="w-12 h-10 flex-shrink-0 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon icon="solar:chart-2-bold-duotone" className="h-8 w-8 text-foreground/20" />
                    </motion.div>
                  </div>
                  <div className="mb-3">
                    <div className="text-[10px] font-medium text-muted-foreground mb-1 tracking-wider uppercase">
                      Total Assets
                    </div>
                    <motion.div 
                      className="text-2xl font-bold tracking-tight financial-number text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {false ? (
                        <Icon icon="solar:refresh-bold" className="h-5 w-5 animate-spin" />
                      ) : (
                        `R ${formatNumber(totalValue, { maximumFractionDigits: 0 })}`
                      )}
                    </motion.div>
                  </div>
                  {manualAccounts.length > 0 && (
                    <div className="mt-auto pt-3 border-t border-border/40">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground font-medium">Available</span>
                        <span className="font-bold financial-number text-foreground">R {formatNumber(manualAccounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0), { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
            )}

            {/* Main Content: Charts with Tabs */}
            {financialLoading ? (
              <div className="mb-6">
                <Card className="border border-border/60">
                  <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Icon icon="solar:refresh-bold" className="h-6 w-6 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Loading financial data...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs defaultValue="overview" className="mb-6">
                <TabsList className="grid w-full grid-cols-3 bg-muted/30 border border-border/40">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Icon icon="solar:chart-bold-duotone" className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="distribution" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Icon icon="solar:pie-chart-2-bold-duotone" className="h-4 w-4 mr-2" />
                    Distribution
                  </TabsTrigger>
                  <TabsTrigger value="growth" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Icon icon="solar:graph-up-bold-duotone" className="h-4 w-4 mr-2" />
                    Growth
                  </TabsTrigger>
                </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Income vs Expenses Area Chart - 75% */}
                  <motion.div 
                    className="lg:col-span-2" 
                    data-intro="financial-chart"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Icon icon="solar:chart-bold-duotone" className="h-4 w-4" />
                          Income vs Expenses
                        </CardTitle>
                        <CardDescription>6-month trend</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%" key={`income-expense-${chartUpdateKey}-${chartData.length}`}>
                          <AreaChart 
                            data={incomeExpenseChartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0.95}/>
                                <stop offset="50%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0.5}/>
                                <stop offset="100%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={`hsl(${themeColors.mutedForeground})`} stopOpacity={0.9}/>
                                <stop offset="50%" stopColor={`hsl(${themeColors.mutedForeground})`} stopOpacity={0.4}/>
                                <stop offset="100%" stopColor={`hsl(${themeColors.mutedForeground})`} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={`hsl(${themeColors.border})`} opacity={0.3} />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: 11, fill: `hsl(${themeColors.mutedForeground})` }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              tick={{ fontSize: 11, fill: `hsl(${themeColors.mutedForeground})` }}
                              tickFormatter={(value) => {
                                if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`
                                if (value >= 1000) return `R${(value / 1000).toFixed(0)}k`
                                return `R${value.toFixed(0)}`
                              }}
                              tickLine={false}
                              axisLine={false}
                              domain={incomeExpenseYAxisDomain}
                              allowDataOverflow={false}
                            />
                            <RechartsTooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                      <p className="text-sm font-semibold text-foreground mb-2">
                                        {payload[0].payload.month}
                                      </p>
                                      {payload.map((entry: any, idx: number) => (
                                        <p key={idx} className="text-xs font-medium text-foreground">
                                          {entry.name}: R {formatNumber(entry.value)}
                                        </p>
                                      ))}
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Legend 
                              wrapperStyle={{ paddingTop: '20px' }}
                              iconType="line"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="income" 
                              stroke={`hsl(${themeColors.foreground})`}
                              strokeWidth={2.5}
                              fillOpacity={1} 
                              fill="url(#colorIncome)" 
                              name="Income"
                              dot={false}
                              activeDot={{ r: 5, fill: `hsl(${themeColors.foreground})`, strokeWidth: 2, stroke: `hsl(${themeColors.background})` }}
                              onClick={(data: any) => {
                                if (data && data.payload) {
                                  toast.success('Income Data', `Month: ${data.payload.month}, Value: R ${formatNumber(data.payload.income)}`)
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="expenses" 
                              stroke={`hsl(${themeColors.mutedForeground})`}
                              strokeWidth={2.5}
                              fillOpacity={1} 
                              fill="url(#colorExpenses)" 
                              name="Expenses"
                              dot={false}
                              activeDot={{ r: 5, fill: `hsl(${themeColors.mutedForeground})`, strokeWidth: 2, stroke: `hsl(${themeColors.background})` }}
                              onClick={(data: any) => {
                                if (data && data.payload) {
                                  toast.success('Expense Data', `Month: ${data.payload.month}, Value: R ${formatNumber(data.payload.expenses)}`)
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* AI Chat - 25% */}
                  <motion.div 
                    className="h-[400px] lg:h-[500px] min-h-[400px] flex" 
                    data-intro="ai-chat"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <FinancialAIChat 
                      financialData={financialData} 
                      chartData={chartData} 
                    />
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="distribution" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Expense Categories Pie Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Icon icon="solar:pie-chart-2-bold-duotone" className="h-4 w-4" />
                        Expense Categories
                      </CardTitle>
                      <CardDescription>Top spending categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" key={`expense-categories-${chartUpdateKey}-${dashboard.financial.transactions.length}`}>
                        <PieChart>
                          <Pie
                            data={expenseCategoriesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill={`hsl(${themeColors.foreground})`}
                            dataKey="value"
                          >
                            {expenseCategoriesColors.map((color, idx) => (
                              <Cell key={`cell-${idx}`} fill={`hsl(${color})`} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                    <p className="text-sm font-semibold text-foreground mb-1">
                                      {payload[0].name}
                                    </p>
                                    <p className="text-xs font-medium text-foreground">
                                      Amount: R {formatNumber(payload[0].value)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {((payload[0].payload.percent || 0) * 100).toFixed(1)}% of expenses
                                    </p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Asset Distribution */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                  <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Icon icon="solar:pie-chart-2-bold-duotone" className="h-4 w-4" />
                        Asset Distribution
                      </CardTitle>
                      <CardDescription>Breakdown by account type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" key={`asset-dist-${chartUpdateKey}-${assetDistributionData.length}-${totalValue}`}>
                        <PieChart>
                          <Pie
                            data={assetDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill={`hsl(${themeColors.foreground})`}
                            dataKey="value"
                          >
                            {assetDistributionColors.map((color, idx) => (
                              <Cell key={`cell-${idx}`} fill={`hsl(${color})`} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                    <p className="text-sm font-semibold text-foreground mb-1">
                                      {payload[0].name}
                                    </p>
                                    <p className="text-xs font-medium text-foreground">
                                      Value: R {formatNumber(payload[0].value)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {((payload[0].payload.percent || 0) * 100).toFixed(1)}% of total
                                    </p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="growth" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Growth Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MonthlyGrowthChart 
                      chartData={chartData} 
                      accounts={dashboard.financial.accounts}
                      totalValue={totalValue}
                    />
                  </motion.div>
                  
                  {/* Income vs Expenses Area Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Icon icon="solar:chart-bold-duotone" className="h-4 w-4" />
                        Monthly Income vs Expenses
                      </CardTitle>
                      <CardDescription>6-month comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" key={`growth-income-expense-${chartUpdateKey}-${chartData.length}`}>
                        <AreaChart 
                          data={monthlyIncomeExpenseData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorIncomeGrowth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={`hsl(${themeColors.foreground})`} stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpensesGrowth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={`hsl(${themeColors.mutedForeground})`} stopOpacity={0.7}/>
                              <stop offset="95%" stopColor={`hsl(${themeColors.mutedForeground})`} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={`hsl(${themeColors.border})`} opacity={0.3} />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 11, fill: `hsl(${themeColors.mutedForeground})` }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 11, fill: `hsl(${themeColors.mutedForeground})` }}
                            tickFormatter={(value) => {
                              if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`
                              if (value >= 1000) return `R${(value / 1000).toFixed(0)}k`
                              return `R${value.toFixed(0)}`
                            }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <RechartsTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                    <p className="text-sm font-semibold text-foreground mb-2">
                                      {payload[0].payload.month}
                                    </p>
                                    {payload.map((entry: any, idx: number) => (
                                      <p key={idx} className="text-xs font-medium text-foreground">
                                        {entry.name}: R {formatNumber(entry.value)}
                                      </p>
                                    ))}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="income" 
                            stroke={`hsl(${themeColors.foreground})`}
                            strokeWidth={2.5}
                            fillOpacity={1} 
                            fill="url(#colorIncomeGrowth)" 
                            name="Income"
                            dot={false}
                            activeDot={{ r: 5, fill: `hsl(${themeColors.foreground})`, strokeWidth: 2, stroke: `hsl(${themeColors.background})` }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="expenses" 
                            stroke={`hsl(${themeColors.mutedForeground})`}
                            strokeWidth={2.5}
                            fillOpacity={1} 
                            fill="url(#colorExpensesGrowth)" 
                            name="Expenses"
                            dot={false}
                            activeDot={{ r: 5, fill: `hsl(${themeColors.mutedForeground})`, strokeWidth: 2, stroke: `hsl(${themeColors.background})` }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>

                  {/* Category Breakdown - Area Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Icon icon="solar:chart-bold-duotone" className="h-4 w-4" />
                        Category Breakdown
                      </CardTitle>
                      <CardDescription>Expense distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" key={`category-breakdown-${chartUpdateKey}-${dashboard.financial.transactions.length}`}>
                          <AreaChart 
                            data={categoryBreakdownData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} />
                            <XAxis 
                              dataKey="category" 
                              tick={{ fontSize: 11, fill: '#666' }}
                              tickLine={false}
                              axisLine={false}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis 
                              tick={{ fontSize: 11, fill: '#666' }}
                              tickFormatter={(value) => {
                                if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`
                                if (value >= 1000) return `R${(value / 1000).toFixed(0)}k`
                                return `R${value.toFixed(0)}`
                              }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                      <p className="text-sm font-semibold text-foreground mb-1">
                                        {payload[0].payload.category}
                                      </p>
                                      <p className="text-xs font-medium text-foreground">
                                        Value: R {formatNumber(payload[0].value)}
                                      </p>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke={`hsl(${themeColors.foreground})`}
                              strokeWidth={2.5}
                              fillOpacity={1} 
                              fill="url(#colorCategory)"
                              dot={false}
                              activeDot={{ r: 5, fill: `hsl(${themeColors.foreground})`, strokeWidth: 2, stroke: `hsl(${themeColors.background})` }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
            </motion.div>
            )}

            {/* Quick Actions */}
            <div className="mt-6">
              <QuickActions
                actions={[
                  {
                    id: 'add-account',
                    label: 'Add Account',
                    icon: 'solar:add-circle-bold',
                    onClick: () => setIsAddAccountOpen(true),
                  },
                  {
                    id: 'add-transaction',
                    label: 'Add Transaction',
                    icon: 'solar:wallet-money-bold',
                    onClick: () => navigate.to('financial'),
                  },
                  {
                    id: 'view-reports',
                    label: 'View Reports',
                    icon: 'solar:chart-2-bold',
                    onClick: () => navigate.to('financial'),
                  },
                  {
                    id: 'share',
                    label: 'Share Summary',
                    icon: 'solar:share-bold',
                    onClick: () => {
                      // Share menu will be in insights section
                    },
                  },
                ]}
              />
            </div>

            {/* Quick Access Cards - Legacy, Invitations, Documents, Peck Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
            >
              <Card 
                className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate.to('legacy')}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40 group-hover:bg-foreground/10 transition-colors">
                      <Icon icon="solar:book-bookmark-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <Icon icon="solar:arrow-right-bold" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">My Legacy Journey</h3>
                  <p className="text-xs text-muted-foreground">Create and preserve your digital legacy with stories and memories</p>
                </CardContent>
              </Card>

              <Card 
                className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate.toPath('/client/invitations')}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40 group-hover:bg-foreground/10 transition-colors">
                      <Icon icon="solar:letter-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <Icon icon="solar:arrow-right-bold" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Invitations</h3>
                  <p className="text-xs text-muted-foreground">Manage invitations and collaborate with your team</p>
                </CardContent>
              </Card>

              <Card 
                className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate.to('documents')}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40 group-hover:bg-foreground/10 transition-colors">
                      <Icon icon="solar:folder-with-files-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <Icon icon="solar:arrow-right-bold" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Document Vault</h3>
                  <p className="text-xs text-muted-foreground">Organize and store all estate documents securely</p>
                </CardContent>
              </Card>

              <PeckLogWidget />
            </motion.div>

            {/* Financial Table Section */}
            <div className="mt-6">
              <FinancialTable
                onRefresh={handleRefresh}
                refreshing={refreshing}
                isAddAccountOpen={isAddAccountOpen}
                setIsAddAccountOpen={setIsAddAccountOpen}
                accounts={manualAccounts}
                addAccount={async (account) => {
                  // Use dashboard's addAccount method which updates charts automatically
                  const newAccount = await dashboard.financial.addAccount({
                    bankName: account.bankName || account.accountName || 'Manual Entry',
                    accountType: account.accountType,
                    accountNumber: account.accountNumber || '',
                    accountHolder: account.accountHolder || account.accountName || 'Account Holder',
                    currentBalance: parseFloat(account.currentBalance) || 0,
                    availableBalance: parseFloat(account.currentBalance) || 0,
                    currency: account.currency || 'ZAR',
                  })
                  // Force refresh to update charts - wait a bit for state to propagate
                  setTimeout(() => {
                  dashboard.refresh()
                  }, 100)
                  toast.success('Account Added', 'Your account has been added and charts updated')
                  return newAccount
                }}
                updateAccount={async (id, updates) => {
                  try {
                    // Use dashboard's updateAccount method
                    await dashboard.financial.updateAccount(id, {
                      bankName: updates.bankName,
                      accountType: updates.accountType,
                      currentBalance: parseFloat(updates.currentBalance) || 0,
                    })
                    // Force immediate refresh to update all charts
                    await dashboard.refresh()
                    setTimeout(() => {
                      dashboard.refresh()
                    }, 150)
                    toast.success('Account Updated', 'Your account has been updated and charts refreshed')
                  } catch (error: any) {
                    console.error('Error updating account:', error)
                    toast.error('Error', error.message || 'Failed to update account')
                    throw error
                  }
                }}
                deleteAccount={async (id) => {
                  try {
                    // Use dashboard's deleteAccount method
                    await dashboard.financial.deleteAccount(id)
                    // Force immediate refresh to update all charts
                    await dashboard.refresh()
                    setTimeout(() => {
                      dashboard.refresh()
                    }, 150)
                    toast.success('Account Deleted', 'Your account has been removed and charts updated')
                  } catch (error: any) {
                    console.error('Error deleting account:', error)
                    toast.error('Error', error.message || 'Failed to delete account')
                    throw error
                  }
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <QuickActions
                actions={[
                  {
                    id: 'add-account',
                    label: 'Add Account',
                    icon: 'solar:add-circle-bold',
                    onClick: () => setIsAddAccountOpen(true),
                  },
                  {
                    id: 'add-transaction',
                    label: 'Add Transaction',
                    icon: 'solar:wallet-money-bold',
                    onClick: () => navigate.to('financial'),
                  },
                  {
                    id: 'view-reports',
                    label: 'View Reports',
                    icon: 'solar:chart-2-bold',
                    onClick: () => navigate.to('financial'),
                  },
                  {
                    id: 'share',
                    label: 'Share Summary',
                    icon: 'solar:share-bold',
                    onClick: () => {},
                  },
                ]}
              />
            </div>

            {/* Financial Insights Section */}
            {financialInsights.length > 0 && (
              <Card className="border border-border/60 mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Icon icon="solar:lightbulb-bolt-bold-duotone" className="h-4 w-4" />
                        Financial Insights
                      </CardTitle>
                      <CardDescription>Personalized recommendations and tips</CardDescription>
                    </div>
                    <ShareMenu summary={financialSummary} />
                  </div>
                </CardHeader>
                <CardContent>
                  <FinancialInsightsList 
                    insights={financialInsights.map(insight => ({
                      ...insight,
                      action: insight.action ? {
                        label: insight.action.label,
                        onClick: () => navigate.toPath(insight.action!.route),
                      } : undefined,
                    }))}
                    onDismiss={(id) => {
                      // Store dismissed insights in localStorage
                      const dismissed = JSON.parse(localStorage.getItem('dismissed-insights') || '[]')
                      localStorage.setItem('dismissed-insights', JSON.stringify([...dismissed, id]))
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Achievements Panel */}
            <AchievementPanel 
              financialData={achievementData}
              className="mt-6"
            />

            {/* Recent Activities Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border border-border/60 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 mt-6" data-intro="recent-activity">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Icon icon="solar:history-bold-duotone" className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                {activitiesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Icon icon="solar:refresh-bold" className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon icon="solar:history-bold-duotone" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <Link
                        key={activity.id}
                        href={activity.link || '#'}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${activity.color || 'bg-foreground/5'}`}>
                          <Icon icon={activity.icon || 'solar:circle-bold-duotone'} className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-foreground/80">
                            {activity.text || activity.type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {activity.time}
                          </p>
                        </div>
                        <Icon icon="solar:arrow-right-bold" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </main>
      </div>
      </PageIntro>
        </>
      )}
    </>
  )
}




