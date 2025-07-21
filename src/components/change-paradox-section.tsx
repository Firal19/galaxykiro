"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { EnhancedSectionHook } from "@/components/enhanced-section-hook"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import { Brain, Zap, RefreshCw, Target, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChangeParadoxSectionProps {
  className?: string
}

export function ChangeParadoxSection({ className }: ChangeParadoxSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const { trackEngagement } = useEngagementTracking()

  const handleNameCitySubmit = async (data: Record<string, unknown>) => {
    try {
      const sessionId = typeof window !== 'undefined' 
        ? localStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        : `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      const response = await fetch('/api/capture-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 2,
          data: { fullName: data.name, city: data.city },
          sessionId,
          entryPoint: 'change-paradox-section'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to capture name and city information')
      }

      const result = await response.json()
      console.log('Name and city information captured:', result)
      
      // Open the analyzer after successful capture
      setIsAnalyzerOpen(true)
    } catch (error) {
      console.error('Error submitting name and city:', error)
      // Still allow access to analyzer even if backend fails
      setIsAnalyzerOpen(true)
    }
  }

  return (
    <section className={cn("py-20 bg-gradient-to-br from-[var(--color-transformation-50)] to-background dark:from-[var(--color-transformation-900)] dark:to-background", className)}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Enhanced Section Hook */}
            <EnhancedSectionHook
              sectionId="change-paradox"
              question="You know what to do. So why aren't you doing it?"
              questionLink="/change-paradox"
            />

            {/* Value Snippets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">Neuroplasticity facts (simplified)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">21-day myth debunked</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">The 4-step habit installation process</p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="cta"
                  size="lg"
                  onClick={() => {
                    trackEngagement({ type: 'cta_click', section: 'change-paradox' })
                    setIsModalOpen(true)
                  }}
                  className="text-lg px-8 py-4 h-auto flex-1"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze Your Habit Strength
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    trackEngagement({ type: 'learn_more_click', section: 'change-paradox' })
                    window.open('/change-paradox/learn-more', '_blank')
                  }}
                  className="text-lg px-8 py-4 h-auto"
                >
                  Learn More
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover which habits are helping or hurting you • Free analysis
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Habit Loop Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <HabitLoopVisualization />
          </motion.div>
        </div>
      </div>

      {/* Lead Capture Modal for Name and City */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameCitySubmit}
        title="Analyze Your Habit Strength"
        description="Get your personalized Habit Strength Analysis. We'll show you which habits are working for you and which ones are holding you back from your full potential."
        ctaText="Get My Habit Analysis"
        level={2}
        fields={['name', 'city']}
      />

      {/* Habit Strength Analyzer Modal */}
      <HabitStrengthAnalyzer
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
      />
    </section>
  )
}

// Habit Loop Visualization Component
function HabitLoopVisualization() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 'cue',
      label: 'Cue',
      description: 'Environmental trigger',
      icon: Zap,
      color: 'var(--color-energy-500)'
    },
    {
      id: 'routine',
      label: 'Routine',
      description: 'The behavior itself',
      icon: RefreshCw,
      color: 'var(--color-transformation-500)'
    },
    {
      id: 'reward',
      label: 'Reward',
      description: 'The benefit you get',
      icon: Target,
      color: 'var(--color-growth-500)'
    }
  ]

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glassmorphic Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360, opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 left-8 w-64 h-64 bg-gradient-to-br from-[var(--color-energy-400)]/30 to-[var(--color-transformation-400)]/30 rounded-full blur-3xl shadow-2xl"
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.10, 0.16, 0.10] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-8 right-8 w-72 h-72 bg-gradient-to-br from-[var(--color-growth-400)]/30 to-[var(--color-ethiopian-gold)]/30 rounded-full blur-3xl shadow-2xl"
        />
        {/* Ethiopian pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          <defs>
            <pattern id="ethiopianPattern3" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#FFD700" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ethiopianPattern3)" />
        </svg>
      </div>
      {/* Habit Loop Visualization */}
      <div className="relative w-72 h-72 mx-auto z-10">
        {/* Glassy Rotating Circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-[var(--color-transformation-300)] rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl"
        />
        {/* Steps with Animated Glow and Glassy Labels */}
        {steps.map((step, index) => {
          const radius = 90
          const x = Math.cos((index * 120 - 90) * Math.PI / 180) * radius
          const y = Math.sin((index * 120 - 90) * Math.PI / 180) * radius
          return (
            <motion.div
              key={step.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
              }}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(-1)}
            >
              <div className={`relative transition-all duration-300 ${activeStep === index ? 'scale-110' : ''}`}>
                {/* Animated Glow */}
                <motion.div
                  animate={{
                    opacity: activeStep === index ? 0.7 : 0.3,
                    scale: activeStep === index ? 1.15 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute -inset-3 rounded-full border-2 border-dashed shadow-lg"
                  style={{
                    borderColor: step.color,
                    boxShadow: activeStep === index ? `0 0 16px 4px ${step.color}` : undefined
                  }}
                />
                {/* Icon Container with Glow */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 border-2 border-white/40 ${activeStep === index ? 'ring-4 ring-[var(--color-energy-400)]/40' : ''}`}>
                  <step.icon
                    className="h-8 w-8 drop-shadow-glow"
                    style={{ color: step.color }}
                  />
                </div>
                {/* Glassy Label with Animated Gradient Text */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 text-center px-4 py-2 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg border border-white/30 min-w-[90px]">
                  <span className="font-bold text-base bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent animate-gradient-x">{step.label}</span>
                  <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
        {/* Animated Arrows */}
        {steps.map((_, index) => {
          const angle = (index * 120) - 90 + 60
          const radius = 70
          const x = Math.cos(angle * Math.PI / 180) * radius
          const y = Math.sin(angle * Math.PI / 180) * radius
          return (
            <motion.div
              key={`arrow-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.18 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle + 90}deg)`
              }}
            >
              <ArrowRight className="h-6 w-6 text-[var(--color-transformation-400)] animate-pulse" />
            </motion.div>
          )
        })}
        {/* Center Content with Glassmorphism */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-6 py-4 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border border-white/30 backdrop-blur-md">
            <div className="text-4xl font-extrabold text-[var(--color-transformation-600)] drop-shadow-lg animate-pulse">95%</div>
            <div className="text-base text-muted-foreground drop-shadow">Automatic</div>
          </div>
        </div>
      </div>
      {/* Glassy Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="mt-10 text-center px-4 py-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl inline-block border border-white/30 backdrop-blur-md"
      >
        <p className="text-base font-semibold bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent animate-gradient-x mb-2">Your brain runs this loop automatically. Understanding it is the key to lasting change.</p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-energy-100)]/60 rounded-full">
            <Zap className="h-4 w-4 text-[var(--color-energy-500)] animate-pulse" />
            <span>Cue</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-transformation-100)]/60 rounded-full">
            <RefreshCw className="h-4 w-4 text-[var(--color-transformation-500)] animate-pulse" />
            <span>Routine</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-growth-100)]/60 rounded-full">
            <Target className="h-4 w-4 text-[var(--color-growth-500)] animate-pulse" />
            <span>Reward</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Habit Strength Analyzer Component
function HabitStrengthAnalyzer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ habit: string; strength: number }[]>([])
  const [showResults, setShowResults] = useState(false)

  const habits = [
    { name: "Morning Routine", category: "productivity" },
    { name: "Exercise", category: "health" },
    { name: "Reading/Learning", category: "growth" },
    { name: "Healthy Eating", category: "health" },
    { name: "Sleep Schedule", category: "health" }
  ]

  const handleAnswer = (strength: number) => {
    const newAnswers = [...answers, { habit: habits[currentQuestion].name, strength }]
    setAnswers(newAnswers)

    if (currentQuestion < habits.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const getOverallStrength = () => {
    const total = answers.reduce((sum, answer) => sum + answer.strength, 0)
    return Math.round((total / (habits.length * 5)) * 100)
  }

  const getStrengthLevel = (score: number) => {
    if (score >= 80) return { level: "Habit Master", message: "Your habits are working for you!", color: "text-green-600" }
    if (score >= 60) return { level: "Building Momentum", message: "You're on the right track. A few tweaks will accelerate your progress.", color: "text-blue-600" }
    if (score >= 40) return { level: "Mixed Results", message: "Some habits are helping, others are holding you back.", color: "text-yellow-600" }
    return { level: "Habit Overhaul Needed", message: "Great opportunity! New habits will transform your life.", color: "text-orange-600" }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {!showResults ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Habit Strength Analyzer</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-[var(--color-transformation-500)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / habits.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">Habit {currentQuestion + 1} of {habits.length}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">
                How strong is your <span className="text-[var(--color-transformation-600)]">{habits[currentQuestion].name}</span> habit?
              </h4>
              <div className="space-y-2">
                {[
                  { text: "Very Strong - I do this automatically every day", value: 5 },
                  { text: "Strong - I do this most days without thinking", value: 4 },
                  { text: "Moderate - I do this sometimes, need reminders", value: 3 },
                  { text: "Weak - I struggle to do this consistently", value: 2 },
                  { text: "Very Weak - I rarely or never do this", value: 1 }
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Habit Strength</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-[var(--color-transformation-600)] mb-2">
                {getOverallStrength()}%
              </div>
              <div className={`text-lg font-medium mb-4 ${getStrengthLevel(getOverallStrength()).color}`}>
                {getStrengthLevel(getOverallStrength()).level}
              </div>
              <p className="text-gray-600 mb-6">
                {getStrengthLevel(getOverallStrength()).message}
              </p>
            </div>

            {/* Individual Habit Breakdown */}
            <div className="mb-6 text-left">
              <h4 className="font-medium mb-3">Your Habit Breakdown:</h4>
              <div className="space-y-2">
                {answers.map((answer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{answer.habit}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[var(--color-transformation-500)] h-2 rounded-full"
                          style={{ width: `${(answer.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{answer.strength}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="cta"
              onClick={onClose}
              className="w-full"
            >
              Continue Your Journey
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}