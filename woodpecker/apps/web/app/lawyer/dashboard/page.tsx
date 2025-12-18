'use client'

import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { PageIntro } from '@/components/onboarding/PageIntro'
import { Icon } from '@iconify/react'
// ErrorBoundary removed - using React error boundaries instead
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { LawyerStatsCardManager } from '@/components/lawyer/LawyerStatsCardManager'
import { Progress } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts'
import Link from 'next/link'
import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { useTeamMembers } from '@/lib/hooks/use-team-members'
import { useApi } from '@/lib/hooks/use-api'
import { useToast } from '@/lib/hooks'
import { motion } from 'framer-motion'

// Client Completion Chart
const ClientCompletionChart = React.memo(function ClientCompletionChart({ clients }: { clients: any[] }) {
  const chartData = React.useMemo(() => {
    return clients.map(client => ({
      name: client.name.split(' ')[0], // First name only
      completion: client.completion,
      legacies: client.legacies,
    }))
  }, [clients])

  const COLORS = ['#000000', '#404040', '#808080', '#C0C0C0']

  return (
    <Card className="border border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon icon="solar:chart-bold-duotone" className="h-4 w-4" />
          Client Completion Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity={0.95}/>
                  <stop offset="50%" stopColor="#000000" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#666' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#666' }}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border/60 rounded-lg p-3 shadow-xl">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-xs font-medium text-foreground">
                          Completion: {payload[0].value}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Legacies: {payload[0].payload.legacies}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="completion" 
                stroke="#000000" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorCompletion)" 
                dot={false}
                activeDot={{ r: 5, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

// Task Priority Distribution
const TaskPriorityChart = React.memo(function TaskPriorityChart({ tasks }: { tasks: any[] }) {
  const chartData = React.useMemo(() => {
    const high = tasks.filter(t => t.priority === 'high').length
    const medium = tasks.filter(t => t.priority === 'medium').length
    const low = tasks.filter(t => t.priority === 'low').length

    return [
      { name: 'High', value: high, percentage: ((high / tasks.length) * 100).toFixed(1) },
      { name: 'Medium', value: medium, percentage: ((medium / tasks.length) * 100).toFixed(1) },
      { name: 'Low', value: low, percentage: ((low / tasks.length) * 100).toFixed(1) },
    ].filter(item => item.value > 0)
  }, [tasks])

  const COLORS = ['#000000', '#404040', '#808080']

  return (
    <Card className="border border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon icon="solar:pie-chart-2-bold-duotone" className="h-4 w-4" />
          Task Priority Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                        <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].value} tasks ({payload[0].payload?.percentage}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})

export default function LawyerDashboardPage() {
  const [clients] = useLocalStorage('lawyer-clients', [
    { id: '1', name: 'John Doe', legacies: 1, completion: 85, status: 'active', lastActivity: '2h ago' },
    { id: '2', name: 'Jane Smith', legacies: 2, completion: 60, status: 'active', lastActivity: '1d ago' },
    { id: '3', name: 'Robert Johnson', legacies: 1, completion: 45, status: 'pending', lastActivity: '3d ago' },
  ])

  const [tasks] = useLocalStorage('lawyer-tasks', [
    { id: '1', client: 'John Doe', title: 'Review Last Will', priority: 'high', dueDate: '2024-01-20' },
    { id: '2', client: 'Jane Smith', title: 'Update Trust Document', priority: 'medium', dueDate: '2024-01-22' },
    { id: '3', client: 'Robert Johnson', title: 'Complete Estate Planning', priority: 'high', dueDate: '2024-01-18' },
  ])

  const { getTeamMembers } = useTeamMembers()
  const { fetch: fetchApi } = useApi()
  const [teamMembers, setTeamMembers] = React.useState<any[]>([])

  React.useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await getTeamMembers()
        setTeamMembers(members)
      } catch (error) {
        console.error('Error loading team members:', error)
      }
    }
    loadTeamMembers()
  }, [getTeamMembers])

  const activeClients = clients.filter((c: any) => c.status === 'active').length
  const highPriorityTasks = tasks.filter((t: any) => t.priority === 'high').length
  const avgCompletion = Math.round(clients.reduce((sum: number, c: any) => sum + c.completion, 0) / clients.length)

  // Calculate additional metrics
  const totalLegacies = clients.reduce((sum: number, c: any) => sum + c.legacies, 0)
  const pendingClients = clients.filter((c: any) => c.status === 'pending').length
  const recentActivity = clients.filter((c: any) => {
    const activity = c.lastActivity || ''
    return activity.includes('h ago') || activity.includes('m ago')
  }).length

  return (
    <PageIntro pageId="lawyer-dashboard" pageName="LAWYER DASHBOARD">
        <div className="flex h-screen bg-background relative z-10">
          <RoleBasedSidebar />
          <main className="flex-1 overflow-y-auto relative z-10 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex items-center justify-between"
              >
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1.5">
                    Lawyer Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your clients and their estate planning
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => window.location.href = '/lawyer/clients'}>
                    <Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                  <Button onClick={() => window.location.href = '/lawyer/meetings'}>
                    <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </motion.div>

              {/* Stats Grid - Enhanced Design with Animations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                          <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Total Clients</p>
                          <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{activeClients} active</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/40">
                        <Link href="/lawyer/clients" className="text-xs text-foreground hover:underline flex items-center gap-1">
                          View all <Icon icon="solar:arrow-right-bold" className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                          <Icon icon="solar:checklist-bold-duotone" className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Active Tasks</p>
                          <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{highPriorityTasks} high priority</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/40">
                        <Link href="/tasks" className="text-xs text-foreground hover:underline flex items-center gap-1">
                          View Kanban <Icon icon="solar:arrow-right-bold" className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                          <Icon icon="solar:danger-triangle-bold-duotone" className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground mb-1">High Priority</p>
                          <p className="text-2xl font-bold text-foreground">{highPriorityTasks}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Urgent tasks</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/40">
                        <Link href="/tasks" className="text-xs text-foreground hover:underline flex items-center gap-1">
                          View tasks <Icon icon="solar:arrow-right-bold" className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                          <Icon icon="solar:star-bold-duotone" className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Avg Completion</p>
                          <p className="text-2xl font-bold text-foreground">{avgCompletion}%</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Across all clients</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/40">
                        <Progress value={avgCompletion} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {teamMembers.length > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                            <Icon icon="solar:users-group-rounded-bold-duotone" className="h-6 w-6 text-foreground" />
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Team Members</p>
                            <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Active team</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/40">
                          <Link href="/lawyer/team" className="text-xs text-foreground hover:underline flex items-center gap-1">
                            Manage team <Icon icon="solar:arrow-right-bold" className="h-3 w-3" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>

              {/* Charts Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tabs defaultValue="overview" className="mb-6">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                      <Icon icon="solar:chart-bold-duotone" className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="data-[state=active]:bg-background">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-4 w-4 mr-2" />
                      Clients
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-background">
                      <Icon icon="solar:checklist-bold-duotone" className="h-4 w-4 mr-2" />
                      Tasks
                    </TabsTrigger>
                  </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ClientCompletionChart clients={clients} />
                    <TaskPriorityChart tasks={tasks} />
                  </div>
                </TabsContent>

                <TabsContent value="clients" className="space-y-6">
                  <ClientCompletionChart clients={clients} />
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                  <TaskPriorityChart tasks={tasks} />
                </TabsContent>
              </Tabs>
              </motion.div>

              {/* Professional Stats Cards */}
              <div className="mb-6">
                <LawyerStatsCardManager />
              </div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Clients List */}
                <Card className="border border-border/60">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Recent Clients</CardTitle>
                      <Link href="/lawyer/clients">
                        <Button variant="ghost" size="sm" className="text-xs hover:bg-muted/60">
                          View all
                          <Icon icon="solar:arrow-right-bold" className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {clients.slice(0, 4).map((client: any) => (
                        <Link key={client.id} href={`/lawyer/clients/${client.id}/legacy`}>
                          <div className="flex items-center justify-between p-3 rounded-sm border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground mb-1 truncate">
                                {client.name}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className="text-xs text-muted-foreground">
                                  {client.legacies} legacy{client.legacies !== 1 ? 'ies' : ''}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {client.completion}% complete
                                </span>
                              </div>
                              <Progress value={client.completion} className="h-1.5" />
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                              <Badge 
                                variant={client.status === 'active' ? 'default' : 'secondary'} 
                                className="text-[11px] font-medium"
                              >
                                {client.status}
                              </Badge>
                              <Icon icon="solar:arrow-right-bold" className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks */}
                <Card className="border border-border">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
                      <Link href="/lawyer/tasks">
                        <Button variant="ghost" size="sm" className="text-xs hover:bg-muted/60">
                          View Kanban
                          <Icon icon="solar:arrow-right-bold" className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tasks.slice(0, 4).map((task: any) => (
                        <div 
                          key={task.id} 
                          className="flex items-start gap-3 p-3 rounded-sm border border-border hover:bg-muted/50 transition-colors group"
                        >
                          <div className={cn(
                            'h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0',
                            task.priority === 'high' ? 'bg-foreground' : 
                            task.priority === 'medium' ? 'bg-foreground/60' : 'bg-foreground/30'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground mb-1">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground">{task.client}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">Due {task.dueDate}</span>
                            </div>
                          </div>
                          <Badge 
                            variant={task.priority === 'high' ? 'default' : 'secondary'} 
                            className="text-[11px] font-medium flex-shrink-0"
                          >
                            {task.priority}
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
      </PageIntro>
  )
}
