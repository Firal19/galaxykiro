import { supabase } from '../../lib/supabase'
import { trackingService } from './tracking'
import { behavioralAnalysis } from './behavioral-analysis'

export interface SessionData {
  sessionId: string
  userId?: string
  startTime: Date
  lastActivity: Date
  pageViews: number
  interactions: number
  engagementScore: number
  isActive: boolean
  deviceInfo: {
    userAgent: string
    screenResolution: string
    isMobile: boolean
    browserName: string
  }
  attribution: {
    source?: string
    medium?: string
    campaign?: string
    referrer?: string
    entryPoint: string
  }
}

export interface SessionMetrics {
  totalSessions: number
  activeSessions: number
  averageSessionDuration: number
  bounceRate: number
  pagesPerSession: number
  conversionRate: number
  topEntryPoints: Array<{ page: string; sessions: number; conversionRate: number }>
  deviceBreakdown: { mobile: number; desktop: number; tablet: number }
}

class SessionManager {
  private static instance: SessionManager
  private activeSessions: Map<string, SessionData> = new Map()
  private sessionTimeouts: Map<string, NodeJS.Timeout> = new Map()
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  private readonly HEARTBEAT_INTERVAL = 60 * 1000 // 1 minute

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  // Initialize session tracking
  async initializeSession(userId?: string): Promise<string> {
    const sessionId = this.generateSessionId()
    const deviceInfo = this.getDeviceInfo()
    const attribution = await this.getAttributionData()

    const sessionData: SessionData = {
      sessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      pageViews: 0,
      interactions: 0,
      engagementScore: 0,
      isActive: true,
      deviceInfo,
      attribution
    }

    // Store session data
    this.activeSessions.set(sessionId, sessionData)

    // Set up session timeout
    this.resetSessionTimeout(sessionId)

    // Track session start
    await this.trackSessionEvent(sessionId, 'session_start', {
      deviceInfo,
      attribution,
      userId
    })

    // Start heartbeat for active sessions
    this.startHeartbeat(sessionId)

    return sessionId
  }

  // Update session activity
  async updateSessionActivity(
    sessionId: string, 
    activityType: 'page_view' | 'interaction' | 'engagement',
    activityData?: Record<string, unknown>
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (!session || !session.isActive) return

    // Update session data
    session.lastActivity = new Date()
    
    switch (activityType) {
      case 'page_view':
        session.pageViews++
        break
      case 'interaction':
        session.interactions++
        break
      case 'engagement':
        const scoreIncrement = activityData?.scoreIncrement as number || 1
        session.engagementScore += scoreIncrement
        break
    }

    // Reset timeout
    this.resetSessionTimeout(sessionId)

    // Track activity
    await this.trackSessionEvent(sessionId, `session_${activityType}`, {
      ...activityData,
      sessionDuration: Date.now() - session.startTime.getTime(),
      totalPageViews: session.pageViews,
      totalInteractions: session.interactions,
      currentEngagementScore: session.engagementScore
    })

    // Update stored session
    this.activeSessions.set(sessionId, session)
  }

  // End session
  async endSession(sessionId: string, reason: 'timeout' | 'explicit' | 'page_unload'): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (!session) return

    // Calculate final metrics
    const sessionDuration = Date.now() - session.startTime.getTime()
    const finalMetrics = {
      sessionId,
      userId: session.userId,
      duration: sessionDuration,
      pageViews: session.pageViews,
      interactions: session.interactions,
      engagementScore: session.engagementScore,
      endReason: reason,
      deviceInfo: session.deviceInfo,
      attribution: session.attribution
    }

    // Track session end
    await this.trackSessionEvent(sessionId, 'session_end', finalMetrics)

    // Store session summary in database
    await this.storeSessionSummary(finalMetrics)

    // Clean up
    session.isActive = false
    this.clearSessionTimeout(sessionId)
    this.activeSessions.delete(sessionId)

    // Trigger behavioral analysis if user is identified
    if (session.userId) {
      try {
        await behavioralAnalysis.analyzeSession(sessionId, session.userId)
      } catch (error) {
        console.error('Failed to analyze session:', error)
      }
    }
  }

  // Get session data
  getSession(sessionId: string): SessionData | null {
    return this.activeSessions.get(sessionId) || null
  }

  // Get all active sessions
  getActiveSessions(): SessionData[] {
    return Array.from(this.activeSessions.values()).filter(session => session.isActive)
  }

  // Get session metrics
  async getSessionMetrics(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<SessionMetrics> {
    const hoursBack = {
      '24h': 24,
      '7d': 24 * 7,
      '30d': 24 * 30
    }[timeRange]

    const startDate = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString()

    // Get session data from database
    const { data: sessions, error } = await supabase
      .from('interactions')
      .select('session_id, event_type, event_data, timestamp, user_id')
      .eq('event_type', 'session_end')
      .gte('timestamp', startDate)

    if (error) {
      console.error('Failed to get session metrics:', error)
      return this.getEmptyMetrics()
    }

    // Calculate metrics
    const totalSessions = sessions.length
    const activeSessions = this.activeSessions.size

    // Calculate average session duration
    const durations = sessions
      .map(s => s.event_data?.duration as number || 0)
      .filter(d => d > 0)
    
    const averageSessionDuration = durations.length > 0 
      ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length 
      : 0

    // Calculate bounce rate (sessions with only 1 page view)
    const bounces = sessions.filter(s => (s.event_data?.pageViews as number || 0) <= 1).length
    const bounceRate = totalSessions > 0 ? bounces / totalSessions : 0

    // Calculate pages per session
    const totalPageViews = sessions.reduce((sum, s) => sum + (s.event_data?.pageViews as number || 0), 0)
    const pagesPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0

    // Calculate conversion rate (sessions that resulted in conversions)
    const conversions = sessions.filter(s => (s.event_data?.engagementScore as number || 0) > 70).length
    const conversionRate = totalSessions > 0 ? conversions / totalSessions : 0

    // Get top entry points
    const entryPoints: Record<string, { sessions: number; conversions: number }> = {}
    sessions.forEach(session => {
      const entryPoint = session.event_data?.attribution?.entryPoint as string || 'unknown'
      if (!entryPoints[entryPoint]) {
        entryPoints[entryPoint] = { sessions: 0, conversions: 0 }
      }
      entryPoints[entryPoint].sessions++
      if ((session.event_data?.engagementScore as number || 0) > 70) {
        entryPoints[entryPoint].conversions++
      }
    })

    const topEntryPoints = Object.entries(entryPoints)
      .map(([page, data]) => ({
        page,
        sessions: data.sessions,
        conversionRate: data.sessions > 0 ? data.conversions / data.sessions : 0
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5)

    // Get device breakdown
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 }
    sessions.forEach(session => {
      const isMobile = session.event_data?.deviceInfo?.isMobile as boolean
      if (isMobile) {
        deviceCounts.mobile++
      } else {
        deviceCounts.desktop++
      }
    })

    return {
      totalSessions,
      activeSessions,
      averageSessionDuration,
      bounceRate,
      pagesPerSession,
      conversionRate,
      topEntryPoints,
      deviceBreakdown: deviceCounts
    }
  }

  // Private helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        screenResolution: '',
        isMobile: false,
        browserName: 'unknown'
      }
    }

    const userAgent = navigator.userAgent
    const screenResolution = `${screen.width}x${screen.height}`
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    let browserName = 'unknown'
    if (userAgent.includes('Chrome')) browserName = 'Chrome'
    else if (userAgent.includes('Firefox')) browserName = 'Firefox'
    else if (userAgent.includes('Safari')) browserName = 'Safari'
    else if (userAgent.includes('Edge')) browserName = 'Edge'

    return {
      userAgent,
      screenResolution,
      isMobile,
      browserName
    }
  }

  private async getAttributionData() {
    const attribution = trackingService.getAttributionData()
    return {
      source: attribution?.utmSource,
      medium: attribution?.utmMedium,
      campaign: attribution?.utmCampaign,
      referrer: attribution?.referrer,
      entryPoint: attribution?.entryPoint || (typeof window !== 'undefined' ? window.location.pathname : '/')
    }
  }

  private resetSessionTimeout(sessionId: string): void {
    // Clear existing timeout
    this.clearSessionTimeout(sessionId)

    // Set new timeout
    const timeout = setTimeout(() => {
      this.endSession(sessionId, 'timeout')
    }, this.SESSION_TIMEOUT)

    this.sessionTimeouts.set(sessionId, timeout)
  }

  private clearSessionTimeout(sessionId: string): void {
    const timeout = this.sessionTimeouts.get(sessionId)
    if (timeout) {
      clearTimeout(timeout)
      this.sessionTimeouts.delete(sessionId)
    }
  }

  private startHeartbeat(sessionId: string): void {
    const heartbeat = setInterval(async () => {
      const session = this.activeSessions.get(sessionId)
      if (!session || !session.isActive) {
        clearInterval(heartbeat)
        return
      }

      // Send heartbeat
      await this.trackSessionEvent(sessionId, 'session_heartbeat', {
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - session.startTime.getTime()
      })
    }, this.HEARTBEAT_INTERVAL)
  }

  private async trackSessionEvent(
    sessionId: string, 
    eventType: string, 
    eventData: Record<string, unknown>
  ): Promise<void> {
    try {
      const session = this.activeSessions.get(sessionId)
      await trackingService.trackUserJourney({
        userId: session?.userId,
        sessionId,
        eventType,
        eventData,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: session?.deviceInfo.userAgent
      })
    } catch (error) {
      console.error('Failed to track session event:', error)
    }
  }

  private async storeSessionSummary(metrics: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('session_summaries')
        .insert({
          session_id: metrics.sessionId,
          user_id: metrics.userId,
          duration: metrics.duration,
          page_views: metrics.pageViews,
          interactions: metrics.interactions,
          engagement_score: metrics.engagementScore,
          end_reason: metrics.endReason,
          device_info: metrics.deviceInfo,
          attribution: metrics.attribution,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Failed to store session summary:', error)
      }
    } catch (error) {
      console.error('Error storing session summary:', error)
    }
  }

  private getEmptyMetrics(): SessionMetrics {
    return {
      totalSessions: 0,
      activeSessions: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      pagesPerSession: 0,
      conversionRate: 0,
      topEntryPoints: [],
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
    }
  }

  // Cleanup method for when the page is about to unload
  async cleanup(): Promise<void> {
    const activeSessions = Array.from(this.activeSessions.keys())
    
    // End all active sessions
    await Promise.all(
      activeSessions.map(sessionId => 
        this.endSession(sessionId, 'page_unload')
      )
    )

    // Clear all timeouts
    this.sessionTimeouts.forEach(timeout => clearTimeout(timeout))
    this.sessionTimeouts.clear()
    this.activeSessions.clear()
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance()

// Set up page unload handler
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionManager.cleanup()
  })

  // Also handle visibility change for mobile browsers
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Page is being hidden, potentially ending session
      const activeSessions = sessionManager.getActiveSessions()
      activeSessions.forEach(session => {
        sessionManager.updateSessionActivity(session.sessionId, 'interaction', {
          type: 'visibility_hidden',
          timestamp: new Date().toISOString()
        })
      })
    }
  })
}