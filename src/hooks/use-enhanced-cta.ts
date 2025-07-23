'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAppStore, useUser } from '../lib/store'
import { engagementEngine, type UserBehavior, type EngagementLevel } from '../lib/engagement-engine'
import { trackingService } from '../lib/tracking'
import { useABTest, abTestingService } from '../lib/ab-testing-framework'
import { usePsychologicalTriggers } from '../lib/psychological-triggers'
import { ENHANCED_CTA_CONFIGS } from '../config/cta-configs'
import type { EnhancedCTAConfig } from '../types/cta-types'

export interface UseEnhancedCTAProps {
  context: string
  maxCTAs?: number
  enableABTesting?: boolean
  onCTAClick?: (ctaId: string, action: string) => void
}

export function useEnhancedCTA({
  context = 'general',
  maxCTAs = 3,
  enableABTesting = true,
  onCTAClick
}: UseEnhancedCTAProps) {
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

  // Filter CTAs based on user behavior and engagement
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

    // Sort by priority and commitment level progression
    return validCTAs
      .sort((a, b) => {
        // First sort by commitment level progression
        const commitmentOrder = { micro: 1, midi: 2, macro: 3 }
        const commitmentDiff = commitmentOrder[a.commitmentLevel] - commitmentOrder[b.commitmentLevel]
        
        if (commitmentDiff !== 0) return commitmentDiff
        
        // Then by priority
        return b.priority - a.priority
      })
      .slice(0, maxCTAs)
  }, [behavior, engagement, maxCTAs])

  // Set up A/B testing variants
  useEffect(() => {
    if (!enableABTesting) return

    const newVariants = new Map<string, string>()
    
    filteredCTAs.forEach(cta => {
      if (cta.abTestId && cta.variants) {
        const variantKeys = Object.keys(cta.variants)
        const selectedVariant = abTestingService.getVariant(cta.abTestId, variantKeys)
        newVariants.set(cta.id, selectedVariant)
      }
    })
    
    setCTAVariants(newVariants)
  }, [filteredCTAs, enableABTesting])

  // Handle CTA click
  const handleCTAClick = useCallback((cta: EnhancedCTAConfig) => {
    const variant = ctaVariants.get(cta.id) || 'control'
    
    // Track the click
    trackCTAClick(cta.id, {
      action: cta.action,
      commitmentLevel: cta.commitmentLevel,
      context,
      variant,
      engagementScore: engagement?.score || 0,
      behaviorPattern: engagement?.behaviorPattern || 'unknown'
    })

    // Track psychological trigger interaction
    if (activeTrigger) {
      trackInteraction(activeTrigger.id, 'cta_click', { ctaId: cta.id })
    }

    // Track A/B test conversion
    if (enableABTesting && cta.abTestId) {
      abTestingService.trackConversion(cta.abTestId, variant, user?.id)
    }

    // Track with general tracking service
    trackingService.trackInteraction('cta_click', {
      ctaId: cta.id,
      action: cta.action,
      context,
      variant,
      commitmentLevel: cta.commitmentLevel,
      userId: user?.id
    })

    // Execute callback
    onCTAClick?.(cta.id, cta.action)
  }, [ctaVariants, trackCTAClick, context, engagement, activeTrigger, trackInteraction, enableABTesting, user?.id, onCTAClick])

  // Get CTA with applied variant
  const getCTAWithVariant = useCallback((cta: EnhancedCTAConfig) => {
    const variant = ctaVariants.get(cta.id) || 'control'
    const variantConfig = cta.variants?.[variant]
    
    if (!variantConfig) return cta
    
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

  // Update selected CTAs
  useEffect(() => {
    setSelectedCTAs(filteredCTAs)
  }, [filteredCTAs])

  return {
    behavior,
    engagement,
    selectedCTAs,
    ctaVariants,
    activeTrigger,
    psychTriggers,
    handleCTAClick,
    getCTAWithVariant,
    getPersonalizedContent,
    trackDisplay
  }
}