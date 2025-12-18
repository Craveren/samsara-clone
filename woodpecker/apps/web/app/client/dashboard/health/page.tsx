'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Progress } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'
import { formatDate } from '@/lib/utils/date-format'
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts'

interface HealthCategory {
  id: string
  name: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  icon: string
  description: string
  recommendations: string[]
  lastUpdated: string
  actionRoute?: string
}

interface HealthTrend {
  date: string
  score: number
}

export default function EstateHealthPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = React.useState<HealthCategory | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  // Calculate overall health score from categories
  const categories: HealthCategory[] = React.useMemo(() => [
    {
      id: 'documents',
      name: 'Documents',
      score: 85,
      maxScore: 100,
      status: 'excellent',
      icon: 'solar:document-bold-duotone',
      description: 'Your estate documents are well-organized and up-to-date',
      recommendations: [
        'Review will every 3 years',
        'Update beneficiary designations',
        'Store digital copies securely'
      ],
      lastUpdated: '2024-01-15',
      actionRoute: '/documents'
    },
    {
      id: 'beneficiaries',
      name: 'Beneficiaries & Executors',
      score: 60,
      maxScore: 100,
      status: 'warning',
      icon: 'solar:users-group-two-rounded-bold-duotone',
      description: 'Some beneficiary information needs attention',
      recommendations: [
        'Add backup executors',
        'Update contact information',
        'Review beneficiary designations on all accounts'
      ],
      lastUpdated: '2024-01-10',
      actionRoute: '/people'
    },
    {
      id: 'financial',
      name: 'Financial Planning',
      score: 70,
      maxScore: 100,
      status: 'good',
      icon: 'solar:wallet-money-bold-duotone',
      description: 'Financial accounts are tracked but could be more comprehensive',
      recommendations: [
        'Add all investment accounts',
        'Document insurance policies',
        'List all debts and liabilities'
      ],
      lastUpdated: '2024-01-12',
      actionRoute: '/client/financial'
    },
    {
      id: 'legal',
      name: 'Legal Documents',
      score: 50,
      maxScore: 100,
      status: 'critical',
      icon: 'solar:scale-bold-duotone',
      description: 'Critical legal documents are missing or outdated',
      recommendations: [
        'Create or update living will',
        'Set up healthcare power of attorney',
        'Review trust documents'
      ],
      lastUpdated: '2024-01-05',
      actionRoute: '/documents'
    },
    {
      id: 'healthcare',
      name: 'Healthcare Directives',
      score: 40,
      maxScore: 100,
      status: 'critical',
      icon: 'solar:heart-pulse-bold-duotone',
      description: 'Healthcare directives need immediate attention',
      recommendations: [
        'Create living will',
        'Appoint healthcare proxy',
        'Document medical preferences'
      ],
      lastUpdated: '2023-12-20',
      actionRoute: '/services/directives'
    },
    {
      id: 'digital',
      name: 'Digital Assets',
      score: 30,
      maxScore: 100,
      status: 'critical',
      icon: 'solar:smartphone-bold-duotone',
      description: 'Digital asset planning is incomplete',
      recommendations: [
        'List all digital accounts',
        'Set up password manager access',
        'Document social media accounts'
      ],
      lastUpdated: '2023-11-15',
      actionRoute: '/documents'
    }
  ], [])

  const overallScore = React.useMemo(() => {
    const total = categories.reduce((sum, cat) => sum + cat.score, 0)
    return Math.round(total / categories.length)
  }, [categories])

  const healthTrend: HealthTrend[] = React.useMemo(() => [
    { date: 'Oct', score: 52 },
    { date: 'Nov', score: 55 },
    { date: 'Dec', score: 58 },
    { date: 'Jan', score: overallScore },
  ], [overallScore])

  const radarData = React.useMemo(() => 
    categories.map(cat => ({
      category: cat.name,
      score: cat.score,
      fullMark: 100
    }))
  , [categories])

  const getStatusColor = (status: HealthCategory['status']) => {
    switch (status) {
      case 'excellent': return 'border-border/60 bg-background/50'
      case 'good': return 'border-border/60 bg-background/50'
      case 'warning': return 'border-foreground/20 bg-foreground/5'
      case 'critical': return 'border-destructive/30 bg-destructive/5'
    }
  }

  const getStatusIcon = (status: HealthCategory['status']) => {
    switch (status) {
      case 'excellent': return 'solar:check-circle-bold-duotone'
      case 'good': return 'solar:check-circle-bold-duotone'
      case 'warning': return 'solar:danger-triangle-bold-duotone'
      case 'critical': return 'solar:danger-circle-bold-duotone'
    }
  }

  const handleCategoryClick = (category: HealthCategory) => {
    setSelectedCategory(category)
    setIsDetailOpen(true)
  }

  const handleFixAction = (category: HealthCategory) => {
    if (category.actionRoute) {
      router.push(category.actionRoute)
    } else {
      handleCategoryClick(category)
    }
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Attention'
    return 'Critical'
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Estate Health</h1>
                <p className="text-muted-foreground mt-1">
                  Track your estate planning completeness across all categories
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <Icon icon="solar:refresh-bold-duotone" className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Overall Score Card */}
          <Card className="border border-border/60 mb-6" data-intro="overall-score">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Overall Health Score</CardTitle>
                  <CardDescription>Based on all estate planning categories</CardDescription>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-lg px-4 py-2 border-border/60"
                >
                  {getScoreLabel(overallScore)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-foreground mb-4">{overallScore}%</div>
                  <Progress value={overallScore} className="h-4 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {overallScore >= 80 
                      ? 'Your estate is in excellent shape! Keep maintaining it.' 
                      : overallScore >= 60
                      ? 'Your estate is in good shape, but there\'s room for improvement.'
                      : 'Your estate needs attention. Focus on critical areas first.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Trend Chart */}
          <Card className="border border-border/60 mb-6" data-intro="health-trend">
            <CardHeader>
              <CardTitle>Health Trend</CardTitle>
              <CardDescription>Your estate health score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={healthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--foreground))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--foreground))', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className={cn(
                  'border cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
                  getStatusColor(category.status)
                )}
                onClick={() => handleCategoryClick(category)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Icon 
                          icon={category.icon} 
                          className="h-5 w-5 text-foreground"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Icon 
                      icon={getStatusIcon(category.status)} 
                      className={cn(
                        "h-5 w-5",
                        category.status === 'critical' ? "text-destructive" :
                        category.status === 'warning' ? "text-foreground/60" :
                        "text-foreground/40"
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">{category.score}%</span>
                      <Badge variant="outline" className="text-xs">
                        {category.status}
                      </Badge>
                    </div>
                    <Progress value={category.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(category.lastUpdated, 'MMM d, yyyy')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Improve your estate health with these actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories
                  .filter(cat => cat.status === 'critical' || cat.status === 'warning')
                  .slice(0, 6)
                  .map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="justify-start h-auto p-4 hover:bg-foreground/5 border-border/60"
                      onClick={() => handleFixAction(category)}
                    >
                      <Icon icon={category.icon} className="h-5 w-5 mr-3 text-foreground" />
                      <div className="text-left">
                        <div className="font-semibold text-sm text-foreground">Fix {category.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {category.recommendations[0]}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Category Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCategory && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Icon 
                    icon={selectedCategory.icon} 
                    className="h-6 w-6 text-foreground"
                  />
                  <div>
                    <DialogTitle>{selectedCategory.name}</DialogTitle>
                    <DialogDescription>{selectedCategory.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Health Score</span>
                    <span className="text-2xl font-bold">{selectedCategory.score}%</span>
                  </div>
                  <Progress value={selectedCategory.score} className="h-3" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedCategory.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon 
                          icon="solar:check-circle-bold-duotone" 
                          className="h-5 w-5 text-foreground/40 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm font-medium">
                      {formatDate(selectedCategory.lastUpdated, 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsDetailOpen(false)
                      if (selectedCategory.actionRoute) {
                        router.push(selectedCategory.actionRoute)
                      }
                    }}
                  >
                    <Icon icon="solar:pen-bold-duotone" className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
