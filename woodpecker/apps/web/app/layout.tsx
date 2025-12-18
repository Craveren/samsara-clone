import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import React from 'react'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { KeyboardShortcutsProvider } from '@/components/keyboard/KeyboardShortcuts'
import { ToastProvider } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { ThemeProvider } from '@/lib/themes/theme-provider'
import '@/lib/themes/clear-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Woodpecker',
  description: 'Lawyers and clients portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  // If no Clerk key, render without ClerkProvider (development mode)
  // But still render children so the app works
  if (!publishableKey) {
    console.warn('⚠️  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not found - running without authentication')
  }
  
  const content = (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <SessionProvider>
              <KeyboardShortcutsProvider>
                {children}
              </KeyboardShortcutsProvider>
            </SessionProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )

  // Always wrap with ClerkProvider and ThemeProvider together for consistency
  // This ensures ThemeProvider always has access to Clerk context
  if (!publishableKey) {
    // Use a placeholder key - ClerkProvider will handle it gracefully
    return (
      <ClerkProvider publishableKey="pk_test_placeholder">
        <ThemeProvider>
          {content}
        </ThemeProvider>
      </ClerkProvider>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ThemeProvider>
        {content}
      </ThemeProvider>
    </ClerkProvider>
  )
}



