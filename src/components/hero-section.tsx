"use client"

import { useState } from "react"
import { motion } from "framer-motion"
// import { useTranslations } from 'next-intl'
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { VideoPlayer } from "@/components/ui/video-player"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { PotentialAssessment } from "@/components/potential-assessment"
import { Sparkles, TrendingUp, Users, Award, Zap, Target, ArrowRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  
  // const t = useTranslations('hero')

  // Animate background sparkles (optional, for delight)
  useEffect(() => {
    // Optionally, you could add a canvas or SVG sparkle effect here
  }, [])

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
      const response = await fetch('/api/capture-user-info', {
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
    <section
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-energy-100)] via-[var(--color-growth-50)] to-[var(--color-transformation-100)] dark:from-[var(--color-energy-900)] dark:via-[var(--color-growth-900)] dark:to-[var(--color-transformation-900)]",
        className
      )}
      aria-label="Hero Section"
    >
      {/* Animated Glassmorphic Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-br from-[var(--color-energy-400)]/30 to-[var(--color-transformation-400)]/30 rounded-full blur-3xl shadow-2xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.08, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-[var(--color-growth-400)]/30 to-[var(--color-ethiopian-gold)]/30 rounded-full blur-3xl shadow-2xl"
        />
        {/* Optional: Ethiopian pattern SVG overlay for subtle branding */}
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          <defs>
            <pattern id="ethiopianPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#FFD700" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ethiopianPattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            {/* Animated Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent"
            >
              Unlock Your <span>Hidden Potential</span>
            </motion.h1>

            {/* Unified Description and Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white/90 dark:bg-black/80 rounded-2xl shadow-2xl backdrop-blur-lg border border-gray-200 dark:border-gray-700 px-8 py-8 max-w-2xl"
            >
              <p className="text-lg md:text-xl leading-relaxed text-gray-900 dark:text-white mb-8">
                Join <span className="font-bold text-[var(--color-energy-700)] dark:text-[var(--color-energy-200)]">50,000+</span> people who have discovered their hidden 90% through our <span className="font-semibold text-[var(--color-energy-800)] dark:text-[var(--color-energy-300)]">transformational training programs</span>. Our powerful assessments and personalized coaching have helped people find their true purpose, unlock abilities they never knew they had, and create lasting positive change in their lives.
              </p>
              <div className="flex flex-row divide-x divide-gray-200 dark:divide-gray-700">
                <div className="flex-1 flex flex-col items-center px-4">
                  <Users className="h-7 w-7 text-[var(--color-growth-400)] mb-1" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter from={0} to={50000} suffix="+" />
                  </div>
                  <div className="text-base text-gray-700 dark:text-gray-200 mt-1">Lives Transformed</div>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <TrendingUp className="h-7 w-7 text-[var(--color-transformation-400)] mb-1" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter from={0} to={90} suffix="%" />
                  </div>
                  <div className="text-base text-gray-700 dark:text-gray-200 mt-1">Success Rate</div>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <Award className="h-7 w-7 text-[var(--color-energy-400)] mb-1" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter from={0} to={15} suffix="+" />
                  </div>
                  <div className="text-base text-gray-700 dark:text-gray-200 mt-1">Years Experience</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <Button
                variant="cta"
                size="xl"
                onClick={() => setIsModalOpen(true)}
                className="text-lg px-10 py-5 h-auto bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] hover:from-[var(--color-energy-600)] hover:to-[var(--color-transformation-600)] shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full font-bold focus:ring-4 focus:ring-[var(--color-energy-400)]/40"
                aria-label="Start Your Transformation"
              >
                <Sparkles className="mr-2 h-6 w-6" />
                Start Your Transformation
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => window.location.href = '/office-visit'}
                className="text-lg px-10 py-5 h-auto border-2 border-gray-300 dark:border-gray-600 hover:bg-[var(--color-growth-500)] hover:text-white transition-all duration-300 rounded-full font-bold focus:ring-4 focus:ring-[var(--color-growth-400)]/40"
                aria-label="Book Office Visit"
              >
                <Target className="mr-2 h-6 w-6" />
                Book Office Visit
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Video Testimonial with Clean Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl bg-black/90 dark:bg-black/90 backdrop-blur-2xl border border-gray-700 overflow-hidden">
              <VideoPlayer
                src=""
                poster="/testimonial-poster.jpg"
                autoplay={false}
                muted={true}
                testimonialText="This powerful training completely transformed my life. I discovered strengths I never knew I had and finally understand what was holding me back. Within 3 months, I found my true purpose and created lasting positive change."
                authorName="Sarah Chen"
                authorTitle="Marketing Director, Addis Ababa"
                className="w-full max-w-md mx-auto z-10 rounded-3xl text-white"
              />
              {/* Animated Play Button Overlay */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl border-4 border-[var(--color-energy-400)]">
                  <Play className="h-10 w-10 text-[var(--color-energy-600)] ml-1" />
                </div>
              </motion.div>
              {/* Glassy Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-6 right-4 bg-gradient-to-r from-[var(--color-growth-400)] to-[var(--color-energy-400)] rounded-xl px-6 py-3 shadow-xl border-2 border-white/30 text-white font-bold text-lg backdrop-blur-md"
              >
                <span className="block">Success Story</span>
                <span className="block text-base font-semibold">Life Transformed</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSubmit}
        onStartAssessment={handleStartAssessment}
        title="Start Your Powerful Transformation"
        description="Get instant access to your personalized Potential Assessment. Discover the hidden strengths, untapped abilities, and transformational opportunities that could transform your life through our powerful training programs."
        ctaText="Begin My Transformation"
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