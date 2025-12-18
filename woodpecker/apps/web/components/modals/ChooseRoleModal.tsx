/**
 * Modal 1: Choose Role
 * Shown on first signup or when user has no active role
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { ROLE_INFO, type Role } from '@/lib/roles/role-types'
import { useRole } from '@/lib/hooks/use-role'
import { useToast } from '@/lib/hooks'

interface ChooseRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export function ChooseRoleModal({ 
  open, 
  onOpenChange,
  title = 'Choose Your Account Type',
  description = 'Select the type of account you want to create',
}: ChooseRoleModalProps) {
  const { switchRole, isLoading } = useRole()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)
  const [isSwitching, setIsSwitching] = React.useState(false)

  const handleSelectRole = async (role: Role) => {
    if (isSwitching || isLoading) return

    setSelectedRole(role)
    setIsSwitching(true)

    try {
      await switchRole(role)
      onOpenChange(false)
    } catch (error) {
      console.error('Error selecting role:', error)
    } finally {
      setIsSwitching(false)
      setSelectedRole(null)
    }
  }

  const roles: Role[] = ['client', 'lawyer', 'agency', 'financial-advisor']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl z-[200]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {roles.map((role) => {
            const info = ROLE_INFO[role]
            const isSelected = selectedRole === role
            const isProcessing = isSwitching && isSelected

            return (
              <motion.button
                key={role}
                onClick={() => handleSelectRole(role)}
                disabled={isSwitching || isLoading}
                className={cn(
                  'relative p-6 rounded-xl border-2 text-left transition-all',
                  'hover:border-foreground/40 hover:shadow-lg',
                  isSelected
                    ? 'border-foreground bg-foreground/5'
                    : 'border-border/60 bg-background',
                  (isSwitching || isLoading) && 'opacity-50 cursor-not-allowed'
                )}
                whileHover={{ scale: isSwitching ? 1 : 1.02 }}
                whileTap={{ scale: isSwitching ? 1 : 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0',
                    'bg-foreground/5 border border-border/60'
                  )}>
                    <Icon 
                      icon={info.icon} 
                      className={cn(
                        'h-6 w-6',
                        isSelected ? 'text-foreground' : 'text-muted-foreground'
                      )} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">{info.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {info.description}
                    </p>
                  </div>
                  {isProcessing && (
                    <div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground text-center">
            You can switch between account types anytime. Each account type has separate billing and data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

