/**
 * Score Tracking System
 * 
 * Handles tracking and management of user engagement scores,
 * lead scores, and behavioral metrics.
 */

import { supabase } from './supabase'

// Score tracking types
interface ScoreAction {
  userId?: string
  sessionId?: string
  actionType: string
  value: number
  metadata?: Record<string, unknown>
  timestamp: Date
}

interface EngagementScore {
  userId?: string
  sessionId?: string
  score: number
  level: 'low' | 'medium' | 'high' | 'very-high'
  lastUpdated: Date
  actions: ScoreAction[]
}

interface LeadScore {
  userId?: string
  sessionId?: string
  score: number
  tier: 'cold' | 'warm' | 'hot' | 'qualified'
  lastUpdated: Date
  factors: Array<{
    factor: string
    weight: number
    value: number
  }>
}

interface ScoreConfig {
  engagementWeights: Record<string, number>
  leadScoreFactors: Record<string, number>
  thresholds: {
    engagement: {
      low: number
      medium: number
      high: number
      veryHigh: number
    }
    leadScore: {
      cold: number
      warm: number
      hot: number
      qualified: number
    }
  }
}

class ScoreTrackingSystem {
  private config: ScoreConfig
  private engagementScores: Map<string, EngagementScore> = new Map()
  private leadScores: Map<string, LeadScore> = new Map()
  private actionHistory: ScoreAction[] = []

  constructor() {
    this.config = {
      engagementWeights: {
        'page_view': 1,
        'tool_usage': 5,
        'assessment_completion': 10,
        'webinar_registration': 8,
        'content_engagement': 3,
        'social_interaction': 2,
        'time_on_site': 0.1, // per minute
        'return_visit': 5
      },
      leadScoreFactors: {
        'email_capture': 20,
        'phone_capture': 30,
        'assessment_completion': 25,
        'webinar_registration': 15,
        'content_download': 10,
        'social_proof_view': 5,
        'time_on_site': 0.5, // per minute
        'return_visits': 10
      },
      thresholds: {
        engagement: {
          low: 0,
          medium: 25,
          high: 50,
          veryHigh: 75
        },
        leadScore: {
          cold: 0,
          warm: 30,
          hot: 60,
          qualified: 80
        }
      }
    }
  }

  /**
   * Track a score action
   */
  async trackAction(
    actionType: string,
    value: number = 1,
    metadata?: Record<string, unknown>,
    userId?: string,
    sessionId?: string
  ): Promise<void> {
    const action: ScoreAction = {
      userId,
      sessionId,
      actionType,
      value,
      metadata,
      timestamp: new Date()
    }

    // Add to action history
    this.actionHistory.push(action)

    // Update engagement score
    await this.updateEngagementScore(action)

    // Update lead score
    await this.updateLeadScore(action)

    // Save to database
    await this.saveActionToDatabase(action)

    if (process.env.NODE_ENV === 'development') {
      console.log(`Tracked action: ${actionType} (value: ${value})`);
    }
  }

  /**
   * Update engagement score based on action
   */
  private async updateEngagementScore(action: ScoreAction): Promise<void> {
    const key = action.userId || action.sessionId || 'anonymous'
    const currentScore = this.engagementScores.get(key) || {
      userId: action.userId,
      sessionId: action.sessionId,
      score: 0,
      level: 'low',
      lastUpdated: new Date(),
      actions: []
    }

    // Calculate score increment
    const weight = this.config.engagementWeights[action.actionType] || 1
    const increment = weight * action.value

    // Update score
    currentScore.score += increment
    currentScore.lastUpdated = new Date()
    currentScore.actions.push(action)

    // Determine level
    currentScore.level = this.calculateEngagementLevel(currentScore.score)

    // Update map
    this.engagementScores.set(key, currentScore)

    // Save to database
    await this.saveEngagementScoreToDatabase(currentScore)
  }

  /**
   * Update lead score based on action
   */
  private async updateLeadScore(action: ScoreAction): Promise<void> {
    const key = action.userId || action.sessionId || 'anonymous'
    const currentScore = this.leadScores.get(key) || {
      userId: action.userId,
      sessionId: action.sessionId,
      score: 0,
      tier: 'cold',
      lastUpdated: new Date(),
      factors: []
    }

    // Calculate score increment
    const factor = this.config.leadScoreFactors[action.actionType] || 1
    const increment = factor * action.value

    // Update score
    currentScore.score += increment
    currentScore.lastUpdated = new Date()

    // Add factor
    currentScore.factors.push({
      factor: action.actionType,
      weight: factor,
      value: increment
    })

    // Determine tier
    currentScore.tier = this.calculateLeadScoreTier(currentScore.score)

    // Update map
    this.leadScores.set(key, currentScore)

    // Save to database
    await this.saveLeadScoreToDatabase(currentScore)
  }

  /**
   * Calculate engagement level based on score
   */
  private calculateEngagementLevel(score: number): 'low' | 'medium' | 'high' | 'very-high' {
    const { thresholds } = this.config.engagement

    if (score >= thresholds.veryHigh) return 'very-high'
    if (score >= thresholds.high) return 'high'
    if (score >= thresholds.medium) return 'medium'
    return 'low'
  }

  /**
   * Calculate lead score tier based on score
   */
  private calculateLeadScoreTier(score: number): 'cold' | 'warm' | 'hot' | 'qualified' {
    const { thresholds } = this.config.leadScore

    if (score >= thresholds.qualified) return 'qualified'
    if (score >= thresholds.hot) return 'hot'
    if (score >= thresholds.warm) return 'warm'
    return 'cold'
  }

  /**
   * Get engagement score for user/session
   */
  getEngagementScore(userId?: string, sessionId?: string): EngagementScore | null {
    const key = userId || sessionId || 'anonymous'
    return this.engagementScores.get(key) || null
  }

  /**
   * Get lead score for user/session
   */
  getLeadScore(userId?: string, sessionId?: string): LeadScore | null {
    const key = userId || sessionId || 'anonymous'
    return this.leadScores.get(key) || null
  }

  /**
   * Get all engagement scores
   */
  getAllEngagementScores(): EngagementScore[] {
    return Array.from(this.engagementScores.values())
  }

  /**
   * Get all lead scores
   */
  getAllLeadScores(): LeadScore[] {
    return Array.from(this.leadScores.values())
  }

  /**
   * Get action history
   */
  getActionHistory(userId?: string, sessionId?: string): ScoreAction[] {
    if (userId || sessionId) {
      return this.actionHistory.filter(action => 
        action.userId === userId || action.sessionId === sessionId
      )
    }
    return [...this.actionHistory]
  }

  /**
   * Get score statistics
   */
  getScoreStatistics(): {
    totalUsers: number
    averageEngagementScore: number
    averageLeadScore: number
    engagementLevels: Record<string, number>
    leadScoreTiers: Record<string, number>
    topActions: Array<{ action: string; count: number }>
  } {
    const engagementScores = this.getAllEngagementScores()
    const leadScores = this.getAllLeadScores()

    // Calculate averages
    const avgEngagement = engagementScores.length > 0 
      ? engagementScores.reduce((sum, score) => sum + score.score, 0) / engagementScores.length
      : 0

    const avgLeadScore = leadScores.length > 0
      ? leadScores.reduce((sum, score) => sum + score.score, 0) / leadScores.length
      : 0

    // Count levels and tiers
    const engagementLevels: Record<string, number> = {}
    const leadScoreTiers: Record<string, number> = {}

    engagementScores.forEach(score => {
      engagementLevels[score.level] = (engagementLevels[score.level] || 0) + 1
    })

    leadScores.forEach(score => {
      leadScoreTiers[score.tier] = (leadScoreTiers[score.tier] || 0) + 1
    })

    // Top actions
    const actionCounts: Record<string, number> = {}
    this.actionHistory.forEach(action => {
      actionCounts[action.actionType] = (actionCounts[action.actionType] || 0) + 1
    })

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalUsers: Math.max(engagementScores.length, leadScores.length),
      averageEngagementScore: avgEngagement,
      averageLeadScore: avgLeadScore,
      engagementLevels,
      leadScoreTiers,
      topActions
    }
  }

  /**
   * Save action to database
   */
  private async saveActionToDatabase(action: ScoreAction): Promise<void> {
    try {
      const { error } = await supabase
        .from('interactions')
        .insert({
          user_id: action.userId,
          session_id: action.sessionId,
          action_type: action.actionType,
          value: action.value,
          metadata: action.metadata,
          timestamp: action.timestamp.toISOString()
        })

      if (error && process.env.NODE_ENV !== 'production') {
        console.error('Error saving action to database:', error);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error saving action to database:', error);
      }
    }
  }

  /**
   * Save engagement score to database
   */
  private async saveEngagementScoreToDatabase(score: EngagementScore): Promise<void> {
    try {
      const { error } = await supabase
        .from('engagement_scores')
        .upsert({
          user_id: score.userId,
          session_id: score.sessionId,
          score: score.score,
          level: score.level,
          last_updated: score.lastUpdated.toISOString()
        })

      if (error && process.env.NODE_ENV !== 'production') {
        console.error('Error saving engagement score to database:', error);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error saving engagement score to database:', error);
      }
    }
  }

  /**
   * Save lead score to database
   */
  private async saveLeadScoreToDatabase(score: LeadScore): Promise<void> {
    try {
      const { error } = await supabase
        .from('lead_scores')
        .upsert({
          user_id: score.userId,
          session_id: score.sessionId,
          score: score.score,
          tier: score.tier,
          last_updated: score.lastUpdated.toISOString()
        })

      if (error && process.env.NODE_ENV !== 'production') {
        console.error('Error saving lead score to database:', error);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error saving lead score to database:', error);
      }
    }
  }

  /**
   * Load scores from database
   */
  async loadScoresFromDatabase(): Promise<void> {
    try {
      // Load engagement scores
      const { data: engagementData, error: engagementError } = await supabase
        .from('engagement_scores')
        .select('*')

      if (engagementError && process.env.NODE_ENV !== 'production') {
        console.error('Error loading engagement scores:', engagementError);
      } else if (engagementData) {
        engagementData.forEach(row => {
          const key = row.user_id || row.session_id || 'anonymous'
          this.engagementScores.set(key, {
            userId: row.user_id,
            sessionId: row.session_id,
            score: row.score,
            level: row.level,
            lastUpdated: new Date(row.last_updated),
            actions: []
          })
        })
      }

      // Load lead scores
      const { data: leadData, error: leadError } = await supabase
        .from('lead_scores')
        .select('*')

      if (leadError && process.env.NODE_ENV !== 'production') {
        console.error('Error loading lead scores:', leadError);
      } else if (leadData) {
        leadData.forEach(row => {
          const key = row.user_id || row.session_id || 'anonymous'
          this.leadScores.set(key, {
            userId: row.user_id,
            sessionId: row.session_id,
            score: row.score,
            tier: row.tier,
            lastUpdated: new Date(row.last_updated),
            factors: []
          })
        })
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error loading scores from database:', error);
      }
    }
  }

  /**
   * Reset scores for user/session
   */
  resetScores(userId?: string, sessionId?: string): void {
    const key = userId || sessionId || 'anonymous'
    this.engagementScores.delete(key)
    this.leadScores.delete(key)
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ScoreConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

// Export singleton instance
export const scoreTrackingSystem = new ScoreTrackingSystem()

// Convenience functions for common tracking actions
export function trackToolComplete(toolName: string, userId?: string, sessionId?: string): Promise<void> {
  return scoreTrackingSystem.trackAction('tool_usage', 5, { toolName }, userId, sessionId);
}

export function trackContentDownload(contentId: string, contentType: string, userId?: string, sessionId?: string): Promise<void> {
  return scoreTrackingSystem.trackAction('content_download', 10, { contentId, contentType }, userId, sessionId);
}

export function trackWebinarRegistration(webinarId: string, userId?: string, sessionId?: string): Promise<void> {
  return scoreTrackingSystem.trackAction('webinar_registration', 8, { webinarId }, userId, sessionId);
}

export function trackCTAClick(ctaId: string, placement: string, userId?: string, sessionId?: string): Promise<void> {
  return scoreTrackingSystem.trackAction('cta_click', 3, { ctaId, placement }, userId, sessionId);
}

export function trackPageView(page: string, userId?: string, sessionId?: string): Promise<void> {
  return scoreTrackingSystem.trackAction('page_view', 1, { page }, userId, sessionId);
}

export function trackAssessmentComplete(assessmentId: string, score: number, userId?: string, sessionId?: string): Promise<void> {
  return scoreTrackingSystem.trackAction('assessment_completion', 10, { assessmentId, score }, userId, sessionId);
}

// Hook for React components
export function useScoreTracking() {
  return {
    trackAction: (
      actionType: string,
      value?: number,
      metadata?: Record<string, unknown>,
      userId?: string,
      sessionId?: string
    ) => scoreTrackingSystem.trackAction(actionType, value, metadata, userId, sessionId),
    trackToolComplete,
    trackContentDownload,
    trackWebinarRegistration,
    trackCTAClick,
    trackPageView,
    trackAssessmentComplete,
    getEngagementScore: (userId?: string, sessionId?: string) => 
      scoreTrackingSystem.getEngagementScore(userId, sessionId),
    getLeadScore: (userId?: string, sessionId?: string) => 
      scoreTrackingSystem.getLeadScore(userId, sessionId),
    getActionHistory: (userId?: string, sessionId?: string) => 
      scoreTrackingSystem.getActionHistory(userId, sessionId),
    getScoreStatistics: () => scoreTrackingSystem.getScoreStatistics(),
    resetScores: (userId?: string, sessionId?: string) => 
      scoreTrackingSystem.resetScores(userId, sessionId),
    updateConfig: (config: Partial<ScoreConfig>) => 
      scoreTrackingSystem.updateConfig(config)
  }
}