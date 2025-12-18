'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@woodpecker/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { getDashboardPath } from '@/lib/routing/role-routes'

export default function NotFound() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const dashboardPath = React.useMemo(() => {
    if (!user) return '/client/dashboard'
    const role = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as string || 'client'
    return getDashboardPath(role)
  }, [user])

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-3 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in'
    }
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="flex h-full items-center justify-center px-4">
          <Card className="max-w-md w-full border border-border/60 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center border border-border/40">
                <Icon icon="solar:file-remove-bold-duotone" className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">404</CardTitle>
              <CardDescription className="text-base mt-2">
                This page could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  <Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push(dashboardPath)}
                >
                  <Icon icon="solar:home-2-bold-duotone" className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

