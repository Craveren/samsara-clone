/**
 * Performance utilities for React components
 */

import React, { useMemo, useCallback, memo } from 'react';
import ErrorBoundary from '../shared-components/ErrorBoundary';

/**
 * Memoize expensive computations
 */
export function useExpensiveComputation(computeFn, deps) {
  return useMemo(() => computeFn(), deps);
}

/**
 * Memoize callbacks to prevent unnecessary re-renders
 */
export function useStableCallback(callback, deps) {
  return useCallback(callback, deps);
}

/**
 * Create a memoized component with custom comparison
 */
export function createMemoizedComponent(Component, areEqual) {
  return memo(Component, areEqual);
}

/**
 * Debounce function for performance
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load component with error boundary
 */
export function createLazyComponent(importFn, fallback = null) {
  const LazyComponent = React.lazy(importFn);
  
  return function LazyComponentWithErrorBoundary(props) {
    return (
      <ErrorBoundary>
        <React.Suspense fallback={fallback || <div>Loading...</div>}>
          <LazyComponent {...props} />
        </React.Suspense>
      </ErrorBoundary>
    );
  };
}

/**
 * Check if component should update (for React.memo)
 */
export function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

