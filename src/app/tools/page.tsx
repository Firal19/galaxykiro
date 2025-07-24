"use client"

import { motion } from 'framer-motion'
import { PublicLayout } from '@/components/layouts/public-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/auth-context'
import { useLeadScoringV2 } from '@/lib/hooks/use-lead-scoring-v2'
import {
  Brain,
  Target,
  TrendingUp,
  Zap,
  Users,
  Heart,
  Star,
  Lock,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react'

// Progressive tool unlocking system as per master plan
const allTools = [
  // 3 Public Tools (Available to all visitors)
  {
    id: 'potential-quotient',
    title: 'Potential Quotient Calculator',
    description: 'Discover your untapped potential across 8 key life dimensions',
    icon: Brain,
    estimatedTime: '5 min',
    accessLevel: 'public',
    category: 'Self-Discovery',
    difficulty: 'Beginner',
    unlockCriteria: 'Always available'
  },
  {
    id: 'goal-achievement-predictor',
    title: 'Goal Achievement Predictor',
    description: 'Predict your success probability with 89% accuracy',
    icon: Target,
    estimatedTime: '7 min',
    accessLevel: 'public',
    category: 'Goal Setting',
    difficulty: 'Beginner',
    unlockCriteria: 'Always available'
  },
  {
    id: 'transformation-readiness-score',
    title: 'Transformation Readiness Score',
    description: 'Measure how prepared you are for personal change',
    icon: TrendingUp,
    estimatedTime: '6 min',
    accessLevel: 'public',
    category: 'Transformation',
    difficulty: 'Beginner',
    unlockCriteria: 'Always available'
  },
  
  // 4 Cold Lead Tools (Unlocked after registration/2+ min on site)
  {
    id: 'communication-style-analyzer',
    title: 'Communication Style Analyzer',
    description: 'Discover your unique communication patterns and preferences',
    icon: Users,
    estimatedTime: '8 min',
    accessLevel: 'cold_lead',
    category: 'Communication',
    difficulty: 'Beginner',
    unlockCriteria: 'Registration or 2+ minutes on site'
  },
  {
    id: 'confidence-builder-assessment',
    title: 'Confidence Builder Assessment',
    description: 'Identify confidence gaps and get personalized building strategies',
    icon: Star,
    estimatedTime: '10 min',
    accessLevel: 'cold_lead',
    category: 'Self-Development',
    difficulty: 'Beginner',
    unlockCriteria: 'Registration or 2+ minutes on site'
  },
  {
    id: 'time-mastery-audit',
    title: 'Time Mastery Audit',
    description: 'Analyze your time usage patterns and optimize productivity',
    icon: Clock,
    estimatedTime: '12 min',
    accessLevel: 'cold_lead',
    category: 'Productivity',
    difficulty: 'Intermediate',
    unlockCriteria: 'Registration or 2+ minutes on site'
  },
  {
    id: 'network-strength-mapper',
    title: 'Network Strength Mapper',
    description: 'Evaluate your professional network and identify growth opportunities',
    icon: Users,
    estimatedTime: '9 min',
    accessLevel: 'cold_lead',
    category: 'Networking',
    difficulty: 'Intermediate',
    unlockCriteria: 'Registration or 2+ minutes on site'
  },

  // 4 Candidate Tools (Email verified + basic info provided)
  {
    id: 'leadership-style-profiler',
    title: 'Leadership Style Profiler',
    description: 'Reveal your unique leadership blueprint and development areas',
    icon: Award,
    estimatedTime: '15 min',
    accessLevel: 'candidate',
    category: 'Leadership',
    difficulty: 'Intermediate',
    unlockCriteria: 'Email verified + basic info provided'
  },
  {
    id: 'habit-installer',
    title: 'Scientific Habit Installer',
    description: 'Design bulletproof habits using neuroscience and behavioral psychology',
    icon: Zap,
    estimatedTime: '18 min',
    accessLevel: 'candidate',
    category: 'Habits',
    difficulty: 'Intermediate',
    unlockCriteria: 'Email verified + basic info provided'
  },
  {
    id: 'emotional-intelligence-scanner',
    title: 'Emotional Intelligence Scanner',
    description: 'Measure and develop your emotional intelligence across 5 domains',
    icon: Heart,
    estimatedTime: '14 min',
    accessLevel: 'candidate',
    category: 'Emotional Intelligence',
    difficulty: 'Intermediate',
    unlockCriteria: 'Email verified + basic info provided'
  },
  {
    id: 'decision-making-optimizer',
    title: 'Decision Making Optimizer',
    description: 'Improve your decision-making process with proven frameworks',
    icon: Target,
    estimatedTime: '16 min',
    accessLevel: 'candidate',
    category: 'Decision Making',
    difficulty: 'Advanced',
    unlockCriteria: 'Email verified + basic info provided'
  },

  // 4 Hot Lead Tools (High engagement + webinar registered)
  {
    id: 'inner-dialogue-decoder',
    title: 'Inner Dialogue Decoder',
    description: 'Decode and reprogram your self-talk patterns for success',
    icon: Brain,
    estimatedTime: '20 min',
    accessLevel: 'hot_lead',
    category: 'Mindset',
    difficulty: 'Advanced',
    unlockCriteria: 'High engagement + webinar registered'
  },
  {
    id: 'influence-mastery-assessment',
    title: 'Influence & Persuasion Mastery',
    description: 'Master the psychology of influence and ethical persuasion',
    icon: Users,
    estimatedTime: '22 min',
    accessLevel: 'hot_lead',
    category: 'Influence',
    difficulty: 'Advanced',
    unlockCriteria: 'High engagement + webinar registered'
  },
  {
    id: 'vision-architect',
    title: 'Vision Architect',
    description: 'Create compelling personal and professional visions that drive action',
    icon: Star,
    estimatedTime: '25 min',
    accessLevel: 'hot_lead',
    category: 'Vision & Goals',
    difficulty: 'Advanced',
    unlockCriteria: 'High engagement + webinar registered'
  },
  {
    id: 'legacy-builder-blueprint',
    title: 'Legacy Builder Blueprint',
    description: 'Design your lasting impact and contribution to the world',
    icon: Award,
    estimatedTime: '30 min',
    accessLevel: 'hot_lead',
    category: 'Legacy & Impact',
    difficulty: 'Expert',
    unlockCriteria: 'High engagement + webinar registered'
  }
]

export default function ToolsPage() {
  const { user } = useAuth()
  const isLoggedIn = !!user
  const { 
    profile, 
    loading, 
    trackToolUsage, 
    getCurrentStatus, 
    getEngagementScore,
    insights 
  } = useLeadScoringV2()
  
  const visitorStatus = getCurrentStatus()
  const engagementScore = getEngagementScore()

  // Filter tools based on visitor status and engagement
  const getAccessibleTools = () => {
    return allTools.filter(tool => {
      switch (tool.accessLevel) {
        case 'public':
          return true
        case 'cold_lead':
          return visitorStatus !== 'visitor' || engagementScore >= 15
        case 'candidate':
          return visitorStatus === 'candidate' || visitorStatus === 'hot_lead' || isLoggedIn
        case 'hot_lead':
          return visitorStatus === 'hot_lead' || engagementScore >= 100
        default:
          return false
      }
    })
  }

  const accessibleTools = getAccessibleTools()
  const lockedTools = allTools.filter(tool => !accessibleTools.includes(tool))

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">
            <Award className="w-4 h-4 mr-2" />
            15+ Assessment Tools
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Interactive Assessment Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Scientifically-backed tools designed to unlock insights about yourself and accelerate your personal growth journey.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Progress: {visitorStatus.replace('_', ' ').toUpperCase()}
              </h3>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
                {accessibleTools.length} / {allTools.length} Tools Unlocked
              </Badge>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[
                { level: 'public', label: 'Public', count: 3, color: 'bg-green-500' },
                { level: 'cold_lead', label: 'Cold Lead', count: 4, color: 'bg-blue-500' },
                { level: 'candidate', label: 'Candidate', count: 4, color: 'bg-purple-500' },
                { level: 'hot_lead', label: 'Hot Lead', count: 4, color: 'bg-red-500' }
              ].map(tier => {
                const unlockedInTier = accessibleTools.filter(tool => tool.accessLevel === tier.level).length
                const isUnlocked = unlockedInTier > 0
                
                return (
                  <div key={tier.level} className="text-center">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      isUnlocked ? tier.color : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <span className="text-white font-bold">{unlockedInTier}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{tier.label}</p>
                    <p className="text-xs text-gray-500">{unlockedInTier}/{tier.count}</p>
                  </div>
                )
              })}
            </div>
            
            {insights && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Next Best Action:</strong> {insights.nextBestAction}
                  </p>
                  {insights.nextStatus && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Next level: {insights.nextStatus.replace('_', ' ').toUpperCase()}
                    </p>
                  )}
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${insights.progressToNext}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Engagement: {engagementScore} points</span>
                  <span>Conversion Ready: {Math.round(insights.conversionProbability * 100)}%</span>
                </div>
                
                {insights.recommendations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recommendations:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {insights.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-1 h-1 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Accessible Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Available Tools ({accessibleTools.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessibleTools.map((tool, index) => {
              const IconComponent = tool.icon

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full p-8 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${
                          tool.accessLevel === 'public' ? 'text-green-600 border-green-600' :
                          tool.accessLevel === 'cold_lead' ? 'text-blue-600 border-blue-600' :
                          tool.accessLevel === 'candidate' ? 'text-purple-600 border-purple-600' :
                          'text-red-600 border-red-600'
                        }`}>
                          {tool.accessLevel === 'public' ? 'FREE' :
                           tool.accessLevel === 'cold_lead' ? 'COLD LEAD' :
                           tool.accessLevel === 'candidate' ? 'CANDIDATE' :
                           'HOT LEAD'}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {tool.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tool.estimatedTime}
                      </div>
                      <Badge variant="secondary">{tool.difficulty}</Badge>
                    </div>
                    
                    <div className="mb-6">
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                    </div>

                    <Link href={`/tools/${tool.id}`}>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => {
                          // Track tool usage with comprehensive lead scoring
                          trackToolUsage(tool.id, tool.title).catch(console.error)
                        }}
                      >
                        Start Assessment
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Locked Tools Preview */}
        {lockedTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Unlock More Tools ({lockedTools.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lockedTools.map((tool, index) => {
                const IconComponent = tool.icon
                
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full p-8 bg-gray-50 dark:bg-gray-900 opacity-75 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="p-4 rounded-2xl bg-gray-400 dark:bg-gray-600 text-white shadow-lg">
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-gray-500 border-gray-400">
                              <Lock className="w-3 h-3 mr-1" />
                              LOCKED
                            </Badge>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-gray-700 dark:text-gray-300">
                          {tool.title}
                        </h3>
                        
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {tool.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {tool.estimatedTime}
                          </div>
                          <Badge variant="secondary" className="bg-gray-200 text-gray-600">{tool.difficulty}</Badge>
                        </div>
                        
                        <div className="mb-6">
                          <Badge variant="outline" className="text-xs text-gray-500">
                            {tool.category}
                          </Badge>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 mb-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unlock Requirement:
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {tool.unlockCriteria}
                          </p>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full cursor-not-allowed opacity-60"
                          disabled
                        >
                          <Lock className="mr-2 w-4 h-4" />
                          Locked
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              <h3 className="text-3xl font-bold mb-4">
                Unlock All Premium Tools
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands who have discovered their potential through our complete assessment suite
              </p>
              <Link href="/auth/register">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  <Star className="mr-2 w-5 h-5" />
                  Get Full Access Now
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
        </div>
      </div>
    </PublicLayout>
  )
}