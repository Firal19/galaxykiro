'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { useAppStore, useUser } from '../lib/store'
import { engagementEngine, type UserBehavior, type EngagementLevel } from '../lib/engagement-engine'
import { trackingService } from '../lib/tracking'
import { useABTest, abTestingService } from '../lib/ab-testing-framework'
import { usePsychologicalTriggers, psychologicalTriggersService, type PsychologicalTrigger } from '../lib/psychological-triggers'

// Enhanced CTA Types
export type CTACommitmentLevel = 'micro' | 'midi' | 'macro'
export type CTATrigger = 'curiosity' | 'urgency' | 'social-proof' | 'personalization' | 'scarcity'

export interface EnhancedCTAConfig {
  id: string
  text: string
  description?: string
  commitmentLevel: CTACommitmentLevel
  triggers: CTATrigger[]
  action: string
  priority: number
  abTestId?: string
  psychologicalTriggers: PsychologicalTrigger[]
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
  variants?: {
    [key: string]: {
      text?: string
      description?: string
      styling?: Partial<EnhancedCTAConfig['styling']>
    }
  }
}

// Enhanced CTA Configurations with A/B Testing and Psychological Triggers
const ENHANCED_CTA_CONFIGS: EnhancedCTAConfig[] = [
  // Micro CTAs (Low Commitment)
  {
    id: 'see-your-score',
    text: 'See Your Score',
    description: 'Quick 2-minute assessment',
    commitmentLevel: 'micro',
    triggers: ['curiosity'],
    psychologicalTriggers: ['curiosity'],
    action: 'open-assessment',
    priority: 10,
    abTestId: 'cta-copy-test',
    conditions: {
      maxEngagementScore: 30,
      minTimeOnPage: 30,
    },
    styling: {
      variant: 'outline',
      size: 'sm',
      className: 'border-blue-200 hover:border-blue-400 text-blue-600'
    },
    variants: {
      control: {
        text: 'See Your Score',
        description: 'Quick 2-minute assessment'
      },
      curiosity: {
        text: 'Discover Your Hidden Potential',
        description: 'What if you\'re only using 10% of your abilities?'
      },
      urgency: {
        text: 'Get Your Score Now',
        description: 'Limited time - see your results instantly'
      },
      'social-proof': {
        text: 'Join 10,000+ Who Discovered Their Score',
        description: 'See why thousands trust our assessment'
      }
    }
  },
  {
    id: 'get-the-answer',
    text: 'Get the Answer',
    description: 'Discover what\'s holding you back',
    commitmentLevel: 'micro',
    triggers: ['curiosity'],
    psychologicalTriggers: ['curiosity', 'loss-aversion'],
    action: 'reveal-insight',
    priority: 9,
    abTestId: 'cta-color-test',
    conditions: {
      maxEngagementScore: 25,
      requiredSections: ['success-gap', 'change-paradox'],
    },
    styling: {
      variant: 'ghost',
      size: 'sm',
      className: 'text-purple-600 hover:text-purple-800'
    },
    variants: {
      control: {
        styling: { className: 'bg-blue-600 hover:bg-blue-700 text-white' }
      },
      'variant-a': {
        styling: { className: 'bg-orange-600 hover:bg-orange-700 text-white' }
      },
      'variant-b': {
        styling: { className: 'bg-green-600 hover:bg-green-700 text-white' }
      }
    }
  },
  {
    id: 'calculate-now',
    text: 'Calculate Now',
    description: 'Free instant results',
    commitmentLevel: 'micro',
    triggers: ['curiosity', 'urgency'],
    psychologicalTriggers: ['urgency', 'curiosity'],
    action: 'open-calculator',
    priority: 8,
    abTestId: 'cta-timing-test',
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
    psychologicalTriggers: ['reciprocity', 'commitment'],
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
    psychologicalTriggers: ['personalization', 'authority'],
    action: 'generate-report',
    priority: 15,
    abTestId: 'cta-placement-test',
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
    psychologicalTriggers: ['social-proof', 'scarcity', 'reciprocity'],
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
    psychologicalTriggers: ['reciprocity', 'authority'],
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
    description: 'Daily actions for transformation results',
    commitmentLevel: 'midi',
    triggers: ['urgency', 'social-proof'],
    psychologicalTriggers: ['commitment', 'social-proof'],
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
    id: 'book-transformation-session',
    text: 'Book Your Transformation Session',
    description: 'Personal 1-on-1 consultation',
    commitmentLevel: 'macro',
    triggers: ['personalization', 'scarcity'],
    psychologicalTriggers: ['scarcity', 'authority', 'personalization'],
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
    psychologicalTriggers: ['authority', 'social-proof'],
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
    psychologicalTriggers: ['scarcity', 'authority', 'social-proof'],
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
    psychologicalTriggers: ['loss-aversion', 'commitment', 'personalization'],
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

// Props for EnhancedCTA component
interface EnhancedCTAProps {
  context?: string
  maxCTAs?: number
  layout?: 'horizontal' | 'vertical' | 'grid'
  showDescription?: boolean
  showBadges?: boolean
  showPsychologicalTriggers?: boolean
  enableABTesting?: boolean
  className?: string
  onCTAClick?: (ctaId: string, action: string, variant?: string) => void
}

export function EnhancedCTA({
  context = 'general',
  maxCTAs = 3,
  layout = 'vertical',
  showDescription = true,
  showBadges = true,
  showPsychologicalTriggers = false,
  enableABTesting = true,
  className = '',
  onCTAClick
}: EnhancedCTAProps) {
  const user = useUser()
  const { journey, trackCTAClick } = useAppStore()
  
  const [behavior, setBehavior] = useState<UserBehavior | null>(null)
  const [engagement, setEngagement] = useState<EngagementLevel | null>(null)
  const [selectedCTAs, setSelectedCTAs] = useState<EnhancedCTAConfig[]>([])
  const [ctaVariants, setCTAVariants] = useState<Map<string, string>>(new Map())

  // Get psychological triggers for current context
  const {
    triggers: psychTriggers,
    activeTrigger,
    trackDisplay,
    trackInteraction,
    getPersonalizedContent
  } = usePsychologicalTriggers(
    context,
    engagement?.tier || 'browser',
    engagement?.score || 0,
    engagement?.behaviorPattern || 'explorer',
    behavior?.sectionsViewed || [],
    behavior?.toolsUsed || [],
    behavior?.sessionDuration || 0,
    user?.id
  )

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

    const validCTAs = ENHANCED_CTA_CONFIGS.filter(cta => {
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
    if (!enableABTesting || !user?.id) {
      setSelectedCTAs(filteredCTAs)
      return
    }

    const variants = new Map<string, string>()
    
    filteredCTAs.forEach(cta => {
      if (cta.abTestId) {
        const variant = abTestingService.getUserVariant(user.id, cta.abTestId)
        if (variant) {
          variants.set(cta.id, variant)
          // Track impression
          abTestingService.trackImpression(user.id, cta.abTestId, variant)
        }
      }
    })
    
    setCTAVariants(variants)
    setSelectedCTAs(filteredCTAs)
  }, [filteredCTAs, enableABTesting, user?.id])

  // Get CTA configuration with A/B test variant applied
  const getCTAWithVariant = useCallback((cta: EnhancedCTAConfig): EnhancedCTAConfig => {
    const variant = ctaVariants.get(cta.id)
    if (!variant || !cta.variants || !cta.variants[variant]) {
      return cta
    }

    const variantConfig = cta.variants[variant]
    return {
      ...cta,
      text: variantConfig.text || cta.text,
      description: variantConfig.description || cta.description,
      styling: {
        ...cta.styling,
        ...variantConfig.styling
      }
    }
  }, [ctaVariants])

  // Handle CTA click
  const handleCTAClick = async (cta: EnhancedCTAConfig) => {
    try {
      const variant = ctaVariants.get(cta.id) || 'control'
      
      // Track the click
      trackCTAClick(cta.id)
      
      // Track A/B test click
      if (enableABTesting && user?.id && cta.abTestId) {
        abTestingService.trackClick(user.id, cta.abTestId, variant)
      }
      
      // Track psychological trigger interaction
      cta.psychologicalTriggers.forEach(trigger => {
        const triggerConfig = psychTriggers.find(t => t.type === trigger)
        if (triggerConfig) {
          trackInteraction(triggerConfig, 'click')
        }
      })
      
      // Track in external service
      await trackingService.trackCTAClick(cta.id, cta.commitmentLevel, user?.id, {
        context,
        engagementScore: engagement?.score,
        behaviorPattern: engagement?.behaviorPattern,
        abTestVariant: variant,
        psychologicalTriggers: cta.psychologicalTriggers
      })

      // Execute the action
      await executeCTAAction(cta.action, cta.id)
      
      // Track conversion for A/B test
      if (enableABTesting && user?.id && cta.abTestId) {
        abTestingService.trackConversion(user.id, cta.abTestId, variant)
      }
      
      // Call custom handler if provided
      if (onCTAClick) {
        onCTAClick(cta.id, cta.action, variant)
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
        localStorage.setItem('gdt_saved_progress', JSON.stringify({
          timestamp: Date.now(),
          journey: journey,
          ctaId
        }))
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

  // Get psychological trigger badges
  const getPsychologicalTriggerBadges = (triggers: PsychologicalTrigger[]) => {
    const badgeStyles: { [key in PsychologicalTrigger]: string } = {
      curiosity: 'bg-blue-50 text-blue-700 border-blue-200',
      urgency: 'bg-red-50 text-red-700 border-red-200',
      'social-proof': 'bg-green-50 text-green-700 border-green-200',
      personalization: 'bg-purple-50 text-purple-700 border-purple-200',
      scarcity: 'bg-orange-50 text-orange-700 border-orange-200',
      authority: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      reciprocity: 'bg-pink-50 text-pink-700 border-pink-200',
      commitment: 'bg-teal-50 text-teal-700 border-teal-200',
      'loss-aversion': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      anchoring: 'bg-gray-50 text-gray-700 border-gray-200'
    }

    return triggers.map(trigger => (
      <Badge 
        key={trigger} 
        variant="outline"
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
    <div className={`enhanced-cta-container ${className}`}>
      <div className={getLayoutClasses()}>
        {selectedCTAs.map((cta) => {
          const ctaWithVariant = getCTAWithVariant(cta)
          const variant = ctaVariants.get(cta.id) || 'control'
          
          return (
            <Card 
              key={cta.id} 
              className="p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500"
            >
              <div className="space-y-3">
                {(showBadges || showPsychologicalTriggers) && (
                  <div className="flex flex-wrap gap-1">
                    {showBadges && getTriggerBadges(cta.triggers)}
                    {showPsychologicalTriggers && getPsychologicalTriggerBadges(cta.psychologicalTriggers)}
                    <Badge className="bg-gray-100 text-gray-800 text-xs">
                      {cta.commitmentLevel}
                    </Badge>
                    {enableABTesting && variant !== 'control' && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        {variant}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div>
                  <Button
                    variant={ctaWithVariant.styling.variant}
                    size={ctaWithVariant.styling.size}
                    className={`w-full transition-all duration-200 ${ctaWithVariant.styling.className || ''}`}
                    onClick={() => handleCTAClick(cta)}
                  >
                    {ctaWithVariant.text}
                  </Button>
                  
                  {showDescription && ctaWithVariant.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {ctaWithVariant.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      
      {/* Active Psychological Trigger Display */}
      {activeTrigger && showPsychologicalTriggers && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">{activeTrigger.content.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                {getPersonalizedContent(activeTrigger).text}
              </p>
              {activeTrigger.content.subtext && (
                <p className="text-xs text-gray-600">
                  {getPersonalizedContent(activeTrigger).subtext}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs space-y-1">
          <div>Engagement: {engagement.score} ({engagement.level})</div>
          <div>Pattern: {engagement.behaviorPattern}</div>
          <div>Tier: {engagement.tier}</div>
          <div>Time: {behavior.sessionDuration}s</div>
          <div>Sections: {behavior.sectionsViewed.join(', ')}</div>
          <div>Active Triggers: {psychTriggers.length}</div>
          <div>A/B Tests: {Array.from(ctaVariants.entries()).map(([id, variant]) => `${id}:${variant}`).join(', ')}</div>
        </div>
      )}
    </div>
  )
}

// Hook for using enhanced CTA logic
export function useEnhancedCTA() {
  const user = useUser()

  const getCurrentRecommendation = () => {
    const behavior = engagementEngine.getCurrentBehavior()
    const engagementScore = engagementEngine.calculateEngagementScore(behavior)
    const engagement = engagementEngine.determineEngagementLevel(engagementScore, behavior)
    
    return {
      behavior,
      engagement,
      insights: engagementEngine.getEngagementInsights(),
      recommendedCTAs: ENHANCED_CTA_CONFIGS
        .filter(cta => {
          const conditions = cta.conditions
          return (!conditions.minEngagementScore || engagement.score >= conditions.minEngagementScore) &&
                 (!conditions.maxEngagementScore || engagement.score <= conditions.maxEngagementScore)
        })
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 3)
    }
  }

  const trackCTAInteraction = (ctaId: string, action: string, variant?: string) => {
    trackingService.trackCTAClick(ctaId, 'enhanced', user?.id, { 
      action, 
      variant,
      timestamp: Date.now()
    })
  }

  return {
    getCurrentRecommendation,
    trackCTAInteraction,
    getABTestResults: (testId: string) => abTestingService.getTestResults(testId),
    getTriggerAnalytics: () => psychologicalTriggersService.getTriggerAnalytics()
  }
}

export default EnhancedCTA