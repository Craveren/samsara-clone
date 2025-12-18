'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { formatDateTime } from '@/lib/utils/date-format'
import { Icons } from '@/lib/icons'

interface Meeting {
  id: string
  clientId: string
  clientName: string
  scheduledAt: string
  status: 'scheduled' | 'active' | 'ended'
  roomId: string
  duration?: number
  agenda?: string
  notes?: string
  recordingUrl?: string
  participants?: string[]
  meetingType?: 'consultation' | 'review' | 'signing' | 'follow-up'
}

export default function LawyerMeetingsPage() {
  const { toast } = useToast()
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('lawyer-meetings', [
    {
      id: '1',
      clientId: 'client-1',
      clientName: 'John Doe',
      scheduledAt: '2024-01-20T10:00:00Z',
      status: 'scheduled',
      roomId: 'room-123',
    },
    {
      id: '2',
      clientId: 'client-2',
      clientName: 'Jane Smith',
      scheduledAt: '2024-01-19T14:00:00Z',
      status: 'active',
      roomId: 'room-456',
    },
  ])

  const [isNewMeetingDialogOpen, setIsNewMeetingDialogOpen] = React.useState(false)

  const handleCreateMeeting = (formData: { clientName: string; scheduledAt: string }) => {
    const newMeeting: Meeting = {
      id: Math.random().toString(36).substring(7),
      clientId: 'client-new',
      clientName: formData.clientName,
      scheduledAt: formData.scheduledAt,
      status: 'scheduled',
      roomId: `room-${Math.random().toString(36).substring(7)}`,
    }
    setMeetings(prev => [...prev, newMeeting])
    setIsNewMeetingDialogOpen(false)
    toast.success('Meeting Scheduled', 'Your meeting has been scheduled successfully')
  }

  const handleJoinMeeting = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId)
    if (meeting) {
      setMeetings(prev => prev.map(m => 
        m.id === meetingId ? { ...m, status: 'active' as const } : m
      ))
      window.open(`https://teams.microsoft.com/l/meetup-join/${meeting.roomId}`, '_blank')
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Client Meetings
              </h1>
              <p className="text-base text-muted-foreground">
                Professional video meetings with screen sharing, recording, whiteboard, and integrated notes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-border/60">
                <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline" className="border-border/60">
                <Icon icon="solar:video-recorder-bold-duotone" className="h-4 w-4 mr-2" />
                Recordings
              </Button>
              <Dialog open={isNewMeetingDialogOpen} onOpenChange={setIsNewMeetingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-foreground text-background hover:bg-foreground/90">
                    <Icon icon={Icons.add} className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Meeting</DialogTitle>
                    <DialogDescription>
                      Create a new video meeting with a client
                    </DialogDescription>
                  </DialogHeader>
                  <MeetingForm onSubmit={handleCreateMeeting} onCancel={() => setIsNewMeetingDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border border-border/60 hover:border-border transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Meetings</p>
                    <p className="text-2xl font-bold">{meetings.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icon icon={Icons.calendar} className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 hover:border-border transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Now</p>
                    <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'active').length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                    <Icon icon={Icons.video} className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 hover:border-border transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Scheduled</p>
                    <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'scheduled').length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                    <Icon icon={Icons.clock} className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meetings List */}
          {meetings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="border border-border/60 hover:border-border hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {meeting.clientName}
                      </CardTitle>
                      <Badge
                        variant={
                          meeting.status === 'active'
                            ? 'default'
                            : meeting.status === 'scheduled'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={cn(
                          'text-[10px] capitalize',
                          meeting.status === 'active' && 'bg-foreground/5 text-foreground border-border/60'
                        )}
                      >
                        {meeting.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Icon icon={Icons.calendar} className="h-3.5 w-3.5" />
                          Scheduled
                        </span>
                        <span className="text-foreground">
                          {formatDateTime(new Date(meeting.scheduledAt))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Icon icon={Icons.link} className="h-3.5 w-3.5" />
                          Meeting ID
                        </span>
                        <span className="text-foreground font-mono text-xs">
                          {meeting.roomId}
                        </span>
                      </div>
                      {meeting.status === 'scheduled' && (
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-foreground text-background hover:bg-foreground/90"
                            onClick={() => handleJoinMeeting(meeting.id)}
                          >
                            <Icon icon="solar:videocamera-record-bold-duotone" className="h-4 w-4 mr-2" />
                            Start Meeting
                          </Button>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              <Icon icon="solar:share-bold-duotone" className="h-3.5 w-3.5 mr-1" />
                              Share
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Icon icon="solar:calendar-mark-bold-duotone" className="h-3.5 w-3.5 mr-1" />
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Icon icon="solar:notes-bold-duotone" className="h-3.5 w-3.5 mr-1" />
                              Notes
                            </Button>
                          </div>
                        </div>
                      )}
                      {meeting.status === 'active' && (
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-foreground text-background hover:bg-foreground/90"
                            onClick={() => handleJoinMeeting(meeting.id)}
                          >
                            <Icon icon="solar:videocamera-record-bold-duotone" className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                          <div className="grid grid-cols-4 gap-2">
                            <Button variant="outline" size="sm" className="text-xs" title="Screen Share">
                              <Icon icon="solar:monitor-bold-duotone" className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs" title="Whiteboard">
                              <Icon icon="solar:pen-new-square-bold-duotone" className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs" title="Record">
                              <Icon icon="solar:record-bold-duotone" className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs" title="Chat">
                              <Icon icon="solar:chat-round-line-bold-duotone" className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {meeting.status === 'ended' && meeting.recordingUrl && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(meeting.recordingUrl, '_blank')}
                        >
                          <Icon icon="solar:video-recorder-bold-duotone" className="h-4 w-4 mr-2" />
                          View Recording
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-border/60">
              <CardContent className="py-12 text-center">
                <Icon icon={Icons.video} className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  No meetings scheduled
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Schedule professional video meetings with integrated screen sharing, whiteboard, recording, and collaborative notes. Everything you need for effective client consultations in one place.
                </p>
                <Button
                  onClick={() => setIsNewMeetingDialogOpen(true)}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  <Icon icon={Icons.add} className="h-4 w-4 mr-2" />
                  Schedule Your First Meeting
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

function MeetingForm({ onSubmit, onCancel }: { onSubmit: (data: { clientName: string; scheduledAt: string }) => void; onCancel: () => void }) {
  const [clientName, setClientName] = React.useState('')
  const [scheduledAt, setScheduledAt] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientName && scheduledAt) {
      onSubmit({ clientName, scheduledAt })
      setClientName('')
      setScheduledAt('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
        <Input
          id="scheduledAt"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
          <Icon icon="logos:microsoft-teams" className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </DialogFooter>
    </form>
  )
}
