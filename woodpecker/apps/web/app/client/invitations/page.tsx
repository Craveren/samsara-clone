'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { 
  Mail, 
  UserPlus, 
  Shield, 
  CheckCircle2,
  Clock,
  X,
  Send,
  Copy,
  ExternalLink,
  Eye,
  Edit,
  Lock,
  Calendar,
  User,
  AlertCircle,
  Info
} from 'lucide-react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { useToast } from '@/lib/hooks'
import { formatDate } from '@woodpecker/utils'
import { cn } from '@woodpecker/utils'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

interface Invitation {
  id: string
  email: string
  role: 'lawyer' | 'executor'
  accessLevel: 'view' | 'edit' | 'full'
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  sentAt: string
  expiresAt?: string
  legacyId?: string
  legacyName?: string
  token?: string
}

export default function InvitationsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [invitations, setInvitations] = React.useState<Invitation[]>([])
  const [loading, setLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({
    email: '',
    role: 'lawyer' as 'lawyer' | 'executor',
    accessLevel: 'view' as 'view' | 'edit' | 'full',
    legacyId: '',
  })

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Real-time polling for invitations
  React.useEffect(() => {
    if (!user) return

    const fetchInvitations = async () => {
      try {
        const response = await fetch('/api/invitations', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        if (response.ok) {
          const data = await response.json()
          const newInvitations = data.data || []
          
          // Check for status changes and show notifications
          setInvitations(prev => {
            const prevMap = new Map(prev.map(inv => [inv.id, inv]))
            const newMap = new Map(newInvitations.map((inv: Invitation) => [inv.id, inv]))
            
            // Find newly accepted invitations
            newInvitations.forEach((newInv: Invitation) => {
              const oldInv = prevMap.get(newInv.id)
              if (oldInv && oldInv.status === 'pending' && newInv.status === 'accepted') {
                toast.success('Invitation Accepted', `${newInv.email} has accepted your invitation!`)
              }
            })
            
            return newInvitations
          })
        }
      } catch (error) {
        console.error('Error fetching invitations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvitations()
    const interval = setInterval(fetchInvitations, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [user, toast])

  const handleSendInvitation = async () => {
    if (!formData.email) {
      toast.error('Email Required', 'Please enter an email address')
      return
    }

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          accessLevel: formData.accessLevel,
          legacyId: formData.legacyId || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Invitation Sent', `Invitation sent to ${formData.email}`)
        setFormData({ email: '', role: 'lawyer', accessLevel: 'view', legacyId: '' })
        setIsDialogOpen(false)
        // Refresh invitations list
        const refreshResponse = await fetch('/api/invitations', { cache: 'no-store' })
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          setInvitations(refreshData.data || [])
        }
      } else {
        const error = await response.json()
        toast.error('Failed to Send', error.message || 'Could not send invitation')
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Failed to send invitation')
    }
  }

  const handleResendInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/resend`, {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Invitation Resent', 'The invitation has been resent successfully')
      } else {
        const error = await response.json()
        toast.error('Failed to Resend', error.message || 'Could not resend invitation')
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Failed to resend invitation')
    }
  }

  const handleRevokeInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Invitation Revoked', 'The invitation has been revoked')
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      } else {
        const error = await response.json()
        toast.error('Failed to Revoke', error.message || 'Could not revoke invitation')
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Failed to revoke invitation')
    }
  }

  const copyInvitationLink = (token: string) => {
    const link = `${window.location.origin}/invitations/accept/${token}`
    navigator.clipboard.writeText(link)
    toast.success('Link Copied', 'Invitation link copied to clipboard')
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted')
  const otherInvitations = invitations.filter(inv => inv.status !== 'pending' && inv.status !== 'accepted')

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                  Invitations
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage invitations to collaborate on your estate planning
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Send Invitation</DialogTitle>
                    <DialogDescription>
                      Invite a lawyer or executor to collaborate on your estate planning
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="lawyer@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: 'lawyer' | 'executor') => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lawyer">Lawyer</SelectItem>
                          <SelectItem value="executor">Executor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="accessLevel">Access Level</Label>
                      <Select
                        value={formData.accessLevel}
                        onValueChange={(value: 'view' | 'edit' | 'full') => setFormData({ ...formData, accessLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="edit">Edit</SelectItem>
                          <SelectItem value="full">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendInvitation}>
                      <Icon icon="solar:send-bold-duotone" className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Invitations List */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({acceptedInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="other">
                Other ({otherInvitations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon="solar:refresh-bold" className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pendingInvitations.length === 0 ? (
                <Card className="border border-border/60">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Icon icon="solar:letter-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No pending invitations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <Card key={invitation.id} className="border border-border/60 hover:border-border/80 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border/40">
                                <Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{invitation.email}</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {invitation.role} • {invitation.accessLevel} access
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
                                <span>Sent {formatDate(new Date(invitation.sentAt), 'MMM d, yyyy')}</span>
                              </div>
                              {invitation.expiresAt && (
                                <div className="flex items-center gap-1.5">
                                  <Icon icon="solar:clock-circle-bold-duotone" className="h-4 w-4" />
                                  <span>Expires {formatDate(new Date(invitation.expiresAt), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {invitation.token && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyInvitationLink(invitation.token!)}
                              >
                                <Icon icon="solar:copy-bold-duotone" className="h-4 w-4 mr-2" />
                                Copy Link
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendInvitation(invitation.id)}
                            >
                              <Icon icon="solar:refresh-bold-duotone" className="h-4 w-4 mr-2" />
                              Resend
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeInvitation(invitation.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon="solar:refresh-bold" className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : acceptedInvitations.length === 0 ? (
                <Card className="border border-border/60">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Icon icon="solar:check-circle-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No accepted invitations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {acceptedInvitations.map((invitation) => (
                    <Card key={invitation.id} className="border border-border/60 bg-foreground/5">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center border border-border/40">
                                <Icon icon="solar:check-circle-bold-duotone" className="h-5 w-5 text-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{invitation.email}</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {invitation.role} • {invitation.accessLevel} access
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
                                <span>Accepted {formatDate(new Date(invitation.sentAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-foreground/10 text-foreground border border-border/40">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon="solar:refresh-bold" className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : otherInvitations.length === 0 ? (
                <Card className="border border-border/60">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Icon icon="solar:archive-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">No other invitations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {otherInvitations.map((invitation) => (
                    <Card key={invitation.id} className="border border-border/60 opacity-60">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center border border-border/40">
                                <Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{invitation.email}</h3>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {invitation.role} • {invitation.status}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {invitation.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}









