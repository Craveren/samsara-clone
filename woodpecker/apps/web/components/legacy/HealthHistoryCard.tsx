/**
 * Health History Card Component
 * Displays medical history, allergies, and health information
 */

'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { format } from 'date-fns'

export interface Allergy {
  id: string
  name: string
  severity: 'mild' | 'moderate' | 'severe'
  reaction: string
  notes?: string
}

export interface MedicalEvent {
  id: string
  date: Date
  type: 'checkup' | 'surgery' | 'vaccination' | 'diagnosis' | 'medication' | 'other'
  title: string
  provider?: string
  location?: string
  notes?: string
  condition?: string
}

export interface HealthProfile {
  age?: number
  birthday?: string
  weight?: string
  height?: string
  gender?: string
  guardian?: string
  bloodType?: string
  allergies: Allergy[]
  medicalHistory: MedicalEvent[]
}

interface HealthHistoryCardProps {
  profile: HealthProfile
  onUpdate?: (profile: HealthProfile) => void
  editable?: boolean
}

export function HealthHistoryCard({ profile, onUpdate, editable = true }: HealthHistoryCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAllergyDialogOpen, setIsAllergyDialogOpen] = React.useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<HealthProfile>>(profile)
  const [newAllergy, setNewAllergy] = React.useState<Partial<Allergy>>({})
  const [newEvent, setNewEvent] = React.useState<Partial<MedicalEvent>>({})

  const handleSaveProfile = () => {
    if (onUpdate) {
      onUpdate({
        ...profile,
        ...formData,
      })
    }
    setIsEditDialogOpen(false)
  }

  const handleAddAllergy = () => {
    if (newAllergy.name && newAllergy.severity && newAllergy.reaction) {
      const allergy: Allergy = {
        id: Date.now().toString(),
        name: newAllergy.name,
        severity: newAllergy.severity as Allergy['severity'],
        reaction: newAllergy.reaction,
        notes: newAllergy.notes,
      }
      if (onUpdate) {
        onUpdate({
          ...profile,
          allergies: [...profile.allergies, allergy],
        })
      }
      setNewAllergy({})
      setIsAllergyDialogOpen(false)
    }
  }

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.type && newEvent.date) {
      const event: MedicalEvent = {
        id: Date.now().toString(),
        date: newEvent.date instanceof Date ? newEvent.date : new Date(newEvent.date),
        type: newEvent.type as MedicalEvent['type'],
        title: newEvent.title,
        provider: newEvent.provider,
        location: newEvent.location,
        notes: newEvent.notes,
        condition: newEvent.condition,
      }
      if (onUpdate) {
        onUpdate({
          ...profile,
          medicalHistory: [...profile.medicalHistory, event].sort((a, b) => b.date.getTime() - a.date.getTime()),
        })
      }
      setNewEvent({})
      setIsHistoryDialogOpen(false)
    }
  }

  const severityColors = {
    mild: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    moderate: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    severe: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  const typeIcons = {
    checkup: 'solar:heart-pulse-bold-duotone',
    surgery: 'solar:scalpel-bold-duotone',
    vaccination: 'solar:syringe-bold-duotone',
    diagnosis: 'solar:document-medicine-bold-duotone',
    medication: 'solar:pills-bold-duotone',
    other: 'solar:medical-kit-bold-duotone',
  }

  return (
    <Card className="border border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Icon icon="solar:heart-pulse-bold-duotone" className="h-5 w-5" />
              Health Profile
            </CardTitle>
            <CardDescription>Medical history and health information</CardDescription>
          </div>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Icon icon="solar:pen-bold" className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile.age && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Age</p>
              <p className="text-sm font-medium">{profile.age}</p>
            </div>
          )}
          {profile.birthday && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Birthday</p>
              <p className="text-sm font-medium">
                {profile.birthday.includes('-') 
                  ? new Date(profile.birthday + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : profile.birthday}
              </p>
            </div>
          )}
          {profile.weight && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Weight</p>
              <p className="text-sm font-medium">{profile.weight}</p>
            </div>
          )}
          {profile.height && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Height</p>
              <p className="text-sm font-medium">{profile.height}</p>
            </div>
          )}
          {profile.gender && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Gender</p>
              <p className="text-sm font-medium">{profile.gender}</p>
            </div>
          )}
          {profile.guardian && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Guardian</p>
              <p className="text-sm font-medium">{profile.guardian}</p>
            </div>
          )}
        </div>

        {/* Allergies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Icon icon="solar:warning-bold-duotone" className="h-4 w-4" />
              Allergies
            </h3>
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAllergyDialogOpen(true)}
              >
                <Icon icon="solar:add-circle-bold" className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
          {profile.allergies.length > 0 ? (
            <div className="space-y-2">
              {profile.allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-border/60 bg-background/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{allergy.name}</p>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', severityColors[allergy.severity])}
                      >
                        {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{allergy.reaction}</p>
                    {allergy.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{allergy.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No allergies recorded</p>
          )}
        </div>

        {/* Medical History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Icon icon="solar:document-medicine-bold-duotone" className="h-4 w-4" />
              Medical History
            </h3>
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryDialogOpen(true)}
              >
                <Icon icon="solar:add-circle-bold" className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            )}
          </div>
          {profile.medicalHistory.length > 0 ? (
            <div className="space-y-3">
              {profile.medicalHistory.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-background/50"
                >
                  <div className="h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center flex-shrink-0">
                    <Icon icon={typeIcons[event.type]} className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, 'EEEE, MMMM d, yyyy')}
                    </p>
                    {event.provider && (
                      <p className="text-xs text-muted-foreground">
                        with {event.provider}
                        {event.location && ` at ${event.location}`}
                      </p>
                    )}
                    {event.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>
                    )}
                  </div>
                  {editable && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => {
                        if (onUpdate) {
                          onUpdate({
                            ...profile,
                            medicalHistory: profile.medicalHistory.filter(e => e.id !== event.id),
                          })
                        }
                      }}
                    >
                      <Icon icon="solar:trash-bin-trash-bold" className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No medical history recorded</p>
          )}
        </div>
      </CardContent>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Health Profile</DialogTitle>
            <DialogDescription>Update basic health information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                />
              </div>
              <div>
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday || ''}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 72 kgs"
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="e.g., 165 cm"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender || ''}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="guardian">Guardian</Label>
                <Input
                  id="guardian"
                  value={formData.guardian || ''}
                  onChange={(e) => setFormData({ ...formData, guardian: e.target.value })}
                  placeholder="Guardian name"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Allergy Dialog */}
      <Dialog open={isAllergyDialogOpen} onOpenChange={setIsAllergyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Allergy</DialogTitle>
            <DialogDescription>Record a new allergy</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="allergy-name">Allergy Name *</Label>
              <Input
                id="allergy-name"
                value={newAllergy.name || ''}
                onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
                placeholder="e.g., Penicillin"
              />
            </div>
            <div>
              <Label htmlFor="allergy-severity">Severity *</Label>
              <Select
                value={newAllergy.severity || ''}
                onValueChange={(value) => setNewAllergy({ ...newAllergy, severity: value as Allergy['severity'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allergy-reaction">Reaction *</Label>
              <Input
                id="allergy-reaction"
                value={newAllergy.reaction || ''}
                onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                placeholder="e.g., Hives (Moderate to severe)"
              />
            </div>
            <div>
              <Label htmlFor="allergy-notes">Notes</Label>
              <Textarea
                id="allergy-notes"
                value={newAllergy.notes || ''}
                onChange={(e) => setNewAllergy({ ...newAllergy, notes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAllergyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAllergy}>Add Allergy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Medical Event Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Medical Event</DialogTitle>
            <DialogDescription>Record a medical event or appointment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">Title *</Label>
              <Input
                id="event-title"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Asthma Check-Up"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-type">Type *</Label>
                <Select
                  value={newEvent.type || ''}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as MedicalEvent['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="diagnosis">Diagnosis</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="event-date">Date *</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date instanceof Date ? format(newEvent.date, 'yyyy-MM-dd') : newEvent.date || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="event-provider">Provider</Label>
              <Input
                id="event-provider"
                value={newEvent.provider || ''}
                onChange={(e) => setNewEvent({ ...newEvent, provider: e.target.value })}
                placeholder="e.g., Dr. Henry Seven"
              />
            </div>
            <div>
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="e.g., Community Hospital, 40 Bernard St, London"
              />
            </div>
            <div>
              <Label htmlFor="event-notes">Notes</Label>
              <Textarea
                id="event-notes"
                value={newEvent.notes || ''}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

