'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@woodpecker/ui'
import { Button } from '@woodpecker/ui'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@woodpecker/utils'

interface VideoCallModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  lawyerId?: string
  lawyerName?: string
  participantName?: string
}

export function VideoCallModal({ open = false, onOpenChange, lawyerId, lawyerName, participantName }: VideoCallModalProps) {
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null)
  const localVideoRef = React.useRef<HTMLVideoElement>(null)
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isVideoOff, setIsVideoOff] = React.useState(false)
  const [callDuration, setCallDuration] = React.useState(0)

  React.useEffect(() => {
    if (open && !isConnected) {
      setIsConnecting(true)
      // Simulate connection
      setTimeout(() => {
        setIsConnecting(false)
        setIsConnected(true)
        startCall()
      }, 2000)
    } else if (!open) {
      endCall()
    }
  }, [open])

  React.useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop())
      setRemoteStream(null)
    }
    setIsConnected(false)
    setIsConnecting(false)
    setCallDuration(0)
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-full w-full h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Video Call</DialogTitle>
              <DialogDescription>
                {lawyerName || participantName ? `Calling ${lawyerName || participantName}` : 'Video Call'}
              </DialogDescription>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Icon icon="solar:phone-calling-bold-duotone" className="h-4 w-4" />
                <span>{formatTime(callDuration)}</span>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="flex-1 relative bg-background overflow-hidden">
          <AnimatePresence mode="wait">
            {isConnecting && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="h-20 w-20 rounded-full bg-foreground/10 flex items-center justify-center"
                >
                  <Icon icon="solar:phone-calling-bold-duotone" className="h-10 w-10 text-foreground" />
                </motion.div>
                <p className="text-sm text-muted-foreground">Connecting...</p>
              </motion.div>
            )}

            {isConnected && (
              <motion.div
                key="connected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex"
              >
                {/* Remote Video (Main) */}
                <div className="flex-1 relative bg-muted/30">
                  {remoteStream ? (
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="h-24 w-24 rounded-full bg-foreground/10 flex items-center justify-center mx-auto">
                          <Icon icon="solar:user-bold-duotone" className="h-12 w-12 text-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lawyerName || participantName || 'Waiting for participant...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-background shadow-xl bg-muted">
                  {localStream ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                      <Icon icon="solar:user-bold-duotone" className="h-8 w-8 text-foreground" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-background">
          {isConnected ? (
            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full",
                  isMuted && "bg-destructive/10 border-destructive/20"
                )}
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <Icon 
                  icon={isMuted ? "solar:microphone-off-bold-duotone" : "solar:microphone-bold-duotone"} 
                  className="h-5 w-5" 
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full",
                  isVideoOff && "bg-destructive/10 border-destructive/20"
                )}
                onClick={toggleVideo}
                title={isVideoOff ? "Turn on video" : "Turn off video"}
              >
                <Icon 
                  icon={isVideoOff ? "solar:videocamera-slash-bold-duotone" : "solar:videocamera-bold-duotone"} 
                  className="h-5 w-5" 
                />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  endCall()
                  onOpenChange?.(false)
                }}
                title="End call"
              >
                <Icon icon="solar:phone-calling-bold-duotone" className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 w-full">
              <Button variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              {!isConnecting && (
                <Button onClick={startCall}>
                  <Icon icon="solar:phone-calling-bold-duotone" className="h-4 w-4 mr-2" />
                  Start Call
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



