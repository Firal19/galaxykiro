"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PotentialAssessment } from '@/components/potential-assessment'
import { LeadCaptureModal } from '@/components/lead-capture-modal'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  Users, 
  Heart,
  ArrowRight,
  Lock,
  Sparkles 
} from 'lucide-react'

const publicTools = [
  {
    id: 'potential-quotient',
    title: 'Potential Quotient Calculator',
    description: 'Discover your untapped potential across 8 key life dimensions. Get instant insights into your hidden strengths.',
    icon: Brain,
    color: 'from-blue-500 to-purple-600',
    estimatedTime: '5 min',
    component: 'PotentialAssessment',
    isPublic: true,
    completions: 12847
  },
  {
    id: 'goal-predictor',
    title: 'Goal Achievement Predictor',
    description: 'Analyze your goal-setting patterns and predict your success probability with 89% accuracy.',
    icon: Target,
    color: 'from-green-500 to-teal-600',
    estimatedTime: '7 min',
    isPublic: true,
    completions: 8932
  },
  {
    id: 'transformation-readiness',
    title: 'Transformation Readiness Score',
    description: 'Measure how prepared you are for personal change and growth. Unlock your transformation potential.',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-600',
    estimatedTime: '6 min',
    isPublic: true,
    completions: 15673
  }
]

const premiumTools = [
  {
    id: 'leadership-profiler',
    title: 'Leadership Style Profiler',
    description: 'Advanced assessment revealing your unique leadership blueprint and influence patterns.',
    icon: Users,
    color: 'from-purple-500 to-pink-600',
    estimatedTime: '12 min',
    isPublic: false,
    completions: 4521
  },
  {
    id: 'habit-installer',
    title: 'Scientific Habit Installer',
    description: 'Design bulletproof habits using neuroscience and behavioral psychology principles.',
    icon: Zap,
    color: 'from-yellow-500 to-orange-600',
    estimatedTime: '15 min',
    isPublic: false,
    completions: 6789
  },
  {
    id: 'inner-dialogue-decoder',
    title: 'Inner Dialogue Decoder',
    description: 'Decode your self-talk patterns and reprogram your inner voice for success.',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    estimatedTime: '10 min',
    isPublic: false,
    completions: 3456
  }
]

export function InteractiveToolsSection() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleToolClick = (toolId: string, isPublic: boolean) => {
    if (isPublic) {
      if (toolId === 'potential-quotient') {
        setIsAssessmentOpen(true)
      }
      // Handle other public tools
    } else {
      // Premium tool - require registration
      setSelectedTool(toolId)
      setIsLeadCaptureOpen(true)
    }
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      const sessionId = localStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      localStorage.setItem('session_id', sessionId)

      const response = await fetch('/api/capture-user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: 1,
          data: { email },
          sessionId,
          entryPoint: 'interactive-tools'
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setUserEmail(email)
        if (result.data?.user?.id) {
          localStorage.setItem('user_id', result.data.user.id)
        }
        // Redirect to soft member portal
        window.location.href = '/membership/dashboard'
      }
    } catch (error) {
      console.error('Error submitting email:', error)
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-6">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Interactive Assessment Tools</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Discover Your Hidden Potential
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unlock profound insights about yourself with our scientifically-backed assessment tools. 
            Start with our free tools, then access our complete library as a member.
          </p>
        </motion.div>

        {/* Free Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="bg-green-100 dark:bg-green-900 px-6 py-3 rounded-full">
              <span className="text-green-800 dark:text-green-200 font-semibold text-lg">
                🎁 Free Access - No Registration Required
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {publicTools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden">
                    <div className="p-8">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">FREE</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tool.estimatedTime}</div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{tool.completions.toLocaleString()} people completed</span>
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handleToolClick(tool.id, tool.isPublic)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Start Assessment
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Premium Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-6 py-3 rounded-full">
              <span className="text-purple-800 dark:text-purple-200 font-semibold text-lg">
                ⭐ Premium Tools - Quick Registration Required
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {premiumTools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group h-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden relative">
                    {/* Premium Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        PREMIUM
                      </div>
                    </div>

                    <div className="p-8">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400">{tool.estimatedTime}</div>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {tool.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{tool.completions.toLocaleString()} people completed</span>
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handleToolClick(tool.id, tool.isPublic)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Lock className="mr-2 w-4 h-4" />
                        Unlock with Quick Registration
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Unlock Your Full Potential?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who have transformed their lives through deep self-awareness
            </p>
            <Button
              onClick={() => setIsLeadCaptureOpen(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Full Access Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <PotentialAssessment
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        userEmail={userEmail}
      />

      <LeadCaptureModal
        isOpen={isLeadCaptureOpen}
        onClose={() => setIsLeadCaptureOpen(false)}
        onSubmit={handleEmailSubmit}
        title="Unlock Premium Assessment Tools"
        description="Get instant access to our complete library of scientifically-backed assessment tools. Discover insights that could transform your personal and professional life."
        ctaText="Get Instant Access"
      />
    </section>
  )
}