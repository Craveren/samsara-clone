'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useToast } from '@/lib/hooks'

interface Template {
  id: string
  name: string
  description: string
  category: 'will' | 'trust' | 'power-of-attorney' | 'living-will' | 'healthcare' | 'custom'
  content: string
  variables: string[]
  createdAt: string
  updatedAt: string
  usageCount: number
}

const defaultTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Simple Last Will and Testament',
    description: 'A basic last will template for individuals with straightforward estate planning needs.',
    category: 'will',
    content: `LAST WILL AND TESTAMENT OF {{CLIENT_NAME}}

I, {{CLIENT_NAME}}, residing at {{CLIENT_ADDRESS}}, being of sound mind and memory, hereby declare this to be my Last Will and Testament, hereby revoking all previous wills and codicils.

ARTICLE I - FAMILY
I am {{MARITAL_STATUS}}. {{SPOUSE_CLAUSE}}
My children are: {{CHILDREN_LIST}}

ARTICLE II - DEBTS AND EXPENSES
I direct my Executor to pay all my legally enforceable debts, funeral expenses, and costs of administration of my estate as soon as practicable after my death.

ARTICLE III - SPECIFIC BEQUESTS
{{SPECIFIC_BEQUESTS}}

ARTICLE IV - RESIDUARY ESTATE
I give, devise, and bequeath the rest, residue, and remainder of my estate to {{RESIDUARY_BENEFICIARIES}}

ARTICLE V - EXECUTOR
I nominate and appoint {{EXECUTOR_NAME}} as Executor of this Will. If {{EXECUTOR_NAME}} is unable or unwilling to serve, I nominate {{ALTERNATE_EXECUTOR}} as alternate Executor.

ARTICLE VI - POWERS OF EXECUTOR
I grant my Executor full power and authority to carry out all provisions of this Will without bond.

IN WITNESS WHEREOF, I have signed this Will on {{DATE}}.

_________________________
{{CLIENT_NAME}}, Testator

WITNESSES:
_________________________
Witness 1: Name, Address

_________________________
Witness 2: Name, Address`,
    variables: ['CLIENT_NAME', 'CLIENT_ADDRESS', 'MARITAL_STATUS', 'SPOUSE_CLAUSE', 'CHILDREN_LIST', 'SPECIFIC_BEQUESTS', 'RESIDUARY_BENEFICIARIES', 'EXECUTOR_NAME', 'ALTERNATE_EXECUTOR', 'DATE'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 45,
  },
  {
    id: 'template-2',
    name: 'Revocable Living Trust',
    description: 'A living trust template that allows assets to bypass probate while maintaining control during lifetime.',
    category: 'trust',
    content: `REVOCABLE LIVING TRUST OF {{GRANTOR_NAME}}

This Trust Agreement is made on {{DATE}} by {{GRANTOR_NAME}} ("Grantor"), who is also the initial Trustee.

ARTICLE I - TRUST PROPERTY
The Grantor hereby transfers to the Trustee the property described in Schedule A, attached hereto and incorporated by reference.

ARTICLE II - BENEFICIARIES
During the Grantor's lifetime, the Grantor shall be the primary beneficiary.
Upon the Grantor's death, the trust property shall be distributed to: {{BENEFICIARIES_LIST}}

ARTICLE III - TRUSTEE POWERS
The Trustee shall have all powers conferred by law, including the power to:
- Invest and reinvest trust assets
- Buy, sell, or lease property
- Distribute income and principal
- Employ professionals as needed

ARTICLE IV - SUCCESSOR TRUSTEE
If {{GRANTOR_NAME}} can no longer serve as Trustee, {{SUCCESSOR_TRUSTEE}} shall serve as Successor Trustee.

ARTICLE V - REVOCATION
This trust may be revoked or amended by the Grantor at any time during the Grantor's lifetime.

IN WITNESS WHEREOF, the Grantor has executed this Trust Agreement.

_________________________
{{GRANTOR_NAME}}, Grantor and Trustee`,
    variables: ['GRANTOR_NAME', 'DATE', 'BENEFICIARIES_LIST', 'SUCCESSOR_TRUSTEE'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 32,
  },
  {
    id: 'template-3',
    name: 'Durable Power of Attorney',
    description: 'Grants broad financial powers to an agent that remain effective during incapacity.',
    category: 'power-of-attorney',
    content: `DURABLE POWER OF ATTORNEY

I, {{PRINCIPAL_NAME}}, of {{PRINCIPAL_ADDRESS}}, appoint {{AGENT_NAME}} of {{AGENT_ADDRESS}} as my Agent (Attorney-in-Fact).

GRANT OF AUTHORITY
I grant my Agent full power to act on my behalf in all matters, including but not limited to:
- Banking and financial transactions
- Real estate transactions
- Tax matters
- Insurance and retirement benefits
- Business operations
- Healthcare decisions (if no separate healthcare directive exists)

DURABILITY
This Power of Attorney shall not be affected by my subsequent disability or incapacity.

EFFECTIVE DATE
This Power of Attorney is effective immediately upon signing.

REVOCATION
I may revoke this Power of Attorney at any time by written notice to my Agent.

Signed this {{DATE}}

_________________________
{{PRINCIPAL_NAME}}, Principal

NOTARY ACKNOWLEDGMENT
State of {{STATE}}
County of {{COUNTY}}

On {{DATE}}, before me personally appeared {{PRINCIPAL_NAME}}, known to me to be the person whose name is subscribed to this instrument.

_________________________
Notary Public`,
    variables: ['PRINCIPAL_NAME', 'PRINCIPAL_ADDRESS', 'AGENT_NAME', 'AGENT_ADDRESS', 'DATE', 'STATE', 'COUNTY'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 28,
  },
  {
    id: 'template-4',
    name: 'Living Will / Healthcare Directive',
    description: 'Specifies medical treatment preferences in case of terminal illness or permanent unconsciousness.',
    category: 'living-will',
    content: `LIVING WILL / ADVANCE HEALTHCARE DIRECTIVE

I, {{PATIENT_NAME}}, being of sound mind, make this declaration as a directive to be followed if I become unable to participate in decisions regarding my medical care.

DECLARATION
If at any time I should have a terminal condition and my attending physician has determined there is no reasonable expectation of recovery:

1. I direct that life-sustaining procedures be {{LIFE_SUSTAINING_PREFERENCE}}.

2. I {{PAIN_MANAGEMENT_PREFERENCE}} the administration of medication to alleviate suffering even if it may hasten my death.

3. Regarding artificial nutrition and hydration, I direct that {{NUTRITION_PREFERENCE}}.

ORGAN DONATION
{{ORGAN_DONATION_PREFERENCE}}

HEALTHCARE AGENT
I appoint {{HEALTHCARE_AGENT}} to make healthcare decisions on my behalf if I am unable to do so.

This declaration is made after careful reflection while I am of sound mind.

Signed: {{DATE}}

_________________________
{{PATIENT_NAME}}

WITNESSES
I declare that the person who signed this document did so in my presence and appeared to be of sound mind.

Witness 1: _________________________ Date: _________
Witness 2: _________________________ Date: _________`,
    variables: ['PATIENT_NAME', 'LIFE_SUSTAINING_PREFERENCE', 'PAIN_MANAGEMENT_PREFERENCE', 'NUTRITION_PREFERENCE', 'ORGAN_DONATION_PREFERENCE', 'HEALTHCARE_AGENT', 'DATE'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 19,
  },
]

const categoryConfig = {
  'will': { label: 'Will', icon: 'solar:document-text-bold-duotone', color: 'bg-foreground/5 border border-border/60 text-foreground' },
  'trust': { label: 'Trust', icon: 'solar:safe-2-bold-duotone', color: 'bg-foreground/5 border border-border/60 text-foreground' },
  'power-of-attorney': { label: 'Power of Attorney', icon: 'solar:pen-new-square-bold-duotone', color: 'bg-foreground/5 border border-border/60 text-foreground' },
  'living-will': { label: 'Living Will', icon: 'solar:heart-pulse-bold-duotone', color: 'bg-foreground/5 border border-border/60 text-foreground' },
  'healthcare': { label: 'Healthcare', icon: 'solar:health-bold-duotone', color: 'bg-foreground/5 border border-border/60 text-foreground' },
  'custom': { label: 'Custom', icon: 'solar:file-bold-duotone', color: 'bg-muted/50 border border-border/40 text-muted-foreground' },
}

export default function LawyerTemplatesPage() {
  const { toast } = useToast()
  const [templates, setTemplates] = useLocalStorage<Template[]>('woodpecker-lawyer-templates', defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>('all')
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [newTemplate, setNewTemplate] = React.useState<Partial<Template>>({
    name: '',
    description: '',
    category: 'custom',
    content: '',
    variables: [],
  })

  const filteredTemplates = React.useMemo(() => {
    let filtered = templates
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(t => t.category === activeCategory)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [templates, activeCategory, searchQuery])

  const handleUseTemplate = (template: Template) => {
    // Update usage count
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    ))
    toast.success('Template Ready', `${template.name} is ready to use. Variables have been highlighted.`)
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTemplates(prev => [...prev, newTemplate])
    toast.success('Template Duplicated', 'A copy has been created.')
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-1.5">
                Document Templates
              </h1>
              <p className="text-sm text-muted-foreground">
                Pre-built legal document templates for estate planning
              </p>
            </div>
            <Button 
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setIsCreateOpen(true)}
            >
              <Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-foreground">{templates.length}</div>
                    <div className="text-xs text-muted-foreground">Total Templates</div>
                  </div>
                  <Icon icon="solar:folder-with-files-bold-duotone" className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-foreground">
                      {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Uses</div>
                  </div>
                  <Icon icon="solar:graph-up-bold-duotone" className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-foreground">
                      {templates.filter(t => t.category === 'will').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Will Templates</div>
                  </div>
                  <Icon icon="solar:document-text-bold-duotone" className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-foreground">
                      {templates.filter(t => t.category === 'trust').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Trust Templates</div>
                  </div>
                  <Icon icon="solar:safe-2-bold-duotone" className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/60"
              />
              <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-background">
                All
              </TabsTrigger>
              <TabsTrigger value="will" className="data-[state=active]:bg-background">
                <Icon icon="solar:document-text-linear" className="h-4 w-4 mr-1.5" />
                Wills
              </TabsTrigger>
              <TabsTrigger value="trust" className="data-[state=active]:bg-background">
                <Icon icon="solar:safe-2-linear" className="h-4 w-4 mr-1.5" />
                Trusts
              </TabsTrigger>
              <TabsTrigger value="power-of-attorney" className="data-[state=active]:bg-background">
                <Icon icon="solar:pen-new-square-linear" className="h-4 w-4 mr-1.5" />
                POA
              </TabsTrigger>
              <TabsTrigger value="living-will" className="data-[state=active]:bg-background">
                <Icon icon="solar:heart-pulse-linear" className="h-4 w-4 mr-1.5" />
                Living Will
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const config = categoryConfig[template.category]
              return (
                <Card 
                  key={template.id} 
                  className="border border-border/60 hover:border-border hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleUseTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', config.color)}>
                        <Icon icon={config.icon} className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {template.usageCount} uses
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3 group-hover:text-foreground/80 transition-colors">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon icon="solar:code-bold" className="h-3.5 w-3.5" />
                        <span>{template.variables.length} variables</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateTemplate(template)
                          }}
                        >
                          <Icon icon="solar:copy-linear" className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUseTemplate(template)
                          }}
                        >
                          <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="border border-border/60">
              <CardContent className="py-12 text-center">
                <Icon icon="solar:folder-with-files-bold-duotone" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try a different search term' : 'No templates in this category yet'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Create Template Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Build a custom document template with variables</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Custom Will Template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Brief description of this template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value as Template['category'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-content">Template Content</Label>
                  <textarea
                    id="template-content"
                    value={newTemplate.content}
                    onChange={(e) => {
                      const content = e.target.value
                      // Extract variables from {{VARIABLE_NAME}} format
                      const variables = Array.from(new Set(
                        content.match(/\{\{(\w+)\}\}/g)?.map(m => m.replace(/[{}]/g, '')) || []
                      ))
                      setNewTemplate({ ...newTemplate, content, variables })
                    }}
                    placeholder="Enter template content. Use {{VARIABLE_NAME}} for variables..."
                    className="w-full min-h-[300px] p-3 border border-border/60 rounded-lg bg-background text-foreground font-mono text-sm resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{{VARIABLE_NAME}}'} format for variables. Example: {'{{CLIENT_NAME}}'}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateOpen(false)
                  setNewTemplate({ name: '', description: '', category: 'custom', content: '', variables: [] })
                }}>
                  Cancel
                </Button>
                <Button
                  className="bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => {
                    if (!newTemplate.name || !newTemplate.content) {
                      toast.error('Missing Information', 'Please provide a name and content')
                      return
                    }
                    const template: Template = {
                      id: `template-${Date.now()}`,
                      name: newTemplate.name!,
                      description: newTemplate.description || '',
                      category: newTemplate.category || 'custom',
                      content: newTemplate.content!,
                      variables: newTemplate.variables || [],
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      usageCount: 0,
                    }
                    setTemplates(prev => [...prev, template])
                    toast.success('Template Created', `${template.name} has been created successfully`)
                    setIsCreateOpen(false)
                    setNewTemplate({ name: '', description: '', category: 'custom', content: '', variables: [] })
                  }}
                >
                  <Icon icon="solar:check-circle-bold-duotone" className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Template Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{selectedTemplate?.name}</DialogTitle>
                <DialogDescription>{selectedTemplate?.description}</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto border border-border/60 rounded-lg bg-muted/30 p-6">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedTemplate?.content.replace(/\{\{(\w+)\}\}/g, (_, variable) => 
                    `[${variable.replace(/_/g, ' ')}]`
                  )}
                </pre>
              </div>
              <div className="pt-4 border-t border-border/60">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Variables:</span>
                  {selectedTemplate?.variables.map((v) => (
                    <Badge key={v} variant="outline" className="text-[10px]">
                      {v.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <Icon icon="solar:document-add-bold-duotone" className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
