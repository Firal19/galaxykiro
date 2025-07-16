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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 p-4 bg-card border border-border rounded-lg"
        >
          <blockquote className="text-muted-foreground italic">
            &ldquo;{testimonialText}&rdquo;
          </blockquote>
          {(authorName || authorTitle) && (
            <div className="mt-2 text-sm">
              {authorName && (
                <span className="font-semibold text-foreground">{authorName}</span>
              )}
              {authorTitle && (
                <span className="text-muted-foreground">
                  {authorName ? ', ' : ''}{authorTitle}
                </span>
              )}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}