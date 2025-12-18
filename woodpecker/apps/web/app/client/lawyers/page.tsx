'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Icon } from '@iconify/react'
import { Input } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useToast } from '@/lib/hooks'
import { VideoCallModal } from '@/components/video-call/VideoCallModal'
import { MessageDialog } from '@/components/messaging/MessageDialog'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'

interface Lawyer {
  id: string
  name: string
  email: string
  phone?: string
  firm?: string
  specialization: string[]
  status: 'connected' | 'pending' | 'available'
  invitationId?: string
  accessLevel?: 'view' | 'edit' | 'full'
  avatar?: string
  yearsExperience?: number
  rating?: number
}

export default function ClientLawyersPage() {
  const { toast } = useToast()
  const [lawyers, setLawyers] = useLocalStorage<Lawyer[]>('client-lawyers', [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@lawfirm.com',
      phone: '+27 11 123 4567',
      firm: 'Johnson & Associates',
      specialization: ['Estate Planning', 'Trust Law'],
      status: 'connected',
      accessLevel: 'full',
      yearsExperience: 15,
      rating: 4.9,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'm.chen@estatelaw.co.za',
      firm: 'Estate Law Partners',
      specialization: ['Probate', 'Will Execution'],
      status: 'pending',
      yearsExperience: 8,
    },
  ])

  const [searchQuery, setSearchQuery] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'connected' | 'pending' | 'available'>('all')

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.firm?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || lawyer.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false)
  const [inviteFormData, setInviteFormData] = React.useState({
    email: '',
    name: '',
    firm: '',
    message: '',
    accessLevel: 'view' as 'view' | 'edit' | 'full',
  })

  const handleInviteLawyer = () => {
    setIsInviteDialogOpen(true)
  }

  const handleSendInvitation = async () => {
    if (!inviteFormData.email) {
      toast.error('Email Required', 'Please enter an email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteFormData.email)) {
      toast.error('Invalid Email', 'Please enter a valid email address')
      return
    }

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteFormData.email,
          role: 'lawyer',
          accessLevel: inviteFormData.accessLevel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Failed to Send', data.error || 'Could not send invitation')
        return
      }

      toast.success('Invitation Sent', `Invitation sent to ${inviteFormData.email}`)
      
      // Add to lawyers list as pending
      const newLawyer: Lawyer = {
        id: data.data?.id || `lawyer-${Date.now()}`,
        name: inviteFormData.name || inviteFormData.email.split('@')[0],
        email: inviteFormData.email,
        firm: inviteFormData.firm || undefined,
        specialization: [],
        status: 'pending',
        accessLevel: inviteFormData.accessLevel,
      }
      setLawyers(prev => [...prev, newLawyer])
      
      setInviteFormData({ email: '', name: '', firm: '', message: '', accessLevel: 'view' })
      setIsInviteDialogOpen(false)
    } catch (error) {
      toast.error('Error', 'Failed to send invitation')
      console.error(error)
    }
  }

  const [isVideoCallOpen, setIsVideoCallOpen] = React.useState(false)
  const [isMessageOpen, setIsMessageOpen] = React.useState(false)
  const [selectedLawyer, setSelectedLawyer] = React.useState<Lawyer | null>(null)
  const [selectedLawyerDetails, setSelectedLawyerDetails] = React.useState<Lawyer | null>(null)

  const handleContact = (lawyer: Lawyer, method: 'email' | 'phone' | 'video' | 'message') => {
    setSelectedLawyer(lawyer)
    
    switch (method) {
      case 'email':
        window.location.href = `mailto:${lawyer.email}`
        break
      case 'phone':
        if (lawyer.phone) {
          window.location.href = `tel:${lawyer.phone}`
        } else {
          toast.error('Phone number not available')
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
    if (!selectedLawyer) return
    
    // In production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Sending message to', selectedLawyer.email, ':', content)
  }, [selectedLawyer])

  const stats = React.useMemo(() => ({
    total: lawyers.length,
    connected: lawyers.filter(l => l.status === 'connected').length,
    pending: lawyers.filter(l => l.status === 'pending').length,
  }), [lawyers])

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
                    <Icon icon="mdi:account-tie-outline" className="h-5 w-5 text-foreground" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    My Legal Team
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manage your legal advisors and collaborate on your estate planning
                </p>
              </div>
              <Button onClick={handleInviteLawyer} className="bg-foreground text-background hover:bg-foreground/90">
                <Icon icon="mdi:account-plus-outline" className="h-4 w-4 mr-2" />
                Invite Lawyer
              </Button>
            </div>

            {/* Stats - Enhanced Design */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 flex items-center justify-center">
                      <Icon icon="mdi:briefcase-outline" className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Lawyers</p>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 flex items-center justify-center">
                      <Icon icon="mdi:check-circle-outline" className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Connected</p>
                      <p className="text-2xl font-bold text-foreground">{stats.connected}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 flex items-center justify-center">
                      <Icon icon="mdi:clock-outline" className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pending</p>
                      <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lawyers by name, email, or firm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/60"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'connected', 'pending'] as const).map((status) => (
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

          {/* Lawyers List - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <Card 
                key={lawyer.id} 
                className="border border-border/40 hover:border-border/60 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/50 backdrop-blur-sm"
                onClick={() => setSelectedLawyerDetails(lawyer)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-border/60">
                        <AvatarFallback className="bg-foreground/5 text-foreground font-semibold">
                          {lawyer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold group-hover:text-foreground/80 transition-colors">
                          {lawyer.name}
                        </CardTitle>
                        {lawyer.firm && (
                          <CardDescription className="text-xs mt-0.5">
                            {lawyer.firm}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={lawyer.status === 'connected' ? 'default' : 'secondary'}
                      className={cn(
                        'text-[10px] capitalize',
                        lawyer.status === 'connected' && 'bg-foreground/5 text-foreground border-border/60',
                        lawyer.status === 'pending' && 'bg-foreground/5 text-foreground border-border/60'
                      )}
                    >
                      {lawyer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="mdi:email-outline" className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{lawyer.email}</span>
                    </div>
                    {lawyer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="mdi:phone-outline" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{lawyer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  {lawyer.specialization.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {lawyer.specialization.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] border-border/60 bg-muted/30">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Rating & Experience */}
                  {(lawyer.rating || lawyer.yearsExperience) && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {lawyer.rating && (
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:star" className="h-3.5 w-3.5 text-yellow-500" />
                          <span className="font-medium text-foreground">{lawyer.rating}</span>
                        </div>
                      )}
                      {lawyer.yearsExperience && (
                        <div className="flex items-center gap-1">
                          <Icon icon="mdi:clock-outline" className="h-3.5 w-3.5" />
                          <span>{lawyer.yearsExperience} years</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-border/40">
                    {lawyer.status === 'connected' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border/60 hover:bg-muted/50"
                          onClick={(e) => { e.stopPropagation(); handleContact(lawyer, 'email'); }}
                        >
                          <Icon icon="mdi:email-outline" className="h-3.5 w-3.5 mr-1.5" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border/60 hover:bg-muted/50"
                          onClick={(e) => { e.stopPropagation(); handleContact(lawyer, 'video'); }}
                        >
                          <Icon icon="mdi:video-outline" className="h-3.5 w-3.5 mr-1.5" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-border/60 hover:bg-muted/50"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            window.location.href = `/communication?lawyerId=${lawyer.id}`;
                          }}
                          title="Open Communication"
                        >
                          <Icon icon="mdi:message-text-outline" className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {lawyer.status === 'pending' && (
                      <Button variant="outline" size="sm" className="w-full border-border/60" disabled>
                        <Icon icon="mdi:clock-outline" className="h-3.5 w-3.5 mr-1.5" />
                        Invitation Pending
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredLawyers.length === 0 && (
            <Card className="border border-border/60">
              <CardContent className="py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="solar:briefcase-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || filterStatus !== 'all' ? 'No lawyers found' : 'No lawyers yet'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Invite a lawyer to collaborate on your estate planning and legal matters.'}
                </p>
                {!searchQuery && filterStatus === 'all' && (
                  <Button onClick={handleInviteLawyer} className="bg-foreground text-background hover:bg-foreground/90">
                    <Icon icon="solar:user-plus-bold" className="h-4 w-4 mr-2" />
                    Invite Your First Lawyer
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Video Call Modal */}
      {selectedLawyer && (
        <VideoCallModal
          open={isVideoCallOpen}
          onOpenChange={setIsVideoCallOpen}
          initialDetails={{
            title: `Call with ${selectedLawyer.name}`,
            description: `Video consultation with ${selectedLawyer.firm || selectedLawyer.name}`,
            participants: [
              { email: selectedLawyer.email, name: selectedLawyer.name },
            ],
          }}
          participantPhone={selectedLawyer.phone}
          onCallStarted={handleVideoCallStarted}
        />
      )}

      {/* Message Dialog */}
      {selectedLawyer && (
        <MessageDialog
          open={isMessageOpen}
          onOpenChange={setIsMessageOpen}
          recipient={{
            id: selectedLawyer.id,
            name: selectedLawyer.name,
            email: selectedLawyer.email,
          }}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Invite Lawyer Dialog - Enhanced */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                <Icon icon="solar:user-plus-bold-duotone" className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl">Invite a Lawyer</DialogTitle>
                <DialogDescription>
                  Send an invitation to collaborate on your estate planning
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="lawyer-email" className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Icon icon="solar:letter-bold-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lawyer-email"
                  type="email"
                  placeholder="lawyer@lawfirm.com"
                  value={inviteFormData.email}
                  onChange={(e) => setInviteFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 border-border/60"
                />
              </div>
            </div>

            {/* Name & Firm Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lawyer-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <Icon icon="solar:user-bold-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lawyer-name"
                    type="text"
                    placeholder="John Smith"
                    value={inviteFormData.name}
                    onChange={(e) => setInviteFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 border-border/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lawyer-firm" className="text-sm font-medium">
                  Law Firm
                </Label>
                <div className="relative">
                  <Icon icon="solar:buildings-2-bold-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lawyer-firm"
                    type="text"
                    placeholder="Smith & Associates"
                    value={inviteFormData.firm}
                    onChange={(e) => setInviteFormData(prev => ({ ...prev, firm: e.target.value }))}
                    className="pl-10 border-border/60"
                  />
                </div>
              </div>
            </div>

            {/* Access Level */}
            <div className="space-y-2">
              <Label htmlFor="access-level" className="text-sm font-medium">
                Access Level
              </Label>
              <Select
                value={inviteFormData.accessLevel}
                onValueChange={(value: 'view' | 'edit' | 'full') => 
                  setInviteFormData(prev => ({ ...prev, accessLevel: value }))
                }
              >
                <SelectTrigger id="access-level" className="border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:eye-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">View Only</span>
                        <span className="text-xs text-muted-foreground ml-2">Can view documents and information</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="edit">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:pen-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Edit Access</span>
                        <span className="text-xs text-muted-foreground ml-2">Can view and edit documents</span>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="full">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:shield-check-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Full Access</span>
                        <span className="text-xs text-muted-foreground ml-2">Complete control over estate planning</span>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Personal Message <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal note to your invitation..."
                value={inviteFormData.message}
                onChange={(e) => setInviteFormData(prev => ({ ...prev, message: e.target.value }))}
                className="border-border/60 resize-none"
                rows={3}
              />
            </div>

            {/* Info Box */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border/40">
              <div className="flex gap-3">
                <Icon icon="solar:info-circle-bold-duotone" className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">What happens next?</p>
                  <p>Your lawyer will receive an email invitation with a secure link to join Woodpecker and connect with your account.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border/40 mt-6">
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} className="border-border/60">
              Cancel
            </Button>
            <Button onClick={handleSendInvitation} className="bg-foreground text-background hover:bg-foreground/90">
              <Icon icon="solar:letter-bold" className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lawyer Details Dialog */}
      <Dialog open={!!selectedLawyerDetails} onOpenChange={() => setSelectedLawyerDetails(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedLawyerDetails && (
            <>
              <DialogHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-border/60">
                    <AvatarFallback className="bg-foreground/5 text-foreground font-semibold text-xl">
                      {selectedLawyerDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-xl">{selectedLawyerDetails.name}</DialogTitle>
                    {selectedLawyerDetails.firm && (
                      <DialogDescription className="mt-1">{selectedLawyerDetails.firm}</DialogDescription>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant={selectedLawyerDetails.status === 'connected' ? 'default' : 'secondary'}
                        className={cn(
                          'text-xs',
                          selectedLawyerDetails.status === 'connected' && 'bg-foreground/5 text-foreground border-border/60'
                        )}
                      >
                        {selectedLawyerDetails.status}
                      </Badge>
                      {selectedLawyerDetails.accessLevel && (
                        <Badge variant="outline" className="text-xs capitalize border-border/60">
                          {selectedLawyerDetails.accessLevel} Access
                        </Badge>
                      )}
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
                      <span className="text-foreground">{selectedLawyerDetails.email}</span>
                    </div>
                    {selectedLawyerDetails.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <Icon icon="solar:phone-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{selectedLawyerDetails.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specializations */}
                {selectedLawyerDetails.specialization.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLawyerDetails.specialization.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="border-border/60 bg-muted/30">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {(selectedLawyerDetails.rating || selectedLawyerDetails.yearsExperience) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLawyerDetails.rating && (
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Icon icon="solar:star-bold" className="h-5 w-5 text-yellow-500" />
                          <span className="text-2xl font-bold text-foreground">{selectedLawyerDetails.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    )}
                    {selectedLawyerDetails.yearsExperience && (
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">{selectedLawyerDetails.yearsExperience}+</div>
                        <p className="text-xs text-muted-foreground">Years Experience</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedLawyerDetails.status === 'connected' && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 border-border/60"
                      onClick={() => { setSelectedLawyerDetails(null); handleContact(selectedLawyerDetails, 'email'); }}
                    >
                      <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border/60"
                      onClick={() => { setSelectedLawyerDetails(null); handleContact(selectedLawyerDetails, 'message'); }}
                    >
                      <Icon icon="solar:chat-round-dots-bold-duotone" className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => { setSelectedLawyerDetails(null); handleContact(selectedLawyerDetails, 'video'); }}
                    >
                      <Icon icon="solar:videocamera-record-bold-duotone" className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
