/**
 * Client-Safe Role Types and Constants
 * Can be imported in both client and server components
 */

export type Role = 'client' | 'lawyer' | 'agency' | 'estate-planner' | 'financial-advisor' | 'family'

export interface RoleInfo {
  id: Role
  name: string
  icon: string
  description: string
  dashboardPath: string
  requiresProfile?: boolean // If true, show CompleteProfileModal after creation
}

export const ROLE_INFO: Record<Role, RoleInfo> = {
  client: {
    id: 'client',
    name: 'Client',
    icon: 'solar:user-bold-duotone',
    description: 'Estate Planning Account',
    dashboardPath: '/client/dashboard',
    requiresProfile: false,
  },
  lawyer: {
    id: 'lawyer',
    name: 'Lawyer',
    icon: 'solar:gavel-bold-duotone',
    description: 'Legal Professional Account',
    dashboardPath: '/lawyer/dashboard',
    requiresProfile: false,
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    icon: 'solar:buildings-bold-duotone',
    description: 'Agency Management Account',
    dashboardPath: '/agency/dashboard',
    requiresProfile: false,
  },
  'estate-planner': {
    id: 'estate-planner',
    name: 'Estate Planner',
    icon: 'solar:document-text-bold-duotone',
    description: 'Estate Planning Professional Account',
    dashboardPath: '/estate-planner/dashboard',
    requiresProfile: false,
  },
  'financial-advisor': {
    id: 'financial-advisor',
    name: 'Financial Advisor',
    icon: 'solar:wallet-money-bold-duotone',
    description: 'Financial Planning Professional',
    dashboardPath: '/financial-advisor/dashboard',
    requiresProfile: false,
  },
  family: {
    id: 'family',
    name: 'Family Member',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    description: 'Family Access Account',
    dashboardPath: '/client/dashboard',
    requiresProfile: false,
  },
}

export interface RoleMetadata {
  activeRole: Role | null
  roles: Role[] // All roles user has access to
}

