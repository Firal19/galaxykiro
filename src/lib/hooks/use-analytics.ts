"use client"

import { useState, useEffect, useCallback } from 'react'
import { analyticsEngine, UserEvent, AnalyticsMetrics } from '@/lib/analytics-engine'

interface UseAnalyticsOptions {
  autoTrack?: boolean
  sessionTracking?: boolean
  pageTracking?: boolean
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    autoTrack = true,
    sessionTracking = true,
    pageTracking = true
  } = options

  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const existing = sessionStorage.getItem('analytics_session_id')
      if (existing) return existing
      
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      sessionStorage.setItem('analytics_session_id', newSessionId)
      return newSessionId
    }
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  })

  const [userId, setUserId] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(autoTrack)

  useEffect(() => {
    // Load user ID from localStorage if available
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id')
      if (storedUserId) {
        setUserId(storedUserId)
      }
    }

    // Auto-track page view on mount
    if (pageTracking && isTracking && typeof window !== 'undefined') {
      trackPageView()
    }

    // Track session start
    if (sessionTracking && isTracking) {
      trackEvent({
        type: 'page_view',
        category: 'engagement',
        action: 'session_start',
        metadata: {
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          device: getDeviceType(),
          browser: getBrowserType()
        }
      })
    }
  }, [isTracking, pageTracking, sessionTracking])

  // Core tracking function
  const trackEvent = useCallback(async (
    event: Omit<UserEvent, 'id' | 'timestamp' | 'sessionId' | 'userId'>
  ) => {
    if (!isTracking) return

    try {
      await analyticsEngine.trackEvent({
        ...event,
        sessionId,
        userId: userId || undefined,
        metadata: {
          ...event.metadata,
          timestamp: Date.now(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof window !== 'undefined' ? document.referrer : '',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : ''
        }
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }, [sessionId, userId, isTracking])

  // Page view tracking
  const trackPageView = useCallback((page?: string, title?: string) => {
    if (!isTracking) return

    const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '')
    const pageTitle = title || (typeof window !== 'undefined' ? document.title : '')

    trackEvent({
      type: 'page_view',
      category: 'engagement',
      action: 'page_view',
      metadata: {
        page: currentPage,
        title: pageTitle,
        device: getDeviceType(),
        browser: getBrowserType(),
        scrollDepth: 0
      }
    })
  }, [trackEvent, isTracking])

  // Tool usage tracking
  const trackToolUsage = useCallback((toolName: string, action: 'start' | 'complete' | 'abandon', metadata?: Record<string, any>) => {
    trackEvent({
      type: 'tool_use',
      category: 'engagement',
      action,
      label: toolName,
      metadata: {
        tool: toolName,
        ...metadata
      }
    })
  }, [trackEvent])

  // Content engagement tracking
  const trackContentView = useCallback((contentId: string, contentType: string, timeSpent?: number) => {
    trackEvent({
      type: 'content_view',
      category: 'engagement',
      action: 'view',
      label: contentId,
      metadata: {
        content: contentId,
        contentType,
        duration: timeSpent
      }
    })
  }, [trackEvent])

  // CTA click tracking
  const trackCTAClick = useCallback((ctaName: string, location: string, metadata?: Record<string, any>) => {
    trackEvent({
      type: 'cta_click',
      category: 'conversion',
      action: 'click',
      label: ctaName,
      metadata: {
        ctaName,
        location,
        ...metadata
      }
    })
  }, [trackEvent])

  // Form submission tracking
  const trackFormSubmit = useCallback((formName: string, success: boolean, metadata?: Record<string, any>) => {
    trackEvent({
      type: 'form_submit',
      category: 'conversion',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
      metadata: {
        form: formName,
        success,
        ...metadata
      }
    })
  }, [trackEvent])

  // Conversion tracking
  const trackConversion = useCallback((conversionType: string, value?: number, metadata?: Record<string, any>) => {
    trackEvent({
      type: 'conversion',
      category: 'conversion',
      action: conversionType,
      value,
      metadata: {
        conversionType,
        ...metadata
      }
    })
  }, [trackEvent])

  // Exit intent tracking
  const trackExitIntent = useCallback((metadata?: Record<string, any>) => {
    trackEvent({
      type: 'exit',
      category: 'engagement',
      action: 'exit_intent',
      metadata: {
        exitIntent: true,
        ...metadata
      }
    })
  }, [trackEvent])

  // Scroll depth tracking
  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent({
      type: 'page_view',
      category: 'engagement',
      action: 'scroll',
      value: depth,
      metadata: {
        scrollDepth: depth
      }
    })
  }, [trackEvent])

  // Time on page tracking
  const trackTimeOnPage = useCallback((duration: number) => {
    trackEvent({
      type: 'page_view',
      category: 'engagement',
      action: 'time_spent',
      value: duration,
      metadata: {
        duration
      }
    })
  }, [trackEvent])

  // A/B test tracking
  const trackABTest = useCallback((testId: string, variant: string, conversionAction?: string) => {
    const metadata = {
      abTest: testId,
      abVariant: variant
    }

    if (conversionAction) {
      trackEvent({
        type: 'conversion',
        category: 'conversion',
        action: conversionAction,
        metadata
      })
    } else {
      trackEvent({
        type: 'page_view',
        category: 'engagement',
        action: 'ab_test_view',
        metadata
      })
    }
  }, [trackEvent])

  // Custom event tracking
  const trackCustomEvent = useCallback((
    eventName: string,
    category: UserEvent['category'],
    metadata?: Record<string, any>,
    value?: number
  ) => {
    trackEvent({
      type: 'page_view', // Default type for custom events
      category,
      action: eventName,
      value,
      metadata: {
        customEvent: eventName,
        ...metadata
      }
    })
  }, [trackEvent])

  // Set user ID for tracking
  const setAnalyticsUserId = useCallback((newUserId: string) => {
    setUserId(newUserId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', newUserId)
    }
  }, [])

  // Get analytics metrics
  const getMetrics = useCallback((dateRange?: { start: Date; end: Date }): AnalyticsMetrics => {
    return analyticsEngine.getMetrics(dateRange)
  }, [])

  // Get real-time metrics
  const getRealTimeMetrics = useCallback(() => {
    return analyticsEngine.getRealTimeMetrics()
  }, [])

  // Enable/disable tracking
  const enableTracking = useCallback(() => setIsTracking(true), [])
  const disableTracking = useCallback(() => setIsTracking(false), [])

  // Enhanced page tracking with automatic scroll and time tracking
  useEffect(() => {
    if (!isTracking || typeof window === 'undefined') return

    let scrollDepthTracked = 0
    let timeOnPageStart = Date.now()
    let maxScrollDepth = 0

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollPercentage = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0

      maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage)

      // Track scroll milestones
      if (scrollPercentage >= 25 && scrollDepthTracked < 25) {
        trackScrollDepth(25)
        scrollDepthTracked = 25
      } else if (scrollPercentage >= 50 && scrollDepthTracked < 50) {
        trackScrollDepth(50)
        scrollDepthTracked = 50
      } else if (scrollPercentage >= 75 && scrollDepthTracked < 75) {
        trackScrollDepth(75)
        scrollDepthTracked = 75
      } else if (scrollPercentage >= 90 && scrollDepthTracked < 90) {
        trackScrollDepth(90)
        scrollDepthTracked = 90
      }
    }

    const handleUnload = () => {
      const timeSpent = Date.now() - timeOnPageStart
      if (timeSpent > 5000) { // Only track if user spent more than 5 seconds
        trackTimeOnPage(timeSpent)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trackExitIntent({ scrollDepth: maxScrollDepth })
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleUnload)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isTracking, trackScrollDepth, trackTimeOnPage, trackExitIntent])

  return {
    // Core tracking
    trackEvent,
    trackPageView,
    
    // Specific event tracking
    trackToolUsage,
    trackContentView,
    trackCTAClick,
    trackFormSubmit,
    trackConversion,
    trackExitIntent,
    trackScrollDepth,
    trackTimeOnPage,
    trackABTest,
    trackCustomEvent,
    
    // Analytics data
    getMetrics,
    getRealTimeMetrics,
    
    // User management
    setAnalyticsUserId,
    userId,
    sessionId,
    
    // Tracking control
    enableTracking,
    disableTracking,
    isTracking
  }
}

// Helper functions
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = navigator.userAgent
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet'
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile'
  }
  
  return 'desktop'
}

function getBrowserType(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = navigator.userAgent
  
  if (userAgent.includes('Chrome')) return 'chrome'
  if (userAgent.includes('Firefox')) return 'firefox'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari'
  if (userAgent.includes('Edge')) return 'edge'
  if (userAgent.includes('Opera')) return 'opera'
  
  return 'other'
}