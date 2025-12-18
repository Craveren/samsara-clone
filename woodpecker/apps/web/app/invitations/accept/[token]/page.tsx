'use client'

import * as React from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { LoadingSpinner } from '@woodpecker/ui'
import { Shield, Mail, CheckCircle2, AlertCircle, ArrowRight, UserPlus } from 'lucide-react'
import { useToast } from '@/lib/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

interface InvitationDetails {
  id: string
  recipientEmail: string
  recipientType: 'lawyer' | 'executor' | 'agency' | 'client' | 'estate-planner' | 'financial-advisor'
  accessLevel: 'view' | 'edit' | 'full'
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  inviterId: string
  inviterType: 'client' | 'professional'
  legacyId?: string
  expiresAt?: string
  isSubAccount?: boolean // Whether this is a sub-account invitation
}

export default function AcceptInvitationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const token = params.token as string
  const email = searchParams.get('email')
  const type = searchParams.get('type') as 'lawyer' | 'executor' | 'agency' | null

  const [invitation, setInvitation] = React.useState<InvitationDetails | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [accepting, setAccepting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch invitation details
  React.useEffect(() => {
    if (!token) return

    const fetchInvitation = async () => {
      try {
        const response = await fetch(`/api/invitations/accept?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load invitation')
          return
        }

        setInvitation(data.data)
      } catch (err) {
        setError('Failed to load invitation')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvitation()
  }, [token])

  const handleAccept = async () => {
    if (!invitation) return

    setAccepting(true)
    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Failed to Accept', data.error || 'Could not accept invitation')
        return
      }

      toast.success('Invitation Accepted', 'You now have access to this legacy')
      
      // Update invitation status in real-time
      setInvitation(prev => prev ? { ...prev, status: 'accepted' as const } : null)
      
      // Show success animation before redirect
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect based on recipient type
      let dashboardPath = '/client/dashboard'
      if (invitation.recipientType === 'executor') {
        dashboardPath = '/executor/dashboard'
      } else if (invitation.recipientType === 'agency') {
        dashboardPath = '/agency/dashboard'
      } else if (invitation.recipientType === 'lawyer') {
        dashboardPath = '/lawyer/dashboard'
      } else if (invitation.recipientType === 'estate-planner') {
        dashboardPath = '/estate-planner/dashboard'
      } else if (invitation.recipientType === 'financial-advisor') {
        dashboardPath = '/financial-advisor/dashboard'
      } else if (invitation.recipientType === 'client') {
        dashboardPath = '/client/dashboard'
      }
      
      // Redirect with success state
      router.push(`${dashboardPath}?invitationAccepted=true&legacyId=${invitation.legacyId || ''}&isSubAccount=${invitation.isSubAccount || false}`)
    } catch (err) {
      toast.error('Error', 'Failed to accept invitation')
      console.error(err)
    } finally {
      setAccepting(false)
    }
  }

  const handleSignUp = () => {
    // Redirect to signup with account type
    // If this is a client invitation from a professional, it's a sub-account
    const accountType = invitation?.recipientType || type || 'client'
    const isSubAccount = invitation?.inviterType === 'professional' && invitation?.recipientType === 'client'
    router.push(`/onboarding/account-type?mode=signup&accountType=${accountType}&invitation=${token}&isSubAccount=${isSubAccount}`)
  }

  const handleSignIn = () => {
    // Redirect to signin with account type
    const accountType = invitation?.recipientType || type || 'client'
    const isSubAccount = invitation?.inviterType === 'professional' && invitation?.recipientType === 'client'
    router.push(`/onboarding/account-type?mode=signin&accountType=${accountType}&invitation=${token}&isSubAccount=${isSubAccount}`)
  }

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-2 border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-foreground">Invitation Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error || 'This invitation link is invalid or has expired.'}
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push('/')}
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if invitation is expired
  const isExpired = invitation.expiresAt && new Date(invitation.expiresAt) < new Date()
  const isAccepted = invitation.status === 'accepted'
  const isRejected = invitation.status === 'rejected'

  // Check if user is signed in and email matches
  const userEmail = user?.emailAddresses[0]?.emailAddress
  const emailMatches = userEmail === invitation.recipientEmail
  const needsAuth = !user || !emailMatches

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full"
      >
        <Card className="w-full border-2 border-border shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              >
                <Shield className="h-5 w-5 text-foreground" />
              </motion.div>
              <CardTitle className="text-2xl text-foreground">Invitation</CardTitle>
            </div>
            <CardDescription>
              You've been invited to collaborate on an estate planning project
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 pt-6">
          {/* Invitation Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Account Type</span>
              <Badge variant="outline" className="capitalize">
                {invitation.recipientType}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">{invitation.recipientEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Access Level</span>
              <Badge variant="secondary" className="capitalize">
                {invitation.accessLevel}
              </Badge>
            </div>
            {invitation.expiresAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="text-sm text-foreground">
                  {new Date(invitation.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {isExpired && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">This invitation has expired</p>
            </div>
          )}

          {isAccepted && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <p className="text-sm text-foreground">This invitation has already been accepted</p>
              </div>
            </div>
          )}

          {isRejected && (
            <div className="p-3 rounded-lg bg-muted border border-border">
              <p className="text-sm text-muted-foreground">This invitation was rejected</p>
            </div>
          )}

          {/* Email Mismatch Warning */}
          {user && !emailMatches && (
            <div className="p-3 rounded-lg bg-foreground/5 border border-border/60">
              <p className="text-sm text-foreground">
                You're signed in as <strong>{userEmail}</strong>, but this invitation is for{' '}
                <strong>{invitation.recipientEmail}</strong>. Please sign out and sign in with the correct email.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <AnimatePresence mode="wait">
            {!isExpired && !isAccepted && !isRejected && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {needsAuth ? (
                  <>
                    <p className="text-sm text-muted-foreground text-center">
                      {user
                        ? 'Please sign in with the email address this invitation was sent to'
                        : 'Sign in or create an account to accept this invitation'}
                    </p>
                    <div className="flex flex-col gap-2">
                      {user ? (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push('/sign-out')}
                        >
                          Sign Out
                        </Button>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              className="w-full bg-foreground text-background hover:bg-foreground/90"
                              onClick={handleSignUp}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Create {invitation.recipientType} Account
                            </Button>
                          </motion.div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleSignIn}
                          >
                            Sign In
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-foreground text-background hover:bg-foreground/90"
                      onClick={handleAccept}
                      disabled={accepting}
                    >
                      {accepting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          Accept Invitation
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isAccepted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <div className="p-4 rounded-lg bg-foreground/5 border border-border/60 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon="solar:check-circle-bold-duotone" className="h-5 w-5 text-foreground" />
                  <p className="text-sm font-medium text-foreground">Invitation Accepted!</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  You've been granted access. You'll be redirected to your dashboard shortly.
                </p>
              </div>
              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                onClick={() => {
                  let dashboardPath = '/client/dashboard'
                  if (invitation.recipientType === 'executor') {
                    dashboardPath = '/executor/dashboard'
                  } else if (invitation.recipientType === 'agency') {
                    dashboardPath = '/agency/dashboard'
                  } else if (invitation.recipientType === 'lawyer') {
                    dashboardPath = '/lawyer/dashboard'
                  } else if (invitation.recipientType === 'estate-planner') {
                    dashboardPath = '/estate-planner/dashboard'
                  } else if (invitation.recipientType === 'financial-advisor') {
                    dashboardPath = '/financial-advisor/dashboard'
                  }
                  router.push(dashboardPath)
                }}
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}
