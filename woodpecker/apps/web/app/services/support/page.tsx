'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Input, Label, Textarea } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  lastUpdate: string
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What is estate planning?',
    answer: 'Estate planning is the process of arranging for the management and disposal of your assets after death. It includes creating wills, trusts, and other legal documents to ensure your wishes are carried out.',
    category: 'Basics',
  },
  {
    id: '2',
    question: 'Do I need a will?',
    answer: 'Yes, everyone should have a will. A will ensures your assets are distributed according to your wishes and can help avoid disputes among family members.',
    category: 'Wills',
  },
  {
    id: '3',
    question: 'What is the difference between a will and a trust?',
    answer: 'A will takes effect after death and goes through probate. A trust can be active during your lifetime and can help avoid probate, provide privacy, and offer more control over asset distribution.',
    category: 'Trusts',
  },
  {
    id: '4',
    question: 'How often should I update my estate plan?',
    answer: 'You should review your estate plan every 3-5 years or whenever you experience major life changes such as marriage, divorce, birth of children, or significant changes in assets.',
    category: 'Maintenance',
  },
  {
    id: '5',
    question: 'What is a healthcare directive?',
    answer: 'A healthcare directive (living will) specifies your wishes for medical treatment if you become unable to make decisions. It can include preferences for life-sustaining treatment and end-of-life care.',
    category: 'Healthcare',
  },
  {
    id: '6',
    question: 'Can I change my will?',
    answer: 'Yes, you can update or revoke your will at any time as long as you are mentally competent. Changes can be made through a codicil or by creating a new will.',
    category: 'Wills',
  },
]

export default function EstateSupportPage() {
  const { toast } = useToast()
  const [message, setMessage] = React.useState('')
  const [subject, setSubject] = React.useState('')
  const [isContactOpen, setIsContactOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = React.useState<string | null>(null)

  const categories = React.useMemo(() => {
    return Array.from(new Set(faqs.map(faq => faq.category)))
  }, [])

  const filteredFAQs = React.useMemo(() => {
    if (selectedCategory === 'all') return faqs
    return faqs.filter(faq => faq.category === selectedCategory)
  }, [selectedCategory])

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Required fields', 'Please enter both subject and message')
      return
    }
    toast.success('Message sent', 'Our support team will get back to you within 24 hours')
    setMessage('')
    setSubject('')
    setIsContactOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Estate Planning Support
            </h1>
            <p className="text-muted-foreground">
              Get help with your estate planning questions and issues
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border border-border/60 hover:shadow-lg transition-all cursor-pointer" onClick={() => setIsContactOpen(true)}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                    <Icon icon="solar:question-circle-bold-duotone" className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Contact Support</h3>
                    <p className="text-xs text-muted-foreground">Get personalized help</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                    <Icon icon="solar:chat-round-line-bold-duotone" className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
                    <p className="text-xs text-muted-foreground">Chat with support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                    <Icon icon="solar:book-bold-duotone" className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Knowledge Base</h3>
                    <p className="text-xs text-muted-foreground">Browse articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border border-border/60 mb-6">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common estate planning questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filteredFAQs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card
                      className={cn(
                        "border border-border/40 cursor-pointer transition-all",
                        expandedFAQ === faq.id && "border-border shadow-md"
                      )}
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-foreground">{faq.question}</h4>
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                            {expandedFAQ === faq.id && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-sm text-muted-foreground mt-2"
                              >
                                {faq.answer}
                              </motion.p>
                            )}
                          </div>
                          <Icon
                            icon={expandedFAQ === faq.id ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'}
                            className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                              expandedFAQ === faq.id && "text-foreground"
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Card */}
          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="support-subject">Subject *</Label>
                  <Input
                    id="support-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What can we help you with?"
                  />
                </div>
                <div>
                  <Label htmlFor="support-message">Message *</Label>
                  <Textarea
                    id="support-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your question or issue in detail..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Contact Support Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              We're here to help with your estate planning questions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="dialog-subject">Subject *</Label>
              <Input
                id="dialog-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What can we help you with?"
              />
            </div>
            <div>
              <Label htmlFor="dialog-message">Message *</Label>
              <Textarea
                id="dialog-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or issue..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Icon icon="solar:letter-bold-duotone" className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
