'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Input, Label } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface Person {
  id: string
  name: string
  relationship: string
  email?: string
  phone?: string
  role: 'beneficiary' | 'executor' | 'family' | 'advisor'
  status: 'active' | 'pending' | 'invited'
}

export default function PeoplePage() {
  const { toast } = useToast()
  const [people, setPeople] = useLocalStorage<Person[]>('people-list', [
    { id: '1', name: 'John Doe', relationship: 'Spouse', email: 'john@example.com', role: 'beneficiary', status: 'active' },
    { id: '2', name: 'Jane Smith', relationship: 'Child', email: 'jane@example.com', role: 'beneficiary', status: 'active' },
  ])
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    role: 'beneficiary' as Person['role'],
  })

  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [editingPerson, setEditingPerson] = React.useState<Person | null>(null)

  const handleAdd = () => {
    if (!formData.name || !formData.relationship) {
      toast.error('Required fields', 'Name and relationship are required')
      return
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      ...formData,
      status: formData.email ? 'invited' : 'pending',
    }

    setPeople([...people, newPerson])
    setFormData({ name: '', relationship: '', email: '', phone: '', role: 'beneficiary' })
    setIsAddOpen(false)
    toast.success('Person added', `${newPerson.name} has been added to your estate plan`)
  }

  const handleEdit = (person: Person) => {
    setEditingPerson(person)
    setFormData({
      name: person.name,
      relationship: person.relationship,
      email: person.email || '',
      phone: person.phone || '',
      role: person.role,
    })
    setIsAddOpen(true)
  }

  const handleUpdate = () => {
    if (!formData.name || !formData.relationship || !editingPerson) {
      toast.error('Required fields', 'Name and relationship are required')
      return
    }

    setPeople(people.map(p => 
      p.id === editingPerson.id 
        ? { ...p, ...formData, status: formData.email ? 'invited' : p.status }
        : p
    ))
    setFormData({ name: '', relationship: '', email: '', phone: '', role: 'beneficiary' })
    setEditingPerson(null)
    setIsAddOpen(false)
    toast.success('Person updated', `${formData.name} has been updated`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this person?')) return
    
    setIsDeleting(id)
    setTimeout(() => {
      const person = people.find(p => p.id === id)
      setPeople(people.filter(p => p.id !== id))
      setIsDeleting(null)
      toast.success('Person removed', `${person?.name || 'Person'} has been removed`)
    }, 300)
  }

  const roleColors: Record<Person['role'], string> = {
    beneficiary: 'bg-foreground/5 text-foreground border-border/60',
    executor: 'bg-foreground/5 text-foreground border-border/60',
    family: 'bg-foreground/5 text-foreground border-border/60',
    advisor: 'bg-muted/50 text-muted-foreground border-border/40',
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                People & Family
              </h1>
              <p className="text-muted-foreground">
                Manage beneficiaries, executors, and family members in your estate plan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/client/invitations">
                <Button 
                  variant="outline"
                  className="border-border/60 hover:border-border hover:shadow-md transition-all"
                >
                  <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </Link>
              <Button 
                onClick={() => setIsAddOpen(true)}
                className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
              >
                <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                Add Person
              </Button>
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={cn(
                      "border border-border/60 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-foreground/5",
                      isDeleting === person.id && 'opacity-50'
                    )}
                  >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center">
                          <Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">{person.name}</CardTitle>
                          <CardDescription className="text-xs">{person.relationship}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <Badge className={cn("text-xs capitalize", roleColors[person.role])}>
                      {person.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {person.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon icon="solar:letter-bold-duotone" className="h-4 w-4" />
                        <a href={`mailto:${person.email}`} className="hover:text-foreground transition-colors">
                          {person.email}
                        </a>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon icon="solar:phone-bold-duotone" className="h-4 w-4" />
                        <a href={`tel:${person.phone}`} className="hover:text-foreground transition-colors">
                          {person.phone}
                        </a>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {person.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {person.status === 'pending' && person.email && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              // Navigate to invitations page to resend
                              window.location.href = `/client/invitations?email=${encodeURIComponent(person.email || '')}`
                            }}
                            title="Resend Invitation"
                          >
                            <Icon icon="solar:letter-bold-duotone" className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEdit(person)}
                          title="Edit"
                        >
                          <Icon icon="solar:pen-bold" className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(person.id)}
                          title="Delete"
                          disabled={isDeleting === person.id}
                        >
                          <Icon 
                            icon={isDeleting === person.id ? "solar:refresh-bold" : "solar:trash-bin-trash-bold"} 
                            className={`h-3.5 w-3.5 ${isDeleting === person.id ? 'animate-spin' : ''}`} 
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {people.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-dashed border-border/60 bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-16 w-16 text-muted-foreground mb-6" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No people added yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                    Start building your estate plan by adding beneficiaries, executors, and family members
                  </p>
                  <Button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    <Icon icon="solar:user-plus-bold-duotone" className="h-5 w-5 mr-2" />
                    Add First Person
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* Add/Edit Person Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(open) => {
        if (!open) {
          setEditingPerson(null)
          setFormData({ name: '', relationship: '', email: '', phone: '', role: 'beneficiary' })
        }
        setIsAddOpen(open)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPerson ? 'Edit Person' : 'Add Person'}</DialogTitle>
            <DialogDescription>
              {editingPerson ? 'Update person information' : 'Add a beneficiary, executor, or family member'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship *</Label>
              <Input
                id="relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                placeholder="e.g., Spouse, Child, Friend"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+27 12 345 6789"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as Person['role'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beneficiary">Beneficiary</SelectItem>
                  <SelectItem value="executor">Executor</SelectItem>
                  <SelectItem value="family">Family Member</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingPerson(null)
                setFormData({ name: '', relationship: '', email: '', phone: '', role: 'beneficiary' })
                setIsAddOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={editingPerson ? handleUpdate : handleAdd} className="bg-foreground text-background hover:bg-foreground/90">
              {editingPerson ? 'Update Person' : 'Add Person'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

