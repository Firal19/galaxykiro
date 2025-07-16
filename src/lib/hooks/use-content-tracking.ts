'use client'

import { useEffect, useRef, useCallback } from 'react'
import { ContentEngagementModel } from '../models/content-engagement'

interface UseContentTrackingProps {
  contentId: string
  contentType: string
  contentCategory?: string
  userId?: string
  sessionId?: string
  enabled?: boolean
}

interface ContentTrackingData {
  timeSpent: number
  scrollDepth: number
  interactions: number
  engagementScore: number
}

export const useContentTracking = ({
  contentId,
  contentType,
  contentCategory,
  userId,
  sessionId,
  enabled = true
}: UseContentTrackingProps) => {
  const engagementRef = useRef<ContentEngagementModel | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const lastScrollDepthRef = useRef<number>(0)
  const interactionCountRef = useRef<number>(0)
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize engagement tracking
  const initializeTracking = useCallback(async () => {
    if (!enabled || !contentId) return

    try {
      const engagement = await ContentEngagementModel.findOrCreate(
        userId,
        contentId,
        contentType,
        sessionId,
        contentCategory
      )
      engagementRef.current = engagement
      startTimeRef.current = Date.now()
    } catch (error) {
      console.error('Error initializing content tracking:', error)
    }
  }, [enabled, contentId, contentType, contentCategory, userId, sessionId])

  // Track time spent
  const updateTimeSpent = useCallback(async () => {
    if (!engagementRef.current) return

    try {
      const currentTime = Date.now()
      const additionalTime = Math.floor((currentTime - startTimeRef.current) / 1000)
      
      if (additionalTime > 0) {
        await engagementRef.current.updateTimeSpent(additionalTime)
        startTimeRef.current = currentTime
      }
    } catch (error) {
      console.error('Error updating time spent:', error)
    }
  }, [])

  // Track scroll depth
  const updateScrollDepth = useCallback(async () => {
    if (!engagementRef.current) return

    try {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      const scrollDepth = Math.min(
        (scrollTop + windowHeight) / documentHeight,
        1.0
      )

      if (scrollDepth > lastScrollDepthRef.current) {
        await engagementRef.current.updateScrollDepth(scrollDepth)
        lastScrollDepthRef.current = scrollDepth
      }
    } catch (error) {
      console.error('Error updating scroll depth:', error)
    }
  }, [])

  // Track interaction
  const trackInteraction = useCallback(async (interactionType?: string) => {
    if (!engagementRef.current) return

    try {
      await engagementRef.current.incrementInteraction(interactionType)
      interactionCountRef.current += 1
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }
  }, [])

  // Get current tracking data
  const getTrackingData = useCallback((): ContentTrackingData => {
    if (!engagementRef.current) {
      return {
        timeSpent: 0,
        scrollDepth: 0,
        interactions: 0,
        engagementScore: 0
      }
    }

    return {
      timeSpent: engagementRef.current.timeSpent,
      scrollDepth: engagementRef.current.scrollDepth,
      interactions: engagementRef.current.interactionsCount,
      engagementScore: engagementRef.current.getEngagementScore()
    }
  }, [])

  // Setup tracking intervals and event listeners
  useEffect(() => {
    if (!enabled) return

    initializeTracking()

    // Track time spent every 10 seconds
    trackingIntervalRef.current = setInterval(updateTimeSpent, 10000)

    // Track scroll depth
    const handleScroll = () => {
      updateScrollDepth()
    }

    // Track various interactions
    const handleClick = () => {
      trackInteraction('click')
    }

    const handleKeyPress = () => {
      trackInteraction('keypress')
    }

    const handleMouseMove = () => {
      trackInteraction('mousemove')
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)
    document.addEventListener('keypress', handleKeyPress)
    document.addEventListener('mousemove', handleMouseMove)

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateTimeSpent()
      } else {
        startTimeRef.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current)
      }
      
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keypress', handleKeyPress)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Final time update before cleanup
      updateTimeSpent()
    }
  }, [enabled, initializeTracking, updateTimeSpent, updateScrollDepth, trackInteraction])

  // Track page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      updateTimeSpent()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [updateTimeSpent])

  return {
    trackInteraction,
    getTrackingData,
    updateTimeSpent,
    updateScrollDepth
  }
}

// Hook for tracking specific content actions
export const useContentActions = (contentId: string, userId?: string) => {
  const trackAction = useCallback(async (action: string, metadata?: Record<string, unknown>) => {
    if (!userId) return

    try {
      // This would typically send to an analytics service or database
      console.log('Content action tracked:', {
        contentId,
        userId,
        action,
        metadata,
        timestamp: new Date().toISOString()
      })

      // You could also update the content engagement record
      // or send to a separate analytics endpoint
    } catch (error) {
      console.error('Error tracking content action:', error)
    }
  }, [contentId, userId])

  const trackShare = useCallback((platform: string) => {
    trackAction('share', { platform })
  }, [trackAction])

  const trackBookmark = useCallback(() => {
    trackAction('bookmark')
  }, [trackAction])

  const trackDownload = useCallback((resourceType: string) => {
    trackAction('download', { resourceType })
  }, [trackAction])

  const trackCompletion = useCallback((completionRate: number) => {
    trackAction('completion', { completionRate })
  }, [trackAction])

  const trackCTAClick = useCallback((ctaType: string, ctaText: string) => {
    trackAction('cta_click', { ctaType, ctaText })
  }, [trackAction])

  return {
    trackAction,
    trackShare,
    trackBookmark,
    trackDownload,
    trackCompletion,
    trackCTAClick
  }
}

// Hook for content analytics
export const useContentAnalytics = (contentId: string) => {
  const getContentStats = useCallback(async () => {
    try {
      return await ContentEngagementModel.getContentStats(contentId)
    } catch (error) {
      console.error('Error getting content stats:', error)
      return null
    }
  }, [contentId])

  return {
    getContentStats
  }
}