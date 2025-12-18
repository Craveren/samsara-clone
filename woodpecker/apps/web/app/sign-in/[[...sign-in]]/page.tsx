'use client'

import { SignIn, useClerk } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getDashboardPath } from '@/lib/routing/role-routes'
import { Icon } from '@iconify/react'
import { useUser } from '@clerk/nextjs'
import type { Role } from '@/lib/roles/role-types'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)
  const accountType = searchParams.get('accountType') as Role | null
  const forceSignOut = searchParams.get('forceSignOut') === 'true'

  // Handle force sign out for account switching
  useEffect(() => {
    if (forceSignOut && isLoaded && user && !isSwitchingAccount) {
      setIsSwitchingAccount(true)
      signOut({ redirectUrl: window.location.href.split('?')[0] + '?accountType=' + accountType })
      return
    }
  }, [forceSignOut, isLoaded, user, isSwitchingAccount, signOut, accountType])

  // If no account type specified, redirect to onboarding
  useEffect(() => {
    if (!accountType && !forceSignOut) {
      router.push('/onboarding/account-type?mode=signin')
    }
  }, [accountType, router, forceSignOut])

  // After successful sign-in, activate role and redirect (ONCE)
  // Only if user explicitly started the login process
  useEffect(() => {
    const explicitLogin = sessionStorage.getItem('explicit-login-intent') === 'true'
    
    if (isLoaded && user && accountType && !forceSignOut && !isSwitchingAccount && explicitLogin) {
      let isHandling = false
      let hasRedirected = false
      
      const activateAndRedirect = async () => {
        if (isHandling || hasRedirected) return
        isHandling = true
        
        // Clear the explicit login intent immediately to prevent loops
        sessionStorage.removeItem('explicit-login-intent')
        
        try {
          // Check if role is already active to prevent duplicate activation
          const activeRole = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as Role | undefined
          
          // Only activate if role is different
          if (!activeRole || activeRole !== accountType) {
            const response = await fetch('/api/roles/activate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: accountType }),
            })
            
            const data = await response.json()
            
            // Always redirect after activation attempt (even if it fails)
            // The middleware will handle organization requirements
              hasRedirected = true
              const dashboardPath = getDashboardPath(accountType)
            // Use window.location.replace for immediate redirect without history
            window.location.replace(dashboardPath)
          } else {
            // Role already active, redirect immediately
            hasRedirected = true
            const dashboardPath = getDashboardPath(accountType)
            window.location.replace(dashboardPath)
          }
        } catch (error) {
          console.error('Error activating role:', error)
          // Still redirect to dashboard even if activation fails
          // The middleware will handle any missing organization requirements
          if (!hasRedirected) {
            hasRedirected = true
            const dashboardPath = getDashboardPath(accountType)
            window.location.replace(dashboardPath)
          }
        } finally {
          isHandling = false
        }
      }
      
      // Small delay to ensure Clerk session is fully established
      const timer = setTimeout(() => {
        activateAndRedirect()
      }, 300)
      
      return () => {
        clearTimeout(timer)
        isHandling = false
      }
    }
  }, [isLoaded, user, accountType, forceSignOut, isSwitchingAccount])

  if (isSwitchingAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <div className="h-10 w-10 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-700 max-w-xs text-center">
            Signing out...
          </p>
        </div>
      </div>
    )
  }

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

  // Determine redirect URL based on account type
  const redirectUrl = getDashboardPath(accountType)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="solar:bird-bold" className="h-12 w-12 text-foreground" />
            <h1 className="text-3xl font-bold text-foreground">
              Woodpecker
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sign in as {accountType.charAt(0).toUpperCase() + accountType.slice(1)}
          </p>
        </div>

        <SignIn 
          afterSignInUrl={redirectUrl}
          afterSignUpUrl={`/onboarding/account-type?mode=signup`}
          signUpFallbackRedirectUrl={`/onboarding/account-type?mode=signup`}
        />
      </div>
    </div>
  )
}
