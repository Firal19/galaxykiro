'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { useAppStore, useUser } from '../lib/store'
import { engagementEngine, type UserBehavior, type EngagementLevel } from '../lib/engagement-engine'
import { trackingService } from '../lib/tracking'
// import { useDynamicPersonalization, useCTAOptimization } from '../lib/hooks/use-dynamic-personalization'

// CTA hierarchy types
export type CTACommitmentLevel = 'micro' | 'midi' | 'macro'
export type CTATrigger = 'curiosity' | 'urgency' | 'social-proof' | 'personalization' | 'scarcity'

// CTA configuration interface
export interface CTAConfig {
  id: string
  text: string
  description?: string
  commitmentLevel: CTACommitmentLevel
  triggers: CTATrigger[]
  action: string
  priority: number
  conditions: {
    minEngagementScore?: number
    maxEngagementScore?: number
    requiredBehaviorPattern?: string[]
    requiredTier?: string[]
    minTimeOnPage?: number
    requiredSections?: string[]
    excludeIfCompleted?: string[]
  }
  styling: {
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
  }
  abTest?: {
    variant: string
    weight: number
  }
}

// Predefined CTA configurations
const CTA_CONFIGS: CTAConfig[] = [
  // Micro CTAs (Low Commitment)
  {
    id: 'see-your-score',
    text: 'See Your Score',
    description: 'Quick 2-minute assessment',
    commitmentLevel: 'micro',
    triggers: ['curiosity'],
    action: 'open-assessment',
    priority: 10,
    conditions: {
      maxEngagementScore: 30,
      minTimeOnPage: 30,
    },
    styling: {
      variant: 'outline',
      size: 'sm',
      className: 'border-blue-200 hover:border-blue-400 text-blue-600'
    }
  },
  {
    id: 'get-the-answer',
    text: 'Get the Answer',
    description: 'Discover what\'s holding you back',
    commitmentLevel: 'micro',
    triggers: ['curiosity'],
    action: 'reveal-insight',
    priority: 9,
    conditions: {
      maxEngagementScore: 25,
      requiredSections: ['success-gap', 'change-paradox'],
    },
    styling: {
      variant: 'ghost',
      size: 'sm',
      className: 'text-purple-600 hover:text-purple-800'
    }
  },
  {
    id: 'calculate-now',
    text: 'Calculate Now',
    description: 'Free instant results',
    commitmentLevel: 'micro',
    triggers: ['curiosity', 'urgency'],
    action: 'open-calculator',
    priority: 8,
    conditions: {
      maxEngagementScore: 35,
      requiredBehaviorPattern: ['explorer', 'action-taker'],
    },
    styling: {
      variant: 'secondary',
      size: 'default',
      className: 'bg-green-50 hover:bg-green-100 text-green-700'
    }
  },
  {
    id: 'save-for-later',
    text: 'Save for Later',
    description: 'Bookmark this assessment',
    commitmentLevel: 'micro',
    triggers: ['personalization'],
    action: 'save-progress',
    priority: 5,
    conditions: {
      minTimeOnPage: 120,
      requiredBehaviorPattern: ['researcher', 'skeptic'],
    },
    styling: {
      variant: 'ghost',
      size: 'sm',
      className: 'text-gray-600 hover:text-gray-800'
    }
  },

  // Midi CTAs (Medium Commitment)
  {
    id: 'get-personalized-report',
    text: 'Get Your Personalized Report',
    description: 'Detailed insights + action plan',
    commitmentLevel: 'midi',
    triggers: ['personalization', 'social-proof'],
    action: 'generate-report',
    priority: 15,
    conditions: {
      minEngagementScore: 30,
      maxEngagementScore: 70,
      requiredBehaviorPattern: ['researcher', 'action-taker'],
    },
    styling: {
      variant: 'default',
      size: 'default',
      className: 'bg-blue-600 hover:bg-blue-700'
    }
  },
  {
    id: 'join-free-webinar',
    text: 'Join Free Webinar',
    description: '90-min live training + Q&A',
    commitmentLevel: 'midi',
    triggers: ['social-proof', 'urgency'],
    action: 'register-webinar',
    priority: 14,
    conditions: {
      minEngagementScore: 25,
      maxEngagementScore: 65,
      minTimeOnPage: 180,
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-purple-600 hover:bg-purple-700'
    }
  },
  {
    id: 'download-guide',
    text: 'Download the Guide',
    description: 'Complete transformation roadmap',
    commitmentLevel: 'midi',
    triggers: ['personalization'],
    action: 'download-resource',
    priority: 12,
    conditions: {
      minEngagementScore: 35,
      requiredBehaviorPattern: ['researcher'],
      requiredSections: ['vision-void', 'leadership-lever'],
    },
    styling: {
      variant: 'outline',
      size: 'default',
      className: 'border-green-300 hover:border-green-500 text-green-700'
    }
  },
  {
    id: 'start-7-day-challenge',
    text: 'Start Your 7-Day Challenge',
    description: 'Daily actions for breakthrough results',
    commitmentLevel: 'midi',
    triggers: ['urgency', 'social-proof'],
    action: 'join-challenge',
    priority: 13,
    conditions: {
      minEngagementScore: 40,
      requiredBehaviorPattern: ['action-taker', 'explorer'],
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-orange-600 hover:bg-orange-700'
    }
  },

  // Macro CTAs (High Commitment)
  {
    id: 'book-breakthrough-session',
    text: 'Book Your Breakthrough Session',
    description: 'Personal 1-on-1 consultation',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'scarcity'],
    action: 'schedule-consultation',
    priority: 20,
    conditions: {
      minEngagementScore: 70,
      requiredTier: ['soft-member'],
      requiredBehaviorPattern: ['action-taker'],
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-red-600 hover:bg-red-700 text-white font-semibold'
    }
  },
  {
    id: 'visit-our-office',
    text: 'Visit Our Office',
    description: 'In-person consultation in Addis Ababa',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'social-proof'],
    action: 'schedule-office-visit',
    priority: 18,
    conditions: {
      minEngagementScore: 60,
      requiredTier: ['engaged', 'soft-member'],
    },
    styling: {
      variant: 'outline',
      size: 'lg',
      className: 'border-red-300 hover:border-red-500 text-red-700 font-medium'
    }
  },
  {
    id: 'apply-for-program',
    text: 'Apply for the Program',
    description: 'Exclusive transformation program',
    commitmentLevel: 'macro',
    triggers: ['scarcity', 'social-proof'],
    action: 'apply-program',
    priority: 19,
    conditions: {
      minEngagementScore: 80,
      requiredTier: ['soft-member'],
      minTimeOnPage: 600,
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold'
    }
  },
  {
    id: 'transform-your-life',
    text: 'Transform Your Life',
    description: 'Complete life transformation system',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'urgency'],
    action: 'full-transformation',
    priority: 17,
    conditions: {
      minEngagementScore: 75,
      requiredBehaviorPattern: ['action-taker'],
      requiredSections: ['decision-door'],
    },
    styling: {
      variant: 'default',
      size: 'lg',
      className: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold'
    }
  }
]

// Props for DynamicCTA component
interface DynamicCTAProps {
  context?: string
  maxCTAs?: number
  layout?: 'horizontal' | 'vertical' | 'grid'
  showDescription?: boolean
  showBadges?: boolean
  className?: string
  onCTAClick?: (ctaId: string, action: string) => void
}

export function DynamicCTA({
  context = 'general',
  maxCTAs = 3,
  layout = 'vertical',
  showDescription = true,
  showBadges = true,
  className = '',
  onCTAClick
}: DynamicCTAProps) {
  const user = useUser()
  const { journey, trackCTAClick } = useAppStore()
  
  const [behavior, setBehavior] = useState<UserBehavior | null>(null)
  const [engagement, setEngagement] = useState<EngagementLevel | null>(null)
  const [selectedCTAs, setSelectedCTAs] = useState<CTAConfig[]>([])
  const [abTestVariants, setAbTestVariants] = useState<Map<string, string>>(new Map())

  // Update behavior and engagement data
  useEffect(() => {
    const updateEngagementData = () => {
      const currentBehavior = engagementEngine.getCurrentBehavior()
      const engagementScore = engagementEngine.calculateEngagementScore(currentBehavior)
      const currentEngagement = engagementEngine.determineEngagementLevel(engagementScore, currentBehavior)
      
      setBehavior(currentBehavior)
      setEngagement(currentEngagement)
    }

    updateEngagementData()
    
    // Update every 30 seconds
    const interval = setInterval(updateEngagementData, 30000)
    
    return () => clearInterval(interval)
  }, [journey])

  // Select appropriate CTAs based on user behavior and engagement
  const filteredCTAs = useMemo(() => {
    if (!behavior || !engagement) return []

    const validCTAs = CTA_CONFIGS.filter(cta => {
      const conditions = cta.conditions

      // Check engagement score range
      if (conditions.minEngagementScore && engagement.score < conditions.minEngagementScore) {
        return false
      }
      if (conditions.maxEngagementScore && engagement.score > conditions.maxEngagementScore) {
        return false
      }

      // Check behavior pattern
      if (conditions.requiredBehaviorPattern && 
          !conditions.requiredBehaviorPattern.includes(engagement.behaviorPattern)) {
        return false
      }

      // Check tier requirement
      if (conditions.requiredTier && 
          !conditions.requiredTier.includes(engagement.tier)) {
        return false
      }

      // Check time on page
      if (conditions.minTimeOnPage && 
          behavior.sessionDuration < conditions.minTimeOnPage) {
        return false
      }

      // Check required sections
      if (conditions.requiredSections && 
          !conditions.requiredSections.some(section => behavior.sectionsViewed.includes(section))) {
        return false
      }

      // Check exclusions
      if (conditions.excludeIfCompleted && 
          conditions.excludeIfCompleted.some(item => behavior.toolsUsed.includes(item))) {
        return false
      }

      return true
    })

    // Sort by priority and select top CTAs
    return validCTAs
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxCTAs)
  }, [behavior, engagement, maxCTAs])

  // Handle A/B testing for CTAs
  useEffect(() => {
    const variants = new Map<string, string>()
    
    filteredCTAs.forEach(cta => {
      if (cta.abTest) {
        // Simple A/B test logic - could be enhanced with proper testing framework
        const variant = Math.random() < cta.abTest.weight ? cta.abTest.variant : 'control'
        variants.set(cta.id, variant)
      }
    })
    
    setAbTestVariants(variants)
    setSelectedCTAs(filteredCTAs)
  }, [filteredCTAs])

  // Handle CTA click
  const handleCTAClick = async (cta: CTAConfig) => {
    try {
      // Track the click
      trackCTAClick(cta.id)
      
      // Track in external service
      await trackingService.trackCTAClick(cta.id, cta.commitmentLevel, user?.id, {
        context,
        engagementScore: engagement?.score,
        behaviorPattern: engagement?.behaviorPattern,
        abTestVariant: abTestVariants.get(cta.id) || 'control'
      })

      // Execute the action
      await executeCTAAction(cta.action, cta.id)
      
      // Call custom handler if provided
      if (onCTAClick) {
        onCTAClick(cta.id, cta.action)
      }
    } catch (error) {
      console.error('Error handling CTA click:', error)
    }
  }

  // Execute CTA action
  const executeCTAAction = async (action: string, ctaId: string) => {
    const { setActiveModal } = useAppStore.getState()
    
    switch (action) {
      case 'open-assessment':
        setActiveModal('potential-assessment')
        break
      case 'reveal-insight':
        setActiveModal('insight-reveal')
        break
      case 'open-calculator':
        setActiveModal('success-calculator')
        break
      case 'save-progress':
        // Save current progress to localStorage
        localStorage.setItem('gdt_saved_progress', JSON.stringify({
          timestamp: Date.now(),
          journey: journey,
          ctaId
        }))
        // Show confirmation
        setActiveModal('progress-saved')
        break
      case 'generate-report':
        setActiveModal('personalized-report')
        break
      case 'register-webinar':
        setActiveModal('webinar-registration')
        break
      case 'download-resource':
        setActiveModal('resource-download')
        break
      case 'join-challenge':
        setActiveModal('challenge-signup')
        break
      case 'schedule-consultation':
        setActiveModal('consultation-booking')
        break
      case 'schedule-office-visit':
        setActiveModal('office-visit-booking')
        break
      case 'apply-program':
        setActiveModal('program-application')
        break
      case 'full-transformation':
        setActiveModal('transformation-program')
        break
      default:
        console.warn(`Unknown CTA action: ${action}`)
    }
  }

  // Get trigger badges for display
  const getTriggerBadges = (triggers: CTATrigger[]) => {
    const badgeStyles: { [key in CTATrigger]: string } = {
      curiosity: 'bg-blue-100 text-blue-800',
      urgency: 'bg-red-100 text-red-800',
      'social-proof': 'bg-green-100 text-green-800',
      personalization: 'bg-purple-100 text-purple-800',
      scarcity: 'bg-orange-100 text-orange-800'
    }

    return triggers.map(trigger => (
      <Badge 
        key={trigger} 
        className={`text-xs ${badgeStyles[trigger]}`}
      >
        {trigger.replace('-', ' ')}
      </Badge>
    ))
  }

  // Get layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-row gap-4 flex-wrap'
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'vertical':
      default:
        return 'flex flex-col gap-4'
    }
  }

  if (!behavior || !engagement || selectedCTAs.length === 0) {
    return null
  }

  return (
    <div className={`dynamic-cta-container ${className}`}>
      <div className={getLayoutClasses()}>
        {selectedCTAs.map((cta) => (
          <Card 
            key={cta.id} 
            className="p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="space-y-3">
              {showBadges && (
                <div className="flex flex-wrap gap-1">
                  {getTriggerBadges(cta.triggers)}
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {cta.commitmentLevel}
                  </Badge>
                </div>
              )}
              
              <div>
                <Button
                  variant={cta.styling.variant}
                  size={cta.styling.size}
                  className={`w-full ${cta.styling.className || ''}`}
                  onClick={() => handleCTAClick(cta)}
                >
                  {cta.text}
                </Button>
                
                {showDescription && cta.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {cta.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <div>Engagement: {engagement.score} ({engagement.level})</div>
          <div>Pattern: {engagement.behaviorPattern}</div>
          <div>Tier: {engagement.tier}</div>
          <div>Time: {behavior.sessionDuration}s</div>
          <div>Sections: {behavior.sectionsViewed.join(', ')}</div>
        </div>
      )}
    </div>
  )
}

// Hook for using dynamic CTA logic in other components
export function useDynamicCTA() {
  const user = useUser()

  const getCurrentRecommendation = () => {
    const behavior = engagementEngine.getCurrentBehavior()
    const engagementScore = engagementEngine.calculateEngagementScore(behavior)
    const engagement = engagementEngine.determineEngagementLevel(engagementScore, behavior)
    
    return {
      behavior,
      engagement,
      insights: engagementEngine.getEngagementInsights(),
      recommendedCTAs: CTA_CONFIGS
        .filter(cta => {
          const conditions = cta.conditions
          return (!conditions.minEngagementScore || engagement.score >= conditions.minEngagementScore) &&
                 (!conditions.maxEngagementScore || engagement.score <= conditions.maxEngagementScore)
        })
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 3)
    }
  }

  return {
    getCurrentRecommendation,
    trackCTAInteraction: (ctaId: string, action: string) => {
      trackingService.trackCTAClick(ctaId, 'dynamic', user?.id, { action })
    }
  }
}

export default DynamicCTA