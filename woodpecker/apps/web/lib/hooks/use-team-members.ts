/**
 * Enhanced Hook for managing team members/sub-accounts
 * Includes state management, caching, and optimistic updates
 */

import * as React from 'react'
import { useApi } from './use-api'
import { useToast } from './use-toast'

export interface TeamMember {
  id: string
  email: string
  name: string | null
  role: string
  permissions: string[]
  status: string
  joinedAt: Date | null
  clerkUserId: string
}

interface UseTeamMembersOptions {
  autoFetch?: boolean
  cache?: boolean
}

export function useTeamMembers(options: UseTeamMembersOptions = {}) {
  const { autoFetch = false, cache = true } = options
  const { request, clearCache } = useApi()
  const { toast } = useToast()

  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const isLoadingRef = React.useRef(false)

  const getTeamMembers = React.useCallback(async (): Promise<TeamMember[]> => {
    // Prevent duplicate fetches
    if (isLoadingRef.current) {
      return teamMembers
    }

    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const response = await request<{ subAccounts?: TeamMember[] }>(
        '/api/professionals/sub-accounts',
        {
          method: 'GET',
        },
        {
          showToast: false,
          cache,
        }
      )

      const members = response?.subAccounts || []
      
      // Ensure dates are Date objects
      const formattedMembers = members.map(member => ({
        ...member,
        joinedAt: member.joinedAt 
          ? (member.joinedAt instanceof Date ? member.joinedAt : new Date(member.joinedAt))
          : null,
      }))

      setTeamMembers(formattedMembers)
      return formattedMembers
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load team members')
      setError(error)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching team members:', error)
      }
      toast.error('Failed to load team members')
      return teamMembers // Return existing members on error
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [request, toast, cache, teamMembers])

  const addTeamMember = React.useCallback(
    async (data: { email: string; name?: string; role?: string; permissions?: string[] }) => {
      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticMember: TeamMember = {
        id: tempId,
        email: data.email,
        name: data.name || null,
        role: data.role || 'member',
        permissions: data.permissions || [],
        status: 'pending',
        joinedAt: null,
        clerkUserId: '',
      }

      setTeamMembers(prev => [...prev, optimisticMember])

      try {
        const response = await request<{ success?: boolean; error?: string; member?: TeamMember }>(
          '/api/professionals/sub-accounts',
          {
            method: 'POST',
            body: JSON.stringify(data),
          }
        )

        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to add team member')
        }

        // Replace optimistic member with real one
        if (response.member) {
          setTeamMembers(prev => {
            const filtered = prev.filter(m => m.id !== tempId)
            return [...filtered, {
              ...response.member!,
              joinedAt: response.member!.joinedAt 
                ? (response.member!.joinedAt instanceof Date 
                    ? response.member!.joinedAt 
                    : new Date(response.member!.joinedAt))
                : null,
            }]
          })
        } else {
          // Remove optimistic member and refetch
          setTeamMembers(prev => prev.filter(m => m.id !== tempId))
          await getTeamMembers()
        }

        // Clear cache to ensure fresh data
        clearCache('/api/professionals/sub-accounts')
        toast.success('Team member added successfully')
        return response
      } catch (error: any) {
        // Rollback optimistic update
        setTeamMembers(prev => prev.filter(m => m.id !== tempId))
        toast.error(error.message || 'Failed to add team member')
        throw error
      }
    },
    [request, toast, getTeamMembers, clearCache]
  )

  const updateTeamMember = React.useCallback(
    async (teamMemberId: string, updates: { role?: string; permissions?: string[]; status?: string }) => {
      // Store previous state for rollback
      const previousMember = teamMembers.find(m => m.id === teamMemberId)
      if (!previousMember) {
        throw new Error('Team member not found')
      }

      // Optimistic update
      const optimisticMember: TeamMember = {
        ...previousMember,
        ...updates,
      }

      setTeamMembers(prev => prev.map(m => m.id === teamMemberId ? optimisticMember : m))

      try {
        const response = await request<{ success?: boolean; error?: string; member?: TeamMember }>(
          '/api/professionals/sub-accounts',
          {
            method: 'PATCH',
            body: JSON.stringify({ teamMemberId, ...updates }),
          }
        )

        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to update team member')
        }

        // Update with real data if provided
        if (response.member) {
          setTeamMembers(prev => prev.map(m => 
            m.id === teamMemberId 
              ? {
                  ...response.member!,
                  joinedAt: response.member!.joinedAt 
                    ? (response.member!.joinedAt instanceof Date 
                        ? response.member!.joinedAt 
                        : new Date(response.member!.joinedAt))
                    : null,
                }
              : m
          ))
        } else {
          // Refetch if no member data returned
          await getTeamMembers()
        }

        clearCache('/api/professionals/sub-accounts')
        toast.success('Team member updated successfully')
        return response
      } catch (error: any) {
        // Rollback on error
        if (previousMember) {
          setTeamMembers(prev => prev.map(m => m.id === teamMemberId ? previousMember : m))
        }
        toast.error(error.message || 'Failed to update team member')
        throw error
      }
    },
    [request, toast, teamMembers, getTeamMembers, clearCache]
  )

  const removeTeamMember = React.useCallback(
    async (teamMemberId: string) => {
      // Store previous state for rollback
      const previousMember = teamMembers.find(m => m.id === teamMemberId)
      if (!previousMember) {
        throw new Error('Team member not found')
      }

      // Optimistic update
      setTeamMembers(prev => prev.filter(m => m.id !== teamMemberId))

      try {
        const response = await request<{ success?: boolean; error?: string }>(
          `/api/professionals/sub-accounts?teamMemberId=${teamMemberId}`,
          {
            method: 'DELETE',
          }
        )

        if (!response || !response.success) {
          throw new Error(response?.error || 'Failed to remove team member')
        }

        clearCache('/api/professionals/sub-accounts')
        toast.success('Team member removed successfully')
        return response
      } catch (error: any) {
        // Rollback on error
        if (previousMember) {
          setTeamMembers(prev => [...prev, previousMember])
        }
        toast.error(error.message || 'Failed to remove team member')
        throw error
      }
    },
    [request, toast, teamMembers, clearCache]
  )

  // Auto-fetch on mount if enabled
  React.useEffect(() => {
    if (autoFetch && !isLoadingRef.current) {
      getTeamMembers()
    }
  }, [autoFetch, getTeamMembers])

  return {
    teamMembers,
    isLoading,
    error,
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    refresh: getTeamMembers,
  }
}
