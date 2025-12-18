'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { Progress } from '@woodpecker/ui'
import { Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { PageIntro } from '@/components/onboarding/PageIntro'

// Phase 1: Basic wizard with personal info and estate overview
// Phase 2: Advanced features - beneficiaries, executors, healthcare
// Phase 3: Review, validation, and completion with document generation

interface EstatePlan {
  personalInfo: {
    fullName: string
    dateOfBirth: string
    maritalStatus: string
    nationality: string
    idNumber: string
  }
  estateOverview: {
    totalAssets: string
    hasWill: boolean
    hasTrust: boolean
    willDate?: string
    trustDate?: string
  }
  beneficiaries: Array<{
    id: string
    name: string
    relationship: string
    percentage: number
    isPrimary: boolean
  }>
  executors: Array<{
    id: string
    name: string
    relationship: string
    email?: string
    phone?: string
  }>
  healthcare: {
    proxyName: string
    proxyRelationship: string
    livingWill: boolean
    dnr: boolean
  }
}

const steps = [
  { id: 1, title: 'Personal Information', description: 'Tell us about yourself', icon: 'solar:user-bold-duotone' },
  { id: 2, title: 'Estate Overview', description: 'Basic estate information', icon: 'solar:document-text-bold-duotone' },
  { id: 3, title: 'Beneficiaries', description: 'Who should inherit your estate?', icon: 'solar:users-group-two-rounded-bold-duotone' },
  { id: 4, title: 'Executors & Healthcare', description: 'Important designations', icon: 'solar:heart-pulse-bold-duotone' },
  { id: 5, title: 'Review & Complete', description: 'Review your information', icon: 'solar:check-circle-bold-duotone' },
]

export default function EstateBuilderPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [estatePlan, setEstatePlan] = useLocalStorage<EstatePlan>('estate-plan', {
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      maritalStatus: '',
      nationality: '',
      idNumber: '',
    },
    estateOverview: {
      totalAssets: '',
      hasWill: false,
      hasTrust: false,
    },
    beneficiaries: [],
    executors: [],
    healthcare: {
      proxyName: '',
      proxyRelationship: '',
      livingWill: false,
      dnr: false,
    },
  })
  const [isAddBeneficiaryOpen, setIsAddBeneficiaryOpen] = React.useState(false)
  const [isAddExecutorOpen, setIsAddExecutorOpen] = React.useState(false)
  const [editingBeneficiary, setEditingBeneficiary] = React.useState<string | null>(null)
  const [editingExecutor, setEditingExecutor] = React.useState<string | null>(null)
  const [beneficiaryForm, setBeneficiaryForm] = React.useState({ name: '', relationship: '', percentage: 0, isPrimary: false })
  const [executorForm, setExecutorForm] = React.useState({ name: '', relationship: '', email: '', phone: '' })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    // Validation
    if (currentStep === 1) {
      if (!estatePlan.personalInfo.fullName || !estatePlan.personalInfo.dateOfBirth || !estatePlan.personalInfo.maritalStatus) {
        toast.error('Required fields', 'Please fill in all required fields')
        return
      }
    }
    if (currentStep === 2) {
      if (!estatePlan.estateOverview.totalAssets) {
        toast.error('Required field', 'Please enter your total assets')
        return
      }
    }
    if (currentStep === 3) {
      if (estatePlan.beneficiaries.length === 0) {
        toast.error('Required', 'Please add at least one beneficiary')
        return
      }
      const totalPercentage = estatePlan.beneficiaries.reduce((sum, b) => sum + b.percentage, 0)
      if (totalPercentage !== 100) {
        toast.error('Invalid percentages', 'Beneficiary percentages must total 100%')
        return
      }
    }
    if (currentStep === 4) {
      if (estatePlan.executors.length === 0) {
        toast.error('Required', 'Please add at least one executor')
        return
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    toast.success('Estate plan created', 'Your estate plan has been saved successfully')
    // TODO: Save to backend
  }

  const handleAddBeneficiary = () => {
    if (!beneficiaryForm.name || !beneficiaryForm.relationship) {
      toast.error('Required fields', 'Name and relationship are required')
      return
    }

    if (editingBeneficiary) {
      setEstatePlan({
        ...estatePlan,
        beneficiaries: estatePlan.beneficiaries.map(b =>
          b.id === editingBeneficiary ? { ...b, ...beneficiaryForm } : b
        ),
      })
      toast.success('Beneficiary updated', 'Beneficiary information has been updated')
    } else {
      setEstatePlan({
        ...estatePlan,
        beneficiaries: [...estatePlan.beneficiaries, {
          id: Date.now().toString(),
          ...beneficiaryForm,
        }],
      })
      toast.success('Beneficiary added', 'New beneficiary has been added')
    }
    setBeneficiaryForm({ name: '', relationship: '', percentage: 0, isPrimary: false })
    setEditingBeneficiary(null)
    setIsAddBeneficiaryOpen(false)
  }

  const handleAddExecutor = () => {
    if (!executorForm.name || !executorForm.relationship) {
      toast.error('Required fields', 'Name and relationship are required')
      return
    }

    if (editingExecutor) {
      setEstatePlan({
        ...estatePlan,
        executors: estatePlan.executors.map(e =>
          e.id === editingExecutor ? { ...e, ...executorForm } : e
        ),
      })
      toast.success('Executor updated', 'Executor information has been updated')
    } else {
      setEstatePlan({
        ...estatePlan,
        executors: [...estatePlan.executors, {
          id: Date.now().toString(),
          ...executorForm,
        }],
      })
      toast.success('Executor added', 'New executor has been added')
    }
    setExecutorForm({ name: '', relationship: '', email: '', phone: '' })
    setEditingExecutor(null)
    setIsAddExecutorOpen(false)
  }

  const handleDeleteBeneficiary = (id: string) => {
    setEstatePlan({
      ...estatePlan,
      beneficiaries: estatePlan.beneficiaries.filter(b => b.id !== id),
    })
    toast.success('Beneficiary removed', 'Beneficiary has been removed')
  }

  const handleDeleteExecutor = (id: string) => {
    setEstatePlan({
      ...estatePlan,
      executors: estatePlan.executors.filter(e => e.id !== id),
    })
    toast.success('Executor removed', 'Executor has been removed')
  }

  const handleEditBeneficiary = (beneficiary: EstatePlan['beneficiaries'][0]) => {
    setBeneficiaryForm(beneficiary)
    setEditingBeneficiary(beneficiary.id)
    setIsAddBeneficiaryOpen(true)
  }

  const handleEditExecutor = (executor: EstatePlan['executors'][0]) => {
    setExecutorForm(executor)
    setEditingExecutor(executor.id)
    setIsAddExecutorOpen(true)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={estatePlan.personalInfo.fullName}
                onChange={(e) => setEstatePlan({
                  ...estatePlan,
                  personalInfo: { ...estatePlan.personalInfo, fullName: e.target.value },
                })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={estatePlan.personalInfo.dateOfBirth}
                onChange={(e) => setEstatePlan({
                  ...estatePlan,
                  personalInfo: { ...estatePlan.personalInfo, dateOfBirth: e.target.value },
                })}
              />
            </div>
            <div>
              <Label htmlFor="maritalStatus">Marital Status *</Label>
              <Select
                value={estatePlan.personalInfo.maritalStatus}
                onValueChange={(value) => setEstatePlan({
                  ...estatePlan,
                  personalInfo: { ...estatePlan.personalInfo, maritalStatus: value },
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={estatePlan.personalInfo.nationality}
                onChange={(e) => setEstatePlan({
                  ...estatePlan,
                  personalInfo: { ...estatePlan.personalInfo, nationality: e.target.value },
                })}
                placeholder="e.g., South African"
              />
            </div>
            <div>
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                value={estatePlan.personalInfo.idNumber}
                onChange={(e) => setEstatePlan({
                  ...estatePlan,
                  personalInfo: { ...estatePlan.personalInfo, idNumber: e.target.value },
                })}
                placeholder="Enter your ID number"
              />
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="totalAssets">Estimated Total Assets (R) *</Label>
              <Input
                id="totalAssets"
                type="number"
                value={estatePlan.estateOverview.totalAssets}
                onChange={(e) => setEstatePlan({
                  ...estatePlan,
                  estateOverview: { ...estatePlan.estateOverview, totalAssets: e.target.value },
                })}
                placeholder="0"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-lg">
                <div>
                  <Label>Do you have a will?</Label>
                  <p className="text-sm text-muted-foreground">Existing will document</p>
                </div>
                <input
                  type="checkbox"
                  checked={estatePlan.estateOverview.hasWill}
                  onChange={(e) => setEstatePlan({
                    ...estatePlan,
                    estateOverview: { ...estatePlan.estateOverview, hasWill: e.target.checked },
                  })}
                  className="h-4 w-4"
                />
              </div>
              {estatePlan.estateOverview.hasWill && (
                <div>
                  <Label htmlFor="willDate">Will Date</Label>
                  <Input
                    id="willDate"
                    type="date"
                    value={estatePlan.estateOverview.willDate || ''}
                    onChange={(e) => setEstatePlan({
                      ...estatePlan,
                      estateOverview: { ...estatePlan.estateOverview, willDate: e.target.value },
                    })}
                  />
                </div>
              )}
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-lg">
                <div>
                  <Label>Do you have a trust?</Label>
                  <p className="text-sm text-muted-foreground">Existing trust document</p>
                </div>
                <input
                  type="checkbox"
                  checked={estatePlan.estateOverview.hasTrust}
                  onChange={(e) => setEstatePlan({
                    ...estatePlan,
                    estateOverview: { ...estatePlan.estateOverview, hasTrust: e.target.checked },
                  })}
                  className="h-4 w-4"
                />
              </div>
              {estatePlan.estateOverview.hasTrust && (
                <div>
                  <Label htmlFor="trustDate">Trust Date</Label>
                  <Input
                    id="trustDate"
                    type="date"
                    value={estatePlan.estateOverview.trustDate || ''}
                    onChange={(e) => setEstatePlan({
                      ...estatePlan,
                      estateOverview: { ...estatePlan.estateOverview, trustDate: e.target.value },
                    })}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Beneficiaries</h3>
                <p className="text-sm text-muted-foreground">Add people who will inherit your estate</p>
              </div>
              <Button onClick={() => {
                setBeneficiaryForm({ name: '', relationship: '', percentage: 0, isPrimary: false })
                setEditingBeneficiary(null)
                setIsAddBeneficiaryOpen(true)
              }}>
                <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                Add Beneficiary
              </Button>
            </div>
            <div className="space-y-2">
              {estatePlan.beneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id} className="border border-border/60">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{beneficiary.name}</span>
                          {beneficiary.isPrimary && (
                            <Badge className="bg-foreground/5 text-foreground border-border/60 text-xs">Primary</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {beneficiary.relationship} • {beneficiary.percentage}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBeneficiary(beneficiary)}
                        >
                          <Icon icon="solar:pen-bold-duotone" className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                          className="text-foreground hover:text-foreground/80"
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {estatePlan.beneficiaries.length > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Total: <span className="font-semibold">
                    {estatePlan.beneficiaries.reduce((sum, b) => sum + b.percentage, 0)}%
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Executors</h3>
                  <p className="text-sm text-muted-foreground">People who will manage your estate</p>
                </div>
                <Button onClick={() => {
                  setExecutorForm({ name: '', relationship: '', email: '', phone: '' })
                  setEditingExecutor(null)
                  setIsAddExecutorOpen(true)
                }}>
                  <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                  Add Executor
                </Button>
              </div>
              <div className="space-y-2">
                {estatePlan.executors.map((executor) => (
                  <Card key={executor.id} className="border border-border/60">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-medium">{executor.name}</span>
                          <p className="text-sm text-muted-foreground">
                            {executor.relationship}
                            {executor.email && ` • ${executor.email}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditExecutor(executor)}
                          >
                            <Icon icon="solar:pen-bold-duotone" className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteExecutor(executor.id)}
                            className="text-foreground hover:text-foreground/80"
                          >
                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="border-t border-border/60 pt-6">
              <h3 className="font-semibold mb-4">Healthcare Directives</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="proxyName">Healthcare Proxy Name</Label>
                  <Input
                    id="proxyName"
                    value={estatePlan.healthcare.proxyName}
                    onChange={(e) => setEstatePlan({
                      ...estatePlan,
                      healthcare: { ...estatePlan.healthcare, proxyName: e.target.value },
                    })}
                    placeholder="Enter healthcare proxy name"
                  />
                </div>
                <div>
                  <Label htmlFor="proxyRelationship">Relationship</Label>
                  <Input
                    id="proxyRelationship"
                    value={estatePlan.healthcare.proxyRelationship}
                    onChange={(e) => setEstatePlan({
                      ...estatePlan,
                      healthcare: { ...estatePlan.healthcare, proxyRelationship: e.target.value },
                    })}
                    placeholder="e.g., Spouse, Child"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-border/60 rounded-lg">
                    <div>
                      <Label>Living Will</Label>
                      <p className="text-sm text-muted-foreground">End-of-life care preferences</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={estatePlan.healthcare.livingWill}
                      onChange={(e) => setEstatePlan({
                        ...estatePlan,
                        healthcare: { ...estatePlan.healthcare, livingWill: e.target.checked },
                      })}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border/60 rounded-lg">
                    <div>
                      <Label>Do Not Resuscitate (DNR)</Label>
                      <p className="text-sm text-muted-foreground">DNR order preference</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={estatePlan.healthcare.dnr}
                      onChange={(e) => setEstatePlan({
                        ...estatePlan,
                        healthcare: { ...estatePlan.healthcare, dnr: e.target.checked },
                      })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-6 bg-muted rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Review Your Estate Plan</h3>
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="estate">Estate</TabsTrigger>
                  <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
                  <TabsTrigger value="executors">Executors</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-2 mt-4">
                  {Object.entries(estatePlan.personalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{String(value || 'N/A')}</span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="estate" className="space-y-2 mt-4">
                  {Object.entries(estatePlan.estateOverview).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value || 'N/A')}
                      </span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="beneficiaries" className="space-y-2 mt-4">
                  {estatePlan.beneficiaries.map((b) => (
                    <div key={b.id} className="p-2 border border-border/60 rounded text-sm">
                      <span className="font-medium">{b.name}</span> - {b.relationship} ({b.percentage}%)
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="executors" className="space-y-2 mt-4">
                  {estatePlan.executors.map((e) => (
                    <div key={e.id} className="p-2 border border-border/60 rounded text-sm">
                      <span className="font-medium">{e.name}</span> - {e.relationship}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/60">
              <div className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold-duotone" className="h-5 w-5 text-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Ready to Complete</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your estate plan is complete. Click "Complete" to save and generate your documents.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <PageIntro 
          pageId="estate-builder" 
          pageName="ESTATE BUILDER"
          description="Create a comprehensive estate plan step-by-step. This wizard guides you through personal information, estate overview, beneficiaries, executors, and healthcare directives."
          highlights={[
            {
              selector: '[data-intro="step-indicator"]',
              description: "Track your progress through the estate planning process",
              position: 'bottom'
            },
            {
              selector: '[data-intro="progress-bar"]',
              description: "See how much of your estate plan is complete",
              position: 'bottom'
            }
          ]}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                  <Icon icon="solar:wrench-bold-duotone" className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1.5">
                    Estate Builder
                  </h1>
                  <p className="text-muted-foreground">
                    Step-by-step estate planning wizard to secure your legacy
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6" data-intro="progress-bar">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

          {/* Step Indicator */}
          <div className="mb-6" data-intro="step-indicator">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                      currentStep >= step.id
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-border"
                    )}>
                      {currentStep > step.id ? (
                        <Icon icon="solar:check-circle-bold" className="h-5 w-5" />
                      ) : (
                        <Icon icon={step.icon} className="h-5 w-5" />
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-2 text-center max-w-[80px]",
                      currentStep >= step.id ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "h-0.5 flex-1 mx-2 transition-all",
                      currentStep > step.id ? "bg-foreground" : "bg-border"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <Card className="border border-border/60">
            <CardHeader>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Step {currentStep} of {steps.length}
                  </span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <CardTitle className="flex items-center gap-2">
                <Icon icon={steps[currentStep - 1].icon} className="h-5 w-5" />
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="mt-1">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
              <div className="flex justify-between mt-8 pt-6 border-t border-border/60">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <Icon icon="solar:arrow-left-bold" className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === steps.length ? 'Complete' : 'Next'}
                  <Icon icon="solar:arrow-right-bold" className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </PageIntro>
      </main>

      {/* Add/Edit Beneficiary Dialog */}
      <Dialog open={isAddBeneficiaryOpen} onOpenChange={(open) => {
        if (!open) {
          setBeneficiaryForm({ name: '', relationship: '', percentage: 0, isPrimary: false })
          setEditingBeneficiary(null)
        }
        setIsAddBeneficiaryOpen(open)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBeneficiary ? 'Edit Beneficiary' : 'Add Beneficiary'}</DialogTitle>
            <DialogDescription>
              Add a person who will inherit from your estate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="beneficiary-name">Name *</Label>
              <Input
                id="beneficiary-name"
                value={beneficiaryForm.name}
                onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, name: e.target.value })}
                placeholder="Enter beneficiary name"
              />
            </div>
            <div>
              <Label htmlFor="beneficiary-relationship">Relationship *</Label>
              <Input
                id="beneficiary-relationship"
                value={beneficiaryForm.relationship}
                onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, relationship: e.target.value })}
                placeholder="e.g., Spouse, Child, Friend"
              />
            </div>
            <div>
              <Label htmlFor="beneficiary-percentage">Percentage (%) *</Label>
              <Input
                id="beneficiary-percentage"
                type="number"
                min="0"
                max="100"
                value={beneficiaryForm.percentage}
                onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, percentage: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="beneficiary-primary"
                checked={beneficiaryForm.isPrimary}
                onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, isPrimary: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="beneficiary-primary">Primary Beneficiary</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBeneficiaryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBeneficiary}>
              {editingBeneficiary ? 'Update' : 'Add'} Beneficiary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Executor Dialog */}
      <Dialog open={isAddExecutorOpen} onOpenChange={(open) => {
        if (!open) {
          setExecutorForm({ name: '', relationship: '', email: '', phone: '' })
          setEditingExecutor(null)
        }
        setIsAddExecutorOpen(open)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingExecutor ? 'Edit Executor' : 'Add Executor'}</DialogTitle>
            <DialogDescription>
              Add a person who will manage your estate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="executor-name">Name *</Label>
              <Input
                id="executor-name"
                value={executorForm.name}
                onChange={(e) => setExecutorForm({ ...executorForm, name: e.target.value })}
                placeholder="Enter executor name"
              />
            </div>
            <div>
              <Label htmlFor="executor-relationship">Relationship *</Label>
              <Input
                id="executor-relationship"
                value={executorForm.relationship}
                onChange={(e) => setExecutorForm({ ...executorForm, relationship: e.target.value })}
                placeholder="e.g., Spouse, Lawyer, Friend"
              />
            </div>
            <div>
              <Label htmlFor="executor-email">Email</Label>
              <Input
                id="executor-email"
                type="email"
                value={executorForm.email}
                onChange={(e) => setExecutorForm({ ...executorForm, email: e.target.value })}
                placeholder="executor@example.com"
              />
            </div>
            <div>
              <Label htmlFor="executor-phone">Phone</Label>
              <Input
                id="executor-phone"
                type="tel"
                value={executorForm.phone}
                onChange={(e) => setExecutorForm({ ...executorForm, phone: e.target.value })}
                placeholder="+27 12 345 6789"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExecutorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExecutor}>
              {editingExecutor ? 'Update' : 'Add'} Executor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
