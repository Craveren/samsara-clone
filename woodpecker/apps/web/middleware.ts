import { authMiddleware, clerkClient } from '@clerk/nextjs'
import { NextResponse, type NextRequest } from 'next/server'
import { getAccountTypeFromPath } from '@/lib/account/account-utils'
import { getDashboardPath, getRoleRoutes, isRouteAccessible } from '@/lib/routing/role-routes'
import type { Role } from '@/lib/roles/role-types'

// Check if Clerk keys are configured
const hasClerkKeys = !!(
  process.env.CLERK_SECRET_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
)

// Public routes that don't require authentication
const publicRoutePatterns = [
  /^\/$/,
  /^\/landing/,
  /^\/onboarding(.*)/,
  /^\/auth-callback(.*)/,
  /^\/auth-redirect(.*)/,
  /^\/pricing/,
  /^\/sign-in(.*)/,
  /^\/sign-up(.*)/,
  /^\/sign-out(.*)/,
  /^\/invitations\/accept(.*)/,
  /^\/api\/roles(.*)/,
  /^\/api\/webhooks(.*)/,
  /^\/api\/auth\/set-account-type/,
  /^\/api\/users(.*)/,
  /^\/api\/invitations\/accept(.*)/,
]

// API routes that require authentication but are role-agnostic
const authenticatedApiRoutes = [
  /^\/api\/activities/,
  /^\/api\/documents/,
  /^\/api\/conversations/,
  /^\/api\/notifications/,
  /^\/api\/financial/,
  /^\/api\/banking/,
  /^\/api\/subscriptions/,
  /^\/api\/invitations(?!\/accept)/,
  /^\/api\/professionals/,
  /^\/api\/ai\/chat/,
  /^\/api\/stream\/token/,
]

// Shared routes that multiple roles can access
const sharedRoutePatterns = [
  /^\/shared(.*)/,
  /^\/communication(.*)/,
  /^\/documents(.*)/,
  /^\/tasks(.*)/,
]

// Role-specific route prefixes
const roleRoutePrefixes: Record<Role, string[]> = {
  'client': ['/client', '/legacy', '/people', '/interview', '/subscription', '/planning', '/automation', '/services', '/documents', '/tasks', '/communication'],
  'lawyer': ['/lawyer'],
  'agency': ['/agency'],
  'estate-planner': ['/estate-planner'],
  'financial-advisor': ['/financial-advisor'],
  'family': ['/client', '/legacy', '/people'],
}

// Static file extensions to bypass middleware
const staticFileExtensions = [
  '.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  '.css', '.js', '.json', '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.webm', '.pdf', '.zip', '.txt'
]

const matchRoute = (pathname: string, patterns: RegExp[]): boolean =>
  patterns.some((pattern) => pattern.test(pathname))

const isStaticFile = (pathname: string): boolean =>
  staticFileExtensions.some(ext => pathname.endsWith(ext))

// Enhanced in-memory cache for role lookups with better TTL management
interface CacheEntry {
  role: string | null
  timestamp: number
  retries: number
}

const roleCache = new Map<string, CacheEntry>()
const CACHE_TTL = 60000 // 1 minute cache
const MAX_RETRIES = 3
const RETRY_DELAY = 30000 // 30 seconds
const MAX_CACHE_SIZE = 1000 // Prevent memory leaks

/**
 * Clean old cache entries to prevent memory leaks
 */
function cleanCache(): void {
  if (roleCache.size <= MAX_CACHE_SIZE) return

  const now = Date.now()
  const entriesToDelete: string[] = []

  for (const [key, entry] of roleCache.entries()) {
    // Remove entries older than 5 minutes
    if (now - entry.timestamp > 300000) {
      entriesToDelete.push(key)
    }
  }

  entriesToDelete.forEach(key => roleCache.delete(key))
}

/**
 * Get role from cache or fetch from Clerk
 */
async function getRoleFromCacheOrClerk(userId: string): Promise<string | null> {
  // Clean cache periodically
  if (roleCache.size > MAX_CACHE_SIZE) {
    cleanCache()
  }

  // Check cache first
  const cached = roleCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.role
  }

  // Check if we should retry (rate limiting protection)
  const errorCache = roleCache.get(`${userId}_error`)
  if (errorCache && Date.now() - errorCache.timestamp < RETRY_DELAY) {
    // Use cached role if available, otherwise return null
    return cached?.role || null
  }

  try {
    const user = await clerkClient.users.getUser(userId)
    const role =
      (user.publicMetadata?.activeRole as string) ||
      (user.publicMetadata?.role as string) ||
      (user.privateMetadata?.role as string) ||
      null

    // Update cache
    roleCache.set(userId, { role, timestamp: Date.now(), retries: 0 })
    roleCache.delete(`${userId}_error`)

    return role
  } catch (err: any) {
    // Handle rate limiting
    if (err?.status === 429 || err?.code === 'too_many_requests') {
      const errorEntry: CacheEntry = errorCache || { role: null, timestamp: Date.now(), retries: 0 }
      errorEntry.retries = (errorEntry.retries || 0) + 1
      roleCache.set(`${userId}_error`, errorEntry)

      // Use cached role if available
      if (cached) {
        return cached.role
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Middleware] Rate limited for user ${userId}, using cached role`)
      }
      return null
    }

    // Log other errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Middleware] Error fetching role from Clerk:', err)
    }

    // Use cached role if available
    return cached?.role || null
  }
}

/**
 * Check if a route is accessible by a specific role
 */
function canAccessRoute(pathname: string, role: Role): boolean {
  // Check shared routes first
  if (matchRoute(pathname, sharedRoutePatterns)) {
    return true
  }

  // Check role-specific routes
  const allowedPrefixes = roleRoutePrefixes[role] || []
  const isAllowedRoute = allowedPrefixes.some(prefix => pathname.startsWith(prefix))

  // Special cases
  if (role === 'family' && pathname.startsWith('/client')) {
    return true
  }

  // Check if route is in role's allowed routes
  if (isRouteAccessible(pathname, role)) {
    return true
  }

  return isAllowedRoute
}

/**
 * Get role from session claims or cache
 */
async function getUserRole(userId: string, sessionClaims: any): Promise<string | null> {
  // Try session claims first (fastest)
  let role =
    sessionClaims?.publicMetadata?.activeRole ||
    sessionClaims?.metadata?.activeRole ||
    sessionClaims?.publicMetadata?.role ||
    sessionClaims?.metadata?.role ||
    sessionClaims?.role ||
    null

  // If not in session claims, check cache or fetch from Clerk
  if (!role) {
    role = await getRoleFromCacheOrClerk(userId)
  }

  return role
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Only add CSP in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    )
  }

  return response
}

/**
 * Check if route requires role-specific access
 */
function requiresRoleSpecificAccess(pathname: string): boolean {
  // API routes that are role-agnostic
  if (matchRoute(pathname, authenticatedApiRoutes)) {
    return false
  }

  // Shared routes don't require role-specific access
  if (matchRoute(pathname, sharedRoutePatterns)) {
    return false
  }

  // Check if it's a role-specific route
  return Object.keys(roleRoutePrefixes).some(role => {
    const prefixes = roleRoutePrefixes[role as Role]
    return prefixes.some(prefix => pathname.startsWith(prefix))
  })
}

const securedMiddleware = authMiddleware({
  publicRoutes: (req) => {
    const pathname = req.nextUrl.pathname
    
    // Bypass static files
    if (isStaticFile(pathname)) {
      return true
    }

    return matchRoute(pathname, publicRoutePatterns)
  },

  async afterAuth(auth, req) {
    const { userId, orgId, sessionClaims } = auth
    const pathname = req.nextUrl.pathname

    // Bypass static files early
    if (isStaticFile(pathname)) {
      return NextResponse.next()
    }

    // Allow public routes
    if (matchRoute(pathname, publicRoutePatterns)) {
      return addSecurityHeaders(NextResponse.next())
    }

    // Handle unauthenticated users
    if (!userId) {
      if (pathname.startsWith('/onboarding')) {
        return addSecurityHeaders(NextResponse.next())
      }
      
      // For API routes, return 401 instead of redirect
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401, headers: { 'X-Content-Type-Options': 'nosniff' } }
        )
      }
      
      // Redirect to home for unauthenticated access to protected routes
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Multi-tenancy: Validate organization membership for protected routes
    // Allow access to onboarding, account selection, and auth pages without organization
    // Also allow access to role-specific dashboards during initial setup
    const requiresOrganization = !matchRoute(pathname, [
      /^\/onboarding(.*)/,
      /^\/sign-up(.*)/,
      /^\/sign-in(.*)/,
      /^\/api\/roles(.*)/,
      /^\/auth-redirect(.*)/,
      /^\/auth-callback(.*)/,
      /^\/invitations\/accept(.*)/,
    ])

    // Only require organization for routes that actually need it
    // Don't block users from accessing their dashboards during initial setup
    if (requiresOrganization && !orgId) {
      // Check if user has a role - if they do, allow them to proceed (org will be created if needed)
      const role = await getUserRole(userId, sessionClaims) as Role | null
      const allowedRoles: Role[] = ['client', 'lawyer', 'agency', 'estate-planner', 'financial-advisor', 'family']
      
      // If user has a valid role but no org, allow access (org creation can happen in background)
      // This prevents redirect loops during sign-in
      if (role && allowedRoles.includes(role)) {
        // Allow access - organization will be created/assigned during role activation
        // Don't block the user from accessing their dashboard
      } else {
        // For API routes, return 400
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Organization context required. Please select or create an organization.' },
            { status: 400, headers: { 'X-Content-Type-Options': 'nosniff' } }
          )
        }
        
        // Redirect to account type selection if no role
        return NextResponse.redirect(new URL('/onboarding/account-type?mode=signin', req.url))
      }
    }

    // Add organization context to request headers for downstream use
    const response = NextResponse.next()
    if (orgId) {
      response.headers.set('X-Organization-ID', orgId)
    }

    // Get user role
    const role = await getUserRole(userId, sessionClaims) as Role | null

    const allowedRoles: Role[] = ['client', 'lawyer', 'agency', 'estate-planner', 'financial-advisor', 'family']

    // Handle users without a role or with invalid roles
    if (!role || !allowedRoles.includes(role)) {
      // Allow access to onboarding and auth pages
      if (
        pathname.startsWith('/onboarding/account-type') ||
        pathname.startsWith('/sign-up') ||
        pathname.startsWith('/sign-in') ||
        pathname.startsWith('/login')
      ) {
        return addSecurityHeaders(NextResponse.next())
      }

      // For API routes, return 403 instead of redirect
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Role not assigned. Please complete account setup.' },
          { status: 403, headers: { 'X-Content-Type-Options': 'nosniff' } }
        )
      }

      // Redirect to account type selection for protected routes
      if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/sign-')) {
        return NextResponse.redirect(new URL('/onboarding/account-type', req.url))
      }

      return addSecurityHeaders(NextResponse.next())
    }

    // Allow authenticated API routes (role-agnostic)
    if (matchRoute(pathname, authenticatedApiRoutes)) {
      return addSecurityHeaders(NextResponse.next())
    }

    // Allow shared routes for all authenticated users
    if (matchRoute(pathname, sharedRoutePatterns)) {
      return addSecurityHeaders(NextResponse.next())
    }

    // Get account type from path
    const pathAccountType = getAccountTypeFromPath(pathname)

    // Handle path-based role mismatch
    if (pathAccountType && pathAccountType !== role) {
      // Family members can access client routes
      if (pathAccountType === 'client' && role === 'family') {
        return addSecurityHeaders(NextResponse.next())
      }

      // For API routes, return 403 instead of redirect
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Access denied. This route is not accessible for your role.' },
          { status: 403, headers: { 'X-Content-Type-Options': 'nosniff' } }
        )
      }

      // Redirect to user's dashboard if they're trying to access another role's routes
      const dashboardPath = getDashboardPath(role)
      return NextResponse.redirect(new URL(dashboardPath, req.url))
    }

    // Strict role-based access control - prevent cross-role access
    // Check each role's routes and redirect if user doesn't match
    for (const [routeRole, prefixes] of Object.entries(roleRoutePrefixes)) {
      if (pathname.startsWith('/' + routeRole) && role !== routeRole) {
        // For API routes, return 403
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Access denied for this role.' },
            { status: 403, headers: { 'X-Content-Type-Options': 'nosniff' } }
          )
        }

        const dashboardPath = getDashboardPath(role)
        return NextResponse.redirect(new URL(dashboardPath, req.url))
      }
    }

    // Ensure users can only access routes for their role
    if (!canAccessRoute(pathname, role)) {
      // Check if it's a generic route that should be redirected to role-specific dashboard
      if (pathname === '/dashboard' || pathname === '/') {
        const dashboardPath = getDashboardPath(role)
        return NextResponse.redirect(new URL(dashboardPath, req.url))
      }

      // For API routes, return 403
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Access denied. This route is not accessible for your role.' },
          { status: 403, headers: { 'X-Content-Type-Options': 'nosniff' } }
        )
      }

      // Redirect to user's dashboard for unauthorized route access
      const dashboardPath = getDashboardPath(role)
      return NextResponse.redirect(new URL(dashboardPath, req.url))
    }

    // Additional role-specific route protection (redundant but explicit)
    const roleChecks: Array<{ prefix: string; allowedRoles: Role[] }> = [
      { prefix: '/lawyer', allowedRoles: ['lawyer'] },
      { prefix: '/client', allowedRoles: ['client', 'family'] },
      { prefix: '/estate-planner', allowedRoles: ['estate-planner'] },
      { prefix: '/financial-advisor', allowedRoles: ['financial-advisor'] },
      { prefix: '/agency', allowedRoles: ['agency'] },
    ]

    for (const { prefix, allowedRoles: allowed } of roleChecks) {
      if (pathname.startsWith(prefix) && !allowed.includes(role)) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Access denied for this role.' },
            { status: 403, headers: { 'X-Content-Type-Options': 'nosniff' } }
          )
        }
        return NextResponse.redirect(new URL(getDashboardPath(role), req.url))
      }
    }

    // Ensure role-specific isolation - redirect if user tries to access wrong role's routes
    // Check if pathname is allowed for this role using roleRoutePrefixes
    const allowedPrefixes = roleRoutePrefixes[role] || []
    const isAllowedRoute = allowedPrefixes.some(prefix => pathname.startsWith(prefix))
    
    // Also check shared routes
    const isSharedRoute = matchRoute(pathname, sharedRoutePatterns)
    
    // If route requires role-specific access and user doesn't have access, redirect
    if (requiresRoleSpecificAccess(pathname) && !isAllowedRoute && !isSharedRoute &&
        !matchRoute(pathname, publicRoutePatterns) && 
        !matchRoute(pathname, authenticatedApiRoutes)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Access denied. This route is not accessible for your role.' },
          { status: 403, headers: { 'X-Content-Type-Options': 'nosniff' } }
        )
      }
      return NextResponse.redirect(new URL(getDashboardPath(role), req.url))
    }

    // Redirect generic dashboard to role-specific dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(getDashboardPath(role), req.url))
    }

    // All checks passed - allow access with security headers and organization context
    return addSecurityHeaders(response)
  },
})

// Export the appropriate middleware depending on env presence
export default function middleware(req: NextRequest) {
  // Bypass static files early
  if (isStaticFile(req.nextUrl.pathname)) {
    return NextResponse.next()
  }

  if (!hasClerkKeys) {
    // Bypass auth if keys are missing (development safety)
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Middleware] Clerk keys not configured, bypassing authentication')
    }
    return addSecurityHeaders(NextResponse.next())
  }
  
  // Delegate to secured middleware
  // @ts-ignore - Next.js middleware signature compatibility
  return securedMiddleware(req)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
  ],
}
