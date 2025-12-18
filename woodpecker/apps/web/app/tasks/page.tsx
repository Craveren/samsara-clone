'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { BeautifulKanbanBoard, type KanbanTask } from '@/components/kanban/BeautifulKanbanBoard'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useModal } from '@/lib/hooks'
import { Modal } from '@/components/ui/modal'
import { Button } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { cn } from '@woodpecker/utils'
// noop for diff

const initialTasks: KanbanTask[] = [
  {
    id: '1',
    title: 'Update Last Will and Testament',
    description: 'Review and update will with new beneficiaries',
    status: 'in-progress',
    priority: 'high',
    assignee: 'John Doe',
    dueDate: '2024-12-31',
    tags: ['legal', 'urgent'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Organize Financial Documents',
    description: 'Gather all bank statements and investment records',
    status: 'todo',
    priority: 'medium',
    tags: ['financial'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Record Family Stories',
    description: 'Interview grandparents about family history',
    status: 'backlog',
    priority: 'low',
    tags: ['personal'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Set Up Trust Fund',
    description: 'Create trust for children\'s education',
    status: 'done',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['legal', 'completed'],
    createdAt: new Date().toISOString(),
  },
]

export default function TasksPage() {
  // Use useState with useEffect to prevent hydration mismatch
  const [tasks, setTasks] = React.useState<KanbanTask[]>([])
  const [isClient, setIsClient] = React.useState(false)
  
  React.useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('woodpecker-kanban-tasks')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTasks(parsed)
            return
          }
        }
      } catch (e) {
        console.warn('[Tasks] Failed to load from localStorage:', e)
      }
      setTasks(initialTasks)
    }
  }, [])
  const { isOpen, open, close } = useModal()
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    priority: 'medium' as KanbanTask['priority'],
    status: 'backlog' as KanbanTask['status'],
    assignee: '',
    dueDate: '',
    tags: '',
  })

  const handleTaskCreate = () => {
    if (!formData.title.trim()) return

    const newTask: KanbanTask = {
      id: Math.random().toString(36).substring(7),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee || undefined,
      dueDate: formData.dueDate || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
      createdAt: new Date().toISOString(),
    }

    setTasks([...tasks, newTask])
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'backlog',
      assignee: '',
      dueDate: '',
      tags: '',
    })
    close()
  }

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6 flex items-center justify-center">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6 bg-background" data-intro="kanban-board">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
                <p className="text-muted-foreground">
                  Manage your estate planning tasks with a visual Kanban board. Drag and drop tasks between columns to track progress.
                </p>
              </div>
              <Button
                onClick={open}
                className="hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <Icon icon="solar:add-circle-bold" className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </motion.div>
          <div className="h-[calc(100%-120px)]">
            <BeautifulKanbanBoard
              initialTasks={tasks}
              onTaskUpdate={setTasks}
              onTaskCreate={open}
              storageKey="woodpecker-kanban-tasks"
            />
          </div>
        </div>
      </main>
      
      <Modal isOpen={isOpen} onClose={close} title="Create New Task" size="lg" showCloseButton={true}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as KanbanTask['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as KanbanTask['priority'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="Person name"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="legal, urgent, financial"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleTaskCreate} disabled={!formData.title.trim()}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
