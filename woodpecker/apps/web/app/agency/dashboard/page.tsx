'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@woodpecker/utils'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { formatNumber } from '@/lib/utils/format'

export default function AgencyDashboardPage() {
  const router = useRouter()

  const stats = {
    activeClients: 24,
    teamMembers: 8,
    activeCases: 156,
    documents: 342,
    revenue: 125000,
    completionRate: 78,
  }

  // Generate revenue trend data
  const revenueData = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: stats.revenue * (0.85 + (i * 0.025)),
        clients: stats.activeClients + Math.floor(Math.random() * 3),
      }
    })
  }, [stats.revenue, stats.activeClients])

  // Client status distribution
  const clientStatusData = React.useMemo(() => {
    return [
      { name: 'Active', value: stats.activeClients, color: '#000000' },
      { name: 'Pending', value: 6, color: '#2A2A2A' },
      { name: 'Inactive', value: 3, color: '#4A4A4A' },
    ]
  }, [stats.activeClients])

  return (
    <div className="flex h-screen bg-background relative z-10">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto relative z-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Agency Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your estate planning agency, team, and clients
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => router.push('/agency/clients')}>
                  <Icon icon="solar:user-plus-bold" className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
                <Button onClick={() => router.push('/agency/lawyers')}>
                  <Icon icon="solar:users-group-two-rounded-bold" className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
              </div>
            </div>

            {/* Stats Grid - Enhanced */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <Card className="border border-border/60 hover:border-border/80 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Active Clients</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activeClients}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Team Members</p>
                      <p className="text-2xl font-bold text-foreground">{stats.teamMembers}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:users-group-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Active Cases</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activeCases}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:briefcase-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Documents</p>
                      <p className="text-2xl font-bold text-foreground">{stats.documents}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:document-text-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Revenue</p>
                      <p className="text-2xl font-bold text-foreground">R {formatNumber(stats.revenue)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Completion</p>
                      <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:check-circle-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Trend */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Icon icon="solar:graph-up-bold-duotone" className="h-4 w-4" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>6-month revenue overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#000000" stopOpacity={0.95}/>
                          <stop offset="50%" stopColor="#000000" stopOpacity={0.5}/>
                          <stop offset="100%" stopColor="#000000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11, fill: '#666' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#666' }}
                        tickFormatter={(value) => {
                          if (value >= 100000) return `R${(value / 1000).toFixed(0)}k`
                          return `R${value.toFixed(0)}`
                        }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                <p className="text-sm font-semibold text-foreground mb-1">
                                  {payload[0].payload.month}
                                </p>
                                <p className="text-xs font-medium text-foreground">
                                  Revenue: R {payload[0].value ? formatNumber(payload[0].value) : '0'}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000000" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        dot={false}
                        activeDot={{ r: 5, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Client Status Distribution */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Icon icon="solar:pie-chart-2-bold-duotone" className="h-4 w-4" />
                  Client Status
                </CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clientStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                                <p className="text-sm font-semibold text-foreground mb-1">
                                  {payload[0].name}
                                </p>
                                <p className="text-xs font-medium text-foreground">
                                  {payload[0].value} clients
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Link href="/agency/clients">
              <Card className="border border-border/60 hover:border-border/80 cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Manage Clients</h3>
                      <p className="text-xs text-muted-foreground">View and manage all clients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agency/lawyers">
              <Card className="border border-border/60 hover:border-border/80 cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:user-speak-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Team Management</h3>
                      <p className="text-xs text-muted-foreground">Manage your team members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/shared/financial">
              <Card className="border border-border/60 hover:border-border/80 cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Financial Accounts</h3>
                      <p className="text-xs text-muted-foreground">Manage financial accounts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agency/reports">
              <Card className="border border-border/60 hover:border-border/80 cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:chart-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Reports & Analytics</h3>
                      <p className="text-xs text-muted-foreground">View agency reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across your agency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'client', text: 'New client added: John Doe', time: '2 hours ago' },
                  { type: 'document', text: 'Will document completed for Sarah Johnson', time: '5 hours ago' },
                  { type: 'team', text: 'New team member joined: Michael Chen', time: '1 day ago' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon 
                        icon={
                          activity.type === 'client' ? 'solar:user-plus-bold' :
                          activity.type === 'document' ? 'solar:document-text-bold' :
                          'solar:users-group-rounded-bold'
                        } 
                        className="h-5 w-5 text-foreground" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
