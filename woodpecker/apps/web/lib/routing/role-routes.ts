import { type Role } from '@/lib/roles/role-types'

/**
 * Get the dashboard path for a given role
 */
export function getDashboardPath(role: Role | string): string {
  const roleMap: Record<string, string> = {
    client: '/client/dashboard',
    lawyer: '/lawyer/dashboard',
    agency: '/agency/dashboard',
    'estate-planner': '/estate-planner/dashboard',
    'financial-advisor': '/financial-advisor/dashboard',
    family: '/client/dashboard', // Family members use client dashboard
  }

  return roleMap[role] || '/onboarding/account-type'
}

/**
 * Get all routes for a given role
 */
export function getRoleRoutes(role: Role | string): Record<string, string> {
  const baseRoutes: Record<string, Record<string, string>> = {
    client: {
      dashboard: '/client/dashboard',
      legacy: '/legacy',
      documents: '/documents',
      tasks: '/tasks',
      communication: '/communication',
      lawyers: '/client/lawyers',
      financial: '/client/financial',
      invitations: '/client/invitations',
      settings: '/settings',
    },
    lawyer: {
      dashboard: '/lawyer/dashboard',
      clients: '/lawyer/clients',
      cases: '/lawyer/cases',
      communication: '/lawyer/communication',
      meetings: '/lawyer/meetings',
      templates: '/lawyer/templates',
      team: '/lawyer/team',
      settings: '/settings',
    },
    agency: {
      dashboard: '/agency/dashboard',
      lawyers: '/agency/lawyers',
      reports: '/agency/reports',
      settings: '/agency/settings',
    },
    'estate-planner': {
      dashboard: '/estate-planner/dashboard',
      clients: '/estate-planner/clients',
      plans: '/estate-planner/plans',
      templates: '/estate-planner/templates',
      reports: '/estate-planner/reports',
      settings: '/estate-planner/settings',
    },
    'financial-advisor': {
      dashboard: '/financial-advisor/dashboard',
      clients: '/financial-advisor/clients',
      billing: '/financial-advisor/billing',
      team: '/financial-advisor/team',
      settings: '/settings',
    },
    family: {
      dashboard: '/client/dashboard',
      legacy: '/legacy',
      documents: '/documents',
      communication: '/communication',
    },
  }

  return baseRoutes[role] || {}
}

/**
 * Check if a route is accessible by a role
 */
export function isRouteAccessible(pathname: string, role: Role | string): boolean {
  const roleRoutes = getRoleRoutes(role)
  const routeValues = Object.values(roleRoutes)
  
  // Check if pathname matches any route for this role
  return routeValues.some(route => pathname.startsWith(route))
}

/**
 * Get the default redirect path after authentication
 */
export function getAuthRedirectPath(role?: Role | string | null): string {
  if (!role) {
    return '/onboarding/account-type'
  }
  return getDashboardPath(role)
}

