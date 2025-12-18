'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Badge, Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useNotifications } from '@/lib/hooks/use-notifications'

export default function EstateNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications({ autoFetch: true })

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1.5">
                Estate Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay informed about your estate planning activities
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <Card className="border border-dashed border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Icon icon="solar:bell-off-bold-duotone" className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`border border-border/60 hover:shadow-md transition-shadow cursor-pointer ${!notif.read ? 'bg-foreground/5' : ''}`}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id)
                    if (notif.link) window.location.href = notif.link
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${notif.color || 'bg-foreground/5'}`}>
                        <Icon icon={notif.icon || 'solar:bell-bold-duotone'} className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`text-sm font-semibold ${!notif.read ? 'font-bold' : ''}`}>
                              {notif.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notif.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="h-2 w-2 rounded-full bg-foreground flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

