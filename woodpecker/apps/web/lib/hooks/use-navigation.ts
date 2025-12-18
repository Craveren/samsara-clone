'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from './use-role'
import { getDashboardRoute, navigateToRoute } from '@/lib/routing/dashboard-routes'
import { getDashboardPath } from '@/lib/routing/role-routes'
import type { Role } from '@/lib/roles/role-types'

/**
 * Enhanced Navigation hook for dashboard routing
 * Provides typed navigation functions with error handling and loading states
 */
export function useNavigation() {
  const router = useRouter()
  const { activeRole, isLoading: roleLoading } = useRole()
  const [isNavigating, setIsNavigating] = React.useState(false)

  const navigate = React.useMemo(() => ({
    /**
     * Navigate to a dashboard route by action name
     */
    to: (action: string, roleOverride?: Role) => {
      const targetRole = roleOverride || activeRole
      if (!targetRole) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No role available for navigation')
        }
        router.push('/onboarding/account-type')
        return
      }

      try {
        setIsNavigating(true)
        navigateToRoute(targetRole, action, router)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Navigation error:', error)
        }
      } finally {
        // Reset navigating state after a short delay
        setTimeout(() => setIsNavigating(false), 100)
      }
    },

    /**
     * Navigate to a specific route path
     */
    toPath: (path: string, options?: { replace?: boolean; scroll?: boolean }) => {
      try {
        setIsNavigating(true)
        if (options?.replace) {
          router.replace(path)
        } else {
          router.push(path, { scroll: options?.scroll !== false })
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Navigation error:', error)
        }
      } finally {
        setTimeout(() => setIsNavigating(false), 100)
      }
    },

    /**
     * Navigate to dashboard
     */
    toDashboard: (roleOverride?: Role) => {
      const targetRole = roleOverride || activeRole
      if (!targetRole) {
        router.push('/onboarding/account-type')
        return
      }

      try {
        setIsNavigating(true)
        router.push(getDashboardPath(targetRole))
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Navigation error:', error)
        }
      } finally {
        setTimeout(() => setIsNavigating(false), 100)
      }
    },

    /**
     * Navigate to legacy page
     */
    toLegacy: () => {
      navigate.toPath('/legacy')
    },

    /**
     * Navigate to documents
     */
    toDocuments: () => {
      navigate.toPath('/documents')
    },

    /**
     * Navigate to tasks
     */
    toTasks: () => {
      navigate.toPath('/tasks')
    },

    /**
     * Navigate to communication
     */
    toCommunication: (clientId?: string, lawyerId?: string) => {
      const params = new URLSearchParams()
      if (clientId) params.set('clientId', clientId)
      if (lawyerId) params.set('lawyerId', lawyerId)
      const query = params.toString()
      navigate.toPath(`/communication${query ? `?${query}` : ''}`)
    },

    /**
     * Navigate to settings
     */
    toSettings: () => {
      navigate.toPath('/settings')
    },

    /**
     * Navigate back
     */
    back: () => {
      router.back()
    },

    /**
     * Navigate forward
     */
    forward: () => {
      router.forward()
    },

    /**
     * Navigate to login
     */
    toLogin: () => {
      navigate.toPath('/login')
    },

    /**
     * Navigate to sign up
     */
    toSignUp: (accountType?: Role) => {
      if (accountType) {
        navigate.toPath(`/onboarding/account-type?mode=signup&accountType=${accountType}`)
      } else {
        navigate.toPath('/onboarding/account-type?mode=signup')
      }
    },

    /**
     * Navigate to sign in
     */
    toSignIn: (accountType?: Role) => {
      if (accountType) {
        navigate.toPath(`/onboarding/account-type?mode=signin&accountType=${accountType}`)
      } else {
        navigate.toPath('/onboarding/account-type?mode=signin')
      }
    },
  }), [router, activeRole])

  return {
    navigate,
    router,
    activeRole,
    isNavigating: isNavigating || roleLoading,
    isLoading: roleLoading,
  }
}

