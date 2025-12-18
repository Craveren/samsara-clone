'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Input, Textarea } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useToast } from '@/lib/hooks'
import { Icon } from '@iconify/react'
import { VideoCallModal } from '@/components/video-call/VideoCallModal'
import { MessageDialog } from '@/components/messaging/MessageDialog'
import { cn } from '@woodpecker/utils'
import Link from 'next/link'
import { useApi } from '@/lib/hooks/use-api'

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  legaciesCount: number
  status: 'active' | 'pending' | 'archived'
  lastContact?: string
  accessLevel: 'view' | 'edit' | 'full'
  completion?: number
  hiredAt?: string
  terminatedAt?: string
  notes?: string
  tags?: string[]
  nextMeeting?: string
  totalRevenue?: number
}

export default function LawyerClientsPage() {
  const { toast } = useToast()
  const { request } = useApi()
  const [clients, setClients] = useLocalStorage<Client[]>('lawyer-clients', [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+27 82 123 4567',
      legaciesCount: 2,
      status: 'active',
      lastContact: '2024-01-15',
      accessLevel: 'full',
      completion: 85,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      legaciesCount: 1,
      status: 'active',
      lastContact: '2024-01-10',
      accessLevel: 'edit',
      completion: 60,
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'r.johnson@example.com',
      phone: '+27 82 987 6543',
      legaciesCount: 1,
      status: 'pending',
      accessLevel: 'view',
      completion: 30,
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'pending' | 'archived'>('all')
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [isVideoCallOpen, setIsVideoCallOpen] = React.useState(false)
  const [isMessageOpen, setIsMessageOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isTerminateOpen, setIsTerminateOpen] = React.useState(false)
  const [isNotesOpen, setIsNotesOpen] = React.useState(false)
  const [clientNotes, setClientNotes] = React.useState('')
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
    pending: clients.filter(c => c.status === 'pending').length,
    avgCompletion: Math.round(clients.reduce((sum, c) => sum + (c.completion || 0), 0) / clients.length),
  }), [clients])

  const handleContact = (client: Client, method: 'email' | 'phone' | 'video' | 'message') => {
    setSelectedClient(client)
    switch (method) {
      case 'email':
        window.location.href = `mailto:${client.email}`
        break
      case 'phone':
        if (client.phone) {
          window.location.href = `tel:${client.phone}`
        } else {
          toast.error('No phone number', 'This client has no phone number on file.')
        }
        break
      case 'video':
        setIsVideoCallOpen(true)
        break
      case 'message':
        setIsMessageOpen(true)
        break
    }
  }

  const handleVideoCallStarted = React.useCallback((platform: string, link: string) => {
    toast.success('Call started', `Opening ${platform} call...`)
  }, [toast])

  const handleSendMessage = React.useCallback(async (content: string) => {
    if (!selectedClient) return
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Sending message to', selectedClient.email, ':', content)
  }, [selectedClient])

  const handleTerminateClient = () => {
    if (!selectedClient) return
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id 
        ? { ...c, status: 'archived' as const, terminatedAt: new Date().toISOString() }
        : c
    ))
    toast.success('Client Terminated', `${selectedClient.name} has been archived`)
    setIsTerminateOpen(false)
    setIsDetailsOpen(false)
  }

  const handleSaveNotes = () => {
    if (!selectedClient) return
    setClients(prev => prev.map(c => 
      c.id === selectedClient.id 
        ? { ...c, notes: clientNotes }
        : c
    ))
    toast.success('Notes Saved', 'Client notes have been updated')
    setIsNotesOpen(false)
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
        const newClient: Client = {
          id: data.data.id,
          name: inviteForm.name || inviteForm.email.split('@')[0],
          email: inviteForm.email,
          legaciesCount: 0,
          status: 'pending',
          accessLevel: inviteForm.accessLevel,
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

  // Check URL params for invite dialog
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('invite') === 'true') {
      setIsInviteOpen(true)
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

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
                    My Clients
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your client relationships, track progress, and collaborate on estate planning
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
                        <CardTitle className="text-base font-semibold group-hover:text-foreground/80 transition-colors">
                          {client.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          {client.legaciesCount} {client.legaciesCount === 1 ? 'Legacy' : 'Legacies'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={client.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        'text-[10px] capitalize',
                        client.status === 'active' && 'bg-foreground/5 text-foreground border-border/60',
                        client.status === 'pending' && 'bg-foreground/5 text-foreground border-border/60'
                      )}
                    >
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
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
                    {client.lastContact && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Last: {new Date(client.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {client.nextMeeting && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="h-4 w-4 text-foreground" />
                        <span className="text-foreground font-medium">
                          Next: {new Date(client.nextMeeting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-border/40">
                    <Link href={`/lawyer/clients/${client.id}/legacy`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" className="w-full border-border/60 hover:bg-muted/50">
                        <Icon icon="solar:document-text-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                        Legacy
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border/60 hover:bg-muted/50"
                      onClick={(e) => { e.stopPropagation(); handleContact(client, 'video'); }}
                    >
                      <Icon icon="solar:videocamera-bold-duotone" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border/60 hover:bg-muted/50"
                      onClick={(e) => { e.stopPropagation(); handleContact(client, 'message'); }}
                    >
                      <Icon icon="solar:chat-round-dots-bold-duotone" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border/60 hover:bg-muted/50"
                      onClick={(e) => { e.stopPropagation(); handleContact(client, 'email'); }}
                    >
                      <Icon icon="solar:letter-bold-duotone" className="h-4 w-4" />
                    </Button>
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
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Clients will appear here when they invite you to collaborate on their estate planning.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Video Call Modal */}
      {selectedClient && (
        <VideoCallModal
          open={isVideoCallOpen}
          onOpenChange={setIsVideoCallOpen}
          initialDetails={{
            title: `Call with ${selectedClient.name}`,
            description: `Video consultation`,
            participants: [
              { email: selectedClient.email, name: selectedClient.name },
            ],
          }}
          participantPhone={selectedClient.phone}
          onCallStarted={handleVideoCallStarted}
        />
      )}

      {/* Message Dialog */}
      {selectedClient && (
        <MessageDialog
          open={isMessageOpen}
          onOpenChange={setIsMessageOpen}
          recipient={{
            id: selectedClient.id,
            name: selectedClient.name,
            email: selectedClient.email,
          }}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Client Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedClient && (
            <>
              <DialogHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-border/60">
                    <AvatarFallback className="bg-foreground/5 text-foreground font-semibold text-xl">
                      {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-xl">{selectedClient.name}</DialogTitle>
                    <DialogDescription className="mt-1">
                      {selectedClient.legaciesCount} {selectedClient.legaciesCount === 1 ? 'Legacy' : 'Legacies'}
                    </DialogDescription>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant={selectedClient.status === 'active' ? 'default' : 'secondary'}
                        className={cn(
                          'text-xs',
                          selectedClient.status === 'active' && 'bg-foreground/5 text-foreground border-border/60'
                        )}
                      >
                        {selectedClient.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize border-border/60">
                        {selectedClient.accessLevel} Access
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              <div className="space-y-4 py-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-foreground">{selectedClient.email}</span>
                    </div>
                    {selectedClient.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <Icon icon="solar:phone-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{selectedClient.phone}</span>
                      </div>
                    )}
                    {selectedClient.lastContact && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">
                          Last contacted: {new Date(selectedClient.lastContact).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Progress */}
                {selectedClient.completion !== undefined && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Estate Planning Progress</span>
                      <span className="text-lg font-bold text-foreground">{selectedClient.completion}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-foreground transition-all" 
                        style={{ width: `${selectedClient.completion}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Link href={`/lawyer/clients/${selectedClient.id}/legacy`} className="flex-1">
                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                    <Icon icon="solar:document-text-bold-duotone" className="h-4 w-4 mr-2" />
                    View Legacy
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 border-border/60"
                  onClick={() => { setIsDetailsOpen(false); handleContact(selectedClient, 'message'); }}
                >
                  <Icon icon="solar:chat-round-dots-bold-duotone" className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border/60"
                  onClick={() => { setIsDetailsOpen(false); handleContact(selectedClient, 'video'); }}
                >
                  <Icon icon="solar:videocamera-bold-duotone" className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border/60"
                  onClick={() => {
                    setClientNotes(selectedClient.notes || '')
                    setIsNotesOpen(true)
                  }}
                >
                  <Icon icon="solar:notes-bold-duotone" className="h-4 w-4" />
                </Button>
                {selectedClient.status === 'active' && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-border/60 text-destructive hover:text-destructive"
                    onClick={() => {
                      setIsTerminateOpen(true)
                    }}
                  >
                    <Icon icon="solar:close-circle-bold-duotone" className="h-4 w-4" />
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
              Are you sure you want to terminate the relationship with {selectedClient?.name}? This will archive the client but preserve all data.
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

      {/* Client Notes Dialog */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Notes</DialogTitle>
            <DialogDescription>
              Add private notes about {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Add notes about this client..."
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
