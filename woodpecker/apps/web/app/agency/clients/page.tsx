'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useToast } from '@/lib/hooks'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { useApi } from '@/lib/hooks/use-api'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  status: 'active' | 'pending' | 'archived'
  lastContact?: string
  accessLevel: 'view' | 'edit' | 'full'
  completion?: number
  hiredAt?: string
  invitedAt?: string
  invitationStatus?: 'pending' | 'accepted' | 'expired'
}

export default function AgencyClientsPage() {
  const { toast } = useToast()
  const { request } = useApi()
  const [clients, setClients] = useLocalStorage<Client[]>('agency-clients', [])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'pending' | 'archived'>('all')
  const [isInviteOpen, setIsInviteOpen] = React.useState(false)
  const [inviteForm, setInviteForm] = React.useState({
    email: '',
    name: '',
    accessLevel: 'view' as 'view' | 'edit' | 'full',
  })
  const [isInviting, setIsInviting] = React.useState(false)

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = React.useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending' || c.invitationStatus === 'pending').length,
    avgCompletion: Math.round(clients.reduce((sum, c) => sum + (c.completion || 0), 0) / (clients.length || 1)),
  }), [clients])

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
        const newClient: Client = {
          id: data.data.id,
          name: inviteForm.name || inviteForm.email.split('@')[0],
          email: inviteForm.email,
          status: 'pending',
          accessLevel: inviteForm.accessLevel,
          invitedAt: new Date().toISOString(),
          invitationStatus: 'pending',
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
            if (invitation) {
              return {
                ...client,
                invitationStatus: invitation.status,
                status: invitation.status === 'accepted' ? 'active' : client.status,
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

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-5 w-5 text-foreground" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    Agency Clients
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your client accounts and invite new clients to join your agency
                </p>
              </div>
              <Button
                onClick={() => setIsInviteOpen(true)}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                Invite Client
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Total Clients</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:check-circle-bold-duotone" className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:clock-circle-bold-duotone" className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{stats.avgCompletion}%</p>
                      <p className="text-xs text-muted-foreground">Avg Completion</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center">
                      <Icon icon="solar:chart-bold-duotone" className="h-5 w-5 text-foreground" />
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
              {(['all', 'active', 'pending', 'archived'] as const).map((status) => (
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
              <Card 
                key={client.id} 
                className="border border-border/60 hover:border-border hover:shadow-md transition-all cursor-pointer group"
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
                        <CardTitle className="text-base font-semibold group-hover:text-foreground/80 transition-colors">
                          {client.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          {client.email}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={client.status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          'text-[10px] capitalize',
                          client.status === 'active' && 'bg-foreground/5 text-foreground border-border/60'
                        )}
                      >
                        {client.status}
                      </Badge>
                      {client.invitationStatus === 'pending' && (
                        <Badge variant="outline" className="text-[10px] border-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                          Invited
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="solar:phone-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.phone}</span>
                      </div>
                    )}
                    {client.lastContact && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Last: {new Date(client.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {client.invitedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Invited: {new Date(client.invitedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Completion Progress */}
                  {client.completion !== undefined && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Completion</span>
                        <span className="font-medium text-foreground">{client.completion}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-foreground transition-all" 
                          style={{ width: `${client.completion}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Access Level */}
                  <div className="pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Access Level</span>
                      <Badge variant="outline" className="text-xs capitalize border-border/60">
                        {client.accessLevel}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <Card className="border border-border/60">
              <CardContent className="py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || filterStatus !== 'all' ? 'No clients found' : 'No clients yet'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Invite clients to join your agency and manage their estate planning accounts.'}
                </p>
                {(!searchQuery && filterStatus === 'all') && (
                  <Button
                    onClick={() => setIsInviteOpen(true)}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                    Invite Your First Client
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Invite Client Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Client</DialogTitle>
            <DialogDescription>
              Send an invitation to a client to join your agency. They will receive an email with instructions to create their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="client-email">Email Address *</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="client-name">Client Name (Optional)</Label>
              <Input
                id="client-name"
                placeholder="John Doe"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="access-level">Access Level</Label>
              <select
                id="access-level"
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








