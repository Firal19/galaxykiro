/**
 * React Hook for Lead Scoring and Conversion Pipeline V2
 * Comprehensive lead scoring system based on Galaxy Dream Team Master Project Plan
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  leadScoringService, 
  LeadProfile, 
  VisitorStatus, 
  ConversionTrigger 
} from '../lead-scoring-service'

export function useLeadScoringV2() {
  const [profile, setProfile] = useState<LeadProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTracking, setIsTracking] = useState(false)

  // Initialize profile on mount
  useEffect(() => {
    const initProfile = async () => {
      try {
        setLoading(true)
        const currentProfile = leadScoringService.getCurrentProfile()
        if (currentProfile) {
          setProfile(currentProfile)
        } else {
          // Trigger initial tracking to create profile
          const newProfile = await leadScoringService.updateEngagement('time_on_site', {
            initial_visit: true,
            referrer: document.referrer,
            user_agent: navigator.userAgent
          })
          setProfile(newProfile)
        }
      } catch (error) {
        console.error('Error initializing lead profile:', error)
      } finally {
        setLoading(false)
      }
    }

    initProfile()
  }, [])

  // Track engagement action
  const trackEngagement = useCallback(async (
    action: ConversionTrigger,
    metadata?: Record<string, any>
  ) => {
    if (isTracking) return // Prevent concurrent tracking calls
    
    try {
      setIsTracking(true)
      const updatedProfile = await leadScoringService.updateEngagement(action, metadata)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Error tracking engagement:', error)
      throw error
    } finally {
      setIsTracking(false)
    }
  }, [isTracking])

  // Convenience methods for common actions
  const trackToolUsage = useCallback((toolId: string, toolName: string) => {
    return trackEngagement('tool_usage', {
      tool_id: toolId,
      tool_name: toolName,
      page_url: window.location.href
    })
  }, [trackEngagement])

  const trackFormInteraction = useCallback((formType: string) => {
    return trackEngagement('form_interaction', {
      form_type: formType,
      page_url: window.location.href
    })
  }, [trackEngagement])

  const trackContentConsumption = useCallback((contentType: string, contentId?: string) => {
    return trackEngagement('content_consumption', {
      content_type: contentType,
      content_id: contentId,
      page_url: window.location.href
    })
  }, [trackEngagement])

  const trackEmailVerification = useCallback(() => {
    return trackEngagement('email_verified', {
      verified_at: new Date().toISOString()
    })
  }, [trackEngagement])

  const trackRegistrationComplete = useCallback((userInfo?: Record<string, any>) => {
    return trackEngagement('registration_complete', {
      ...userInfo,
      completed_at: new Date().toISOString()
    })
  }, [trackEngagement])

  const trackWebinarRegistration = useCallback((webinarId: string) => {
    return trackEngagement('webinar_registered', {
      webinar_id: webinarId,
      registered_at: new Date().toISOString()
    })
  }, [trackEngagement])

  const trackHighEngagement = useCallback((engagementType: string) => {
    return trackEngagement('high_engagement', {
      engagement_type: engagementType,
      page_url: window.location.href
    })
  }, [trackEngagement])

  const trackSocialShare = useCallback((platform: string, contentUrl: string) => {
    return trackEngagement('social_share', {
      platform,
      shared_url: contentUrl,
      shared_at: new Date().toISOString()
    })
  }, [trackEngagement])

  const trackReferralClick = useCallback((referralSource: string) => {
    return trackEngagement('referral_click', {
      referral_source: referralSource,
      clicked_at: new Date().toISOString()
    })
  }, [trackEngagement])

  // Get status-specific insights
  const getStatusInsights = useCallback(() => {
    if (!profile) return null

    const insights = {
      currentStatus: profile.status,
      nextStatus: getNextStatus(profile.status),
      progressToNext: getProgressToNextStatus(profile),
      recommendations: getRecommendations(profile),
      timeToConversion: profile.predictions.timeToConversion,
      conversionProbability: profile.predictions.conversionProbability,
      nextBestAction: profile.predictions.nextBestAction
    }

    return insights
  }, [profile])

  // Helper function to get next status
  const getNextStatus = (currentStatus: VisitorStatus): VisitorStatus | null => {
    const statusFlow: VisitorStatus[] = ['visitor', 'cold_lead', 'candidate', 'hot_lead']
    const currentIndex = statusFlow.indexOf(currentStatus)
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null
  }

  // Helper function to calculate progress to next status
  const getProgressToNextStatus = (profile: LeadProfile): number => {
    const { status, engagementScore } = profile
    
    switch (status) {
      case 'visitor':
        return Math.min((engagementScore / 15) * 100, 100)
      case 'cold_lead':
        return Math.min(((engagementScore - 15) / 60) * 100, 100)
      case 'candidate':
        return Math.min(((engagementScore - 75) / 75) * 100, 100)
      case 'hot_lead':
        return 100 // Already at highest status
      default:
        return 0
    }
  }

  // Helper function to get recommendations
  const getRecommendations = (profile: LeadProfile): string[] => {
    const { status, engagementScore, activities = [] } = profile
    const recommendations: string[] = []

    const hasToolUsage = activities.some(a => a.action === 'tool_usage')
    const hasEmailVerified = activities.some(a => a.action === 'email_verified')
    const hasWebinarReg = activities.some(a => a.action === 'webinar_registered')

    switch (status) {
      case 'visitor':
        if (!hasToolUsage) {
          recommendations.push('Take an assessment tool to discover insights about yourself')
        }
        if (engagementScore < 10) {
          recommendations.push('Explore our content library to learn more')
        }
        recommendations.push('Sign up for our newsletter to stay updated')
        break

      case 'cold_lead':
        if (!hasEmailVerified) {
          recommendations.push('Create an account to unlock more tools and features')
        }
        recommendations.push('Complete your profile to get personalized recommendations')
        recommendations.push('Join our community to connect with like-minded individuals')
        break

      case 'candidate':
        if (!hasWebinarReg) {
          recommendations.push('Register for our transformation webinar')
        }
        recommendations.push('Book a free strategy session with our experts')
        recommendations.push('Explore our premium programs and courses')
        break

      case 'hot_lead':
        recommendations.push('Schedule a consultation to discuss your transformation journey')
        recommendations.push('Join our VIP program for exclusive access and support')
        recommendations.push('Become a transformation success story')
        break
    }

    return recommendations
  }

  // Auto-track time on site
  useEffect(() => {
    if (!profile || loading) return

    const startTime = Date.now()
    let timeTrackingInterval: NodeJS.Timeout

    const trackTimeOnSite = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 60000) // minutes
      if (timeSpent > 0) {
        trackEngagement('time_on_site', {
          time_spent_minutes: timeSpent,
          session_duration: timeSpent
        }).catch(console.error)
      }
    }

    // Track every minute
    timeTrackingInterval = setInterval(trackTimeOnSite, 60000)

    // Track on page unload
    const handleBeforeUnload = () => {
      trackTimeOnSite()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(timeTrackingInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [profile, loading, trackEngagement])

  return {
    // Profile data
    profile,
    loading,
    isTracking,
    
    // Status insights
    insights: getStatusInsights(),
    
    // Tracking methods
    trackEngagement,
    trackToolUsage,
    trackFormInteraction,
    trackContentConsumption,
    trackEmailVerification,
    trackRegistrationComplete,
    trackWebinarRegistration,
    trackHighEngagement,
    trackSocialShare,
    trackReferralClick,
    
    // Utility methods
    getCurrentStatus: () => profile?.status || 'visitor',
    getEngagementScore: () => profile?.engagementScore || 0,
    getConversionReadiness: () => profile?.conversionReadiness || 0,
    getConversionProbability: () => profile?.predictions.conversionProbability || 0.1,
    getNextBestAction: () => profile?.predictions.nextBestAction || 'Explore our content',
    getTimeToConversion: () => profile?.predictions.timeToConversion || 30,
    
    // Admin/testing
    manualStatusUpdate: (status: VisitorStatus) => leadScoringService.manualStatusUpdate(status)
  }
}