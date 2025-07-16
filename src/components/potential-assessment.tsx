"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { ChevronRight, ChevronLeft, BarChart3, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { GalaxyDreamTeamLogo } from "./galaxy-dream-team-logo"

// Assessment questions schema
const assessmentSchema = z.object({
  q1: z.string().min(1, "Please select an answer"),
  q2: z.string().min(1, "Please select an answer"),
  q3: z.string().min(1, "Please select an answer"),
  q4: z.string().min(1, "Please select an answer"),
  q5: z.string().min(1, "Please select an answer"),
})

type AssessmentFormData = z.infer<typeof assessmentSchema>

interface Question {
  id: keyof AssessmentFormData
  text: string
  options: { value: string; label: string; score: number }[]
}

const questions: Question[] = [
  {
    id: "q1",
    text: "When facing a new challenge, what's your typical first reaction?",
    options: [
      { value: "excited", label: "I get excited and dive right in", score: 4 },
      { value: "plan", label: "I carefully plan my approach first", score: 3 },
      { value: "hesitate", label: "I hesitate and seek advice from others", score: 2 },
      { value: "avoid", label: "I tend to avoid it if possible", score: 1 },
    ]
  },
  {
    id: "q2", 
    text: "How often do you find yourself thinking 'I could do better than this'?",
    options: [
      { value: "always", label: "Almost every day", score: 4 },
      { value: "often", label: "Several times a week", score: 3 },
      { value: "sometimes", label: "Once in a while", score: 2 },
      { value: "rarely", label: "Very rarely", score: 1 },
    ]
  },
  {
    id: "q3",
    text: "What percentage of your current potential do you feel you're using?",
    options: [
      { value: "high", label: "80-100% - I'm maximizing my abilities", score: 1 },
      { value: "medium", label: "50-79% - I'm doing okay but could improve", score: 2 },
      { value: "low", label: "30-49% - I know I'm capable of much more", score: 3 },
      { value: "very-low", label: "Under 30% - I feel like I'm barely scratching the surface", score: 4 },
    ]
  },
  {
    id: "q4",
    text: "When you achieve a goal, what happens next?",
    options: [
      { value: "bigger", label: "I immediately set a bigger, more ambitious goal", score: 4 },
      { value: "celebrate", label: "I celebrate briefly, then look for the next opportunity", score: 3 },
      { value: "satisfied", label: "I feel satisfied and take a break", score: 2 },
      { value: "surprised", label: "I'm often surprised I actually achieved it", score: 1 },
    ]
  },
  {
    id: "q5",
    text: "How do you feel about your current life trajectory?",
    options: [
      { value: "transforming", label: "I'm actively transforming my life", score: 4 },
      { value: "improving", label: "I'm making steady improvements", score: 3 },
      { value: "exploring", label: "I feel like I'm exploring my options", score: 2 },
      { value: "frustrated", label: "I'm frustrated with my lack of progress", score: 1 },
    ]
  },
]

interface PotentialAssessmentProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function PotentialAssessment({ isOpen, onClose, userEmail }: PotentialAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<{ score: number; level: string; insights: string[] } | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema)
  })

  const watchedValues = watch()
  const currentAnswer = watchedValues[questions[currentQuestion]?.id]

  const calculateResults = (data: AssessmentFormData) => {
    const totalScore = questions.reduce((sum, question) => {
      const answer = data[question.id]
      const option = question.options.find(opt => opt.value === answer)
      return sum + (option?.score || 0)
    }, 0)

    const percentage = Math.round((totalScore / 20) * 100)
    
    let level: string
    let insights: string[]

    if (percentage >= 80) {
      level = "High Potential Activator"
      insights = [
        "You're already operating at a high level and actively pursuing growth",
        "Your challenge is scaling your impact and helping others reach their potential",
        "Focus on leadership development and creating systems for sustained success"
      ]
    } else if (percentage >= 60) {
      level = "Emerging Potential"
      insights = [
        "You have strong awareness of your capabilities and are making progress",
        "You're ready for more structured growth and accountability",
        "Focus on developing consistent habits and expanding your comfort zone"
      ]
    } else if (percentage >= 40) {
      level = "Untapped Potential"
      insights = [
        "You have significant unrealized potential waiting to be unlocked",
        "You're at a perfect stage for transformational growth",
        "Focus on identifying and overcoming limiting beliefs and patterns"
      ]
    } else {
      level = "Hidden Potential"
      insights = [
        "You have tremendous untapped potential that's ready to emerge",
        "Small changes could create massive improvements in your life",
        "Focus on building confidence and taking the first steps toward change"
      ]
    }

    return { score: percentage, level, insights }
  }

  const handleFormSubmit = async (data: AssessmentFormData) => {
    const assessmentResults = calculateResults(data)
    setResults(assessmentResults)
    setIsComplete(true)

    try {
      // Get stored user and session data
      const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('session_id') : null
      
      if (userId && sessionId) {
        // Convert form data to responses array
        const responses = Object.entries(data).map(([questionId, answer]) => ({
          questionId,
          answer,
          timeSpent: 30 // Approximate time per question
        }))

        // Call the process-assessment function
        const response = await fetch('/.netlify/functions/process-assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            sessionId,
            toolId: `potential-assessment-${Date.now()}`,
            toolName: 'potential-quotient-calculator',
            responses,
            completionRate: 1.0,
            timeSpent: responses.length * 30 // Total estimated time
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Assessment results saved:', result)
        } else {
          console.error('Failed to save assessment results')
        }
      }
    } catch (error) {
      console.error('Error saving assessment results:', error)
    }

    console.log('Assessment completed:', {
      email: userEmail,
      results: assessmentResults,
      responses: data
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleClose = () => {
    onClose()
    setCurrentQuestion(0)
    setIsComplete(false)
    setResults(null)
    reset()
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="min-h-[500px]">
        {!isComplete ? (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Potential Assessment</h2>
                <span className="text-sm text-muted-foreground">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Question */}
                  <div className="text-center mb-8">
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      {questions[currentQuestion].text}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center p-4 border border-border rounded-lg cursor-pointer transition-all",
                          "hover:border-[var(--color-energy-500)] hover:bg-[var(--color-energy-500)]/5",
                          currentAnswer === option.value && "border-[var(--color-energy-500)] bg-[var(--color-energy-500)]/10"
                        )}
                      >
                        <input
                          {...register(questions[currentQuestion].id)}
                          type="radio"
                          value={option.value}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-4 h-4 border-2 rounded-full mr-3 flex-shrink-0",
                          currentAnswer === option.value 
                            ? "border-[var(--color-energy-500)] bg-[var(--color-energy-500)]" 
                            : "border-muted-foreground"
                        )}>
                          {currentAnswer === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <span className="text-foreground">{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {errors[questions[currentQuestion].id] && (
                    <p className="text-destructive text-sm">
                      {errors[questions[currentQuestion].id]?.message}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    type="submit"
                    variant="cta"
                    disabled={!currentAnswer}
                  >
                    Get My Results
                    <BarChart3 className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="cta"
                    onClick={nextQuestion}
                    disabled={!currentAnswer}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </form>
          </>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[var(--color-energy-500)] to-[var(--color-transformation-500)] rounded-full flex items-center justify-center mb-6">
              <Target className="h-10 w-10 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your Potential Level: {results?.level}
              </h2>
              <div className="text-4xl font-bold text-[var(--color-energy-600)] mb-4">
                {results?.score}%
              </div>
              <p className="text-muted-foreground">
                You&apos;re currently utilizing {results?.score}% of your true potential
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-left">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-[var(--color-energy-500)]" />
                Your Personalized Insights
              </h3>
              <ul className="space-y-2">
                {results?.insights.map((insight, index) => (
                  <li key={index} className="text-muted-foreground flex items-start">
                    <span className="text-[var(--color-energy-500)] mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                variant="cta" 
                size="lg" 
                className="w-full"
                onClick={() => window.open('/membership/register?source=assessment-complete', '_blank')}
              >
                Get My Complete Potential Report
              </Button>
              <p className="text-xs text-muted-foreground">
                Join as a soft member to save your results and get detailed analysis sent to {userEmail}
              </p>
            </div>

            {/* Galaxy Dream Team Attribution */}
            <div className="border-t border-border pt-4 mt-6">
              <div className="flex items-center justify-center space-x-2">
                <GalaxyDreamTeamLogo variant="compact" size="small" />
                <span className="text-xs text-muted-foreground">
                  Assessment by Galaxy Dream Team
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Ethiopia's premier personal development platform
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}