'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import Link from 'next/link'

// Mock data - replace with database
const mockLegacyData = {
  client: {
    id: '1',
    name: 'Sarah Johnson',
    age: 65,
    birthday: '1959-03-15',
    weight: '72 kgs',
    height: '165 cm',
    gender: 'Female',
    guardian: 'John Johnson',
    avatar: null,
  },
  allergies: [
    {
      id: '1',
      name: 'Penicillin',
      details: 'Hives',
      severity: 'moderate',
    },
    {
      id: '2',
      name: 'Codeine',
      details: 'Shortness of Breath',
      severity: 'moderate',
    },
    {
      id: '3',
      name: 'Bee Stings',
      details: 'Anaphylactic Shock',
      severity: 'severe',
    },
  ],
  history: [
    {
      id: '1',
      type: 'checkup',
      title: 'Asthma Check-Up',
      doctor: 'Dr. Henry Seven',
      location: 'Community Hospital, 40 Bernard St, London WC1N 1LE, United Kingdom',
      date: '2014-08-26',
      description: 'Routine check-up',
    },
    {
      id: '2',
      type: 'surgery',
      title: 'Gall Bladder Surgery',
      doctor: 'Dr. Bala Venktaraman',
      location: 'Ashby Medical Center, 56 Bernard St, London WC1N 1LE, United Kingdom',
      date: '2014-03-01',
      description: 'Laparoscopic cholecystectomy',
    },
    {
      id: '3',
      type: 'vaccination',
      title: 'Influenza Virus Vaccine',
      doctor: 'Dr. Smith',
      location: 'Ashby Medical Center, 56 Bernard St, London WC1N 1LE, United Kingdom',
      date: '2014-02-15',
      description: 'Intramuscular Injection',
    },
    {
      id: '4',
      type: 'surgery',
      title: 'Laparoscopic Cholecystectomy',
      doctor: 'Dr. Bala Venktaraman',
      location: 'Ashby Medical Center, 56 Bernard St, London WC1N 1LE, United Kingdom',
      date: '2013-12-17',
      description: 'Surgical procedure',
    },
  ],
}

export default function ClientLegacyPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.clientId as string
  const [timeRange, setTimeRange] = React.useState('1Y')
  const [filterType, setFilterType] = React.useState<'all' | 'date' | 'condition' | 'type'>('all')
  const [startDate, setStartDate] = React.useState('2012-01-13')
  const [endDate, setEndDate] = React.useState('2014-01-13')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'solar:stethoscope-bold-duotone'
      case 'surgery':
        return 'solar:scalpel-bold-duotone'
      case 'vaccination':
        return 'solar:syringe-bold-duotone'
      default:
        return 'solar:document-text-bold-duotone'
    }
  }

  const getHistoryColor = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'bg-foreground/5 text-foreground border border-border/60'
      case 'surgery':
        return 'bg-foreground/5 text-foreground border border-border/60'
      case 'vaccination':
        return 'bg-foreground/5 text-foreground border border-border/60'
      default:
        return 'bg-muted text-foreground'
    }
  }

  // Group history by year
  const groupedHistory = React.useMemo(() => {
    const grouped: Record<string, typeof mockLegacyData.history> = {}
    mockLegacyData.history.forEach(entry => {
      const year = new Date(entry.date).getFullYear().toString()
      if (!grouped[year]) grouped[year] = []
      grouped[year].push(entry)
    })
    return grouped
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex h-full">
          {/* Left Sidebar - Patient Profile - Matching Handle My Health Design */}
          <div className="w-80 border-r border-border/40 bg-muted/20 p-6 overflow-y-auto">
            {/* Patient Photo */}
            <div className="mb-6">
              <Avatar className="h-32 w-32 mx-auto border-4 border-border/40">
                <AvatarFallback className="bg-foreground/10 text-foreground text-4xl font-bold">
                  {mockLegacyData.client.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Patient Information */}
            <div className="space-y-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {mockLegacyData.client.name}
                </h2>
                <Link href={`/lawyer/clients/${clientId}`} className="text-sm text-muted-foreground hover:text-foreground">
                  (View all)
                </Link>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium text-foreground">{mockLegacyData.client.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Birthday:</span>
                  <span className="font-medium text-foreground">
                    {new Date(mockLegacyData.client.birthday).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="font-medium text-foreground">{mockLegacyData.client.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height:</span>
                  <span className="font-medium text-foreground">{mockLegacyData.client.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium text-foreground">{mockLegacyData.client.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guardian:</span>
                  <span className="font-medium text-foreground">{mockLegacyData.client.guardian}</span>
                </div>
              </div>
            </div>

            {/* Allergies Section - Matching Handle My Health Design */}
            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Allergies</h3>
                <Link href={`/lawyer/clients/${clientId}/allergies`} className="text-xs text-muted-foreground hover:text-foreground">
                  (View all)
                </Link>
              </div>
              <div className="space-y-4">
                {mockLegacyData.allergies.map((allergy) => (
                  <div key={allergy.id} className="space-y-2">
                    <div className="font-medium text-foreground">{allergy.name}</div>
                    <div className="text-sm text-muted-foreground">{allergy.details}</div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-2 w-2 rounded-full',
                            allergy.severity === 'severe' || i < 3 ? 'bg-foreground' : 'bg-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">(Moderate to severe)</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area - Matching Handle My Health Timeline Design */}
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-5xl mx-auto p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-foreground">History</h1>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterType('date')}
                      className={cn(filterType === 'date' && 'bg-foreground text-background')}
                    >
                      By Date
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterType('condition')}
                      className={cn(filterType === 'condition' && 'bg-foreground text-background')}
                    >
                      By Condition
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterType('type')}
                      className={cn(filterType === 'type' && 'bg-foreground text-background')}
                    >
                      By Type
                    </Button>
                  </div>
                </div>

                {/* Time Range Selection - Matching Handle My Health */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {['1w', '3M', '6M', '1Y'].map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeRange(range)}
                        className="text-xs"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Icon icon="solar:calendar-bold" className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-40 pl-8 text-xs"
                      />
                    </div>
                    <span className="text-muted-foreground text-sm">to</span>
                    <div className="relative">
                      <Icon icon="solar:calendar-bold" className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-40 pl-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Visualization Bar */}
              <div className="mb-6 h-4 bg-muted/50 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                    <div key={month} className="flex-1 text-center text-xs text-muted-foreground">
                      {idx % 3 === 0 && month}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline - Grouped by Year */}
              <div className="space-y-8">
                {Object.entries(groupedHistory)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([year, entries]) => (
                    <div key={year}>
                      {/* Year Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-lg font-bold text-foreground">{year}</div>
                        <div className="flex-1 h-px bg-border/40" />
                      </div>

                      {/* Annual Progress Report - Purple Bar */}
                      <Card className="mb-4 border-border/60 bg-foreground/5">
                        <CardContent className="p-4">
                          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-foreground/5">
                            View annual progress report
                          </Button>
                        </CardContent>
                      </Card>

                      {/* History Entries - Grouped by Month */}
                      {Object.entries(
                        entries.reduce((acc, entry) => {
                          const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })
                          if (!acc[month]) acc[month] = []
                          acc[month].push(entry)
                          return acc
                        }, {} as Record<string, typeof entries>)
                      )
                        .sort(([a], [b]) => {
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                          return months.indexOf(b) - months.indexOf(a)
                        })
                        .map(([month, monthEntries]) => (
                          <div key={month} className="mb-6">
                            {/* Month Label */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-sm font-semibold text-foreground">{month}</div>
                              <div className="flex-1 h-px bg-border/30" />
                            </div>

                            {/* Month Entries */}
                            {monthEntries
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((entry) => (
                                <motion.div
                                  key={entry.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="mb-4"
                                >
                                  <Card className="border border-border/40 hover:border-border/60 transition-all">
                                    <CardContent className="p-4">
                                      <div className="flex items-start gap-4">
                                        <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0', getHistoryColor(entry.type))}>
                                          <Icon icon={getHistoryIcon(entry.type)} className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-foreground">{entry.title}</h3>
                                            <Badge variant="outline" className={cn('text-xs', getHistoryColor(entry.type))}>
                                              {entry.type}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-1">
                                            with {entry.doctor} at {entry.location}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatDate(entry.date)}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
