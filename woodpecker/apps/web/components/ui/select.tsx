'use client'

import * as React from 'react'
import { cn } from '@woodpecker/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'

interface SelectContextType {
  value: string | undefined
  onValueChange: (value: string, label: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  selectedLabel: string | null
  setSelectedLabel: (label: string) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  defaultValue?: string
}

export function Select({ value, onValueChange, children, defaultValue }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = (newValue: string, label: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    setSelectedLabel(label)
    onValueChange?.(newValue)
    setOpen(false)
  }

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Close on escape
  React.useEffect(() => {
    if (!open) return
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  return (
    <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen, selectedLabel, setSelectedLabel }}>
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) {
      throw new Error('SelectTrigger must be used within Select')
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.setOpen(!context.open)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        aria-expanded={context.open}
        aria-haspopup="listbox"
        {...props}
      >
        {children}
        <Icon 
          icon="solar:alt-arrow-down-bold-duotone" 
          className={cn(
            'h-4 w-4 opacity-50 transition-transform',
            context.open && 'rotate-180'
          )} 
        />
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectValue must be used within Select')
  }

  if (children) {
    return <>{children}</>
  }

  // Show selected label if available, otherwise placeholder
  if (context.selectedLabel) {
    return <span className="truncate">{context.selectedLabel}</span>
  }

  if (context.value) {
    return <span className="truncate">{context.value}</span>
  }

  return <span className="text-muted-foreground">{placeholder || 'Select...'}</span>
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className, ...props }: SelectContentProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectContent must be used within Select')
  }

  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-background shadow-lg',
            className
          )}
          role="listbox"
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function SelectItem({ value, children, className, disabled, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error('SelectItem must be used within Select')
  }

  const isSelected = context.value === value

  // Update selected label when this item is selected
  React.useEffect(() => {
    if (isSelected) {
      const label = typeof children === 'string' ? children : React.Children.toArray(children).join('')
      context.setSelectedLabel(label)
    }
  }, [isSelected, children, context])

  const handleClick = () => {
    if (!disabled) {
      const label = typeof children === 'string' ? children : React.Children.toArray(children).join('')
      context.onValueChange(value, label)
    }
  }

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={handleClick}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        isSelected && 'bg-accent text-accent-foreground',
        !isSelected && 'hover:bg-accent hover:text-accent-foreground',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {isSelected && (
        <Icon icon="solar:check-circle-bold" className="ml-auto h-4 w-4" />
      )}
    </div>
  )
}
