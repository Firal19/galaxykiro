"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { EnhancedSectionHook } from "@/components/enhanced-section-hook"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import { Eye, Compass, Star, Heart, Briefcase, Users, Home, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface VisionVoidSectionProps {
  className?: string
}

export function VisionVoidSection({ className }: VisionVoidSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false)
  const { trackEngagement } = useEngagementTracking()

  const handleFullProfileSubmit = async (data: Record<string, unknown>) => {
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
          level: 3,
          data,
          sessionId,
          entryPoint: 'vision-void-section'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to capture full profile information')
      }

      const result = await response.json()
      console.log('Full profile information captured:', result)
      
      // Open the visualizer after successful capture
      setIsVisualizerOpen(true)
    } catch (error) {
      console.error('Error submitting full profile:', error)
      // Still allow access to visualizer even if backend fails
      setIsVisualizerOpen(true)
    }
  }

  return (
    <section className={cn("py-20 bg-gradient-to-br from-background to-[var(--color-energy-50)] dark:to-[var(--color-energy-900)]", className)}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Vision Void Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <VisionVoidVisualization />
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
              sectionId="vision-void"
              question="Can you describe your life 5 years from now in detail?"
              questionLink="/vision-void"
            />

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-energy-600)]">92%</div>
                <div className="text-sm text-muted-foreground">Have no clear 5-year vision</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-growth-600)]">8%</div>
                <div className="text-sm text-muted-foreground">Live with crystal clarity</div>
              </div>
            </motion.div>

            {/* Vision Components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Our Future Self Visualizer includes:</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                  <Eye className="h-5 w-5 text-[var(--color-energy-500)]" />
                  <span className="text-sm">Guided Visualization Exercise</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                  <Compass className="h-5 w-5 text-[var(--color-energy-500)]" />
                  <span className="text-sm">Life Wheel Assessment</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
                  <Star className="h-5 w-5 text-[var(--color-energy-500)]" />
                  <span className="text-sm">Vision Board Creator</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="cta"
                  size="lg"
                  onClick={() => {
                    trackEngagement({ type: 'cta_click', section: 'vision-void' })
                    setIsModalOpen(true)
                  }}
                  className="text-lg px-8 py-4 h-auto flex-1"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Visualize Your Future Self
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    trackEngagement({ type: 'learn_more_click', section: 'vision-void' })
                    window.open('/vision-void/learn-more', '_blank')
                  }}
                  className="text-lg px-8 py-4 h-auto"
                >
                  Learn More
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Create your personalized 5-year vision • Includes life wheel assessment
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Lead Capture Modal for Full Profile */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFullProfileSubmit}
        title="Visualize Your Future Self"
        description="Get access to our complete Future Self Visualizer suite. Create a crystal-clear vision of your ideal life and the roadmap to get there."
        ctaText="Create My Vision"
        level={3}
        fields={['name', 'email', 'phone', 'city', 'occupation', 'goals']}
      />

      {/* Future Self Visualizer Modal */}
      <FutureSelfVisualizer
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />
    </section>
  )
}

// Vision Void Visualization Component
function VisionVoidVisualization() {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)

  const lifeAreas = [
    { id: 'career', label: 'Career', icon: Briefcase, angle: 0, clarity: 20 },
    { id: 'health', label: 'Health', icon: Heart, angle: 45, clarity: 35 },
    { id: 'relationships', label: 'Relationships', icon: Users, angle: 90, clarity: 15 },
    { id: 'personal', label: 'Personal Growth', icon: Zap, angle: 135, clarity: 40 },
    { id: 'family', label: 'Family', icon: Home, angle: 180, clarity: 25 },
    { id: 'finances', label: 'Finances', icon: Star, angle: 225, clarity: 30 },
    { id: 'recreation', label: 'Recreation', icon: Compass, angle: 270, clarity: 45 },
    { id: 'contribution', label: 'Contribution', icon: Heart, angle: 315, clarity: 10 }
  ]

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glassmorphic Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.12, 0.18, 0.12]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-8 w-72 h-72 bg-gradient-to-br from-[var(--color-energy-400)]/30 to-[var(--color-transformation-400)]/30 rounded-full blur-3xl shadow-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.10, 0.16, 0.10]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-8 right-8 w-80 h-80 bg-gradient-to-br from-[var(--color-growth-400)]/30 to-[var(--color-ethiopian-gold)]/30 rounded-full blur-3xl shadow-2xl"
        />
        {/* Ethiopian pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          <defs>
            <pattern id="ethiopianPattern2" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#FFD700" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ethiopianPattern2)" />
        </svg>
      </div>
      {/* Life Wheel Visualization */}
      <div className="relative w-80 h-80 mx-auto z-10">
        {/* Outer Glassy Circle */}
        <div className="absolute inset-0 border-4 border-[var(--color-energy-300)] rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl" />
        {/* Animated Central Void */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.18, 0.28, 0.18]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-10 bg-gradient-to-br from-gray-200/60 to-gray-300/60 dark:from-gray-700/60 dark:to-gray-800/60 rounded-full flex items-center justify-center shadow-xl backdrop-blur-lg"
        >
          <div className="text-center">
            <div className="text-4xl font-extrabold text-gray-400 mb-2 drop-shadow-lg animate-pulse">?</div>
            <div className="text-base text-gray-500 drop-shadow">Vision Void</div>
          </div>
        </motion.div>
        {/* Life Areas with Animated Glow and Glassy Labels */}
        {lifeAreas.map((area, index) => {
          const radius = 120
          const x = Math.cos((area.angle - 90) * Math.PI / 180) * radius
          const y = Math.sin((area.angle - 90) * Math.PI / 180) * radius
          return (
            <motion.div
              key={area.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
              }}
              onMouseEnter={() => setHoveredArea(area.id)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <div className={`relative transition-all duration-300 ${hoveredArea === area.id ? 'scale-110' : ''}`}>
                {/* Animated Clarity Indicator */}
                <motion.div
                  animate={{
                    opacity: hoveredArea === area.id ? 0.7 : 0.3,
                    scale: hoveredArea === area.id ? 1.15 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute -inset-3 rounded-full border-2 border-dashed shadow-lg"
                  style={{
                    borderColor: `hsl(${area.clarity * 1.2}, 70%, 50%)`,
                    boxShadow: hoveredArea === area.id ? `0 0 16px 4px hsl(${area.clarity * 1.2}, 70%, 60%)` : undefined
                  }}
                />
                {/* Icon Container with Glow */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 border-2 border-white/40 ${hoveredArea === area.id ? 'ring-4 ring-[var(--color-energy-400)]/40' : ''}`}>
                  <area.icon
                    className="h-7 w-7 drop-shadow-glow"
                    style={{ color: `hsl(${area.clarity * 1.2}, 70%, 50%)` }}
                  />
                </div>
                {/* Glassy Label with Animated Gradient Text */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 text-center px-4 py-2 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg border border-white/30 min-w-[90px]">
                  <span className="font-bold text-base bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent animate-gradient-x">{area.label}</span>
                  <div className="text-xs text-muted-foreground mt-1">{area.clarity}% clear</div>
                </div>
              </div>
            </motion.div>
          )
        })}
        {/* Animated Connecting Lines */}
        {lifeAreas.map((area, index) => {
          const radius = 90
          return (
            <motion.div
              key={`line-${area.id}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.12 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
              className="absolute top-1/2 left-1/2 w-px bg-gradient-to-b from-[var(--color-energy-400)]/40 to-[var(--color-transformation-400)]/10 origin-bottom z-0"
              style={{
                height: `${radius}px`,
                transform: `translate(-50%, -100%) rotate(${area.angle}deg)`
              }}
            />
          )
        })}
      </div>
      {/* Glassy Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="mt-10 text-center px-4 py-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl inline-block border border-white/30 backdrop-blur-md"
      >
        <p className="text-base font-semibold bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent animate-gradient-x mb-2">Most people have unclear vision in most life areas</p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100/60 rounded-full">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
            <span>Unclear (0-30%)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100/60 rounded-full">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            <span>Somewhat Clear (30-60%)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100/60 rounded-full">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span>Crystal Clear (60%+)</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Future Self Visualizer Component
function FutureSelfVisualizer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<number, Record<string, string[] | Record<string, number>>>>({})
  const [showResults, setShowResults] = useState(false)

  const steps = [
    {
      title: "Guided Visualization",
      component: GuidedVisualization
    },
    {
      title: "Life Wheel Assessment", 
      component: LifeWheelAssessment
    },
    {
      title: "Vision Board Creator",
      component: VisionBoardCreator
    }
  ]

  const handleStepComplete = (stepData: Record<string, string[] | Record<string, number>>) => {
    setResponses({ ...responses, [currentStep]: stepData })
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {!showResults ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Future Self Visualizer</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-[var(--color-energy-500)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
            </div>

            {currentStep === 0 && <GuidedVisualization onComplete={handleStepComplete} />}
            {currentStep === 1 && <LifeWheelAssessment onComplete={handleStepComplete} />}
            {currentStep === 2 && <VisionBoardCreator onComplete={handleStepComplete} />}
          </>
        ) : (
          <VisionResults responses={responses} onClose={onClose} />
        )}
      </div>
    </div>
  )
}

// Individual Step Components
function GuidedVisualization({ onComplete }: { onComplete: (data: { visualization: string[] }) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])

  const questions = [
    "Imagine it&apos;s 5 years from now. Where are you living?",
    "What does your typical day look like?",
    "What work are you doing that energizes you?",
    "Who are the important people in your life?",
    "What are you most proud of accomplishing?"
  ]

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete({ visualization: newAnswers })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-medium mb-2">Close your eyes and imagine...</h4>
        <p className="text-sm text-gray-600">Take a moment to really visualize your answer before writing it down.</p>
      </div>

      <div className="space-y-4">
        <h5 className="font-medium">{questions[currentQuestion]}</h5>
        <textarea
          className="w-full p-3 border rounded-lg resize-none h-24"
          placeholder="Describe what you see in detail..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              const answer = (e.target as HTMLTextAreaElement).value
              if (answer.trim()) {
                handleAnswer(answer)
              }
            }
          }}
        />
        <Button
          onClick={() => {
            const textarea = document.querySelector('textarea') as HTMLTextAreaElement
            const answer = textarea?.value
            if (answer?.trim()) {
              handleAnswer(answer)
            }
          }}
          className="w-full"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Visualization'}
        </Button>
      </div>
    </div>
  )
}

function LifeWheelAssessment({ onComplete }: { onComplete: (data: { lifeWheel: Record<string, number> }) => void }) {
  const [scores, setScores] = useState<{ [key: string]: number }>({})

  const areas = [
    { id: 'career', label: 'Career & Work', icon: Briefcase },
    { id: 'health', label: 'Health & Fitness', icon: Heart },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'personal', label: 'Personal Growth', icon: Zap },
    { id: 'family', label: 'Family', icon: Home },
    { id: 'finances', label: 'Money & Finances', icon: Star },
    { id: 'recreation', label: 'Fun & Recreation', icon: Compass },
    { id: 'contribution', label: 'Contribution & Legacy', icon: Heart }
  ]

  const handleScoreChange = (areaId: string, score: number) => {
    setScores({ ...scores, [areaId]: score })
  }

  const canComplete = areas.every(area => scores[area.id] !== undefined)

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-medium mb-2">Rate Your Life Areas</h4>
        <p className="text-sm text-gray-600">Rate each area from 1 (needs work) to 10 (excellent)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <div key={area.id} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <area.icon className="h-5 w-5 text-[var(--color-energy-500)]" />
              <span className="font-medium">{area.label}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => handleScoreChange(area.id, score)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    scores[area.id] === score
                      ? 'bg-[var(--color-energy-500)] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onComplete({ lifeWheel: scores })}
        disabled={!canComplete}
        className="w-full"
      >
        Complete Life Wheel Assessment
      </Button>
    </div>
  )
}

function VisionBoardCreator({ onComplete }: { onComplete: (data: { visionBoard: string[] }) => void }) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [customGoal, setCustomGoal] = useState('')

  const goalCategories = [
    {
      category: 'Career',
      goals: ['Start my own business', 'Get promoted to leadership', 'Change careers', 'Become an expert in my field']
    },
    {
      category: 'Health',
      goals: ['Run a marathon', 'Lose 20 pounds', 'Build muscle', 'Improve mental health']
    },
    {
      category: 'Relationships',
      goals: ['Find my life partner', 'Strengthen family bonds', 'Build deeper friendships', 'Improve communication skills']
    },
    {
      category: 'Personal',
      goals: ['Learn a new language', 'Travel to 10 countries', 'Write a book', 'Master a new skill']
    }
  ]

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const addCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(customGoal)) {
      setSelectedGoals([...selectedGoals, customGoal])
      setCustomGoal('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-medium mb-2">Create Your Vision Board</h4>
        <p className="text-sm text-gray-600">Select the goals that resonate with your 5-year vision</p>
      </div>

      {goalCategories.map((category) => (
        <div key={category.category} className="space-y-3">
          <h5 className="font-medium text-[var(--color-energy-600)]">{category.category}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {category.goals.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  selectedGoals.includes(goal)
                    ? 'bg-[var(--color-energy-50)] border-[var(--color-energy-500)] text-[var(--color-energy-700)]'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <h5 className="font-medium text-[var(--color-energy-600)]">Add Your Own Goal</h5>
        <div className="flex gap-2">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Enter your custom goal..."
            className="flex-1 p-3 border rounded-lg"
            onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
          />
          <Button onClick={addCustomGoal} variant="outline">
            Add
          </Button>
        </div>
      </div>

      {selectedGoals.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium">Your Vision Board ({selectedGoals.length} goals)</h5>
          <div className="flex flex-wrap gap-2">
            {selectedGoals.map((goal) => (
              <span
                key={goal}
                className="px-3 py-1 bg-[var(--color-energy-100)] text-[var(--color-energy-700)] rounded-full text-sm"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() => onComplete({ visionBoard: selectedGoals })}
        disabled={selectedGoals.length === 0}
        className="w-full"
      >
        Complete Vision Board
      </Button>
    </div>
  )
}

function VisionResults({ onClose }: { responses: Record<number, Record<string, string[] | Record<string, number>>>; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Future Self Vision</h3>
        <p className="text-sm text-gray-600">Here&apos;s your personalized vision summary</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-[var(--color-energy-50)] rounded-lg">
          <h4 className="font-medium mb-2">Vision Clarity Score</h4>
          <div className="text-2xl font-bold text-[var(--color-energy-600)]">
            {Math.round(Math.random() * 30 + 60)}%
          </div>
          <p className="text-sm text-gray-600">You have a good foundation. Let&apos;s make it crystal clear!</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Next Steps</h4>
          <ul className="space-y-1 text-sm">
            <li>• Schedule weekly vision review sessions</li>
            <li>• Create specific 90-day milestones</li>
            <li>• Build accountability systems</li>
            <li>• Join our Vision Clarity Workshop</li>
          </ul>
        </div>
      </div>

      <Button onClick={onClose} className="w-full" variant="cta">
        Continue Your Journey
      </Button>
    </div>
  )
}