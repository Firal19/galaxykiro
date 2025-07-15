import { supabase } from '../../lib/supabase'
import { InteractionCreateData } from './validations'

export interface UserJourneyEvent {
  userId?: string
  sessionId?: string
  eventType: string
  eventData: Record<string, unknown>
  pageUrl?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
}

export interface AttributionData {
  memberId?: string
  postId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  referrer?: string
  entryPoint?: string
  timestamp: string
}

class TrackingService {
  private sessionId: string
  private attributionData: AttributionData | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeAttribution()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeAttribution() {
    if (typeof window === 'undefined') return

    // Get attribution data from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer

    this.attributionData = {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmTerm: urlParams.get('utm_term') || undefined,
      utmContent: urlParams.get('utm_content') || undefined,
      referrer: referrer || undefined,
      entryPoint: window.location.pathname,
      timestamp: new Date().toISOString()
    }

    // Parse member URL if present
    const memberUrl = urlParams.get('ref') || urlParams.get('member')
    if (memberUrl) {
      const memberInfo = this.parseMemberUrl(memberUrl)
      if (memberInfo) {
        this.attributionData.memberId = memberInfo.memberId
        this.attributionData.postId = memberInfo.postId
      }
    }

    // Store attribution data in localStorage for 30-day tracking
    this.storeAttribution()
  }

  private parseMemberUrl(memberUrl: string): { memberId: string; postId: string } | null {
    // Parse MEMBERID_POSTID format
    const match = memberUrl.match(/([A-Z0-9]+)_([A-Z0-9]+)/)
    if (!match) return null

    return {
      memberId: match[1],
      postId: match[2]
    }
  }

  private storeAttribution() {
    if (typeof window === 'undefined' || !this.attributionData) return

    try {
      // Store in localStorage for 30-day attribution
      const attributionKey = 'gdt_attribution'
      const existingAttribution = localStorage.getItem(attributionKey)
      
      if (!existingAttribution) {
        // Only store if this is the first visit
        localStorage.setItem(attributionKey, JSON.stringify({
          ...this.attributionData,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        }))
      }

      // Also store in cookies as backup
      this.setCookie('gdt_attribution', JSON.stringify(this.attributionData), 30)
      this.setCookie('gdt_session', this.sessionId, 1) // Session cookie for 1 day
    } catch (error) {
      console.error('Failed to store attribution data:', error)
    }
  }

  private setCookie(name: string, value: string, days: number) {
    if (typeof document === 'undefined') return

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null

    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  }

  // Get current attribution data
  getAttributionData(): AttributionData | null {
    if (this.attributionData) return this.attributionData

    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gdt_attribution')
        if (stored) {
          const parsed = JSON.parse(stored)
          // Check if not expired
          if (new Date(parsed.expiresAt) > new Date()) {
            this.attributionData = parsed
            return this.attributionData
          } else {
            // Clean up expired data
            localStorage.removeItem('gdt_attribution')
          }
        }

        // Fallback to cookies
        const cookieData = this.getCookie('gdt_attribution')
        if (cookieData) {
          this.attributionData = JSON.parse(cookieData)
          return this.attributionData
        }
      } catch (error) {
        console.error('Failed to retrieve attribution data:', error)
      }
    }

    return null
  }

  // Get current session ID
  getSessionId(): string {
    // Try to get from cookie first
    if (typeof window !== 'undefined') {
      const cookieSessionId = this.getCookie('gdt_session')
      if (cookieSessionId) {
        this.sessionId = cookieSessionId
        return this.sessionId
      }
    }

    return this.sessionId
  }

  // Track user journey event
  async trackUserJourney(event: UserJourneyEvent): Promise<void> {
    try {
      const attribution = this.getAttributionData()
      const sessionId = event.sessionId || this.getSessionId()

      const interactionData: InteractionCreateData = {
        user_id: event.userId,
        session_id: sessionId,
        event_type: event.eventType,
        event_data: {
          ...event.eventData,
          attribution: attribution,
          timestamp: new Date().toISOString()
        },
        page_url: event.pageUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
        referrer: event.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
        user_agent: event.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
        ip_address: event.ipAddress // This would typically be set server-side
      }

      const { error } = await supabase
        .from('interactions')
        .insert(interactionData)

      if (error) {
        console.error('Failed to track user journey:', error)
      }
    } catch (error) {
      console.error('Error tracking user journey:', error)
    }
  }

  // Track page view
  async trackPageView(userId?: string, additionalData?: Record<string, unknown>): Promise<void> {
    if (typeof window === 'undefined') return

    await this.trackUserJourney({
      userId,
      eventType: 'page_view',
      eventData: {
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        title: document.title,
        ...additionalData
      },
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    })
  }

  // Track section view
  async trackSectionView(sectionId: string, userId?: string, additionalData?: Record<string, unknown>): Promise<void> {
    await this.trackUserJourney({
      userId,
      eventType: 'section_view',
      eventData: {
        sectionId,
        ...additionalData
      }
    })
  }

  // Track tool usage
  async trackToolUsage(toolId: string, action: string, userId?: string, additionalData?: Record<string, unknown>): Promise<void> {
    await this.trackUserJourney({
      userId,
      eventType: 'tool_usage',
      eventData: {
        toolId,
        action,
        ...additionalData
      }
    })
  }

  // Track CTA click
  async trackCTAClick(ctaId: string, ctaType: string, userId?: string, additionalData?: Record<string, unknown>): Promise<void> {
    await this.trackUserJourney({
      userId,
      eventType: 'cta_click',
      eventData: {
        ctaId,
        ctaType,
        ...additionalData
      }
    })
  }

  // Track form submission
  async trackFormSubmission(formId: string, formType: string, userId?: string, additionalData?: Record<string, unknown>): Promise<void> {
    await this.trackUserJourney({
      userId,
      eventType: 'form_submission',
      eventData: {
        formId,
        formType,
        ...additionalData
      }
    })
  }

  // Track content engagement
  async trackContentEngagement(contentId: string, engagementType: string, userId?: string, additionalData?: Record<string, unknown>): Promise<void> {
    await this.trackUserJourney({
      userId,
      eventType: 'content_engagement',
      eventData: {
        contentId,
        engagementType,
        ...additionalData
      }
    })
  }

  // Update session with user ID when user authenticates
  updateSessionWithUser(userId: string): void {
    if (typeof window !== 'undefined') {
      this.setCookie('gdt_user_session', userId, 30) // 30-day user session
    }
  }

  // Clear tracking data (for privacy compliance)
  clearTrackingData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gdt_attribution')
      
      // Clear cookies
      document.cookie = 'gdt_attribution=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'gdt_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'gdt_user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }

    this.attributionData = null
    this.sessionId = this.generateSessionId()
  }

  // Get user session from cookie
  getUserSessionId(): string | null {
    return this.getCookie('gdt_user_session')
  }
}

// Export singleton instance
export const trackingService = new TrackingService()