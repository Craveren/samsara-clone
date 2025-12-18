'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@woodpecker/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { cn } from '@woodpecker/utils'

interface TourStep {
  selector: string
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface WelcomeTourProps {
  steps: TourStep[]
  onComplete: () => void
  enabled?: boolean
}

export function WelcomeTour({ steps, onComplete, enabled = true }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [highlightedElement, setHighlightedElement] = React.useState<HTMLElement | null>(null)
  const [overlayStyle, setOverlayStyle] = React.useState<React.CSSProperties>({})

  const completeTour = React.useCallback(() => {
    setIsVisible(false)
    // Store per-user completion - try to get user ID from Clerk
    if (typeof window !== 'undefined') {
      // Try to get user ID from Clerk's global state or localStorage
      const clerkState = (window as any).__clerk_frontend_api || (window as any).__clerk
      const userId = clerkState?.user?.id || localStorage.getItem('clerk-user-id') || 'default'
      localStorage.setItem(`welcome-tour-completed-${userId}`, 'true')
    }
    // Also store general completion for backwards compatibility
    localStorage.setItem('welcome-tour-completed', 'true')
    setTimeout(() => {
      onComplete()
    }, 300)
  }, [onComplete])

  const highlightStep = React.useCallback((stepIndex: number) => {
    if (stepIndex >= steps.length) {
      completeTour()
      return
    }

    const step = steps[stepIndex]
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
      const element = document.querySelector(step.selector) as HTMLElement

      if (!element) {
        // Element not found, skip to next step
        setTimeout(() => highlightStep(stepIndex + 1), 500)
        return
      }

      setHighlightedElement(element)
      setCurrentStep(stepIndex)

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })

      // Wait for scroll to complete before calculating position
      setTimeout(() => {
        const rect = element.getBoundingClientRect()
        const padding = 8

        setOverlayStyle({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        })

        // Add highlight class to element
        element.classList.add('tour-highlight')
        const originalZIndex = element.style.zIndex
        const originalPosition = element.style.position
        element.style.zIndex = '999'
        element.style.position = 'relative'
      }, 300)
    }, 100)
  }, [steps, completeTour])

  React.useEffect(() => {
    if (!enabled || steps.length === 0) {
      onComplete()
      return
    }

    // Check if tour has been completed (per-user or general)
    let tourCompleted = false
    if (typeof window !== 'undefined') {
      const clerkState = (window as any).__clerk_frontend_api || (window as any).__clerk
      const userId = clerkState?.user?.id || localStorage.getItem('clerk-user-id') || 'default'
      tourCompleted = localStorage.getItem(`welcome-tour-completed-${userId}`) === 'true' || 
                     localStorage.getItem('welcome-tour-completed') === 'true'
    } else {
      tourCompleted = false
    }
    
    if (tourCompleted) {
      onComplete()
      return
    }

    // Wait for onboarding to complete before starting tour
    // Check if onboarding is still visible
    const checkOnboarding = () => {
      const onboardingVisible = document.querySelector('[class*="z-[100]"], [class*="z-[101]"]')
      if (onboardingVisible) {
        // Onboarding still visible, wait a bit more
        setTimeout(checkOnboarding, 500)
        return
      }
      
      // Onboarding done, start tour
      setTimeout(() => {
        setIsVisible(true)
        highlightStep(0)
      }, 1500)
    }

    // Start checking after a delay
    const timer = setTimeout(checkOnboarding, 2000)

    return () => clearTimeout(timer)
  }, [enabled, steps.length, onComplete, highlightStep])

  const cleanupHighlight = React.useCallback(() => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight')
      highlightedElement.style.zIndex = ''
      highlightedElement.style.position = ''
      setHighlightedElement(null)
    }
  }, [highlightedElement])

  const handleNext = () => {
    cleanupHighlight()
    setTimeout(() => {
      highlightStep(currentStep + 1)
    }, 100)
  }

  const handlePrevious = () => {
    cleanupHighlight()
    if (currentStep > 0) {
      setTimeout(() => {
        highlightStep(currentStep - 1)
      }, 100)
    }
  }

  const handleSkip = () => {
    cleanupHighlight()
    completeTour()
  }

  if (!isVisible || currentStep >= steps.length) {
    return null
  }

  const step = steps[currentStep]
  const position = step.position || 'bottom'

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!highlightedElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

    const rect = highlightedElement.getBoundingClientRect()
    const tooltipOffset = 16

    switch (position) {
      case 'top':
        return {
          top: `${rect.top - tooltipOffset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)',
        }
      case 'bottom':
        return {
          top: `${rect.bottom + tooltipOffset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)',
        }
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - tooltipOffset}px`,
          transform: 'translate(-100%, -50%)',
        }
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + tooltipOffset}px`,
          transform: 'translate(0, -50%)',
        }
      default:
        return {
          top: `${rect.bottom + tooltipOffset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)',
        }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dark overlay with cutout - lower z-index than onboarding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[95] backdrop-blur-sm"
            style={{
              clipPath: highlightedElement && overlayStyle.left && overlayStyle.top && overlayStyle.width && overlayStyle.height
                ? `polygon(
                    0% 0%, 
                    0% 100%, 
                    ${overlayStyle.left}px 100%, 
                    ${overlayStyle.left}px ${overlayStyle.top}px, 
                    ${(overlayStyle.left as number) + (overlayStyle.width as number)}px ${overlayStyle.top}px, 
                    ${(overlayStyle.left as number) + (overlayStyle.width as number)}px ${(overlayStyle.top as number) + (overlayStyle.height as number)}px, 
                    ${overlayStyle.left}px ${(overlayStyle.top as number) + (overlayStyle.height as number)}px, 
                    ${overlayStyle.left}px 100%, 
                    100% 100%, 
                    100% 0%
                  )`
                : undefined,
            }}
          />

          {/* Tooltip - lower z-index than onboarding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[96] pointer-events-auto"
            style={getTooltipPosition()}
          >
            <Card className="w-80 shadow-2xl border-2 border-foreground/20 bg-background">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-foreground mb-1">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSkip}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'h-1.5 rounded-full transition-all',
                          idx === currentStep
                            ? 'w-6 bg-foreground'
                            : 'w-1.5 bg-muted-foreground/40'
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="h-8"
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="h-8 bg-foreground text-background hover:bg-foreground/90"
                    >
                      {currentStep === steps.length - 1 ? (
                        <>
                          Finish
                          <CheckCircle2 className="h-3 w-3 ml-1" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Add CSS for tour highlight
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    .tour-highlight {
      outline: 2px solid hsl(var(--foreground)) !important;
      outline-offset: 4px !important;
      border-radius: 8px !important;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.3) !important;
      animation: tour-pulse 2s ease-in-out infinite !important;
    }
    @keyframes tour-pulse {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.3);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 0, 0, 0.4);
      }
    }
  `
  document.head.appendChild(style)
}

