import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/middleware/access-control'
import { getDashboardPath } from '@/lib/routing/role-routes'
import { currentUser } from '@clerk/nextjs/server'

/**
 * Root dashboard - redirects based on user role
 * This is the only /dashboard page - it redirects to role-specific dashboards
 * If user has no role, redirect to account type selection
 */
export default async function DashboardPage() {
  const clerkUser = await currentUser()
  
  // If not authenticated, redirect to landing (home page)
  if (!clerkUser) {
    redirect('/')
  }

  // Check Clerk metadata for activeRole (new system) or role (old system)
  const metadata = clerkUser.publicMetadata as any
  const activeRole = (metadata?.activeRole || metadata?.role) as string | undefined

  if (!activeRole || !['client', 'lawyer', 'agency', 'financial-advisor', 'family'].includes(activeRole)) {
    redirect('/onboarding/account-type')
  }

  // Redirect to role-specific dashboard
  const dashboardPath = getDashboardPath(activeRole as any)
  redirect(dashboardPath)
}
