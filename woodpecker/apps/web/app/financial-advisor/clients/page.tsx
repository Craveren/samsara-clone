'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { formatDate } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'
import { useApi } from '@/lib/hooks/use-api'

interface FinancialClient {
  id: string
  name: string
  email: string
  phone?: string
  portfolioValue: number
  status: 'active' | 'pending' | 'inactive' | 'terminated'
  lastContact?: string
  plansCount: number
  revenue: number
  joinedAt: string
  riskProfile?: 'conservative' | 'moderate' | 'aggressive'
  hiredAt?: string
  terminatedAt?: string
  notes?: string
  nextReview?: string
  performance?: number
}

export default function FinancialAdvisorClientsPage() {
  const { request } = useApi()
  const [clients, setClients] = useLocalStorage<FinancialClient[]>('financial-advisor-clients', [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+27 82 123 4567',
      portfolioValue: 2500000,
      status: 'active',
      lastContact: '2024-01-15',
      plansCount: 3,
      revenue: 2500,
      joinedAt: '2023-06-01',
      riskProfile: 'moderate',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      portfolioValue: 1800000,
      status: 'active',
      lastContact: '2024-01-10',
      plansCount: 2,
      revenue: 1500,
      joinedAt: '2023-08-15',
      riskProfile: 'conservative',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      portfolioValue: 4500000,
      status: 'active',
      lastContact: '2024-01-18',
      plansCount: 5,
      revenue: 4500,
      joinedAt: '2023-04-10',
      riskProfile: 'aggressive',
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'pending' | 'inactive' | 'terminated'>('all')
  const [isAddClientOpen, setIsAddClientOpen] = React.useState(false)
  const [selectedClient, setSelectedClient] = React.useState<FinancialClient | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isTerminateOpen, setIsTerminateOpen] = React.useState(false)
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [inviteForm, setInviteForm] = React.useState({
    email: '',
    name: '',
    accessLevel: 'view' as 'view' | 'edit' | 'full',
  })
  const [isInviting, setIsInviting] = React.useState(false)
  const { toast } = useToast()

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleTerminateClient = () => {
    if (!selectedClient) return
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id 
        ? { ...c, status: 'terminated' as const, terminatedAt: new Date().toISOString() }
        : c
    ))
    toast.success('Client Terminated', `${selectedClient.name} has been terminated`)
    setIsTerminateOpen(false)
    setIsDetailsOpen(false)
  }

  const handleAddClient = (formData: { name: string; email: string; phone?: string }) => {
    const newClient: FinancialClient = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      portfolioValue: 0,
      status: 'pending',
      plansCount: 0,
      revenue: 0,
      joinedAt: new Date().toISOString(),
      hiredAt: new Date().toISOString(),
    }
    setClients(prev => [...prev, newClient])
    toast.success('Client Added', `${formData.name} has been added to your portfolio`)
    setIsAddClientOpen(false)
  }

  const handleInviteClient = async () => {
    if (!inviteForm.email) {
      toast.error('Email Required', 'Please enter an email address')
      return
    }

    setIsInviting(true)
    try {
      const response = await request('/api/invitations', {
        method: 'POST',
        body: JSON.stringify({
          email: inviteForm.email,
          role: 'client',
          accessLevel: inviteForm.accessLevel,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add client to local storage with pending status
        const newClient: FinancialClient = {
          id: data.data.id,
          name: inviteForm.name || inviteForm.email.split('@')[0],
          email: inviteForm.email,
          portfolioValue: 0,
          status: 'pending',
          plansCount: 0,
          revenue: 0,
          joinedAt: new Date().toISOString(),
          hiredAt: new Date().toISOString(),
        }
        
        setClients(prev => [...prev, newClient])
        toast.success('Invitation Sent', `Invitation sent to ${inviteForm.email}`)
        setInviteForm({ email: '', name: '', accessLevel: 'view' })
        setIsInviteOpen(false)
      } else {
        const error = await response.json()
        toast.error('Failed to Send', error.error || 'Could not send invitation')
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  // Fetch invitations to sync client statuses
  React.useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await request('/api/invitations')
        if (response.ok) {
          const data = await response.json()
          const invitations = data.data || []
          
          // Update clients based on invitation status
          setClients(prev => prev.map(client => {
            const invitation = invitations.find((inv: any) => 
              inv.email === client.email && inv.role === 'client'
            )
            if (invitation && invitation.status === 'accepted') {
              return {
                ...client,
                status: 'active' as const,
              }
            }
            return client
          }))
        }
      } catch (error) {
        console.error('Error fetching invitations:', error)
      }
    }

    fetchInvitations()
    const interval = setInterval(fetchInvitations, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [request, setClients])

  const stats = React.useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalPortfolio: clients.reduce((sum, c) => sum + c.portfolioValue, 0),
    monthlyRevenue: clients.reduce((sum, c) => sum + c.revenue, 0),
  }), [clients])

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
                  Client Portfolio Management
                </h1>
                <p className="text-muted-foreground">
                  Manage your financial planning clients and their investment portfolios
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteOpen(true)}
                  className="border-border/60"
                >
                  <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
                  Invite Client
                </Button>
                <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-foreground text-background hover:bg-foreground/90">
                      <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>
                        Add a new client to your financial planning portfolio
                      </DialogDescription>
                    </DialogHeader>
                    <AddClientForm onSubmit={handleAddClient} onCancel={() => setIsAddClientOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Clients</p>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Active Clients</p>
                      <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:check-circle-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Portfolio Value</p>
                      <p className="text-2xl font-bold text-foreground">
                        R{(stats.totalPortfolio / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-foreground">
                        R{stats.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:chart-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon icon="solar:magnifer-bold" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/60"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'pending', 'inactive', 'terminated'] as const).map((status) => (
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
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <motion.div
                key={client.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="border border-border/60 hover:border-border hover:shadow-lg transition-all h-full cursor-pointer"
                  onClick={() => {
                    setSelectedClient(client)
                    setIsDetailsOpen(true)
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-border/60">
                          <AvatarFallback className="bg-foreground/5 text-foreground font-semibold">
                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {client.plansCount} {client.plansCount === 1 ? 'Plan' : 'Plans'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={client.status === 'active' ? 'default' : client.status === 'terminated' ? 'destructive' : 'secondary'}
                        className={cn(
                          'text-[10px] capitalize',
                          client.status === 'active' && 'bg-foreground/5 text-foreground border-border/60'
                        )}
                      >
                        {client.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon icon="solar:phone-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{client.phone}</span>
                        </div>
                      )}
                      {client.nextReview && (
                        <div className="flex items-center gap-2 text-sm">
                          <Icon icon="solar:calendar-mark-bold-duotone" className="h-4 w-4 text-foreground" />
                          <span className="text-foreground font-medium">
                            Review: {new Date(client.nextReview).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Portfolio Value</span>
                        <span className="font-bold text-foreground">
                          R{client.portfolioValue.toLocaleString('en-ZA')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Fee</span>
                        <span className="font-semibold text-foreground">
                          R{client.revenue.toLocaleString('en-ZA')}
                        </span>
                      </div>
                      {client.riskProfile && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Risk Profile</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {client.riskProfile}
                          </Badge>
                        </div>
                      )}
                      {client.performance !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Performance</span>
                          <span className={cn(
                            "font-semibold",
                            client.performance > 0 ? "text-foreground" : "text-foreground"
                          )}>
                            {client.performance > 0 ? '+' : ''}{client.performance}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/financial-advisor/clients/${client.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-border/60 hover:bg-muted/50">
                          <Icon icon="solar:document-text-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-border/60 hover:bg-muted/50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedClient(client)
                          // Open message dialog
                        }}
                      >
                        <Icon icon="solar:chat-round-dots-bold-duotone" className="h-4 w-4" />
                      </Button>
                      {client.status === 'active' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-border/60 hover:bg-muted/50 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedClient(client)
                            setIsTerminateOpen(true)
                          }}
                        >
                          <Icon icon="solar:close-circle-bold-duotone" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <Card className="border border-border/60">
              <CardContent className="py-16 text-center">
                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || filterStatus !== 'all' ? 'No clients found' : 'No clients yet'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Clients will appear here when they sign up for your financial planning services.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Client Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedClient.name}</DialogTitle>
                <DialogDescription>
                  Financial planning client details and portfolio information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Portfolio Value</Label>
                    <p className="text-lg font-bold text-foreground">
                      R{selectedClient.portfolioValue.toLocaleString('en-ZA')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Monthly Revenue</Label>
                    <p className="text-lg font-bold text-foreground">
                      R{selectedClient.revenue.toLocaleString('en-ZA')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge variant={selectedClient.status === 'active' ? 'default' : 'outline'}>
                      {selectedClient.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Risk Profile</Label>
                    <Badge variant="outline" className="capitalize">
                      {selectedClient.riskProfile || 'Not Set'}
                    </Badge>
                  </div>
                </div>
                {selectedClient.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">Notes</Label>
                    <p className="text-sm text-foreground">{selectedClient.notes}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedClient.status === 'active' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsOpen(false)
                      setIsTerminateOpen(true)
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon icon="solar:close-circle-bold-duotone" className="h-4 w-4 mr-2" />
                    Terminate
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Terminate Client Dialog */}
      <Dialog open={isTerminateOpen} onOpenChange={setIsTerminateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminate Client Relationship</DialogTitle>
            <DialogDescription>
              Are you sure you want to terminate the relationship with {selectedClient?.name}? This will preserve all data but mark the client as terminated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTerminateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleTerminateClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Terminate Relationship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Client Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Client</DialogTitle>
            <DialogDescription>
              Send an invitation to a client to join your financial planning services. They will receive an email with instructions to create their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="invite-client-email">Email Address *</Label>
              <Input
                id="invite-client-email"
                type="email"
                placeholder="client@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invite-client-name">Client Name (Optional)</Label>
              <Input
                id="invite-client-name"
                placeholder="John Doe"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="invite-access-level">Access Level</Label>
              <select
                id="invite-access-level"
                value={inviteForm.accessLevel}
                onChange={(e) => setInviteForm({ ...inviteForm, accessLevel: e.target.value as 'view' | 'edit' | 'full' })}
                className="mt-1 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
              >
                <option value="view">View Only</option>
                <option value="edit">Edit</option>
                <option value="full">Full Access</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInviteClient}
              disabled={isInviting || !inviteForm.email}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {isInviting ? (
                <>
                  <Icon icon="solar:refresh-bold" className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddClientForm({ onSubmit, onCancel }: { onSubmit: (data: { name: string; email: string; phone?: string }) => void; onCancel: () => void }) {
  const [formData, setFormData] = React.useState({ name: '', email: '', phone: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      onSubmit(formData)
      setFormData({ name: '', email: '', phone: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="client-name">Client Name *</Label>
        <Input
          id="client-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter client name"
          required
        />
      </div>
      <div>
        <Label htmlFor="client-email">Email *</Label>
        <Input
          id="client-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="client@example.com"
          required
        />
      </div>
      <div>
        <Label htmlFor="client-phone">Phone</Label>
        <Input
          id="client-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+27 12 345 6789"
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
          Add Client
        </Button>
      </DialogFooter>
    </form>
  )
}

