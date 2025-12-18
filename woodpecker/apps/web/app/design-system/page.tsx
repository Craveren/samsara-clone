'use client'

import * as React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { VisualDesignGuide } from '@/components/layout/VisualDesignGuide'
import { EnhancedPageHeader } from '@/components/layout/EnhancedPageHeader'

/**
 * Design System Showcase Page
 * View all design components and patterns
 */
export default function DesignSystemPage() {
  return (
    <AppLayout maxWidth="full" padding="lg" showSidebar={false}>
      <EnhancedPageHeader
        title="Design System"
        description="Comprehensive showcase of all layout components, design patterns, and visual elements"
        icon="solar:palette-bold-duotone"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Design System' },
        ]}
      />
      <VisualDesignGuide />
    </AppLayout>
  )
}








