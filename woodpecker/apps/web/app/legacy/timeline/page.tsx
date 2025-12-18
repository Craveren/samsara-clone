'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useDashboardData } from '@/lib/hooks/use-dashboard-data'
import { formatDate } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { Badge } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'memory' | 'document' | 'task' | 'milestone' | 'account' | 'people'
  icon: string
  isNew?: boolean
}

export default function LifeTimelinePage() {
  const dashboard = useDashboardData({ autoFetch: true })
  const [timelineEvents, setTimelineEvents] = useLocalStorage<TimelineEvent[]>('life-timeline-events', [])
  const [hasNewUpdates, setHasNewUpdates] = useLocalStorage<boolean>('life-timeline-has-updates', false)
  
  // Disable notifications on this page to prevent sidebar issues
  React.useEffect(() => {
    // This page doesn't need notifications
  }, [])

  // Generate timeline events from various sources
  React.useEffect(() => {
    const events: TimelineEvent[] = []
    const now = new Date()

    // Check for new memories (interviews)
    const interviews = JSON.parse(localStorage.getItem('woodpecker-interviews') || '[]')
    interviews.forEach((interview: any) => {
      const eventDate = new Date(interview.recordedAt || interview.createdAt || now)
      const existingEvent = timelineEvents.find(e => e.id === `memory-${interview.id}`)
      if (!existingEvent || new Date(existingEvent.date) < eventDate) {
        events.push({
          id: `memory-${interview.id}`,
          date: eventDate.toISOString(),
          title: 'Recorded Memory',
          description: `Recorded "${interview.title || 'a memory'}"`,
          type: 'memory',
          icon: 'solar:microphone-3-bold-duotone',
          isNew: !existingEvent,
        })
      } else {
        events.push(existingEvent)
      }
    })

    // Check for documents
    if (dashboard?.documents && Array.isArray(dashboard.documents)) {
      dashboard.documents.forEach((doc: any) => {
        const eventDate = new Date(doc.createdAt || doc.uploadedAt || now)
        const existingEvent = timelineEvents.find(e => e.id === `doc-${doc.id}`)
        if (!existingEvent || new Date(existingEvent.date) < eventDate) {
          events.push({
            id: `doc-${doc.id}`,
            date: eventDate.toISOString(),
            title: 'Document Added',
            description: `Added "${doc.name || doc.title || 'a document'}"`,
            type: 'document',
            icon: 'solar:document-text-bold-duotone',
            isNew: !existingEvent,
          })
        } else {
          events.push(existingEvent)
        }
      })
    }

    // Check for completed tasks
    try {
      const tasks = JSON.parse(localStorage.getItem('woodpecker-kanban-tasks') || localStorage.getItem('kanban-tasks') || '[]')
      if (Array.isArray(tasks)) {
        tasks.filter((task: any) => task.status === 'done').forEach((task: any) => {
          const eventDate = new Date(task.completedAt || task.updatedAt || now)
          const existingEvent = timelineEvents.find(e => e.id === `task-${task.id}`)
          if (!existingEvent || new Date(existingEvent.date) < eventDate) {
            events.push({
              id: `task-${task.id}`,
              date: eventDate.toISOString(),
              title: 'Task Completed',
              description: `Completed "${task.title}"`,
              type: 'task',
              icon: 'solar:check-circle-bold-duotone',
              isNew: !existingEvent,
            })
          } else {
            events.push(existingEvent)
          }
        })
      }
    } catch (e) {
      console.warn('Failed to parse tasks:', e)
    }

    // Check for financial accounts
    if (dashboard?.financial?.accounts && Array.isArray(dashboard.financial.accounts)) {
      dashboard.financial.accounts.forEach((account: any) => {
        const eventDate = new Date(account.createdAt || account.addedAt || now)
        const existingEvent = timelineEvents.find(e => e.id === `account-${account.id}`)
        if (!existingEvent || new Date(existingEvent.date) < eventDate) {
          events.push({
            id: `account-${account.id}`,
            date: eventDate.toISOString(),
            title: 'Financial Account Added',
            description: `Added ${account.accountName || account.name || 'an account'}`,
            type: 'account',
            icon: 'solar:wallet-bold-duotone',
            isNew: !existingEvent,
          })
        } else {
          events.push(existingEvent)
        }
      })
    }
    
    // Also check localStorage for accounts
    try {
      const localAccounts = JSON.parse(localStorage.getItem('financial-accounts') || '[]')
      if (Array.isArray(localAccounts)) {
        localAccounts.forEach((account: any) => {
          const existingEvent = events.find(e => e.id === `account-${account.id}`)
          if (!existingEvent) {
            const eventDate = new Date(account.lastUpdated || account.createdAt || now)
            events.push({
              id: `account-${account.id}`,
              date: eventDate.toISOString(),
              title: 'Financial Account Added',
              description: `Added ${account.bankName || account.accountName || 'an account'}`,
              type: 'account',
              icon: 'solar:wallet-bold-duotone',
              isNew: true,
            })
          }
        })
      }
    } catch (e) {
      console.warn('Failed to parse local accounts:', e)
    }

    // Check for people added
    const people = JSON.parse(localStorage.getItem('estate-people') || '[]')
    people.forEach((person: any) => {
      const eventDate = new Date(person.createdAt || person.addedAt || now)
      const existingEvent = timelineEvents.find(e => e.id === `people-${person.id}`)
      if (!existingEvent || new Date(existingEvent.date) < eventDate) {
        events.push({
          id: `people-${person.id}`,
          date: eventDate.toISOString(),
          title: 'Person Added',
          description: `Added ${person.name} as ${person.role || 'beneficiary'}`,
          type: 'people',
          icon: 'solar:users-group-two-rounded-bold-duotone',
          isNew: !existingEvent,
        })
      } else {
        events.push(existingEvent)
      }
    })

    // Add milestone events
    const milestones = [
      { id: 'first-memory', title: 'First Memory Recorded', description: 'You recorded your first memory', icon: 'solar:star-bold-duotone' },
      { id: 'first-document', title: 'First Document Uploaded', description: 'You uploaded your first document', icon: 'solar:star-bold-duotone' },
      { id: 'first-task', title: 'First Task Completed', description: 'You completed your first estate planning task', icon: 'solar:star-bold-duotone' },
    ]

    milestones.forEach(milestone => {
      const hasMilestone = events.some(e => e.id === milestone.id)
      if (!hasMilestone) {
        const hasMemory = events.some(e => e.type === 'memory')
        const hasDoc = events.some(e => e.type === 'document')
        const hasTask = events.some(e => e.type === 'task')

        if (milestone.id === 'first-memory' && hasMemory) {
          events.push({
            id: milestone.id,
            date: now.toISOString(),
            title: milestone.title,
            description: milestone.description,
            type: 'milestone',
            icon: milestone.icon,
            isNew: true,
          })
        } else if (milestone.id === 'first-document' && hasDoc) {
          events.push({
            id: milestone.id,
            date: now.toISOString(),
            title: milestone.title,
            description: milestone.description,
            type: 'milestone',
            icon: milestone.icon,
            isNew: true,
          })
        } else if (milestone.id === 'first-task' && hasTask) {
          events.push({
            id: milestone.id,
            date: now.toISOString(),
            title: milestone.title,
            description: milestone.description,
            type: 'milestone',
            icon: milestone.icon,
            isNew: true,
          })
        }
      }
    })

    // Sort by date (newest first)
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Check if there are new updates
    const hasNew = events.some(e => e.isNew)
    if (hasNew !== hasNewUpdates) {
      setHasNewUpdates(hasNew)
    }

    // Update events, preserving isNew status for display
    setTimelineEvents(events.map(e => ({ ...e, isNew: false })))
  }, [dashboard, timelineEvents, hasNewUpdates, setTimelineEvents, setHasNewUpdates])

  const getTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'memory':
        return 'bg-foreground/5 border-foreground/20 text-foreground'
      case 'document':
        return 'bg-foreground/5 border-foreground/20 text-foreground'
      case 'task':
        return 'bg-foreground/5 border-foreground/20 text-foreground'
      case 'milestone':
        return 'bg-foreground/10 border-foreground/30 text-foreground'
      case 'account':
        return 'bg-foreground/5 border-foreground/20 text-foreground'
      case 'people':
        return 'bg-foreground/5 border-foreground/20 text-foreground'
      default:
        return 'bg-muted/50 border-border/60 text-muted-foreground'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                Life Timeline
              </h1>
              <p className="text-sm text-muted-foreground">
                Your estate planning journey over time
              </p>
            </div>
            {hasNewUpdates && (
              <Badge className="bg-foreground text-background">
                <Icon icon="solar:bell-bold-duotone" className="h-3 w-3 mr-1" />
                New Updates
              </Badge>
            )}
          </div>

          {timelineEvents.length === 0 ? (
            <Card className="border border-border/60">
              <CardContent className="py-12 text-center">
                <Icon icon="solar:history-bold-duotone" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">No timeline events yet</p>
                <p className="text-xs text-muted-foreground">
                  Start recording memories, uploading documents, or completing tasks to see your timeline
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/60" />
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-4"
                  >
                    <div className="relative z-10 flex-shrink-0">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-4 border-background transition-all",
                        event.type === 'milestone' ? "bg-foreground" : "bg-foreground/80"
                      )}>
                        <Icon icon={event.icon} className="h-5 w-5 text-background" />
                      </div>
                      {event.isNew && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground border-2 border-background animate-pulse" />
                      )}
                    </div>
                    <Card className={cn(
                      "flex-1 border transition-all",
                      event.isNew ? "ring-2 ring-foreground/20 border-foreground/40" : "border-border/60"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={cn("text-xs", getTypeColor(event.type))}>
                                {event.type}
                              </Badge>
                              {event.isNew && (
                                <Badge className="bg-foreground text-background text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {formatDate(event.date, 'MMM d, yyyy')}
                            </p>
                            <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


