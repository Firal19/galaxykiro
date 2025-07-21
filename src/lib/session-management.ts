/**
 * Session Management System
 * 
 * Handles user session management, tracking, and analytics
 * for both authenticated and anonymous users.
 */

import { supabase } from './supabase'

// Session types
interface SessionData {
  id: string
  userId?: string
  sessionId: string
  startTime: Date
  lastActivity: Date
  duration: number
  pageViews: number
  interactions: number
  deviceInfo: DeviceInfo
  location?: LocationInfo
  referrer?: string
  utmParams?: UTMParams
  isActive: boolean
}

interface DeviceInfo {
  userAgent: string
  screenSize: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
  language: string
}

interface LocationInfo {
  country?: string
  region?: string
  city?: string
  timezone?: string
}

interface UTMParams {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

interface SessionAnalytics {
  totalSessions: number
  averageDuration: number
  bounceRate: number
  conversionRate: number
  topPages: Array<{ page: string; views: number }>
  deviceBreakdown: Record<string, number>
  trafficSources: Record<string, number>
}

class SessionManager {
  private sessions: Map<string, SessionData> = new Map()
  private currentSession?: SessionData
  private sessionTimeout: number = 30 * 60 * 1000 // 30 minutes

  constructor() {
    this.initializeSession()
    this.setupActivityTracking()
  }

  /**
   * Initialize a new session
   */
  private initializeSession(): void {
    const sessionId = this.generateSessionId()
    const deviceInfo = this.getDeviceInfo()

    this.currentSession = {
      id: sessionId,
      sessionId,
      startTime: new Date(),
      lastActivity: new Date(),
      duration: 0,
      pageViews: 0,
      interactions: 0,
      deviceInfo,
      isActive: true
    }

    this.sessions.set(sessionId, this.currentSession)
    this.saveSessionToStorage(sessionId)
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        screenSize: 'unknown',
        deviceType: 'desktop',
        browser: 'unknown',
        os: 'unknown',
        language: 'en'
      }
    }

    const userAgent = navigator.userAgent
    const screenSize = `${screen.width}x${screen.height}`
    
    // Determine device type
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = 'mobile'
    } else if (/iPad|Tablet/.test(userAgent)) {
      deviceType = 'tablet'
    }

    // Determine browser
    let browser = 'unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // Determine OS
    let os = 'unknown'
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'

    return {
      userAgent,
      screenSize,
      deviceType,
      browser,
      os,
      language: navigator.language || 'en'
    }
  }

  /**
   * Setup activity tracking
   */
  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return

    // Track page views
    this.trackPageView()

    // Track user interactions
    this.trackInteractions()

    // Track session duration
    this.trackSessionDuration()

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.endSession()
    })

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession()
      } else {
        this.resumeSession()
      }
    })
  }

  /**
   * Track page view
   */
  private trackPageView(): void {
    if (!this.currentSession) return

    this.currentSession.pageViews++
    this.updateLastActivity()

    // Track in analytics
    this.trackEvent('page_view', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer
    })
  }

  /**
   * Track user interactions
   */
  private trackInteractions(): void {
    if (typeof window === 'undefined') return

    const interactionEvents = ['click', 'scroll', 'input', 'submit']
    
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.updateLastActivity()
        this.currentSession!.interactions++
      }, { passive: true })
    })
  }

  /**
   * Track session duration
   */
  private trackSessionDuration(): void {
    if (typeof window === 'undefined') return

    setInterval(() => {
      if (this.currentSession && this.currentSession.isActive) {
        const now = new Date()
        this.currentSession.duration = now.getTime() - this.currentSession.startTime.getTime()
        this.currentSession.lastActivity = now
      }
    }, 60000) // Update every minute
  }

  /**
   * Update last activity timestamp
   */
  private updateLastActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date()
    }
  }

  /**
   * Pause session (when tab is hidden)
   */
  private pauseSession(): void {
    if (this.currentSession) {
      this.currentSession.isActive = false
    }
  }

  /**
   * Resume session (when tab becomes visible)
   */
  private resumeSession(): void {
    if (this.currentSession) {
      this.currentSession.isActive = true
      this.updateLastActivity()
    }
  }

  /**
   * End current session
   */
  private endSession(): void {
    if (this.currentSession) {
      this.currentSession.isActive = false
      this.currentSession.duration = Date.now() - this.currentSession.startTime.getTime()
      
      // Save session data
      this.saveSessionToDatabase(this.currentSession)
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventType: string, data?: Record<string, unknown>): void {
    if (!this.currentSession) return

    this.updateLastActivity()
    this.currentSession.interactions++

    // Send to analytics
    this.sendAnalyticsEvent(eventType, data)
  }

  /**
   * Send analytics event
   */
  private async sendAnalyticsEvent(eventType: string, data?: Record<string, unknown>): Promise<void> {
    try {
      const event = {
        sessionId: this.currentSession!.sessionId,
        userId: this.currentSession!.userId,
        eventType,
        data,
        timestamp: new Date().toISOString()
      }

      // Save to database
      await supabase
        .from('analytics_events')
        .insert(event)

    } catch (error) {
      console.error('Error sending analytics event:', error)
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession || null
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): SessionData | null {
    return this.sessions.get(sessionId) || null
  }

  /**
   * Get all sessions
   */
  getAllSessions(): SessionData[] {
    return Array.from(this.sessions.values())
  }

  /**
   * Update session with user ID (when user logs in)
   */
  updateSessionWithUser(userId: string): void {
    if (this.currentSession) {
      this.currentSession.userId = userId
      this.updateLastActivity()
    }
  }

  /**
   * Get session analytics
   */
  getSessionAnalytics(): SessionAnalytics {
    const sessions = this.getAllSessions()
    const totalSessions = sessions.length

    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        bounceRate: 0,
        conversionRate: 0,
        topPages: [],
        deviceBreakdown: {},
        trafficSources: {}
      }
    }

    // Calculate average duration
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0)
    const averageDuration = totalDuration / totalSessions

    // Calculate bounce rate (sessions with 1 page view)
    const bounceSessions = sessions.filter(session => session.pageViews <= 1).length
    const bounceRate = (bounceSessions / totalSessions) * 100

    // Calculate conversion rate (sessions with interactions > 5)
    const conversionSessions = sessions.filter(session => session.interactions > 5).length
    const conversionRate = (conversionSessions / totalSessions) * 100

    // Top pages (simplified - would need page tracking)
    const topPages: Array<{ page: string; views: number }> = [
      { page: '/', views: Math.floor(totalSessions * 0.8) },
      { page: '/tools', views: Math.floor(totalSessions * 0.3) },
      { page: '/webinars', views: Math.floor(totalSessions * 0.2) }
    ]

    // Device breakdown
    const deviceBreakdown: Record<string, number> = {}
    sessions.forEach(session => {
      const deviceType = session.deviceInfo.deviceType
      deviceBreakdown[deviceType] = (deviceBreakdown[deviceType] || 0) + 1
    })

    // Traffic sources (simplified)
    const trafficSources: Record<string, number> = {
      'direct': Math.floor(totalSessions * 0.4),
      'organic': Math.floor(totalSessions * 0.3),
      'social': Math.floor(totalSessions * 0.2),
      'referral': Math.floor(totalSessions * 0.1)
    }

    return {
      totalSessions,
      averageDuration,
      bounceRate,
      conversionRate,
      topPages,
      deviceBreakdown,
      trafficSources
    }
  }

  /**
   * Save session to localStorage
   */
  private saveSessionToStorage(sessionId: string): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('gdt_session_id', sessionId)
    } catch (error) {
      console.error('Error saving session to storage:', error)
    }
  }

  /**
   * Load session from localStorage
   */
  private loadSessionFromStorage(): string | null {
    if (typeof window === 'undefined') return null

    try {
      return localStorage.getItem('gdt_session_id')
    } catch (error) {
      console.error('Error loading session from storage:', error)
      return null
    }
  }

  /**
   * Save session to database
   */
  private async saveSessionToDatabase(session: SessionData): Promise<void> {
    try {
      const { error } = await supabase
        .from('sessions')
        .upsert({
          session_id: session.sessionId,
          user_id: session.userId,
          start_time: session.startTime.toISOString(),
          last_activity: session.lastActivity.toISOString(),
          duration: session.duration,
          page_views: session.pageViews,
          interactions: session.interactions,
          device_info: session.deviceInfo,
          location_info: session.location,
          referrer: session.referrer,
          utm_params: session.utmParams,
          is_active: session.isActive
        })

      if (error) {
        console.error('Error saving session to database:', error)
      }
    } catch (error) {
      console.error('Error saving session to database:', error)
    }
  }

  /**
   * Load sessions from database
   */
  async loadSessionsFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error loading sessions from database:', error)
        return
      }

      if (data) {
        data.forEach(row => {
          const session: SessionData = {
            id: row.session_id,
            userId: row.user_id,
            sessionId: row.session_id,
            startTime: new Date(row.start_time),
            lastActivity: new Date(row.last_activity),
            duration: row.duration,
            pageViews: row.page_views,
            interactions: row.interactions,
            deviceInfo: row.device_info,
            location: row.location_info,
            referrer: row.referrer,
            utmParams: row.utm_params,
            isActive: row.is_active
          }

          this.sessions.set(row.session_id, session)
        })
      }
    } catch (error) {
      console.error('Error loading sessions from database:', error)
    }
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = Date.now()
    const expiredSessions: string[] = []

    this.sessions.forEach((session, sessionId) => {
      const timeSinceLastActivity = now - session.lastActivity.getTime()
      if (timeSinceLastActivity > this.sessionTimeout) {
        expiredSessions.push(sessionId)
      }
    })

    expiredSessions.forEach(sessionId => {
      this.sessions.delete(sessionId)
    })
  }

  /**
   * Get session statistics
   */
  getSessionStatistics(): {
    totalSessions: number
    activeSessions: number
    averageSessionDuration: number
    totalPageViews: number
    totalInteractions: number
  } {
    const sessions = this.getAllSessions()
    const totalSessions = sessions.length
    const activeSessions = sessions.filter(session => session.isActive).length

    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0)
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0

    const totalPageViews = sessions.reduce((sum, session) => sum + session.pageViews, 0)
    const totalInteractions = sessions.reduce((sum, session) => sum + session.interactions, 0)

    return {
      totalSessions,
      activeSessions,
      averageSessionDuration,
      totalPageViews,
      totalInteractions
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager()

// Hook for React components
export function useSessionManager() {
  return {
    getCurrentSession: () => sessionManager.getCurrentSession(),
    getSession: (sessionId: string) => sessionManager.getSession(sessionId),
    getAllSessions: () => sessionManager.getAllSessions(),
    updateSessionWithUser: (userId: string) => sessionManager.updateSessionWithUser(userId),
    trackEvent: (eventType: string, data?: Record<string, unknown>) => 
      sessionManager.trackEvent(eventType, data),
    getSessionAnalytics: () => sessionManager.getSessionAnalytics(),
    getSessionStatistics: () => sessionManager.getSessionStatistics()
  }
}