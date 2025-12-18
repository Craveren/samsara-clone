'use client'

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'

export default function AuthGuardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  )
}

