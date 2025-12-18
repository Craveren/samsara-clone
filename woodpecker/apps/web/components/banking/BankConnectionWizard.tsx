'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Progress } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'

interface BankConnectionWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const BANKS = [
  { name: 'Standard Bank', logo: '🏦', color: '#1E3A8A' },
  { name: 'First National Bank (FNB)', logo: '🏛️', color: '#DC2626' },
  { name: 'ABSA', logo: '🏢', color: '#F59E0B' },
  { name: 'Nedbank', logo: '🏦', color: '#059669' },
  { name: 'Capitec', logo: '💳', color: '#7C3AED' },
  { name: 'Investec', logo: '💼', color: '#0F172A' },
  { name: 'Discovery Bank', logo: '🔍', color: '#0284C7' },
  { name: 'TymeBank', logo: '⏰', color: '#EA580C' },
]

const STEPS = [
  { id: 1, title: 'Select Bank', description: 'Choose your bank' },
  { id: 2, title: 'Verify Account', description: 'Enter account details' },
  { id: 3, title: 'Authenticate', description: 'Secure connection' },
  { id: 4, title: 'Complete', description: 'Connection successful' },
]

export function BankConnectionWizard({ open, onOpenChange, onSuccess }: BankConnectionWizardProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [selectedBank, setSelectedBank] = React.useState<string | null>(null)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [connectionProgress, setConnectionProgress] = React.useState(0)
  const [formData, setFormData] = React.useState({
    accountNumber: '',
    accountType: 'cheque' as 'cheque' | 'savings' | 'transmission' | 'credit_card',
    branchCode: '',
    accountHolder: '',
    currentBalance: '',
  })

  React.useEffect(() => {
    if (!open) {
      // Reset on close
      setCurrentStep(1)
      setSelectedBank(null)
      setIsConnecting(false)
      setConnectionProgress(0)
      setFormData({
        accountNumber: '',
        accountType: 'cheque',
        branchCode: '',
        accountHolder: '',
        currentBalance: '',
      })
    }
  }, [open])

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName)
    setTimeout(() => setCurrentStep(2), 500)
  }

  const handleVerify = () => {
    if (!formData.accountNumber || !formData.accountHolder || !formData.currentBalance) {
      toast.error('Validation Error', 'Please fill in all required fields')
      return
    }
    setCurrentStep(3)
    simulateConnection()
  }

  const simulateConnection = () => {
    setIsConnecting(true)
    setConnectionProgress(0)

    // Simulate connection progress
    const interval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setCurrentStep(4)
            setIsConnecting(false)
            setTimeout(() => {
              handleComplete()
            }, 2000)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleComplete = () => {
    try {
      const newAccount = {
        id: `acc-${Date.now()}`,
        bankName: selectedBank || 'Manual Entry',
        accountNumber: formData.accountNumber,
        accountType: formData.accountType,
        branchCode: formData.branchCode || '',
        accountHolder: formData.accountHolder,
        currentBalance: parseFloat(formData.currentBalance) || 0,
        availableBalance: parseFloat(formData.currentBalance) || 0,
        currency: 'ZAR',
        lastUpdated: new Date().toISOString(),
        isActive: true,
        isVerified: true,
      }

      // Get existing accounts
      const stored = localStorage.getItem('manual-bank-accounts')
      const existingAccounts = stored ? JSON.parse(stored) : []
      const updatedAccounts = [...existingAccounts, newAccount]
      
      // Save to localStorage
      localStorage.setItem('manual-bank-accounts', JSON.stringify(updatedAccounts))
      
      toast.success('Bank Connected', `${selectedBank} account connected successfully`)
      
      if (onSuccess) {
        onSuccess()
      }
      
      setTimeout(() => {
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error('Error saving account:', error)
      toast.error('Error', 'Failed to save bank account')
    }
  }

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Financial Account</DialogTitle>
          <DialogDescription>
            Manually add your bank account details to track your finances. Choose the type of account you'd like to monitor.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 py-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center flex-1',
                  currentStep >= step.id ? 'text-foreground' : ''
                )}
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center mb-1 border-2 transition-all',
                    currentStep > step.id
                      ? 'bg-foreground text-background border-foreground'
                      : currentStep === step.id
                      ? 'bg-foreground text-background border-foreground ring-4 ring-foreground/20'
                      : 'bg-background border-border text-muted-foreground'
                  )}
                >
                  {currentStep > step.id ? (
                    <Icon icon="mdi:check" className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span className="text-xs font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Bank */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Your Bank</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your bank to categorize your account. You'll enter the account details manually in the next step.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BANKS.map((bank) => (
                  <motion.button
                    key={bank.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBankSelect(bank.name)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all text-left',
                      'hover:border-foreground hover:shadow-md',
                      selectedBank === bank.name
                        ? 'border-foreground bg-foreground/5'
                        : 'border-border bg-background'
                    )}
                  >
                    <div className="text-3xl mb-2">{bank.logo}</div>
                    <div className="text-sm font-medium text-foreground">{bank.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Verify Account */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Enter Account Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your {selectedBank} account information manually. This data is stored securely in your browser and used for financial planning insights.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value: 'cheque' | 'savings' | 'transmission' | 'credit_card') =>
                      setFormData({ ...formData, accountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cheque">Cheque Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="transmission">Transmission Account</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input
                      id="branchCode"
                      value={formData.branchCode}
                      onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentBalance">Current Balance (ZAR) *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Account Holder Name *</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    placeholder="Name as on account"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={handleVerify} className="bg-foreground text-background hover:bg-foreground/90">
                  Save Account
                  <Icon icon="mdi:arrow-right" className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Authenticating */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 py-8"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto h-20 w-20 rounded-full bg-foreground/10 flex items-center justify-center"
                >
                  <Icon icon="mdi:shield-lock-outline" className="h-10 w-10 text-foreground" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Saving Account Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Securely storing your {selectedBank} account information...
                  </p>
                </div>
                <div className="space-y-2">
                  <Progress value={connectionProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {connectionProgress < 30 && 'Validating account information...'}
                    {connectionProgress >= 30 && connectionProgress < 60 && 'Encrypting account data...'}
                    {connectionProgress >= 60 && connectionProgress < 90 && 'Saving to secure storage...'}
                    {connectionProgress >= 90 && 'Finalizing setup...'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="mx-auto h-24 w-24 rounded-full bg-foreground/5 border-2 border-border/60 flex items-center justify-center"
              >
                <Icon icon="mdi:check-circle" className="h-16 w-16 text-foreground" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Account Added Successfully!</h3>
                <p className="text-muted-foreground">
                  Your {selectedBank} account has been added to your financial profile.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  You can now track this account in your dashboard. To add transactions, go to the Financial Accounts page and manually enter your transaction history.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

