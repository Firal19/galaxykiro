"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"

interface RotatingQuestion {
  id: string
  category: 'identity' | 'progress' | 'future'
  text: string
  relatedTool: string
  toolUrl: string
}

const rotatingQuestions: RotatingQuestion[] = [
  // Identity Questions
  {
    id: "identity-1",
    category: "identity",
    text: "What if you are only using 10% of your true potential?",
    relatedTool: "Potential Quotient Calculator",
    toolUrl: "/tools/potential-quotient"
  },
  {
    id: "identity-2", 
    category: "identity",
    text: "Are you leading your life, or is life leading you?",
    relatedTool: "Leadership Style Profiler",
    toolUrl: "/tools/leadership-style"
  },
  {
    id: "identity-3",
    category: "identity", 
    text: "What is your biggest limiting belief right now?",
    relatedTool: "Limiting Belief Identifier",
    toolUrl: "/tools/limiting-beliefs"
  },
  
  // Progress Questions
  {
    id: "progress-1",
    category: "progress",
    text: "Why do some people achieve their dreams while others just dream?",
    relatedTool: "Success Factor Calculator", 
    toolUrl: "/tools/success-factors"
  },
  {
    id: "progress-2",
    category: "progress",
    text: "You know what to do. So why are not you doing it?",
    relatedTool: "Habit Strength Analyzer",
    toolUrl: "/tools/habit-strength"
  },
  {
    id: "progress-3",
    category: "progress",
    text: "What is stopping you from taking the next step?",
    relatedTool: "Transformation Readiness Score",
    toolUrl: "/tools/transformation-readiness"
  },
  
  // Future Questions
  {
    id: "future-1",
    category: "future",
    text: "Can you describe your life 5 years from now in detail?",
    relatedTool: "Future Self Visualizer",
    toolUrl: "/tools/future-self"
  },
  {
    id: "future-2",
    category: "future",
    text: "What would you do if you knew you could not fail?",
    relatedTool: "Dream Clarity Generator",
    toolUrl: "/tools/dream-clarity"
  },
  {
    id: "future-3",
    category: "future",
    text: "How much is your inaction costing you?",
    relatedTool: "Cost of Inaction Calculator",
    toolUrl: "/tools/cost-of-inaction"
  }
]

interface FloatingCuriosityBarProps {
  appearAfter?: number // seconds
  position?: 'bottom' | 'side'
  className?: string
}

export function FloatingCuriosityBar({ 
  appearAfter = 30, 
  position = 'bottom',
  className 
}: FloatingCuriosityBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const { trackEngagement } = useEngagementTracking()

  // Show bar after specified time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true)
        trackEngagement({
          type: 'progressive_disclosure_view',
          section: 'floating-curiosity-bar',
          metadata: {
            questionId: rotatingQuestions[currentQuestionIndex].id,
            appearDelay: appearAfter
          }
        })
      }
    }, appearAfter * 1000)

    return () => clearTimeout(timer)
  }, [appearAfter, isDismissed, currentQuestionIndex, trackEngagement])

  // Rotate questions every 8 seconds
  useEffect(() => {
    if (!isVisible) return

    const rotationTimer = setInterval(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % rotatingQuestions.length)
    }, 8000)

    return () => clearInterval(rotationTimer)
  }, [isVisible])

  // Check if user has dismissed this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('curiosity-bar-dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem('curiosity-bar-dismissed', 'true')
    
    trackEngagement({
      type: 'cta_click',
      section: 'floating-curiosity-bar',
      metadata: {
        action: 'dismiss',
        questionId: rotatingQuestions[currentQuestionIndex].id
      }
    })
  }

  const handleQuestionClick = () => {
    const currentQuestion = rotatingQuestions[currentQuestionIndex]
    
    trackEngagement({
      type: 'question_click',
      section: 'floating-curiosity-bar',
      metadata: {
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        relatedTool: currentQuestion.relatedTool
      }
    })

    // Navigate to tool or trigger tool modal
    window.location.href = currentQuestion.toolUrl
  }

  const handleToolAccess = () => {
    const currentQuestion = rotatingQuestions[currentQuestionIndex]
    
    trackEngagement({
      type: 'cta_click',
      section: 'floating-curiosity-bar',
      metadata: {
        action: 'tool-access',
        questionId: currentQuestion.id,
        relatedTool: currentQuestion.relatedTool
      }
    })

    // One-click tool access
    window.location.href = currentQuestion.toolUrl
  }

  if (isDismissed || !isVisible) return null

  const currentQuestion = rotatingQuestions[currentQuestionIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ 
          opacity: 0, 
          y: position === 'bottom' ? 100 : 0,
          x: position === 'side' ? 100 : 0
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: 0
        }}
        exit={{ 
          opacity: 0, 
          y: position === 'bottom' ? 100 : 0,
          x: position === 'side' ? 100 : 0
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed z-50 bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] text-white shadow-lg",
          position === 'bottom' && "bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md rounded-lg",
          position === 'side' && "right-4 top-1/2 -translate-y-1/2 max-w-xs rounded-lg",
          className
        )}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-white/90" />
              <span className="text-sm font-medium text-white/90">
                Quick Question
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <button
                onClick={handleQuestionClick}
                className="text-left text-white font-medium hover:text-white/90 transition-colors"
              >
                {currentQuestion.text}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">
              Try: {currentQuestion.relatedTool}
            </span>
            <button
              onClick={handleToolAccess}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <span>Get Answer</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex space-x-1 mt-3">
            {rotatingQuestions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === currentQuestionIndex 
                    ? "bg-white flex-1" 
                    : "bg-white/30 w-1"
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}