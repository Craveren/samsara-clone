'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import Link from 'next/link'

/**
 * Login Page - Entry point for authentication
 * Redirects to sign-in or sign-up based on user choice
 */
export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="solar:bird-bold" className="h-12 w-12 text-foreground" />
            <h1 className="text-3xl font-bold text-foreground">
              Woodpecker
            </h1>
          </div>
          <p className="text-muted-foreground">
            Estate Planning & Legacy Management
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base"
            onClick={() => {
              // Mark explicit login intent
              sessionStorage.setItem('explicit-login-intent', 'true')
              router.push('/onboarding/account-type?mode=signin')
            }}
          >
            <Icon icon="solar:login-3-bold" className="h-5 w-5 mr-2" />
            Sign In
          </Button>

          <Button
            variant="outline"
            className="w-full border-foreground/20 hover:bg-foreground/5 h-12 text-base"
            onClick={() => {
              // New users don't need explicit login intent - they'll sign up
              router.push('/onboarding/account-type?mode=signup')
            }}
          >
            <Icon icon="solar:user-plus-bold" className="h-5 w-5 mr-2" />
            Create Account
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

