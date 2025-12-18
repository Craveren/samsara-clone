'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import { useToast } from '@/lib/hooks'
import Link from 'next/link'

// Mock data - replace with real data from database
const mockClients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'active',
    lastMessage: 'Thank you for the update on my will.',
    lastMessageTime: '2 hours ago',
    unreadCount: 2,
    avatar: null,
    completion: 85,
    matters: ['Will Drafting', 'Estate Planning'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    status: 'active',
    lastMessage: 'I have a question about the trust documents.',
    lastMessageTime: '5 hours ago',
    unreadCount: 0,
    avatar: null,
    completion: 60,
    matters: ['Trust Setup', 'Probate'],
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    status: 'pending',
    lastMessage: 'Looking forward to our meeting next week.',
    lastMessageTime: '1 day ago',
    unreadCount: 1,
    avatar: null,
    completion: 40,
    matters: ['Estate Planning'],
  },
]

export default function LawyerCommunicationPage() {
  const { user } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedClient, setSelectedClient] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState('all')

  const filteredClients = React.useMemo(() => {
    let filtered = mockClients

    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(c => c.status === 'active')
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(c => c.status === 'pending')
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.matters.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }, [searchQuery, activeTab])

  const totalUnread = mockClients.reduce((sum, c) => sum + c.unreadCount, 0)
  const activeClients = mockClients.filter(c => c.status === 'active').length

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Client Communication</h1>
                <p className="text-muted-foreground">
                  Manage conversations, messages, and client relationships
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => router.push('/lawyer/clients')}>
                  <Icon icon="solar:user-plus-bold" className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Clients</p>
                      <p className="text-2xl font-bold text-foreground">{mockClients.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                      <Icon icon="solar:users-group-two-rounded-bold" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Active Conversations</p>
                      <p className="text-2xl font-bold text-foreground">{activeClients}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:chat-round-line-bold" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Unread Messages</p>
                      <p className="text-2xl font-bold text-foreground">{totalUnread}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:letter-unread-bold" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 hover:border-border/60 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Avg. Response Time</p>
                      <p className="text-2xl font-bold text-foreground">2.5h</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                      <Icon icon="solar:clock-circle-bold" className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="lg:col-span-1">
              <Card className="border border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle>Clients</CardTitle>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                      <TabsList className="h-8">
                        <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                        <TabsTrigger value="active" className="text-xs px-2">Active</TabsTrigger>
                        <TabsTrigger value="pending" className="text-xs px-2">Pending</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <Input
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1 max-h-[600px] overflow-y-auto">
                    {filteredClients.map((client) => (
                      <motion.div
                        key={client.id}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          'p-4 cursor-pointer border-l-4 transition-all',
                          selectedClient === client.id
                            ? 'bg-foreground/5 border-foreground'
                            : 'hover:bg-muted/50 border-transparent'
                        )}
                        onClick={() => {
                          setSelectedClient(client.id)
                          router.push(`/communication?clientId=${client.id}`)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-foreground/10 text-foreground">
                              {client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                              {client.unreadCount > 0 && (
                                <Badge className="bg-foreground text-background text-xs">
                                  {client.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1">
                              {client.lastMessage}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {client.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {client.lastMessageTime}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {client.matters.map((matter, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {matter}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Details / Quick Actions */}
            <div className="lg:col-span-2">
              {selectedClient ? (
                <Card className="border border-border/40">
                  <CardHeader>
                    <CardTitle>Client Details</CardTitle>
                    <CardDescription>
                      View and manage client information and communication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="bg-foreground/10 text-foreground text-2xl">
                            {mockClients.find(c => c.id === selectedClient)?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {mockClients.find(c => c.id === selectedClient)?.name}
                          </h2>
                          <p className="text-muted-foreground">
                            {mockClients.find(c => c.id === selectedClient)?.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex-col"
                          onClick={() => router.push(`/communication?clientId=${selectedClient}`)}
                        >
                          <Icon icon="solar:chat-round-line-bold" className="h-6 w-6 mb-2" />
                          <span>Open Chat</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex-col"
                          onClick={() => router.push(`/lawyer/clients/${selectedClient}`)}
                        >
                          <Icon icon="solar:user-id-bold" className="h-6 w-6 mb-2" />
                          <span>View Profile</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex-col"
                          onClick={() => router.push(`/lawyer/clients/${selectedClient}/documents`)}
                        >
                          <Icon icon="solar:document-text-bold" className="h-6 w-6 mb-2" />
                          <span>Documents</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex-col"
                          onClick={() => router.push(`/lawyer/clients/${selectedClient}/legacy`)}
                        >
                          <Icon icon="solar:history-bold" className="h-6 w-6 mb-2" />
                          <span>View Legacy</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-border/40">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Icon icon="solar:chat-round-line-bold" className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Select a client to view details
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Choose a client from the list to see their information, start a conversation, or manage their matters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

