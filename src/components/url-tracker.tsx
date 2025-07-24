"use client"

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function UrlTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Engagement scoring system based on master plan
    const updateEngagementScore = async (points: number, action: string) => {
      try {
        const currentScore = parseInt(localStorage.getItem('engagement_score') || '0')
        const newScore = currentScore + points
        localStorage.setItem('engagement_score', newScore.toString())

        // Automatic lead status progression per master plan
        const currentStatus = localStorage.getItem('visitor_status') || 'visitor'
        let newStatus = currentStatus

        // Visitor → Cold Lead: 2+ minutes on site OR tool usage
        if (currentStatus === 'visitor' && (newScore >= 15 || action === 'tool_used')) {
          newStatus = 'cold_lead'
        }
        // Cold Lead → Candidate: Email provided + basic info
        else if (currentStatus === 'cold_lead' && (action === 'email_verified' || action === 'registration_complete')) {
          newStatus = 'candidate'  
        }
        // Candidate → Hot Lead: High engagement + webinar registration
        else if (currentStatus === 'candidate' && (newScore >= 100 || action === 'webinar_registered')) {
          newStatus = 'hot_lead'
        }

        if (newStatus !== currentStatus) {
          localStorage.setItem('visitor_status', newStatus)
          
          // Track status change
          await fetch('/api/track-interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_type: 'status_progression',
              event_data: {
                previous_status: currentStatus,
                new_status: newStatus,
                trigger_action: action,
                engagement_score: newScore,
                timestamp: new Date().toISOString()
              },
              session_id: localStorage.getItem('session_id'),
              page_url: window.location.href
            })
          }).catch(console.error)
        }

        // Track engagement action
        await fetch('/api/track-interaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'engagement_action',
            event_data: {
              action: action,
              points_awarded: points,
              total_score: newScore,
              visitor_status: newStatus,
              timestamp: new Date().toISOString()
            },
            session_id: localStorage.getItem('session_id'),
            page_url: window.location.href
          })
        }).catch(console.error)

      } catch (error) {
        console.error('Error updating engagement score:', error)
      }
    }

    const trackVisitor = async () => {
      try {
        // Extract URL parameters
        const contentId = searchParams.get('c')
        const memberId = searchParams.get('m') 
        const platform = searchParams.get('p')
        const referrer = document.referrer
        const currentUrl = window.location.href

        // Generate or get session ID
        let sessionId = localStorage.getItem('session_id')
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
          localStorage.setItem('session_id', sessionId)
        }

        // Enhanced tracking with lead scoring preparation
        const trackingData = {
          event_type: 'page_visit',
          event_data: {
            content_id: contentId,
            member_id: memberId,
            platform: platform,
            referrer: referrer,
            current_url: currentUrl,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            is_initial_visit: !localStorage.getItem('returning_visitor'),
            visitor_type: localStorage.getItem('visitor_status') || 'visitor',
            engagement_score: parseInt(localStorage.getItem('engagement_score') || '0'),
            visit_count: parseInt(localStorage.getItem('visit_count') || '0') + 1
          },
          session_id: sessionId,
          page_url: currentUrl,
          referrer: referrer
        }

        // Update local visitor metrics
        localStorage.setItem('returning_visitor', 'true')
        localStorage.setItem('visit_count', trackingData.event_data.visit_count.toString())
        localStorage.setItem('last_visit', new Date().toISOString())

        // Store attribution data for later use
        if (contentId || memberId || platform) {
          const attributionData = {
            content_id: contentId,
            member_id: memberId, 
            platform: platform,
            referrer: referrer,
            entry_timestamp: new Date().toISOString()
          }
          localStorage.setItem('attribution_data', JSON.stringify(attributionData))
        }

        // Send tracking data to backend
        await fetch('/api/track-interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackingData),
        })

        // Track time on page
        let startTime = Date.now()
        const trackTimeOnPage = () => {
          const timeSpent = Date.now() - startTime
          if (timeSpent > 10000) { // Only track if spent more than 10 seconds
            fetch('/api/track-interaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event_type: 'time_on_page',
                event_data: {
                  time_spent: timeSpent,
                  page_url: currentUrl
                },
                session_id: sessionId,
                page_url: currentUrl
              }),
            }).catch(console.error)
          }
        }

        // Track when user leaves page
        window.addEventListener('beforeunload', trackTimeOnPage)
        
        // Track when user becomes inactive
        let inactivityTimer: NodeJS.Timeout
        const resetInactivityTimer = () => {
          clearTimeout(inactivityTimer)
          inactivityTimer = setTimeout(() => {
            fetch('/api/track-interaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event_type: 'user_inactive',
                event_data: {
                  inactive_duration: 300000, // 5 minutes
                  page_url: currentUrl
                },
                session_id: sessionId,
                page_url: currentUrl
              }),
            }).catch(console.error)
          }, 300000) // 5 minutes
        }

        // Reset timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
          window.addEventListener(event, resetInactivityTimer)
        })

        resetInactivityTimer()

        // Enhanced engagement tracking
        const trackEngagements = () => {
          // Track scroll depth
          let maxScroll = 0
          const trackScrollDepth = () => {
            const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100)
            if (scrollPercent > maxScroll) {
              maxScroll = scrollPercent
              if (scrollPercent >= 25 && scrollPercent < 50) {
                updateEngagementScore(2, 'scroll_25')
              } else if (scrollPercent >= 50 && scrollPercent < 75) {
                updateEngagementScore(3, 'scroll_50')
              } else if (scrollPercent >= 75) {
                updateEngagementScore(5, 'scroll_75')
              }
            }
          }

          // Track click interactions
          const trackClicks = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (target.tagName === 'A' || target.closest('a')) {
              updateEngagementScore(3, 'link_click')
            } else if (target.tagName === 'BUTTON' || target.closest('button')) {
              updateEngagementScore(5, 'button_click')
            }
          }

          // Track form interactions
          const trackFormInteractions = (event: Event) => {
            const target = event.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
              updateEngagementScore(10, 'form_interaction')
            }
          }

          window.addEventListener('scroll', trackScrollDepth)
          window.addEventListener('click', trackClicks)
          window.addEventListener('input', trackFormInteractions)

          return () => {
            window.removeEventListener('scroll', trackScrollDepth)
            window.removeEventListener('click', trackClicks)
            window.removeEventListener('input', trackFormInteractions)
          }
        }

        const cleanupEngagement = trackEngagements()

        return () => {
          window.removeEventListener('beforeunload', trackTimeOnPage)
          clearTimeout(inactivityTimer)
          cleanupEngagement()
        }

      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }

    trackVisitor()
  }, [searchParams])

  return null // This component doesn't render anything
}