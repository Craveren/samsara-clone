'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Icon } from '@iconify/react'

interface MessageDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  recipientId?: string
  recipientName?: string
}

export function MessageDialog({ open = false, onOpenChange, recipientId, recipientName }: MessageDialogProps) {
  const [message, setMessage] = React.useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            {recipientName ? `Message to ${recipientName}` : 'Send a message'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // TODO: Send message
            onOpenChange?.(false)
            setMessage('')
          }}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


