'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import {
  StatsGrid,
  CardGrid,
  Section,
  ContentBlock,
  TwoColumnLayout,
  EmptyState,
  Stack,
  Divider,
  EnhancedPageHeader,
} from './index'
import { designTokens } from '@/lib/design-system/design-tokens'

/**
 * Visual Design Guide Component
 * Showcases all layout components and design patterns
 */
export function VisualDesignGuide() {
  const stats = [
    {
      id: '1',
      label: 'Total Balance',
      value: 'R 125,000',
      change: { value: 12.5, trend: 'up' as const, period: 'vs last month' },
      icon: 'solar:wallet-bold-duotone',
    },
    {
      id: '2',
      label: 'Monthly Income',
      value: 'R 45,000',
      change: { value: 5.2, trend: 'up' as const, period: 'vs last month' },
      icon: 'solar:graph-up-bold-duotone',
    },
    {
      id: '3',
      label: 'Active Accounts',
      value: '8',
      change: { value: 2, trend: 'up' as const, period: 'new this month' },
      icon: 'solar:card-bold-duotone',
    },
    {
      id: '4',
      label: 'Savings Rate',
      value: '28%',
      change: { value: 3.5, trend: 'up' as const, period: 'vs last month' },
      icon: 'solar:pie-chart-2-bold-duotone',
    },
  ]

  const cardItems = [
    {
      id: '1',
      title: 'Financial Overview',
      description: 'Track your financial health',
      content: <div className="h-32 bg-muted/20 rounded" />,
      icon: <Icon icon="solar:wallet-bold-duotone" className="h-5 w-5" />,
    },
    {
      id: '2',
      title: 'Documents',
      description: 'Manage your estate documents',
      content: <div className="h-32 bg-muted/20 rounded" />,
      icon: <Icon icon="solar:document-text-bold-duotone" className="h-5 w-5" />,
    },
    {
      id: '3',
      title: 'People & Family',
      description: 'Manage beneficiaries and executors',
      content: <div className="h-32 bg-muted/20 rounded" />,
      icon: <Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-12 py-8">
      {/* Design Tokens */}
      <Section title="Design Tokens" description="Spacing, typography, and design system values">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContentBlock title="Spacing Scale" variant="bordered">
            <Stack spacing="sm">
              {Object.entries(designTokens.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{key}</span>
                  <div
                    className="bg-foreground/10 rounded"
                    style={{ width: value, height: '8px' }}
                  />
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </Stack>
          </ContentBlock>

          <ContentBlock title="Typography Scale" variant="bordered">
            <Stack spacing="sm">
              {Object.entries(designTokens.typography.fontSize).map(([key, value]) => (
                <div key={key} style={{ fontSize: value }}>
                  <span className="font-mono text-xs text-muted-foreground">{key}:</span>{' '}
                  The quick brown fox jumps over the lazy dog
                </div>
              ))}
            </Stack>
          </ContentBlock>

          <ContentBlock title="Border Radius" variant="bordered">
            <Stack spacing="sm">
              {Object.entries(designTokens.borderRadius).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="bg-foreground/10 w-12 h-12"
                    style={{ borderRadius: value }}
                  />
                  <div>
                    <div className="text-sm font-medium">{key}</div>
                    <div className="text-xs text-muted-foreground font-mono">{value}</div>
                  </div>
                </div>
              ))}
            </Stack>
          </ContentBlock>
        </div>
      </Section>

      {/* Stats Grid */}
      <Section title="Stats Grid" description="Beautiful stat cards with trends">
        <StatsGrid stats={stats} columns={4} />
      </Section>

      {/* Card Grid */}
      <Section title="Card Grid" description="Responsive card collections">
        <CardGrid items={cardItems} columns={3} />
      </Section>

      {/* Two Column Layout */}
      <Section title="Two Column Layout" description="Flexible side-by-side layouts">
        <TwoColumnLayout
          left={
            <ContentBlock title="Left Column" variant="bordered">
              <p className="text-sm text-muted-foreground">
                This is the left column. It can be narrow, medium, or wide.
              </p>
            </ContentBlock>
          }
          right={
            <ContentBlock title="Right Column" variant="bordered">
              <p className="text-sm text-muted-foreground">
                This is the right column. It automatically takes remaining space.
              </p>
            </ContentBlock>
          }
          leftWidth="narrow"
          rightWidth="wide"
        />
      </Section>

      {/* Empty State */}
      <Section title="Empty State" description="Beautiful empty states">
        <EmptyState
          icon="solar:document-text-bold-duotone"
          title="No documents yet"
          description="Get started by uploading your first document"
          action={{
            label: 'Upload Document',
            onClick: () => {},
          }}
        />
      </Section>

      {/* Enhanced Header */}
      <Section title="Enhanced Page Header" description="Headers with breadcrumbs and actions">
        <EnhancedPageHeader
          title="Page Title"
          description="Page description goes here"
          icon="solar:wallet-bold-duotone"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard' },
          ]}
          action={<Button>Action</Button>}
        />
      </Section>

      {/* Stack */}
      <Section title="Stack Component" description="Vertical and horizontal layouts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContentBlock title="Vertical Stack" variant="bordered">
            <Stack spacing="md" direction="column">
              <div className="h-12 bg-muted/40 rounded" />
              <div className="h-12 bg-muted/40 rounded" />
              <div className="h-12 bg-muted/40 rounded" />
            </Stack>
          </ContentBlock>
          <ContentBlock title="Horizontal Stack" variant="bordered">
            <Stack spacing="md" direction="row" justify="center">
              <div className="h-12 w-12 bg-muted/40 rounded" />
              <div className="h-12 w-12 bg-muted/40 rounded" />
              <div className="h-12 w-12 bg-muted/40 rounded" />
            </Stack>
          </ContentBlock>
        </div>
      </Section>

      {/* Divider */}
      <Section title="Divider" description="Visual separation">
        <div className="space-y-6">
          <div>Content above</div>
          <Divider />
          <div>Content below</div>
          <Divider label="Or with label" />
          <div>More content</div>
        </div>
      </Section>
    </div>
  )
}








