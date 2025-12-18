/**
 * Notifications Hook
 * Fetches and manages user notifications
 */

import * as React from 'react'
import { useApi } from './use-api'
import { useToast } from './use-toast'
import { useUser } from '@clerk/nextjs'

export interface Notification {
  id: string
  title: string
  description: string
  icon: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  link?: string
}

interface UseNotificationsOptions {
  autoFetch?: boolean
  pollInterval?: number
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { autoFetch = true, pollInterval } = options
  const { toast } = useToast()
  const { request } = useApi()
  const { user } = useUser()
  
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const isLoadingRef = React.useRef(false)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const fetchNotifications = React.useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isLoadingRef.current || !user) return

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)
    
    try {
      // Try API first with abort signal
      const data = await request<{ data?: Notification[] }>(
        '/api/notifications',
        { 
          method: 'GET',
          signal: abortControllerRef.current?.signal,
        },
        { 
          showToast: false,
          retries: 1, // Retry once on failure
        }
      )

      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const notifications = data.data.map((notif: any) => ({
          ...notif,
          createdAt: notif.createdAt instanceof Date 
            ? notif.createdAt 
            : new Date(notif.createdAt || Date.now())
        }))
        setNotifications(notifications)
        return
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(`notifications-${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const notifications = parsed.map((notif: any) => ({
              ...notif,
              createdAt: notif.createdAt instanceof Date 
                ? notif.createdAt 
                : new Date(notif.createdAt || Date.now())
            }))
            setNotifications(notifications)
            return
          }
        } catch (parseError) {
          console.error('Error parsing stored notifications:', parseError)
        }
      }
      
      // No notifications
      setNotifications([])
    } catch (err) {
      // Don't set error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      const error = err instanceof Error ? err : new Error('Failed to fetch notifications')
      setError(error)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching notifications:', error)
      }
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [request, user])

  const markAsRead = React.useCallback(async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    
    // Persist to localStorage
    if (user?.id) {
      const stored = localStorage.getItem(`notifications-${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const updated = parsed.map((n: any) => 
            n.id === id ? { ...n, read: true } : n
          )
          localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updated))
        } catch (err) {
          console.error('Error updating notification:', err)
        }
      }
    }
    
    // Try API
    try {
      await request(`/api/notifications/${id}/read`, { method: 'POST' }, { showToast: false })
    } catch (err) {
      // Silent fail - already updated locally
    }
  }, [request, user])

  const markAllAsRead = React.useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    
    // Persist to localStorage
    if (user?.id) {
      const stored = localStorage.getItem(`notifications-${user.id}`)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const updated = parsed.map((n: any) => ({ ...n, read: true }))
          localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updated))
        } catch (err) {
          console.error('Error updating notifications:', err)
        }
      }
    }
    
    // Try API
    try {
      await request('/api/notifications/read-all', { method: 'POST' }, { showToast: false })
    } catch (err) {
      // Silent fail - already updated locally
    }
  }, [request, user])

  // Auto-fetch on mount - only once
  const hasFetched = React.useRef(false)
  React.useEffect(() => {
    if (autoFetch && !hasFetched.current && user) {
      hasFetched.current = true
      fetchNotifications()
    }
  }, [autoFetch, user]) // Remove fetchNotifications from deps

  // Polling if interval specified with cleanup
  React.useEffect(() => {
    if (!pollInterval || pollInterval <= 0 || !user) return

    // Use ref to track if component is mounted
    let isMounted = true

    const interval = setInterval(() => {
      // Only poll if component is mounted and not currently loading
      if (isMounted && !isLoadingRef.current) {
        fetchNotifications()
      }
    }, pollInterval)

    return () => {
      isMounted = false
      clearInterval(interval)
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [pollInterval, user, fetchNotifications])

  const unreadCount = React.useMemo(() => 
    notifications.filter(n => !n.read).length,
    [notifications]
  )

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}

