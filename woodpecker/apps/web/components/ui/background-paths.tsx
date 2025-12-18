'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface FloatingPathsProps {
  position?: number
}

/**
 * Animated background paths component for the landing page
 * Creates floating, animated SVG paths in the background
 */
export function FloatingPaths({ position = 1 }: FloatingPathsProps) {
  const paths = React.useMemo(() => {
    // Generate multiple paths with different positions and animations
    return Array.from({ length: 8 }, (_, i) => ({
      id: `path-${position}-${i}`,
      d: generatePath(i, position),
      delay: i * 0.2,
      duration: 15 + Math.random() * 10,
    }))
  }, [position])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 isolate">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ isolation: 'isolate' }}
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground/10"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              pathLength: {
                duration: path.duration,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: {
                duration: path.duration * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: path.delay,
              },
            }}
          />
        ))}
        {/* Additional subtle paths for depth */}
        {paths.slice(0, 4).map((path, idx) => (
          <motion.path
            key={`${path.id}-subtle`}
            d={path.d}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground/5"
            strokeDasharray="4 8"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              pathLength: {
                duration: path.duration * 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: idx * 0.3,
              },
              opacity: {
                duration: path.duration * 0.75,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: path.delay + idx * 0.2,
              },
            }}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * Generate SVG path data based on index and position
 */
function generatePath(index: number, position: number): string {
  const baseX = (index % 4) * 300 + 100
  const baseY = Math.floor(index / 4) * 200 + 100
  const offset = position * 50

  // Create flowing, organic paths
  const paths = [
    `M ${baseX} ${baseY} Q ${baseX + 100 + offset} ${baseY - 50} ${baseX + 200} ${baseY} T ${baseX + 300} ${baseY + 100}`,
    `M ${baseX + offset} ${baseY} C ${baseX + 50} ${baseY - 80} ${baseX + 150} ${baseY - 80} ${baseX + 200} ${baseY} S ${baseX + 300} ${baseY + 100} ${baseX + 350} ${baseY}`,
    `M ${baseX} ${baseY + offset} Q ${baseX + 150} ${baseY - 100} ${baseX + 250} ${baseY + 50} T ${baseX + 400} ${baseY + 150}`,
    `M ${baseX - offset} ${baseY} L ${baseX + 100} ${baseY - 50} L ${baseX + 200} ${baseY} L ${baseX + 300} ${baseY + 50} L ${baseX + 400} ${baseY}`,
    `M ${baseX} ${baseY} Q ${baseX + 80} ${baseY + 60} ${baseX + 160} ${baseY} T ${baseX + 320} ${baseY - 40}`,
    `M ${baseX + offset} ${baseY} C ${baseX + 60} ${baseY + 70} ${baseX + 140} ${baseY + 70} ${baseX + 200} ${baseY} S ${baseX + 320} ${baseY - 70} ${baseX + 380} ${baseY}`,
    `M ${baseX} ${baseY - offset} Q ${baseX + 120} ${baseY + 80} ${baseX + 240} ${baseY - 30} T ${baseX + 480} ${baseY + 50}`,
    `M ${baseX - offset} ${baseY} L ${baseX + 80} ${baseY + 40} L ${baseX + 160} ${baseY - 20} L ${baseX + 240} ${baseY + 60} L ${baseX + 320} ${baseY}`,
  ]

  return paths[index % paths.length]
}

