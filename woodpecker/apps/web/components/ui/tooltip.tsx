"use client"

import * as React from "react"
import { cn } from "@woodpecker/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined)

const TooltipProvider = ({ children, delayDuration = 300 }: { children: React.ReactNode; delayDuration?: number }) => {
  return <TooltipContext.Provider value={{ open: false, setOpen: () => {} }}>{children}</TooltipContext.Provider>
}

interface TooltipProps {
  children: React.ReactNode
  delayDuration?: number
}

const Tooltip = ({ children, delayDuration = 300 }: TooltipProps) => {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  )
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const context = React.useContext(TooltipContext)
    const [isHovered, setIsHovered] = React.useState(false)

    React.useEffect(() => {
      if (isHovered) {
        const timer = setTimeout(() => context?.setOpen(true), 300)
        return () => clearTimeout(timer)
      } else {
        context?.setOpen(false)
      }
    }, [isHovered, context])

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        ...props,
      })
    }

    return (
      <div
        ref={ref}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", sideOffset = 4, children, ...props }, ref) => {
    const context = React.useContext(TooltipContext)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const triggerRef = React.useRef<HTMLElement | null>(null)

    React.useEffect(() => {
      if (context?.open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        const positions = {
          top: { x: rect.left + rect.width / 2, y: rect.top - sideOffset },
          bottom: { x: rect.left + rect.width / 2, y: rect.bottom + sideOffset },
          left: { x: rect.left - sideOffset, y: rect.top + rect.height / 2 },
          right: { x: rect.right + sideOffset, y: rect.top + rect.height / 2 },
        }
        setPosition(positions[side])
      }
    }, [context?.open, side, sideOffset])

    return (
      <AnimatePresence>
        {context?.open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md pointer-events-none",
              className
            )}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: `translate(-50%, ${side === "top" ? "-100%" : side === "bottom" ? "0%" : side === "left" ? "-50%" : "-50%"})`,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

