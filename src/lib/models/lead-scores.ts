import { supabase, Database } from '../../../lib/supabase'

export type LeadScoresRow = Database['public']['Tables']['lead_scores']['Row']
export type LeadScoresInsert = Database['public']['Tables']['lead_scores']['Insert']
export type LeadScoresUpdate = Database['public']['Tables']['lead_scores']['Update']

export interface ScoringData {
  pageViewsCount: number
  toolUsageCount: number
  contentDownloadsCount: number
  webinarRegistrationsCount: number
  totalTimeOnSite: number
  averageScrollDepth: number
  ctaClicksCount: number
  [key: string]: unknown
}

export interface TierProgression {
  tier: 'browser' | 'engaged' | 'soft-member'
  score: number
  timestamp: string
  previousTier?: 'browser' | 'engaged' | 'soft-member'
}

export class LeadScoresModel {
  private data: LeadScoresRow

  constructor(data: LeadScoresRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get userId(): string {
    return this.data.user_id
  }

  get pageViewsScore(): number {
    return this.data.page_views_score
  }

  get toolUsageScore(): number {
    return this.data.tool_usage_score
  }

  get contentDownloadsScore(): number {
    return this.data.content_downloads_score
  }

  get webinarRegistrationScore(): number {
    return this.data.webinar_registration_score
  }

  get timeOnSiteScore(): number {
    return this.data.time_on_site_score
  }

  get scrollDepthScore(): number {
    return this.data.scroll_depth_score
  }

  get ctaEngagementScore(): number {
    return this.data.cta_engagement_score
  }

  get totalScore(): number {
    return this.data.total_score
  }

  get previousScore(): number {
    return this.data.previous_score
  }

  get tier(): 'browser' | 'engaged' | 'soft-member' {
    return this.data.tier
  }

  get previousTier(): 'browser' | 'engaged' | 'soft-member' {
    return this.data.previous_tier
  }

  get scoringData(): ScoringData {
    return this.data.scoring_data as ScoringData
  }

  get tierProgression(): TierProgression[] {
    return this.data.tier_progression as unknown as TierProgression[]
  }

  get calculatedAt(): Date {
    return new Date(this.data.calculated_at)
  }

  get tierChangedAt(): Date | null {
    return this.data.tier_changed_at ? new Date(this.data.tier_changed_at) : null
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  get updatedAt(): Date {
    return new Date(this.data.updated_at)
  }

  // Utility methods
  getScoreBreakdown(): Record<string, number> {
    return {
      pageViews: this.pageViewsScore,
      toolUsage: this.toolUsageScore,
      contentDownloads: this.contentDownloadsScore,
      webinarRegistration: this.webinarRegistrationScore,
      timeOnSite: this.timeOnSiteScore,
      scrollDepth: this.scrollDepthScore,
      ctaEngagement: this.ctaEngagementScore
    }
  }

  getReadinessLevel(): 'low' | 'medium' | 'high' {
    if (this.totalScore >= 70) return 'high'
    if (this.totalScore >= 30) return 'medium'
    return 'low'
  }

  hasRecentTierChange(withinHours = 24): boolean {
    if (!this.tierChangedAt) return false
    const hoursAgo = new Date(Date.now() - withinHours * 60 * 60 * 1000)
    return this.tierChangedAt > hoursAgo
  }

  getScoreIncrease(): number {
    return this.totalScore - this.previousScore
  }

  // Static methods for creating and finding lead scores
  static async create(leadScoreData: LeadScoresInsert): Promise<LeadScoresModel> {
    const { data, error } = await supabase
      .from('lead_scores')
      .insert({
        ...leadScoreData,
        calculated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create lead score: ${error.message}`)
    }

    return new LeadScoresModel(data)
  }

  static async findByUserId(userId: string): Promise<LeadScoresModel | null> {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Lead score not found
      }
      throw new Error(`Failed to find lead score: ${error.message}`)
    }

    return new LeadScoresModel(data)
  }

  static async findByTier(tier: 'browser' | 'engaged' | 'soft-member'): Promise<LeadScoresModel[]> {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('*')
      .eq('tier', tier)
      .order('total_score', { ascending: false })

    if (error) {
      throw new Error(`Failed to find lead scores by tier: ${error.message}`)
    }

    return data.map(score => new LeadScoresModel(score))
  }

  static async findTopScores(limit = 10): Promise<LeadScoresModel[]> {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to find top lead scores: ${error.message}`)
    }

    return data.map(score => new LeadScoresModel(score))
  }

  static async findRecentTierChanges(withinHours = 24): Promise<LeadScoresModel[]> {
    const hoursAgo = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('lead_scores')
      .select('*')
      .gte('tier_changed_at', hoursAgo)
      .order('tier_changed_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find recent tier changes: ${error.message}`)
    }

    return data.map(score => new LeadScoresModel(score))
  }

  // Automated scoring methods using Supabase functions
  static async calculateScore(userId: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('calculate_lead_score', { p_user_id: userId })

    if (error) {
      throw new Error(`Failed to calculate lead score: ${error.message}`)
    }

    return data as number
  }

  static async updateScore(userId: string): Promise<void> {
    const { error } = await supabase
      .rpc('update_lead_score', { p_user_id: userId })

    if (error) {
      throw new Error(`Failed to update lead score: ${error.message}`)
    }
  }

  static async getTierFromScore(score: number): Promise<'browser' | 'engaged' | 'soft-member'> {
    const { data, error } = await supabase
      .rpc('get_tier_from_score', { p_score: score })

    if (error) {
      throw new Error(`Failed to get tier from score: ${error.message}`)
    }

    return data as 'browser' | 'engaged' | 'soft-member'
  }

  // Batch operations for analytics
  static async getScoreDistribution(): Promise<{
    browser: number
    engaged: number
    softMember: number
    averageScore: number
    totalUsers: number
  }> {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('tier, total_score')

    if (error) {
      throw new Error(`Failed to get score distribution: ${error.message}`)
    }

    const distribution = {
      browser: 0,
      engaged: 0,
      softMember: 0,
      averageScore: 0,
      totalUsers: data.length
    }

    let totalScore = 0

    data.forEach(score => {
      totalScore += score.total_score
      switch (score.tier) {
        case 'browser':
          distribution.browser++
          break
        case 'engaged':
          distribution.engaged++
          break
        case 'soft-member':
          distribution.softMember++
          break
      }
    })

    distribution.averageScore = totalScore / data.length

    return distribution
  }

  static async getTierProgressionStats(): Promise<{
    totalProgressions: number
    browserToEngaged: number
    engagedToSoftMember: number
    averageTimeToProgress: number
  }> {
    const { data, error } = await supabase
      .from('lead_scores')
      .select('tier_progression, tier_changed_at, created_at')
      .not('tier_changed_at', 'is', null)

    if (error) {
      throw new Error(`Failed to get tier progression stats: ${error.message}`)
    }

    let browserToEngaged = 0
    let engagedToSoftMember = 0
    let totalProgressionTime = 0

    data.forEach(record => {
      const progressions = record.tier_progression as TierProgression[]
      progressions.forEach(progression => {
        if (progression.previousTier === 'browser' && progression.tier === 'engaged') {
          browserToEngaged++
        } else if (progression.previousTier === 'engaged' && progression.tier === 'soft-member') {
          engagedToSoftMember++
        }
      })

      if (record.tier_changed_at && record.created_at) {
        const progressionTime = new Date(record.tier_changed_at).getTime() - new Date(record.created_at).getTime()
        totalProgressionTime += progressionTime
      }
    })

    const totalProgressions = browserToEngaged + engagedToSoftMember
    const averageTimeToProgress = totalProgressions > 0 ? totalProgressionTime / totalProgressions / (1000 * 60 * 60) : 0 // in hours

    return {
      totalProgressions,
      browserToEngaged,
      engagedToSoftMember,
      averageTimeToProgress
    }
  }

  // Utility method to trigger score recalculation for all users
  static async recalculateAllScores(): Promise<void> {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')

    if (usersError) {
      throw new Error(`Failed to get users for score recalculation: ${usersError.message}`)
    }

    // Process in batches to avoid overwhelming the database
    const batchSize = 10
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize)
      const promises = batch.map(user => this.updateScore(user.id))
      
      try {
        await Promise.all(promises)
      } catch (error) {
        console.error(`Failed to update scores for batch starting at index ${i}:`, error)
      }
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      scoreBreakdown: this.getScoreBreakdown(),
      totalScore: this.totalScore,
      previousScore: this.previousScore,
      scoreIncrease: this.getScoreIncrease(),
      tier: this.tier,
      previousTier: this.previousTier,
      readinessLevel: this.getReadinessLevel(),
      scoringData: this.scoringData,
      tierProgression: this.tierProgression,
      calculatedAt: this.calculatedAt.toISOString(),
      tierChangedAt: this.tierChangedAt?.toISOString() || null,
      hasRecentTierChange: this.hasRecentTierChange(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }
}