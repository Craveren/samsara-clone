'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

interface StoryPromptCardProps {
  title: string
  prompt: string
  onStart?: () => void
  className?: string
}

export function StoryPromptCard({ title, prompt, onStart, className }: StoryPromptCardProps) {
  return (
    <Card className={cn('border border-border/60 hover:shadow-lg transition-all', className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{prompt}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onStart} className="w-full">
          <Icon icon="solar:play-bold-duotone" className="h-4 w-4 mr-2" />
          Start Interview
        </Button>
      </CardContent>
    </Card>
  )
}


