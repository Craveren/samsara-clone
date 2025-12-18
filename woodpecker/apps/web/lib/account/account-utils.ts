import { type UserRole } from '@/lib/roles/role-types'

const pathRoleMap: Record<string, UserRole> = {
  client: 'client',
  lawyer: 'lawyer',
  agency: 'agency',
  'estate-planner': 'estate-planner',
  'financial-advisor': 'financial-advisor',
  family: 'family',
}

/**
 * Infer account type from the first path segment.
 * Examples:
 *   /client/dashboard -> client
 *   /lawyer/cases     -> lawyer
 */
export function getAccountTypeFromPath(pathname: string): UserRole | null {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const first = segments[0]
  return pathRoleMap[first] ?? null
}

