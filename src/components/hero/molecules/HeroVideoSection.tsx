/**
 * HeroVideoSection - Video testimonial section with glassmorphism
 */

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { VideoPlayer } from "@/components/ui/video-player"
import { Play } from "lucide-react"

interface HeroVideoSectionProps {
  className?: string
}

export function HeroVideoSection({ className }: HeroVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const testimonialVideo = {
    src: "/videos/testimonial-preview.mp4",
    poster: "/images/testimonial-poster.jpg",
    title: "Sarah's Transformation Story"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={`relative ${className}`}
    >
      {/* Glassmorphism Container */}
      <div className="relative backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden">
        {/* Video Player */}
        <div className="relative aspect-video">
          {!isPlaying ? (
            <div 
              className="relative w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center cursor-pointer group"
              onClick={() => setIsPlaying(true)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 transform rotate-12 scale-110"></div>
              </div>
              
              {/* Play Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-20 h-20 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
              </motion.div>
              
              {/* Overlay Text */}
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Watch Sarah's Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  "I discovered abilities I never knew I had"
                </p>
              </div>
            </div>
          ) : (
            <VideoPlayer
              src={testimonialVideo.src}
              poster={testimonialVideo.poster}
              title={testimonialVideo.title}
              autoPlay
              className="w-full h-full"
            />
          )}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-80 blur-sm"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 blur-sm"
      />
    </motion.div>
  )
}