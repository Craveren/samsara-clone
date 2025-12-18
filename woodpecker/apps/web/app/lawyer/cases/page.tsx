'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { formatDate } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import Link from 'next/link'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface Case {
  id: string
  caseNumber: string
  clientName: string
  legacyId: string
  legacyName: string
  caseType: 'estate_planning' | 'will_drafting' | 'trust_setup' | 'probate' | 'tax_planning'
  status: 'active' | 'pending' | 'completed' | 'on_hold'
  priority: 'high' | 'medium' | 'low'
  openedDate: string
  lastActivity: string
  documentsCount: number
  tasksCount: number
  completedTasks: number
  estimatedValue?: number
}

export default function LawyerCasesPage() {
  const [cases, setCases] = useLocalStorage<Case[]>('lawyer-cases', [
    {
      id: '1',
      caseNumber: 'CASE-2024-001',
      clientName: 'John Doe',
      legacyId: 'legacy-1',
      legacyName: 'John Doe Estate',
      caseType: 'estate_planning',
      status: 'active',
      priority: 'high',
      openedDate: '2024-01-10',
      lastActivity: '2024-01-20',
      documentsCount: 12,
      tasksCount: 15,
      completedTasks: 8,
      estimatedValue: 2500000,
    },
    {
      id: '2',
      caseNumber: 'CASE-2024-002',
      clientName: 'Sarah Williams',
      legacyId: 'legacy-2',
      legacyName: 'Williams Family Trust',
      caseType: 'trust_setup',
      status: 'active',
      priority: 'medium',
      openedDate: '2024-01-15',
      lastActivity: '2024-01-19',
      documentsCount: 8,
      tasksCount: 10,
      completedTasks: 5,
      estimatedValue: 1800000,
    },
    {
      id: '3',
      caseNumber: 'CASE-2024-003',
      clientName: 'Michael Chen',
      legacyId: 'legacy-3',
      legacyName: 'Chen Estate Planning',
      caseType: 'will_drafting',
      status: 'pending',
      priority: 'high',
      openedDate: '2024-01-18',
      lastActivity: '2024-01-18',
      documentsCount: 5,
      tasksCount: 8,
      completedTasks: 2,
      estimatedValue: 1200000,
    },
  ])

  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'pending' | 'completed' | 'on_hold'>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isNewCaseOpen, setIsNewCaseOpen] = React.useState(false)
  const [newCase, setNewCase] = React.useState({
    clientName: '',
    caseType: 'estate_planning' as Case['caseType'],
    priority: 'medium' as Case['priority'],
  })

  const filteredCases = React.useMemo(() => {
    return cases.filter(c => {
      const matchesStatus = filterStatus === 'all' || c.status === filterStatus
      const matchesSearch = !searchQuery || 
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.legacyName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [cases, filterStatus, searchQuery])

  const stats = React.useMemo(() => ({
    total: cases.length,
    active: cases.filter(c => c.status === 'active').length,
    pending: cases.filter(c => c.status === 'pending').length,
    completed: cases.filter(c => c.status === 'completed').length,
    totalValue: cases.reduce((sum, c) => sum + (c.estimatedValue || 0), 0),
  }), [cases])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-foreground/5 text-foreground border-border/60'
      case 'pending': return 'bg-foreground/5 text-foreground border-border/60'
      case 'completed': return 'bg-foreground/5 text-foreground border-border/60'
      case 'on_hold': return 'bg-muted/50 text-muted-foreground border-border/40'
      default: return ''
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-foreground/5 text-foreground border-border/60'
      case 'medium': return 'bg-foreground/5 text-foreground border-border/60'
      case 'low': return 'bg-muted/50 text-muted-foreground border-border/40'
      default: return ''
    }
  }

  const getCaseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      estate_planning: 'Estate Planning',
      will_drafting: 'Will Drafting',
      trust_setup: 'Trust Setup',
      probate: 'Probate',
      tax_planning: 'Tax Planning',
    }
    return labels[type] || type
  }

  const completionPercentage = (c: Case) => {
    if (c.tasksCount === 0) return 0
    return Math.round((c.completedTasks / c.tasksCount) * 100)
  }

  // Chart data for case activity
  const activityData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      const monthKey = date.toISOString().slice(0, 7)
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        opened: cases.filter(c => c.openedDate.startsWith(monthKey)).length,
        completed: cases.filter(c => c.status === 'completed' && c.lastActivity.startsWith(monthKey)).length,
      }
    })
    return last6Months
  }, [cases])

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Case Management
                </h1>
                <p className="text-muted-foreground">
                  Manage all your legal cases, track progress, and monitor client matters
                </p>
              </div>
              <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-foreground text-background hover:bg-foreground/90">
                    <Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4 mr-2" />
                    New Case
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Case</DialogTitle>
                    <DialogDescription>
                      Create a new case for a client matter
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="case-client">Client Name *</Label>
                      <Input 
                        id="case-client" 
                        placeholder="Enter client name" 
                        value={newCase.clientName}
                        onChange={(e) => setNewCase({ ...newCase, clientName: e.target.value })}
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="case-type">Case Type *</Label>
                      <Select 
                        value={newCase.caseType}
                        onValueChange={(value) => setNewCase({ ...newCase, caseType: value as Case['caseType'] })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select case type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estate_planning">Estate Planning</SelectItem>
                          <SelectItem value="will_drafting">Will Drafting</SelectItem>
                          <SelectItem value="trust_setup">Trust Setup</SelectItem>
                          <SelectItem value="probate">Probate</SelectItem>
                          <SelectItem value="tax_planning">Tax Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="case-priority">Priority *</Label>
                      <Select 
                        value={newCase.priority}
                        onValueChange={(value) => setNewCase({ ...newCase, priority: value as Case['priority'] })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewCaseOpen(false)}>Cancel</Button>
                    <Button 
                      className="bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => {
                        if (!newCase.clientName.trim()) {
                          toast.error('Client name required', 'Please enter a client name')
                          return
                        }
                        const caseNumber = `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`
                        const newCaseData: Case = {
                          id: Date.now().toString(),
                          caseNumber,
                          clientName: newCase.clientName,
                          legacyId: `legacy-${Date.now()}`,
                          legacyName: `${newCase.clientName} ${getCaseTypeLabel(newCase.caseType)}`,
                          caseType: newCase.caseType,
                          status: 'pending',
                          priority: newCase.priority,
                          openedDate: new Date().toISOString().split('T')[0],
                          lastActivity: new Date().toISOString().split('T')[0],
                          documentsCount: 0,
                          tasksCount: 0,
                          completedTasks: 0,
                        }
                        setCases([...cases, newCaseData])
                        setNewCase({ clientName: '', caseType: 'estate_planning', priority: 'medium' })
                        setIsNewCaseOpen(false)
                        toast.success('Case created', `${caseNumber} has been created`)
                      }}
                    >
                      Create Case
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Cases</p>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:briefcase-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Active</p>
                      <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:check-circle-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pending</p>
                      <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:clock-circle-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Completed</p>
                      <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:checklist-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-foreground">
                        R{(stats.totalValue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cases by number, client, or legacy name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border/60 rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'pending', 'completed', 'on_hold'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    filterStatus === status 
                      ? 'bg-foreground text-background' 
                      : 'border-border/60'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {filteredCases.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-base font-semibold">{c.legacyName}</CardTitle>
                          <Badge variant="outline" className={cn('text-[10px]', getStatusColor(c.status))}>
                            {c.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={cn('text-[10px]', getPriorityColor(c.priority))}>
                            {c.priority}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {c.caseNumber} • {c.clientName}
                        </CardDescription>
                        <Badge variant="outline" className="text-[10px] mt-1">
                          {getCaseTypeLabel(c.caseType)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                        <p className="font-semibold text-foreground">{c.completedTasks}/{c.tasksCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Documents</p>
                        <p className="font-semibold text-foreground">{c.documentsCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Progress</p>
                        <p className="font-semibold text-foreground">{completionPercentage(c)}%</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{completionPercentage(c)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-foreground transition-all" 
                          style={{ width: `${completionPercentage(c)}%` }}
                        />
                      </div>
                    </div>

                    {c.estimatedValue && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Estimated Value</p>
                        <p className="text-lg font-bold text-foreground">
                          R{c.estimatedValue.toLocaleString('en-ZA')}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3 border-t border-border/40">
                      <Link href={`/lawyer/clients/${c.legacyId}/legacy`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-border/60 hover:bg-muted/50">
                          <Icon icon="solar:document-text-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                          View Legacy
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/60 hover:bg-muted/50"
                        onClick={() => window.location.href = `/communication?clientId=${c.legacyId}`}
                      >
                        <Icon icon="solar:chat-round-dots-bold-duotone" className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Activity Chart */}
          <Card className="border border-border/40">
            <CardHeader>
              <CardTitle>Case Activity</CardTitle>
              <CardDescription>6-month case opening and completion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
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
                                {entry.name === 'opened' ? 'Opened' : 'Completed'}: {entry.value}
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#000000" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorOpened)" 
                    name="opened"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#6A6A6A" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                    name="completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredCases.length === 0 && (
            <Card className="border border-border/60">
              <CardContent className="py-16 text-center">
                <Icon icon="solar:briefcase-bold-duotone" className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || filterStatus !== 'all' ? 'No cases found' : 'No cases yet'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Cases will appear here when you start working on client matters.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

