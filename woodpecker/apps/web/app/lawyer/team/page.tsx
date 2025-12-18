'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useApi } from '@/lib/hooks/use-api'
import { useToast } from '@/lib/hooks'
import { motion, AnimatePresence } from 'framer-motion'

interface SubAccount {
  id: string
  email: string
  name: string | null
  role: string
  permissions: string[]
  status: string
  joinedAt: Date | null
  clerkUserId: string
}

export default function LawyerTeamPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [subAccounts, setSubAccounts] = React.useState<SubAccount[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newMemberEmail, setNewMemberEmail] = React.useState('')
  const [newMemberName, setNewMemberName] = React.useState('')
  const [newMemberRole, setNewMemberRole] = React.useState('member')
  const { fetch: fetchSubAccounts, loading: fetching } = useApi()

  const loadSubAccounts = React.useCallback(async () => {
    try {
      const response = await fetchSubAccounts('/api/professionals/sub-accounts', {
        method: 'GET',
      })
      if (response?.subAccounts) {
        setSubAccounts(response.subAccounts)
      }
    } catch (error) {
      console.error('Error loading sub-accounts:', error)
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [fetchSubAccounts])

  React.useEffect(() => {
    loadSubAccounts()
  }, [loadSubAccounts])

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast.error('Email is required')
      return
    }

    try {
      const response = await fetch('/api/professionals/sub-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newMemberEmail,
          name: newMemberName,
          role: newMemberRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add team member')
      }

      toast.success('Team member invited successfully')
      setIsAddDialogOpen(false)
      setNewMemberEmail('')
      setNewMemberName('')
      setNewMemberRole('member')
      loadSubAccounts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to add team member')
    }
  }

  const handleUpdateStatus = async (teamMemberId: string, status: string) => {
    try {
      const response = await fetch('/api/professionals/sub-accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMemberId,
          status,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast.success('Status updated successfully')
      loadSubAccounts()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleRemoveMember = async (teamMemberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return
    }

    try {
      const response = await fetch('/api/professionals/sub-accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamMemberId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove team member')
      }

      toast.success('Team member removed successfully')
      loadSubAccounts()
    } catch (error) {
      toast.error('Failed to remove team member')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-foreground/5 text-foreground border-border/60'
      case 'pending':
        return 'bg-muted/50 text-muted-foreground border-border/40'
      case 'inactive':
        return 'bg-muted/50 text-muted-foreground border-border/40'
      default:
        return 'bg-foreground/5 border border-border/60'
    }
  }

  const getRoleBadge = (role: string) => {
    const roleLabels: Record<string, string> = {
      member: 'Member',
      admin: 'Admin',
      manager: 'Manager',
    }
    return roleLabels[role] || role
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Team Management</h1>
              <p className="text-muted-foreground">
                Manage your team members and sub-accounts
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Invite a professional to join your team. They must already have a professional account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="team-email">Email *</Label>
                    <Input
                      id="team-email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team-name">Name</Label>
                    <Input
                      id="team-name"
                      placeholder="John Doe"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team-role">Role</Label>
                    <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} className="bg-foreground text-background hover:bg-foreground/90">
                    Add Member
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : subAccounts.length === 0 ? (
            <Card className="border border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Icon icon="solar:users-group-rounded-bold-duotone" className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add team members to collaborate on client legacies
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4" />
                  Add Your First Team Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {subAccounts.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="border border-border/60 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center">
                              <Icon icon="solar:user-bold-duotone" className="h-6 w-6 text-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {member.name || 'Unnamed Member'}
                              </h3>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {getRoleBadge(member.role)}
                                </Badge>
                                <Badge className={getStatusColor(member.status)}>
                                  {member.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {member.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(member.id, 'active')}
                              >
                                Activate
                              </Button>
                            )}
                            {member.status === 'active' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(member.id, 'inactive')}
                              >
                                Deactivate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {member.permissions.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border/60">
                            <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              {member.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

