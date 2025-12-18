/**
 * Unified Activity Feed Hook
 * Centralizes activity fetching and management
 */

import * as React from 'react'
import { useApi } from './use-api'
import { useToast } from './use-toast'

export interface Activity {
  id: string
  type: string
  title: string
  description: string
  icon: string
  color: string
  link?: string
  timestamp: Date
  userId?: string
}

interface UseActivityFeedOptions {
  limit?: number
  autoFetch?: boolean
  pollInterval?: number
}

export function useActivityFeed(options: UseActivityFeedOptions = {}) {
  const { limit = 10, autoFetch = true, pollInterval } = options
  const { toast } = useToast()
  const { request } = useApi()
  
  const [activities, setActivities] = React.useState<Activity[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const isLoadingRef = React.useRef(false)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  
  const fetchActivities = React.useCallback(async () => {
    // Prevent multiple simultaneous fetches using ref
    if (isLoadingRef.current) return

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
      const data = await request<{ data?: Activity[] }>(
        '/api/activities',
        { 
          method: 'GET',
          signal: abortControllerRef.current?.signal,
        },
        { 
          showToast: false, // Don't show toast for background fetches
          retries: 1, // Retry once on failure
        }
      )

      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        // Ensure timestamps are Date objects
        const activities = data.data.map((activity: any) => ({
          ...activity,
          timestamp: activity.timestamp instanceof Date 
            ? activity.timestamp 
            : new Date(activity.timestamp || Date.now())
        }))
        setActivities(activities.slice(0, limit))
        return
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('recent-activities')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Ensure timestamps are Date objects
            const activities = parsed.map((activity: any) => ({
              ...activity,
              timestamp: activity.timestamp instanceof Date 
                ? activity.timestamp 
                : new Date(activity.timestamp || Date.now())
            }))
            setActivities(activities.slice(0, limit))
            return
          }
        } catch (parseError) {
          console.error('Error parsing stored activities:', parseError)
        }
      }
      
      // Only set default if we have no data at all
      setActivities([])
    } catch (err) {
      // Don't set error if request was aborted
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      const error = err instanceof Error ? err : new Error('Failed to fetch activities')
      setError(error)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching activities:', error)
      }
      // Don't set empty array on error, keep existing activities
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [limit, request])

  const addActivity = React.useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date(),
    }
    
    setActivities(prev => [newActivity, ...prev].slice(0, limit))
    
    // Persist to localStorage
    const stored = localStorage.getItem('recent-activities')
    const existing = stored ? JSON.parse(stored) : []
    localStorage.setItem('recent-activities', JSON.stringify([newActivity, ...existing].slice(0, 50)))
  }, [limit])

  // Auto-fetch on mount - only once
  const hasFetched = React.useRef(false)
  React.useEffect(() => {
    if (autoFetch && !hasFetched.current) {
      hasFetched.current = true
      fetchActivities()
    }
  }, [autoFetch]) // Remove fetchActivities from deps to prevent re-runs

  // Polling if interval specified with cleanup
  React.useEffect(() => {
    if (!pollInterval || pollInterval <= 0) return

    // Use ref to track if component is mounted
    let isMounted = true

    const interval = setInterval(() => {
      // Only poll if component is mounted and not currently loading
      if (isMounted && !isLoadingRef.current) {
        fetchActivities()
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
  }, [pollInterval, fetchActivities])

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    addActivity,
    refresh: fetchActivities,
  }
}

