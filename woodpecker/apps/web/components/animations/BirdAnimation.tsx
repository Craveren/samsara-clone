'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface BirdAnimationProps {
  className?: string
  size?: number
}

export function BirdAnimation({ className, size = 24 }: BirdAnimationProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={{
        rotate: [0, 360],
        y: [0, -10, 0],
      }}
      transition={{
        rotate: {
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        },
        y: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {/* Bird SVG - Woodpecker style */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Bird body */}
        <motion.path
          d="M12 4C8 4 5 7 5 11C5 15 8 18 12 18C16 18 19 15 19 11C19 7 16 4 12 4Z"
          fill="currentColor"
          className="text-foreground/60"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Wing */}
        <motion.path
          d="M8 10C8 10 9 8 10 9C10 9 11 7 12 8C12 8 13 6 14 7C14 7 15 5 16 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-foreground/40"
          animate={{
            pathLength: [0.5, 1, 0.5],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Beak */}
        <path
          d="M19 11L21 10L19 9Z"
          fill="currentColor"
          className="text-foreground/80"
        />
        {/* Eye */}
        <circle
          cx="14"
          cy="10"
          r="1"
          fill="currentColor"
          className="text-foreground"
        />
      </svg>
    </motion.div>
  )
}









