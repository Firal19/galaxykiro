"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { EnhancedSectionHook } from "@/components/enhanced-section-hook"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import { TrendingUp, Clock, Target, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessGapSectionProps {
  className?: string
}

export function SuccessGapSection({ className }: SuccessGapSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const { trackEngagement } = useEngagementTracking()

  const handlePhoneSubmit = async (data: { phone: string }) => {
    try {
      const sessionId = typeof window !== 'undefined' 
        ? localStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
        : `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      const response = await fetch('/.netlify/functions/capture-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 2,
          data: { phone: data.phone },
          sessionId,
          entryPoint: 'success-gap-section'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to capture phone information')
      }

      const result = await response.json()
      console.log('Phone information captured:', result)
      
      // Open the calculator after successful capture
      setIsCalculatorOpen(true)
    } catch (error) {
      console.error('Error submitting phone:', error)
      // Still allow access to calculator even if backend fails
      setIsCalculatorOpen(true)
    }
  }

  return (
    <section className={cn("py-20 bg-gradient-to-br from-background to-[var(--color-growth-50)] dark:to-[var(--color-growth-900)]", className)}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Split Screen Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 h-96">
              {/* Left Side - Dreamers */}
              <motion.div
                initial={{ opacity: 0.3 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-muted/50 rounded-lg p-6 flex flex-col justify-center items-center text-center border-2 border-dashed border-muted-foreground/20"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-muted-foreground mb-2">The Dreamers</h3>
                <p className="text-sm text-muted-foreground">
                  Always planning, rarely executing. Repeating the same patterns year after year.
                </p>
              </motion.div>

              {/* Right Side - Achievers */}
              <motion.div
                initial={{ opacity: 0.3, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-gradient-to-br from-[var(--color-growth-500)] to-[var(--color-energy-500)] rounded-lg p-6 flex flex-col justify-center items-center text-center text-white shadow-lg"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">The Achievers</h3>
                <p className="text-sm opacity-90">
                  Turn dreams into reality. Know the success factors that make the difference.
                </p>
              </motion.div>
            </div>

            {/* Arrow Animation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border">
                <ArrowRight className="h-6 w-6 text-[var(--color-growth-600)]" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Enhanced Section Hook */}
            <EnhancedSectionHook
              sectionId="success-gap"
              question="Why do some people achieve their dreams while others just dream?"
              questionLink="/success-gap"
            />

            {/* Content Teasers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">The 3 morning habits of highly successful people</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">Why your environment determines 50% of your success</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--color-growth-500)] rounded-full mt-2 flex-shrink-0" />
                <p className="text-muted-foreground">Research citation from Harvard Business Review</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-growth-600)]">73%</div>
                <div className="text-sm text-muted-foreground">Never achieve their goals</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-energy-600)]">27%</div>
                <div className="text-sm text-muted-foreground">Know the success factors</div>
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
                    trackEngagement({ type: 'cta_click', section: 'success-gap' })
                    setIsModalOpen(true)
                  }}
                  className="text-lg px-8 py-4 h-auto flex-1"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Calculate Your Success Probability
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    trackEngagement({ type: 'learn_more_click', section: 'success-gap' })
                    window.open('/success-gap/learn-more', '_blank')
                  }}
                  className="text-lg px-8 py-4 h-auto"
                >
                  Learn More
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover which side of the gap you&apos;re on • Takes 2 minutes
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Lead Capture Modal for Phone */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePhoneSubmit}
        title="Calculate Your Success Probability"
        description="Get your personalized Success Factor Analysis. We'll analyze your current habits and show you exactly what's keeping you from your dreams."
        ctaText="Get My Success Analysis"
        level={2}
        fields={['phone']}
        placeholder="Enter your phone number"
        inputType="tel"
      />

      {/* Success Factor Calculator Modal */}
      <SuccessFactorCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </section>
  )
}

// Success Factor Calculator Component
function SuccessFactorCalculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      text: "How often do you complete your daily priorities?",
      options: [
        { text: "Always (90-100%)", value: 5 },
        { text: "Usually (70-89%)", value: 4 },
        { text: "Sometimes (50-69%)", value: 3 },
        { text: "Rarely (30-49%)", value: 2 },
        { text: "Never (0-29%)", value: 1 }
      ]
    },
    {
      text: "How consistent is your morning routine?",
      options: [
        { text: "Same routine every day", value: 5 },
        { text: "Mostly consistent", value: 4 },
        { text: "Sometimes consistent", value: 3 },
        { text: "Rarely consistent", value: 2 },
        { text: "No routine", value: 1 }
      ]
    },
    {
      text: "How often do you review and adjust your goals?",
      options: [
        { text: "Weekly", value: 5 },
        { text: "Monthly", value: 4 },
        { text: "Quarterly", value: 3 },
        { text: "Yearly", value: 2 },
        { text: "Never", value: 1 }
      ]
    },
    {
      text: "How do you handle setbacks?",
      options: [
        { text: "Learn and adapt quickly", value: 5 },
        { text: "Bounce back within days", value: 4 },
        { text: "Take weeks to recover", value: 3 },
        { text: "Take months to recover", value: 2 },
        { text: "Give up easily", value: 1 }
      ]
    },
    {
      text: "How often do you invest in personal development?",
      options: [
        { text: "Daily", value: 5 },
        { text: "Weekly", value: 4 },
        { text: "Monthly", value: 3 },
        { text: "Rarely", value: 2 },
        { text: "Never", value: 1 }
      ]
    }
  ]

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    const total = answers.reduce((sum, answer) => sum + answer, 0)
    const percentage = Math.round((total / 25) * 100)
    return percentage
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { level: "High Achiever", message: "You have strong success habits! Focus on consistency to reach the top 10%.", color: "text-green-600" }
    if (score >= 60) return { level: "Rising Star", message: "You're on the right track. A few key adjustments could dramatically improve your results.", color: "text-blue-600" }
    if (score >= 40) return { level: "Potential Builder", message: "You have untapped potential. Building better systems will unlock your success.", color: "text-yellow-600" }
    return { level: "Foundation Needed", message: "Great news! You have the most room for improvement. Small changes will create big results.", color: "text-orange-600" }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        {!showResults ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Success Factor Calculator</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-[var(--color-growth-500)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">Question {currentQuestion + 1} of {questions.length}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">{questions[currentQuestion].text}</h4>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, index) => (
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
                <h3 className="text-lg font-semibold">Your Success Probability</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-[var(--color-growth-600)] mb-2">
                {calculateScore()}%
              </div>
              <div className={`text-lg font-medium mb-4 ${getScoreMessage(calculateScore()).color}`}>
                {getScoreMessage(calculateScore()).level}
              </div>
              <p className="text-gray-600 mb-6">
                {getScoreMessage(calculateScore()).message}
              </p>
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