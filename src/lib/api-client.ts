// API client for interacting with Netlify functions
export interface APIResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  details?: any
}

export interface ProgressiveCaptureRequest {
  level: 1 | 2 | 3
  data: {
    email: string
    phone?: string
    fullName?: string
    city?: string
  }
  userId?: string
  sessionId: string
  entryPoint?: string
}

export interface AssessmentSubmissionRequest {
  userId: string
  sessionId: string
  toolId: string
  toolName: string
  responses: Array<{
    questionId: string
    response: string | number | string[]
    timeSpent: number
  }>
  completionRate?: number
  timeSpent?: number
}

export interface EngagementUpdateRequest {
  userId: string
  sessionId: string
  engagementType: 'page_view' | 'scroll_depth' | 'time_on_page' | 'cta_click' | 'content_engagement' | 'tool_interaction'
  engagementData: {
    pageUrl?: string
    scrollDepth?: number
    timeSpent?: number
    ctaId?: string
    contentId?: string
    toolId?: string
    interactionValue?: number
  }
  timestamp?: string
}

export interface UserJourneyEvent {
  eventType: 'page_view' | 'section_view' | 'scroll_depth' | 'time_on_page' | 'cta_click' | 'content_engagement' | 'tool_interaction' | 'exit_intent'
  eventData: Record<string, unknown>
  sessionId: string
  userId?: string
  pageUrl?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  timestamp?: string
}

export interface InteractionRequest {
  userId?: string
  sessionId: string
  eventType: string
  eventData: Record<string, unknown>
  pageUrl?: string
  referrer?: string
  userAgent?: string
  ipAddress?: string
  timestamp?: string
}

export interface NotificationRequest {
  type: 'tier_change' | 'assessment_complete' | 'engagement_milestone' | 'webinar_reminder' | 'custom'
  userId: string
  data: Record<string, unknown>
  channels?: string[]
  immediate?: boolean
}

export interface EmailSequenceRequest {
  userId: string
  sequenceType: 'new_subscriber' | 'tool_user' | 'webinar_attendee' | 'tier_upgrade' | 'assessment_complete' | 'custom'
  triggerEvent: string
  customData?: Record<string, unknown>
  delay?: number
  immediate?: boolean
}

class APIClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8888/.netlify/functions'
      : '/.netlify/functions'
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data as APIResponse<T>
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      return {
        success: false,
        message: 'API request failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Progressive capture API
  async captureUserInfo(request: ProgressiveCaptureRequest): Promise<APIResponse> {
    return this.makeRequest('capture-user-info', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Assessment processing API
  async processAssessment(request: AssessmentSubmissionRequest): Promise<APIResponse> {
    return this.makeRequest('process-assessment', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Engagement scoring API
  async updateEngagementScore(request: EngagementUpdateRequest): Promise<APIResponse> {
    return this.makeRequest('update-engagement-score', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // User journey tracking API
  async trackUserJourney(event: UserJourneyEvent): Promise<APIResponse> {
    return this.makeRequest('track-user-journey', {
      method: 'POST',
      body: JSON.stringify(event)
    })
  }

  async getUserJourney(sessionId?: string, userId?: string): Promise<APIResponse> {
    const params = new URLSearchParams()
    if (sessionId) params.append('sessionId', sessionId)
    if (userId) params.append('userId', userId)
    
    return this.makeRequest(`track-user-journey?${params.toString()}`, {
      method: 'GET'
    })
  }

  // Interaction tracking API
  async trackInteraction(request: InteractionRequest): Promise<APIResponse> {
    return this.makeRequest('track-interaction', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async trackBatchInteractions(interactions: InteractionRequest[], sessionId: string, userId?: string): Promise<APIResponse> {
    return this.makeRequest('track-interaction', {
      method: 'POST',
      body: JSON.stringify({
        interactions,
        sessionId,
        userId
      })
    })
  }

  // Real-time notifications API
  async sendNotification(request: NotificationRequest): Promise<APIResponse> {
    return this.makeRequest('realtime-notifications', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async getNotificationStatus(userId: string, channel?: string): Promise<APIResponse> {
    const params = new URLSearchParams({ userId })
    if (channel) params.append('channel', channel)
    
    return this.makeRequest(`realtime-notifications?${params.toString()}`, {
      method: 'GET'
    })
  }

  // Email sequence API
  async triggerEmailSequence(request: EmailSequenceRequest): Promise<APIResponse> {
    return this.makeRequest('trigger-email-sequence', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async getEmailSequenceStatus(userId: string, sequenceType?: string): Promise<APIResponse> {
    const params = new URLSearchParams({ userId })
    if (sequenceType) params.append('sequenceType', sequenceType)
    
    return this.makeRequest(`trigger-email-sequence?${params.toString()}`, {
      method: 'GET'
    })
  }

  // Convenience methods for common operations
  async captureEmail(email: string, sessionId: string, entryPoint?: string): Promise<APIResponse> {
    return this.captureUserInfo({
      level: 1,
      data: { email },
      sessionId,
      entryPoint
    })
  }

  async capturePhone(email: string, phone: string, sessionId: string, userId?: string): Promise<APIResponse> {
    return this.captureUserInfo({
      level: 2,
      data: { email, phone },
      sessionId,
      userId
    })
  }

  async captureFullProfile(
    email: string, 
    phone: string, 
    fullName: string, 
    city: string, 
    sessionId: string, 
    userId?: string
  ): Promise<APIResponse> {
    return this.captureUserInfo({
      level: 3,
      data: { email, phone, fullName, city },
      sessionId,
      userId
    })
  }

  async trackPageView(
    pageUrl: string, 
    sessionId: string, 
    userId?: string, 
    referrer?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'page_view',
      eventData: { page_url: pageUrl },
      sessionId,
      userId,
      pageUrl,
      referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }

  async trackCTAClick(
    ctaId: string, 
    ctaText: string, 
    pageUrl: string, 
    sessionId: string, 
    userId?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'cta_click',
      eventData: {
        cta_id: ctaId,
        cta_text: ctaText,
        page_url: pageUrl
      },
      sessionId,
      userId,
      pageUrl,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }

  async trackScrollDepth(
    depth: number, 
    pageUrl: string, 
    sessionId: string, 
    userId?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'scroll_depth',
      eventData: {
        depth,
        page_url: pageUrl
      },
      sessionId,
      userId,
      pageUrl,
      timestamp: new Date().toISOString()
    })
  }

  async trackTimeOnPage(
    timeSpent: number, 
    pageUrl: string, 
    sessionId: string, 
    userId?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'time_on_page',
      eventData: {
        time_spent: timeSpent,
        page_url: pageUrl
      },
      sessionId,
      userId,
      pageUrl,
      timestamp: new Date().toISOString()
    })
  }

  async trackContentEngagement(
    contentId: string, 
    contentType: string, 
    timeSpent: number, 
    sessionId: string, 
    userId?: string,
    pageUrl?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'content_engagement',
      eventData: {
        content_id: contentId,
        content_type: contentType,
        time_spent: timeSpent
      },
      sessionId,
      userId,
      pageUrl,
      timestamp: new Date().toISOString()
    })
  }

  async trackToolStart(
    toolId: string, 
    toolName: string, 
    sessionId: string, 
    userId?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'tool_interaction',
      eventData: {
        tool_id: toolId,
        tool_name: toolName,
        interaction_type: 'start'
      },
      sessionId,
      userId,
      timestamp: new Date().toISOString()
    })
  }

  async trackToolComplete(
    toolId: string, 
    toolName: string, 
    completionRate: number, 
    timeSpent: number, 
    sessionId: string, 
    userId?: string
  ): Promise<APIResponse> {
    return this.trackUserJourney({
      eventType: 'tool_interaction',
      eventData: {
        tool_id: toolId,
        tool_name: toolName,
        interaction_type: 'complete',
        completion_rate: completionRate,
        time_spent: timeSpent
      },
      sessionId,
      userId,
      timestamp: new Date().toISOString()
    })
  }

  // Batch tracking for performance
  async trackBatchEvents(events: UserJourneyEvent[]): Promise<APIResponse> {
    const interactions = events.map(event => ({
      userId: event.userId,
      sessionId: event.sessionId,
      eventType: event.eventType,
      eventData: event.eventData,
      pageUrl: event.pageUrl,
      referrer: event.referrer,
      userAgent: event.userAgent || navigator.userAgent,
      ipAddress: event.ipAddress,
      timestamp: event.timestamp || new Date().toISOString()
    }))

    return this.trackBatchInteractions(
      interactions, 
      events[0]?.sessionId || '', 
      events[0]?.userId
    )
  }

  // Utility method to get current session info
  getSessionInfo(): { sessionId: string; userAgent: string; timestamp: string } {
    return {
      sessionId: this.getOrCreateSessionId(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }
}

// Export singleton instance
export const apiClient = new APIClient()

// Export individual methods for convenience
export const {
  captureUserInfo,
  processAssessment,
  updateEngagementScore,
  trackUserJourney,
  getUserJourney,
  trackInteraction,
  trackBatchInteractions,
  sendNotification,
  getNotificationStatus,
  triggerEmailSequence,
  getEmailSequenceStatus,
  captureEmail,
  capturePhone,
  captureFullProfile,
  trackPageView,
  trackCTAClick,
  trackScrollDepth,
  trackTimeOnPage,
  trackContentEngagement,
  trackToolStart,
  trackToolComplete,
  trackBatchEvents,
  getSessionInfo
} = apiClient