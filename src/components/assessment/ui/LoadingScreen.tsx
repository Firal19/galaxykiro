/**
 * LoadingScreen - Loading screen for assessment processes
 */

"use client"

import { motion } from 'framer-motion'
import { Loader2, Brain, Sparkles, Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface LoadingScreenProps {
  message?: string
  progress?: number
  showSpinner?: boolean
  type?: 'loading' | 'processing' | 'analyzing'
  className?: string
}

export function LoadingScreen({
  message = 'Loading...',
  progress = 0,
  showSpinner = false,
  type = 'loading',
  className
}: LoadingScreenProps) {

  // Get appropriate icon and animation based on type
  const getIconAndAnimation = () => {
    switch (type) {
      case 'processing':
        return {
          icon: Brain,
          animation: {
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          },
          color: 'text-blue-500'
        }
      case 'analyzing':
        return {
          icon: Target,
          animation: {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          },
          color: 'text-green-500'
        }
      default:
        return {
          icon: showSpinner ? Loader2 : Sparkles,
          animation: showSpinner 
            ? { rotate: 360, transition: { duration: 1, repeat: Infinity, ease: "linear" } }
            : { 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              },
          color: 'text-primary'
        }
    }
  }

  const { icon: Icon, animation, color } = getIconAndAnimation()

  // Loading messages based on type
  const getLoadingMessages = () => {
    switch (type) {
      case 'processing':
        return [
          'Processing your responses...',
          'Analyzing patterns...',
          'Calculating scores...',
          'Generating insights...'
        ]
      case 'analyzing':
        return [
          'Analyzing your answers...',
          'Identifying strengths...',
          'Finding growth areas...',
          'Creating recommendations...'
        ]
      default:
        return [
          'Loading assessment...',
          'Preparing questions...',
          'Setting up experience...'
        ]
    }
  }

  const messages = getLoadingMessages()
  const displayMessage = message || messages[Math.floor((progress / 100) * messages.length)] || messages[0]

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
      className
    )}>
      {/* Animated Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.div
          animate={animation}
          className={cn("w-16 h-16", color)}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold text-foreground">
          {displayMessage}
        </h3>
        
        {type === 'processing' && (
          <p className="text-sm text-muted-foreground">
            Our AI is carefully analyzing your responses to provide personalized insights.
          </p>
        )}
        
        {type === 'analyzing' && (
          <p className="text-sm text-muted-foreground">
            We're creating a detailed breakdown of your results and recommendations.
          </p>
        )}
      </motion.div>

      {/* Progress Bar */}
      {progress > 0 && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md mt-8"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>
      )}

      {/* Floating Dots Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, -20, null],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Pulsing Background Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Loading Tips */}
      {type === 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 max-w-md"
        >
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Answer honestly for the most accurate results
            </p>
          </div>
        </motion.div>
      )}

      {/* Processing Stats */}
      {type === 'processing' && progress > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-primary">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-secondary">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                AI
              </motion.span>
            </div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-accent">
              {Math.round(progress / 10)}
            </div>
            <div className="text-xs text-muted-foreground">Insights</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}