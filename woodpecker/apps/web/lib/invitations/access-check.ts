/**
 * User Access Control Hook
 * Checks user permissions and access levels for invitations and shared content
 */

'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRole } from '@/lib/hooks/use-role'
/**het */
export interface UserAccess {
  isViewOnly: boolean
  canManageSettings: boolean
  canEditContent: boolean
  canInviteUsers: boolean
  canDeleteContent: boolean
}

/**
 * Hook to check user access permissions
 * Determines if user has view-only access (e.g., family member) or full access
 */
export function useUserAccess(): UserAccess {
  const { user } = useUser()
  const { activeRole } = useRole()

  // Check if user is a family member (view-only access)
  const isFamilyMember = React.useMemo(() => {
    return activeRole === 'family' || (user?.publicMetadata?.role as string) === 'family'
  }, [activeRole, user])

  // Family members have view-only access
  const isViewOnly = React.useMemo(() => {
    return isFamilyMember
  }, [isFamilyMember])

  // Check if user can manage settings
  // Family members cannot manage settings, only view
  const canManageSettings = React.useMemo(() => {
    return !isFamilyMember && !!user
  }, [isFamilyMember, user])

  // Check if user can edit content
  // Family members can only view, not edit
  const canEditContent = React.useMemo(() => {
    return !isFamilyMember && !!user
  }, [isFamilyMember, user])

  // Check if user can invite other users
  // Only account owners (client, lawyer, etc.) can invite
  const canInviteUsers = React.useMemo(() => {
    if (isFamilyMember) return false
    if (!user) return false
    
    const role = activeRole || (user.publicMetadata?.role as string)
    // Only certain roles can invite users
    return ['client', 'lawyer', 'agency', 'financial-advisor'].includes(role || '')
  }, [isFamilyMember, user, activeRole])

  // Check if user can delete content
  // Family members cannot delete
  const canDeleteContent = React.useMemo(() => {
    return !isFamilyMember && !!user
  }, [isFamilyMember, user])

  return {
    isViewOnly,
    canManageSettings,
    canEditContent,
    canInviteUsers,
    canDeleteContent,
  }
}


