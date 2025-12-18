import Link from 'next/link'
import { Button } from '@woodpecker/ui'
import { Shield, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-6">
        <div className="h-16 w-16 rounded-sm bg-muted flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Unauthorized Access
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact support if you believe this is an error.
        </p>
        <Link href="/onboarding/account-type">
          <Button className="bg-black text-white hover:bg-black/90">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

