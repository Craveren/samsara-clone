'use client'

import * as React from 'react'
import { Button } from '@woodpecker/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full border border-border/60">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Something went wrong
          </CardTitle>
          <CardDescription className="mt-2">
            We encountered an unexpected error. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-muted/50 rounded-lg border border-border/60">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {error.message || 'Unknown error occurred'}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            {resetError && (
              <Button
                onClick={resetError}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-foreground text-background hover:bg-foreground/90"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

