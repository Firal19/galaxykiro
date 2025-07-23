import { supabase } from './supabase'
import { LeadScoresModel, ScoringData, TierProgression } from './models/lead-scores'
import { UserModel } from './models/user'

// Lead scoring configuration based on requirements
export interface LeadScoringConfig {
  pageViews: {
    pointsPerView: number
    maxPoints: number
  }
  toolUsage: {
    pointsPerTool: number
    maxPoints: number
  }
  contentDownloads: {
    pointsPerDownload: number
    maxPoints: number
  }
  webinarRegistration: {
    pointsPerRegistration: number
  }
  timeOnSite: {
    maxPoints: number
    thresholdMinutes: number
  }
  scrollDepth: {
    maxPoints: number
  }
  ctaEngagement: {
    bonusPoints: number
    requiredClicks: number
  }
  tierThresholds: {
    browser: { min: number; max: number }
    engaged: { min: number; max: number }
    softMember: { min: number }
  }
}

// Default scoring configuration based on requirements
const DEFAULT_SCORING_CONFIG: LeadScoringConfig = {
  pageViews: {
    pointsPerView: 0.5,
    maxPoints: 10
  },
  toolUsage: {
    pointsPerTool: 5,
    maxPoints: 30
  },
  contentDownloads: {
    pointsPerDownload: 4,
    maxPoints: 20
  },
  webinarRegistration: {
    pointsPerRegistration: 25
  },
  timeOnSite: {
    maxPoints: 10,
    thresholdMinutes: 5
  },
  scrollDepth: {
    maxPoints: 5
  },
  ctaEngagement: {
    bonusPoints: 10,
    requiredClicks: 5
  },
  tierThresholds: {
    browser: { min: 0, max: 29 },
    engaged: { min: 30, max: 69 },
    softMember: { min: 70 }
  }
}

export interface UserActivityData {
  userId: string
  pageViewsCount: number
  toolUsageCount: number
  contentDownloadsCount: number
  webinarRegistrationsCount: number
  totalTimeOnSiteMinutes: number
  averageScrollDepth: number
  ctaClicksCount: number
  lastActivityAt: Date
}

export interface ScoreBreakdown {
  pageViewsScore: number
  toolUsageScore: number
  contentDownloadsScore: number
  webinarRegistrationScore: number
  timeOnSiteScore: number
  scrollDepthScore: number
  ctaEngagementScore: number
  totalScore: number
}

export interface TierChangeResult {
  userId: string
  previousTier: 'browser' | 'engaged' | 'soft-member'
  newTier: 'browser' | 'engaged' | 'soft-member'
  scoreIncrease: number
  totalScore: number
  triggeredSequences: string[]
  personalizationUpdates: string[]
}

class LeadScoringEngine {
  private config: LeadScoringConfig

  constructor(config: LeadScoringConfig = DEFAULT_SCORING_CONFIG) {
    this.config = config
  }

  /**
   * Calculate lead score based on user activity data
   */
  calculateScore(activityData: UserActivityData): ScoreBreakdown {
    // Page views score (0.5 each, max 10)
    const pageViewsScore = Math.min(
      activityData.pageViewsCount * this.config.pageViews.pointsPerView,
      this.config.pageViews.maxPoints
    )

    // Tool usage score (5 each, max 30)
    const toolUsageScore = Math.min(
      activityData.toolUsageCount * this.config.toolUsage.pointsPerTool,
      this.config.toolUsage.maxPoints
    )

    // Content downloads score (4 each, max 20)
    const contentDownloadsScore = Math.min(
      activityData.contentDownloadsCount * this.config.contentDownloads.pointsPerDownload,
      this.config.contentDownloads.maxPoints
    )

    // Webinar registration score (25 each)
    const webinarRegistrationScore = 
      activityData.webinarRegistrationsCount * this.config.webinarRegistration.pointsPerRegistration

    // Time on site score (max 10 for 5+ minutes)
    const timeOnSiteScore = activityData.totalTimeOnSiteMinutes >= this.config.timeOnSite.thresholdMinutes
      ? this.config.timeOnSite.maxPoints
      : Math.min(activityData.totalTimeOnSiteMinutes * 2, this.config.timeOnSite.maxPoints)

    // Scroll depth score (max 5)
    const scrollDepthScore = Math.min(
      (activityData.averageScrollDepth / 100) * this.config.scrollDepth.maxPoints,
      this.config.scrollDepth.maxPoints
    )

    // CTA engagement bonus (10 points for 5+ clicks)
    const ctaEngagementScore = activityData.ctaClicksCount >= this.config.ctaEngagement.requiredClicks
      ? this.config.ctaEngagement.bonusPoints
      : 0

    const totalScore = Math.round(
      pageViewsScore +
      toolUsageScore +
      contentDownloadsScore +
      webinarRegistrationScore +
      timeOnSiteScore +
      scrollDepthScore +
      ctaEngagementScore
    )

    return {
      pageViewsScore: Math.round(pageViewsScore * 10) / 10,
      toolUsageScore,
      contentDownloadsScore,
      webinarRegistrationScore,
      timeOnSiteScore: Math.round(timeOnSiteScore * 10) / 10,
      scrollDepthScore: Math.round(scrollDepthScore * 10) / 10,
      ctaEngagementScore,
      totalScore
    }
  }

  /**
   * Determine tier based on score
   */
  getTierFromScore(score: number): 'browser' | 'engaged' | 'soft-member' {
    if (score >= this.config.tierThresholds.softMember.min) {
      return 'soft-member'
    } else if (score >= this.config.tierThresholds.engaged.min) {
      return 'engaged'
    } else {
      return 'browser'
    }
  }

  /**
   * Get readiness level based on score
   */
  getReadinessLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 70) return 'high'
    if (score >= 30) return 'medium'
    return 'low'
  }

  /**
   * Collect user activity data from database
   */
  async collectUserActivityData(userId: string): Promise<UserActivityData> {
    try {
      // Get page views count from interactions table
      const { count: pageViewsCount } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('interaction_type', 'page_view')

      // Get tool usage count from tool_usage table
      const { count: toolUsageCount } = await supabase
        .from('tool_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true)

      // Get content downloads count from content_engagement table
      const { count: contentDownloadsCount } = await supabase
        .from('content_engagement')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('engagement_type', 'download')

      // Get webinar registrations count (assuming we have a webinars table)
      const { data: webinarData } = await supabase
        .from('interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('interaction_type', 'webinar_registration')

      const webinarRegistrationsCount = webinarData?.length || 0

      // Get time on site data from interactions
      const { data: timeData } = await supabase
        .from('interactions')
        .select('metadata')
        .eq('user_id', userId)
        .eq('interaction_type', 'session_end')

      let totalTimeOnSiteMinutes = 0
      if (timeData) {
        totalTimeOnSiteMinutes = timeData.reduce((total, interaction) => {
          const sessionTime = (interaction.metadata as { sessionDuration?: number })?.sessionDuration || 0
          return total + (sessionTime / 60) // convert seconds to minutes
        }, 0)
      }

      // Get scroll depth data from interactions
      const { data: scrollData } = await supabase
        .from('interactions')
        .select('metadata')
        .eq('user_id', userId)
        .eq('interaction_type', 'scroll_depth')

      let averageScrollDepth = 0
      if (scrollData && scrollData.length > 0) {
        const totalScrollDepth = scrollData.reduce((total, interaction) => {
          const scrollDepth = (interaction.metadata as { scrollDepth?: number })?.scrollDepth || 0
          return total + scrollDepth
        }, 0)
        averageScrollDepth = totalScrollDepth / scrollData.length
      }

      // Get CTA clicks count
      const { count: ctaClicksCount } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('interaction_type', 'cta_click')

      // Get last activity timestamp
      const { data: lastActivityData } = await supabase
        .from('interactions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const lastActivityAt = lastActivityData 
        ? new Date(lastActivityData.created_at)
        : new Date()

      return {
        userId,
        pageViewsCount: pageViewsCount || 0,
        toolUsageCount: toolUsageCount || 0,
        contentDownloadsCount: contentDownloadsCount || 0,
        webinarRegistrationsCount,
        totalTimeOnSiteMinutes: Math.round(totalTimeOnSiteMinutes * 10) / 10,
        averageScrollDepth: Math.round(averageScrollDepth * 10) / 10,
        ctaClicksCount: ctaClicksCount || 0,
        lastActivityAt
      }
    } catch (error) {
      console.error('Error collecting user activity data:', error)
      throw new Error(`Failed to collect activity data for user ${userId}: ${error}`)
    }
  }

  /**
   * Update lead score for a user
   */
  async updateLeadScore(userId: string): Promise<TierChangeResult | null> {
    try {
      // Collect current activity data
      const activityData = await this.collectUserActivityData(userId)
      
      // Calculate new score
      const scoreBreakdown = this.calculateScore(activityData)
      const newTier = this.getTierFromScore(scoreBreakdown.totalScore)
      
      // Get existing lead score record
      const existingScore = await LeadScoresModel.findByUserId(userId)
      const previousTier = existingScore?.tier || 'browser'
      const previousScore = existingScore?.totalScore || 0
      
      // Prepare scoring data
      const scoringData: ScoringData = {
        pageViewsCount: activityData.pageViewsCount,
        toolUsageCount: activityData.toolUsageCount,
        contentDownloadsCount: activityData.contentDownloadsCount,
        webinarRegistrationsCount: activityData.webinarRegistrationsCount,
        totalTimeOnSite: activityData.totalTimeOnSiteMinutes,
        averageScrollDepth: activityData.averageScrollDepth,
        ctaClicksCount: activityData.ctaClicksCount
      }

      // Prepare tier progression data
      const tierProgression: TierProgression[] = existingScore?.tierProgression || []
      
      // Add new progression if tier changed
      if (newTier !== previousTier) {
        tierProgression.push({
          tier: newTier,
          score: scoreBreakdown.totalScore,
          timestamp: new Date().toISOString(),
          previousTier
        })
      }

      // Update or create lead score record
      if (existingScore) {
        const { error } = await supabase
          .from('lead_scores')
          .update({
            page_views_score: scoreBreakdown.pageViewsScore,
            tool_usage_score: scoreBreakdown.toolUsageScore,
            content_downloads_score: scoreBreakdown.contentDownloadsScore,
            webinar_registration_score: scoreBreakdown.webinarRegistrationScore,
            time_on_site_score: scoreBreakdown.timeOnSiteScore,
            scroll_depth_score: scoreBreakdown.scrollDepthScore,
            cta_engagement_score: scoreBreakdown.ctaEngagementScore,
            total_score: scoreBreakdown.totalScore,
            previous_score: previousScore,
            tier: newTier,
            previous_tier: previousTier,
            scoring_data: scoringData,
            tier_progression: tierProgression,
            calculated_at: new Date().toISOString(),
            tier_changed_at: newTier !== previousTier ? new Date().toISOString() : existingScore.tierChangedAt?.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          throw new Error(`Failed to update lead score: ${error.message}`)
        }
      } else {
        await LeadScoresModel.create({
          user_id: userId,
          page_views_score: scoreBreakdown.pageViewsScore,
          tool_usage_score: scoreBreakdown.toolUsageScore,
          content_downloads_score: scoreBreakdown.contentDownloadsScore,
          webinar_registration_score: scoreBreakdown.webinarRegistrationScore,
          time_on_site_score: scoreBreakdown.timeOnSiteScore,
          scroll_depth_score: scoreBreakdown.scrollDepthScore,
          cta_engagement_score: scoreBreakdown.ctaEngagementScore,
          total_score: scoreBreakdown.totalScore,
          previous_score: 0,
          tier: newTier,
          previous_tier: 'browser',
          scoring_data: scoringData,
          tier_progression: tierProgression,
          tier_changed_at: newTier !== 'browser' ? new Date().toISOString() : null
        })
      }

      // Update user tier if changed
      if (newTier !== previousTier) {
        const user = await UserModel.findById(userId)
        if (user) {
          await user.updateTier(newTier)
        }

        // Return tier change result for triggering sequences
        const result: TierChangeResult = {
          userId,
          previousTier,
          newTier,
          scoreIncrease: scoreBreakdown.totalScore - previousScore,
          totalScore: scoreBreakdown.totalScore,
          triggeredSequences: this.getTriggerSequences(newTier, previousTier),
          personalizationUpdates: this.getPersonalizationUpdates(newTier, scoreBreakdown)
        }

        return result
      }

      return null
    } catch (error) {
      console.error('Error updating lead score:', error)
      throw error
    }
  }

  /**
   * Get sequences to trigger based on tier change
   */
  private getTriggerSequences(newTier: string, previousTier: string): string[] {
    const sequences: string[] = []

    if (previousTier === 'browser' && newTier === 'engaged') {
      sequences.push('engaged_visitor_welcome')
      sequences.push('tool_user_series_14_day')
    }

    if (previousTier === 'engaged' && newTier === 'soft-member') {
      sequences.push('soft_member_welcome')
      sequences.push('advanced_content_access')
      sequences.push('office_visit_invitation')
    }

    if (newTier === 'soft-member') {
      sequences.push('personalized_consultation_offer')
    }

    return sequences
  }

  /**
   * Get personalization updates based on tier and score
   */
  private getPersonalizationUpdates(tier: string, scoreBreakdown: ScoreBreakdown): string[] {
    const updates: string[] = []

    // Content access updates
    updates.push(`content_access_level_${tier}`)

    // CTA personalization
    if (tier === 'soft-member') {
      updates.push('show_premium_ctas')
      updates.push('hide_basic_lead_magnets')
    } else if (tier === 'engaged') {
      updates.push('show_engagement_ctas')
      updates.push('show_webinar_invitations')
    }

    // Tool recommendations based on highest scoring area
    const highestScoringArea = this.getHighestScoringArea(scoreBreakdown)
    updates.push(`recommend_${highestScoringArea}_tools`)

    // Navigation personalization
    updates.push(`navigation_tier_${tier}`)

    return updates
  }

  /**
   * Get the highest scoring area for personalization
   */
  private getHighestScoringArea(scoreBreakdown: ScoreBreakdown): string {
    const scores = {
      tools: scoreBreakdown.toolUsageScore,
      content: scoreBreakdown.contentDownloadsScore,
      webinars: scoreBreakdown.webinarRegistrationScore,
      engagement: scoreBreakdown.ctaEngagementScore
    }

    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b)
  }

  /**
   * Batch update scores for multiple users
   */
  async batchUpdateScores(userIds: string[]): Promise<TierChangeResult[]> {
    const results: TierChangeResult[] = []
    const batchSize = 5 // Process in small batches to avoid overwhelming the database

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize)
      const batchPromises = batch.map(async (userId) => {
        try {
          const result = await this.updateLeadScore(userId)
          return result
        } catch (error) {
          console.error(`Failed to update score for user ${userId}:`, error)
          return null
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults.filter(result => result !== null) as TierChangeResult[])
    }

    return results
  }

  /**
   * Get scoring analytics
   */
  async getScoringAnalytics(): Promise<{
    totalUsers: number
    tierDistribution: { browser: number; engaged: number; softMember: number }
    averageScore: number
    recentTierChanges: number
    topPerformingUsers: Array<{ userId: string; score: number; tier: string }>
  }> {
    try {
      const distribution = await LeadScoresModel.getScoreDistribution()
      const recentChanges = await LeadScoresModel.findRecentTierChanges(24)
      const topUsers = await LeadScoresModel.findTopScores(10)

      return {
        totalUsers: distribution.totalUsers,
        tierDistribution: {
          browser: distribution.browser,
          engaged: distribution.engaged,
          softMember: distribution.softMember
        },
        averageScore: Math.round(distribution.averageScore * 10) / 10,
        recentTierChanges: recentChanges.length,
        topPerformingUsers: topUsers.map(user => ({
          userId: user.userId,
          score: user.totalScore,
          tier: user.tier
        }))
      }
    } catch (error) {
      console.error('Error getting scoring analytics:', error)
      throw error
    }
  }

  /**
   * Recalculate all user scores (maintenance function)
   */
  async recalculateAllScores(): Promise<{ updated: number; errors: number }> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id')

      if (error) {
        throw new Error(`Failed to get users: ${error.message}`)
      }

      const userIds = users.map(user => user.id)
      let updated = 0
      let errors = 0

      // Process in batches
      const batchSize = 10
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize)
        
        for (const userId of batch) {
          try {
            await this.updateLeadScore(userId)
            updated++
          } catch (error) {
            console.error(`Failed to update score for user ${userId}:`, error)
            errors++
          }
        }

        // Small delay between batches to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      return { updated, errors }
    } catch (error) {
      console.error('Error recalculating all scores:', error)
      throw error
    }
  }
}

// Export singleton instance
export const leadScoringEngine = new LeadScoringEngine()

// Export types
export type {
  LeadScoringConfig,
  UserActivityData,
  ScoreBreakdown,
  TierChangeResult
}