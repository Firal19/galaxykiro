"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layouts/public-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  CheckCircle, 
  Mail, 
  Sparkles,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react'

export default function ApprovalPendingPage() {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState<number>(10800) // 3 hours in seconds
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'extended'>('pending')
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  useEffect(() => {
    // Check if user has session
    const session = typeof window !== 'undefined' ? localStorage.getItem('galaxy_kiro_session') : null
    if (!session) {
      router.push('/login')
      return
    }

    // Simulate approval check every 30 seconds
    const checkInterval = setInterval(() => {
      // Random approval for demo (10% chance)
      if (Math.random() < 0.1) {
        setApprovalStatus('approved')
        
        // Update session
        if (typeof window !== 'undefined') {
          const sessionData = JSON.parse(session)
          sessionData.status = 'soft_member'
          localStorage.setItem('galaxy_kiro_session', JSON.stringify(sessionData))
        }
      }
    }, 30000)

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setApprovalStatus('extended')
          return 86400 // 24 hours
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(checkInterval)
      clearInterval(countdown)
    }
  }, [router])

  const handleCheckStatus = () => {
    // Force check approval status
    window.location.reload()
  }

  const getProgressValue = () => {
    if (approvalStatus === 'extended') {
      return ((86400 - timeRemaining) / 86400) * 100
    }
    return ((10800 - timeRemaining) / 10800) * 100
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          {approvalStatus === 'approved' ? (
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h1 className="text-3xl font-bold mb-4">You're Approved!</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Congratulations! Your account has been approved. You can now access your member dashboard.
              </p>
              
              <Button 
                size="lg" 
                onClick={() => router.push('/soft-member/dashboard')}
                className="min-w-[200px]"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>
          ) : (
            <Card className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Clock className="w-10 h-10 text-primary" />
                </motion.div>
                
                <h1 className="text-3xl font-bold mb-4">
                  {approvalStatus === 'pending' ? 'Approval Pending' : 'Extended Review'}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-2">
                  {approvalStatus === 'pending' 
                    ? "Great news! Your application is being fast-tracked for approval."
                    : "Your application requires additional review by our team."
                  }
                </p>
                
                <p className="text-muted-foreground">
                  Estimated time remaining: <span className="font-semibold text-foreground">{formatTime(timeRemaining)}</span>
                </p>
              </div>

              <Progress value={getProgressValue()} className="mb-8 h-3" />

              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                    What happens next?
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      <span>Your profile is being reviewed by our team</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      <span>You'll receive an email notification once approved</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600" />
                      <span>Full access to all soft member features will be unlocked</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Check your email
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent you a welcome email with important information about your membership. 
                    Please check your inbox and spam folder.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                    While you wait...
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore our public tools and content to get a head start on your transformation journey.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="sm" onClick={() => router.push('/tools')}>
                      Explore Free Tools
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/blog')}>
                      Read Our Blog
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  variant="ghost"
                  onClick={handleCheckStatus}
                  className="text-muted-foreground"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
              </div>
            </Card>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at{' '}
              <a href="mailto:support@galaxykiro.com" className="text-primary hover:underline">
                support@galaxykiro.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  )
}