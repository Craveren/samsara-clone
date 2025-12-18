/**
 * Session Manager - Handles background session management, token refresh, and permissions
 */

'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/hooks'

interface SessionState {
  isActive: boolean
  lastActivity: number
  expiresAt: number | null
}

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000 // Check every 5 minutes
const WARNING_TIME = 5 * 60 * 1000 // Warn 5 minutes before timeout

/**
 * Hook for managing user session, permissions, and background processes
 */
export function useSessionManager() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const { toast } = useToast()
  const sessionRef = useRef<SessionState>({
    isActive: false,
    lastActivity: Date.now(),
    expiresAt: null,
  })
  const warningShownRef = useRef(false)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Track user activity
  useEffect(() => {
    if (!isLoaded || !user) return

    const updateActivity = () => {
      sessionRef.current.lastActivity = Date.now()
      sessionRef.current.isActive = true
      warningShownRef.current = false
    }

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity)
      })
    }
  }, [isLoaded, user])

  // Check session status periodically
  useEffect(() => {
    if (!isLoaded || !user) {
      sessionRef.current.isActive = false
      return
    }

    const checkSession = () => {
      const now = Date.now()
      const timeSinceActivity = now - sessionRef.current.lastActivity

      // Show warning if approaching timeout
      if (timeSinceActivity > SESSION_TIMEOUT - WARNING_TIME && !warningShownRef.current) {
        warningShownRef.current = true
        toast.info(
          'Session Expiring Soon',
          'Your session will expire in 5 minutes due to inactivity. Click anywhere to continue.',
          { duration: 10000 }
        )
      }

      // Sign out if session expired
      if (timeSinceActivity > SESSION_TIMEOUT) {
        sessionRef.current.isActive = false
        signOut({ redirectUrl: '/' })
          .then(() => {
            toast.info('Session Expired', 'You have been signed out due to inactivity.')
            router.push('/')
          })
          .catch((error) => {
            console.error('Auto sign-out error:', error)
          })
      }
    }

    // Check immediately and then periodically
    checkSession()
    checkIntervalRef.current = setInterval(checkSession, ACTIVITY_CHECK_INTERVAL)

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [isLoaded, user, signOut, router, toast])

  return {
    isActive: sessionRef.current.isActive,
    lastActivity: sessionRef.current.lastActivity,
    timeUntilExpiry: sessionRef.current.expiresAt
      ? Math.max(0, sessionRef.current.expiresAt - Date.now())
      : null,
  }
}

/**
 * Hook for checking and managing user permissions
 */
export function usePermissions() {
  const { user } = useUser()

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const metadata = user.publicMetadata as any
    const role = metadata?.activeRole || metadata?.role

    // Define role-based permissions
    const rolePermissions: Record<string, string[]> = {
      client: [
        'view:own-legacy',
        'edit:own-legacy',
        'view:own-documents',
        'upload:own-documents',
        'view:own-financial',
        'invite:family',
      ],
      lawyer: [
        'view:all-clients',
        'edit:all-clients',
        'view:all-documents',
        'edit:all-documents',
        'view:all-financial',
        'manage:tasks',
        'manage:team',
        'create:templates',
      ],
      'financial-advisor': [
        'view:assigned-clients',
        'view:assigned-financial',
        'edit:assigned-financial',
        'create:financial-plans',
        'view:reports',
      ],
      agency: [
        'view:all-data',
        'edit:all-data',
        'manage:all-users',
        'manage:billing',
        'view:analytics',
      ],
      family: [
        'view:shared-legacy',
        'view:shared-documents',
      ],
    }

    const allowedPermissions = rolePermissions[role] || []
    return allowedPermissions.includes(permission)
  }

  const canAccess = (resource: string, action: string = 'view'): boolean => {
    const permission = `${action}:${resource}`
    return hasPermission(permission)
  }

  return {
    hasPermission,
    canAccess,
    role: (user?.publicMetadata as any)?.activeRole || (user?.publicMetadata as any)?.role || null,
  }
}


