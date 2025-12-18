'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Input, Label, Textarea } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { motion } from 'framer-motion'

interface LegacyItem {
  id: string
  title: string
  type: 'story' | 'document' | 'photo' | 'video' | 'memory' | 'letter'
  content?: string
  description?: string
  date: string
  category?: string
  tags?: string[]
  location?: string
  people?: string[]
  createdAt: string
}

export default function CreateLegacyItemPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [legacyItems, setLegacyItems] = useLocalStorage<LegacyItem[]>('legacy-items', [])
  
  const [formData, setFormData] = React.useState({
    title: '',
    type: 'story' as LegacyItem['type'],
    content: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    tags: '',
    location: '',
    people: '',
  })

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Title Required', 'Please enter a title for your legacy item')
      return
    }

    const newItem: LegacyItem = {
      id: Math.random().toString(36).substring(7),
      title: formData.title,
      type: formData.type,
      content: formData.content || undefined,
      description: formData.description || undefined,
      date: formData.date,
      category: formData.category || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
      location: formData.location || undefined,
      people: formData.people ? formData.people.split(',').map(p => p.trim()) : undefined,
      createdAt: new Date().toISOString(),
    }

    setLegacyItems([...legacyItems, newItem])
    toast.success('Legacy Item Created', `${formData.title} has been added to your legacy`)
    router.push('/legacy')
  }

  const typeConfig = {
    story: { icon: 'solar:book-bookmark-bold-duotone', label: 'Story', description: 'Record a personal story or memory' },
    document: { icon: 'solar:document-text-bold-duotone', label: 'Document', description: 'Upload or link a document' },
    photo: { icon: 'solar:gallery-bold-duotone', label: 'Photo', description: 'Add a photo with description' },
    video: { icon: 'solar:videocamera-record-bold-duotone', label: 'Video', description: 'Link or upload a video' },
    memory: { icon: 'solar:heart-bold-duotone', label: 'Memory', description: 'Capture a special memory' },
    letter: { icon: 'solar:letter-bold-duotone', label: 'Letter', description: 'Write a letter to loved ones' },
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <Icon icon="solar:arrow-left-bold" className="h-4 w-4 mr-2" />
              Back to Legacy
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Add Legacy Item
            </h1>
            <p className="text-muted-foreground">
              Preserve your stories, memories, and important moments
            </p>
          </div>

          <Card className="border border-border/60">
            <CardHeader>
              <CardTitle>Create New Legacy Item</CardTitle>
              <CardDescription>
                Choose the type of legacy item you want to create
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type Selection */}
              <div>
                <Label>Item Type *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: key as LegacyItem['type'] })}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${formData.type === key 
                          ? 'border-foreground bg-foreground/5' 
                          : 'border-border/60 hover:border-border/80'
                        }
                      `}
                    >
                      <Icon icon={config.icon} className="h-6 w-6 mb-2 text-foreground" />
                      <p className="font-semibold text-sm">{config.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter a title for this legacy item"
                  className="mt-1"
                />
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Content/Description based on type */}
              {formData.type === 'story' || formData.type === 'letter' || formData.type === 'memory' ? (
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your story, memory, or letter here..."
                    rows={8}
                    className="mt-1"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this item..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              )}

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Childhood, Family, Career"
                  className="mt-1"
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Where did this take place?"
                  className="mt-1"
                />
              </div>

              {/* People */}
              <div>
                <Label htmlFor="people">People (comma separated)</Label>
                <Input
                  id="people"
                  value={formData.people}
                  onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                  placeholder="e.g., John, Sarah, Mom"
                  className="mt-1"
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., family, childhood, important"
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  <Icon icon="solar:check-circle-bold" className="h-4 w-4 mr-2" />
                  Create Legacy Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

