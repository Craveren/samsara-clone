'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { useToast } from '@/lib/hooks'

/**
 * Sign-out page - handles user logout and cleanup
 */
export default function SignOutPage() {
  const router = useRouter()
  const { signOut, loaded } = useClerk()
  const { user } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (!loaded) return

    const handleSignOut = async () => {
      try {
        // Clear any local storage/session data
        if (typeof window !== 'undefined') {
          // Clear role-related data
          const keysToRemove: string[] = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (
              key.startsWith('onboarding-completed-') ||
              key.startsWith('tour-completed-') ||
              key.startsWith('role-') ||
              key.startsWith('activeRole-') ||
              key.startsWith('lawyer-') ||
              key.startsWith('client-') ||
              key.startsWith('financial-')
            )) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key))

          // Clear session storage
          sessionStorage.clear()
        }

        // Sign out from Clerk
        await signOut({
          redirectUrl: '/',
        })

        // Show success message
        toast.success('Signed out', 'You have been successfully signed out.')

        // Redirect to home page
        router.push('/')
      } catch (error: any) {
        console.error('Sign out error:', error)
        toast.error('Sign out failed', error.message || 'Failed to sign out. Please try again.')
        
        // Still redirect to home even if sign out fails
        router.push('/')
      }
    }

    handleSignOut()
  }, [loaded, signOut, router, toast])

  // Show loading state while signing out
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}
