/**
 * Improved Onboarding Account Type Selection
 * Handles both new users and existing users with multiple roles
 * Never assumes role - always lets user choose
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { BackgroundPaths } from '@/components/ui/shadcn-io/background-paths'
import { ROLE_INFO, type Role } from '@/lib/roles/role-types'
import { useRole } from '@/lib/hooks/use-role'
import { useApi } from '@/lib/hooks/use-api'
import { useToast } from '@/lib/hooks'

type AccountType = 'client' | 'lawyer' | 'agency' | 'estate-planner' | 'financial-advisor'

interface AccountOption {
  id: AccountType
  name: string
  icon: string
  description: string
  professionalDescription: string
  features: string[]
  signUpPath: string
  signInPath: string
  story: string
}

const accountOptions: AccountOption[] = [
  {
    id: 'client',
    name: 'Client',
    icon: 'solar:user-bold-duotone',
    description: 'Estate Planning Account',
    professionalDescription: 'Comprehensive estate planning and legacy management platform for individuals seeking to organize, preserve, and transfer their assets with precision and security.',
    features: [
      'Secure document storage and management',
      'Digital legacy preservation and storytelling',
      'Beneficiary and trust administration',
      'Professional collaboration tools',
      'Comprehensive estate planning workflows',
    ],
    signUpPath: '/sign-up?accountType=client',
    signInPath: '/sign-in?accountType=client',
    story: 'You are planning your legacy. Every document, every story, every wish matters. Woodpecker helps you organize, preserve, and share your legacy with those who matter most.',
  },
  {
    id: 'lawyer',
    name: 'Lawyer',
    icon: 'solar:gavel-bold-duotone',
    description: 'Legal Professional Account',
    professionalDescription: 'Advanced practice management system designed for estate planning attorneys to efficiently manage client portfolios, legal documentation, and execution workflows.',
    features: [
      'Multi-client portfolio management',
      'Legal document generation and templates',
      'Client communication and collaboration',
      'Execution workflow automation',
      'Compliance and regulatory tracking',
    ],
    signUpPath: '/sign-up?accountType=lawyer',
    signInPath: '/sign-in?accountType=lawyer',
    story: 'You guide clients through their most important decisions. Woodpecker empowers you to manage multiple portfolios, streamline workflows, and deliver exceptional service.',
  },
  {
    id: 'agency',
    name: 'Agency',
    icon: 'solar:buildings-bold-duotone',
    description: 'Agency Management Account',
    professionalDescription: 'Enterprise-grade platform for estate planning agencies to coordinate multiple legal professionals, manage client relationships, and deliver comprehensive estate planning services at scale.',
    features: [
      'Team and resource management',
      'Client relationship management (CRM)',
      'Agency-wide reporting and analytics',
      'Billing and financial management',
      'Scalable workflow orchestration',
    ],
    signUpPath: '/sign-up?accountType=agency',
    signInPath: '/sign-in?accountType=agency',
    story: 'You coordinate teams and deliver excellence at scale. Woodpecker provides the infrastructure to manage resources, track performance, and grow your practice.',
  },
  {
    id: 'estate-planner',
    name: 'Estate Planner',
    icon: 'solar:document-text-bold-duotone',
    description: 'Estate Planning Professional',
    professionalDescription: 'Professional estate planning platform designed for individual estate planners to manage client relationships, create comprehensive estate plans, and deliver personalized estate planning services.',
    features: [
      'Client portfolio management',
      'Estate plan creation and templates',
      'Client communication and collaboration',
      'Document management and storage',
      'Billing and invoicing',
    ],
    signUpPath: '/sign-up?accountType=estate-planner',
    signInPath: '/sign-in?accountType=estate-planner',
    story: 'You help clients create comprehensive estate plans. Manage client relationships, create personalized plans, and grow your estate planning practice.',
  },
  {
    id: 'financial-advisor',
    name: 'Financial Advisor',
    icon: 'solar:wallet-money-bold-duotone',
    description: 'Financial Planning Professional',
    professionalDescription: 'Advanced financial planning platform for advisors to manage client portfolios, investment strategies, retirement planning, and comprehensive wealth management services.',
    features: [
      'Client portfolio management',
      'Investment strategy tools',
      'Financial plan creation',
      'Client billing & invoicing',
      'Team collaboration',
      'Advanced analytics & reporting',
    ],
    signUpPath: '/sign-up?accountType=financial-advisor',
    signInPath: '/sign-in?accountType=financial-advisor',
    story: 'You help clients secure their financial future. Manage portfolios, create strategies, and grow your practice with powerful tools designed for financial professionals.',
  },
]

export default function OnboardingAccountTypePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  const { activeRole, availableRoles, switchRole, isLoading: roleLoading } = useRole()
  const { request } = useApi()
  const { toast } = useToast()
  const [selectedType, setSelectedType] = React.useState<AccountType | null>(null)
  const [hoveredType, setHoveredType] = React.useState<AccountType | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [mode, setMode] = React.useState<'signin' | 'signup'>(() => {
    const modeParam = searchParams.get('mode')
    return (modeParam === 'signup' || modeParam === 'signin') ? modeParam : 'signin'
  })
  const isCallback = searchParams.get('callback') === 'true'

  // Handle browser back/forward navigation
  React.useEffect(() => {
    const handlePopState = () => {
      // When user navigates back/forward, update state from URL
      const modeParam = searchParams.get('mode')
      const accountTypeParam = searchParams.get('accountType') as AccountType | null
      
      if (modeParam && (modeParam === 'signup' || modeParam === 'signin')) {
        setMode(modeParam)
      }
      
      if (accountTypeParam) {
        setSelectedType(accountTypeParam)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [searchParams])
  
  // Check for invitation token and account type
  const invitationToken = searchParams.get('invitation')
  const accountType = searchParams.get('accountType') as AccountType | null
  const isSubAccount = searchParams.get('isSubAccount') === 'true'
  const invitationAccountType = accountType // Use same accountType for invitations

  // Auto-select account type if coming from invitation
  React.useEffect(() => {
    if (invitationAccountType && !selectedType) {
      setSelectedType(invitationAccountType)
    }
  }, [invitationAccountType, selectedType])

  // If user is logged in, they can select any role (new users) or switch between existing roles
  const hasExistingRoles = isLoaded && user && availableRoles.length > 0
  const isNewUser = isLoaded && user && availableRoles.length === 0 && !activeRole

  // Handle callback from sign-up: activate role and redirect to dashboard IMMEDIATELY
  React.useEffect(() => {
    if (isLoaded && user && accountType && isCallback && !isProcessing) {
      setIsProcessing(true)
      
      // Activate role immediately and redirect - no delays
      const activateRole = async () => {
        try {
          // Check if role is already active
          const currentActiveRole = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as Role | undefined
          
          if (currentActiveRole === accountType) {
            // Role already active, redirect immediately
            const { getDashboardPath } = await import('@/lib/routing/role-routes')
            const dashboardPath = getDashboardPath(accountType)
            window.location.replace(dashboardPath) // Use window.location for immediate redirect
            return
          }
          
          // Activate role
          const response = await fetch('/api/roles/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: accountType }),
          })
          
          await response.json() // Don't wait for response details
          
          // Always redirect to dashboard immediately
          const { getDashboardPath } = await import('@/lib/routing/role-routes')
          const dashboardPath = getDashboardPath(accountType)
          
          if (invitationToken) {
            window.location.replace(`/invitations/accept/${invitationToken}`)
          } else {
            window.location.replace(dashboardPath) // Immediate redirect, no router
          }
        } catch (error) {
          console.error('Error activating role:', error)
          // Still redirect to dashboard immediately
          const { getDashboardPath } = require('@/lib/routing/role-routes')
          const dashboardPath = getDashboardPath(accountType)
          window.location.replace(dashboardPath)
        }
      }
      
      // Execute immediately, no delay
      activateRole()
    }
  }, [isLoaded, user, accountType, isCallback, invitationToken, isProcessing])

  // CRITICAL: Auto-redirect if user already has an active role
  // Only show this page if:
  // 1. User is NOT logged in (new sign-up)
  // 2. User is logged in but wants to ADD a new account type (not switch)
  // 3. User explicitly navigated here to switch accounts (mode=signin with existing role)
  React.useEffect(() => {
    if (isLoaded && user && activeRole && !invitationToken && !isCallback) {
      // User has an active role - check if they want to switch
      const modeParam = searchParams.get('mode')
      const wantsNewAccountType = modeParam === 'add' || modeParam === 'new'
      const wantsToSwitch = modeParam === 'signin' && availableRoles.length > 1
      
      // Only auto-redirect if user doesn't explicitly want to switch or add
      // Allow users to stay on this page if they have multiple roles and want to switch
      if (!wantsNewAccountType && !wantsToSwitch) {
        // User has a role but ended up here unintentionally - redirect to their dashboard
        // But only if they're not in the middle of selecting an account type
        if (!selectedType) {
          const { getDashboardPath } = require('@/lib/routing/role-routes')
          const dashboardPath = getDashboardPath(activeRole)
          router.replace(dashboardPath)
        }
      }
    }
  }, [isLoaded, user, activeRole, invitationToken, searchParams, router, isCallback, availableRoles.length, selectedType])

  const handleContinue = React.useCallback(async () => {
    if (!selectedType || isProcessing) {
      return
    }

    const option = accountOptions.find(opt => opt.id === selectedType)
    if (!option) {
      toast.error('Error', 'Please select an account type')
      return
    }

    setIsProcessing(true)

    try {
      // If user is logged in, activate the role (creates DB record if needed)
      if (isLoaded && user) {
        // Check if role is already active to prevent duplicate activation
        const currentActiveRole = (user.publicMetadata?.activeRole || user.publicMetadata?.role) as Role | undefined
        
        // Only switch if role is different
        if (!currentActiveRole || currentActiveRole !== selectedType) {
          try {
            // Set explicit login intent to prevent redirect loops
            sessionStorage.setItem('explicit-login-intent', 'true')
            
            // Switch role - this will handle redirect
            await switchRole(selectedType)
            // switchRole already handles redirect via window.location.href
            return
          } catch (switchError: any) {
            console.error('Error switching role:', switchError)
            toast.error('Error', switchError.message || 'Failed to activate account type')
            setIsProcessing(false)
            return
          }
        } else {
          // Role already active, redirect directly
          sessionStorage.setItem('explicit-login-intent', 'true')
          const { getDashboardPath } = await import('@/lib/routing/role-routes')
          const dashboardPath = getDashboardPath(selectedType)
          // Use window.location for immediate redirect to avoid middleware loops
          window.location.href = dashboardPath
          return
        }
      }

      // NEW USER FLOW: Not logged in - redirect to sign-up/sign-in with account type
      // For sign-in, ensure explicit login intent is set
      if (mode === 'signin') {
        sessionStorage.setItem('explicit-login-intent', 'true')
      }
      
      // Redirect to Clerk auth with account type
      const path = mode === 'signup' ? option.signUpPath : option.signInPath
      let finalPath = invitationToken ? `${path}&invitation=${invitationToken}` : path
      if (isSubAccount) {
        finalPath += `&isSubAccount=true`
      }
      router.push(finalPath)
    } catch (error: any) {
      console.error('Error in handleContinue:', error)
      toast.error('Error', error.message || 'Failed to continue. Please try again.')
      setIsProcessing(false)
    }
  }, [selectedType, isProcessing, mode, invitationToken, isSubAccount, isLoaded, user, switchRole, toast, router])

  // Show loading state during callback - same for all account types
  if (isCallback && isProcessing) {
    const accountTypeName = selectedType ? accountOptions.find(opt => opt.id === selectedType)?.name || 'account' : 'account'
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BackgroundPaths backgroundOnly={true} />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 border-3 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            <p className="text-sm font-medium text-foreground">
              Getting your {accountTypeName} ready...
            </p>
            <p className="text-xs text-muted-foreground">
              This will only take a moment
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundPaths backgroundOnly={true} />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Icon icon="solar:bird-bold" className="h-10 w-10 text-foreground" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              {isCallback 
                ? 'Setting up your account...'
                : hasExistingRoles && mode === 'add'
                ? 'Add New Account Type'
                : hasExistingRoles 
                ? 'Choose Your Account'
                : mode === 'signup' 
                ? 'Create Your Account' 
                : 'Sign In to Your Account'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {isCallback
                ? 'Please wait while we set up your account...'
                : isNewUser
                ? 'Select the type of account you want to create.'
                : hasExistingRoles && mode === 'add'
                ? 'Unlock a new account type with the same email. Select which account type you want to add.'
                : hasExistingRoles 
                ? 'You have access to multiple account types. Select which one you want to use.'
                : 'Select the type of account you want to create or sign in to.'
              }
            </motion.p>
          </div>

          {/* Account Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {accountOptions.map((option, index) => {
              const isSelected = selectedType === option.id
              // For new users (no roles), all options are available
              // For existing users adding new account type (mode=add), show all options
              // For existing users switching, only show roles they have access to
              const isAddingNew = mode === 'add' || mode === 'new'
              const isAvailable = isNewUser || isAddingNew || (hasExistingRoles ? availableRoles.includes(option.id) : true)
              const isUnlocked = hasExistingRoles && availableRoles.includes(option.id)
              const isHovered = hoveredType === option.id

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  onHoverStart={() => setHoveredType(option.id)}
                  onHoverEnd={() => setHoveredType(null)}
                >
                  <Card
                    className={cn(
                      'cursor-pointer transition-all duration-300 h-full',
                      'border-2',
                      isSelected
                        ? 'border-foreground bg-foreground/5 shadow-lg scale-[1.02]'
                        : 'border-border/60 hover:border-foreground/40 hover:shadow-md',
                      !isAvailable && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedType(option.id)
                      }
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn(
                          'h-12 w-12 rounded-xl flex items-center justify-center transition-all',
                          isSelected 
                            ? 'bg-foreground/10 border-2 border-foreground' 
                            : 'bg-foreground/5 border border-border/60'
                        )}>
                          <Icon 
                            icon={option.icon} 
                            className={cn(
                              'h-6 w-6 transition-colors',
                              isSelected ? 'text-foreground' : 'text-muted-foreground'
                            )} 
                          />
                        </div>
                        {hasExistingRoles && isUnlocked && !isNewUser && !isAddingNew && (
                          <Badge variant="outline" className="text-xs bg-foreground/5 text-foreground border-foreground/20">
                            Available
                          </Badge>
                        )}
                        {hasExistingRoles && !isUnlocked && isAddingNew && (
                          <Badge variant="outline" className="text-xs bg-foreground/10 text-foreground border-foreground/30">
                            Unlock
                          </Badge>
                        )}
                        {isNewUser && (
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-1">{option.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {option.story}
                      </p>
                      <div className="space-y-1.5">
                        {option.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon icon="solar:check-circle-bold" className="h-3.5 w-3.5 text-foreground/60" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleContinue}
              disabled={!selectedType || isProcessing || roleLoading}
              size="lg"
              className="min-w-[200px] bg-foreground text-background hover:bg-foreground/90 relative"
            >
              <span className="flex items-center justify-center">
                {isProcessing || roleLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-background/20 border-t-background rounded-full animate-spin mr-2" />
                    <span>{hasExistingRoles ? 'Switching...' : 'Continuing...'}</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <Icon icon="solar:arrow-right-bold" className="h-4 w-4 ml-2" />
                  </>
                )}
              </span>
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="text-center text-xs text-muted-foreground mt-6 max-w-xl mx-auto"
          >
            {hasExistingRoles 
              ? 'You can switch between account types anytime. Each account type has separate billing and data.'
              : 'Each account type has separate billing and data. You can create multiple account types if needed.'
            }
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
