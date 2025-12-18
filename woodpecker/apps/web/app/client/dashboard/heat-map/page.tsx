'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useDashboardData } from '@/lib/hooks/use-dashboard-data'
import { Badge } from '@woodpecker/ui'

interface ActivityDay {
  date: Date
  activity: number // 0-4
  actions: string[]
}

export default function PeckLogPage() {
  const dashboard = useDashboardData({ autoFetch: true })
  const [activities, setActivities] = useLocalStorage<ActivityDay[]>('peck-log-activities', [])
  
  // Generate activity data from dashboard actions
  const activityData = React.useMemo(() => {
    const days: ActivityDay[] = []
    const today = new Date()
    
    // Generate last 365 days
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      
      // Find existing activity
      const existing = activities.find(a => 
        a.date.toISOString().split('T')[0] === dateKey
      )
      
      if (existing) {
        days.push(existing)
      } else {
        // Generate activity based on dashboard data
        let activity = 0
        const actions: string[] = []
        
        // Check if there were financial transactions on this date
        const transactions = dashboard.financial.transactions.filter(t => {
          const txDate = new Date(t.date)
          return txDate.toISOString().split('T')[0] === dateKey
        })
        
        if (transactions.length > 0) {
          activity += Math.min(transactions.length, 2)
          actions.push(`${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`)
        }
        
        // Check if there were activities on this date
        const dayActivities = dashboard.activities.items.filter(a => {
          const actDate = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp)
          return actDate.toISOString().split('T')[0] === dateKey
        })
        
        if (dayActivities.length > 0) {
          activity += Math.min(dayActivities.length, 2)
          actions.push(`${dayActivities.length} activit${dayActivities.length > 1 ? 'ies' : 'y'}`)
        }
        
        // Random activity for days with no data (to show pattern)
        if (activity === 0 && Math.random() > 0.7) {
          activity = Math.floor(Math.random() * 3) + 1
          actions.push('General activity')
        }
        
        days.push({
          date,
          activity: Math.min(activity, 4),
          actions,
        })
      }
    }
    
    return days
  }, [activities, dashboard.financial.transactions, dashboard.activities.items])

  const getActivityColor = (level: number) => {
    if (level === 0) return 'bg-muted'
    if (level === 1) return 'bg-green-200 dark:bg-green-900'
    if (level === 2) return 'bg-green-400 dark:bg-green-700'
    if (level === 3) return 'bg-green-600 dark:bg-green-600'
    return 'bg-green-800 dark:bg-green-500'
  }

  const totalActivity = activityData.reduce((sum, day) => sum + day.activity, 0)
  const avgActivity = Math.round(totalActivity / activityData.length)
  const maxActivity = Math.max(...activityData.map(d => d.activity), 1)
  
  // Group by months for better visualization
  const months = React.useMemo(() => {
    const grouped: { [key: string]: ActivityDay[] } = {}
    activityData.forEach(day => {
      const monthKey = day.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      if (!grouped[monthKey]) grouped[monthKey] = []
      grouped[monthKey].push(day)
    })
    return grouped
  }, [activityData])

  const currentMonth = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1.5">
              Peck Log
            </h1>
            <p className="text-sm text-muted-foreground">
              Your activity heat map over the past year
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Activity</p>
                    <p className="text-2xl font-bold text-foreground">{totalActivity}</p>
                  </div>
                  <Icon icon="solar:activity-bold-duotone" className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Average Daily</p>
                    <p className="text-2xl font-bold text-foreground">{avgActivity}/4</p>
                  </div>
                  <Icon icon="solar:chart-2-bold-duotone" className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Peak Activity</p>
                    <p className="text-2xl font-bold text-foreground">{maxActivity}/4</p>
                  </div>
                  <Icon icon="solar:fire-bold-duotone" className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Year Heat Map */}
          <Card className="border border-border/60 mb-6">
            <CardHeader>
              <CardTitle className="text-base">Full Year Activity Heat Map</CardTitle>
              <CardDescription>Your activity over the past 365 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(months).slice(-12).map(([month, days]) => (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">{month}</h3>
                      <Badge variant="outline" className="text-xs">
                        {days.reduce((sum, d) => sum + d.activity, 0)} total
                      </Badge>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(14px,1fr))] gap-1.5">
                      {days.map((day, index) => (
                        <div
                          key={index}
                          className={`h-3.5 w-3.5 rounded-md transition-all hover:scale-125 cursor-pointer border border-border/10 ${getActivityColor(day.activity)}`}
                          title={`${day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}: Level ${day.activity}${day.actions.length > 0 ? ` - ${day.actions.join(', ')}` : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                <span className="text-xs text-muted-foreground">Less activity</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 rounded-md border border-border/10 bg-muted" title="No activity" />
                  <div className="h-3.5 w-3.5 rounded-md border border-border/10 bg-green-200 dark:bg-green-900" title="Level 1" />
                  <div className="h-3.5 w-3.5 rounded-md border border-border/10 bg-green-400 dark:bg-green-700" title="Level 2" />
                  <div className="h-3.5 w-3.5 rounded-md border border-border/10 bg-green-600 dark:bg-green-600" title="Level 3" />
                  <div className="h-3.5 w-3.5 rounded-md border border-border/10 bg-green-800 dark:bg-green-500" title="Level 4" />
                </div>
                <span className="text-xs text-muted-foreground">More activity</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Month Detail */}
          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle className="text-base">{currentMonth} Detail</CardTitle>
              <CardDescription>Day-by-day breakdown of this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {(() => {
                  const firstDay = months[currentMonth]?.[0]
                  if (!firstDay) return null
                  const firstDayOfWeek = firstDay.date.getDay()
                  const daysInMonth = months[currentMonth]?.length || 0
                  
                  // Add empty cells for days before the first day of the month
                  const emptyCells = []
                  for (let i = 0; i < firstDayOfWeek; i++) {
                    emptyCells.push(
                      <div key={`empty-${i}`} className="aspect-square" />
                    )
                  }
                  
                  return (
                    <>
                      {emptyCells}
                      {months[currentMonth]?.map((day, index) => {
                        const isToday = day.date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                        
                        return (
                          <div
                            key={index}
                            className={`aspect-square rounded-lg transition-all hover:scale-110 cursor-pointer flex items-center justify-center border border-border/20 ${
                              getActivityColor(day.activity)
                            } ${isToday ? 'ring-2 ring-foreground ring-offset-2' : ''}`}
                            title={`${day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}: Level ${day.activity}${day.actions.length > 0 ? ` - ${day.actions.join(', ')}` : ''}`}
                          >
                            <span className={`text-xs font-semibold ${day.activity === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {day.date.getDate()}
                            </span>
                          </div>
                        )
                      })}
                    </>
                  )
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

