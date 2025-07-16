"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { VideoPlayer } from "@/components/ui/video-player"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { PotentialAssessment } from "@/components/potential-assessment"
import { Sparkles, TrendingUp, Users, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleEmailSubmit = async (email: string) => {
    try {
      // Get session ID for tracking
      const sessionId = typeof window !== 'undefined' 
        ? localStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        : `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('session_id', sessionId)
      }

      // Call the capture-user-info function
      const response = await fetch('/.netlify/functions/capture-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 1,
          data: { email },
          sessionId,
          entryPoint: 'hero-section'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to capture user information')
      }

      const result = await response.json()
      console.log('User information captured:', result)
      
      // Store email for assessment
      setUserEmail(email)
      
      // Store user ID for future interactions
      if (result.data?.user?.id && typeof window !== 'undefined') {
        localStorage.setItem('user_id', result.data.user.id)
      }
    } catch (error) {
      console.error('Error submitting email:', error)
      // Still allow the user to proceed to assessment even if backend fails
      setUserEmail(email)
    }
  }

  const handleStartAssessment = (email: string) => {
    setUserEmail(email)
    setIsAssessmentOpen(true)
  }

  return (
    <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[var(--color-growth-50)] dark:to-[var(--color-growth-900)]" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-[var(--color-energy-500)]/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--color-transformation-500)]/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Question */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-energy-500)]/10 rounded-full text-[var(--color-energy-700)] dark:text-[var(--color-energy-300)] text-sm font-medium"
              >
                <Sparkles className="h-4 w-4" />
                Unlock Your Hidden Potential
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
              >
                What if you&apos;re only using{" "}
                <span className="relative">
                  <AnimatedCounter
                    from={0}
                    to={10}
                    suffix="%"
                    className="text-[var(--color-energy-600)] dark:text-[var(--color-energy-400)]"
                  />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] origin-left"
                  />
                </span>{" "}
                of your true potential?
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-muted-foreground max-w-2xl"
              >
                Most people live their entire lives without discovering what they&apos;re truly capable of. 
                Our breakthrough assessment reveals the hidden 90% that&apos;s waiting to transform your life.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-growth-500)]/10 rounded-lg mb-2 mx-auto">
                  <Users className="h-6 w-6 text-[var(--color-growth-600)]" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter from={0} to={50000} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Lives Transformed</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-transformation-500)]/10 rounded-lg mb-2 mx-auto">
                  <TrendingUp className="h-6 w-6 text-[var(--color-transformation-600)]" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter from={0} to={90} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-energy-500)]/10 rounded-lg mb-2 mx-auto">
                  <Award className="h-6 w-6 text-[var(--color-energy-600)]" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  <AnimatedCounter from={0} to={15} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                variant="cta"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="text-lg px-8 py-4 h-auto"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Discover Your Hidden 90%
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Free 5-minute assessment • Instant personalized results
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Video Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <VideoPlayer
              src="/testimonial-video.mp4" // Placeholder - would be replaced with actual video
              poster="/testimonial-poster.jpg" // Placeholder - would be replaced with actual poster
              autoplay={true}
              muted={true}
              testimonialText="This assessment completely changed how I see myself. I discovered strengths I never knew I had and finally understand why I was stuck. Within 3 months, I doubled my income and found my true purpose."
              authorName="Sarah Chen"
              authorTitle="Marketing Director, Addis Ababa"
              className="w-full max-w-md mx-auto"
            />
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[var(--color-ethiopian-gold)] to-[var(--color-energy-500)] rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[var(--color-ethiopian-green)] to-[var(--color-growth-500)] rounded-full opacity-20 blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSubmit}
        onStartAssessment={handleStartAssessment}
        title="Discover Your Hidden 90%"
        description="Get instant access to your personalized Potential Assessment. Discover the hidden strengths, untapped abilities, and breakthrough opportunities that could transform your life."
        ctaText="Get My Free Assessment"
      />

      {/* Potential Assessment Modal */}
      <PotentialAssessment
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        userEmail={userEmail}
      />
    </section>
  )
}