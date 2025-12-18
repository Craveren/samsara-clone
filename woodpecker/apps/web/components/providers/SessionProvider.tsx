'use client'

import { useSessionManager } from '@/lib/auth/session-manager'

/**
 * Session Provider - Wraps the app to manage sessions and permissions
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Initialize session manager for authenticated users
  useSessionManager()
  return <>{children}</>
}


