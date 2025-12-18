/**
 * Modal 2: Switch Role
 * Clean menu for switching between existing roles
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { ROLE_INFO, type Role } from '@/lib/roles/role-types'
import { useRole } from '@/lib/hooks/use-role'
import { useToast } from '@/lib/hooks'

interface SwitchRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SwitchRoleModal({ open, onOpenChange }: SwitchRoleModalProps) {
  const { activeRole, availableRoles, switchRole, isLoading } = useRole()
  const { toast } = useToast()
  const [isSwitching, setIsSwitching] = React.useState(false)

  const handleSwitch = async (role: Role) => {
    if (isSwitching || isLoading || activeRole === role) return

    setIsSwitching(true)
    try {
      await switchRole(role)
      onOpenChange(false)
    } catch (error) {
      console.error('Error switching role:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  // Get all roles, mark which ones user has
  const allRoles: Role[] = ['client', 'lawyer', 'agency', 'financial-advisor']
  const rolesWithStatus = allRoles.map(role => ({
    role,
    info: ROLE_INFO[role],
    isActive: activeRole === role,
    isAvailable: availableRoles.includes(role),
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-[200]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Switch Account Type</DialogTitle>
          <DialogDescription>
            {activeRole ? (
              <>You are currently logged in as: <strong>{ROLE_INFO[activeRole].name}</strong></>
            ) : (
              'Select an account type to continue'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {rolesWithStatus.map(({ role, info, isActive, isAvailable }) => (
            <motion.button
              key={role}
              onClick={() => handleSwitch(role)}
              disabled={isActive || isSwitching || isLoading}
              className={cn(
                'w-full p-4 rounded-lg border text-left transition-all',
                'hover:border-foreground/40 hover:shadow-md',
                isActive
                  ? 'border-foreground bg-foreground/5 cursor-default'
                  : isAvailable
                  ? 'border-border/60 bg-background cursor-pointer'
                  : 'border-border/40 bg-muted/30 opacity-60 cursor-not-allowed',
                (isSwitching || isLoading) && 'opacity-50'
              )}
              whileHover={!isActive && !isSwitching ? { scale: 1.01 } : {}}
              whileTap={!isActive && !isSwitching ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    isActive ? 'bg-foreground/10' : 'bg-foreground/5'
                  )}>
                    <Icon 
                      icon={info.icon} 
                      className={cn(
                        'h-5 w-5',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )} 
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isActive && (
                    <span className="text-xs font-medium text-foreground bg-foreground/10 px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                  {!isAvailable && (
                    <Icon icon="solar:add-circle-bold" className="h-5 w-5 text-muted-foreground" />
                  )}
                  {isSwitching && activeRole !== role && (
                    <div className="h-4 w-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground text-center">
            Each account type has separate billing and data. You can switch anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

