'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@woodpecker/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@woodpecker/ui'
import { Progress } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Shield, 
  FileText, 
  Users, 
  Lock,
  Zap,
  Target,
  Sparkles,
  TrendingUp,
  Globe,
  Heart
} from 'lucide-react'
import { cn } from '@woodpecker/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  content: React.ReactNode
}

interface OnboardingFlowProps {
  onComplete: () => void
  accountType?: 'client' | 'lawyer' | 'agency' | 'financial-advisor'
  skipIfCompleted?: boolean
  userId?: string | null
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Woodpecker! 🎉',
    description: 'Your journey to comprehensive estate planning starts here',
    icon: 'solar:bird-bold',
    gradient: 'from-foreground via-foreground/90 to-foreground/80',
    content: (
      <div className="space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center"
        >
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shadow-2xl">
            <Icon icon="solar:bird-bold-duotone" className="h-12 w-12 text-background" />
          </div>
        </motion.div>
        
        <div className="text-center space-y-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-foreground"
          >
            You're All Set!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            We've prepared a quick tour to help you get the most out of Woodpecker. 
            Let's explore your new workspace together.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
        >
          {[
            { icon: 'solar:shield-check-bold-duotone', title: 'Secure', desc: 'Bank-level encryption', color: 'text-foreground' },
            { icon: 'solar:bolt-bold-duotone', title: 'Fast', desc: 'Lightning quick', color: 'text-foreground' },
            { icon: 'solar:target-bold-duotone', title: 'Professional', desc: 'Built for experts', color: 'text-foreground' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <Card className="border border-border/60 hover:border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center mx-auto mb-3">
                    <Icon icon={feature.icon} className={cn('h-6 w-6', feature.color)} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    id: 'features',
    title: 'Discover Key Features',
    description: 'Everything you need for comprehensive estate planning',
    icon: 'solar:document-text-bold-duotone',
    gradient: 'from-foreground via-foreground/90 to-foreground/80',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { 
              icon: 'solar:folder-with-files-bold-duotone', 
              title: 'Document Vault', 
              desc: 'Organize and store all estate documents securely with version control',
              color: 'bg-foreground/10'
            },
            { 
              icon: 'solar:users-group-two-rounded-bold-duotone', 
              title: 'Collaboration', 
              desc: 'Work seamlessly with lawyers, financial advisors, and family members',
              color: 'bg-foreground/10'
            },
            { 
              icon: 'solar:book-bookmark-bold-duotone', 
              title: 'Legacy Journey', 
              desc: 'Create and preserve your digital legacy with stories and memories',
              color: 'bg-foreground/10'
            },
            { 
              icon: 'solar:checklist-bold-duotone', 
              title: 'Task Management', 
              desc: 'Track and complete estate planning tasks with smart workflows',
              color: 'bg-foreground/10'
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border border-border/60 hover:border-border hover:shadow-md transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0', feature.color)}>
                      <Icon icon={feature.icon} className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-foreground">{feature.title}</CardTitle>
                      <CardDescription className="text-sm mt-1 line-clamp-2">{feature.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    id: 'security',
    title: 'Your Data is Protected',
    description: 'Enterprise-grade security for peace of mind',
    icon: 'solar:shield-check-bold-duotone',
    gradient: 'from-foreground via-foreground/90 to-foreground/80',
    content: (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-foreground">Multi-Layer Protection</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              'End-to-end encryption for all documents and communications',
              'Role-based access control with granular permissions',
              'Secure invitation system for team collaboration',
              'Regular security audits and compliance monitoring',
              'Industry-standard compliance (GDPR, POPIA ready)',
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground/90">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-border/60 bg-gradient-to-br from-foreground/5 to-foreground/10">
            <CardContent className="p-4">
              <p className="text-sm text-foreground/80">
                <strong className="text-foreground">Note:</strong> Your account type determines your access level. 
                Each account operates independently with strict security boundaries to ensure complete data isolation.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'ready',
    title: "You're Ready to Go! 🚀",
    description: 'Start managing your estate planning today',
    icon: 'solar:rocket-2-bold-duotone',
    gradient: 'from-foreground via-foreground/90 to-foreground/80',
    content: (
      <div className="space-y-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="space-y-4"
        >
          <div className="relative inline-block">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle2 className="h-12 w-12 text-background" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-foreground/20"
            />
          </div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-foreground"
          >
            All Set!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            You now have access to all the tools you need for comprehensive estate planning. 
            Let's take a quick tour of your dashboard!
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {['Dashboard', 'Documents', 'Legacy Journey', 'Tasks', 'Financial Accounts'].map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <Badge variant="outline" className="px-4 py-2 text-sm border-foreground/20 hover:border-foreground/40 transition-colors">
                {item}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    ),
  },
]

export function OnboardingFlow({ onComplete, accountType, skipIfCompleted = false, userId }: OnboardingFlowProps) {
  const storageKey = `onboarding-completed-${accountType || 'client'}-${userId || 'anon'}`
  const sessionKey = `onboarding-session-${storageKey}`
  const [hasCompleted, setHasCompleted] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(storageKey) === 'true'
  })
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isCompleting, setIsCompleting] = React.useState(false)

  React.useEffect(() => {
    // Check if user has seen onboarding in this session
    const hasSeenThisSession = sessionStorage.getItem(sessionKey) === 'true'
    
    // If already completed AND seen in this session, don't show
    if (hasCompleted && hasSeenThisSession) {
      if (skipIfCompleted) {
        setIsVisible(false)
        onComplete()
        return
      }
    }
    
    // If already completed but NOT seen in this session, show it once
    // This allows users to see onboarding again if they clear sessionStorage
    if (hasCompleted && !hasSeenThisSession) {
      // Still show onboarding for first-time in this session
      const timer = setTimeout(() => {
        setIsVisible(true)
        sessionStorage.setItem(sessionKey, 'true')
      }, 1000)
      return () => clearTimeout(timer)
    }

    // New user - show onboarding
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        sessionStorage.setItem(sessionKey, 'true')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [onComplete, skipIfCompleted, hasCompleted, storageKey, sessionKey])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = React.useCallback(() => {
    setIsCompleting(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true')
      if (!skipIfCompleted) {
        localStorage.setItem('onboarding-completed', 'true')
      }
      sessionStorage.setItem(sessionKey, 'true')
    }
    setHasCompleted(true)
    
    // Smooth exit animation
    setTimeout(() => {
      setIsVisible(false)
      // Call onComplete after animation completes
      setTimeout(() => {
        onComplete()
      }, 300)
    }, 400)
  }, [storageKey, skipIfCompleted, onComplete, sessionKey])

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) {
    return null
  }

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {/* Dimmed Background with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/70 z-[100] backdrop-blur-md"
            onClick={handleSkip}
          />

          {/* Onboarding Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative max-w-4xl w-full pointer-events-auto">
              <Card className="border border-border/60 shadow-2xl bg-background/95 backdrop-blur-sm">
                <CardHeader className="pb-4 border-b border-border/60">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "h-14 w-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                          `bg-gradient-to-br ${step.gradient}`
                        )}
                      >
                        <Icon icon={step.icon} className="h-7 w-7 text-background" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground">{step.title}</CardTitle>
                        <CardDescription className="text-sm mt-1.5">{step.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSkip}
                      className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-foreground to-foreground/80 rounded-full"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.content}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-border/60">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0 || isCompleting}
                      className={cn(
                        "border-border/60 hover:border-border",
                        currentStep === 0 && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-2">
                      {onboardingSteps.map((_, idx) => (
                        <motion.div
                          key={idx}
                          initial={false}
                          animate={{
                            width: idx === currentStep ? 24 : 8,
                            opacity: idx === currentStep ? 1 : 0.4
                          }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "h-2 rounded-full transition-all",
                            idx === currentStep 
                              ? "bg-foreground" 
                              : "bg-muted-foreground/40"
                          )}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={handleNext}
                      disabled={isCompleting}
                      className="bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all"
                    >
                      {currentStep === onboardingSteps.length - 1 ? (
                        <>
                          Start Tour
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
