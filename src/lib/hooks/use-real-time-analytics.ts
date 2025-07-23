'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'
import { trackingService } from '../tracking'
import { behavioralAnalysis, RealTimeEngagementUpdate, SessionAnalytics } from '../behavioral-analysis'

interface RealTimeAnalyticsConfig {
  userId?: string
  sessionId?: string
  enableBehavioralAnalysis?: boolean
  enableRealTimeUpdates?: boolean
  trackScrollDepth?: boolean
  trackTimeOnPage?: boolean
  trackCTAClicks?: boolean
  trackToolInteractions?: boolean
}

interface AnalyticsState {
  currentScore: number
  tier: 'browser' | 'engaged' | 'soft-member'
  sessionAnalytics: SessionAnalytics | null
  behaviorSignals: string[]
  recommendedInterventions: string[]
  isTracking: boolean
  lastUpdate: Date | null
}

export function useRealTimeAnalytics(config: RealTimeAnalyticsConfig) {
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
    currentScore: 0,
    tier: 'browser',
    sessionAnalytics: null,
    behaviorSignals: [],
    recommendedInterventions: [],
    isTracking: false,
    lastUpdate: null
  })

  const [isInitialized, setIsInitialized] = useState(false)
  const scrollDepthRef = useRef(0)
  const timeOnPageRef = useRef<Record<string, number>>({})
  const pageStartTimeRef = useRef<Date | null>(null)
  const subscriptionRef = useRef<any>(null)

  // Initialize analytics tracking
  useEffect(() => {
    if (!config.userId && !config.sessionId) return

    initializeAnalytics()
    
    return () => {
      cleanup()
    }
  }, [config.userId, config.sessionId])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!config.enableRealTimeUpdates || !config.userId) return

    setupRealTimeSubscription()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [config.enableRealTimeUpdates, config.userId])

  // Track scroll depth
  useEffect(() => {
    if (!config.trackScrollDepth || !isInitialized) return

    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0

      if (scrollDepth > scrollDepthRef.current) {
        scrollDepthRef.current = scrollDepth
        trackScrollDepth(scrollDepth)
      }
    }, 1000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [config.trackScrollDepth, isInitialized])

  // Track time on page
  useEffect(() => {
    if (!config.trackTimeOnPage || !isInitialized) return

    pageStartTimeRef.current = new Date()

    const trackTimeInterval = setInterval(() => {
      if (pageStartTimeRef.current) {
        const timeSpent = Date.now() - pageStartTimeRef.current.getTime()
        const currentPath = window.location.pathname
        timeOnPageRef.current[currentPath] = timeSpent

        // Track significant time milestones
        if (timeSpent > 0 && timeSpent % 30000 === 0) { // Every 30 seconds
          trackTimeOnPage(timeSpent)
        }
      }
    }, 30000)

    return () => {
      clearInterval(trackTimeInterval)
      if (pageStartTimeRef.current) {
        const finalTimeSpent = Date.now() - pageStartTimeRef.current.getTime()
        if (finalTimeSpent > 10000) { // Only track if more than 10 seconds
          trackTimeOnPage(finalTimeSpent)
        }
      }
    }
  }, [config.trackTimeOnPage, isInitialized])

  const initializeAnalytics = async () => {
    try {
      setAnalyticsState(prev => ({ ...prev, isTracking: true }))

      // Get initial session analytics
      if (config.sessionId) {
        const sessionAnalytics = await behavioralAnalysis.analyzeSession(
          config.sessionId, 
          config.userId
        )
        
        setAnalyticsState(prev => ({
          ...prev,
          sessionAnalytics,
          currentScore: sessionAnalytics.engagementScore,
          behaviorSignals: sessionAnalytics.behaviorSignals
        }))
      }

      // Get user's current tier if available
      if (config.userId) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('current_tier, engagement_score')
            .eq('id', config.userId)
            .single()

          if (userData) {
            setAnalyticsState(prev => ({
              ...prev,
              tier: userData.current_tier,
              currentScore: userData.engagement_score
            }))
          }
        } catch (error) {
          console.warn('Could not fetch user data:', error)
        }
      }

      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
      setAnalyticsState(prev => ({ ...prev, isTracking: false }))
    }
  }

  const setupRealTimeSubscription = () => {
    if (!config.userId) return

    subscriptionRef.current = supabase
      .channel('engagement-updates')
      .on('broadcast', { event: 'real-time-engagement-update' }, (payload) => {
        const update = payload.payload as RealTimeEngagementUpdate
        
        if (update.userId === config.userId) {
          setAnalyticsState(prev => ({
            ...prev,
            currentScore: update.currentScore,
            tier: update.tierStatus,
            behaviorSignals: update.behaviorSignals,
            recommendedInterventions: update.recommendedInterventions,
            lastUpdate: new Date()
          }))

          // Trigger any intervention callbacks
          if (update.recommendedInterventions.length > 0) {
            handleRecommendedInterventions(update.recommendedInterventions)
          }
        }
      })
      .subscribe()
  }

  const trackScrollDepth = useCallback(async (depth: number) => {
    if (!config.userId || !config.sessionId) return

    try {
      await trackingService.trackUserJourney({
        userId: config.userId,
        sessionId: config.sessionId,
        eventType: 'scroll_depth',
        eventData: {
          depth,
          page_url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })

      // Update engagement score if behavioral analysis is enabled
      if (config.enableBehavioralAnalysis) {
        await behavioralAnalysis.updateEngagementScore(
          config.userId,
          config.sessionId,
          'scroll_depth',
          { depth, pageUrl: window.location.href }
        )
      }
    } catch (error) {
      console.error('Failed to track scroll depth:', error)
    }
  }, [config.userId, config.sessionId, config.enableBehavioralAnalysis])

  const trackTimeOnPage = useCallback(async (timeSpent: number) => {
    if (!config.userId || !config.sessionId) return

    try {
      await trackingService.trackUserJourney({
        userId: config.userId,
        sessionId: config.sessionId,
        eventType: 'time_on_page',
        eventData: {
          timeSpent,
          page_url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })

      // Update engagement score if behavioral analysis is enabled
      if (config.enableBehavioralAnalysis) {
        await behavioralAnalysis.updateEngagementScore(
          config.userId,
          config.sessionId,
          'time_on_page',
          { timeSpent, pageUrl: window.location.href }
        )
      }
    } catch (error) {
      console.error('Failed to track time on page:', error)
    }
  }, [config.userId, config.sessionId, config.enableBehavioralAnalysis])

  const trackCTAClick = useCallback(async (ctaId: string, ctaText: string, additionalData?: Record<string, unknown>) => {
    if (!config.trackCTAClicks || !config.userId || !config.sessionId) return

    try {
      await trackingService.trackCTAClick(config.sessionId, ctaId, ctaText, window.location.href, config.userId)

      // Update engagement score if behavioral analysis is enabled
      if (config.enableBehavioralAnalysis) {
        await behavioralAnalysis.updateEngagementScore(
          config.userId,
          config.sessionId,
          'cta_click',
          { ctaId, ctaText, pageUrl: window.location.href, ...additionalData }
        )
      }
    } catch (error) {
      console.error('Failed to track CTA click:', error)
    }
  }, [config.trackCTAClicks, config.userId, config.sessionId, config.enableBehavioralAnalysis])

  const trackToolInteraction = useCallback(async (
    toolId: string, 
    action: 'start' | 'complete' | 'abandon', 
    additionalData?: Record<string, unknown>
  ) => {
    if (!config.trackToolInteractions || !config.userId || !config.sessionId) return

    try {
      const eventType = action === 'start' ? 'tool_start' : 
                      action === 'complete' ? 'tool_complete' : 'tool_abandon'

      await trackingService.trackUserJourney({
        userId: config.userId,
        sessionId: config.sessionId,
        eventType,
        eventData: {
          toolId,
          action,
          timestamp: new Date().toISOString(),
          ...additionalData
        }
      })

      // Update engagement score if behavioral analysis is enabled
      if (config.enableBehavioralAnalysis) {
        await behavioralAnalysis.updateEngagementScore(
          config.userId,
          config.sessionId,
          eventType,
          { toolId, action, ...additionalData }
        )
      }
    } catch (error) {
      console.error('Failed to track tool interaction:', error)
    }
  }, [config.trackToolInteractions, config.userId, config.sessionId, config.enableBehavioralAnalysis])

  const trackCustomEvent = useCallback(async (
    eventType: string, 
    eventData: Record<string, unknown>
  ) => {
    if (!config.userId || !config.sessionId) return

    try {
      await trackingService.trackUserJourney({
        userId: config.userId,
        sessionId: config.sessionId,
        eventType,
        eventData: {
          ...eventData,
          timestamp: new Date().toISOString()
        }
      })

      // Update engagement score if behavioral analysis is enabled
      if (config.enableBehavioralAnalysis) {
        await behavioralAnalysis.updateEngagementScore(
          config.userId,
          config.sessionId,
          eventType,
          eventData
        )
      }
    } catch (error) {
      console.error('Failed to track custom event:', error)
    }
  }, [config.userId, config.sessionId, config.enableBehavioralAnalysis])

  const handleRecommendedInterventions = (interventions: string[]) => {
    // This could trigger UI changes, modals, or other interventions
    console.log('Recommended interventions:', interventions)
    
    // Example: Show exit-intent modal
    if (interventions.includes('Show exit-intent value offer')) {
      // Trigger exit-intent modal
    }
    
    // Example: Highlight premium features
    if (interventions.includes('Present premium conversion opportunity')) {
      // Highlight premium CTAs
    }
  }

  const getAnalyticsSummary = useCallback(() => {
    return {
      engagementScore: analyticsState.currentScore,
      tier: analyticsState.tier,
      behaviorSignals: analyticsState.behaviorSignals,
      sessionDuration: analyticsState.sessionAnalytics?.duration || 0,
      pageViews: analyticsState.sessionAnalytics?.pageViews || 0,
      toolInteractions: analyticsState.sessionAnalytics?.toolInteractions || 0,
      isHighlyEngaged: analyticsState.currentScore > 50,
      isReadyForConversion: analyticsState.currentScore > 70
    }
  }, [analyticsState])

  const cleanup = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
    }
    setIsInitialized(false)
    setAnalyticsState({
      currentScore: 0,
      tier: 'browser',
      sessionAnalytics: null,
      behaviorSignals: [],
      recommendedInterventions: [],
      isTracking: false,
      lastUpdate: null
    })
  }

  return {
    // State
    analyticsState,
    isInitialized,
    
    // Tracking functions
    trackCTAClick,
    trackToolInteraction,
    trackCustomEvent,
    
    // Utility functions
    getAnalyticsSummary,
    
    // Current session data
    currentScore: analyticsState.currentScore,
    currentTier: analyticsState.tier,
    behaviorSignals: analyticsState.behaviorSignals,
    recommendedInterventions: analyticsState.recommendedInterventions,
    sessionAnalytics: analyticsState.sessionAnalytics,
    
    // Status
    isTracking: analyticsState.isTracking,
    lastUpdate: analyticsState.lastUpdate
  }
}

// Utility function to throttle scroll events
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}