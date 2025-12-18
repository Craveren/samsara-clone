import { useEffect, useRef, RefObject } from 'react'

interface UseEventListenerOptions {
  element?: HTMLElement | RefObject<HTMLElement> | Document | Window | null
  enabled?: boolean
  capture?: boolean
  passive?: boolean
  once?: boolean
}

/**
 * Enhanced event listener hook with better cleanup and options
 */
export function useEventListener<T extends keyof WindowEventMap>(
  eventName: T,
  handler: (event: WindowEventMap[T]) => void,
  options: UseEventListenerOptions = {}
) {
  const {
    element,
    enabled = true,
    capture = false,
    passive = false,
    once = false,
  } = options

  // Use ref to store handler to avoid re-subscribing on every render
  const savedHandler = useRef<(event: WindowEventMap[T]) => void>(handler)

  // Update handler ref when handler changes
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return

    // Determine target element
    let targetElement: EventTarget | null = null

    if (element === null || element === undefined) {
      targetElement = typeof window !== 'undefined' ? window : null
    } else if ('current' in element) {
      // RefObject
      targetElement = element.current
    } else if (element instanceof HTMLElement || element instanceof Document || element === window) {
      // Direct element
      targetElement = element
    }

    if (!targetElement || !('addEventListener' in targetElement)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `useEventListener: Target element does not support addEventListener`,
          { eventName, element: targetElement }
        )
      }
      return
    }

    // Create event listener that uses the latest handler
    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[T])
      }
    }

    // Add event listener with options
    const eventOptions: AddEventListenerOptions = {
      capture,
      passive,
      once,
    }

    targetElement.addEventListener(eventName, eventListener, eventOptions)

    // Cleanup
    return () => {
      targetElement?.removeEventListener(eventName, eventListener, eventOptions)
    }
  }, [eventName, element, enabled, capture, passive, once])
}

/**
 * Hook for listening to custom events
 */
export function useCustomEventListener<T = any>(
  eventName: string,
  handler: (event: CustomEvent<T>) => void,
  options: UseEventListenerOptions = {}
) {
  const {
    element,
    enabled = true,
    capture = false,
    passive = false,
    once = false,
  } = options

  const savedHandler = useRef<(event: CustomEvent<T>) => void>(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return

    let targetElement: EventTarget | null = null

    if (element === null || element === undefined) {
      targetElement = typeof window !== 'undefined' ? window : null
    } else if ('current' in element) {
      targetElement = element.current
    } else if (element instanceof HTMLElement || element instanceof Document || element === window) {
      targetElement = element
    }

    if (!targetElement || !('addEventListener' in targetElement)) {
      return
    }

    const eventListener = (event: Event) => {
      if (savedHandler.current && event instanceof CustomEvent) {
        savedHandler.current(event as CustomEvent<T>)
      }
    }

    const eventOptions: AddEventListenerOptions = {
      capture,
      passive,
      once,
    }

    targetElement.addEventListener(eventName, eventListener, eventOptions)

    return () => {
      targetElement?.removeEventListener(eventName, eventListener, eventOptions)
    }
  }, [eventName, element, enabled, capture, passive, once])
}
