"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  src: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  className?: string
  testimonialText?: string
  authorName?: string
  authorTitle?: string
}

export function VideoPlayer({
  src,
  poster,
  autoplay = true,
  muted = true,
  className,
  testimonialText,
  authorName,
  authorTitle
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      console.warn(`Video failed to load: ${src}`)
      setVideoError(true)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
    }
  }, [src])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || videoError) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video || videoError) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  // If video failed to load, show a placeholder
  if (videoError) {
    return (
      <motion.div
        className={cn("relative group", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-lg shadow-2xl bg-gradient-to-br from-muted to-muted/50">
          <div className="aspect-video flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Testimonial Video</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Watch how our tools have transformed lives and unlocked hidden potential.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial Text */}
        {testimonialText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 p-4 bg-card border border-border rounded-lg"
          >
            <blockquote className="text-muted-foreground italic">"{testimonialText}"</blockquote>
            {authorName && (
              <div className="mt-2 text-sm">
                <span className="font-semibold text-foreground">{authorName}</span>
                {authorTitle && <span className="text-muted-foreground">, {authorTitle}</span>}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn("relative group", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Container */}
      <div className="relative overflow-hidden rounded-lg shadow-2xl">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop
          playsInline
          className="w-full h-auto"
        />
        
        {/* Video Controls Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6 text-white" />
              ) : (
                <Volume2 className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Testimonial Text */}
      {testimonialText && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/60 text-white text-sm rounded-b-lg drop-shadow-lg">
          <div className="mb-1 font-semibold">{authorName}</div>
          <div className="mb-1 italic">"{testimonialText}"</div>
          {authorTitle && <div className="text-xs text-gray-300">{authorTitle}</div>}
        </div>
      )}
    </motion.div>
  )
}