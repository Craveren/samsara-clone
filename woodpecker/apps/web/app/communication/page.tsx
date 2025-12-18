'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Avatar, AvatarFallback } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@woodpecker/utils'
import { useUser } from '@clerk/nextjs'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useApi } from '@/lib/hooks/use-api'
import { useToast } from '@/lib/hooks'

interface Message {
  id: string
  text: string
  user: { id: string; name: string; role: string }
  createdAt: Date
  read?: boolean
}

// Conversations will be fetched from API

interface Conversation {
  id: string
  name: string
  role: string
  lastMessage: string
  unread: number
  avatar: string
  userId: string
}

export default function CommunicationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const clientId = searchParams.get('clientId')
  const lawyerId = searchParams.get('lawyerId')
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(clientId || lawyerId || null)
  const [conversations, setConversations] = React.useState<Conversation[]>([])
  const [messages, setMessages] = useLocalStorage<Message[]>(`communication-messages-${selectedConversation || 'default'}`, [])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const { request } = useApi()
  const { toast } = useToast()

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    if (clientId) {
      setSelectedConversation(clientId)
    }
  }, [clientId])

  const handleSend = async () => {
    if (!input.trim() || !selectedConversation || !user) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      user: { id: user.id, name: user.firstName || 'You', role: (user.publicMetadata?.role as string) || 'user' },
      createdAt: new Date(),
      read: true,
    }

    // Optimistic update
    setMessages([...messages, newMessage])
    setInput('')

    // Send to API
    try {
      const savedInput = input.trim()
      const response = await request<{ message?: Message }>(
        `/api/conversations/${selectedConversation}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({ text: savedInput }),
        },
        { showToast: false, cache: false }
      )
      
      // If API returns the message, use it (with proper ID)
      if (response?.message) {
        const apiMessage: Message = {
          ...response.message,
          createdAt: response.message.createdAt instanceof Date 
            ? response.message.createdAt 
            : new Date(response.message.createdAt || Date.now())
        }
        // Replace optimistic message with server message
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== newMessage.id)
          return [...filtered, apiMessage]
        })
      }
    } catch (err) {
      console.error('Error sending message:', err)
      // Revert optimistic update on error
      setMessages(messages)
      toast.error('Failed to send', 'Message could not be sent. Please try again.')
    }
  }

  // Fetch conversations from API - with caching and error handling
  React.useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        const data = await request<{ data?: Conversation[] }>(
          '/api/conversations',
          { method: 'GET' },
          { showToast: false, cache: true, cacheTTL: 60000 } // Cache for 1 minute
        )
        if (data?.data && Array.isArray(data.data)) {
          setConversations(data.data)
        } else {
          // Fallback to empty array
          setConversations([])
        }
      } catch (err) {
        console.error('Error fetching conversations:', err)
        // Keep existing conversations on error, don't clear them
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce to prevent rapid calls
    const timeoutId = setTimeout(fetchConversations, 100)
    return () => clearTimeout(timeoutId)
  }, [user, request])

  // Fetch messages when conversation is selected - with caching
  React.useEffect(() => {
    if (!selectedConversation || !user) return
    
    const fetchMessages = async () => {
      try {
        const data = await request<{ data?: Message[] }>(
          `/api/conversations/${selectedConversation}/messages`,
          { method: 'GET' },
          { showToast: false, cache: true, cacheTTL: 30000 } // Cache for 30 seconds
        )
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const formattedMessages = data.data.map((msg: any) => ({
            ...msg,
            createdAt: msg.createdAt instanceof Date 
              ? msg.createdAt 
              : new Date(msg.createdAt || Date.now())
          }))
          setMessages(formattedMessages)
        }
        // If no messages from API, keep localStorage messages
      } catch (err) {
        console.error('Error fetching messages:', err)
        // Keep existing messages from localStorage as fallback
      }
    }
    
    // Debounce to prevent rapid calls
    const timeoutId = setTimeout(fetchMessages, 100)
    return () => clearTimeout(timeoutId)
  }, [selectedConversation, user, request])

  const currentConversation = selectedConversation 
    ? conversations.find(c => c.id === selectedConversation)
    : null

  // Filter messages for current conversation
  const conversationMessages = React.useMemo(() => {
    if (!selectedConversation || !user) return []
    
    // Messages belong to this conversation if:
    // 1. They're from the selected user, OR
    // 2. They're from the current user
    return messages.filter(m => {
      // If message has conversationId, use that
      if ((m as any).conversationId) {
        return (m as any).conversationId === selectedConversation
      }
      // Otherwise, check user IDs
      return m.user.id === selectedConversation || m.user.id === user.id
    })
  }, [messages, selectedConversation, user])

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-border/40 flex flex-col">
          <div className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon icon="solar:add-circle-bold" className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Search conversations..."
              className="w-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Icon icon="solar:refresh-bold" className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Icon icon="solar:chat-round-line-bold-duotone" className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start a conversation from your contacts</p>
              </div>
            ) : (
              conversations.map((conv) => (
              <motion.div
                key={conv.id}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                className={cn(
                  'p-4 cursor-pointer border-l-4 transition-all',
                  selectedConversation === conv.id
                    ? 'bg-foreground/5 border-foreground'
                    : 'border-transparent hover:bg-muted/30'
                )}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-foreground/10 text-foreground font-semibold">
                      {conv.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate">{conv.name}</h3>
                      {conv.unread > 0 && (
                        <Badge className="bg-foreground text-background text-xs h-5 min-w-5 flex items-center justify-center border border-border/60">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">{conv.role}</Badge>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentConversation ? (
            <>
              {/* Header */}
              <div className="border-b border-border/40 p-4 bg-background/95 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-foreground/10 text-foreground font-semibold">
                        {currentConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-lg font-semibold text-foreground">{currentConversation.name}</h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Online</Badge>
                        <span className="text-xs text-muted-foreground">• {currentConversation.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icon icon="solar:phone-bold" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icon icon="solar:videocamera-bold" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                <AnimatePresence>
                  {conversationMessages.map((message) => {
                    const isOwn = message.user.id === user?.id
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          'flex gap-3',
                          isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-foreground/10 text-foreground text-xs">
                              {message.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl p-4 shadow-sm',
                            isOwn
                              ? 'bg-foreground text-background'
                              : 'bg-background border border-border/40 text-foreground'
                          )}
                        >
                          {!isOwn && (
                            <p className="text-xs font-medium text-muted-foreground mb-1">{message.user.name}</p>
                          )}
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                          <p className={cn(
                            'text-xs mt-2',
                            isOwn ? 'text-background/70' : 'text-muted-foreground'
                          )}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {isOwn && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-foreground/10 text-foreground text-xs">
                              {user?.firstName?.charAt(0) || 'Y'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border/40 p-4 bg-background/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={!input.trim()} className="bg-foreground text-background hover:bg-foreground/90">
                      <Icon icon="solar:plain-2-bold" className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Press Enter to send • Shift+Enter for new line
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Icon icon="solar:chat-round-line-bold-duotone" className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


