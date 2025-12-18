import { type Role } from '@/lib/roles/role-types'
import { getRoleRoutes } from './role-routes'

/**
 * Navigation routes for dashboard buttons
 * Maps button actions to their corresponding routes
 */
export const dashboardRoutes = {
  // Client routes
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
    interview: '/interview',
  },
  // Lawyer routes
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
  // Agency routes
  agency: {
    dashboard: '/agency/dashboard',
    lawyers: '/agency/lawyers',
    reports: '/agency/reports',
    settings: '/agency/settings',
  },
  // Financial Advisor routes
  'financial-advisor': {
    dashboard: '/financial-advisor/dashboard',
    clients: '/financial-advisor/clients',
    billing: '/financial-advisor/billing',
    team: '/financial-advisor/team',
    settings: '/settings',
  },
  // Family routes (same as client)
  family: {
    dashboard: '/client/dashboard',
    legacy: '/legacy',
    documents: '/documents',
    communication: '/communication',
  },
} as const

/**
 * Get route for a specific action and role
 */
export function getDashboardRoute(role: Role, action: string): string {
  const routes = dashboardRoutes[role]
  if (!routes) {
    return '/dashboard'
  }
  
  // @ts-ignore - dynamic key access
  return routes[action] || routes.dashboard
}

/**
 * Navigate to a dashboard route
 * Use this in client components
 */
export function navigateToRoute(role: Role, action: string, router: any) {
  const route = getDashboardRoute(role, action)
  router.push(route)
}

/**
 * Get all available routes for a role
 */
export function getAvailableRoutes(role: Role): string[] {
  const routes = dashboardRoutes[role]
  if (!routes) {
    return []
  }
  return Object.values(routes)
}

