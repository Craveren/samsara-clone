'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'

export function ManualBankDashboard() {
  return (
    <Card className="border border-border/60">
      <CardHeader>
        <CardTitle>Bank Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Icon icon="solar:bank-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Bank dashboard functionality coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


