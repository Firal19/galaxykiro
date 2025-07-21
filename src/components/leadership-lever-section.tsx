"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LeadCaptureModal } from "@/components/lead-capture-modal"
import { OfficeVisitBooking } from "@/components/office-visit-booking"
import { EnhancedSectionHook } from "@/components/enhanced-section-hook"
import { useEngagementTracking } from "@/lib/hooks/use-engagement-tracking"
import { Crown, Users, TrendingUp, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeadershipLeverSectionProps {
  className?: string
}

export function LeadershipLeverSection({ className }: LeadershipLeverSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isIdentifierOpen, setIsIdentifierOpen] = useState(false)
  const [isOfficeVisitOpen, setIsOfficeVisitOpen] = useState(false)
  const [selectedOfficeLocation, setSelectedOfficeLocation] = useState<string>('')
  const { trackEngagement } = useEngagementTracking()

  const handleOfficeLocationSubmit = async (data: Record<string, unknown>) => {
    try {
      // Store the selected office location for later use
      setSelectedOfficeLocation(data.officeLocation as string)
      
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
          data: { officeLocation: data.officeLocation },
          sessionId,
          entryPoint: 'leadership-lever-section'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to capture office location information')
      }

      const result = await response.json()
      console.log('Office location information captured:', result)
      
      // Open the identifier after successful capture
      setIsIdentifierOpen(true)
    } catch (error) {
      console.error('Error submitting office location:', error)
      // Still allow access to identifier even if backend fails
      setIsIdentifierOpen(true)
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
              sectionId="leadership-lever"
              question="Are you leading your life, or is life leading you?"
              questionLink="/leadership-lever"
            />

            {/* Leadership Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-transformation-600)]">85%</div>
                <div className="text-sm text-muted-foreground">Don&apos;t know their leadership style</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-[var(--color-growth-600)]">15%</div>
                <div className="text-sm text-muted-foreground">Lead with intention</div>
              </div>
            </motion.div>

            {/* Leadership Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Discover your leadership style:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">Understand your natural influence patterns</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">Learn how others perceive your leadership</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[var(--color-transformation-500)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">Get strategies to amplify your strengths</p>
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
                    trackEngagement({ type: 'cta_click', section: 'leadership-lever' })
                    setIsModalOpen(true)
                  }}
                  className="text-lg px-8 py-4 h-auto flex-1"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Identify Your Leadership Style
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    trackEngagement({ type: 'learn_more_click', section: 'leadership-lever' })
                    window.open('/leadership-lever/learn-more', '_blank')
                  }}
                  className="text-lg px-8 py-4 h-auto"
                >
                  Learn More
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                10-question assessment • Personalized leadership profile
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column - Leadership Styles Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <LeadershipStylesVisualization />
          </motion.div>
        </div>
      </div>

      {/* Lead Capture Modal for Office Location */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleOfficeLocationSubmit}
        title="Identify Your Leadership Style"
        description="Get your personalized Leadership Style Profile. Discover your natural leadership patterns and learn how to maximize your influence."
        ctaText="Get My Leadership Profile"
        level={3}
        fields={['officeLocation']}
      />

      {/* Leadership Style Identifier Modal */}
      <LeadershipStyleIdentifier
        isOpen={isIdentifierOpen}
        onClose={() => setIsIdentifierOpen(false)}
      />

      {/* Office Visit Booking Modal */}
      <OfficeVisitBooking
        isOpen={isOfficeVisitOpen}
        onClose={() => setIsOfficeVisitOpen(false)}
        bookingSource="leadership-lever-section"
        preselectedLocation={selectedOfficeLocation}
      />
    </section>
  )
}

// Leadership Styles Visualization Component
function LeadershipStylesVisualization() {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null)

  const leadershipStyles = [
    {
      id: 'visionary',
      name: 'Visionary',
      description: 'Inspires with big picture thinking',
      icon: Target,
      color: 'var(--color-energy-500)',
      position: { x: 0, y: -120 }
    },
    {
      id: 'coach',
      name: 'Coach',
      description: 'Develops people and potential',
      icon: Users,
      color: 'var(--color-growth-500)',
      position: { x: 104, y: -60 }
    },
    {
      id: 'democratic',
      name: 'Democratic',
      description: 'Builds consensus and collaboration',
      icon: Crown,
      color: 'var(--color-transformation-500)',
      position: { x: 104, y: 60 }
    },
    {
      id: 'pacesetting',
      name: 'Pacesetting',
      description: 'Sets high standards and leads by example',
      icon: TrendingUp,
      color: 'var(--color-energy-600)',
      position: { x: 0, y: 120 }
    },
    {
      id: 'commanding',
      name: 'Commanding',
      description: 'Takes charge in crisis situations',
      icon: Crown,
      color: 'var(--color-transformation-600)',
      position: { x: -104, y: 60 }
    },
    {
      id: 'affiliative',
      name: 'Affiliative',
      description: 'Creates harmony and builds relationships',
      icon: Users,
      color: 'var(--color-growth-600)',
      position: { x: -104, y: -60 }
    }
  ]

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glassmorphic Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360, opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 left-8 w-72 h-72 bg-gradient-to-br from-[var(--color-energy-400)]/30 to-[var(--color-transformation-400)]/30 rounded-full blur-3xl shadow-2xl"
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.10, 0.16, 0.10] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-8 right-8 w-80 h-80 bg-gradient-to-br from-[var(--color-growth-400)]/30 to-[var(--color-ethiopian-gold)]/30 rounded-full blur-3xl shadow-2xl"
        />
        {/* Ethiopian pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
          <defs>
            <pattern id="ethiopianPattern4" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#FFD700" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ethiopianPattern4)" />
        </svg>
      </div>
      {/* Leadership Styles Visualization */}
      <div className="relative w-80 h-80 mx-auto z-10">
        {/* Central Glassy Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-gradient-to-br from-[var(--color-transformation-500)] to-[var(--color-energy-500)] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 backdrop-blur-md">
          <div className="text-center text-white">
            <Crown className="h-10 w-10 mx-auto mb-2 drop-shadow-md animate-pulse" />
            <div className="text-base font-bold drop-shadow-md">YOU</div>
          </div>
        </div>
        {/* Leadership Styles with Animated Glow and Glassy Labels */}
        {leadershipStyles.map((style, index) => (
          <motion.div
            key={style.id}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{
              transform: `translate(${style.position.x * 0.92}px, ${style.position.y * 0.92}px) translate(-50%, -50%)`
            }}
            onMouseEnter={() => setHoveredStyle(style.id)}
            onMouseLeave={() => setHoveredStyle(null)}
          >
            <div className={`relative transition-all duration-300 ${hoveredStyle === style.id ? 'scale-110' : ''}`}>
              {/* Animated Glow */}
              <motion.div
                animate={{
                  opacity: hoveredStyle === style.id ? 0.7 : 0.3,
                  scale: hoveredStyle === style.id ? 1.15 : 1
                }}
                transition={{ duration: 0.4 }}
                className="absolute -inset-3 rounded-full border-2 border-dashed shadow-lg"
                style={{
                  borderColor: style.color,
                  boxShadow: hoveredStyle === style.id ? `0 0 16px 4px ${style.color}` : undefined
                }}
              />
              {/* Icon Container with Glow */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 border-2 border-white/40 ${hoveredStyle === style.id ? 'ring-4 ring-[var(--color-energy-400)]/40' : ''}`}>
                <style.icon
                  className="h-8 w-8 drop-shadow-glow"
                  style={{ color: style.color }}
                />
              </div>
              {/* Glassy Label with Animated Gradient Text */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 text-center px-4 py-2 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg border border-white/30 min-w-[90px]">
                <span className="font-bold text-base bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent animate-gradient-x">{style.name}</span>
                {hoveredStyle === style.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground mt-2 max-w-32 drop-shadow-sm bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
                  >
                    {style.description}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {/* Animated Rotating Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border-2 border-dashed border-[var(--color-transformation-300)] rounded-full opacity-20"
        />
      </div>
      {/* Glassy Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        className="mt-10 text-center px-4 py-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl inline-block border border-white/30 backdrop-blur-md"
      >
        <p className="text-base font-semibold bg-gradient-to-r from-[var(--color-energy-500)] via-[var(--color-growth-600)] to-[var(--color-transformation-500)] bg-clip-text text-transparent animate-gradient-x mb-2">Most people use 1-2 styles. Great leaders adapt their style to the situation.</p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
          {leadershipStyles.map((style) => (
            <div key={style.id} className="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-gray-900/60 rounded-full border border-white/20">
              <style.icon className="h-4 w-4" style={{ color: style.color }} />
              <span>{style.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Leadership Style Identifier Component
function LeadershipStyleIdentifier({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [isOfficeVisitOpen, setIsOfficeVisitOpen] = useState(false)

  const questions = [
    {
      text: "When facing a team challenge, you typically:",
      options: [
        { text: "Paint a compelling vision of the solution", style: "visionary", value: 3 },
        { text: "Help team members develop their skills", style: "coach", value: 3 },
        { text: "Seek input from everyone before deciding", style: "democratic", value: 3 },
        { text: "Set high standards and lead by example", style: "pacesetting", value: 3 },
        { text: "Take charge and give clear directions", style: "commanding", value: 3 },
        { text: "Focus on team harmony and relationships", style: "affiliative", value: 3 }
      ]
    },
    {
      text: "Your communication style is best described as:",
      options: [
        { text: "Inspiring and future-focused", style: "visionary", value: 3 },
        { text: "Supportive and developmental", style: "coach", value: 3 },
        { text: "Collaborative and inclusive", style: "democratic", value: 3 },
        { text: "Direct and performance-oriented", style: "pacesetting", value: 3 },
        { text: "Authoritative and decisive", style: "commanding", value: 3 },
        { text: "Warm and relationship-building", style: "affiliative", value: 3 }
      ]
    },
    {
      text: "When motivating others, you focus on:",
      options: [
        { text: "Connecting work to a bigger purpose", style: "visionary", value: 3 },
        { text: "Personal growth and development", style: "coach", value: 3 },
        { text: "Shared ownership and buy-in", style: "democratic", value: 3 },
        { text: "Excellence and high achievement", style: "pacesetting", value: 3 },
        { text: "Clear expectations and accountability", style: "commanding", value: 3 },
        { text: "Belonging and team connection", style: "affiliative", value: 3 }
      ]
    },
    {
      text: "In a crisis situation, you:",
      options: [
        { text: "Remind everyone of the long-term vision", style: "visionary", value: 2 },
        { text: "Support team members through the challenge", style: "coach", value: 2 },
        { text: "Gather input to find the best solution", style: "democratic", value: 1 },
        { text: "Model the behavior you want to see", style: "pacesetting", value: 2 },
        { text: "Take control and make quick decisions", style: "commanding", value: 3 },
        { text: "Keep the team united and positive", style: "affiliative", value: 2 }
      ]
    },
    {
      text: "Your approach to feedback is:",
      options: [
        { text: "Connect performance to the bigger picture", style: "visionary", value: 2 },
        { text: "Focus on growth and learning opportunities", style: "coach", value: 3 },
        { text: "Seek mutual understanding and agreement", style: "democratic", value: 2 },
        { text: "Set clear performance standards", style: "pacesetting", value: 3 },
        { text: "Give direct, immediate feedback", style: "commanding", value: 2 },
        { text: "Emphasize strengths and positive aspects", style: "affiliative", value: 2 }
      ]
    },
    {
      text: "When building a team, you prioritize:",
      options: [
        { text: "Shared vision and purpose", style: "visionary", value: 3 },
        { text: "Individual development and potential", style: "coach", value: 3 },
        { text: "Diverse perspectives and collaboration", style: "democratic", value: 3 },
        { text: "High performers and excellence", style: "pacesetting", value: 3 },
        { text: "Clear roles and accountability", style: "commanding", value: 2 },
        { text: "Team chemistry and relationships", style: "affiliative", value: 3 }
      ]
    },
    {
      text: "Your decision-making style is:",
      options: [
        { text: "Based on long-term vision and values", style: "visionary", value: 3 },
        { text: "Considers individual development impact", style: "coach", value: 2 },
        { text: "Involves stakeholders in the process", style: "democratic", value: 3 },
        { text: "Quick and performance-focused", style: "pacesetting", value: 2 },
        { text: "Fast and decisive", style: "commanding", value: 3 },
        { text: "Considers team harmony and morale", style: "affiliative", value: 2 }
      ]
    },
    {
      text: "When delegating, you:",
      options: [
        { text: "Explain how tasks connect to the vision", style: "visionary", value: 2 },
        { text: "Use it as a development opportunity", style: "coach", value: 3 },
        { text: "Involve people in deciding who does what", style: "democratic", value: 2 },
        { text: "Delegate to your highest performers", style: "pacesetting", value: 2 },
        { text: "Give clear instructions and deadlines", style: "commanding", value: 3 },
        { text: "Consider people's preferences and strengths", style: "affiliative", value: 3 }
      ]
    },
    {
      text: "Your leadership energy comes from:",
      options: [
        { text: "Inspiring others toward a better future", style: "visionary", value: 3 },
        { text: "Seeing people grow and develop", style: "coach", value: 3 },
        { text: "Building consensus and collaboration", style: "democratic", value: 3 },
        { text: "Achieving excellence and high standards", style: "pacesetting", value: 3 },
        { text: "Getting results and solving problems", style: "commanding", value: 3 },
        { text: "Creating positive relationships", style: "affiliative", value: 3 }
      ]
    },
    {
      text: "Others would describe your leadership as:",
      options: [
        { text: "Inspiring and forward-thinking", style: "visionary", value: 3 },
        { text: "Supportive and developmental", style: "coach", value: 3 },
        { text: "Collaborative and inclusive", style: "democratic", value: 3 },
        { text: "Demanding but fair", style: "pacesetting", value: 3 },
        { text: "Strong and decisive", style: "commanding", value: 3 },
        { text: "Caring and relationship-focused", style: "affiliative", value: 3 }
      ]
    }
  ]

  const handleAnswer = (option: { text: string; style: string; value: number }) => {
    const newAnswers = { ...answers }
    newAnswers[option.style] = (newAnswers[option.style] || 0) + option.value

    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const getTopStyles = () => {
    const sortedStyles = Object.entries(answers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    const styleNames: { [key: string]: string } = {
      visionary: "Visionary",
      coach: "Coach", 
      democratic: "Democratic",
      pacesetting: "Pacesetting",
      commanding: "Commanding",
      affiliative: "Affiliative"
    }

    return sortedStyles.map(([style, score]) => ({
      name: styleNames[style],
      score,
      percentage: Math.round((score / Math.max(...Object.values(answers))) * 100)
    }))
  }

  const getStyleDescription = (styleName: string) => {
    const descriptions: { [key: string]: string } = {
      "Visionary": "You inspire others with compelling visions of the future. You're great at motivating people toward long-term goals and helping them see the bigger picture.",
      "Coach": "You focus on developing people and helping them reach their potential. You're skilled at providing guidance and support for individual growth.",
      "Democratic": "You build consensus and value everyone's input. You're excellent at creating collaborative environments where people feel heard and valued.",
      "Pacesetting": "You set high standards and lead by example. You're driven by excellence and expect others to match your level of performance.",
      "Commanding": "You take charge and provide clear direction. You're effective in crisis situations and when quick decisions are needed.",
      "Affiliative": "You prioritize relationships and team harmony. You're skilled at building connections and creating positive team dynamics."
    }
    return descriptions[styleName] || ""
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {!showResults ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Leadership Style Identifier</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-[var(--color-transformation-500)] h-2 rounded-full transition-all duration-300"
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
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Leadership Profile</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-[var(--color-transformation-600)] mb-2">
                  Primary Style: {getTopStyles()[0]?.name}
                </h4>
                <p className="text-gray-600 mb-4">
                  {getStyleDescription(getTopStyles()[0]?.name)}
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Your Leadership Style Breakdown:</h5>
                {getTopStyles().map((style) => (
                  <div key={style.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{style.name}</span>
                      <span className="text-sm text-gray-600">{style.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[var(--color-transformation-500)] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${style.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-[var(--color-transformation-50)] rounded-lg">
                <h5 className="font-medium mb-2">Next Steps for Leadership Growth:</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Practice adapting your style to different situations</li>
                  <li>• Develop your secondary leadership styles</li>
                  <li>• Seek feedback on your leadership impact</li>
                  <li>• Schedule a personal leadership consultation</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={() => setIsOfficeVisitOpen(true)} 
                  className="w-full" 
                  variant="cta"
                >
                  Schedule Leadership Consultation
                </Button>
                <Button onClick={onClose} className="w-full" variant="outline">
                  Continue Your Journey
                </Button>
              </div>

              {/* Office Visit Booking Modal */}
              <OfficeVisitBooking
                isOpen={isOfficeVisitOpen}
                onClose={() => setIsOfficeVisitOpen(false)}
                bookingSource="leadership-lever-results"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}