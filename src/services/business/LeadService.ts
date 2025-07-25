/**
 * LeadService - Lead Scoring and Lifecycle Management
 * 
 * Handles lead creation, scoring, progression, and analytics
 */

import { ILeadService, IAnalyticsService, Lead, LeadProfile, VisitorStatus, EngagementActivity, LeadPredictions, AttributionData } from '../interfaces'

interface EngagementAction {
  points: number
  category: 'behavioral' | 'demographic' | 'engagement'
  weight: number
  threshold?: number
}

const ENGAGEMENT_ACTIONS: Record<string, EngagementAction> = {
  'page_view': { points: 1, category: 'behavioral', weight: 1.0 },
  'time_on_site': { points: 1, category: 'behavioral', weight: 1.2 },
  'scroll_depth': { points: 2, category: 'behavioral', weight: 1.1 },
  'email_captured': { points: 25, category: 'demographic', weight: 2.0 },
  'phone_captured': { points: 40, category: 'demographic', weight: 2.5 },
  'name_captured': { points: 15, category: 'demographic', weight: 1.5 },
  'tool_usage': { points: 50, category: 'engagement', weight: 3.0 },
  'assessment_completed': { points: 100, category: 'engagement', weight: 4.0 },
  'content_engagement': { points: 10, category: 'engagement', weight: 1.8 },
  'webinar_registered': { points: 75, category: 'engagement', weight: 3.5 },
  'office_visit_booked': { points: 150, category: 'engagement', weight: 5.0 },
  'referral_made': { points: 200, category: 'engagement', weight: 6.0 },
  'high_engagement': { points: 30, category: 'engagement', weight: 2.2 }
}

const LEAD_STATUS_THRESHOLDS = {
  cold_lead: 50,
  candidate: 200,
  hot_lead: 500
}

export class LeadService implements ILeadService {
  private leadProfiles: Map<string, LeadProfile> = new Map()
  private analyticsService?: IAnalyticsService

  constructor(analyticsService?: IAnalyticsService) {
    this.analyticsService = analyticsService
    this.loadFromStorage()
  }

  /**
   * Create new lead
   */
  async createLead(userData: { email: string; name?: string; phone?: string; source?: string }): Promise<Lead> {
    const leadId = this.generateLeadId()
    
    const lead: Lead = {
      id: leadId,
      email: userData.email,
      source: userData.source || 'direct',
      status: 'visitor',
      score: 0,
      createdAt: new Date().toISOString()
    }

    // Create detailed profile
    const profile: LeadProfile = {
      id: leadId,
      status: 'visitor',
      engagementScore: 0,
      demographicScore: 0,
      behavioralScore: 0,
      conversionReadiness: 0,
      lastActivity: new Date().toISOString(),
      source: userData.source || 'direct',
      attributionData: this.getAttributionData(),
      activities: [],
      predictions: this.generateInitialPredictions()
    }

    this.leadProfiles.set(leadId, profile)
    await this.saveToStorage()

    // Track lead creation
    await this.analyticsService?.trackEvent('lead_created', {
      leadId,
      source: lead.source,
      email: lead.email
    })

    return lead
  }

  /**
   * Update lead score
   */
  async updateLeadScore(leadId: string, points: number): Promise<LeadProfile> {
    let profile = this.leadProfiles.get(leadId)
    
    if (!profile) {
      throw new Error(`Lead profile not found: ${leadId}`)
    }

    profile.engagementScore += points
    profile.lastActivity = new Date().toISOString()

    // Recalculate status
    const previousStatus = profile.status
    profile.status = this.calculateLeadStatus(profile)

    // Update conversion readiness and predictions
    profile.conversionReadiness = this.calculateConversionReadiness(profile)
    profile.predictions = this.generatePredictions(profile)

    await this.saveToStorage()

    // Track status progression
    if (previousStatus !== profile.status) {
      await this.analyticsService?.trackEvent('lead_status_changed', {
        leadId,
        previousStatus,
        newStatus: profile.status,
        score: profile.engagementScore
      })
    }

    return profile
  }

  /**
   * Get lead profile
   */
  async getLeadProfile(sessionId: string): Promise<LeadProfile> {
    let profile = this.leadProfiles.get(sessionId)
    
    if (!profile) {
      // Create new profile for session
      profile = this.createNewLeadProfile(sessionId)
      this.leadProfiles.set(sessionId, profile)
      await this.saveToStorage()
    }

    return profile
  }

  /**
   * Track engagement action
   */
  async trackEngagement(action: string, metadata?: any): Promise<void> {
    const sessionId = this.getSessionId()
    let profile = await this.getLeadProfile(sessionId)

    const engagementAction = ENGAGEMENT_ACTIONS[action]
    if (!engagementAction) {
      console.warn(`Unknown engagement action: ${action}`)
      return
    }

    // Calculate points with weight multiplier
    let points = engagementAction.points
    if (metadata?.multiplier) {
      points *= metadata.multiplier
    }

    // Update category-specific scores
    switch (engagementAction.category) {
      case 'behavioral':
        profile.behavioralScore += points
        break
      case 'demographic':
        profile.demographicScore += points
        break
      case 'engagement':
        profile.engagementScore += Math.floor(points * engagementAction.weight)
        profile.behavioralScore += Math.floor(points * 0.5)
        break
    }

    // Record activity
    const activity: EngagementActivity = {
      timestamp: new Date().toISOString(),
      action,
      points,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
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

    // Trigger conversion actions
    await this.checkConversionTriggers(profile, action, metadata)

    this.leadProfiles.set(sessionId, profile)
    await this.saveToStorage()

    // Analytics tracking
    await this.analyticsService?.trackEvent('engagement_tracked', {
      sessionId,
      action,
      points,
      totalScore: profile.engagementScore,
      status: profile.status
    })
  }

  /**
   * Calculate lead status based on scores
   */
  calculateLeadStatus(profile: LeadProfile): VisitorStatus {
    const totalScore = profile.engagementScore + profile.demographicScore + profile.behavioralScore

    if (totalScore >= LEAD_STATUS_THRESHOLDS.hot_lead) {
      return 'hot_lead'
    } else if (totalScore >= LEAD_STATUS_THRESHOLDS.candidate) {
      return 'candidate'
    } else if (totalScore >= LEAD_STATUS_THRESHOLDS.cold_lead) {
      return 'cold_lead'
    }

    return 'visitor'
  }

  /**
   * Calculate conversion readiness (0-1 scale)
   */
  private calculateConversionReadiness(profile: LeadProfile): number {
    const factors = [
      // Score factor (0-0.4)
      Math.min((profile.engagementScore + profile.demographicScore) / 1000, 0.4),
      
      // Activity recency factor (0-0.2)
      this.calculateRecencyFactor(profile.lastActivity) * 0.2,
      
      // Engagement diversity factor (0-0.2)
      this.calculateDiversityFactor(profile.activities || []) * 0.2,
      
      // Time investment factor (0-0.2)
      this.calculateTimeInvestmentFactor(profile.activities || []) * 0.2
    ]

    return Math.min(factors.reduce((sum, factor) => sum + factor, 0), 1)
  }

  /**
   * Generate predictions for lead
   */
  private generatePredictions(profile: LeadProfile): LeadPredictions {
    const conversionReadiness = profile.conversionReadiness
    
    // Calculate conversion probability based on readiness and historical data
    const conversionProbability = Math.min(conversionReadiness * 1.2, 0.95)
    
    // Estimate time to conversion based on current engagement
    const timeToConversion = Math.max(30 - (conversionReadiness * 25), 7)
    
    // Generate best conversion path based on profile
    const bestConversionPath = this.generateConversionPath(profile)
    
    // Determine next best action
    const nextBestAction = this.determineNextBestAction(profile)
    
    // Calculate churn risk
    const riskOfChurn = this.calculateChurnRisk(profile)

    return {
      conversionProbability,
      timeToConversion,
      bestConversionPath,
      nextBestAction,
      riskOfChurn
    }
  }

  /**
   * Create new lead profile
   */
  private createNewLeadProfile(sessionId: string): LeadProfile {
    return {
      id: sessionId,
      status: 'visitor',
      engagementScore: 0,
      demographicScore: 0,
      behavioralScore: 0,
      conversionReadiness: 0,
      lastActivity: new Date().toISOString(),
      source: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
      attributionData: this.getAttributionData(),
      activities: [],
      predictions: this.generateInitialPredictions()
    }
  }

  /**
   * Get attribution data from URL parameters
   */
  private getAttributionData(): AttributionData {
    if (typeof window === 'undefined') {
      return {}
    }

    const urlParams = new URLSearchParams(window.location.search)
    return {
      content_id: urlParams.get('c') || undefined,
      member_id: urlParams.get('m') || undefined,
      platform: urlParams.get('p') || undefined,
      referrer: document.referrer || undefined
    }
  }

  /**
   * Generate session ID
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  /**
   * Generate lead ID
   */
  private generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Calculate recency factor
   */
  private calculateRecencyFactor(lastActivity: string): number {
    const now = new Date()
    const lastActiveTime = new Date(lastActivity)
    const hoursSinceActivity = (now.getTime() - lastActiveTime.getTime()) / (1000 * 60 * 60)
    
    // More recent activity = higher factor
    return Math.max(0, 1 - (hoursSinceActivity / 24))
  }

  /**
   * Calculate engagement diversity factor
   */
  private calculateDiversityFactor(activities: EngagementActivity[]): number {
    const uniqueActions = new Set(activities.map(a => a.action))
    return Math.min(uniqueActions.size / 10, 1) // Normalize to 0-1
  }

  /**
   * Calculate time investment factor
   */
  private calculateTimeInvestmentFactor(activities: EngagementActivity[]): number {
    const timeOnSiteActivities = activities.filter(a => a.action === 'time_on_site')
    return Math.min(timeOnSiteActivities.length / 300, 1) // 5 minutes = 1.0
  }

  /**
   * Generate conversion path
   */
  private generateConversionPath(profile: LeadProfile): string[] {
    const completedActions = new Set(profile.activities?.map(a => a.action) || [])
    
    const recommendedPath = [
      'tool_usage',
      'email_captured',
      'assessment_completed',
      'webinar_registered',
      'office_visit_booked'
    ]

    return recommendedPath.filter(action => !completedActions.has(action))
  }

  /**
   * Determine next best action
   */
  private determineNextBestAction(profile: LeadProfile): string {
    const path = this.generateConversionPath(profile)
    if (path.length > 0) {
      const actionMap: Record<string, string> = {
        'tool_usage': 'Take a psychological assessment tool',
        'email_captured': 'Sign up for our newsletter',
        'assessment_completed': 'Complete your assessment',
        'webinar_registered': 'Register for our transformation webinar',
        'office_visit_booked': 'Book a strategy session'
      }
      return actionMap[path[0]] || 'Explore our content library'
    }
    return 'Schedule a consultation'
  }

  /**
   * Calculate churn risk
   */
  private calculateChurnRisk(profile: LeadProfile): number {
    const daysSinceLastActivity = this.calculateRecencyFactor(profile.lastActivity)
    const engagementLevel = Math.min(profile.engagementScore / 100, 1)
    
    // Higher engagement and recent activity = lower churn risk
    return Math.max(0, 1 - (daysSinceLastActivity * 0.5 + engagementLevel * 0.5))
  }

  /**
   * Generate initial predictions
   */
  private generateInitialPredictions(): LeadPredictions {
    return {
      conversionProbability: 0.1,
      timeToConversion: 30,
      bestConversionPath: ['tool_usage', 'email_captured', 'webinar_registered'],
      nextBestAction: 'Take an assessment tool',
      riskOfChurn: 0.8
    }
  }

  /**
   * Check conversion triggers
   */
  private async checkConversionTriggers(profile: LeadProfile, action: string, metadata?: any): Promise<void> {
    // Implement conversion trigger logic here
    // For example, send notifications, trigger email sequences, etc.
  }

  /**
   * Load profiles from storage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('lead_profiles')
      if (stored) {
        const profiles = JSON.parse(stored)
        this.leadProfiles = new Map(Object.entries(profiles))
      }
    } catch (error) {
      console.error('Failed to load lead profiles:', error)
    }
  }

  /**
   * Save profiles to storage
   */
  private async saveToStorage(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const profiles = Object.fromEntries(this.leadProfiles)
      localStorage.setItem('lead_profiles', JSON.stringify(profiles))
    } catch (error) {
      console.error('Failed to save lead profiles:', error)
    }
  }

  /**
   * Health check
   */
  getHealth(): boolean {
    return this.leadProfiles.size >= 0
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.leadProfiles.clear()
  }
}