/**
 * Account Switcher using Clerk Organizations
 * Multi-tenant account switching with proper organization context
 */

'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser, useOrganization, OrganizationSwitcher, useOrganizationList } from '@clerk/nextjs'
import { Icon } from '@iconify/react'
import { Button } from '@woodpecker/ui'
import { useRole } from '@/lib/hooks/use-role'
import { ROLE_INFO, type Role } from '@/lib/roles/role-types'
import { getDashboardPath } from '@/lib/routing/role-routes'

/**
 * Account switcher using Clerk Organizations
 * Each organization represents a tenant/account
 */
export const AccountSwitcher = React.memo(function AccountSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoaded: userLoaded } = useUser()
  const { organization, isLoaded: orgLoaded } = useOrganization()
  const { organizationList, isLoaded: orgListLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const { activeRole } = useRole()

  // Get current organization name or fallback
  const currentOrgName = organization?.name || 'Personal Account'
  const currentRole = activeRole || 'client'
  const currentInfo = ROLE_INFO[currentRole]

  // Handle organization selection
  const handleOrganizationSelect = React.useCallback((orgId: string) => {
    // Redirect to dashboard for the selected organization
    const dashboardPath = getDashboardPath(currentRole)
    router.push(dashboardPath)
  }, [currentRole, router])

  if (!userLoaded || !orgLoaded || !orgListLoaded) {
    return (
      <Button
        variant="ghost"
        className="w-full flex items-center gap-2 h-9 px-2 justify-start overflow-hidden"
        disabled
      >
        <div className="h-7 w-7 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/60 flex-shrink-0 animate-pulse">
          <Icon icon="solar:refresh-bold" className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 text-xs font-medium truncate min-w-0">Loading...</span>
      </Button>
    )
  }

  // If user has no organizations, show create option
  if (!organization && organizationList?.length === 0) {
    return (
      <Button
        variant="ghost"
        className="w-full flex items-center gap-2 h-9 px-2 justify-start overflow-hidden"
        onClick={() => router.push('/onboarding/account-type?mode=signup')}
      >
        <div className="h-7 w-7 rounded-lg bg-foreground/5 flex items-center justify-center border border-border/60 flex-shrink-0">
          <Icon icon="solar:user-plus-bold-duotone" className="h-3.5 w-3.5" />
        </div>
        <span className="flex-1 text-xs font-medium truncate min-w-0">Create Account</span>
      </Button>
    )
  }

  // Use Clerk's OrganizationSwitcher component
  return (
    <div className="w-full">
      <OrganizationSwitcher
        hidePersonal={false}
        afterCreateOrganizationUrl={(org) => {
          const dashboardPath = getDashboardPath(currentRole)
          return dashboardPath
        }}
        afterSelectOrganizationUrl={(org) => {
          const dashboardPath = getDashboardPath(currentRole)
          return dashboardPath
        }}
        appearance={{
          elements: {
            organizationSwitcherTrigger: 'w-full flex items-center gap-2 h-9 px-2 justify-start overflow-hidden border border-border/60 rounded-lg hover:bg-muted/60',
            organizationSwitcherTriggerIcon: 'h-3.5 w-3.5',
            organizationPreview: 'px-2 py-1.5',
            organizationPreviewText: 'text-xs font-medium',
            organizationPreviewAvatarBox: 'h-7 w-7',
            organizationSwitcherPopoverCard: 'w-56',
            organizationSwitcherPopoverActionsButton: 'text-xs',
          },
        }}
      />
    </div>
  )
})

/**
 * Full-screen account switcher dialog (for mobile/special cases)
 */
export function AccountSwitcherDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const { organization } = useOrganization()
  const { activeRole } = useRole()

  return (
    <div className="p-4">
      <OrganizationSwitcher
        hidePersonal={false}
        afterCreateOrganizationUrl={(org) => {
          const dashboardPath = getDashboardPath(activeRole || 'client')
          return dashboardPath
        }}
        afterSelectOrganizationUrl={(org) => {
          const dashboardPath = getDashboardPath(activeRole || 'client')
          return dashboardPath
        }}
      />
    </div>
  )
}
