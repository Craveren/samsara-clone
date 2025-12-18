'use client'

import { useEffect } from 'react'
import { Icon } from '@iconify/react'

/**
 * Legacy route - redirects to unified onboarding flow
 * This route is kept for backward compatibility only.
 */
export default function ChooseAccountTypePage() {
  useEffect(() => {
    // Use window.location for reliable redirect
    window.location.replace('/onboarding/account-type')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center mb-2">
          <Icon icon="solar:bird-bold" className="h-6 w-6 text-white" />
        </div>
        <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-700">Redirecting to account selection…</p>
      </div>
    </div>
  )
}
