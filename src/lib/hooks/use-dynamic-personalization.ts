'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAppStore, useUser, useLeadScore } from '../store'
import { engagementEngine, type UserBehavior, type EngagementLevel } from '../engagement-engine'
import { personalizationEngine, type PersonalizationContext, type ContentItem } from '../personalization-engine'
import { behavioralTriggerSystem, type CommitmentEscalation } from '../behavioral-triggers'
import { abTestingSystem, useABTest } from '../ab-testing'

// Hook return type
export interface DynamicPersonalizationData {
  // Current user state
  behavior: UserBehavior | null
  engagement: EngagementLevel | null
  commitmentEscalation: CommitmentEscalation | null
  
  // Personalized content
  recommendedContent: ContentItem[]
  nextBestContent: ContentItem[]
  personalizedInsights: {
    primaryInterest: string
    recommendedContent: string[]
    nextBestAction: string
    personalizedMessage: string
  } | null
  
  // Dynamic CTAs
  optimalCTAs: any[]
  currentCTAConfig: any
  
  // A/B testing
  abTests: {
    ctaColors: any
    ctaCopy: any
    modalTiming: any
    personalization: any
  }
  
  // Actions
  trackEngagement: (type: string, data?: any) => Promise<void>
  trackConversion: (goalId: string, value?: number) => Promise<void>
  updatePersonalization: () => Promise<void>
  triggerBehavioralAction: (action: string, data?: any) => Promise<void>
}

// Configuration options
export interface PersonalizationConfig {
  enableABTesting?: boolean
  enableBehavioralTriggers?: boolean
  maxRecommendations?: number
  updateInterval?: number // seconds
  trackingEnabled?: boolean
}

export function useDynamicPersonalization(
  config: PersonalizationConfig = {}
): DynamicPersonalizationData {
  const {
    enableABTesting = true,
    enableBehavioralTriggers = true,
    maxRecommendations = 5,
    updateInterval = 30,
    trackingEnabled = true
  } = config

  const user = useUser()
  const leadScore = useLeadScore()
  const { journey, trackCTAClick, trackInteraction } = useAppStore()

  // State for personalization data
  const [behavior, setBehavior] = useState<UserBehavior | null>(null)
  const [engagement, setEngagement] = useState<EngagementLevel | null>(null)
  const [commitmentEscalation, setCommitmentEscalation] = useState<CommitmentEscalation | null>(null)
  const [recommendedContent, setRecommendedContent] = useState<ContentItem[]>([])
  const [nextBestContent, setNextBestContent] = useState<ContentItem[]>([])
  const [personalizedInsights, setPersonalizedInsights] = useState<any>(null)
  const [optimalCTAs, setOptimalCTAs] = useState<any[]>([])

  // A/B testing hooks
  const ctaColorsTest = useABTest('cta-colors-test')
  const ctaCopyTest = useABTest('cta-copy-test')
  const modalTimingTest = useABTest('modal-timing-test')
  const personalizationTest = useABTest('personalization-test')

  // Update engagement data
  const updateEngagementData = useCallback(async () => {
    try {
      const currentBehavior = engagementEngine.getCurrentBehavior()
      const engagementScore = engagementEngine.calculateEngagementScore(currentBehavior)
      const currentEngagement = engagementEngine.determineEngagementLevel(engagementScore, currentBehavior)
      
      setBehavior(currentBehavior)
      setEngagement(currentEngagement)

      // Update commitment escalation
      const escalation = behavioralTriggerSystem.getCommitmentEscalation(currentBehavior, currentEngagement)
      setCommitmentEscalation(escalation)

      // Get personalized insights
      const insights = engagementEngine.getEngagementInsights()
      setPersonalizedInsights(insights)

      // Update personalized content recommendations
      if (currentBehavior && currentEngagement) {
        const context: PersonalizationContext = {
          userId: user?.id,
          behavior: currentBehavior,
          engagement: currentEngagement,
          preferences: personalizationEngine.inferUserPreferences(
            currentBehavior,
            currentEngagement,
            {
              viewed: journey.contentConsumed,
              completed: [], // This would come from your completion tracking
              shared: [],
              bookmarked: [],
              timeSpent: journey.timeOnPage,
              engagementScores: {}
            }
          ),
          history: {
            viewed: journey.contentConsumed,
            completed: [],
            shared: [],
            bookmarked: [],
            timeSpent: journey.timeOnPage,
            engagementScores: {}
          },
          currentContext: 'dynamic-personalization',
          timeOfDay: currentBehavior.timeOfDay,
          deviceType: currentBehavior.deviceType
        }

        const recommendations = personalizationEngine.getPersonalizedRecommendations(
          context,
          maxRecommendations
        )
        setRecommendedContent(recommendations)

        // Get next best content if user has consumed content
        if (journey.contentConsumed.length > 0) {
          const lastContent = journey.contentConsumed[journey.contentConsumed.length - 1]
          const nextContent = personalizationEngine.getNextBestContent(lastContent, context, 3)
          setNextBestContent(nextContent)
        }
      }

      // Check behavioral triggers if enabled
      if (enableBehavioralTriggers && currentBehavior && currentEngagement) {
        const triggers = engagementEngine.checkBehaviorTriggers(currentBehavior, currentEngagement)
        // Triggers are handled automatically by the behavioral trigger system
      }

    } catch (error) {
      console.error('Error updating engagement data:', error)
    }
  }, [user?.id, journey, maxRecommendations, enableBehavioralTriggers])

  // Update personalization data periodically
  useEffect(() => {
    updateEngagementData()
    
    const interval = setInterval(updateEngagementData, updateInterval * 1000)
    
    return () => clearInterval(interval)
  }, [updateEngagementData, updateInterval])

  // Track engagement function
  const trackEngagement = useCallback(async (type: string, data?: any) => {
    if (!trackingEnabled) return

    try {
      await trackInteraction(type, data)
      
      // Update engagement data after tracking
      setTimeout(updateEngagementData, 1000)
    } catch (error) {
      console.error('Error tracking engagement:', error)
    }
  }, [trackInteraction, trackingEnabled, updateEngagementData])

  // Track conversion function
  const trackConversion = useCallback(async (goalId: string, value?: number) => {
    if (!trackingEnabled || !enableABTesting) return

    try {
      // Track conversions for all active A/B tests
      await Promise.all([
        ctaColorsTest.trackConversion(goalId, value),
        ctaCopyTest.trackConversion(goalId, value),
        modalTimingTest.trackConversion(goalId, value),
        personalizationTest.trackConversion(goalId, value)
      ])
    } catch (error) {
      console.error('Error tracking conversion:', error)
    }
  }, [trackingEnabled, enableABTesting, ctaColorsTest, ctaCopyTest, modalTimingTest, personalizationTest])

  // Update personalization function
  const updatePersonalization = useCallback(async () => {
    await updateEngagementData()
  }, [updateEngagementData])

  // Trigger behavioral action
  const triggerBehavioralAction = useCallback(async (action: string, data?: any) => {
    if (!enableBehavioralTriggers) return

    try {
      await behavioralTriggerSystem.checkActionBasedTrigger(action, data)
      
      // Track the action
      await trackEngagement('behavioral_action', { action, data })
    } catch (error) {
      console.error('Error triggering behavioral action:', error)
    }
  }, [enableBehavioralTriggers, trackEngagement])

  // Get optimal CTAs based on current state
  const getOptimalCTAs = useCallback(() => {
    if (!behavior || !engagement) return []

    // This would integrate with your CTA optimization logic
    // For now, return a simplified version
    const ctaRecommendations = [
      {
        id: 'primary-cta',
        text: personalizedInsights?.nextBestAction || 'Discover Your Potential',
        priority: engagement.score,
        commitmentLevel: commitmentEscalation?.currentLevel || 'micro'
      }
    ]

    return ctaRecommendations
  }, [behavior, engagement, personalizedInsights, commitmentEscalation])

  // Update optimal CTAs when dependencies change
  useEffect(() => {
    const ctaRecommendations = getOptimalCTAs()
    setOptimalCTAs(ctaRecommendations)
  }, [getOptimalCTAs])

  // Get current CTA configuration with A/B testing
  const currentCTAConfig = useMemo(() => {
    if (!enableABTesting) {
      return {
        buttonColor: '#3B82F6',
        textColor: '#FFFFFF',
        buttonText: 'Discover Your Potential'
      }
    }

    return {
      // Colors from A/B test
      buttonColor: ctaColorsTest.config.buttonColor || '#3B82F6',
      textColor: ctaColorsTest.config.textColor || '#FFFFFF',
      
      // Copy from A/B test
      buttonText: ctaCopyTest.config.buttonText || 'Discover Your Potential',
      
      // Modal timing from A/B test
      modalDelay: modalTimingTest.config.modalDelay || 30,
      
      // Personalization setting
      personalized: personalizationTest.config.personalized || false
    }
  }, [enableABTesting, ctaColorsTest.config, ctaCopyTest.config, modalTimingTest.config, personalizationTest.config])

  // A/B testing data
  const abTests = useMemo(() => ({
    ctaColors: {
      variant: ctaColorsTest.variant,
      config: ctaColorsTest.config,
      isInTest: ctaColorsTest.isInTest
    },
    ctaCopy: {
      variant: ctaCopyTest.variant,
      config: ctaCopyTest.config,
      isInTest: ctaCopyTest.isInTest
    },
    modalTiming: {
      variant: modalTimingTest.variant,
      config: modalTimingTest.config,
      isInTest: modalTimingTest.isInTest
    },
    personalization: {
      variant: personalizationTest.variant,
      config: personalizationTest.config,
      isInTest: personalizationTest.isInTest
    }
  }), [ctaColorsTest, ctaCopyTest, modalTimingTest, personalizationTest])

  return {
    // Current user state
    behavior,
    engagement,
    commitmentEscalation,
    
    // Personalized content
    recommendedContent,
    nextBestContent,
    personalizedInsights,
    
    // Dynamic CTAs
    optimalCTAs,
    currentCTAConfig,
    
    // A/B testing
    abTests,
    
    // Actions
    trackEngagement,
    trackConversion,
    updatePersonalization,
    triggerBehavioralAction
  }
}

// Additional hook for CTA optimization specifically
export function useCTAOptimization() {
  const personalization = useDynamicPersonalization({
    enableABTesting: true,
    enableBehavioralTriggers: true,
    maxRecommendations: 3,
    updateInterval: 15
  })

  const getCTAForContext = useCallback((context: string) => {
    const { engagement, currentCTAConfig, abTests } = personalization

    if (!engagement) {
      return {
        text: 'Get Started',
        style: 'default',
        priority: 'low'
      }
    }

    // Determine CTA based on engagement level and context
    let ctaText = currentCTAConfig.buttonText
    let ctaStyle = 'default'
    let priority = 'medium'

    if (engagement.level === 'very-high') {
      ctaText = 'Transform Your Life Now'
      ctaStyle = 'premium'
      priority = 'high'
    } else if (engagement.level === 'high') {
      ctaText = 'Get Your Complete Plan'
      ctaStyle = 'primary'
      priority = 'high'
    } else if (engagement.level === 'medium') {
      ctaText = 'Discover Your Potential'
      ctaStyle = 'secondary'
      priority = 'medium'
    } else {
      ctaText = 'See Your Score'
      ctaStyle = 'outline'
      priority = 'low'
    }

    // Apply A/B test overrides
    if (abTests.ctaCopy.isInTest) {
      ctaText = abTests.ctaCopy.config.buttonText || ctaText
    }

    return {
      text: ctaText,
      style: ctaStyle,
      priority,
      colors: {
        background: currentCTAConfig.buttonColor,
        text: currentCTAConfig.textColor
      },
      personalized: abTests.personalization.config.personalized
    }
  }, [personalization])

  return {
    ...personalization,
    getCTAForContext
  }
}

export default useDynamicPersonalization