"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@woodpecker/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Popover = ({ children, open: controlledOpen, onOpenChange }: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<HTMLDivElement, PopoverTriggerProps>(
  ({ className, children, asChild, onClick, ...props }, ref) => {
    const context = React.useContext(PopoverContext)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      context?.setOpen(!context.open)
      onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: handleClick,
        ...props,
      })
    }

    return (
      <div ref={ref} className={className} onClick={handleClick} {...props}>
        {children}
      </div>
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", side = "bottom", sideOffset = 4, children, ...props }, ref) => {
    const context = React.useContext(PopoverContext)
    const [position, setPosition] = React.useState({ x: 0, y: 0, width: 0 })
    const triggerRef = React.useRef<HTMLElement | null>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (context?.open) {
        const trigger = document.querySelector('[data-popover-trigger]') as HTMLElement
        if (trigger) {
          triggerRef.current = trigger
          const rect = trigger.getBoundingClientRect()
          const contentWidth = 288 // w-72 default
          const positions = {
            top: {
              x: align === "start" ? rect.left : align === "end" ? rect.right - contentWidth : rect.left + rect.width / 2 - contentWidth / 2,
              y: rect.top - sideOffset,
            },
            bottom: {
              x: align === "start" ? rect.left : align === "end" ? rect.right - contentWidth : rect.left + rect.width / 2 - contentWidth / 2,
              y: rect.bottom + sideOffset,
            },
            left: {
              x: rect.left - contentWidth - sideOffset,
              y: align === "start" ? rect.top : align === "end" ? rect.bottom : rect.top + rect.height / 2,
            },
            right: {
              x: rect.right + sideOffset,
              y: align === "start" ? rect.top : align === "end" ? rect.bottom : rect.top + rect.height / 2,
            },
          }
          setPosition({ ...positions[side], width: contentWidth })
        }
      }
    }, [context?.open, align, side, sideOffset])

    React.useEffect(() => {
      if (!context?.open) return

      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          context.setOpen(false)
        }
      }

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          context.setOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }, [context])

    if (typeof window === "undefined") return null

    return createPortal(
      <AnimatePresence>
        {context?.open && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
              className
            )}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }

