'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { ManualBankDashboard } from '@/components/banking/ManualBankDashboard'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
  accountId: string
  tags?: string[]
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountType: 'cheque' | 'savings' | 'transmission' | 'credit_card'
  branchCode?: string
  accountHolder: string
  currentBalance: number
  availableBalance: number
  currency: string
  lastUpdated: string
  isActive: boolean
  isVerified: boolean
}

const COLORS = ['#000000', '#2A2A2A', '#4A4A4A', '#6A6A6A', '#8A8A8A', '#AAAAAA', '#CACACA']

export function ManualFinancialDashboard() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useLocalStorage<BankAccount[]>('manual-bank-accounts', [])
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('manual-transactions', [])
  const [isAddAccountOpen, setIsAddAccountOpen] = React.useState(false)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = React.useState(false)
  const [isImportCSVOpen, setIsImportCSVOpen] = React.useState(false)
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    accountName: '',
    accountType: 'cheque' as BankAccount['accountType'],
    currentBalance: '',
  })

  const [transactionForm, setTransactionForm] = React.useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'other',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    accountId: '',
  })

  // Calculate financial metrics
  const metrics = React.useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0)
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0)
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0)
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0
    const financialHealth = Math.min(100, Math.max(0, 50 + (savingsRate * 0.5)))

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      financialHealth,
      netWorth: totalBalance,
    }
  }, [accounts, transactions])

  // Chart data
  const incomeExpenseData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const monthKey = date.toISOString().slice(0, 7)
      
      const income = transactions
        .filter(t => t.type === 'income' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
        savings: income - expenses,
      }
    })

    return last6Months
  }, [transactions])

  const categoryData = React.useMemo(() => {
    const categoryMap = new Map<string, number>()
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + t.amount)
      })

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions])

  const handleCSVImport = async (file: File) => {
    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const dateIndex = headers.findIndex(h => h.includes('date'))
      const descIndex = headers.findIndex(h => h.includes('description') || h.includes('desc'))
      const amountIndex = headers.findIndex(h => h.includes('amount'))
      const categoryIndex = headers.findIndex(h => h.includes('category'))

      if (dateIndex === -1 || amountIndex === -1) {
        toast.error('Invalid CSV', 'CSV must have date and amount columns')
        return
      }

      const newTransactions: Transaction[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const amount = parseFloat(values[amountIndex]) || 0
        if (amount === 0) continue

        newTransactions.push({
          id: `txn-${Date.now()}-${i}`,
          date: values[dateIndex] || new Date().toISOString().split('T')[0],
          description: values[descIndex] || 'Imported transaction',
          category: values[categoryIndex] || 'other',
          amount: Math.abs(amount),
          type: amount > 0 ? 'income' : 'expense',
          accountId: selectedAccount || accounts[0]?.id || '',
        })
      }

      setTransactions(prev => [...prev, ...newTransactions])
      toast.success('CSV Imported', `Imported ${newTransactions.length} transactions`)
      setIsImportCSVOpen(false)
    } catch (error) {
      toast.error('Import Failed', 'Could not parse CSV file')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Financial Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage your finances with manual entry and CSV import
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isImportCSVOpen} onOpenChange={setIsImportCSVOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Icon icon="mdi:file-upload-outline" className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Transactions from CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with columns: date, description, amount, category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleCSVImport(file)
                    }}
                  />
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">CSV Format:</p>
                  <code className="text-xs">
                    date,description,amount,category<br />
                    2024-01-15,Groceries,-850.00,food<br />
                    2024-01-16,Salary,12000.00,income
                  </code>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <Icon icon="mdi:plus" className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-foreground">
                  R{metrics.totalBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                <Icon icon="solar:graph-up-bold-duotone" className="h-6 w-6 text-foreground" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Income</p>
                <p className="text-2xl font-bold text-foreground">
                  R{metrics.monthlyIncome.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                <Icon icon="solar:graph-down-bold-duotone" className="h-6 w-6 text-foreground" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Expenses</p>
                <p className="text-2xl font-bold text-foreground">
                  R{metrics.monthlyExpenses.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                <Icon icon="solar:chart-bold-duotone" className="h-6 w-6 text-foreground" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground mb-1">Savings Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {metrics.savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income-expense">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Line Chart */}
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>6-month trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={incomeExpenseData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6A6A6A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6A6A6A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e5e5',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#000000" 
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                      name="Income"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#6A6A6A" 
                      fillOpacity={1} 
                      fill="url(#colorExpenses)" 
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution Pie Chart */}
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Top spending categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income-expense">
          <Card className="border border-border/40">
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>6-month trend with area visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={incomeExpenseData}>
                  <defs>
                    <linearGradient id="colorIncomeFA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpensesFA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6A6A6A" stopOpacity={0.7}/>
                      <stop offset="95%" stopColor="#6A6A6A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                            <p className="text-sm font-semibold text-foreground mb-2">
                              {payload[0].payload.month}
                            </p>
                            {payload.map((entry: any, idx: number) => (
                              <p key={idx} className="text-xs font-medium text-foreground">
                                {entry.name === 'income' ? 'Income' : 'Expenses'}: R {entry.value?.toLocaleString('en-ZA')}
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
                    stroke="#000000" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorIncomeFA)" 
                    name="Income"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#6A6A6A" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorExpensesFA)" 
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Top spending categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                              <p className="text-sm font-semibold text-foreground mb-1">
                                {payload[0].payload.name}
                              </p>
                              <p className="text-xs font-medium text-foreground">
                                R {payload[0].value?.toLocaleString('en-ZA')}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Expense distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{cat.name}</span>
                        <span className="text-muted-foreground">R {cat.value.toLocaleString('en-ZA')}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all" 
                          style={{ 
                            width: `${(cat.value / categoryData[0]?.value) * 100}%`,
                            backgroundColor: COLORS[idx % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <ManualBankDashboard />
        </TabsContent>
      </Tabs>

      {/* Transactions Table */}
      <Card className="border border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>All your financial transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsAddTransactionOpen(true)}>
              <Icon icon="mdi:plus" className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Account</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 50)
                  .map((txn) => (
                    <tr 
                      key={txn.id} 
                      className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground">
                        {new Date(txn.date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">{txn.description}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {txn.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {accounts.find(a => a.id === txn.accountId)?.bankName || 'Unknown'}
                      </td>
                      <td className={cn(
                        "px-4 py-3 text-right font-semibold",
                        txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {txn.type === 'income' ? '+' : '-'}R{Math.abs(txn.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No transactions yet. Add your first transaction to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Record a new income or expense transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="txn-date">Date</Label>
                <Input
                  id="txn-date"
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-description">Description</Label>
                <Input
                  id="txn-description"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  placeholder="Transaction description"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="txn-type">Type</Label>
                <Select 
                  value={transactionForm.type} 
                  onValueChange={(value: 'income' | 'expense') => setTransactionForm({ ...transactionForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="txn-amount">Amount (ZAR)</Label>
                  <Input
                    id="txn-amount"
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    placeholder="0.00"
                  />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="txn-category">Category</Label>
                <Select 
                  value={transactionForm.category} 
                  onValueChange={(value) => setTransactionForm({ ...transactionForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="txn-account">Account</Label>
                <Select 
                  value={transactionForm.accountId} 
                  onValueChange={(value) => setTransactionForm({ ...transactionForm, accountId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.bankName} - {acc.accountType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (!transactionForm.description || !transactionForm.amount) {
                toast.error('Missing Information', 'Please fill in all required fields')
                return
              }
              const newTxn: Transaction = {
                id: `txn-${Date.now()}`,
                date: transactionForm.date,
                description: transactionForm.description,
                category: transactionForm.category,
                amount: parseFloat(transactionForm.amount) || 0,
                type: transactionForm.type,
                accountId: transactionForm.accountId || accounts[0]?.id || '',
              }
              setTransactions(prev => [...prev, newTxn])
              toast.success('Transaction Added', 'Transaction has been recorded')
              setIsAddTransactionOpen(false)
              setTransactionForm({
                date: new Date().toISOString().split('T')[0],
                description: '',
                category: 'other',
                amount: '',
                type: 'expense',
                accountId: '',
              })
            }}>
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

