/**
 * Hook to get current account type information
 */

'use client'

import { useUser } from '@clerk/nextjs'
import { useRole } from '@/lib/hooks/use-role'
import { ROLE_INFO, type Role } from '@/lib/roles/role-types'

export interface AccountOption {
  id: Role
  name: string
  description: string
  icon: string
  dashboardPath: string
}

export function useAccountOption(): AccountOption {
  const { user } = useUser()
  const { activeRole } = useRole()

  // Get role from activeRole or fallback to user metadata
  const role: Role = activeRole || 
    (user?.publicMetadata?.activeRole as Role) || 
    (user?.publicMetadata?.role as Role) || 
    'client'

  const roleInfo = ROLE_INFO[role]

  return {
    id: role,
    name: roleInfo.name,
    description: roleInfo.description,
    icon: roleInfo.icon,
    dashboardPath: roleInfo.dashboardPath,
  }
}


