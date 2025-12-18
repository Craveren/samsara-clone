import { useState, useCallback, useEffect, useRef } from 'react'

interface UseModalOptions {
  initialState?: boolean
  closeOnEscape?: boolean
  closeOnOutsideClick?: boolean
  trapFocus?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export function useModal(options: UseModalOptions = {}) {
  const {
    initialState = false,
    closeOnEscape = true,
    closeOnOutsideClick = false,
    trapFocus = true,
    onOpen,
    onClose,
  } = options

  const [isOpen, setIsOpen] = useState(initialState)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape])

  // Handle outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick || !modalRef.current) return

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        close()
      }
    }

    // Use capture phase to catch clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [isOpen, closeOnOutsideClick])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !trapFocus || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement

    // Focus first element
    const firstElement = focusableElements[0]
    firstElement?.focus()

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => {
      modal.removeEventListener('keydown', handleTab)
      // Restore previous focus
      previousFocusRef.current?.focus()
    }
  }, [isOpen, trapFocus])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  const open = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  return {
    isOpen,
    open,
    close,
    toggle,
    modalRef,
  }
}
