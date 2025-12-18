'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { Progress } from '@woodpecker/ui'
import { 
  Users, 
  Search,
  ChevronRight,
  Mail
} from 'lucide-react'
import { ErrorBoundary } from '@woodpecker/ui'
import { ErrorFallback } from '@/components/error-boundary/ErrorFallback'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import Link from 'next/link'
import * as React from 'react'

export default function LawyerClientsPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [clients] = useLocalStorage('lawyer-clients', [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      legacies: 1, 
      completion: 85, 
      status: 'active', 
      lastActivity: '2h ago',
      tasks: { total: 5, completed: 3 }
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      legacies: 2, 
      completion: 60, 
      status: 'active', 
      lastActivity: '1d ago',
      tasks: { total: 8, completed: 4 }
    },
    { 
      id: '3', 
      name: 'Robert Johnson', 
      email: 'robert@example.com',
      phone: '+1 (555) 345-6789',
      legacies: 1, 
      completion: 45, 
      status: 'pending', 
      lastActivity: '3d ago',
      tasks: { total: 10, completed: 2 }
    },
  ])

  const filteredClients = React.useMemo(() => {
    if (!searchTerm) return clients
    return clients.filter((client: any) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [clients, searchTerm])

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold text-foreground">
                  Clients
                </h1>
                <Button size="sm" className="text-xs">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Add Client
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage all your clients and their estate planning progress
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-3 gap-4">
              {filteredClients.map((client: any) => (
                <Link key={client.id} href={`/lawyer/clients/${client.id}/legacy`}>
                  <Card className="border border-border hover:border-foreground/20 transition-colors cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base font-semibold mb-1">
                            {client.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{client.email}</span>
                          </div>
                        </div>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                          {client.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{client.completion}%</span>
                          </div>
                          <Progress value={client.completion} className="h-1.5" />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Legacies</span>
                            <p className="font-medium text-foreground mt-0.5">{client.legacies}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tasks</span>
                            <p className="font-medium text-foreground mt-0.5">
                              {client.tasks.completed}/{client.tasks.total}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Last activity: {client.lastActivity}</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <Card className="border border-border">
                <CardContent className="p-12 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'No clients match your search' : 'No clients yet'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
    </ErrorBoundary>
  )
}

