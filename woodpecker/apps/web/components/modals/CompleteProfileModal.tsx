/**
 * Modal 3: Complete Profile (Optional)
 * Shown only if role requires additional information
 */

'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { Button, Input, Label } from '@woodpecker/ui'
import { useRole } from '@/lib/hooks/use-role'
import { ROLE_INFO, type Role } from '@/lib/roles/role-types'

interface CompleteProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role
  onComplete?: () => void
}

export function CompleteProfileModal({ 
  open, 
  onOpenChange,
  role,
  onComplete,
}: CompleteProfileModalProps) {
  const [formData, setFormData] = React.useState({
    firmName: '',
    licenseNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const roleInfo = ROLE_INFO[role]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Save additional profile data to database
      // For now, just close the modal
      onComplete?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error completing profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Only show for roles that require profile completion
  if (!roleInfo.requiresProfile) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your {roleInfo.name} Profile</DialogTitle>
          <DialogDescription>
            Add a few details to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {role === 'lawyer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="firmName">Firm Name (Optional)</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  placeholder="Your law firm name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  placeholder="Your professional license number"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Skip for now
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

