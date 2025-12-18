'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'

/**
 * Legacy route - redirects to unified onboarding/account-type flow.
 * This route is kept for backward compatibility only.
 */
export default function LegacySelectRoleRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const mode = searchParams.get('mode') || 'signup'
    const accountType = searchParams.get('accountType')
    const invitation = searchParams.get('invitation')

    // Build redirect URL
    const target = new URL('/onboarding/account-type', window.location.origin)
    target.searchParams.set('mode', mode)
    if (accountType) target.searchParams.set('accountType', accountType)
    if (invitation) target.searchParams.set('invitation', invitation)

    // Use window.location for reliable redirect
    window.location.replace(target.toString().replace(window.location.origin, ''))
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-2">
          <Icon icon="solar:bird-bold" className="h-6 w-6 text-foreground" />
        </div>
        <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="text-sm font-medium text-foreground">Redirecting to account selection…</p>
      </div>
    </div>
  )
}



