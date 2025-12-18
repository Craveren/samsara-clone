'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { Button, Badge } from '@woodpecker/ui'
import { UserButton, useUser } from '@clerk/nextjs'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { AccountSwitcher } from '@/components/account/AccountSwitcher'
import { useRole } from '@/lib/hooks/use-role'

type UserRole = 'client' | 'lawyer' | 'agency' | 'estate-planner' | 'financial-advisor'

interface NavItem {
  name: string
  href: string
  icon: string
  group?: 'main' | 'manage' | 'tools' | 'settings'
}

const clientNavigation: NavItem[] = [
  // Lifebook Group
  { name: 'Dashboard', href: '/client/dashboard', icon: 'solar:home-2-bold-duotone', group: 'main' },
  { name: 'My Legacy Journey', href: '/legacy', icon: 'solar:book-bookmark-bold-duotone', group: 'main' },
  { name: 'Estate Health', href: '/client/dashboard/health', icon: 'solar:heart-pulse-bold-duotone', group: 'main' },
  // Estate Planning Group
  { name: 'Document Vault', href: '/documents', icon: 'solar:folder-with-files-bold-duotone', group: 'manage' },
  { name: 'People & Family', href: '/people', icon: 'solar:users-group-two-rounded-bold-duotone', group: 'manage' },
  { name: 'Estate Builder', href: '/planning/wizard', icon: 'solar:wrench-bold-duotone', group: 'manage' },
  { name: 'Automation & Triggers', href: '/automation/triggers', icon: 'solar:bolt-bold-duotone', group: 'manage' },
  { name: 'Tasks', href: '/tasks', icon: 'solar:checklist-bold-duotone', group: 'manage' },
  { name: 'Financial Accounts', href: '/client/financial', icon: 'solar:wallet-bold-duotone', group: 'manage' },
  // Services Group
  { name: 'Estate Education', href: '/services/education', icon: 'solar:academic-cap-bold-duotone', group: 'tools' },
  { name: 'Legal Marketplace', href: '/services/legal-marketplace', icon: 'solar:scale-bold-duotone', group: 'tools' },
  { name: 'Communication', href: '/communication', icon: 'solar:chat-round-line-bold-duotone', group: 'tools' },
  { name: 'Healthcare Directives', href: '/services/directives', icon: 'solar:document-text-bold-duotone', group: 'tools' },
  { name: 'Planning Workflow', href: '/services/workflow', icon: 'solar:clipboard-list-bold-duotone', group: 'tools' },
  { name: 'Estate Summary Report', href: '/services/report', icon: 'solar:chart-bar-bold-duotone', group: 'tools' },
  { name: 'Invitations', href: '/client/invitations', icon: 'solar:letter-bold-duotone', group: 'tools' },
  { name: 'Interview', href: '/interview', icon: 'solar:microphone-3-bold-duotone', group: 'tools' },
  // Settings
  { name: 'My Lawyers', href: '/client/lawyers', icon: 'solar:user-speak-bold-duotone', group: 'settings' },
  { name: 'Subscription', href: '/subscription', icon: 'solar:card-bold-duotone', group: 'settings' },
  { name: 'Settings', href: '/settings', icon: 'solar:settings-bold-duotone', group: 'settings' },
]

const lawyerNavigation: NavItem[] = [
  // Main
  { name: 'Dashboard', href: '/lawyer/dashboard', icon: 'solar:home-2-bold-duotone', group: 'main' },
  { name: 'Clients', href: '/lawyer/clients', icon: 'solar:users-group-two-rounded-bold-duotone', group: 'main' },
  { name: 'Communication', href: '/communication', icon: 'solar:chat-round-line-bold-duotone', group: 'main' },
  // Manage
  { name: 'Tasks', href: '/tasks', icon: 'solar:checklist-bold-duotone', group: 'manage' },
  { name: 'Meetings', href: '/lawyer/meetings', icon: 'solar:calendar-bold-duotone', group: 'manage' },
  { name: 'Documents', href: '/documents', icon: 'solar:folder-with-files-bold-duotone', group: 'manage' },
  // Tools
  { name: 'Case Management', href: '/lawyer/cases', icon: 'solar:briefcase-bold-duotone', group: 'tools' },
  { name: 'Templates', href: '/lawyer/templates', icon: 'solar:document-text-bold-duotone', group: 'tools' },
  { name: 'Team', href: '/lawyer/team', icon: 'solar:users-group-rounded-bold-duotone', group: 'tools' },
  // Settings
  { name: 'Settings', href: '/lawyer/settings', icon: 'solar:settings-bold-duotone', group: 'settings' },
]

const agencyNavigation: NavItem[] = [
  // Main
  { name: 'Dashboard', href: '/agency/dashboard', icon: 'solar:home-2-bold-duotone', group: 'main' },
  { name: 'Clients', href: '/agency/clients', icon: 'solar:users-group-two-rounded-bold-duotone', group: 'main' },
  { name: 'Lawyers', href: '/agency/lawyers', icon: 'solar:user-speak-bold-duotone', group: 'main' },
  { name: 'Communication', href: '/communication', icon: 'solar:chat-round-line-bold-duotone', group: 'main' },
  // Manage
  { name: 'Reports', href: '/agency/reports', icon: 'solar:chart-bold-duotone', group: 'manage' },
  { name: 'Documents', href: '/documents', icon: 'solar:folder-with-files-bold-duotone', group: 'manage' },
  // Settings
  { name: 'Settings', href: '/agency/settings', icon: 'solar:settings-bold-duotone', group: 'settings' },
]

const estatePlannerNavigation: NavItem[] = [
  // Main
  { name: 'Dashboard', href: '/estate-planner/dashboard', icon: 'solar:home-2-bold-duotone', group: 'main' },
  { name: 'Clients', href: '/estate-planner/clients', icon: 'solar:users-group-two-rounded-bold-duotone', group: 'main' },
  { name: 'Estate Plans', href: '/estate-planner/plans', icon: 'solar:document-text-bold-duotone', group: 'main' },
  { name: 'Communication', href: '/communication', icon: 'solar:chat-round-line-bold-duotone', group: 'main' },
  // Manage
  { name: 'Templates', href: '/estate-planner/templates', icon: 'solar:document-bold-duotone', group: 'manage' },
  { name: 'Documents', href: '/documents', icon: 'solar:folder-with-files-bold-duotone', group: 'manage' },
  { name: 'Reports', href: '/estate-planner/reports', icon: 'solar:chart-bold-duotone', group: 'manage' },
  // Settings
  { name: 'Settings', href: '/estate-planner/settings', icon: 'solar:settings-bold-duotone', group: 'settings' },
]

// Executor removed - replaced with financial-advisor

const financialAdvisorNavigation: NavItem[] = [
  // Main
  { name: 'Dashboard', href: '/financial-advisor/dashboard', icon: 'solar:home-2-bold-duotone', group: 'main' },
  { name: 'Clients', href: '/financial-advisor/clients', icon: 'solar:users-group-two-rounded-bold-duotone', group: 'main' },
  { name: 'Communication', href: '/communication', icon: 'solar:chat-round-line-bold-duotone', group: 'main' },
  // Manage
  { name: 'Documents', href: '/documents', icon: 'solar:folder-with-files-bold-duotone', group: 'manage' },
  { name: 'Billing', href: '/financial-advisor/billing', icon: 'solar:card-bold-duotone', group: 'manage' },
  // Tools
  { name: 'Team', href: '/financial-advisor/team', icon: 'solar:users-group-rounded-bold-duotone', group: 'tools' },
  // Settings
  { name: 'Settings', href: '/financial-advisor/settings', icon: 'solar:settings-bold-duotone', group: 'settings' },
]

const groupLabels: Record<string, string> = {
  main: 'Overview',
  manage: 'Manage',
  tools: 'Tools',
  settings: 'Settings',
}

export function RoleBasedSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = React.useState(false)
  const [userRole] = useLocalStorage<UserRole>('user-role', 'client')
  const { user, isLoaded } = useUser()
  const { activeRole, availableRoles } = useRole()

  // Determine navigation based on user's actual role from Clerk (security fix)
  const actualRole = React.useMemo(() => {
    if (!isLoaded || !user) return 'client'
    const role = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as UserRole | undefined
    return role || activeRole || 'client'
  }, [isLoaded, user, activeRole])

  // Determine navigation based on user's actual role (not pathname - security fix)
  const navigation = React.useMemo(() => {
    if (actualRole === 'lawyer') return lawyerNavigation
    if (actualRole === 'agency') return agencyNavigation
    if (actualRole === 'estate-planner') return estatePlannerNavigation
    if (actualRole === 'financial-advisor') return financialAdvisorNavigation
    return clientNavigation
  }, [actualRole])

  // Group navigation items
  const groupedNavigation = React.useMemo(() => {
    const groups: Record<string, NavItem[]> = {}
    navigation.forEach(item => {
      const group = item.group || 'main'
      if (!groups[group]) groups[group] = []
      groups[group].push(item)
    })
    return groups
  }, [navigation])

  // Get theme colors based on account type
  const themeColors = React.useMemo(() => {
    const themes: Record<UserRole, { accent: string; bg: string; border: string }> = {
      'client': {
        accent: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
        bg: 'bg-background/95',
        border: 'border-border/60',
      },
      'lawyer': {
        accent: 'bg-purple-500/10 border-purple-500/20 text-purple-600',
        bg: 'bg-background/95',
        border: 'border-purple-500/30',
      },
      'agency': {
        accent: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600',
        bg: 'bg-background/95',
        border: 'border-indigo-500/30',
      },
      'estate-planner': {
        accent: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
        bg: 'bg-background/95',
        border: 'border-emerald-500/30',
      },
      'financial-advisor': {
        accent: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
        bg: 'bg-background/95',
        border: 'border-amber-500/30',
      },
    }
    return themes[actualRole] || themes.client
  }, [actualRole])

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r backdrop-blur-sm transition-all duration-300',
        themeColors.bg,
        themeColors.border,
        collapsed ? 'w-[60px]' : 'w-64'
      )}
    >

      {/* User Profile */}
      <div className="border-b border-border/60 px-3 py-3 relative">
        <div className="flex items-center gap-2.5">
          {isLoaded && user ? (
            <>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8 ring-1 ring-border/50',
                    userButtonPopoverCard: 'shadow-lg border border-border',
                  },
                }}
              />
              {!collapsed && (
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-xs font-medium text-foreground">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName || user.username || user.emailAddresses[0]?.emailAddress || 'User'}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground mt-0.5">
                    {actualRole.charAt(0).toUpperCase() + actualRole.slice(1).replace('-', ' ')} Account
                    {availableRoles && availableRoles.length > 1 && (
                      <span className="ml-1">• {availableRoles.length} available</span>
                    )}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted animate-pulse">
              <span className="text-xs text-muted-foreground">•••</span>
            </div>
          )}
        </div>
        
        {/* Account Switcher - Moved to top under account */}
        {!collapsed && availableRoles && availableRoles.length > 1 && (
          <div className="mt-2 pt-2 border-t border-border/40">
            <div className="w-full min-w-0">
              <AccountSwitcher />
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 scrollbar-thin scrollbar-thumb-border/40 scrollbar-track-transparent">
        {Object.entries(groupedNavigation).map(([group, items], groupIdx) => (
          <div key={group} className="mb-4 last:mb-0">
            {/* Group Label */}
            {!collapsed && (
              <div className="px-2.5 py-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {groupLabels[group] || group}
                </span>
              </div>
            )}
            
            {/* Group Items */}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Use window.location for complete page reload to ensure clean state
                      // This prevents any shared state or notifications from persisting
                      window.location.href = item.href
                    }}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-all duration-300 ease-out group/item cursor-pointer w-full text-left relative',
                      isActive
                        ? `${themeColors.accent} text-foreground shadow-md shadow-foreground/5 font-semibold scale-[1.02]`
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:scale-[1.01]',
                      collapsed && 'justify-center px-2'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      icon={item.icon}
                      className={cn(
                        'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                        isActive ? 'text-foreground' : 'text-muted-foreground group-hover/item:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-foreground/60 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Group Divider */}
            {groupIdx < Object.entries(groupedNavigation).length - 1 && !collapsed && (
              <div className="my-4 h-px bg-border/40 mx-2" />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border/60 p-2 space-y-1">
        {!collapsed ? (
          <Link
            href="/help"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
          >
            <Icon icon="solar:question-circle-bold-duotone" className="h-[18px] w-[18px] text-muted-foreground" />
            Help & Support
          </Link>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 mx-auto" asChild>
            <Link href="/help">
              <Icon icon="solar:question-circle-bold-duotone" className="h-[18px] w-[18px] text-muted-foreground" />
            </Link>
          </Button>
        )}
        
        <div className={cn('flex items-center gap-1', collapsed && 'flex-col')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={React.useCallback(() => setCollapsed(prev => !prev), [])}
            className="h-8 w-8 hover:bg-muted/80"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon 
              icon={collapsed ? 'solar:alt-arrow-right-bold-duotone' : 'solar:alt-arrow-left-bold-duotone'} 
              className="h-4 w-4 text-muted-foreground" 
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
