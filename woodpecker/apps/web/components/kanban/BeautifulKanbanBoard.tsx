'use client'

import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@woodpecker/ui'
import { Badge } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { cn } from '@woodpecker/utils'
import { formatDate } from '@woodpecker/utils'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'

export interface KanbanTask {
  id: string
  title: string
  description?: string
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  clientName?: string
  dueDate?: string
  tags?: string[]
  createdAt: string
}

//abracadabra

interface KanbanColumn {
  id: KanbanTask['status']
  title: string
  color: string
  icon: string
  accentColor: string
}

const columns: KanbanColumn[] = [
  { 
    id: 'backlog', 
    title: 'Backlog', 
    color: 'bg-card/50 backdrop-blur-sm border-border/60',
    icon: 'mdi:inbox-outline',
    accentColor: 'bg-muted/50'
  },
  { 
    id: 'todo', 
    title: 'To Do', 
    color: 'bg-card/50 backdrop-blur-sm border-border/60',
    icon: 'mdi:clipboard-text-outline',
    accentColor: 'bg-muted/50'
  },
  { 
    id: 'in-progress', 
    title: 'In Progress', 
    color: 'bg-card/50 backdrop-blur-sm border-border/60',
    icon: 'mdi:play-circle-outline',
    accentColor: 'bg-muted/50'
  },
  { 
    id: 'review', 
    title: 'Review', 
    color: 'bg-card/50 backdrop-blur-sm border-border/60',
    icon: 'mdi:eye-outline',
    accentColor: 'bg-muted/50'
  },
  { 
    id: 'done', 
    title: 'Done', 
    color: 'bg-card/50 backdrop-blur-sm border-border/60',
    icon: 'mdi:check-circle-outline',
    accentColor: 'bg-muted/50'
  },
]

interface KanbanColumnComponentProps {
  column: KanbanColumn
  tasks: KanbanTask[]
  isOver?: boolean
}

function KanbanColumnComponent({ column, tasks, isOver }: KanbanColumnComponentProps) {
  const { setNodeRef, isOver: isDroppableOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full min-h-[600px] rounded-xl border transition-all',
        column.color,
        (isOver || isDroppableOver) && 'ring-2 ring-foreground ring-offset-2 scale-[1.01] border-foreground'
      )}
    >
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', column.accentColor)}>
              <Icon icon={column.icon} className="h-4 w-4 text-foreground" />
            </div>
            <h3 className="font-medium text-sm text-foreground">{column.title}</h3>
          </div>
          <Badge variant="secondary" className="text-[11px] font-medium bg-foreground/10 text-foreground">
            {tasks.length}
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center border border-dashed border-border/60 rounded-lg bg-muted/30">
            <Icon icon="solar:inbox-line-linear" className="h-6 w-6 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface KanbanTaskCardProps {
  task: KanbanTask
}

function KanbanTaskCard({ task }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityConfig = {
    high: { color: 'bg-foreground/10 text-foreground border-border/60', icon: 'mdi:alert-circle-outline', label: 'High' },
    medium: { color: 'bg-foreground/5 text-foreground border-border/60', icon: 'mdi:flag-outline', label: 'Medium' },
    low: { color: 'bg-muted/50 text-muted-foreground border-border/40', icon: 'mdi:arrow-down-circle-outline', label: 'Low' },
  }

  const priority = priorityConfig[task.priority]

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'bg-card/80 backdrop-blur-sm border border-border/60 rounded-lg p-4 hover:border-border hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing group',
          isDragging && 'shadow-xl rotate-1 border-foreground/60'
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="mt-0.5 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
            >
              <Icon icon="solar:hamburger-menu-linear" className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="solar:menu-dots-bold" className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Icon icon="solar:pen-2-linear" className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon icon="solar:eye-linear" className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 3).map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[10px] px-1.5 py-0 border-border/60 bg-muted/50"
              >
                <Icon icon="solar:tag-linear" className="h-2.5 w-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge
              variant="outline"
              className={cn('text-[10px] px-1.5 py-0 border gap-1', priority.color)}
            >
              <Icon icon={priority.icon} className="h-2.5 w-2.5" />
              {priority.label}
            </Badge>
            {task.clientName && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[80px] flex items-center gap-1">
                <Icon icon="solar:user-linear" className="h-2.5 w-2.5" />
                {task.clientName}
              </span>
            )}
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
              <Icon icon="solar:calendar-linear" className="h-3 w-3" />
              <span>{formatDate(task.dueDate, 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>

      <TaskEditDialog 
        task={task} 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  )
}

function TaskEditDialog({ task, isOpen, onClose }: { task: KanbanTask; isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = React.useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    assignee: task.assignee || '',
    clientName: task.clientName || '',
    dueDate: task.dueDate || '',
    tags: task.tags?.join(', ') || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle update
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and properties
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: KanbanTask['status']) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-1">
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
                onValueChange={(value: KanbanTask['priority']) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="mt-1">
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
                className="mt-1"
                placeholder="Name or email"
              />
            </div>
            <div>
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="mt-1"
                placeholder="Client name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="mt-1"
              placeholder="urgent, legal, review"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface BeautifulKanbanBoardProps {
  initialTasks?: KanbanTask[]
  onTaskUpdate?: (tasks: KanbanTask[]) => void
  onTaskCreate?: () => void
  storageKey?: string
}

export function BeautifulKanbanBoard({
  initialTasks = [],
  onTaskUpdate,
  onTaskCreate,
  storageKey = 'kanban-tasks',
}: BeautifulKanbanBoardProps) {
  // Use useEffect to sync with localStorage only on client to prevent hydration mismatch
  const [tasks, setTasks] = React.useState<KanbanTask[]>([])
  
  React.useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTasks(parsed)
            return
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
        console.warn('[Kanban] Failed to load from localStorage:', e)
        }
      }
    }
    setTasks(initialTasks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount
  
  // Save tasks to localStorage when they change and notify parent
  React.useEffect(() => {
    if (typeof window !== 'undefined' && storageKey && tasks.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tasks))
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
        console.warn('[Kanban] Failed to save to localStorage:', e)
        }
      }
    }
    // Notify parent of task updates (use useEffect to avoid setState during render)
    if (onTaskUpdate && tasks.length > 0) {
      onTaskUpdate(tasks)
    }
  }, [tasks, storageKey, onTaskUpdate])
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null)
  const [filterStatus, setFilterStatus] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (over) {
      const overId = over.id as string
      if (columns.some(col => col.id === overId)) {
        setOverColumnId(overId)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverColumnId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the task being dragged
    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Check if dropped on a column
    const targetColumn = columns.find(col => col.id === overId)
    if (targetColumn) {
      // Move to new column
      setTasks(prev => {
        const updated = prev.map(task =>
          task.id === activeId ? { ...task, status: targetColumn.id } : task
        )
        // Don't call onTaskUpdate here - it will be called in useEffect
        return updated
      })
      return
    }

    // Check if dropped on another task
    const overTask = tasks.find(t => t.id === overId)
    if (overTask) {
      const activeIndex = tasks.findIndex(t => t.id === activeId)
      const overIndex = tasks.findIndex(t => t.id === overId)

      if (activeTask.status === overTask.status) {
        // Reorder within same column
        setTasks(prev => {
          const updated = arrayMove(prev, activeIndex, overIndex)
          // Don't call onTaskUpdate here - it will be called in useEffect
          return updated
        })
      } else {
        // Move to different column and position
        setTasks(prev => {
          const updated = prev.map(task =>
            task.id === activeId ? { ...task, status: overTask.status } : task
          )
          const reordered = arrayMove(
            updated,
            activeIndex,
            overIndex
          )
          // Don't call onTaskUpdate here - it will be called in useEffect
          return reordered
        })
      }
    }
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

  // Filter and search tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus) {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    return filtered
  }, [tasks, searchQuery, filterStatus])

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped: Record<string, KanbanTask[]> = {}
    columns.forEach(col => {
      grouped[col.id] = filteredTasks.filter(t => t.status === col.id)
    })
    return grouped
  }, [filteredTasks])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header with Stats and Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-1">Task Board</h2>
            <p className="text-sm text-muted-foreground">
              Drag and drop tasks to organize your work
            </p>
          </div>
          {onTaskCreate && (
            <Button onClick={onTaskCreate} className="bg-foreground text-background hover:bg-foreground/90">
              <Icon icon="solar:add-circle-bold" className="h-4 w-4 mr-2" />
              New Task
            </Button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border border-border/60">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Tasks</p>
                  <p className="text-lg font-semibold text-foreground">{totalTasks}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                  <Icon icon="solar:clipboard-list-bold-duotone" className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/60">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                  <p className="text-lg font-semibold text-foreground">{inProgressTasks}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                  <Icon icon="solar:play-circle-bold-duotone" className="h-4 w-4 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/60">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <p className="text-lg font-semibold text-foreground">{completedTasks}</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center">
                  <Icon icon="solar:check-circle-bold-duotone" className="h-4 w-4 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={filterStatus || 'all'} onValueChange={(value) => setFilterStatus(value === 'all' ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || filterStatus) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setFilterStatus(null)
              }}
            >
              <Icon icon="solar:close-circle-linear" className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-w-max h-full">
            {columns.map((column) => (
              <div key={column.id} className="w-80 flex-shrink-0">
                <KanbanColumnComponent
                  column={column}
                  tasks={tasksByStatus[column.id] || []}
                  isOver={overColumnId === column.id}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-card border-2 border-black rounded-lg p-3 shadow-2xl rotate-2 w-80">
                <h4 className="font-medium text-sm text-foreground mb-1">
                  {activeTask.title}
                </h4>
                {activeTask.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activeTask.description}
                  </p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
