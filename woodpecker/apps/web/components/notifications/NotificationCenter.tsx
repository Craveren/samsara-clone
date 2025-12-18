'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@woodpecker/ui'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDismiss: (id: string) => void
  className?: string
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const typeIcons = {
    info: 'lucide:info',
    success: 'lucide:check-circle',
    warning: 'lucide:alert-triangle',
    error: 'lucide:alert-circle',
  }

  const typeColors = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    error: 'text-red-600 bg-red-50 border-red-200',
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('relative', className)}
        >
          <Icon icon="lucide:bell" className="w-4 h-4" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onMarkAllAsRead()
                  }}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        'p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors',
                        !notification.read && 'bg-muted/30'
                      )}
                      onClick={() => {
                        if (!notification.read) {
                          onMarkAsRead(notification.id)
                        }
                        if (notification.action) {
                          notification.action.onClick()
                        }
                        setIsOpen(false)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-lg border',
                          typeColors[notification.type]
                        )}>
                          <Icon
                            icon={typeIcons[notification.type]}
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-foreground">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp.toLocaleTimeString()}
                            </span>
                            {notification.action && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  notification.action!.onClick()
                                  setIsOpen(false)
                                }}
                                className="text-xs h-6"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDismiss(notification.id)
                          }}
                          className="h-6 w-6 p-0 shrink-0"
                        >
                          <Icon icon="lucide:x" className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}



