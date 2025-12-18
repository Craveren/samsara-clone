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

    // Initial fetch
    fetchInvitations()

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchInvitations, 5000)

    return () => clearInterval(interval)
  }, [user, toast])

  const handleSendInvitation = async () => {
    if (!formData.email) {
      toast('Email Required', 'Please enter an email address', 'destructive')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid Email', 'Please enter a valid email address')
      return
    }

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          accessLevel: formData.accessLevel,
          legacyId: formData.legacyId || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Failed to Send', data.error || 'Could not send invitation')
        return
      }

      toast.success('Invitation Sent', `Invitation sent to ${formData.email}`)
      setFormData({ email: '', role: 'lawyer', accessLevel: 'view', legacyId: '' })
      setIsDialogOpen(false)
      
      // Add new invitation to list immediately for instant feedback
      const newInvitation: Invitation = {
        id: data.data.id,
        email: formData.email,
        role: formData.role,
        accessLevel: formData.accessLevel,
        status: 'pending',
        sentAt: new Date().toISOString(),
        expiresAt: data.data.expiresAt,
        legacyId: formData.legacyId || undefined,
        token: data.data.token,
      }
      setInvitations(prev => [newInvitation, ...prev])
    } catch (error: any) {
      console.error('Invitation error:', error)
      const errorMessage = error?.message || error?.toString() || 'Failed to send invitation'
      toast.error('Error', errorMessage)
    }
  }

  const handleCancelInvitation = async (id: string) => {
    try {
      const response = await fetch(`/api/invitations/${id}`, { 
        method: 'DELETE' 
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel invitation')
      }
      
      toast.success('Invitation Cancelled', 'The invitation has been cancelled')
      setInvitations(prev => prev.map(inv => 
        inv.id === id ? { ...inv, status: 'rejected' as const } : inv
      ))
    } catch (error: any) {
      console.error('Cancel invitation error:', error)
      const errorMessage = error?.message || error?.toString() || 'Failed to cancel invitation'
      toast.error('Error', errorMessage)
    }
  }

  const handleResendInvitation = async (invitation: Invitation) => {
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const data = await response.json()
        // Update invitation in state with new token
        setInvitations(prev => prev.map(inv => 
          inv.id === invitation.id ? { ...inv, ...data.data } : inv
        ))
        toast.success('Invitation Resent', `Invitation resent to ${invitation.email}`)
      } else {
        const data = await response.json()
        toast.error('Failed to Resend', data.error || 'Could not resend invitation')
      }
    } catch (error) {
      toast.error('Error', 'Failed to resend invitation')
    }
  }

  const copyInvitationLink = async (invitation: Invitation) => {
    if (invitation.token) {
      const link = `${window.location.origin}/invitations/accept/${invitation.token}`
      try {
        await navigator.clipboard.writeText(link)
        toast.success('Link Copied', 'Invitation link copied to clipboard')
      } catch {
        toast.error('Copy Failed', 'Could not copy to clipboard')
      }
    }
  }

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  const acceptedInvitations = invitations.filter(inv => inv.status === 'accepted')
  const allInvitations = invitations

  const accessLevelConfig = React.useMemo(() => ({
    view: { icon: Eye, label: 'View Only', description: 'Can view documents and information' },
    edit: { icon: Edit, label: 'Edit', description: 'Can view and edit documents' },
    full: { icon: Lock, label: 'Full Access', description: 'Complete access to legacy management' },
  }), [])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-10 w-10 border-3 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading invitations...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1.5">
                Invitations
              </h1>
              <p className="text-sm text-muted-foreground">
                Invite lawyers or executors to access your legacy
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Send Invitation</DialogTitle>
                  <DialogDescription>
                    Invite a lawyer to manage your estate or an executor to handle post-death processes.
                    They can use the same email address if they already have an account, or create a new account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="lawyer@example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      They can use the same email if they already have a different account type
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: 'lawyer' | 'executor') =>
                          setFormData({ ...formData, role: value })
                        }
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

                    <div className="space-y-2">
                      <Label htmlFor="accessLevel">Access Level</Label>
                      <Select
                        value={formData.accessLevel}
                        onValueChange={(value: 'view' | 'edit' | 'full') =>
                          setFormData({ ...formData, accessLevel: value })
                        }
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

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span>Access levels: View (read-only), Edit (modify), Full (complete access)</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendInvitation} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Invitations Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({allInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingInvitations.length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({acceptedInvitations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allInvitations.length === 0 ? (
                <Card className="border border-border">
                  <CardContent className="py-12 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Invitations
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven't sent any invitations yet
                    </p>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Send Your First Invitation
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {allInvitations.map((invitation, index) => {
                    const AccessIcon = accessLevelConfig[invitation.accessLevel].icon
                    const accessInfo = accessLevelConfig[invitation.accessLevel]

                    return (
                      <motion.div
                        key={invitation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border border-border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                                {invitation.role === 'lawyer' ? (
                                  <Shield className="h-6 w-6 text-foreground" />
                                ) : (
                                  <User className="h-6 w-6 text-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {invitation.email}
                                  </p>
                                  <Badge variant="outline" className="text-[10px] capitalize">
                                    {invitation.role}
                                  </Badge>
                                  {invitation.status === 'pending' && (
                                    <Badge variant="secondary" className="text-[10px] bg-foreground/5 text-foreground border-border/60">
                                      <Icon icon="solar:clock-circle-bold-duotone" className="h-2.5 w-2.5 mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                  {invitation.status === 'accepted' && (
                                    <Badge variant="default" className="text-[10px] bg-foreground/10 text-foreground border-border/60">
                                      <Icon icon="solar:check-circle-bold-duotone" className="h-2.5 w-2.5 mr-1" />
                                      Accepted
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <AccessIcon className="h-3 w-3" />
                                    <span>{accessInfo.label}</span>
                                  </div>
                                  <Separator orientation="vertical" className="h-3" />
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Sent {formatDate(invitation.sentAt, 'MMM d, yyyy')}</span>
                                  </div>
                                  {invitation.legacyName && (
                                    <>
                                      <Separator orientation="vertical" className="h-3" />
                                      <span>{invitation.legacyName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {invitation.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => copyInvitationLink(invitation)}
                                    title="Copy invitation link"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to cancel this invitation to {invitation.email}? 
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleCancelInvitation(invitation.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Cancel Invitation
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                              {invitation.status === 'accepted' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  title="View profile"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingInvitations.length === 0 ? (
                <Card className="border border-border">
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No pending invitations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingInvitations.map((invitation) => {
                    const AccessIcon = accessLevelConfig[invitation.accessLevel].icon
                    return (
                      <Card key={invitation.id} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                                {invitation.role === 'lawyer' ? (
                                  <Shield className="h-6 w-6 text-foreground" />
                                ) : (
                                  <User className="h-6 w-6 text-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{invitation.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <AccessIcon className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {accessLevelConfig[invitation.accessLevel].label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResendInvitation(invitation)}
                              >
                                <Send className="h-3.5 w-3.5 mr-1.5" />
                                Resend
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cancel this invitation to {invitation.email}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Keep</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleCancelInvitation(invitation.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Cancel Invitation
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {acceptedInvitations.length === 0 ? (
                <Card className="border border-border">
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No accepted invitations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {acceptedInvitations.map((invitation) => {
                    const AccessIcon = accessLevelConfig[invitation.accessLevel].icon
                    return (
                      <Card key={invitation.id} className="border border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                                {invitation.role === 'lawyer' ? (
                                  <Shield className="h-6 w-6 text-foreground" />
                                ) : (
                                  <User className="h-6 w-6 text-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{invitation.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <AccessIcon className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {accessLevelConfig[invitation.accessLevel].label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="default">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
