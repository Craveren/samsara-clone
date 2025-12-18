'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

/**
 * Smart auth redirect - checks user role and redirects to appropriate dashboard
 * or account type selection if no role is set.
 */
export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [status, setStatus] = useState('Checking your account...')

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      // No user - go to landing
      router.push('/')
      return
    }

    // Always redirect to account type selection
    // This allows users to choose which role they want to use
    // Even if they have an existing role, they should be able to switch
    setStatus('Setting up your account...')
    window.location.href = '/onboarding/account-type?mode=signin'
  }, [isLoaded, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Icon icon="solar:bird-bold" className="h-12 w-12 text-foreground" />
        <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground max-w-xs">
          {status}
        </p>
      </div>
    </div>
  )
}



