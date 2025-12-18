'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Input, Label, Textarea } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { PageIntro } from '@/components/onboarding/PageIntro'
import { cn } from '@woodpecker/utils'
import { Progress } from '@woodpecker/ui'

interface Directive {
  id: string
  name: string
  type: 'living-will' | 'healthcare-proxy' | 'power-of-attorney' | 'dnr-order'
  status: 'draft' | 'completed' | 'signed' | 'notarized'
  createdDate: string
  lastModified?: string
  completionPercentage: number
  description?: string
  agentName?: string
  agentContact?: string
}

const directiveTemplates = {
  'living-will': {
    name: 'Living Will',
    description: 'Document your medical treatment preferences if you become unable to communicate',
    icon: 'solar:document-text-bold-duotone',
    color: 'bg-muted/50 border-border/60',
    fields: ['Medical preferences', 'Life support decisions', 'Pain management']
  },
  'healthcare-proxy': {
    name: 'Healthcare Proxy',
    description: 'Appoint someone to make medical decisions on your behalf',
    icon: 'solar:user-id-bold-duotone',
    color: 'bg-muted/50 border-border/60',
    fields: ['Agent name', 'Agent contact', 'Decision-making authority']
  },
  'power-of-attorney': {
    name: 'Power of Attorney',
    description: 'Grant legal authority to someone to act on your behalf',
    icon: 'solar:scale-bold-duotone',
    color: 'bg-muted/50 border-border/60',
    fields: ['Agent name', 'Scope of authority', 'Effective dates']
  },
  'dnr-order': {
    name: 'Do Not Resuscitate Order',
    description: 'Specify that you do not want CPR or advanced cardiac life support',
    icon: 'solar:heart-pulse-bold-duotone',
    color: 'bg-muted/50 border-border/60',
    fields: ['Medical conditions', 'CPR preferences', 'Physician signature']
  }
}

export default function HealthcareDirectivesPage() {
  const { toast } = useToast()
  const [directives, setDirectives] = useLocalStorage<Directive[]>('healthcare-directives', [])
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [selectedDirective, setSelectedDirective] = React.useState<Directive | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'living-will' as Directive['type'],
    description: '',
    agentName: '',
    agentContact: '',
  })

  const handleAdd = () => {
    if (!formData.name.trim()) {
      toast.error('Name required', 'Please enter a directive name')
      return
    }

    const newDirective: Directive = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      status: 'draft',
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      completionPercentage: 0,
      description: formData.description || undefined,
      agentName: formData.agentName || undefined,
      agentContact: formData.agentContact || undefined,
    }

    setDirectives([...directives, newDirective])
    setFormData({ name: '', type: 'living-will', description: '', agentName: '', agentContact: '' })
    setIsAddOpen(false)
    toast.success('Directive created', `${newDirective.name} has been created`)
  }

  const handleDirectiveClick = (directive: Directive) => {
    setSelectedDirective(directive)
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = (id: string, newStatus: Directive['status']) => {
    setDirectives(prev => prev.map(d => 
      d.id === id 
        ? { ...d, status: newStatus, lastModified: new Date().toISOString() }
        : d
    ))
    toast.success('Status updated', 'Directive status has been updated')
  }

  const handleDelete = (id: string) => {
    setDirectives(prev => prev.filter(d => d.id !== id))
    toast.success('Directive deleted', 'The directive has been removed')
    if (selectedDirective?.id === id) {
      setIsDetailOpen(false)
    }
  }

  const stats = React.useMemo(() => {
    const total = directives.length
    const completed = directives.filter(d => d.status === 'completed' || d.status === 'signed' || d.status === 'notarized').length
    const drafts = directives.filter(d => d.status === 'draft').length
    return { total, completed, drafts }
  }, [directives])

  return (
    <PageIntro
      pageId="healthcare-directives"
      pageName="HEALTHCARE DIRECTIVES"
      description="Manage your advance healthcare directives, living will, healthcare proxy, and power of attorney documents. Ensure your medical wishes are documented and legally binding."
      highlights={[
        {
          selector: '[data-intro="create-directive"]',
          description: "Create new healthcare directives to document your medical preferences",
          position: 'bottom'
        },
        {
          selector: '[data-intro="directive-templates"]',
          description: "Choose from different types of healthcare directives based on your needs",
          position: 'right'
        }
      ]}
    >
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Healthcare Directives
                </h1>
                <p className="text-muted-foreground">
                  Manage your advance healthcare directives, living will, and medical power of attorney
                </p>
              </div>
              <Button 
                onClick={() => setIsAddOpen(true)}
                data-intro="create-directive"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Icon icon="solar:document-add-bold-duotone" className="h-4 w-4 mr-2" />
                Create Directive
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Directives</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Icon icon="solar:document-text-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completed</p>
                      <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                    </div>
                    <Icon icon="solar:check-circle-bold-duotone" className="h-8 w-8 text-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                      <p className="text-2xl font-bold text-foreground">{stats.drafts}</p>
                    </div>
                    <Icon icon="solar:clock-circle-bold-duotone" className="h-8 w-8 text-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Directive Templates Info */}
            <Card className="border border-border/60 mb-6" data-intro="directive-templates">
              <CardHeader>
                <CardTitle>Types of Healthcare Directives</CardTitle>
                <CardDescription>Choose the right directive type for your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(directiveTemplates).map(([key, template]) => (
                    <div
                      key={key}
                      className={cn(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
                        template.color
                      )}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, type: key as Directive['type'] }))
                        setIsAddOpen(true)
                      }}
                    >
                      <Icon icon={template.icon} className="h-6 w-6 mb-2" />
                      <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                      <p className="text-xs opacity-80">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Directives Grid */}
            {directives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {directives.map((directive) => {
                  const template = directiveTemplates[directive.type]
                  return (
                    <Card 
                      key={directive.id} 
                      className={cn(
                        'border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
                        template.color
                      )}
                      onClick={() => handleDirectiveClick(directive)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={cn('p-2 rounded-lg', template.color.split(' ')[1])}>
                              <Icon icon={template.icon} className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base truncate">{directive.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {template.name}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs capitalize border-border/60"
                          >
                            {directive.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {directive.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {directive.description}
                            </p>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Completion</span>
                              <span className="font-medium">{directive.completionPercentage}%</span>
                            </div>
                            <Progress value={directive.completionPercentage} className="h-1.5" />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Created {new Date(directive.createdDate).toLocaleDateString()}</span>
                            {directive.lastModified && (
                              <span>Updated {new Date(directive.lastModified).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border border-dashed border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Icon icon="solar:document-text-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Healthcare Directives
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                    Create your first healthcare directive to ensure your medical wishes are documented and legally binding.
                  </p>
                  <Button onClick={() => setIsAddOpen(true)}>
                    <Icon icon="solar:document-add-bold-duotone" className="h-4 w-4 mr-2" />
                    Create First Directive
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Add Directive Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Healthcare Directive</DialogTitle>
              <DialogDescription>
                {formData.type && directiveTemplates[formData.type]?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Directive Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Living Will 2024"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Directive Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Directive['type'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-will">Living Will</SelectItem>
                    <SelectItem value="healthcare-proxy">Healthcare Proxy</SelectItem>
                    <SelectItem value="power-of-attorney">Power of Attorney</SelectItem>
                    <SelectItem value="dnr-order">Do Not Resuscitate Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this directive"
                  rows={3}
                  className="mt-1"
                />
              </div>
              {(formData.type === 'healthcare-proxy' || formData.type === 'power-of-attorney') && (
                <>
                  <div>
                    <Label htmlFor="agentName">Agent Name</Label>
                    <Input
                      id="agentName"
                      value={formData.agentName}
                      onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                      placeholder="Name of person authorized"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agentContact">Agent Contact</Label>
                    <Input
                      id="agentContact"
                      value={formData.agentContact}
                      onChange={(e) => setFormData({ ...formData, agentContact: e.target.value })}
                      placeholder="Email or phone number"
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={!formData.name.trim()}>
                Create Directive
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Directive Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedDirective && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Icon 
                      icon={directiveTemplates[selectedDirective.type].icon} 
                      className="h-6 w-6"
                    />
                    <div>
                      <DialogTitle>{selectedDirective.name}</DialogTitle>
                      <DialogDescription>
                        {directiveTemplates[selectedDirective.type].name}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <Badge variant="outline" className="capitalize">
                          {selectedDirective.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Completion</Label>
                      <div className="mt-1">
                        <Progress value={selectedDirective.completionPercentage} className="h-2" />
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {selectedDirective.completionPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedDirective.description && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm text-foreground mt-1">{selectedDirective.description}</p>
                    </div>
                  )}

                  {(selectedDirective.agentName || selectedDirective.agentContact) && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Agent Information</Label>
                      <div className="mt-1 space-y-1">
                        {selectedDirective.agentName && (
                          <p className="text-sm text-foreground">Name: {selectedDirective.agentName}</p>
                        )}
                        {selectedDirective.agentContact && (
                          <p className="text-sm text-foreground">Contact: {selectedDirective.agentContact}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-xs text-muted-foreground">Created</Label>
                      <p className="text-sm text-foreground mt-1">
                        {new Date(selectedDirective.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedDirective.lastModified && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Last Modified</Label>
                        <p className="text-sm text-foreground mt-1">
                          {new Date(selectedDirective.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsDetailOpen(false)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const nextStatus: Directive['status'][] = ['draft', 'completed', 'signed', 'notarized']
                        const currentIndex = nextStatus.indexOf(selectedDirective.status)
                        const nextIndex = currentIndex < nextStatus.length - 1 ? currentIndex + 1 : currentIndex
                        handleUpdateStatus(selectedDirective.id, nextStatus[nextIndex])
                      }}
                    >
                      <Icon icon="solar:check-circle-bold-duotone" className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this directive?')) {
                          handleDelete(selectedDirective.id)
                        }
                      }}
                      className="text-foreground hover:text-foreground/80"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageIntro>
  )
}
