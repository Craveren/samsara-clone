'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { Button } from '@woodpecker/ui'
import { cn } from '@woodpecker/utils'

interface Highlight {
  selector: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface PageIntroProps {
  pageId: string
  pageName: string
  description?: string
  highlights?: Highlight[]
  children: React.ReactNode
  showHero?: boolean
  heroTitle?: string
  heroSubtitle?: string
  heroActions?: React.ReactNode
  stats?: Array<{ label: string; value: string | number; icon?: string }>
  features?: Array<{ title: string; description: string; icon: string }>
}

/**
 * Enhanced PageIntro Component
 * Beautiful, modern page introduction with hero sections, stats, and features
 */
export function PageIntro({ 
  pageId, 
  pageName, 
  description, 
  highlights = [], 
  children,
  showHero = false,
  heroTitle,
  heroSubtitle,
  heroActions,
  stats,
  features,
}: PageIntroProps) {
  const [showTour, setShowTour] = React.useState(false)

  // Store intro data for potential future use
  React.useEffect(() => {
    if (typeof window !== 'undefined' && highlights.length > 0) {
      const highlightsData = {
        pageId,
        pageName,
        description,
        highlights,
      }
      sessionStorage.setItem(`page-intro-${pageId}`, JSON.stringify(highlightsData))
    }
  }, [pageId, pageName, description, highlights])

  return (
    <div className="w-full">
      {/* Hero Section */}
      {showHero && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background to-muted/20"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 border border-border/60 mb-6"
              >
                <Icon icon="solar:star-bold-duotone" className="h-4 w-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">{pageName}</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight"
              >
                {heroTitle || pageName}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                {heroSubtitle || description}
              </motion.p>

              {heroActions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  {heroActions}
                </motion.div>
              )}

              {highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTour(!showTour)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Icon icon="solar:info-circle-bold-duotone" className="h-4 w-4 mr-2" />
                    Take a tour
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border/60 bg-muted/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  {stat.icon && (
                    <div className="flex justify-center mb-3">
                      <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                        <Icon icon={stat.icon} className="h-6 w-6 text-foreground" />
                      </div>
                    </div>
                  )}
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border/60 bg-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage your legacy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-6 rounded-xl border border-border/60 bg-background hover:border-border hover:shadow-lg transition-all"
                >
                  <div className="h-12 w-12 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center mb-4">
                    <Icon icon={feature.icon} className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}
