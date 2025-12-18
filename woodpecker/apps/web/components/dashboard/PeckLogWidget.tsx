'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

interface ActivityDay {
  date: Date
  activity: number // 0-4
}

export function PeckLogWidget() {
  const router = useRouter()
  const [activities, setActivities] = useLocalStorage<ActivityDay[]>('peck-log-activities', [])

  // Generate last 7 days of activity
  const last7Days = React.useMemo(() => {
    const days: ActivityDay[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      
      // Find existing activity or generate random
      const existing = activities.find(a => a.date.toISOString().split('T')[0] === dateKey)
      days.push(existing || {
        date,
        activity: Math.floor(Math.random() * 5),
      })
    }
    return days
  }, [activities])

  const getActivityColor = (level: number) => {
    if (level === 0) return 'bg-muted'
    if (level === 1) return 'bg-green-200 dark:bg-green-900'
    if (level === 2) return 'bg-green-400 dark:bg-green-700'
    if (level === 3) return 'bg-green-600 dark:bg-green-600'
    return 'bg-green-800 dark:bg-green-500'
  }

  const totalActivity = last7Days.reduce((sum, day) => sum + day.activity, 0)
  const avgActivity = Math.round(totalActivity / 7)

  return (
    <Card 
      className="border border-border/60 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push('/client/dashboard/heat-map')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Peck Log</CardTitle>
            <CardDescription className="text-xs">Your 7-day activity</CardDescription>
          </div>
          <Icon icon="solar:calendar-bold-duotone" className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            {last7Days.map((day, index) => (
              <div
                key={index}
                className={`flex-1 h-8 rounded ${getActivityColor(day.activity)} transition-all hover:scale-110`}
                title={`${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: Level ${day.activity}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
            <span>Avg: {avgActivity}/4</span>
            <span className="flex items-center gap-1">
              View full log
              <Icon icon="solar:arrow-right-bold" className="h-3 w-3" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


