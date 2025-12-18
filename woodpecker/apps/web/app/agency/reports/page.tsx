'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { 
  FileText, 
  Download,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { formatDate } from '@woodpecker/utils'
import { Icon } from '@iconify/react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

export default function AgencyReportsPage() {
  const [reports] = useLocalStorage('agency-reports', [
    {
      id: '1',
      name: 'Monthly Client Report',
      type: 'client',
      period: 'January 2024',
      generatedAt: '2024-01-31',
      size: 2457600,
    },
    {
      id: '2',
      name: 'Lawyer Performance Report',
      type: 'lawyer',
      period: 'Q4 2023',
      generatedAt: '2024-01-15',
      size: 1894400,
    },
  ])

  const stats = {
    totalClients: 45,
    activeLawyers: 12,
    totalLegacies: 78,
    monthlyRevenue: 125000,
    growthRate: 15.5,
    avgResponseTime: '2.5h',
    completionRate: 78,
    clientSatisfaction: 4.8,
  }

  // Enhanced chart data
  const revenueData = [
    { month: 'Jan', revenue: 95000, clients: 38 },
    { month: 'Feb', revenue: 105000, clients: 42 },
    { month: 'Mar', revenue: 115000, clients: 40 },
    { month: 'Apr', revenue: 125000, clients: 45 },
    { month: 'May', revenue: 118000, clients: 43 },
    { month: 'Jun', revenue: 135000, clients: 48 },
  ]

  const lawyerPerformance = [
    { name: 'Sarah Johnson', clients: 12, legacies: 18, completion: 92, revenue: 45000 },
    { name: 'Michael Chen', clients: 8, legacies: 10, completion: 85, revenue: 32000 },
    { name: 'David Williams', clients: 15, legacies: 22, completion: 88, revenue: 58000 },
    { name: 'Emily Davis', clients: 10, legacies: 14, completion: 90, revenue: 38000 },
  ]

  const legacyDistribution = [
    { name: 'Wills', value: 32, color: '#000000' },
    { name: 'Trusts', value: 24, color: '#404040' },
    { name: 'Powers of Attorney', value: 15, color: '#808080' },
    { name: 'Living Wills', value: 7, color: '#C0C0C0' },
  ]

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Reports & Analytics
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into your agency's performance, client activity, and lawyer productivity
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-border/60">
                  <Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 mr-2" />
                  Filter Period
                </Button>
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Stats - Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Users className="h-6 w-6 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs border-border/60">+12%</Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Total Clients</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalClients}</p>
                  <p className="text-xs text-muted-foreground mt-2">Active across all matters</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <Briefcase className="h-6 w-6 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs border-border/60">Active</Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Active Lawyers</p>
                  <p className="text-3xl font-bold text-foreground">{stats.activeLawyers}</p>
                  <p className="text-xs text-muted-foreground mt-2">Managing client portfolios</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <DollarSign className="h-6 w-6 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs border-border/60">+{stats.growthRate}%</Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-foreground">
                    R{(stats.monthlyRevenue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Current month total</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/40">
                      <TrendingUp className="h-6 w-6 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs border-border/60">{stats.completionRate}%</Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-foreground">{stats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-2">Average across all matters</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                <Icon icon="solar:chart-bold-duotone" className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-background">
                <Icon icon="solar:wallet-bold-duotone" className="h-4 w-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="lawyers" className="data-[state=active]:bg-background">
                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-4 w-4 mr-2" />
                Lawyers
              </TabsTrigger>
              <TabsTrigger value="legacies" className="data-[state=active]:bg-background">
                <Icon icon="solar:document-text-bold-duotone" className="h-4 w-4 mr-2" />
                Legacies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-border/40">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>6-month revenue and client growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#000000" fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-border/40">
                  <CardHeader>
                    <CardTitle>Legacy Distribution</CardTitle>
                    <CardDescription>Breakdown by document type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={legacyDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {legacyDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>Revenue & Client Growth</CardTitle>
                  <CardDescription>Monthly trends over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis yAxisId="left" stroke="#888" />
                      <YAxis yAxisId="right" orientation="right" stroke="#888" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="#000000" name="Revenue (ZAR)" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="clients" fill="#808080" name="Clients" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lawyers" className="space-y-6">
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>Lawyer Performance</CardTitle>
                  <CardDescription>Individual lawyer metrics and productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lawyerPerformance.map((lawyer, idx) => (
                      <div key={idx} className="p-4 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{lawyer.name}</h4>
                            <p className="text-xs text-muted-foreground">Completion: {lawyer.completion}%</p>
                          </div>
                          <Badge variant="outline">R{lawyer.revenue.toLocaleString()}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Clients</p>
                            <p className="font-semibold text-foreground">{lawyer.clients}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Legacies</p>
                            <p className="font-semibold text-foreground">{lawyer.legacies}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            <p className="font-semibold text-foreground">R{lawyer.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legacies" className="space-y-6">
              <Card className="border border-border/40">
                <CardHeader>
                  <CardTitle>Legacy Type Distribution</CardTitle>
                  <CardDescription>Comprehensive breakdown of all legacy documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsPieChart>
                      <Pie
                        data={legacyDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {legacyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base">Client Reports</CardTitle>
                <CardDescription className="text-xs">
                  Generate reports on client activity and legacies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Client Activity Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <PieChart className="h-4 w-4 mr-2" />
                    Legacy Distribution Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Client Growth Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-base">Lawyer Reports</CardTitle>
                <CardDescription className="text-xs">
                  Track lawyer performance and workload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Lawyer Performance Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Workload Distribution
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Productivity Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Generated Reports */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base">Generated Reports</CardTitle>
              <CardDescription className="text-xs">
                Previously generated reports available for download
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No reports generated yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report: any) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 border border-border rounded-sm hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{report.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {report.period} • Generated {formatDate(report.generatedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

