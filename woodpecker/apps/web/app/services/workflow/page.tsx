'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Badge, Progress, Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { cn } from '@woodpecker/utils'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'

interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'completed' | 'in-progress' | 'pending' | 'blocked'
  order: number
  estimatedTime?: string
  completedDate?: string
  startedDate?: string
  dependencies?: string[]
  tasks?: Array<{
    id: string
    name: string
    completed: boolean
  }>
}

const defaultWorkflowSteps: WorkflowStep[] = [
  {
    id: '1',
    name: 'Initial Assessment',
    description: 'Review your current estate situation and identify planning needs',
    status: 'completed',
    order: 1,
    estimatedTime: '1-2 hours',
    completedDate: '2024-01-10',
    tasks: [
      { id: '1-1', name: 'Complete financial assessment', completed: true },
      { id: '1-2', name: 'Review current documents', completed: true },
      { id: '1-3', name: 'Identify planning goals', completed: true },
    ],
  },
  {
    id: '2',
    name: 'Document Collection',
    description: 'Gather all relevant documents including existing wills, trusts, and financial records',
    status: 'completed',
    order: 2,
    estimatedTime: '2-3 hours',
    completedDate: '2024-01-15',
    tasks: [
      { id: '2-1', name: 'Collect existing wills', completed: true },
      { id: '2-2', name: 'Gather financial statements', completed: true },
      { id: '2-3', name: 'Organize property deeds', completed: true },
    ],
  },
  {
    id: '3',
    name: 'Will Drafting',
    description: 'Create your will with legal guidance and ensure all requirements are met',
    status: 'in-progress',
    order: 3,
    estimatedTime: '3-5 hours',
    startedDate: '2024-01-20',
    dependencies: ['1', '2'],
    tasks: [
      { id: '3-1', name: 'Draft will document', completed: true },
      { id: '3-2', name: 'Review with lawyer', completed: false },
      { id: '3-3', name: 'Finalize beneficiaries', completed: false },
    ],
  },
  {
    id: '4',
    name: 'Beneficiary Designation',
    description: 'Designate beneficiaries and executors for your estate',
    status: 'pending',
    order: 4,
    estimatedTime: '1-2 hours',
    dependencies: ['3'],
    tasks: [
      { id: '4-1', name: 'List all beneficiaries', completed: false },
      { id: '4-2', name: 'Assign executor', completed: false },
      { id: '4-3', name: 'Set distribution percentages', completed: false },
    ],
  },
  {
    id: '5',
    name: 'Review & Sign',
    description: 'Review all documents and sign with proper witnesses',
    status: 'pending',
    order: 5,
    estimatedTime: '1 hour',
    dependencies: ['4'],
    tasks: [
      { id: '5-1', name: 'Final review of documents', completed: false },
      { id: '5-2', name: 'Schedule signing appointment', completed: false },
      { id: '5-3', name: 'Sign with witnesses', completed: false },
    ],
  },
]

export default function PlanningWorkflowPage() {
  const [workflowSteps, setWorkflowSteps] = useLocalStorage<WorkflowStep[]>('workflow-steps', defaultWorkflowSteps)
  const [selectedStep, setSelectedStep] = React.useState<WorkflowStep | null>(null)
  const [isStepDetailOpen, setIsStepDetailOpen] = React.useState(false)
  const { toast } = useToast()

  const completedSteps = workflowSteps.filter(s => s.status === 'completed').length
  const inProgressSteps = workflowSteps.filter(s => s.status === 'in-progress').length
  const progress = (completedSteps / workflowSteps.length) * 100

  const handleStepClick = (step: WorkflowStep) => {
    setSelectedStep(step)
    setIsStepDetailOpen(true)
  }

  const handleTaskToggle = (stepId: string, taskId: string) => {
    setWorkflowSteps(workflowSteps.map(step => {
      if (step.id === stepId) {
        const updatedTasks = step.tasks?.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ) || []
        const allCompleted = updatedTasks.every(t => t.completed)
        return {
          ...step,
          tasks: updatedTasks,
          status: allCompleted ? 'completed' : step.status === 'pending' ? 'in-progress' : step.status,
          completedDate: allCompleted ? new Date().toISOString() : step.completedDate,
        }
      }
      return step
    }))
    toast.success('Task updated', 'Task status has been updated')
  }

  const handleStartStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.map(step => {
      if (step.id === stepId && step.status === 'pending') {
        // Check dependencies
        const dependencies = step.dependencies || []
        const allDepsCompleted = dependencies.every(depId => {
          const depStep = workflowSteps.find(s => s.id === depId)
          return depStep?.status === 'completed'
        })
        if (!allDepsCompleted) {
          toast.error('Dependencies required', 'Please complete previous steps first')
          return step
        }
        return {
          ...step,
          status: 'in-progress',
          startedDate: new Date().toISOString(),
        }
      }
      return step
    }))
  }

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-foreground/5 text-foreground border-border/60'
      case 'in-progress':
        return 'bg-foreground/5 text-foreground border-border/60'
      case 'blocked':
        return 'bg-muted/50 text-muted-foreground border-border/40'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'solar:check-circle-bold'
      case 'in-progress':
        return 'solar:refresh-bold'
      case 'blocked':
        return 'solar:danger-triangle-bold'
      default:
        return 'solar:circle-bold'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Planning Workflow
              </h1>
              <p className="text-muted-foreground">
                Track your estate planning progress step by step
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allStepsCompleted = workflowSteps.every(s => s.status === 'completed')
                  if (allStepsCompleted) {
                    toast.success('Workflow Complete!', 'Congratulations on completing your estate planning workflow')
                  } else {
                    toast.info('Workflow in Progress', `${completedSteps} of ${workflowSteps.length} steps completed`)
                  }
                }}
              >
                <Icon icon="solar:info-circle-bold-duotone" className="h-4 w-4 mr-2" />
                Status
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                    <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                  </div>
                  <Icon icon="solar:chart-2-bold-duotone" className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-foreground">{completedSteps}</p>
                  </div>
                  <Icon icon="solar:check-circle-bold-duotone" className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                    <p className="text-2xl font-bold text-foreground">{inProgressSteps}</p>
                  </div>
                  <Icon icon="solar:refresh-bold-duotone" className="h-8 w-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border border-border/60 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-base">Overall Progress</CardTitle>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardHeader>
          </Card>

          {/* Workflow Steps */}
          <div className="space-y-4">
            {workflowSteps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => {
                const canStart = step.status === 'pending' && 
                  (!step.dependencies || step.dependencies.every(depId => {
                    const depStep = workflowSteps.find(s => s.id === depId)
                    return depStep?.status === 'completed'
                  }))
                const taskProgress = step.tasks 
                  ? (step.tasks.filter(t => t.completed).length / step.tasks.length) * 100
                  : 0

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "border border-border/60 transition-all cursor-pointer hover:shadow-lg",
                        step.status === 'in-progress' && "ring-2 ring-foreground/20",
                        step.status === 'completed' && "bg-foreground/5"
                      )}
                      onClick={() => handleStepClick(step)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all",
                            step.status === 'completed' && "bg-foreground/5 text-foreground border-border/60",
                            step.status === 'in-progress' && "bg-foreground/5 text-foreground border-border/60 animate-pulse",
                            step.status === 'blocked' && "bg-muted/50 text-muted-foreground border-border/40",
                            step.status === 'pending' && "bg-muted text-muted-foreground border-border"
                          )}>
                            {step.status === 'completed' ? (
                              <Icon icon="solar:check-circle-bold" className="h-6 w-6" />
                            ) : step.status === 'in-progress' ? (
                              <Icon icon="solar:refresh-bold" className="h-6 w-6 animate-spin" />
                            ) : step.status === 'blocked' ? (
                              <Icon icon="solar:danger-triangle-bold" className="h-6 w-6" />
                            ) : (
                              <span className="text-lg font-semibold">{step.order}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground text-lg">{step.name}</h3>
                                  <Badge className={cn("text-xs", getStatusColor(step.status))}>
                                    {step.status.replace('-', ' ')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                            {step.tasks && step.tasks.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Tasks</span>
                                  <span className="font-medium">
                                    {step.tasks.filter(t => t.completed).length} / {step.tasks.length}
                                  </span>
                                </div>
                                <Progress value={taskProgress} className="h-1.5" />
                                <div className="space-y-1 mt-2">
                                  {step.tasks.slice(0, 3).map((task) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center gap-2 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleTaskToggle(step.id, task.id)
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => {}}
                                        className="h-3 w-3 rounded border-border"
                                      />
                                      <span className={cn(
                                        task.completed && "line-through text-muted-foreground"
                                      )}>
                                        {task.name}
                                      </span>
                                    </div>
                                  ))}
                                  {step.tasks.length > 3 && (
                                    <p className="text-xs text-muted-foreground">
                                      +{step.tasks.length - 3} more tasks
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              {step.estimatedTime && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="solar:clock-circle-bold" className="h-3.5 w-3.5" />
                                  {step.estimatedTime}
                                </span>
                              )}
                              {step.completedDate && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="solar:calendar-mark-bold-duotone" className="h-3.5 w-3.5" />
                                  Completed {new Date(step.completedDate).toLocaleDateString()}
                                </span>
                              )}
                              {step.startedDate && !step.completedDate && (
                                <span className="flex items-center gap-1">
                                  <Icon icon="solar:calendar-mark-bold-duotone" className="h-3.5 w-3.5" />
                                  Started {new Date(step.startedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {canStart && (
                              <Button
                                size="sm"
                                className="mt-3"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStartStep(step.id)
                                }}
                              >
                                <Icon icon="solar:play-bold-duotone" className="h-3.5 w-3.5 mr-1.5" />
                                Start Step
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </main>

      {/* Step Detail Dialog */}
      <Dialog open={isStepDetailOpen} onOpenChange={setIsStepDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStep && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn("text-xs", getStatusColor(selectedStep.status))}>
                    {selectedStep.status.replace('-', ' ')}
                  </Badge>
                  {selectedStep.estimatedTime && (
                    <Badge variant="outline" className="text-xs">
                      <Icon icon="solar:clock-circle-bold" className="h-3 w-3 mr-1" />
                      {selectedStep.estimatedTime}
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl">{selectedStep.name}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedStep.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedStep.tasks && selectedStep.tasks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Tasks</h4>
                    <div className="space-y-2">
                      {selectedStep.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(selectedStep.id, task.id)}
                            className="h-4 w-4 rounded border-border"
                          />
                          <span className={cn(
                            "flex-1 text-sm",
                            task.completed && "line-through text-muted-foreground"
                          )}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedStep.dependencies && selectedStep.dependencies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Dependencies</h4>
                    <p className="text-sm text-muted-foreground">
                      This step requires completion of: {selectedStep.dependencies.map(depId => {
                        const depStep = workflowSteps.find(s => s.id === depId)
                        return depStep?.name
                      }).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStepDetailOpen(false)}>
                  Close
                </Button>
                {selectedStep.status === 'pending' && (
                  <Button onClick={() => {
                    handleStartStep(selectedStep.id)
                    setIsStepDetailOpen(false)
                  }}>
                    Start Step
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
