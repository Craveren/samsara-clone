'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { FinancialAccountsPage } from '@/components/financial/FinancialAccountsPage'
import { useToast } from '@/lib/hooks'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/shared/PageHeader'

export default function FinancialPage() {
  const { toast } = useToast()

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <PageHeader
            title="Financial Accounts"
            description="Manage your financial accounts, track balances, and monitor transactions across all your accounts"
            icon="solar:wallet-bold-duotone"
          />
          <FinancialAccountsPage />
        </div>
      </main>
    </div>
  )
}

