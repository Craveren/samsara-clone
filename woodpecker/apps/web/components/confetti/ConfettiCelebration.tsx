'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

interface ConfettiCelebrationProps {
  show: boolean
  onComplete?: () => void
  variant?: 'achievement' | 'milestone' | 'success'
  message?: string
}

const confettiColors = {
  achievement: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
  milestone: ['#9B59B6', '#3498DB', '#E74C3C', '#F39C12', '#1ABC9C'],
  success: ['#2ECC71', '#27AE60', '#16A085', '#3498DB', '#9B59B6'],
}

export function ConfettiCelebration({
  show,
  onComplete,
  variant = 'achievement',
  message,
}: ConfettiCelebrationProps) {
  const colors = confettiColors[variant]
  const [particles, setParticles] = React.useState<Array<{
    id: number
    x: number
    y: number
    color: string
    rotation: number
    delay: number
  }>>([])

  React.useEffect(() => {
    if (show) {
      // Generate particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      // Call onComplete after animation
      const timer = setTimeout(() => {
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setParticles([])
    }
  }, [show, colors, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Confetti particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
                rotate: particle.rotation,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: particle.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
                ease: 'easeOut',
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: particle.color }}
            />
          ))}

          {/* Celebration message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="bg-background border-2 border-primary rounded-lg p-6 shadow-2xl text-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 2,
                  }}
                  className="mb-4"
                >
                  <Icon icon="lucide:party-popper" className="w-12 h-12 text-primary mx-auto" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">{message}</h3>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}



