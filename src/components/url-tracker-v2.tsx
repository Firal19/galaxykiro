"use client"

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLeadScoringV2 } from '@/lib/hooks/use-lead-scoring-v2'

// Singleton pattern to prevent multiple tracking instances
let isTrackingInitialized = false
let trackingCleanup: (() => void) | null = null

export function UrlTrackerV2() {
  const searchParams = useSearchParams()
  const { 
    trackEngagement, 
    trackReferralClick, 
    trackHighEngagement,
    trackContentConsumption 
  } = useLeadScoringV2()

  useEffect(() => {
    // Prevent multiple instances
    if (isTrackingInitialized) {
      return
    }
    
    const initializeTracking = async () => {
      try {
        isTrackingInitialized = true
        // Extract URL parameters for attribution
        const contentId = searchParams.get('c')
        const memberId = searchParams.get('m') 
        const platform = searchParams.get('p')
        const utm_source = searchParams.get('utm_source')
        const utm_medium = searchParams.get('utm_medium')
        const utm_campaign = searchParams.get('utm_campaign')
        
        // Track referral if came from specific source
        if (platform || utm_source) {
          await trackReferralClick(platform || utm_source || 'unknown')
        }

        // Track content consumption if content ID provided
        if (contentId) {
          await trackContentConsumption('shared_content', contentId)
        }

        // Enhanced page engagement tracking
        let scrollDepth = 0
        let timeOnPage = 0
        let hasInteracted = false
        
        const startTime = Date.now()

        // Track scroll depth
        const handleScroll = () => {
          const currentScrollDepth = Math.round(
            (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100
          )
          
          if (currentScrollDepth > scrollDepth) {
            scrollDepth = currentScrollDepth
            
            // Track significant scroll milestones
            if (currentScrollDepth >= 75 && scrollDepth < 75) {
              trackEngagement('high_engagement', {
                engagement_type: 'deep_scroll',
                scroll_depth: currentScrollDepth,
                time_on_page: Math.floor((Date.now() - startTime) / 1000)
              }).catch(console.error)
            }
          }
        }

        // Track user interactions
        const handleInteraction = (eventType: string) => {
          if (!hasInteracted) {
            hasInteracted = true
            trackEngagement('high_engagement', {
              engagement_type: 'first_interaction',
              interaction_type: eventType,
              time_to_interaction: Math.floor((Date.now() - startTime) / 1000)
            }).catch(console.error)
          }
        }

        // Track click interactions
        const handleClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement
          const tagName = target.tagName.toLowerCase()
          
          if (tagName === 'a') {
            const href = (target as HTMLAnchorElement).href
            if (href.includes('mailto:') || href.includes('tel:')) {
              trackEngagement('high_engagement', {
                engagement_type: 'contact_attempt',
                contact_type: href.includes('mailto:') ? 'email' : 'phone'
              }).catch(console.error)
            }
          } else if (tagName === 'button' || target.closest('button')) {
            const buttonText = target.textContent || target.closest('button')?.textContent
            trackEngagement('form_interaction', {
              interaction_type: 'button_click',
              button_text: buttonText?.substring(0, 50)
            }).catch(console.error)
          }
          
          handleInteraction('click')
        }

        // Track form interactions
        const handleFormInteraction = (event: Event) => {
          const target = event.target as HTMLElement
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            const formElement = target.closest('form')
            const formName = formElement?.getAttribute('name') || 'unknown_form'
            
            trackEngagement('form_interaction', {
              form_name: formName,
              field_type: target.tagName.toLowerCase(),
              field_name: (target as HTMLInputElement).name || 'unnamed'
            }).catch(console.error)
            
            handleInteraction('form')
          }
        }

        // Track time-based engagement
        const trackTimeBasedEngagement = () => {
          timeOnPage = Math.floor((Date.now() - startTime) / 1000)
          
          // Track significant time milestones
          if (timeOnPage === 60) { // 1 minute
            trackEngagement('time_on_site', {
              milestone: '1_minute',
              total_time: timeOnPage
            }).catch(console.error)
          } else if (timeOnPage === 120) { // 2 minutes - triggers cold lead conversion
            trackEngagement('time_on_site', {
              milestone: '2_minutes',
              total_time: timeOnPage
            }).catch(console.error)
          } else if (timeOnPage === 300) { // 5 minutes - high engagement
            trackHighEngagement('extended_session').catch(console.error)
          }
        }

        // Track page visibility changes
        const handleVisibilityChange = () => {
          if (document.hidden) {
            // Page became hidden - track time spent
            const sessionTime = Math.floor((Date.now() - startTime) / 1000)
            if (sessionTime > 10) { // Only track if more than 10 seconds
              trackEngagement('time_on_site', {
                session_duration: sessionTime,
                final_scroll_depth: scrollDepth,
                had_interaction: hasInteracted
              }).catch(console.error)
            }
          }
        }

        // Set up event listeners
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('click', handleClick)
        window.addEventListener('input', handleFormInteraction)
        window.addEventListener('change', handleFormInteraction)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Set up time-based tracking with throttling
        let lastTimeTrack = 0
        const timeTrackingInterval = setInterval(() => {
          const now = Date.now()
          if (now - lastTimeTrack > 15000) { // Throttle to max once per 15 seconds
            lastTimeTrack = now
            trackTimeBasedEngagement()
          }
        }, 10000) // Check every 10 seconds but throttle execution

        // Track initial page view
        await trackEngagement('time_on_site', {
          initial_page_view: true,
          referrer: document.referrer,
          page_title: document.title,
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          attribution: {
            content_id: contentId,
            member_id: memberId,
            platform: platform,
            utm_source,
            utm_medium,
            utm_campaign
          }
        })

        // Store cleanup function
        trackingCleanup = () => {
          window.removeEventListener('scroll', handleScroll)
          window.removeEventListener('click', handleClick)
          window.removeEventListener('input', handleFormInteraction)
          window.removeEventListener('change', handleFormInteraction)
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          clearInterval(timeTrackingInterval)
          isTrackingInitialized = false
          
          // Final session tracking
          const finalSessionTime = Math.floor((Date.now() - startTime) / 1000)
          if (finalSessionTime > 5) {
            trackEngagement('time_on_site', {
              final_session_duration: finalSessionTime,
              final_scroll_depth: scrollDepth,
              final_interaction_status: hasInteracted
            }).catch(console.error)
          }
        }
        
        return trackingCleanup
      } catch (error) {
        console.error('Error initializing URL tracking:', error)
      }
    }

    // Initialize tracking
    initializeTracking()
    
    // Return cleanup function
    return () => {
      if (trackingCleanup) {
        trackingCleanup()
        trackingCleanup = null
      }
    }
  }, [searchParams, trackEngagement, trackReferralClick, trackHighEngagement, trackContentConsumption])

  return null // This component doesn't render anything
}