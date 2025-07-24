/**
 * Lead Scoring and Conversion Pipeline
 * 
 * This module implements the intelligent lead scoring system that tracks
 * user behavior and automatically progresses leads through the conversion funnel:
 * Visitor → Cold Lead → Candidate → Hot Lead → Member
 */

interface UserInteraction {
  event_type: string
  event_data: Record<string, any>
  timestamp: string
  session_id: string
  user_id?: string
}

interface LeadScore {
  total_score: number
  engagement_score: number
  readiness_score: number
  behavioral_score: number
  tier: 'browser' | 'engaged' | 'soft-member' | 'hot-lead'
  conversion_probability: number
}

interface ScoringRules {
  [key: string]: {
    points: number
    multiplier?: number
    cap?: number
    description: string
  }
}

// Scoring configuration for different actions
const SCORING_RULES: ScoringRules = {
  // Page interactions
  'page_visit': { points: 1, description: 'Basic page visit' },
  'time_on_page': { points: 0.1, multiplier: 1, cap: 10, description: 'Time spent on page (per second)' },
  'scroll_depth': { points: 0.05, multiplier: 1, cap: 5, description: 'Page scroll depth percentage' },
  
  // Tool interactions
  'tool_click': { points: 5, description: 'Clicked on assessment tool' },
  'tool_start': { points: 10, description: 'Started assessment tool' },
  'tool_complete': { points: 25, description: 'Completed assessment tool' },
  'tool_share': { points: 15, description: 'Shared assessment results' },
  
  // Lead capture
  'email_capture': { points: 50, description: 'Provided email address' },
  'phone_capture': { points: 30, description: 'Provided phone number' },
  'profile_complete': { points: 40, description: 'Completed profile information' },
  
  // Content engagement
  'content_view': { points: 3, description: 'Viewed content piece' },
  'content_complete': { points: 8, description: 'Completed reading/watching content' },
  'content_download': { points: 12, description: 'Downloaded content resource' },
  
  // Social proof & referrals
  'social_share': { points: 20, description: 'Shared content on social media' },
  'referral_click': { points: 5, description: 'Clicked referral link' },
  'testimonial_view': { points: 2, description: 'Viewed testimonial' },
  
  // Communication
  'webinar_register': { points: 35, description: 'Registered for webinar' },
  'webinar_attend': { points: 45, description: 'Attended webinar' },
  'office_visit_request': { points: 75, description: 'Requested office visit' },
  'direct_message': { points: 25, description: 'Sent direct message' },
  
  // Advanced engagement
  'return_visit': { points: 8, description: 'Returned to site within 7 days' },
  'consecutive_days': { points: 5, multiplier: 1, cap: 50, description: 'Consecutive daily visits' },
  'feature_exploration': { points: 6, description: 'Explored multiple features' },
  
  // Negative scoring (reduces score)
  'user_inactive': { points: -2, description: 'User became inactive' },
  'bounce': { points: -1, description: 'Bounced from page quickly' }
}

// Tier thresholds
const TIER_THRESHOLDS = {
  browser: { min: 0, max: 25 },
  engaged: { min: 26, max: 75 },
  'soft-member': { min: 76, max: 150 },
  'hot-lead': { min: 151, max: Infinity }
}

export class LeadScoringPipeline {
  /**
   * Calculate lead score based on user interactions
   */
  static calculateScore(interactions: UserInteraction[]): LeadScore {
    let totalScore = 0
    let engagementScore = 0
    let readinessScore = 0
    let behavioralScore = 0

    // Group interactions by type for analysis
    const interactionCounts: Record<string, number> = {}
    const recentInteractions = interactions.filter(
      i => new Date(i.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )

    interactions.forEach(interaction => {
      const rule = SCORING_RULES[interaction.event_type]
      if (!rule) return

      // Count interactions
      interactionCounts[interaction.event_type] = (interactionCounts[interaction.event_type] || 0) + 1

      // Calculate base points
      let points = rule.points

      // Apply multipliers for certain events
      if (rule.multiplier && interaction.event_data) {
        const multiplierValue = this.getMultiplierValue(interaction.event_type, interaction.event_data)
        points *= (multiplierValue * rule.multiplier)
      }

      // Apply caps
      if (rule.cap) {
        const currentTotal = (interactionCounts[interaction.event_type] - 1) * rule.points
        points = Math.min(points, Math.max(0, rule.cap - currentTotal))
      }

      totalScore += points

      // Categorize into different score types
      if (this.isEngagementAction(interaction.event_type)) {
        engagementScore += points
      }
      if (this.isReadinessAction(interaction.event_type)) {
        readinessScore += points
      }
      if (this.isBehavioralAction(interaction.event_type)) {
        behavioralScore += points
      }
    })

    // Apply behavioral bonuses
    totalScore += this.calculateBehavioralBonuses(interactions, interactionCounts)

    // Apply recency bonus (more recent activity = higher score)
    const recencyBonus = this.calculateRecencyBonus(recentInteractions)
    totalScore += recencyBonus

    // Determine tier
    const tier = this.determineTier(totalScore)

    // Calculate conversion probability
    const conversionProbability = this.calculateConversionProbability(
      totalScore, 
      interactions, 
      interactionCounts
    )

    return {
      total_score: Math.round(totalScore),
      engagement_score: Math.round(engagementScore),
      readiness_score: Math.round(readinessScore),
      behavioral_score: Math.round(behavioralScore),
      tier,
      conversion_probability: Math.round(conversionProbability)
    }
  }

  /**
   * Get multiplier value from event data
   */
  private static getMultiplierValue(eventType: string, eventData: Record<string, any>): number {
    switch (eventType) {
      case 'time_on_page':
        return Math.min(eventData.time_spent / 1000, 300) // Cap at 5 minutes
      case 'scroll_depth':
        return eventData.depth_percentage / 100
      case 'consecutive_days':
        return eventData.day_count || 1
      default:
        return 1
    }
  }

  /**
   * Check if action is engagement-related
   */
  private static isEngagementAction(eventType: string): boolean {
    const engagementActions = [
      'tool_click', 'tool_start', 'tool_complete', 'content_view', 
      'content_complete', 'webinar_register', 'webinar_attend'
    ]
    return engagementActions.includes(eventType)
  }

  /**
   * Check if action indicates readiness to convert
   */
  private static isReadinessAction(eventType: string): boolean {
    const readinessActions = [
      'email_capture', 'phone_capture', 'office_visit_request', 
      'direct_message', 'webinar_attend', 'profile_complete'
    ]
    return readinessActions.includes(eventType)
  }

  /**
   * Check if action is behavioral (recurring/engagement patterns)
   */
  private static isBehavioralAction(eventType: string): boolean {
    const behavioralActions = [
      'return_visit', 'consecutive_days', 'feature_exploration',
      'social_share', 'tool_share'
    ]
    return behavioralActions.includes(eventType)
  }

  /**
   * Calculate behavioral bonuses based on patterns
   */
  private static calculateBehavioralBonuses(
    interactions: UserInteraction[], 
    counts: Record<string, number>
  ): number {
    let bonus = 0

    // Tool completion bonus (completed multiple tools)
    const toolCompletions = counts['tool_complete'] || 0
    if (toolCompletions >= 2) {
      bonus += toolCompletions * 10 // 10 points per additional tool
    }

    // Content consumption bonus
    const contentViews = counts['content_view'] || 0
    if (contentViews >= 5) {
      bonus += 20 // Engaged content consumer
    }

    // Multi-session bonus
    const uniqueSessions = new Set(interactions.map(i => i.session_id)).size
    if (uniqueSessions >= 3) {
      bonus += uniqueSessions * 5 // 5 points per session
    }

    // Time-based engagement bonus
    const firstInteraction = interactions[0]?.timestamp
    const lastInteraction = interactions[interactions.length - 1]?.timestamp
    if (firstInteraction && lastInteraction) {
      const daysDiff = (new Date(lastInteraction).getTime() - new Date(firstInteraction).getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff >= 7) {
        bonus += 25 // Long-term engagement bonus
      }
    }

    return bonus
  }

  /**
   * Calculate recency bonus for recent activity
   */
  private static calculateRecencyBonus(recentInteractions: UserInteraction[]): number {
    if (recentInteractions.length === 0) return 0

    // More recent activity = higher bonus
    const today = new Date()
    let bonus = 0

    recentInteractions.forEach(interaction => {
      const interactionDate = new Date(interaction.timestamp)
      const daysAgo = (today.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysAgo <= 1) {
        bonus += 10 // Active today
      } else if (daysAgo <= 3) {
        bonus += 5 // Active within 3 days
      } else if (daysAgo <= 7) {
        bonus += 2 // Active within a week
      }
    })

    return Math.min(bonus, 50) // Cap recency bonus
  }

  /**
   * Determine user tier based on total score
   */
  private static determineTier(score: number): LeadScore['tier'] {
    for (const [tier, threshold] of Object.entries(TIER_THRESHOLDS)) {
      if (score >= threshold.min && score <= threshold.max) {
        return tier as LeadScore['tier']
      }
    }
    return 'browser'
  }

  /**
   * Calculate conversion probability based on various factors
   */
  private static calculateConversionProbability(
    score: number,
    interactions: UserInteraction[],
    counts: Record<string, number>
  ): number {
    let probability = 0

    // Base probability from score
    probability += Math.min(score / 200 * 60, 60) // Up to 60% from score

    // High-value action bonuses
    if (counts['office_visit_request']) probability += 20
    if (counts['webinar_attend']) probability += 15
    if (counts['tool_complete'] >= 2) probability += 10
    if (counts['direct_message']) probability += 15
    if (counts['phone_capture']) probability += 10

    // Behavioral pattern bonuses
    const uniqueDays = new Set(
      interactions.map(i => new Date(i.timestamp).toDateString())
    ).size
    if (uniqueDays >= 5) probability += 10

    // Recent activity bonus
    const recentActivity = interactions.filter(
      i => new Date(i.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
    if (recentActivity >= 3) probability += 5

    // Referral bonus (users from referrals convert better)
    const hasReferral = interactions.some(i => 
      i.event_data?.member_id || i.event_data?.referrer
    )
    if (hasReferral) probability += 8

    return Math.min(Math.max(probability, 0), 100)
  }

  /**
   * Process new interaction and update lead score
   */
  static async processInteraction(
    userId: string,
    interaction: UserInteraction,
    existingInteractions: UserInteraction[] = []
  ): Promise<{ newScore: LeadScore; tierChanged: boolean; actions: string[] }> {
    const allInteractions = [...existingInteractions, interaction]
    const previousScore = existingInteractions.length > 0 
      ? this.calculateScore(existingInteractions)
      : { tier: 'browser' as const, total_score: 0, conversion_probability: 0 }
    
    const newScore = this.calculateScore(allInteractions)
    const tierChanged = previousScore.tier !== newScore.tier
    
    const actions: string[] = []
    
    // Determine automated actions based on score changes
    if (tierChanged) {
      actions.push(`tier_upgrade:${newScore.tier}`)
      
      // Tier-specific automated actions
      switch (newScore.tier) {
        case 'engaged':
          actions.push('send_welcome_sequence')
          actions.push('unlock_basic_tools')
          break
        case 'soft-member':
          actions.push('send_membership_welcome')
          actions.push('unlock_premium_content')
          actions.push('assign_referrer_connection')
          break
        case 'hot-lead':
          actions.push('notify_sales_team')
          actions.push('enable_direct_messaging')
          actions.push('priority_support_access')
          break
      }
    }

    // Score milestone actions
    if (newScore.total_score >= 100 && previousScore.total_score < 100) {
      actions.push('send_achievement_badge')
    }

    // High conversion probability actions
    if (newScore.conversion_probability >= 80 && previousScore.conversion_probability < 80) {
      actions.push('trigger_conversion_sequence')
      actions.push('offer_office_visit')
    }

    // Engagement-specific actions
    if (interaction.event_type === 'tool_complete') {
      actions.push('send_tool_completion_followup')
      
      const toolCompletions = allInteractions.filter(i => i.event_type === 'tool_complete').length
      if (toolCompletions === 2) {
        actions.push('unlock_advanced_tools')
      }
    }

    return {
      newScore,
      tierChanged,
      actions
    }
  }

  /**
   * Get scoring insights for admin dashboard
   */
  static getScoringSummary(interactions: UserInteraction[]): {
    breakdown: Record<string, { points: number; count: number; description: string }>
    recommendations: string[]
    nextTierRequirement: { tier: string; pointsNeeded: number }
  } {
    const breakdown: Record<string, { points: number; count: number; description: string }> = {}
    
    // Calculate breakdown by interaction type
    interactions.forEach(interaction => {
      const rule = SCORING_RULES[interaction.event_type]
      if (!rule) return

      if (!breakdown[interaction.event_type]) {
        breakdown[interaction.event_type] = {
          points: 0,
          count: 0,
          description: rule.description
        }
      }

      breakdown[interaction.event_type].points += rule.points
      breakdown[interaction.event_type].count += 1
    })

    const currentScore = this.calculateScore(interactions)
    const currentTier = currentScore.tier

    // Find next tier
    const tierEntries = Object.entries(TIER_THRESHOLDS)
    const currentTierIndex = tierEntries.findIndex(([tier]) => tier === currentTier)
    const nextTier = tierEntries[currentTierIndex + 1]

    const recommendations: string[] = []
    const nextTierRequirement = nextTier 
      ? {
          tier: nextTier[0],
          pointsNeeded: nextTier[1].min - currentScore.total_score
        }
      : { tier: 'max', pointsNeeded: 0 }

    // Generate recommendations
    if (currentScore.total_score < 50) {
      recommendations.push('Complete at least 2 assessment tools to increase engagement')
      recommendations.push('Spend more time exploring content to build familiarity')
    } else if (currentScore.total_score < 100) {
      recommendations.push('Attend a webinar to demonstrate serious interest')
      recommendations.push('Provide contact information to unlock premium features')
    } else {
      recommendations.push('Request an office visit for personalized guidance')
      recommendations.push('Engage with community members through direct messaging')
    }

    return {
      breakdown,
      recommendations,
      nextTierRequirement
    }
  }
}

/**
 * Automated action processor
 */
export class AutomatedActionProcessor {
  static async executeActions(userId: string, actions: string[]): Promise<void> {
    for (const action of actions) {
      try {
        await this.executeAction(userId, action)
      } catch (error) {
        console.error(`Failed to execute action ${action} for user ${userId}:`, error)
      }
    }
  }

  private static async executeAction(userId: string, action: string): Promise<void> {
    const [actionType, actionData] = action.split(':')

    switch (actionType) {
      case 'tier_upgrade':
        await this.handleTierUpgrade(userId, actionData)
        break
      case 'send_welcome_sequence':
        await this.sendWelcomeSequence(userId)
        break
      case 'unlock_basic_tools':
        await this.unlockBasicTools(userId)
        break
      case 'send_membership_welcome':
        await this.sendMembershipWelcome(userId)
        break
      case 'unlock_premium_content':
        await this.unlockPremiumContent(userId)
        break
      case 'assign_referrer_connection':
        await this.assignReferrerConnection(userId)
        break
      case 'notify_sales_team':
        await this.notifySalesTeam(userId)
        break
      case 'enable_direct_messaging':
        await this.enableDirectMessaging(userId)
        break
      case 'trigger_conversion_sequence':
        await this.triggerConversionSequence(userId)
        break
      case 'offer_office_visit':
        await this.offerOfficeVisit(userId)
        break
      default:
        console.log(`Unknown action type: ${actionType}`)
    }
  }

  private static async handleTierUpgrade(userId: string, newTier: string): Promise<void> {
    console.log(`User ${userId} upgraded to tier: ${newTier}`)
    // Update user tier in database
    // Send notification to user
    // Log tier change event
  }

  private static async sendWelcomeSequence(userId: string): Promise<void> {
    console.log(`Sending welcome sequence to user ${userId}`)
    // Trigger email sequence
    // Schedule follow-up messages
  }

  private static async unlockBasicTools(userId: string): Promise<void> {
    console.log(`Unlocking basic tools for user ${userId}`)
    // Update user permissions
    // Send notification about new tools
  }

  private static async sendMembershipWelcome(userId: string): Promise<void> {
    console.log(`Sending membership welcome to user ${userId}`)
    // Send comprehensive welcome package
    // Assign onboarding specialist
  }

  private static async unlockPremiumContent(userId: string): Promise<void> {
    console.log(`Unlocking premium content for user ${userId}`)
    // Update content access permissions
    // Send content library notification
  }

  private static async assignReferrerConnection(userId: string): Promise<void> {
    console.log(`Assigning referrer connection for user ${userId}`)
    // Enable direct chat with referrer
    // Send introduction message
  }

  private static async notifySalesTeam(userId: string): Promise<void> {
    console.log(`Notifying sales team about hot lead: ${userId}`)
    // Send alert to sales team
    // Create follow-up task
  }

  private static async enableDirectMessaging(userId: string): Promise<void> {
    console.log(`Enabling direct messaging for user ${userId}`)
    // Update user permissions for chat
    // Send capability notification
  }

  private static async triggerConversionSequence(userId: string): Promise<void> {
    console.log(`Triggering conversion sequence for user ${userId}`)
    // Send targeted conversion content
    // Schedule sales follow-up
  }

  private static async offerOfficeVisit(userId: string): Promise<void> {
    console.log(`Offering office visit to user ${userId}`)
    // Send office visit invitation
    // Provide booking calendar link
  }
}