"use client"

import { useState, useEffect } from 'react'

interface EngagementEvent {
  type: 'hook_view' | 'hook_click' | 'question_click' | 'learn_more_click' | 'cta_click' | 'hook_expand' | 'progressive_disclosure_view' | 'benefit_interaction'
  section: string
  hookVariation?: string
  timestamp: number
  sessionId: string
  metadata?: {
    timeSpent?: number
    scrollDepth?: number
    clickPosition?: { x: number; y: number }
    deviceType?: string
    expandDuration?: number
  }
}

interface EngagementMetrics {
  hookViews: number
  hookClicks: number
  questionClicks: number
  learnMoreClicks: number
  ctaClicks: number
  hookExpands: number
  progressiveDisclosureViews: number
  conversionRate: number
  clickThroughRate: number
  averageTimeSpent: number
  hookEffectivenessScore: number
}

export function useEngagementTracking() {
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('session_id') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    }
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  })

  const trackEngagement = async (event: Omit<EngagementEvent, 'timestamp' | 'sessionId'>) => {
    const engagementEvent: EngagementEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId
    }

    try {
      // Store locally for immediate use
      if (typeof window !== 'undefined') {
        const existingEvents = JSON.parse(localStorage.getItem('engagement_events') || '[]')
        existingEvents.push(engagementEvent)
        localStorage.setItem('engagement_events', JSON.stringify(existingEvents))
      }

      // Send to backend for analytics
      await fetch('/api/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'engagement_tracking',
          data: engagementEvent
        }),
      })
    } catch (error) {
      console.error('Error tracking engagement:', error)
    }
  }

  const getEngagementMetrics = (section: string): EngagementMetrics => {
    if (typeof window === 'undefined') {
      return {
        hookViews: 0,
        hookClicks: 0,
        questionClicks: 0,
        learnMoreClicks: 0,
        ctaClicks: 0,
        hookExpands: 0,
        progressiveDisclosureViews: 0,
        conversionRate: 0,
        clickThroughRate: 0,
        averageTimeSpent: 0,
        hookEffectivenessScore: 0
      }
    }

    const events: EngagementEvent[] = JSON.parse(localStorage.getItem('engagement_events') || '[]')
    const sectionEvents = events.filter(event => event.section === section)

    const hookViews = sectionEvents.filter(event => event.type === 'hook_view').length
    const hookClicks = sectionEvents.filter(event => event.type === 'hook_click').length
    const questionClicks = sectionEvents.filter(event => event.type === 'question_click').length
    const learnMoreClicks = sectionEvents.filter(event => event.type === 'learn_more_click').length
    const ctaClicks = sectionEvents.filter(event => event.type === 'cta_click').length
    const hookExpands = sectionEvents.filter(event => event.type === 'hook_expand').length
    const progressiveDisclosureViews = sectionEvents.filter(event => event.type === 'progressive_disclosure_view').length

    // Calculate conversion rate (any engagement action / views)
    const totalEngagements = hookClicks + questionClicks + learnMoreClicks + ctaClicks
    const conversionRate = hookViews > 0 ? (totalEngagements / hookViews) * 100 : 0

    // Calculate click-through rate (clicks that lead to external pages / views)
    const externalClicks = questionClicks + learnMoreClicks
    const clickThroughRate = hookViews > 0 ? (externalClicks / hookViews) * 100 : 0

    // Calculate average time spent (from metadata)
    const eventsWithTime = sectionEvents.filter(event => event.metadata?.timeSpent)
    const averageTimeSpent = eventsWithTime.length > 0 
      ? eventsWithTime.reduce((sum, event) => sum + (event.metadata?.timeSpent || 0), 0) / eventsWithTime.length
      : 0

    // Calculate hook effectiveness score (weighted combination of metrics)
    const hookEffectivenessScore = Math.round(
      (conversionRate * 0.4) + 
      (clickThroughRate * 0.3) + 
      ((hookExpands / Math.max(hookViews, 1)) * 100 * 0.2) +
      ((progressiveDisclosureViews / Math.max(hookExpands, 1)) * 100 * 0.1)
    )

    return {
      hookViews,
      hookClicks,
      questionClicks,
      learnMoreClicks,
      ctaClicks,
      hookExpands,
      progressiveDisclosureViews,
      conversionRate,
      clickThroughRate,
      averageTimeSpent,
      hookEffectivenessScore
    }
  }

  return {
    trackEngagement,
    getEngagementMetrics,
    sessionId
  }
}