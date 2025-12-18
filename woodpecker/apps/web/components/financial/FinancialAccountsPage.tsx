'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { formatDate } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { api } from '@/lib/utils/api-client'
// noop for diff

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountType: 'cheque' | 'savings' | 'transmission' | 'credit_card' | 'investment'
  branchCode?: string
  accountHolder: string
  currentBalance: number
  availableBalance: number
  currency: string
  lastUpdated: string
  isActive: boolean
  isVerified: boolean
}

export function FinancialAccountsPage() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useLocalStorage<BankAccount[]>('financial-accounts', [])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [selectedAccount, setSelectedAccount] = React.useState<BankAccount | null>(null)
  const [formData, setFormData] = React.useState({
    bankName: '',
    accountNumber: '',
    accountType: 'cheque' as BankAccount['accountType'],
    branchCode: '',
    accountHolder: '',
    currentBalance: '',
    currency: 'ZAR',
  })

  const totalBalance = React.useMemo(() => 
    accounts.reduce((sum, acc) => sum + acc.currentBalance, 0),
    [accounts]
  )

  // Load accounts from backend on mount
  React.useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true)
      try {
        const response = await api.get<{ data: BankAccount[] }>('/api/financial/accounts')
        const data = response?.data || response
        if (data && Array.isArray(data) && data.length > 0) {
          setAccounts(data)
        } else {
          // Fallback to localStorage
          const localAccounts = JSON.parse(localStorage.getItem('financial-accounts') || '[]')
          if (Array.isArray(localAccounts) && localAccounts.length > 0) {
            setAccounts(localAccounts)
          }
        }
      } catch (error) {
        console.error('Failed to load accounts:', error)
        // Fallback to localStorage
        try {
          const localAccounts = JSON.parse(localStorage.getItem('financial-accounts') || '[]')
          if (Array.isArray(localAccounts) && localAccounts.length > 0) {
            setAccounts(localAccounts)
          }
        } catch (e) {
          console.error('Failed to load from localStorage:', e)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadAccounts()
  }, [])

  const handleAdd = async () => {
    if (!formData.bankName || !formData.accountNumber) {
      toast.error('Required Fields', 'Bank name and account number are required')
      return
    }

    setIsSyncing(true)
    try {
      const newAccount: BankAccount = {
        id: `acc-${Date.now()}`,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        branchCode: formData.branchCode || undefined,
        accountHolder: formData.accountHolder || 'Primary Account Holder',
        currentBalance: parseFloat(formData.currentBalance) || 0,
        availableBalance: parseFloat(formData.currentBalance) || 0,
        currency: formData.currency,
        lastUpdated: new Date().toISOString(),
        isActive: true,
        isVerified: false,
      }

      // Save to backend
      try {
        const response = await api.post<{ data: BankAccount }>('/api/financial/accounts', {
          accountName: formData.bankName,
          bankName: formData.bankName,
          accountType: formData.accountType,
          accountNumber: formData.accountNumber,
          currentBalance: parseFloat(formData.currentBalance) || 0,
          currency: formData.currency,
        })
        if (response && response.data) {
          newAccount.id = response.data.id || newAccount.id
          newAccount.lastUpdated = response.data.lastUpdated || newAccount.lastUpdated
          newAccount.isVerified = response.data.isVerified || false
        }
      } catch (error: any) {
        console.error('Failed to save to backend:', error)
        toast.error('Backend Save Failed', 'Account saved locally but failed to sync with server')
        // Continue with localStorage fallback
      }

      setAccounts([...accounts, newAccount])
      setFormData({
        bankName: '',
        accountNumber: '',
        accountType: 'cheque',
        branchCode: '',
        accountHolder: '',
        currentBalance: '',
        currency: 'ZAR',
      })
      setIsAddOpen(false)
      toast.success('Account Added', `${newAccount.bankName} account has been added`)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleEdit = (account: BankAccount) => {
    setSelectedAccount(account)
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      branchCode: account.branchCode || '',
      accountHolder: account.accountHolder,
      currentBalance: account.currentBalance.toString(),
      currency: account.currency,
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedAccount) return

    setIsSyncing(true)
    try {
      const updatedAccount = {
        ...selectedAccount,
        ...formData,
        currentBalance: parseFloat(formData.currentBalance) || 0,
        availableBalance: parseFloat(formData.currentBalance) || 0,
        lastUpdated: new Date().toISOString(),
      }

      // Update backend
      try {
        await api.put('/api/financial/accounts', {
          id: selectedAccount.id,
          accountName: formData.bankName,
          bankName: formData.bankName,
          accountType: formData.accountType,
          accountNumber: formData.accountNumber,
          currentBalance: parseFloat(formData.currentBalance) || 0,
          currency: formData.currency,
        })
      } catch (error) {
        console.error('Failed to update backend:', error)
        // Continue with localStorage fallback
      }

      setAccounts(accounts.map(acc => 
        acc.id === selectedAccount.id ? updatedAccount : acc
      ))
      setIsEditOpen(false)
      setSelectedAccount(null)
      toast.success('Account Updated', 'Account information has been updated')
    } finally {
      setIsSyncing(false)
    }
  }

  const handleDelete = async (id: string) => {
    const account = accounts.find(a => a.id === id)
    if (!confirm(`Are you sure you want to remove ${account?.bankName} account?`)) return

    setIsSyncing(true)
    try {
      // Delete from backend
      try {
        await api.delete(`/api/financial/accounts?id=${id}`)
      } catch (error) {
        console.error('Failed to delete from backend:', error)
        // Continue with localStorage fallback
      }

      setAccounts(accounts.filter(a => a.id !== id))
      toast.success('Account Removed', 'Account has been removed')
    } finally {
      setIsSyncing(false)
    }
  }

  const getAccountTypeIcon = (type: BankAccount['accountType']) => {
    switch (type) {
      case 'cheque': return 'solar:card-bold-duotone'
      case 'savings': return 'solar:wallet-money-bold-duotone'
      case 'credit_card': return 'solar:card-send-bold-duotone'
      case 'investment': return 'solar:chart-2-bold-duotone'
      default: return 'solar:wallet-bold-duotone'
    }
  }

  return (
    <div className="space-y-6" data-intro="accounts-list">
      {/* Header - Removed duplicate header since it's in parent */}
      <div className="flex items-center justify-end">
        <Button 
          onClick={() => setIsAddOpen(true)} 
          data-intro="add-account"
          className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
        >
          <Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Balance</CardDescription>
                <Icon icon="solar:wallet-money-bold-duotone" className="h-5 w-5 text-foreground/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                R{totalBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Active Accounts</CardDescription>
                <Icon icon="solar:check-circle-bold-duotone" className="h-5 w-5 text-foreground/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {accounts.filter(a => a.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {accounts.filter(a => !a.isActive).length} inactive
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-border/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Verified Accounts</CardDescription>
                <Icon icon="solar:shield-check-bold-duotone" className="h-5 w-5 text-foreground/60" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {accounts.filter(a => a.isVerified).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {accounts.filter(a => !a.isVerified).length} pending verification
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-dashed border-border/60 bg-gradient-to-br from-background to-foreground/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon icon="solar:wallet-bold-duotone" className="h-20 w-20 text-muted-foreground mb-6" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Accounts Yet</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Add your first financial account to start tracking your finances and building your estate overview
              </p>
              <Button 
                onClick={() => setIsAddOpen(true)}
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Icon icon="solar:add-circle-bold-duotone" className="h-5 w-5 mr-2" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "border border-border/60 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5",
                  !account.isActive && "opacity-60"
                )}
              >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon={getAccountTypeIcon(account.accountType)} className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{account.bankName}</CardTitle>
                      <CardDescription className="text-xs">
                        {account.accountNumber.slice(-4).padStart(account.accountNumber.length, '•')}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {account.accountType.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                    <p className="text-xl font-bold text-foreground">
                      {account.currency} {account.currentBalance.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Account Holder</span>
                    <span className="text-foreground">{account.accountHolder}</span>
                  </div>
                  {account.branchCode && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Branch Code</span>
                      <span className="text-foreground">{account.branchCode}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="text-foreground">
                      {formatDate(account.lastUpdated, 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Badge 
                      variant={account.isVerified ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {account.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                    <Badge 
                      variant={account.isActive ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {account.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(account)}
                    >
                      <Icon icon="solar:pen-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(account.id)}
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Account Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Financial Account</DialogTitle>
            <DialogDescription>
              Add a new bank account, credit card, or investment account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g., Standard Bank, FNB"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Account number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => setFormData({ ...formData, accountType: value as BankAccount['accountType'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="transmission">Transmission</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="branchCode">Branch Code</Label>
              <Input
                id="branchCode"
                value={formData.branchCode}
                onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="accountHolder">Account Holder</Label>
              <Input
                id="accountHolder"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                placeholder="Account holder name"
              />
            </div>
            <div>
              <Label htmlFor="currentBalance">Current Balance</Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-bankName">Bank Name *</Label>
              <Input
                id="edit-bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-accountNumber">Account Number *</Label>
              <Input
                id="edit-accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-accountType">Account Type</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => setFormData({ ...formData, accountType: value as BankAccount['accountType'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="transmission">Transmission</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ZAR">ZAR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-branchCode">Branch Code</Label>
              <Input
                id="edit-branchCode"
                value={formData.branchCode}
                onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-accountHolder">Account Holder</Label>
              <Input
                id="edit-accountHolder"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-currentBalance">Current Balance</Label>
              <Input
                id="edit-currentBalance"
                type="number"
                step="0.01"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

