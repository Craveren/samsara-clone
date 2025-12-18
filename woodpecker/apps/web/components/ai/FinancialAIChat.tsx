'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'

interface FinancialAIChatProps {
  financialData?: any[]
  chartData?: any[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function FinancialAIChat({ financialData = [], chartData = [] }: FinancialAIChatProps) {
  // Calculate financial summary for context
  const financialSummary = React.useMemo(() => {
    const totalBalance = financialData.reduce((sum, acc) => sum + (acc.balance || 0), 0)
    const accountCount = financialData.length
    const recentTrend = chartData && chartData.length >= 2
      ? chartData[chartData.length - 1].total - chartData[chartData.length - 2].total
      : 0
    
    return { totalBalance, accountCount, recentTrend }
  }, [financialData, chartData])

  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm Woodpecker AI, your financial assistant. ${financialSummary.accountCount > 0 ? `I can see you have ${financialSummary.accountCount} account${financialSummary.accountCount > 1 ? 's' : ''} with a total balance of R ${financialSummary.totalBalance.toLocaleString('en-US')}. ` : ''}I can help you understand your financial data, provide insights, and answer questions about your estate planning. How can I help you today?`
    }
  ])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Quick suggestions based on financial data
  const quickSuggestions = React.useMemo(() => {
    const suggestions = []
    if (financialSummary.accountCount === 0) {
      suggestions.push('How do I add my first account?')
    } else if (financialSummary.recentTrend < 0) {
      suggestions.push('Why is my balance decreasing?')
    } else {
      suggestions.push('What are my spending patterns?')
    }
    suggestions.push('How can I improve my savings?')
    suggestions.push('What estate planning steps should I take?')
    return suggestions
  }, [financialSummary])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    const userMessage = textToSend
    setInput('')
    setIsLoading(true)

    // Add user message
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = newMessages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(0, -1), // Exclude current user message
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      const aiMessage = data.response || 'I apologize, but I couldn\'t generate a response. Please try again.'

      // Add AI response
      setMessages([...newMessages, { role: 'assistant', content: aiMessage }])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error', 'Failed to send message. Please try again.')
      // Remove the user message if there was an error
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="border border-border/60 h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon icon="solar:chat-round-bold-duotone" className="h-4 w-4" />
          AI Financial Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.role === 'user'
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:chat-round-bold-duotone" className="h-4 w-4 animate-pulse" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && quickSuggestions.length > 0 && (
          <div className="border-t border-border/60 p-3 space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 border-border/40 hover:border-border hover:bg-foreground/5"
                  onClick={() => {
                    handleSend(suggestion)
                  }}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/60 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your finances..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="shrink-0"
            >
              {isLoading ? (
                <Icon icon="solar:refresh-bold" className="h-4 w-4 animate-spin" />
              ) : (
                <Icon icon="solar:plain-2-bold" className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

