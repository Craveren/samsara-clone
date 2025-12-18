'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils/date-format'

interface Trigger {
  id: string
  name: string
  description: string
  type: 'date' | 'event' | 'condition'
  status: 'active' | 'inactive'
  action: string
  schedule?: string
  conditions?: string[]
  lastTriggered?: Date
  nextTrigger?: Date
}

// Phase 1: Basic CRUD
// Phase 2: Advanced scheduling and conditions
// Phase 3: Analytics and monitoring

export default function AutomationTriggersPage() {
  const { toast } = useToast()
  const [triggers, setTriggers] = useLocalStorage<Trigger[]>('automation-triggers', [
    {
      id: '1',
      name: 'Annual Will Review',
      description: 'Remind to review will every year on anniversary date',
      type: 'date',
      status: 'active',
      action: 'Send reminder email',
      schedule: 'yearly',
      lastTriggered: new Date('2024-01-15'),
      nextTrigger: new Date('2025-01-15'),
    },
    {
      id: '2',
      name: 'Beneficiary Birthday',
      description: 'Send birthday wishes to beneficiaries',
      type: 'event',
      status: 'active',
      action: 'Send birthday email',
      lastTriggered: new Date('2024-03-20'),
    },
  ])
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingTrigger, setEditingTrigger] = React.useState<Trigger | null>(null)
  const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'inactive'>('all')
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    type: 'date' as Trigger['type'],
    action: '',
    schedule: 'monthly',
    conditions: [] as string[],
  })

  const filteredTriggers = React.useMemo(() => {
    if (activeTab === 'all') return triggers
    return triggers.filter(t => t.status === activeTab)
  }, [triggers, activeTab])

  const handleAdd = () => {
    if (!formData.name || !formData.action) {
      toast.error('Required fields', 'Name and action are required')
      return
    }

    const newTrigger: Trigger = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      nextTrigger: formData.type === 'date' ? new Date() : undefined,
    }

    setTriggers([...triggers, newTrigger])
    resetForm()
    toast.success('Trigger created', `${newTrigger.name} has been added`)
  }

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger)
    setFormData({
      name: trigger.name,
      description: trigger.description,
      type: trigger.type,
      action: trigger.action,
      schedule: trigger.schedule || 'monthly',
      conditions: trigger.conditions || [],
    })
    setIsAddOpen(true)
  }

  const handleUpdate = () => {
    if (!editingTrigger || !formData.name || !formData.action) {
      toast.error('Required fields', 'Name and action are required')
      return
    }

    setTriggers(triggers.map(t => 
      t.id === editingTrigger.id 
        ? { ...t, ...formData }
        : t
    ))
    resetForm()
    toast.success('Trigger updated', `${formData.name} has been updated`)
  }

  const handleDelete = (id: string) => {
    setTriggers(triggers.filter(t => t.id !== id))
    toast.success('Trigger deleted', 'The trigger has been removed')
  }

  const toggleTrigger = (id: string) => {
    setTriggers(triggers.map(t => 
      t.id === id 
        ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
        : t
    ))
    toast.success('Status updated', 'Trigger status has been changed')
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', type: 'date', action: '', schedule: 'monthly', conditions: [] })
    setEditingTrigger(null)
    setIsAddOpen(false)
  }

  const stats = React.useMemo(() => ({
    total: triggers.length,
    active: triggers.filter(t => t.status === 'active').length,
    inactive: triggers.filter(t => t.status === 'inactive').length,
    triggeredToday: triggers.filter(t => {
      if (!t.lastTriggered) return false
      const today = new Date()
      const lastTrigger = new Date(t.lastTriggered)
      return lastTrigger.toDateString() === today.toDateString()
    }).length,
  }), [triggers])

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                Automation & Triggers
              </h1>
              <p className="text-sm text-muted-foreground">
                Set up automated actions based on dates, events, or conditions
              </p>
            </div>
            <Button 
              onClick={() => {
                resetForm()
                setIsAddOpen(true)
              }}
              className="hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <Icon icon="solar:bolt-bold-duotone" className="h-4 w-4 mr-2" />
              Create Trigger
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border border-border/60 hover:border-border/80 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Triggers</p>
                    <p className="text-2xl font-semibold">{stats.total}</p>
                  </div>
                  <Icon icon="solar:bolt-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 hover:border-border/80 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
                  </div>
                  <Icon icon="solar:power-bold-duotone" className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 hover:border-border/80 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive</p>
                    <p className="text-2xl font-semibold text-muted-foreground">{stats.inactive}</p>
                  </div>
                  <Icon icon="solar:power-bold" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 hover:border-border/80 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Triggered Today</p>
                    <p className="text-2xl font-semibold">{stats.triggeredToday}</p>
                  </div>
                  <Icon icon="solar:calendar-mark-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({triggers.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTriggers.map((trigger, index) => (
                  <motion.div
                    key={trigger.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className={cn(
                      "border border-border/60 hover:border-border/80 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:scale-[1.01] cursor-pointer",
                      trigger.status === 'active' && "ring-2 ring-foreground/20"
                    )}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {trigger.name}
                              {trigger.status === 'active' && (
                                <Badge className="bg-foreground/5 text-foreground border-border/60 text-[10px]">Active</Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">{trigger.description}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTrigger(trigger.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Icon
                              icon={trigger.status === 'active' ? 'solar:power-bold-duotone' : 'solar:power-bold'}
                              className={cn(
                                "h-4 w-4",
                                trigger.status === 'active' ? 'text-foreground' : 'text-muted-foreground'
                              )}
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {trigger.type}
                            </Badge>
                            {trigger.schedule && (
                              <Badge variant="outline" className="text-xs">
                                {trigger.schedule}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Action:</span> {trigger.action}
                          </p>
                          {trigger.nextTrigger && (
                            <p className="text-xs text-muted-foreground">
                              Next: {formatDate(trigger.nextTrigger, 'MMM d, yyyy')}
                            </p>
                          )}
                          {trigger.lastTriggered && (
                            <p className="text-xs text-muted-foreground">
                              Last: {formatDate(trigger.lastTriggered, 'MMM d, yyyy')}
                            </p>
                          )}
                          <div className="flex gap-2 pt-2 border-t border-border/60">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(trigger)}
                              className="flex-1 hover:shadow-sm hover:scale-[1.02] transition-all duration-200"
                            >
                              <Icon icon="solar:pen-bold-duotone" className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(trigger.id)}
                              className="text-foreground hover:text-foreground/80 hover:shadow-sm hover:scale-[1.02] transition-all duration-200"
                            >
                              <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredTriggers.length === 0 && (
            <Card className="border border-dashed border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Icon icon="solar:bolt-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  No {activeTab === 'all' ? '' : activeTab} automation triggers set up
                </p>
                <Button onClick={() => {
                  resetForm()
                  setIsAddOpen(true)
                }}>
                  Create First Trigger
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add/Edit Trigger Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(open) => {
        if (!open) resetForm()
        setIsAddOpen(open)
      }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTrigger ? 'Edit Trigger' : 'Create Automation Trigger'}</DialogTitle>
            <DialogDescription>
              Set up an automated action based on a condition, date, or event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Trigger Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Annual Will Review"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What this trigger does"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="type">Trigger Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Trigger['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date-based</SelectItem>
                  <SelectItem value="event">Event-based</SelectItem>
                  <SelectItem value="condition">Condition-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.type === 'date' && (
              <div>
                <Label htmlFor="schedule">Schedule</Label>
                <Select
                  value={formData.schedule}
                  onValueChange={(value) => setFormData({ ...formData, schedule: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="action">Action *</Label>
              <Input
                id="action"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="e.g., Send reminder email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingTrigger ? handleUpdate : handleAdd}>
              {editingTrigger ? 'Update' : 'Create'} Trigger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
