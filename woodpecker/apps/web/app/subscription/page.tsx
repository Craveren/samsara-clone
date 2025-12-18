'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { getAllPlans } from '@/lib/subscriptions/plans'
import { useSubscription } from '@/lib/subscriptions/hooks'
import { useToast } from '@/lib/hooks'
import { formatNumber } from '@/lib/utils/number-format'

export default function SubscriptionPage() {
  const { toast } = useToast()
  const { subscription, plan, isSubscribed } = useSubscription()
  const plans = getAllPlans()

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1.5">
              Subscription Plans
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </div>

          {isSubscribed && plan && (
            <Card className="border-2 border-foreground mb-6">
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>{plan.name} - {plan.interval === 'monthly' ? 'Monthly' : 'Yearly'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">R {formatNumber(plan.price)}<span className="text-base font-normal text-muted-foreground">/{plan.interval === 'monthly' ? 'month' : 'year'}</span></p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <Card
                key={p.id}
                className={`border border-border/60 hover:shadow-lg transition-shadow ${
                  plan?.id === p.id ? 'ring-2 ring-foreground' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    {plan?.id === p.id && (
                      <Badge className="bg-foreground text-background">Current</Badge>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">R {formatNumber(p.price)}</span>
                    <span className="text-sm text-muted-foreground">/{p.interval === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {p.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-foreground flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan?.id === p.id ? 'outline' : 'default'}
                    disabled={plan?.id === p.id}
                  >
                    {plan?.id === p.id ? 'Current Plan' : p.price === 0 ? 'Get Started' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}


