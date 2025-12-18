/**
 * Clean Role Management Hook
 * Handles role switching, creation, and state management
 */

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from './use-toast'
import { useApi } from './use-api'
import type { Role, RoleInfo } from '@/lib/roles/role-types'
import { ROLE_INFO } from '@/lib/roles/role-types'

export interface UseRoleReturn {
  activeRole: Role | null
  availableRoles: Role[]
  isLoading: boolean
  switchRole: (role: Role) => Promise<void>
  refreshRoles: () => Promise<void>
  getRoleInfo: (role: Role) => RoleInfo
}

// Cache for role data to prevent excessive API calls
const roleCache = new Map<string, { activeRole: Role | null; roles: Role[]; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute

export function useRole(): UseRoleReturn {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const { request, clearCache } = useApi()
  const [activeRole, setActiveRole] = React.useState<Role | null>(null)
  const [availableRoles, setAvailableRoles] = React.useState<Role[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Get role metadata from API (source of truth) with caching
  React.useEffect(() => {
    if (!isLoaded || !user) {
      setIsLoading(false)
      return
    }

    const fetchRoles = async () => {
      const cacheKey = user.id
      const cached = roleCache.get(cacheKey)

      // Check cache first
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setActiveRole(cached.activeRole)
        setAvailableRoles(cached.roles)
        setIsLoading(false)
        return
      }

      try {
        const response = await request<{ activeRole: Role | null; roles: Role[] }>(
          '/api/roles/me',
          { method: 'GET' },
          { showToast: false, cache: true } // Don't show toast for this background fetch
        )

        if (response) {
          setActiveRole(response.activeRole)
          setAvailableRoles(response.roles || [])
          // Update cache
          roleCache.set(cacheKey, {
            activeRole: response.activeRole,
            roles: response.roles || [],
            timestamp: Date.now(),
          })
        } else {
          // Fallback to Clerk metadata
          const metadata = user.publicMetadata as any
          const active = (metadata?.activeRole || metadata?.role) as Role | null
          const roles = (metadata?.roles as Role[]) || []
          setActiveRole(active)
          setAvailableRoles(roles)
          // Cache fallback data
          roleCache.set(cacheKey, {
            activeRole: active,
            roles,
            timestamp: Date.now(),
          })
        }
      } catch (error) {
        console.warn('Error fetching roles from API, using Clerk metadata:', error)
        // Fallback to Clerk metadata - this is fine, we can work without DB
        const metadata = user.publicMetadata as any
        const active = (metadata?.activeRole || metadata?.role) as Role | null
        const roles = (metadata?.roles as Role[]) || []
        setActiveRole(active)
        setAvailableRoles(roles)
        // Cache fallback data
        roleCache.set(cacheKey, {
          activeRole: active,
          roles,
          timestamp: Date.now(),
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [isLoaded, user, request])

  // Refresh roles from API (bypasses cache)
  const refreshRoles = React.useCallback(async () => {
    if (!user) return

    // Clear cache for this user
    const cacheKey = user.id
    roleCache.delete(cacheKey)
    clearCache('/api/roles/me')

    try {
      const response = await request<{ activeRole: Role | null; roles: Role[] }>(
        '/api/roles/me',
        { method: 'GET' },
        { cache: false } // Force fresh fetch
      )

      if (response) {
        setActiveRole(response.activeRole)
        setAvailableRoles(response.roles || [])
        // Update cache
        roleCache.set(cacheKey, {
          activeRole: response.activeRole,
          roles: response.roles || [],
          timestamp: Date.now(),
        })
      }
    } catch (error) {
      console.error('Error refreshing roles:', error)
    }
  }, [user, request, clearCache])

  // Switch role (clean, instant switching)
  const switchRole = React.useCallback(async (role: Role) => {
    if (!user || activeRole === role) return

    // Get dashboard path before API call
    const dashboardPath = ROLE_INFO[role].dashboardPath
    const previousRole = activeRole

    try {
      // Make API call first to ensure backend is updated
      const response = await request<{ success: boolean; error?: string }>(
        '/api/roles/activate',
        {
          method: 'POST',
          body: JSON.stringify({ role }),
        }
      )

      if (response?.success) {
        // Update local state after successful API call
        setActiveRole(role)
        setAvailableRoles(prev => {
          if (!prev.includes(role)) {
            return [...prev, role]
          }
          return prev
        })

        // Update cache
        if (user?.id) {
          roleCache.set(user.id, {
            activeRole: role,
            roles: [...availableRoles, role],
            timestamp: Date.now(),
          })
        }

        // Clear API cache to ensure fresh data on next page
        clearCache('/api/roles/me')
        
        // Immediate hard redirect - this ensures:
        // 1. All React state is reset
        // 2. Middleware sees the new role
        // 3. No delays or race conditions
        window.location.href = dashboardPath
      } else {
        throw new Error(response?.error || 'Failed to switch role')
      }
    } catch (error: any) {
      console.error('Error switching role:', error)
      toast.error('Switch failed', error.message || 'Could not switch role')
      throw error // Re-throw so modal can handle it
    }
  }, [user, activeRole, availableRoles, request, toast, clearCache])

  const getRoleInfo = React.useCallback((role: Role): RoleInfo => {
    return ROLE_INFO[role]
  }, [])

  return {
    activeRole,
    availableRoles,
    isLoading,
    switchRole,
    refreshRoles,
    getRoleInfo,
  }
}

