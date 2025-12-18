'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { formatNumber } from '@/lib/utils/format'

interface ManagedClient {
  id: string
  name: string
  email: string
  status: 'active' | 'pending' | 'inactive'
  billingStatus: 'active' | 'past_due' | 'cancelled'
  lastPayment?: string
  nextBilling?: string
  plan?: string
  revenue: number
  joinedAt: string
}

export default function FinancialAdvisorDashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [managedClients] = useLocalStorage<ManagedClient[]>('financial-advisor-clients', [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      status: 'active',
      billingStatus: 'active',
      lastPayment: '2024-01-15',
      nextBilling: '2024-02-15',
      plan: 'Premium',
      revenue: 2500,
      joinedAt: '2023-06-01',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      status: 'active',
      billingStatus: 'active',
      lastPayment: '2024-01-10',
      nextBilling: '2024-02-10',
      plan: 'Standard',
      revenue: 1500,
      joinedAt: '2023-08-15',
    },
  ])

  const stats = {
    totalClients: managedClients.length,
    activeClients: managedClients.filter(c => c.status === 'active').length,
    monthlyRevenue: managedClients.reduce((sum, c) => sum + c.revenue, 0),
    completionRate: 85,
  }

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
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Financial Advisor Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage client portfolios, financial plans, and investment strategies
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => router.push('/financial-advisor/clients')}>
                  <Icon icon="solar:user-plus-bold" className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
                <Button onClick={() => router.push('/client/financial')}>
                  <Icon icon="solar:wallet-bold-duotone" className="h-4 w-4 mr-2" />
                  Financial Accounts
                </Button>
              </div>
            </div>

            {/* Stats Grid - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border border-border/40 hover:border-border/60 transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Clients</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalClients}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Active Clients</p>
                        <p className="text-2xl font-bold text-foreground">{stats.activeClients}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">of {stats.totalClients} total</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                        <Icon icon="solar:user-check-bold-duotone" className="h-6 w-6 text-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-foreground">R {formatNumber(stats.monthlyRevenue)}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Recurring revenue</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                        <Icon icon="solar:wallet-bold-duotone" className="h-6 w-6 text-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Completion Rate</p>
                        <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Client satisfaction</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                        <Icon icon="solar:check-circle-bold-duotone" className="h-6 w-6 text-foreground" />
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <Link href="/financial-advisor/clients">
              <Card className="border border-border/40 hover:border-border/60 cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
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

            <Link href="/shared/financial">
              <Card className="border border-border/60 hover:border-border hover:shadow-lg cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
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

            <Link href="/financial-advisor/plans">
              <Card className="border border-border/60 hover:border-border hover:shadow-lg cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Icon icon="solar:document-bold-duotone" className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Financial Plans</h3>
                      <p className="text-xs text-muted-foreground">Create and manage plans</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/financial-advisor/reports">
              <Card className="border border-border/60 hover:border-border hover:shadow-lg cursor-pointer transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
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
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>6-month revenue overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={(() => {
                    const last6Months = Array.from({ length: 6 }, (_, i) => {
                      const date = new Date()
                      date.setMonth(date.getMonth() - (5 - i))
                      return {
                        month: date.toLocaleDateString('en-US', { month: 'short' }),
                        revenue: stats.monthlyRevenue * (0.9 + (i * 0.02)),
                      }
                    })
                    return last6Months
                  })()}>
                    <defs>
                      <linearGradient id="colorRevenueFA" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#colorRevenueFA)" 
                      dot={false}
                      activeDot={{ r: 5, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Client Status Distribution */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle>Client Status</CardTitle>
                <CardDescription>Distribution by status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={(() => {
                        const active = managedClients.filter(c => c.status === 'active').length
                        const pending = managedClients.filter(c => c.status === 'pending').length
                        const inactive = managedClients.filter(c => c.status === 'inactive').length
                        return [
                          { name: 'Active', value: active },
                          { name: 'Pending', value: pending },
                          { name: 'Inactive', value: inactive },
                        ].filter(item => item.value > 0)
                      })()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {['#000000', '#2A2A2A', '#4A4A4A'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Clients */}
          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Latest client activity and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {managedClients.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/40">
                        <Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={client.status === 'active' ? 'default' : 'outline'}>
                        {client.status}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">R {formatNumber(client.revenue)}</span>
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
