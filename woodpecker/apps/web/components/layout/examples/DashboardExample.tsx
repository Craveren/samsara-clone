'use client'

import * as React from 'react'
import {
  AppLayout,
  EnhancedPageHeader,
  StatsGrid,
  Section,
  GridLayout,
  CardGrid,
  EmptyState,
  type StatItem,
  type CardGridItem,
} from '../index'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'

/**
 * Example Dashboard Implementation
 * Shows how to use the new design system components
 */
export function DashboardExample() {
  const stats: StatItem[] = [
    {
      id: '1',
      label: 'Total Balance',
      value: 'R 125,000',
      change: { value: 12.5, trend: 'up', period: 'vs last month' },
      icon: 'solar:wallet-bold-duotone',
      description: 'Across all accounts',
    },
    {
      id: '2',
      label: 'Monthly Income',
      value: 'R 45,000',
      change: { value: 5.2, trend: 'up', period: 'vs last month' },
      icon: 'solar:graph-up-bold-duotone',
    },
    {
      id: '3',
      label: 'Active Accounts',
      value: '8',
      change: { value: 2, trend: 'up', period: 'new this month' },
      icon: 'solar:card-bold-duotone',
    },
    {
      id: '4',
      label: 'Savings Rate',
      value: '28%',
      change: { value: 3.5, trend: 'up', period: 'vs last month' },
      icon: 'solar:pie-chart-2-bold-duotone',
    },
  ]

  const quickAccessItems: CardGridItem[] = [
    {
      id: '1',
      title: 'Financial Accounts',
      description: 'Manage your bank accounts',
      content: (
        <div className="h-24 bg-muted/20 rounded flex items-center justify-center">
          <Icon icon="solar:wallet-bold-duotone" className="h-8 w-8 text-muted-foreground" />
        </div>
      ),
      icon: <Icon icon="solar:wallet-bold-duotone" className="h-5 w-5" />,
      action: (
        <Button variant="ghost" size="sm">
          View
        </Button>
      ),
    },
    {
      id: '2',
      title: 'Documents',
      description: 'Estate planning documents',
      content: (
        <div className="h-24 bg-muted/20 rounded flex items-center justify-center">
          <Icon icon="solar:document-text-bold-duotone" className="h-8 w-8 text-muted-foreground" />
        </div>
      ),
      icon: <Icon icon="solar:document-text-bold-duotone" className="h-5 w-5" />,
      action: (
        <Button variant="ghost" size="sm">
          View
        </Button>
      ),
    },
    {
      id: '3',
      title: 'People & Family',
      description: 'Beneficiaries and executors',
      content: (
        <div className="h-24 bg-muted/20 rounded flex items-center justify-center">
          <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-8 w-8 text-muted-foreground" />
        </div>
      ),
      icon: <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-5 w-5" />,
      action: (
        <Button variant="ghost" size="sm">
          View
        </Button>
      ),
    },
  ]

  return (
    <AppLayout maxWidth="xl" padding="md">
      <EnhancedPageHeader
        title="Dashboard"
        description="Overview of your estate planning and financial health"
        icon="solar:chart-bold-duotone"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' },
        ]}
        action={
          <Button>
            <Icon icon="solar:add-circle-bold-duotone" className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        }
      />

      {/* Stats Grid */}
      <Section title="Financial Overview" spacing="md">
        <StatsGrid stats={stats} columns={4} />
      </Section>

      {/* Quick Access */}
      <Section
        title="Quick Access"
        description="Frequently used features"
        spacing="md"
      >
        <CardGrid items={quickAccessItems} columns={3} />
      </Section>

      {/* Charts Section */}
      <Section title="Charts & Analytics" variant="bordered" spacing="lg">
        <GridLayout columns={2} gap="lg">
          <div className="h-64 bg-muted/20 rounded flex items-center justify-center">
            <Icon icon="solar:graph-up-bold-duotone" className="h-12 w-12 text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Income vs Expenses Chart</span>
          </div>
          <div className="h-64 bg-muted/20 rounded flex items-center justify-center">
            <Icon icon="solar:pie-chart-2-bold-duotone" className="h-12 w-12 text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Account Distribution</span>
          </div>
        </GridLayout>
      </Section>

      {/* Recent Activity */}
      <Section title="Recent Activity" variant="bordered" spacing="lg">
        <EmptyState
          icon="solar:clock-circle-bold-duotone"
          title="No recent activity"
          description="Your recent activities will appear here"
          size="sm"
        />
      </Section>
    </AppLayout>
  )
}








