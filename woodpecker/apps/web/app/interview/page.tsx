'use client'

import * as React from 'react'
import { RoleBasedSidebar } from '@/components/sidebar/RoleBasedSidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@woodpecker/ui'
import { Button, Badge } from '@woodpecker/ui'
import { PageHeader } from '@/components/layout/PageHeader'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Icon } from '@iconify/react'
import { Icons } from '@/lib/icons'
import { formatDate } from '@woodpecker/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@woodpecker/ui'
import { Input } from '@woodpecker/ui'
import { Label } from '@woodpecker/ui'
import { Textarea } from '@woodpecker/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@woodpecker/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@woodpecker/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@woodpecker/ui'
import { Separator } from '@woodpecker/ui'
import { useToast } from '@/lib/hooks'
import { useUser } from '@clerk/nextjs'
import { cn } from '@woodpecker/utils'
import { StoryPromptCard } from '@/components/interview/StoryPromptCard'
import { motion } from 'framer-motion'

interface Interview {
  id: string
  title: string
  prompt: string
  transcript?: string
  audioUrl?: string
  duration?: number
  recordedAt: string
  status: 'draft' | 'recording' | 'completed'
  invitedEmails?: string[]
  isInvitational?: boolean
}

const interviewPrompts = [
  {
    id: 'childhood',
    title: 'Childhood Memories',
    prompt: 'Tell me about your favorite childhood memory. What made it special?',
  },
  {
    id: 'family',
    title: 'Family Stories',
    prompt: 'Share a story about your family that you want future generations to know.',
  },
  {
    id: 'wisdom',
    title: 'Life Lessons',
    prompt: 'What is the most important lesson life has taught you?',
  },
  {
    id: 'love',
    title: 'Love & Relationships',
    prompt: 'Describe a moment when you felt truly loved or gave love to someone.',
  },
  {
    id: 'achievement',
    title: 'Proudest Moment',
    prompt: 'What achievement are you most proud of? Why does it matter to you?',
  },
]

export default function InterviewPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [mounted, setMounted] = React.useState(false)
  const [interviews, setInterviews] = useLocalStorage<Interview[]>('woodpecker-interviews', [])
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(null)
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingTime, setRecordingTime] = React.useState(0)
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([])
  const [transcript, setTranscript] = React.useState('')
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [selectedInterview, setSelectedInterview] = React.useState<Interview | null>(null)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      })
      
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
          
          // Convert to base64 data URL for persistence
          const reader = new FileReader()
          reader.onloadend = () => {
            const audioUrl = reader.result as string
            
            const newInterview: Interview = {
              id: `interview-${Date.now()}`,
              title: interviewPrompts.find(p => p.id === selectedPrompt)?.title || 'Untitled Interview',
              prompt: interviewPrompts.find(p => p.id === selectedPrompt)?.prompt || '',
              audioUrl,
              duration: recordingTime,
              recordedAt: new Date().toISOString(),
              status: 'completed',
              transcript: transcript || 'Transcription will be available after processing...',
              isInvitational: false,
            }

            setInterviews(prev => [newInterview, ...prev])
            toast.success('Recording Saved', 'Your interview has been saved successfully')
            setAudioChunks([])
            setRecordingTime(0)
            setTranscript('')
            setSelectedPrompt(null)
            setIsRecording(false)
            
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop())
          }
          reader.onerror = () => {
            toast.error('Save Failed', 'Could not save the recording')
          }
          reader.readAsDataURL(audioBlob)
        } catch (error) {
          console.error('Error processing recording:', error)
          toast.error('Processing Failed', 'Could not process the recording')
        }
      }

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        toast.error('Recording Error', 'An error occurred during recording')
      }

      // Start recording with timeslice for better chunk handling
      recorder.start(1000) // Collect data every second
      setMediaRecorder(recorder)
      setIsRecording(true)
      setAudioChunks(chunks)

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      toast.success('Recording Started', 'Your interview is being recorded')
    } catch (error: any) {
      console.error('Error accessing microphone:', error)
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Microphone Access Denied', 'Please allow microphone access in your browser settings')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast.error('No Microphone Found', 'Please connect a microphone and try again')
      } else {
        toast.error('Recording Failed', error.message || 'Could not start recording')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDelete = (id: string) => {
    const interview = interviews.find(i => i.id === id)
    // Revoke blob URL if it exists (for old recordings that might still use blob URLs)
    if (interview?.audioUrl && interview.audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(interview.audioUrl)
    }
    setInterviews(prev => prev.filter(interview => interview.id !== id))
    toast.success('Interview Deleted', 'The interview has been removed')
  }

  // Cleanup blob URLs on unmount
  React.useEffect(() => {
    return () => {
      interviews.forEach(interview => {
        if (interview.audioUrl && interview.audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(interview.audioUrl)
        }
      })
    }
  }, [])

  const handleInviteToInterview = () => {
    if (!inviteEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      toast.error('Invalid Email', 'Please enter a valid email address')
      return
    }

    if (!selectedInterview) {
      toast.error('No Interview Selected', 'Please select an interview to invite to')
      return
    }

    setInterviews(prev =>
      prev.map(interview =>
        interview.id === selectedInterview.id
          ? {
              ...interview,
              invitedEmails: (interview.invitedEmails || []).includes(inviteEmail)
                ? interview.invitedEmails
                : [...(interview.invitedEmails || []), inviteEmail],
              isInvitational: true,
            }
          : interview
      )
    )

    toast.success('Invitation Sent', `Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
    setIsInviteDialogOpen(false)
    setSelectedInterview(null)
  }

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaRecorder])

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <RoleBasedSidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="h-10 w-10 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <RoleBasedSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <PageHeader
            title="Voice Interview Studio"
            description="Record your stories and invite others to share their memories"
            actions={
              <Button
                onClick={() => setSelectedPrompt(null)}
                className="bg-black text-white hover:bg-black/90"
              >
                <Icon icon={Icons.mic} className="h-4 w-4 mr-2" />
                New Interview
              </Button>
            }
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{mounted ? interviews.length : 0}</div>
                <div className="text-sm text-muted-foreground">Total Interviews</div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {mounted ? interviews.filter(i => i.status === 'completed').length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {mounted ? interviews.filter(i => i.isInvitational).length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Invitational</div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {mounted
                    ? Math.round(
                        interviews.reduce((sum, i) => sum + (i.duration || 0), 0) / 60
                      )
                    : 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Minutes</div>
              </CardContent>
            </Card>
          </div>

          {/* Recording Interface */}
          {!selectedPrompt ? (
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon icon={Icons.sparkles} className="h-5 w-5" />
                  Choose a Story Prompt
                </CardTitle>
                <CardDescription>
                  Select a prompt to begin recording your story, or invite others to share theirs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interviewPrompts.map((prompt, index) => (
                    <StoryPromptCard
                      key={prompt.id}
                      id={prompt.id}
                      title={prompt.title}
                      prompt={prompt.prompt}
                      onClick={() => setSelectedPrompt(prompt.id)}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {interviewPrompts.find(p => p.id === selectedPrompt)?.title}
                  </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPrompt(null)
                        setTranscript('')
                        setIsRecording(false)
                      }}
                    >
                      <Icon icon={Icons.close} className="h-4 w-4" />
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/30 border border-border rounded-lg">
                  <p className="text-gray-700 font-medium">
                    {interviewPrompts.find(p => p.id === selectedPrompt)?.prompt}
                  </p>
                </div>

                {!isRecording && !transcript && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6 p-8"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Record?</h3>
                      <p className="text-sm text-muted-foreground">
                        Take a deep breath and share your story when you're ready
                      </p>
                    </div>
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="bg-foreground text-background hover:bg-foreground/90 border-foreground h-16 px-12 text-lg shadow-xl"
                    >
                      <Icon icon="mdi:record-circle" className="h-6 w-6 mr-2 text-red-500" />
                      Start Recording
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPrompt(null)
                        setTranscript('')
                      }}
                      className="border-border"
                    >
                      <Icon icon="mdi:arrow-left" className="h-4 w-4 mr-2" />
                      Choose Different Prompt
                    </Button>
                  </motion.div>
                )}

                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-muted/50 to-background rounded-2xl border-2 border-red-500/20"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative"
                    >
                      <div className="h-24 w-24 rounded-full bg-foreground flex items-center justify-center shadow-lg shadow-foreground/20">
                        <Icon icon="mdi:microphone" className="h-12 w-12 text-background" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-foreground/20 animate-ping" />
                    </motion.div>
                    <div className="text-4xl font-mono font-bold text-foreground">
                      {formatTime(recordingTime)}
                    </div>
                    <Button
                      onClick={stopRecording}
                      size="lg"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white h-14 px-8"
                    >
                      <Icon icon="mdi:stop" className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Recording in progress... Speak naturally and take your time. Your story is being captured.
                    </p>
                  </motion.div>
                )}

                {transcript && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="transcript">Transcript</Label>
                      <Textarea
                        id="transcript"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="w-full p-4 border border-border rounded-lg min-h-[200px] mt-2"
                        placeholder="Your transcript will appear here..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setTranscript('')} variant="outline" className="border-border">
                        Clear
                      </Button>
                      <Button
                        onClick={() => {
                          const newInterview: Interview = {
                            id: `interview-${Date.now()}`,
                            title: interviewPrompts.find(p => p.id === selectedPrompt)?.title || 'Untitled',
                            prompt: interviewPrompts.find(p => p.id === selectedPrompt)?.prompt || '',
                            transcript,
                            duration: recordingTime,
                            recordedAt: new Date().toISOString(),
                            status: 'completed',
                          }
                          setInterviews(prev => [newInterview, ...prev])
                          setSelectedPrompt(null)
                          setTranscript('')
                          toast.success('Interview Saved', 'Your interview has been saved')
                        }}
                        className="bg-black text-white hover:bg-black/90"
                      >
                        Save Interview
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recorded Interviews */}
          {interviews.length > 0 && (
            <div className="mt-8">
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All ({interviews.length})</TabsTrigger>
                  <TabsTrigger value="invitational">
                    Invitational ({interviews.filter(i => i.isInvitational).length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({interviews.filter(i => i.status === 'completed').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {interviews.map((interview) => (
                      <Card key={interview.id} className="border border-border hover:shadow-lg transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base mb-1">{interview.title}</CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(interview.recordedAt, 'MMM d, yyyy')}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(interview.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Icon icon={Icons.trash} className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Icon icon={Icons.clock} className="h-4 w-4" />
                            {interview.duration ? formatTime(interview.duration) : 'N/A'}
                          </div>
                          {interview.audioUrl && (
                            <audio controls className="w-full" src={interview.audioUrl} />
                          )}
                          {interview.transcript && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm line-clamp-3">
                              <p>{interview.transcript}</p>
                            </div>
                          )}
                          {interview.isInvitational && interview.invitedEmails && interview.invitedEmails.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon icon={Icons.email} className="h-3 w-3" />
                              <span>{interview.invitedEmails.length} invited</span>
                            </div>
                          )}
                          <div className="flex gap-2 pt-2 border-t border-gray-200">
                            {interview.audioUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const a = document.createElement('a')
                                  a.href = interview.audioUrl!
                                  a.download = `${interview.title}.webm`
                                  a.click()
                                }}
                                className="flex-1 border-border"
                              >
                                <Icon icon={Icons.download} className="h-3.5 w-3.5 mr-1.5" />
                                Download
                              </Button>
                            )}
                            <Dialog open={isInviteDialogOpen && selectedInterview?.id === interview.id} onOpenChange={setIsInviteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInterview(interview)
                                    setIsInviteDialogOpen(true)
                                  }}
                                  className="flex-1 border-border"
                                >
                                  <Icon icon={Icons.share} className="h-3.5 w-3.5 mr-1.5" />
                                  Invite
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Invite to Interview</DialogTitle>
                                  <DialogDescription>
                                    Share this interview with others via email
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="invite-email">Email Address</Label>
                                    <Input
                                      id="invite-email"
                                      type="email"
                                      value={inviteEmail}
                                      onChange={(e) => setInviteEmail(e.target.value)}
                                      placeholder="friend@example.com"
                                    />
                                  </div>
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-700">
                                      <Icon icon={Icons.lock} className="h-3 w-3 inline mr-1" />
                                      Invited users will be able to view and contribute to this interview
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsInviteDialogOpen(false)
                                      setInviteEmail('')
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleInviteToInterview}
                                    className="bg-black text-white hover:bg-black/90"
                                  >
                                    <Icon icon={Icons.email} className="h-4 w-4 mr-2" />
                                    Send Invitation
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="invitational" className="space-y-4">
                  {interviews.filter(i => i.isInvitational).length === 0 ? (
                    <Card className="border border-border">
                      <CardContent className="py-12 text-center">
                        <Icon icon={Icons.userPlus} className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No invitational interviews yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {interviews
                        .filter(i => i.isInvitational)
                        .map((interview) => (
                          <Card key={interview.id} className="border border-border">
                            <CardHeader>
                              <CardTitle className="text-base">{interview.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {interview.invitedEmails?.map((email, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="bg-black text-white text-xs">
                                        {email[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-muted-foreground">{email}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {interviews
                      .filter(i => i.status === 'completed')
                      .map((interview) => (
                        <Card key={interview.id} className="border border-border">
                          <CardHeader>
                            <CardTitle className="text-base">{interview.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon icon={Icons.clock} className="h-4 w-4" />
                                {interview.duration ? formatTime(interview.duration) : 'N/A'}
                              </div>
                              {interview.transcript && (
                                <p className="text-sm line-clamp-3">{interview.transcript}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
