import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from './utils'

type BasicProps = React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
type InputProps = React.InputHTMLAttributes<HTMLInputElement>
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Card = React.forwardRef<HTMLDivElement, BasicProps>(({ className, children, ...rest }, ref) => (
  <div ref={ref} className={cn('rounded-xl border border-gray-200 p-4', className)} {...rest}>
    {children}
  </div>
))
Card.displayName = 'Card'

export const CardHeader = ({ className, children, ...rest }: BasicProps) => (
  <div className={cn('mb-2', className)} {...rest}>
    {children}
  </div>
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = ({ className, children, ...rest }: BasicProps) => (
  <h3 className={cn('text-lg font-semibold', className)} {...rest}>
    {children}
  </h3>
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = ({ className, children, ...rest }: BasicProps) => (
  <p className={cn('text-sm text-gray-500', className)} {...rest}>
    {children}
  </p>
)
CardDescription.displayName = 'CardDescription'

export const CardContent = ({ className, children, ...rest }: BasicProps) => (
  <div className={cn('space-y-2', className)} {...rest}>
    {children}
  </div>
)
CardContent.displayName = 'CardContent'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-transparent px-3 py-2 text-sm font-medium shadow-sm bg-black text-white hover:bg-black/80',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
)
Button.displayName = 'Button'

export const Badge = ({ className, children, ...rest }: BasicProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs font-medium',
      className
    )}
    {...rest}
  >
    {children}
  </span>
)
Badge.displayName = 'Badge'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...rest }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black',
      className
    )}
    {...rest}
  />
))
Input.displayName = 'Input'

export const Label = React.forwardRef<HTMLLabelElement, BasicProps & { htmlFor?: string }>(({ className, children, htmlFor, ...rest }, ref) => (
  <label ref={ref} htmlFor={htmlFor} className={cn('text-sm font-medium text-gray-700', className)} {...rest}>
    {children}
  </label>
))
Label.displayName = 'Label'

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...rest }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black',
      className
    )}
    {...rest}
  />
))
Textarea.displayName = 'Textarea'

// Re-export Select components from proper implementation
export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

// Dialog stubs - Proper modal implementation with portal
export const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Handle ESC key
  React.useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange?.(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onOpenChange])

  if (!open || !mounted) return null

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DialogContent) {
          return React.cloneElement(child as React.ReactElement<any>, { onOpenChange })
        }
        return child
      })}
    </div>
  )

  return createPortal(content, document.body)
}
export const DialogTrigger = ({ children, asChild, onClick }: { children: React.ReactNode; asChild?: boolean; onClick?: () => void }) => (
  <div onClick={onClick} className={asChild ? undefined : "cursor-pointer"}>
    {children}
  </div>
)
export const DialogContent = ({ className, children, onOpenChange, ...rest }: BasicProps & { onOpenChange?: (open: boolean) => void }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
        onClick={handleBackdropClick}
      />
      {/* Content */}
      <div 
        className={cn(
          'relative z-[100] rounded-lg border bg-background p-6 shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-lg',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )} 
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {children}
      </div>
    </>
  )
}
export const DialogHeader = ({ className, children, ...rest }: BasicProps) => (
  <div className={cn('mb-2', className)} {...rest}>
    {children}
  </div>
)
export const DialogTitle = ({ className, children, ...rest }: BasicProps) => (
  <h4 className={cn('text-lg font-semibold', className)} {...rest}>
    {children}
  </h4>
)
export const DialogDescription = ({ className, children, ...rest }: BasicProps) => (
  <p className={cn('text-sm text-gray-600', className)} {...rest}>
    {children}
  </p>
)
export const DialogFooter = ({ className, children, ...rest }: BasicProps) => (
  <div className={cn('mt-4 flex gap-2 justify-end', className)} {...rest}>
    {children}
  </div>
)

// AlertDialog stubs (reuse Dialog)
export const AlertDialog = Dialog
export const AlertDialogTrigger = DialogTrigger
export const AlertDialogContent = DialogContent
export const AlertDialogHeader = DialogHeader
export const AlertDialogTitle = DialogTitle
export const AlertDialogDescription = DialogDescription
export const AlertDialogFooter = ({ className, children, ...rest }: BasicProps) => (
  <div className={cn('mt-4 flex gap-2', className)} {...rest}>
    {children}
  </div>
)
export const AlertDialogAction = Button
export const AlertDialogCancel = Button

// Tabs implementation with state management
export const Tabs = ({ children, defaultValue, value, onValueChange, className }: { 
  children: React.ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '')
  
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            activeTab, 
            onValueChange: handleValueChange 
          })
        }
        return child
      })}
    </div>
  )
}

export const TabsList = ({ className, children, activeTab, onValueChange, ...rest }: BasicProps & { 
  activeTab?: string
  onValueChange?: (value: string) => void
}) => (
  <div className={cn('flex gap-2', className)} {...rest}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { 
          activeTab, 
          onValueChange 
        })
      }
      return child
    })}
  </div>
)

export const TabsTrigger = ({ className, children, value, activeTab, onValueChange, ...rest }: BasicProps & { 
  value?: string
  activeTab?: string
  onValueChange?: (value: string) => void
}) => {
  const isActive = activeTab === value
  return (
    <button 
      className={cn(
        'rounded-md border px-3 py-1 text-sm transition-colors',
        isActive ? 'bg-foreground text-background border-foreground' : 'bg-background hover:bg-muted/50',
        className
      )} 
      onClick={() => value && onValueChange?.(value)}
      {...rest}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ className, children, value, activeTab, ...rest }: BasicProps & { 
  value?: string
  activeTab?: string
  onValueChange?: never // Prevent onValueChange from being passed to div
}) => {
  if (activeTab !== value) return null
  // Remove onValueChange from rest to prevent React warning
  const { onValueChange, ...divProps } = rest as any
  return (
    <div className={cn('mt-2', className)} {...divProps}>
      {children}
    </div>
  )
}

export const Separator = ({ className, ...rest }: BasicProps) => (
  <hr className={cn('my-2 border-gray-200', className)} {...rest} />
)

// Avatar stubs - Removed, using real components from @/components/ui/avatar

// Modal - using real component
export { Modal } from '@/components/ui/modal'

// Progress stub
export const Progress = ({ value = 0, className, ...rest }: { value?: number } & BasicProps) => (
  <div className={cn('w-full rounded bg-gray-100', className)} {...rest}>
    <div className="h-2 rounded bg-black" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
  </div>
)

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn('h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black', className)} />
)

// Description list stubs
export const DescriptionList = ({ className, children, ...rest }: BasicProps) => (
  <dl className={cn('space-y-1', className)} {...rest}>
    {children}
  </dl>
)
export const DescriptionTerm = ({ className, children, ...rest }: BasicProps) => (
  <dt className={cn('text-sm font-medium', className)} {...rest}>
    {children}
  </dt>
)
export const DescriptionDetails = ({ className, children, ...rest }: BasicProps) => (
  <dd className={cn('text-sm text-gray-600', className)} {...rest}>
    {children}
  </dd>
)

// Toaster stub
export const Toaster = () => null

// ErrorBoundary stub
export const ErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <>{children}</>
)

// Export new components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
export { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from '@/components/ui/command'
export { Skeleton } from '@/components/ui/skeleton'
export { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'



