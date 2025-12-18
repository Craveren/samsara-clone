'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

export default function EstatePlannerDashboardPage() {
  const router = useRouter()

  const stats = {
    activeClients: 18,
    completedPlans: 142,
    pendingTasks: 24,
    monthlyRevenue: 95000,
    completionRate: 82,
    clientSatisfaction: 94,
  }

  // Generate revenue trend data
  const revenueData = React.useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: stats.monthlyRevenue * (0.88 + (i * 0.02)),
        plans: stats.completedPlans + Math.floor(i * 2.5),
      }
    })
  }, [stats.monthlyRevenue, stats.completedPlans])

  // Client status distribution
  const clientStatusData = React.useMemo(() => {
    return [
      { name: 'Active Plans', value: stats.activeClients, color: '#000000' },
      { name: 'In Progress', value: 8, color: '#2A2A2A' },
      { name: 'Review', value: 4, color: '#4A4A4A' },
    ]
  }, [stats.activeClients])

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Estate Planner Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage estate plans, client relationships, and planning workflows
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="outline" onClick={() => router.push('/estate-planner/clients')}>
                  <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
                <Button onClick={() => router.push('/estate-planner/plans')}>
                  <Icon icon="solar:document-add-bold-duotone" className="h-4 w-4 mr-2" />
                  New Plan
                </Button>
              </div>
            </div>

            {/* Stats Grid - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border border-border/60 hover:border-border/80 transition-all bg-gradient-to-br from-background to-foreground/5 cursor-pointer">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Active Clients</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.activeClients}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Completed Plans</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.completedPlans}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:check-circle-bold-duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pending Tasks</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.pendingTasks}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:checklist-bold-duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Revenue</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">R {stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:wallet-bold-duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Completion Rate</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:graph-up-bold-duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 hover:border-border/80 transition-all bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Satisfaction</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.clientSatisfaction}%</p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:heart-pulse-bold-duotone" className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <Link href="/estate-planner/clients">
              <Card className="border border-border/60 hover:border-border cursor-pointer transition-all h-full bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5 sm:p-6">
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

            <Link href="/estate-planner/plans">
              <Card className="border border-border/60 hover:border-border cursor-pointer transition-all h-full bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:document-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Estate Plans</h3>
                      <p className="text-xs text-muted-foreground">Create and manage plans</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/estate-planner/templates">
              <Card className="border border-border/60 hover:border-border cursor-pointer transition-all h-full bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:document-text-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Templates</h3>
                      <p className="text-xs text-muted-foreground">Browse plan templates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/estate-planner/reports">
              <Card className="border border-border/60 hover:border-border cursor-pointer transition-all h-full bg-gradient-to-br from-background to-foreground/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/60">
                      <Icon icon="solar:chart-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Reports & Analytics</h3>
                      <p className="text-xs text-muted-foreground">View detailed reports</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          >
            {/* Revenue Trend */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
                <CardDescription>6-month revenue overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenueEP" x1="0" y1="0" x2="0" y2="1">
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
                      tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
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
                                Revenue: R {payload[0].value?.toLocaleString('en-ZA')}
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
                      fill="url(#colorRevenueEP)" 
                      dot={false}
                      activeDot={{ r: 5, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Plan Status Distribution */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Plan Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border border-border/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <CardDescription>Latest client activity and plan updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/60">
                        <Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Client Plan Updated</p>
                        <p className="text-xs text-muted-foreground">Estate plan for client #{i} was updated</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {i === 1 ? 'Today' : `${i} days ago`}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

