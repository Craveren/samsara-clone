'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useToast } from '@/lib/hooks'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
// noop for diff

interface LawyerStatCard {
  id: string
  title: string
  description: string
  value: string
  icon: string
  color: string
  createdAt: string
  updatedAt: string
}

export function LawyerStatsCardManager() {
  const { toast } = useToast()
  const [statsCards, setStatsCards] = useLocalStorage<LawyerStatCard[]>('lawyer-stats-cards', [
    {
      id: '1',
      title: 'Assisted Probate Cases',
      description: 'Total probate cases successfully managed',
      value: '30+',
      icon: 'mdi:briefcase-check-outline',
      color: 'blue',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Drafted Documents',
      description: 'Wills and executorship documents created',
      value: '120+',
      icon: 'mdi:file-document-edit-outline',
      color: 'purple',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    value: '',
    icon: 'mdi:chart-line',
    color: 'blue',
  })

  const colorConfig = {
    blue: 'bg-foreground/5 border border-border/60 text-foreground',
    purple: 'bg-foreground/5 border border-border/60 text-foreground',
    green: 'bg-foreground/5 border border-border/60 text-foreground',
    amber: 'bg-foreground/5 border border-border/60 text-foreground',
    slate: 'bg-foreground/5 border border-border/60 text-foreground',
  }

  const handleCreate = () => {
    if (!formData.title || !formData.value) {
      toast.error('Missing Information', 'Please fill in title and value')
      return
    }

    const newCard: LawyerStatCard = {
      id: `stat-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setStatsCards(prev => [...prev, newCard])
    toast.success('Stats Card Created', 'Your new stats card has been saved')
    setIsCreateDialogOpen(false)
    setFormData({
      title: '',
      description: '',
      value: '',
      icon: 'mdi:chart-line',
      color: 'blue',
    })
  }

  const handleDelete = (id: string) => {
    setStatsCards(prev => prev.filter(card => card.id !== id))
    toast.success('Stats Card Deleted', 'The stats card has been removed')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Professional Stats Cards</h3>
          <p className="text-sm text-muted-foreground">
            Showcase your professional achievements and experience
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon icon="mdi:plus" className="h-4 w-4 mr-2" />
              Create Stats Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Stats Card</DialogTitle>
              <DialogDescription>
                Add a professional achievement or statistic to display on your profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Assisted 30+ probate cases"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this achievement"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., 30+ or 120+"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="mdi:chart-line"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="amber">Amber</option>
                    <option value="slate">Slate</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <Card className="border border-border/40 hover:border-border/60 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                    colorConfig[card.color as keyof typeof colorConfig] || colorConfig.blue
                  )}>
                    <Icon icon={card.icon} className="h-6 w-6" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(card.id)}
                  >
                    <Icon icon="mdi:delete-outline" className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  {card.description && (
                    <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {statsCards.length === 0 && (
        <Card className="border border-border/40">
          <CardContent className="py-12 text-center">
            <Icon icon="mdi:chart-line" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">No stats cards yet</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Icon icon="mdi:plus" className="h-4 w-4 mr-2" />
              Create Your First Stats Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

