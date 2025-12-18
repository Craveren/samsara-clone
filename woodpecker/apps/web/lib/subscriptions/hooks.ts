/**
 * Subscription Management Hooks
 */

'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useApi } from '@/lib/hooks/use-api'
import { useToast } from '@/lib/hooks/use-toast'

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  plan: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}

export function useSubscription() {
  const { user } = useUser()
  const { request } = useApi()
  const { toast } = useToast()
  const [subscription, setSubscription] = React.useState<Subscription | null>(null)
  const [plan, setPlan] = React.useState<Plan | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch subscription data
  const fetchSubscription = React.useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await request<{ subscription?: Subscription; plan?: Plan }>(
        '/api/subscriptions/manage',
        { method: 'GET' },
        { showToast: false }
      )

      if (response) {
        setSubscription(response.subscription || null)
        setPlan(response.plan || null)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      // Don't show toast for subscription errors - it's not critical
    } finally {
      setIsLoading(false)
    }
  }, [user, request])

  React.useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  const isSubscribed = React.useMemo(() => {
    return subscription?.status === 'active' || subscription?.status === 'trialing'
  }, [subscription])

  const cancelSubscription = React.useCallback(async () => {
    try {
      const response = await request<{ success: boolean }>(
        '/api/subscriptions/manage',
        {
          method: 'POST',
          body: JSON.stringify({ action: 'cancel' }),
        }
      )

      if (response?.success) {
        toast.success('Subscription canceled', 'Your subscription will remain active until the end of the billing period.')
        fetchSubscription()
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Failed to cancel subscription')
    }
  }, [request, toast, fetchSubscription])

  const reactivateSubscription = React.useCallback(async () => {
    try {
      const response = await request<{ success: boolean }>(
        '/api/subscriptions/manage',
        {
          method: 'POST',
          body: JSON.stringify({ action: 'reactivate' }),
        }
      )

      if (response?.success) {
        toast.success('Subscription reactivated', 'Your subscription has been reactivated.')
        fetchSubscription()
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Failed to reactivate subscription')
    }
  }, [request, toast, fetchSubscription])

  return {
    subscription,
    plan,
    isSubscribed,
    isLoading,
    cancelSubscription,
    reactivateSubscription,
    refresh: fetchSubscription,
  }
}


