/**
 * Comprehensive Lead Scoring and Conversion Pipeline Service
 * Based on Galaxy Dream Team Master Project Plan
 */

export type VisitorStatus = 'visitor' | 'cold_lead' | 'candidate' | 'hot_lead'
export type ConversionTrigger = 'time_on_site' | 'tool_usage' | 'form_interaction' | 'content_consumption' | 'email_verified' | 'registration_complete' | 'webinar_registered' | 'high_engagement' | 'referral_click' | 'social_share'

export interface EngagementAction {
  action: ConversionTrigger
  points: number
  weight: number
  description: string
  category: 'behavioral' | 'demographic' | 'firmographic' | 'engagement'
}

export interface LeadProfile {
  id: string
  status: VisitorStatus
  engagementScore: number
  demographicScore: number
  behavioralScore: number
  conversionReadiness: number
  lastActivity: string
  source: string
  attributionData?: {
    content_id?: string
    member_id?: string
    platform?: string
    referrer?: string
  }
  activities: EngagementActivity[]
  predictions: LeadPredictions
}

export interface EngagementActivity {
  timestamp: string
  action: ConversionTrigger
  points: number
  page_url: string
  metadata?: Record<string, any>
}

export interface LeadPredictions {
  conversionProbability: number
  timeToConversion: number // in days
  bestConversionPath: string[]
  nextBestAction: string
  riskOfChurn: number
}

// Engagement scoring matrix based on master plan
export const ENGAGEMENT_ACTIONS: Record<ConversionTrigger, EngagementAction> = {
  time_on_site: {
    action: 'time_on_site',
    points: 1, // per minute
    weight: 1.0,
    description: 'Time spent on site',
    category: 'behavioral'
  },
  tool_usage: {
    action: 'tool_usage',
    points: 20,
    weight: 2.5,
    description: 'Used assessment tool',
    category: 'engagement'
  },
  form_interaction: {
    action: 'form_interaction',
    points: 15,
    weight: 2.0,
    description: 'Interacted with form',
    category: 'engagement'
  },
  content_consumption: {
    action: 'content_consumption',
    points: 5,
    weight: 1.2,
    description: 'Consumed content',
    category: 'behavioral'
  },
  email_verified: {
    action: 'email_verified',
    points: 50,
    weight: 3.0,
    description: 'Verified email address',
    category: 'demographic'
  },
  registration_complete: {
    action: 'registration_complete',
    points: 75,
    weight: 4.0,
    description: 'Completed registration',
    category: 'demographic'
  },
  webinar_registered: {
    action: 'webinar_registered',
    points: 100,
    weight: 5.0,
    description: 'Registered for webinar',
    category: 'engagement'
  },
  high_engagement: {
    action: 'high_engagement',
    points: 30,
    weight: 2.0,
    description: 'High engagement session',
    category: 'behavioral'
  },
  referral_click: {
    action: 'referral_click',
    points: 10,
    weight: 1.5,
    description: 'Clicked referral link',
    category: 'behavioral'
  },
  social_share: {
    action: 'social_share',
    points: 25,
    weight: 2.0,
    description: 'Shared content socially',
    category: 'engagement'
  }
}

// Lead status thresholds and requirements
export const STATUS_REQUIREMENTS = {
  visitor: {
    minScore: 0,
    maxScore: 14,
    requirements: [],
    description: 'Initial visitor - exploring content'
  },
  cold_lead: {
    minScore: 15,
    maxScore: 74,
    requirements: ['time_on_site_2min', 'tool_usage'],
    description: 'Engaged visitor - showing interest'
  },
  candidate: {
    minScore: 75,
    maxScore: 149,
    requirements: ['email_verified', 'registration_complete'],
    description: 'Qualified prospect - provided contact info'
  },
  hot_lead: {
    minScore: 150,
    maxScore: Infinity,
    requirements: ['webinar_registered', 'high_engagement'],
    description: 'Sales-ready lead - high conversion probability'
  }
}

class LeadScoringService {
  private static instance: LeadScoringService
  private leadProfiles: Map<string, LeadProfile> = new Map()

  private constructor() {
    this.initializeFromStorage()
  }

  public static getInstance(): LeadScoringService {
    if (!LeadScoringService.instance) {
      LeadScoringService.instance = new LeadScoringService()
    }
    return LeadScoringService.instance
  }

  /**
   * Initialize lead profiles from localStorage
   */
  private initializeFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const sessionId = localStorage.getItem('session_id') || this.generateSessionId()
      const existingProfile = localStorage.getItem(`lead_profile_${sessionId}`)
      
      if (existingProfile) {
        const profile = JSON.parse(existingProfile)
        this.leadProfiles.set(sessionId, profile)
      } else {
        this.createNewLeadProfile(sessionId)
      }
    } catch (error) {
      console.error('Error initializing lead scoring from storage:', error)
    }
  }

  /**
   * Create a new lead profile
   */
  private createNewLeadProfile(sessionId: string): LeadProfile {
    const profile: LeadProfile = {
      id: sessionId,
      status: 'visitor',
      engagementScore: 0,
      demographicScore: 0,
      behavioralScore: 0,
      conversionReadiness: 0,
      lastActivity: new Date().toISOString(),
      source: document.referrer || 'direct',
      attributionData: this.getAttributionData(),
      activities: [],
      predictions: {
        conversionProbability: 0.1,
        timeToConversion: 30,
        bestConversionPath: ['tool_usage', 'email_verified', 'webinar_registered'],
        nextBestAction: 'Use assessment tool',
        riskOfChurn: 0.8
      }
    }

    this.leadProfiles.set(sessionId, profile)
    this.saveToStorage(sessionId, profile)
    return profile
  }

  /**
   * Get attribution data from URL parameters
   */
  private getAttributionData() {
    if (typeof window === 'undefined') return undefined

    const urlParams = new URLSearchParams(window.location.search)
    return {
      content_id: urlParams.get('c') || undefined,
      member_id: urlParams.get('m') || undefined,
      platform: urlParams.get('p') || undefined,
      referrer: document.referrer || undefined
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    localStorage.setItem('session_id', sessionId)
    return sessionId
  }

  /**
   * Update engagement score and trigger conversions
   */
  public async updateEngagement(
    action: ConversionTrigger,
    metadata?: Record<string, any>
  ): Promise<LeadProfile> {
    const sessionId = localStorage.getItem('session_id') || this.generateSessionId()
    let profile = this.leadProfiles.get(sessionId) || this.createNewLeadProfile(sessionId)

    const engagementAction = ENGAGEMENT_ACTIONS[action]
    if (!engagementAction) {
      throw new Error(`Unknown engagement action: ${action}`)
    }

    // Calculate points with weight multiplier
    let points = engagementAction.points
    if (metadata?.multiplier) {
      points *= metadata.multiplier
    }

    // Add to engagement score
    profile.engagementScore += points

    // Update category-specific scores
    switch (engagementAction.category) {
      case 'behavioral':
        profile.behavioralScore += points
        break
      case 'demographic':
        profile.demographicScore += points
        break
      case 'engagement':
        // Engagement actions contribute to both engagement and behavioral scores
        profile.behavioralScore += Math.floor(points * 0.5)
        break
    }

    // Record activity
    const activity: EngagementActivity = {
      timestamp: new Date().toISOString(),
      action,
      points,
      page_url: window.location.href,
      metadata
    }
    
    // Ensure activities array exists
    if (!profile.activities) {
      profile.activities = []
    }
    profile.activities.push(activity)
    profile.lastActivity = activity.timestamp

    // Check for status progression
    const previousStatus = profile.status
    profile.status = this.calculateLeadStatus(profile)

    // Update conversion readiness and predictions
    profile.conversionReadiness = this.calculateConversionReadiness(profile)
    profile.predictions = this.generatePredictions(profile)

    // Save updated profile
    this.leadProfiles.set(sessionId, profile)
    this.saveToStorage(sessionId, profile)

    // Track status change
    if (previousStatus !== profile.status) {
      await this.trackStatusProgression(profile, previousStatus, action)
    }

    // Track engagement action
    await this.trackEngagementAction(profile, activity)

    return profile
  }

  /**
   * Calculate lead status based on score and requirements
   */
  private calculateLeadStatus(profile: LeadProfile): VisitorStatus {
    const score = profile.engagementScore
    const hasToolUsage = profile.activities.some(a => a.action === 'tool_usage')
    const hasEmailVerified = profile.activities.some(a => a.action === 'email_verified')
    const hasRegistration = profile.activities.some(a => a.action === 'registration_complete')
    const hasWebinarReg = profile.activities.some(a => a.action === 'webinar_registered')

    // Hot Lead: High engagement + webinar registration
    if (score >= 150 || (hasWebinarReg && score >= 100)) {
      return 'hot_lead'
    }

    // Candidate: Email verified + registration + moderate engagement
    if ((hasEmailVerified || hasRegistration) && score >= 75) {
      return 'candidate'
    }

    // Cold Lead: Tool usage OR 2+ minutes on site (15+ points)
    if (hasToolUsage || score >= 15) {
      return 'cold_lead'
    }

    return 'visitor'
  }

  /**
   * Calculate conversion readiness score (0-100)
   */
  private calculateConversionReadiness(profile: LeadProfile): number {
    let readiness = 0

    // Base score from engagement
    readiness += Math.min(profile.engagementScore / 200 * 40, 40)

    // Demographic indicators
    readiness += Math.min(profile.demographicScore / 100 * 25, 25)

    // Behavioral patterns
    readiness += Math.min(profile.behavioralScore / 150 * 20, 20)

    // Recent activity boost
    const recentActivity = profile.activities.filter(a => {
      const activityTime = new Date(a.timestamp).getTime()
      const now = Date.now()
      return now - activityTime < 24 * 60 * 60 * 1000 // Last 24 hours
    })
    readiness += Math.min(recentActivity.length * 3, 15)

    return Math.min(Math.round(readiness), 100)
  }

  /**
   * Generate AI-powered predictions
   */
  private generatePredictions(profile: LeadProfile): LeadPredictions {
    const score = profile.engagementScore
    const status = profile.status
    const recentActivities = profile.activities.slice(-5)

    // Conversion probability based on status and engagement
    let conversionProbability = 0.1
    switch (status) {
      case 'visitor':
        conversionProbability = Math.min(score / 100 * 0.15, 0.15)
        break
      case 'cold_lead':
        conversionProbability = Math.min(0.25 + (score - 15) / 100 * 0.25, 0.5)
        break
      case 'candidate':
        conversionProbability = Math.min(0.5 + (score - 75) / 100 * 0.3, 0.8)
        break
      case 'hot_lead':
        conversionProbability = Math.min(0.8 + (score - 150) / 100 * 0.15, 0.95)
        break
    }

    // Time to conversion estimation
    let timeToConversion = 30 // days
    if (conversionProbability > 0.7) timeToConversion = 3
    else if (conversionProbability > 0.5) timeToConversion = 7
    else if (conversionProbability > 0.3) timeToConversion = 14
    else if (conversionProbability > 0.15) timeToConversion = 21

    // Best conversion path
    let bestConversionPath: string[] = []
    let nextBestAction = ''

    switch (status) {
      case 'visitor':
        bestConversionPath = ['tool_usage', 'content_consumption', 'form_interaction']
        nextBestAction = 'Use an assessment tool to discover insights about yourself'
        break
      case 'cold_lead':
        bestConversionPath = ['email_verified', 'registration_complete', 'content_consumption']
        nextBestAction = 'Register to unlock more tools and personalized content'
        break
      case 'candidate':
        bestConversionPath = ['webinar_registered', 'high_engagement', 'social_share']
        nextBestAction = 'Register for our transformation webinar'
        break
      case 'hot_lead':
        bestConversionPath = ['direct_contact', 'consultation_booking', 'program_enrollment']
        nextBestAction = 'Book a personal transformation consultation'
        break
    }

    // Risk of churn
    const lastActivity = new Date(profile.lastActivity).getTime()
    const daysSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24)
    let riskOfChurn = Math.min(daysSinceActivity / 7, 1) // Higher risk after 7 days

    return {
      conversionProbability: Math.round(conversionProbability * 100) / 100,
      timeToConversion,
      bestConversionPath,
      nextBestAction,
      riskOfChurn: Math.round(riskOfChurn * 100) / 100
    }
  }

  /**
   * Save profile to localStorage
   */
  private saveToStorage(sessionId: string, profile: LeadProfile): void {
    try {
      localStorage.setItem(`lead_profile_${sessionId}`, JSON.stringify(profile))
      localStorage.setItem('visitor_status', profile.status)
      localStorage.setItem('engagement_score', profile.engagementScore.toString())
      localStorage.setItem('conversion_readiness', profile.conversionReadiness.toString())
    } catch (error) {
      console.error('Error saving lead profile to storage:', error)
    }
  }

  /**
   * Track status progression
   */
  private async trackStatusProgression(
    profile: LeadProfile,
    previousStatus: VisitorStatus,
    trigger: ConversionTrigger
  ): Promise<void> {
    try {
      await fetch('/api/track-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'status_progression',
          event_data: {
            session_id: profile.id,
            previous_status: previousStatus,
            new_status: profile.status,
            trigger_action: trigger,
            engagement_score: profile.engagementScore,
            conversion_readiness: profile.conversionReadiness,
            conversion_probability: profile.predictions.conversionProbability,
            timestamp: new Date().toISOString()
          },
          session_id: profile.id,
          page_url: window.location.href
        })
      })
    } catch (error) {
      console.error('Error tracking status progression:', error)
    }
  }

  /**
   * Track engagement action
   */
  private async trackEngagementAction(
    profile: LeadProfile,
    activity: EngagementActivity
  ): Promise<void> {
    try {
      await fetch('/api/track-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'engagement_action',
          event_data: {
            session_id: profile.id,
            action: activity.action,
            points_awarded: activity.points,
            total_score: profile.engagementScore,
            visitor_status: profile.status,
            conversion_readiness: profile.conversionReadiness,
            timestamp: activity.timestamp,
            metadata: activity.metadata
          },
          session_id: profile.id,
          page_url: activity.page_url
        })
      })
    } catch (error) {
      console.error('Error tracking engagement action:', error)
    }
  }

  /**
   * Get current lead profile
   */
  public getCurrentProfile(): LeadProfile | null {
    const sessionId = localStorage.getItem('session_id')
    if (!sessionId) return null
    return this.leadProfiles.get(sessionId) || null
  }

  /**
   * Get lead status breakdown
   */
  public getStatusBreakdown(): Record<VisitorStatus, number> {
    // This would typically come from your analytics API
    // For now, return mock data
    return {
      visitor: 1245,
      cold_lead: 823,
      candidate: 312,
      hot_lead: 89
    }
  }

  /**
   * Get conversion funnel metrics
   */
  public getConversionFunnel() {
    return {
      visitor_to_cold_lead: 0.661, // 66.1%
      cold_lead_to_candidate: 0.379, // 37.9%
      candidate_to_hot_lead: 0.285, // 28.5%
      overall_conversion: 0.071 // 7.1%
    }
  }

  /**
   * Manual status update (for admin/testing)
   */
  public async manualStatusUpdate(newStatus: VisitorStatus): Promise<LeadProfile> {
    return this.updateEngagement('high_engagement', { manual_update: newStatus })
  }
}

// Export singleton instance
export const leadScoringService = LeadScoringService.getInstance()