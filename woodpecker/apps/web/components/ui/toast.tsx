'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

interface ToastWithMethods {
  (title: string, description?: string, variant?: Toast['variant']): string
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
}

interface ToastContextType {
  toasts: Toast[]
  toast: ToastWithMethods
  success: (title: string, description?: string) => string
  error: (title: string, description?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((title: string, description?: string, variant: Toast['variant'] = 'default') => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)

    return id
  }, [])

  const success = useCallback((title: string, description?: string) => {
    return toast(title, description, 'success')
  }, [toast])

  const error = useCallback((title: string, description?: string) => {
    return toast(title, description, 'destructive')
  }, [toast])

  // Support both patterns: toast.error() and error()
  const toastWithMethods = Object.assign(toast, {
    success,
    error,
  })

  return (
    <ToastContext.Provider value={{ toasts, toast: toastWithMethods, success, error }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const variantStyles = {
    default: 'bg-background border-border text-foreground',
    success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
    destructive: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
  }

  const icons = {
    default: 'solar:info-circle-bold-duotone',
    success: 'solar:check-circle-bold-duotone',
    destructive: 'solar:close-circle-bold-duotone',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        'pointer-events-auto rounded-lg border shadow-lg p-4 flex items-start gap-3',
        variantStyles[toast.variant || 'default']
      )}
    >
      <Icon 
        icon={icons[toast.variant || 'default']} 
        className="h-5 w-5 flex-shrink-0 mt-0.5" 
      />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-sm">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm opacity-90 mt-0.5">{toast.description}</p>
        )}
      </div>
    </motion.div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  // Support both patterns: toast.error() and error()
  const toastWithMethods = Object.assign(context.toast, {
    success: context.success,
    error: context.error,
  })
  return { ...context, toast: toastWithMethods }
}

