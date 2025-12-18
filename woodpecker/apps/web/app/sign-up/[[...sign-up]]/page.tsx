'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { getDashboardPath } from '@/lib/routing/role-routes'
import { Bird } from 'lucide-react'
import type { Role } from '@/lib/roles/role-types'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [hasSetRole, setHasSetRole] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const accountType = searchParams.get('accountType') as Role | null
  const invitationToken = searchParams.get('invitation')

  // If no account type specified and user is already signed up, redirect to dashboard
  // If user is not signed up yet, redirect to account type selection
  useEffect(() => {
    if (!accountType && isLoaded) {
      if (user) {
        // User is signed up but no account type - check if they have a role
        const activeRole = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as Role | undefined
        if (activeRole) {
          // User has a role, redirect to their dashboard
          const dashboardPath = getDashboardPath(activeRole)
          router.push(dashboardPath)
        } else {
          // User signed up but no role - redirect to account type selection
          router.push('/onboarding/account-type?mode=signup')
        }
      } else {
        // User not signed up yet - redirect to account type selection
        router.push('/onboarding/account-type?mode=signup')
      }
    }
  }, [accountType, router, isLoaded, user])

  // After signup, set account type and redirect (ONCE)
  // This runs after Clerk redirects back from email verification
  useEffect(() => {
    if (isLoaded && user && accountType && !hasSetRole && !isRedirecting) {
      // Check if role is already set to prevent duplicate activation
      const activeRole = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as Role | undefined
      
      // If role already matches, redirect immediately
      if (activeRole === accountType) {
        setHasSetRole(true)
        setIsRedirecting(true)
        const dashboardPath = getDashboardPath(accountType)
        router.replace(dashboardPath)
        return
      }
      
      // Only activate if role is different or not set
      if (!activeRole || activeRole !== accountType) {
        setHasSetRole(true)
        setIsRedirecting(true)
        
        // Activate role and redirect
        fetch('/api/roles/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: accountType }),
        })
          .then(res => res.json())
          .then(data => {
            // Always redirect to dashboard, even if activation has issues
            const dashboardPath = getDashboardPath(accountType)
            if (invitationToken) {
              router.replace(`/invitations/accept/${invitationToken}`)
            } else {
              router.replace(dashboardPath)
            }
          })
          .catch((error) => {
            console.error('Error activating role:', error)
            // Fallback: redirect to dashboard anyway
            const dashboardPath = getDashboardPath(accountType)
            router.replace(dashboardPath)
          })
      }
    }
  }, [isLoaded, user, accountType, hasSetRole, isRedirecting, invitationToken, router])

  if (!accountType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <div className="h-10 w-10 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-700 max-w-xs text-center">
            Redirecting...
          </p>
        </div>
      </div>
    )
  }

  if (isRedirecting) {
    const accountTypeName = accountType ? accountType.charAt(0).toUpperCase() + accountType.slice(1).replace('-', ' ') : 'account'
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <div className="h-10 w-10 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-700 max-w-xs text-center">
            Getting your {accountTypeName} ready...
          </p>
          <p className="text-xs text-gray-500 text-center">
            This will only take a moment
          </p>
        </div>
      </div>
    )
  }

  // Use a callback URL that will handle role activation
  // This ensures smooth flow: Sign up → Email verification → Callback → Role activation → Dashboard
  const callbackUrl = `/onboarding/account-type?mode=signup&accountType=${accountType}&callback=true${invitationToken ? `&invitation=${invitationToken}` : ''}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center">
              <Bird className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Woodpecker
            </h1>
          </div>
          <p className="text-muted-foreground">
            Create your {accountType.charAt(0).toUpperCase() + accountType.slice(1)} account
          </p>
        </div>
        <SignUp 
          afterSignUpUrl={callbackUrl}
          afterSignInUrl={callbackUrl}
        />
      </div>
    </div>
  )
}
