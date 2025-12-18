'use client'

import * as React from 'react'
import { PageIntro } from '@/components/onboarding/PageIntro'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { ManualFinancialDashboard } from '@/components/financial/ManualFinancialDashboard'
import { FinancialAIChat } from '@/components/ai/FinancialAIChat'
import { useToast } from '@/lib/hooks'

export default function FinancialPage() {
  const { toast } = useToast()

  return (
    <PageIntro 
      pageId="financial" 
      pageName="FINANCIAL DASHBOARD"
      description="Manage your finances with manual entry, CSV import, and beautiful fintech charts."
      highlights={[
        {
          selector: '[data-intro="financial-charts"]',
          description: "View your financial trends and asset distribution with interactive charts",
          position: 'bottom'
        },
        {
          selector: '[data-intro="ai-insights"]',
          description: "Get personalized AI recommendations based on your spending patterns and financial goals",
          position: 'bottom'
        }
      ]}
    >
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <ManualFinancialDashboard />
          </div>
        </main>
      </div>
    </PageIntro>
  )
}



