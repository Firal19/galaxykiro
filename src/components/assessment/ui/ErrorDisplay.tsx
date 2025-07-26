/**
 * ErrorDisplay - Error display component for assessment failures
 */

"use client"

import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle,
  WifiOff,
  ServerCrash,
  Clock,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ErrorDisplayProps {
  message?: string
  error?: Error | string
  onRetry?: () => void
  onGoHome?: () => void
  onContactSupport?: () => void
  type?: 'network' | 'server' | 'timeout' | 'permission' | 'validation' | 'generic'
  className?: string
}

export function ErrorDisplay({
  message,
  error,
  onRetry,
  onGoHome,
  onContactSupport,
  type = 'generic',
  className
}: ErrorDisplayProps) {

  // Get error details based on type
  const getErrorDetails = () => {
    switch (type) {
      case 'network':
        return {
          icon: WifiOff,
          title: 'Connection Problem',
          description: 'Unable to connect to our servers. Please check your internet connection.',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        }
      case 'server':
        return {
          icon: ServerCrash,
          title: 'Server Error',
          description: 'Our servers are experiencing issues. Our team has been notified.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
      case 'timeout':
        return {
          icon: Clock,
          title: 'Request Timeout',
          description: 'The request took too long to complete. Please try again.',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        }
      case 'permission':
        return {
          icon: Shield,
          title: 'Permission Denied',
          description: 'You don\'t have permission to access this resource.',
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        }
      case 'validation':
        return {
          icon: AlertTriangle,
          title: 'Validation Error',
          description: 'Please check your input and try again.',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        }
      default:
        return {
          icon: AlertTriangle,
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred. Please try again.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
    }
  }

  const { icon: Icon, title, description, color, bgColor, borderColor } = getErrorDetails()
  const displayMessage = message || description

  // Extract error details if error object is provided
  const errorDetails = error ? (
    typeof error === 'string' ? error : error.message
  ) : null

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
      className
    )}>
      {/* Error Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center",
          bgColor,
          borderColor,
          "border-2"
        )}>
          <Icon className={cn("w-10 h-10", color)} />
        </div>
      </motion.div>

      {/* Error Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h2 className="text-2xl font-bold text-foreground">
          {title}
        </h2>
        
        <p className="text-muted-foreground">
          {displayMessage}
        </p>

        {/* Technical Error Details (Development) */}
        {errorDetails && process.env.NODE_ENV === 'development' && (
          <Card className="p-4 bg-muted/50 text-left">
            <div className="text-xs font-mono text-muted-foreground break-all">
              <div className="font-bold mb-2">Technical Details:</div>
              <div>{errorDetails}</div>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4 mt-8"
      >
        {onRetry && (
          <Button
            onClick={onRetry}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}

        {onGoHome && (
          <Button
            onClick={onGoHome}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Button>
        )}

        {onContactSupport && (
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Support</span>
          </Button>
        )}
      </motion.div>

      {/* Error Code/ID for Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-xs text-muted-foreground"
      >
        <p>Error occurred at {new Date().toLocaleString()}</p>
        {type !== 'generic' && (
          <p>Error Type: {type.toUpperCase()}</p>
        )}
      </motion.div>

      {/* Help Text Based on Error Type */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 max-w-md"
      >
        {type === 'network' && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-sm text-blue-700">
              <div className="font-semibold mb-2">Troubleshooting Tips:</div>
              <ul className="text-left space-y-1 text-xs">
                <li>• Check your internet connection</li>
                <li>• Try refreshing the page</li>
                <li>• Disable VPN if you're using one</li>
                <li>• Clear browser cache and cookies</li>
              </ul>
            </div>
          </Card>
        )}

        {type === 'server' && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="text-sm text-red-700">
              <div className="font-semibold mb-2">What's happening:</div>
              <p className="text-xs">
                Our team has been automatically notified and is working to resolve this issue. 
                Please try again in a few minutes.
              </p>
            </div>
          </Card>
        )}

        {type === 'timeout' && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="text-sm text-yellow-700">
              <div className="font-semibold mb-2">Why this happened:</div>
              <p className="text-xs">
                The request took longer than expected. This might be due to a slow connection 
                or high server load. Please try again.
              </p>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <motion.div
          className={cn("absolute w-32 h-32 rounded-full", bgColor)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            top: '20%',
            left: '10%'
          }}
        />
        <motion.div
          className={cn("absolute w-24 h-24 rounded-full", bgColor)}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.05, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            bottom: '30%',
            right: '15%'
          }}
        />
      </div>
    </div>
  )
}