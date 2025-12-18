# Routing System Guide

## Overview
The routing system is built on Next.js App Router with role-based access control and consistent navigation patterns.

## Core Routing Files

### 1. `lib/routing/role-routes.ts`
Central routing utilities for role-based paths:
- `getDashboardPath(role)` - Get dashboard path for any role
- `getRoleRoutes(role)` - Get all routes for a role
- `isRouteAccessible(pathname, role)` - Check route access
- `getAuthRedirectPath(role)` - Get redirect after auth

### 2. `lib/routing/dashboard-routes.ts`
Dashboard button routing mappings:
- `getDashboardRoute(role, action)` - Get route by action name
- `navigateToRoute(role, action, router)` - Navigate helper
- `getAvailableRoutes(role)` - Get all available routes

### 3. `lib/hooks/use-navigation.ts`
React hook for typed navigation:
```typescript
const { navigate } = useNavigation()

// Navigate by action
navigate.to('legacy')
navigate.to('documents')
navigate.to('tasks')

// Navigate to specific path
navigate.toPath('/custom/path')

// Navigate to dashboard
navigate.toDashboard()

// Specialized navigation
navigate.toLegacy()
navigate.toDocuments()
navigate.toTasks()
navigate.toCommunication(clientId, lawyerId)
navigate.toSettings()
navigate.toLogin()
navigate.toSignUp(accountType?)
navigate.toSignIn(accountType?)
```

## Route Structure

### Public Routes
- `/` - Landing page
- `/login` - Login entry point
- `/onboarding/account-type` - Account type selection
- `/sign-in/[[...sign-in]]` - Clerk sign-in (requires accountType)
- `/sign-up/[[...sign-up]]` - Clerk sign-up (requires accountType)

### Client Routes (`/client/*`)
- `/client/dashboard` - Client dashboard
- `/client/lawyers` - My lawyers
- `/client/financial` - Financial accounts
- `/client/invitations` - Invitations

### Lawyer Routes (`/lawyer/*`)
- `/lawyer/dashboard` - Lawyer dashboard
- `/lawyer/clients` - Client management
- `/lawyer/cases` - Case management
- `/lawyer/communication` - Communication
- `/lawyer/meetings` - Meetings
- `/lawyer/templates` - Document templates
- `/lawyer/team` - Team management

### Agency Routes (`/agency/*`)
- `/agency/dashboard` - Agency dashboard
- `/agency/lawyers` - Lawyer management
- `/agency/reports` - Reports & analytics
- `/agency/settings` - Agency settings

### Financial Advisor Routes (`/financial-advisor/*`)
- `/financial-advisor/dashboard` - Financial advisor dashboard
- `/financial-advisor/clients` - Client management
- `/financial-advisor/billing` - Billing & invoicing
- `/financial-advisor/team` - Team management

### Shared Routes
- `/legacy` - Legacy journey (client/family)
- `/documents` - Document vault (client/family)
- `/tasks` - Tasks (client/lawyer)
- `/communication` - Communication hub
- `/settings` - Settings (all roles)
- `/interview` - Interview (client)

## Navigation Patterns

### Using `useNavigation` Hook (Recommended)
```typescript
import { useNavigation } from '@/lib/hooks'

function MyComponent() {
  const { navigate } = useNavigation()
  
  return (
    <Button onClick={() => navigate.to('legacy')}>
      View Legacy
    </Button>
  )
}
```

### Using Next.js Link (For static links)
```typescript
import Link from 'next/link'

<Link href="/legacy">View Legacy</Link>
```

### Using router.push (For dynamic navigation)
```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/legacy')
```

## Auth Flow Routes

### New User Sign-Up
1. `/` (Landing) → Click "Get started"
2. `/onboarding/account-type?mode=signup` → Select account type
3. `/sign-up?accountType=client` → Create account
4. Role activation → `/client/dashboard`

### Existing User Sign-In
1. `/` (Landing) → Click "Log in"
2. `/login` → Click "Sign In"
3. `/onboarding/account-type?mode=signin` → Select account type
4. `/sign-in?accountType=client` → Sign in
5. Role activation → `/client/dashboard`

### Logged-In User
- `/` → Auto-redirect to dashboard based on role

## Middleware Protection

The `middleware.ts` file handles:
- Authentication checks
- Role-based route access
- Automatic redirects to correct dashboards
- Public route whitelisting

## Best Practices

1. **Always use `useNavigation` hook** for dashboard navigation
2. **Use `getDashboardPath()`** for role-based redirects
3. **Check route access** before navigation if needed
4. **Use Next.js Link** for static navigation in sidebars
5. **Use router.push** for dynamic navigation in buttons
6. **Never hardcode routes** - use routing utilities

## Common Patterns

### Dashboard Card Navigation
```typescript
const { navigate } = useNavigation()

<Card onClick={() => navigate.to('legacy')}>
  <CardContent>Legacy Journey</CardContent>
</Card>
```

### Sidebar Navigation
```typescript
import Link from 'next/link'

<Link href="/legacy">My Legacy Journey</Link>
```

### Button Navigation
```typescript
const { navigate } = useNavigation()

<Button onClick={() => navigate.toDashboard()}>
  Go to Dashboard
</Button>
```

## Route Access Control

Routes are protected by:
1. Middleware (`middleware.ts`) - Server-side protection
2. Role-based redirects - Automatic routing to correct dashboard
3. Component-level checks - Using `useRole()` hook

## Troubleshooting

### Route not found
- Check if route exists in `dashboard-routes.ts`
- Verify role has access to route
- Check middleware configuration

### Redirect loops
- Ensure role is properly set
- Check middleware redirect logic
- Verify auth state

### Navigation not working
- Use `useNavigation` hook instead of direct router.push
- Check if route is accessible for current role
- Verify Next.js Link href is correct

