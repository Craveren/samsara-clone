'use client'

import * as React from 'react'
import { Wireframe } from './Wireframe'
import { StatsGrid, type StatItem } from './StatsGrid'
import { CardGrid, type CardGridItem } from './CardGrid'
import { Section } from './Section'
import { EmptyState } from './EmptyState'
import { TwoColumnLayout } from './TwoColumnLayout'
import { ContentBlock } from './ContentBlock'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'

/**
 * Comprehensive wireframe templates for common page layouts
 */

export const WireframeTemplates = {
  /**
   * Dashboard wireframe
   */
  Dashboard: () => {
    const stats: StatItem[] = [
      {
        id: '1',
        label: 'Total Balance',
        value: 'R 125,000',
        change: { value: 12.5, trend: 'up', period: 'vs last month' },
        icon: 'solar:wallet-bold-duotone',
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

    return (
      <div className="space-y-6">
        <Wireframe title="Page Header" variant="dashed">
          <div className="h-20 bg-muted/40 rounded" />
        </Wireframe>

        <StatsGrid stats={stats} columns={4} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Wireframe title="Chart 1 - Income vs Expenses" variant="dashed">
            <div className="h-64 bg-muted/40 rounded" />
          </Wireframe>
          <Wireframe title="Chart 2 - Account Distribution" variant="dashed">
            <div className="h-64 bg-muted/40 rounded" />
          </Wireframe>
        </div>

        <Wireframe title="Recent Transactions" variant="dashed">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted/40 rounded" />
            ))}
          </div>
        </Wireframe>
      </div>
    )
  },

  /**
   * Form wireframe
   */
  Form: () => (
    <div className="space-y-6 max-w-2xl">
      <Wireframe title="Form Header" variant="dashed">
        <div className="h-20 bg-muted/40 rounded" />
      </Wireframe>

      <Section title="Personal Information" variant="bordered">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted/40 rounded" />
          ))}
        </div>
      </Section>

      <Section title="Additional Details" variant="bordered">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-muted/40 rounded" />
          ))}
        </div>
      </Section>

      <Wireframe title="Form Actions" variant="dashed">
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-muted/40 rounded" />
          <div className="h-10 w-24 bg-muted/40 rounded" />
        </div>
      </Wireframe>
    </div>
  ),

  /**
   * Detail page wireframe
   */
  Detail: () => (
    <div className="space-y-6">
      <Wireframe title="Page Header with Breadcrumbs" variant="dashed">
        <div className="h-24 bg-muted/40 rounded" />
      </Wireframe>

      <TwoColumnLayout
        left={
          <Wireframe title="Sidebar" variant="dashed">
            <div className="space-y-4">
              <div className="h-32 bg-muted/40 rounded" />
              <div className="h-32 bg-muted/40 rounded" />
            </div>
          </Wireframe>
        }
        right={
          <div className="space-y-6">
            <Wireframe title="Main Content" variant="dashed">
              <div className="h-96 bg-muted/40 rounded" />
            </Wireframe>
            <Wireframe title="Related Content" variant="dashed">
              <div className="h-48 bg-muted/40 rounded" />
            </Wireframe>
          </div>
        }
        leftWidth="narrow"
        rightWidth="wide"
      />
    </div>
  ),

  /**
   * List/Table wireframe
   */
  List: () => (
    <div className="space-y-6">
      <Wireframe title="List Header with Filters" variant="dashed">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 bg-muted/40 rounded" />
          <div className="h-10 w-32 bg-muted/40 rounded" />
        </div>
      </Wireframe>

      <Wireframe title="Table/List Content" variant="dashed">
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-16 bg-muted/40 rounded" />
          ))}
        </div>
      </Wireframe>

      <Wireframe title="Pagination" variant="dashed">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-muted/40 rounded" />
          ))}
        </div>
      </Wireframe>
    </div>
  ),

  /**
   * Settings wireframe
   */
  Settings: () => (
    <TwoColumnLayout
      left={
        <Wireframe title="Settings Navigation" variant="dashed">
          <div className="space-y-2">
            {['Profile', 'Security', 'Notifications', 'Billing'].map((item) => (
              <div key={item} className="h-10 bg-muted/40 rounded" />
            ))}
          </div>
        </Wireframe>
      }
      right={
        <div className="space-y-6">
          <Wireframe title="Settings Section" variant="bordered">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/40 rounded" />
              ))}
            </div>
          </Wireframe>
        </div>
      }
      leftWidth="narrow"
      rightWidth="wide"
    />
  ),

  /**
   * Empty state wireframe
   */
  Empty: () => (
    <EmptyState
      icon="solar:document-text-bold-duotone"
      title="No items found"
      description="Get started by creating your first item"
      action={{
        label: 'Create Item',
        onClick: () => {},
      }}
    />
  ),

  /**
   * Profile wireframe
   */
  Profile: () => (
    <div className="space-y-6">
      <Wireframe title="Profile Header" variant="dashed">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted/40" />
          <div className="flex-1">
            <div className="h-6 w-48 bg-muted/40 rounded mb-2" />
            <div className="h-4 w-64 bg-muted/40 rounded" />
          </div>
        </div>
      </Wireframe>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="About" variant="bordered">
            <div className="h-32 bg-muted/40 rounded" />
          </Section>
          <Section title="Activity" variant="bordered">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/40 rounded" />
              ))}
            </div>
          </Section>
        </div>
        <div className="space-y-6">
          <Wireframe title="Quick Stats" variant="bordered">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted/40 rounded" />
              ))}
            </div>
          </Wireframe>
        </div>
      </div>
    </div>
  ),
}








