'use client'

import * as React from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'

interface IconProps {
  className?: string
  size?: number
}

export const Icons = {
  // Add common icons here
  logo: (props: IconProps) => <Icon icon="solar:bird-bold-duotone" className={cn('h-6 w-6', props.className)} />,
  user: (props: IconProps) => <Icon icon="solar:user-bold-duotone" className={cn('h-5 w-5', props.className)} />,
  settings: (props: IconProps) => <Icon icon="solar:settings-bold-duotone" className={cn('h-5 w-5', props.className)} />,
  // Add more icons as needed
}


