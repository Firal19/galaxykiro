import { supabase } from './supabase'
import { InteractionModel } from './models/interaction'
import { UserModel } from './models/user'
import { LeadScoresModel } from './models/lead-scores'

export interface UserBehaviorProfile {
  userId: string
  behaviorType: 'explorer' | 'focused' | 'hesitant' | 'converter' | 'researcher'
  engagementPattern: string[]
  conversionProbability: number
  recommendedActions: string[]
  nextBestAction: string
  riskFactors: string[]
  strengths: string[]
}

export interface SessionAnalytics {
  sessionId: string
  userId?: string
  duration: number
  pageViews: number
  toolInteractions: number
  contentEngagement: number
  ctaClicks: number
  scrollDepth: number
  exitIntent: boolean
  conversionEvents: string[]
  engagementScore: number
  behaviorSignals: string[]
}

export interface RealTimeEngagementUpdate {
  userId: string
  sessionId: string
  currentScore: number
  scoreChange: number
  tierStatus: 'browser' | 'engaged' | 'soft-member'
  tierChanged: boolean
  behaviorSignals: string[]
  recommendedInterventions: string[]
}

export class BehavioralAnalysisEngine {
  private static instance: BehavioralAnalysisEngine
  private behaviorPatterns: Map<string, UserBehaviorProfile> = new Map()
  private sessionAnalytics: Map<string, SessionAnalytics> = new Map()

  static getInstance(): BehavioralAnalysisEngine {
    if (!BehavioralAnalysisEngine.instance) {
      BehavioralAnalysisEngine.instance = new BehavioralAnalysisEngine()
    }
    return BehavioralAnalysisEngine.instance
  }

  // Analyze user behavior and create profile
  async analyzeUserBehavior(userId: string): Promise<UserBehaviorProfile> {
    try {
      // Get user's interaction history
      const interactions = await InteractionModel.findByUserId(userId, 200)
      const user = await UserModel.findById(userId)
      const leadScore = await LeadScoresModel.findByUserId(userId)

      if (!user) {
        throw new Error('User not found')
      }

      // Analyze interaction patterns
      const engagementPattern = this.extractEngagementPattern(interactions)
      const behaviorType = this.classifyBehaviorType(interactions, user, leadScore)
      const conversionProbability = this.calculateConversionProbability(interactions, user, leadScore)
      const { strengths, riskFactors } = this.identifyBehaviorFactors(interactions, user)
      const recommendedActions = this.generateRecommendedActions(behaviorType, riskFactors, conversionProbability)
      const nextBestAction = this.determineNextBestAction(behaviorType, engagementPattern, conversionProbability)

      const profile: UserBehaviorProfile = {
        userId,
        behaviorType,
        engagementPattern,
        conversionProbability,
        recommendedActions,
        nextBestAction,
        riskFactors,
        strengths
      }

      // Cache the profile
      this.behaviorPatterns.set(userId, profile)

      return profile
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error analyzing user behavior:', error);
      }
      throw error
    }
  }

  // Real-time session analysis
  async analyzeSession(sessionId: string, userId?: string): Promise<SessionAnalytics> {
    try {
      const interactions = await InteractionModel.findBySessionId(sessionId)
      
      if (interactions.length === 0) {
        return this.createEmptySessionAnalytics(sessionId, userId)
      }

      const firstInteraction = interactions[interactions.length - 1]
      const lastInteraction = interactions[0]
      const duration = lastInteraction.timestamp.getTime() - firstInteraction.timestamp.getTime()

      // Count different types of interactions
      let pageViews = 0
      let toolInteractions = 0
      let contentEngagement = 0
      let ctaClicks = 0
      let maxScrollDepth = 0
      let exitIntent = false
      const conversionEvents: string[] = []
      const behaviorSignals: string[] = []

      interactions.forEach(interaction => {
        switch (interaction.eventType) {
          case 'page_view':
            pageViews++
            break
          case 'tool_start':
          case 'tool_complete':
          case 'tool_interaction':
            toolInteractions++
            if (interaction.eventType === 'tool_complete') {
              conversionEvents.push(`tool_completed:${interaction.eventData.tool_name}`)
            }
            break
          case 'content_engagement':
            contentEngagement++
            break
          case 'cta_click':
            ctaClicks++
            break
          case 'scroll_depth':
            const depth = interaction.eventData.depth as number || 0
            maxScrollDepth = Math.max(maxScrollDepth, depth)
            break
          case 'exit_intent':
            exitIntent = true
            behaviorSignals.push('exit_intent_detected')
            break
          case 'form_submission':
            conversionEvents.push(`form_submitted:${interaction.eventData.form_id}`)
            break
          case 'webinar_registration':
            conversionEvents.push(`webinar_registered:${interaction.eventData.webinar_id}`)
            break
        }
      })

      // Calculate engagement score for this session
      const engagementScore = this.calculateSessionEngagementScore({
        pageViews,
        toolInteractions,
        contentEngagement,
        ctaClicks,
        duration,
        scrollDepth: maxScrollDepth,
        conversionEvents: conversionEvents.length
      })

      // Identify behavior signals
      if (duration > 300000) behaviorSignals.push('long_session') // 5+ minutes
      if (toolInteractions > 2) behaviorSignals.push('tool_explorer')
      if (ctaClicks > 3) behaviorSignals.push('high_cta_engagement')
      if (pageViews > 5) behaviorSignals.push('content_browser')
      if (maxScrollDepth > 80) behaviorSignals.push('deep_reader')
      if (conversionEvents.length > 0) behaviorSignals.push('converter')

      const analytics: SessionAnalytics = {
        sessionId,
        userId,
        duration,
        pageViews,
        toolInteractions,
        contentEngagement,
        ctaClicks,
        scrollDepth: maxScrollDepth,
        exitIntent,
        conversionEvents,
        engagementScore,
        behaviorSignals
      }

      // Cache session analytics
      this.sessionAnalytics.set(sessionId, analytics)

      return analytics
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error analyzing session:', error);
      }
      return this.createEmptySessionAnalytics(sessionId, userId)
    }
  }

  // Real-time engagement scoring
  async updateEngagementScore(
    userId: string, 
    sessionId: string, 
    interactionType: string, 
    interactionData: Record<string, unknown>
  ): Promise<RealTimeEngagementUpdate> {
    try {
      const user = await UserModel.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const previousScore = user.engagementScore
      const previousTier = user.currentTier

      // Calculate score increment based on interaction
      const scoreIncrement = this.calculateScoreIncrement(interactionType, interactionData)
      const newScore = previousScore + scoreIncrement

      // Update user's engagement score
      await user.updateEngagementScore(newScore)

      // Update lead score
      await LeadScoresModel.updateScore(userId)
      const leadScore = await LeadScoresModel.findByUserId(userId)

      // Check for tier change
      let newTier = previousTier
      let tierChanged = false

      if (leadScore) {
        newTier = await LeadScoresModel.getTierFromScore(leadScore.totalScore)
        if (newTier !== previousTier) {
          await user.updateTier(newTier)
          tierChanged = true
        }
      }

      // Analyze current behavior signals
      const sessionAnalytics = await this.analyzeSession(sessionId, userId)
      const behaviorSignals = sessionAnalytics.behaviorSignals

      // Generate real-time recommendations
      const recommendedInterventions = this.generateRealTimeInterventions(
        newTier,
        behaviorSignals,
        scoreIncrement,
        tierChanged
      )

      const update: RealTimeEngagementUpdate = {
        userId,
        sessionId,
        currentScore: newScore,
        scoreChange: scoreIncrement,
        tierStatus: newTier,
        tierChanged,
        behaviorSignals,
        recommendedInterventions
      }

      // Trigger real-time updates
      await this.broadcastEngagementUpdate(update)

      return update
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error updating engagement score:', error);
      }
      throw error
    }
  }

  // Extract engagement pattern from interactions
  private extractEngagementPattern(interactions: InteractionModel[]): string[] {
    const pattern: string[] = []
    const eventSequence = interactions
      .slice(-10) // Last 10 interactions
      .reverse() // Chronological order
      .map(i => i.eventType)

    // Group consecutive similar events
    let currentEvent = ''
    let count = 0

    eventSequence.forEach(event => {
      if (event === currentEvent) {
        count++
      } else {
        if (currentEvent && count > 0) {
          pattern.push(count > 1 ? `${currentEvent}(${count})` : currentEvent)
        }
        currentEvent = event
        count = 1
      }
    })

    // Add the last event
    if (currentEvent && count > 0) {
      pattern.push(count > 1 ? `${currentEvent}(${count})` : currentEvent)
    }

    return pattern
  }

  // Classify user behavior type
  private classifyBehaviorType(
    interactions: InteractionModel[], 
    user: UserModel, 
    leadScore: LeadScoresModel | null
  ): 'explorer' | 'focused' | 'hesitant' | 'converter' | 'researcher' {
    const totalInteractions = interactions.length
    const toolInteractions = interactions.filter(i => i.eventType.includes('tool')).length
    const contentInteractions = interactions.filter(i => i.eventType === 'content_engagement').length
    const ctaClicks = interactions.filter(i => i.eventType === 'cta_click').length
    const conversionEvents = interactions.filter(i => 
      i.eventType === 'form_submission' || 
      i.eventType === 'webinar_registration' ||
      i.eventType === 'tool_complete'
    ).length

    const toolRatio = totalInteractions > 0 ? toolInteractions / totalInteractions : 0
    const contentRatio = totalInteractions > 0 ? contentInteractions / totalInteractions : 0
    const ctaRatio = totalInteractions > 0 ? ctaClicks / totalInteractions : 0
    const conversionRatio = totalInteractions > 0 ? conversionEvents / totalInteractions : 0

    // Converter: High conversion events
    if (conversionRatio > 0.3 || conversionEvents >= 3) {
      return 'converter'
    }

    // Explorer: High tool usage, diverse interactions
    if (toolRatio > 0.4 && totalInteractions > 10) {
      return 'explorer'
    }

    // Researcher: High content engagement, low CTAs
    if (contentRatio > 0.5 && ctaRatio < 0.2) {
      return 'researcher'
    }

    // Focused: High CTA engagement, moderate interactions
    if (ctaRatio > 0.3 && totalInteractions > 5) {
      return 'focused'
    }

    // Hesitant: Low engagement across all metrics
    return 'hesitant'
  }

  // Calculate conversion probability
  private calculateConversionProbability(
    interactions: InteractionModel[], 
    user: UserModel, 
    leadScore: LeadScoresModel | null
  ): number {
    let probability = 0

    // Base probability from lead score
    if (leadScore) {
      probability += Math.min(0.4, leadScore.totalScore / 100)
    }

    // Engagement factors
    const toolCompletions = interactions.filter(i => i.eventType === 'tool_complete').length
    probability += Math.min(0.3, toolCompletions * 0.1)

    const ctaClicks = interactions.filter(i => i.eventType === 'cta_click').length
    probability += Math.min(0.2, ctaClicks * 0.05)

    // Time factors
    const daysSinceJoined = (Date.now() - new Date(user.toJSON().created_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceJoined > 7) {
      probability += 0.1 // Engaged for over a week
    }

    // Tier factor
    switch (user.currentTier) {
      case 'soft-member':
        probability += 0.3
        break
      case 'engaged':
        probability += 0.15
        break
      case 'browser':
        probability += 0.05
        break
    }

    return Math.min(1, probability)
  }

  // Identify behavior factors
  private identifyBehaviorFactors(
    interactions: InteractionModel[], 
    user: UserModel
  ): { strengths: string[]; riskFactors: string[] } {
    const strengths: string[] = []
    const riskFactors: string[] = []

    const totalInteractions = interactions.length
    const recentInteractions = interactions.filter(i => 
      Date.now() - i.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length

    // Strengths
    if (totalInteractions > 20) strengths.push('High overall engagement')
    if (recentInteractions > 5) strengths.push('Recent active engagement')
    if (user.captureLevel >= 2) strengths.push('Provided contact information')
    if (user.currentTier === 'soft-member') strengths.push('Committed soft member')

    const toolCompletions = interactions.filter(i => i.eventType === 'tool_complete').length
    if (toolCompletions > 2) strengths.push('Tool completion habit')

    // Risk factors
    if (recentInteractions === 0) riskFactors.push('No recent activity')
    if (totalInteractions < 3) riskFactors.push('Low overall engagement')
    if (user.captureLevel === 1) riskFactors.push('Minimal information provided')

    const exitIntents = interactions.filter(i => i.eventType === 'exit_intent').length
    if (exitIntents > 2) riskFactors.push('Multiple exit attempts')

    const lastActivity = new Date(user.toJSON().last_activity)
    const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceActivity > 7) riskFactors.push('Inactive for over a week')

    return { strengths, riskFactors }
  }

  // Generate recommended actions
  private generateRecommendedActions(
    behaviorType: string, 
    riskFactors: string[], 
    conversionProbability: number
  ): string[] {
    const actions: string[] = []

    // Type-specific actions
    switch (behaviorType) {
      case 'explorer':
        actions.push('Provide advanced tool recommendations')
        actions.push('Offer comprehensive assessment suite')
        break
      case 'focused':
        actions.push('Present clear next-step CTAs')
        actions.push('Offer direct consultation booking')
        break
      case 'hesitant':
        actions.push('Provide low-commitment value offers')
        actions.push('Share social proof and testimonials')
        break
      case 'converter':
        actions.push('Present premium offerings')
        actions.push('Facilitate office visit scheduling')
        break
      case 'researcher':
        actions.push('Provide in-depth educational content')
        actions.push('Offer comprehensive resource downloads')
        break
    }

    // Risk-based actions
    if (riskFactors.includes('No recent activity')) {
      actions.push('Send re-engagement email sequence')
    }
    if (riskFactors.includes('Multiple exit attempts')) {
      actions.push('Implement exit-intent value offers')
    }

    // Probability-based actions
    if (conversionProbability > 0.7) {
      actions.push('Present high-commitment offers')
    } else if (conversionProbability < 0.3) {
      actions.push('Focus on value building and trust')
    }

    return actions.slice(0, 4) // Limit to 4 actions
  }

  // Determine next best action
  private determineNextBestAction(
    behaviorType: string, 
    engagementPattern: string[], 
    conversionProbability: number
  ): string {
    if (conversionProbability > 0.8) {
      return 'Schedule office consultation'
    }

    if (conversionProbability > 0.6) {
      return 'Register for premium webinar'
    }

    switch (behaviorType) {
      case 'explorer':
        return 'Complete comprehensive assessment suite'
      case 'focused':
        return 'Download personalized action plan'
      case 'hesitant':
        return 'Take quick potential quiz'
      case 'converter':
        return 'Book discovery call'
      case 'researcher':
        return 'Access premium content library'
      default:
        return 'Explore interactive tools'
    }
  }

  // Calculate score increment for real-time updates
  private calculateScoreIncrement(interactionType: string, interactionData: Record<string, unknown>): number {
    switch (interactionType) {
      case 'page_view':
        return 0.5
      case 'scroll_depth':
        const depth = interactionData.depth as number || 0
        return Math.min(1, depth / 100)
      case 'time_on_page':
        const timeSpent = interactionData.timeSpent as number || 0
        return Math.min(3, timeSpent / 60) // 1 point per minute, max 3
      case 'cta_click':
        return 2
      case 'tool_start':
        return 3
      case 'tool_complete':
        return 5
      case 'content_engagement':
        return 1.5
      case 'form_submission':
        return 10
      case 'webinar_registration':
        return 15
      default:
        return 0.5
    }
  }

  // Generate real-time interventions
  private generateRealTimeInterventions(
    tier: string, 
    behaviorSignals: string[], 
    scoreIncrement: number, 
    tierChanged: boolean
  ): string[] {
    const interventions: string[] = []

    if (tierChanged) {
      interventions.push(`Congratulations! You've reached ${tier} status`)
    }

    if (behaviorSignals.includes('exit_intent_detected')) {
      interventions.push('Show exit-intent value offer')
    }

    if (behaviorSignals.includes('tool_explorer')) {
      interventions.push('Recommend advanced assessment tools')
    }

    if (behaviorSignals.includes('high_cta_engagement')) {
      interventions.push('Present premium conversion opportunity')
    }

    if (behaviorSignals.includes('long_session')) {
      interventions.push('Offer to save progress and continue later')
    }

    if (scoreIncrement > 5) {
      interventions.push('Acknowledge high-value interaction')
    }

    return interventions.slice(0, 3) // Limit to 3 interventions
  }

  // Calculate session engagement score
  private calculateSessionEngagementScore(metrics: {
    pageViews: number
    toolInteractions: number
    contentEngagement: number
    ctaClicks: number
    duration: number
    scrollDepth: number
    conversionEvents: number
  }): number {
    let score = 0

    score += Math.min(10, metrics.pageViews * 0.5)
    score += Math.min(15, metrics.toolInteractions * 2)
    score += Math.min(10, metrics.contentEngagement * 1.5)
    score += Math.min(8, metrics.ctaClicks * 2)
    score += Math.min(10, (metrics.duration / 60000) * 2) // 2 points per minute
    score += Math.min(5, metrics.scrollDepth / 20)
    score += metrics.conversionEvents * 10

    return Math.round(score)
  }

  // Create empty session analytics
  private createEmptySessionAnalytics(sessionId: string, userId?: string): SessionAnalytics {
    return {
      sessionId,
      userId,
      duration: 0,
      pageViews: 0,
      toolInteractions: 0,
      contentEngagement: 0,
      ctaClicks: 0,
      scrollDepth: 0,
      exitIntent: false,
      conversionEvents: [],
      engagementScore: 0,
      behaviorSignals: []
    }
  }

  // Broadcast engagement updates via Supabase realtime
  private async broadcastEngagementUpdate(update: RealTimeEngagementUpdate): Promise<void> {
    try {
      await supabase
        .channel('engagement-updates')
        .send({
          type: 'broadcast',
          event: 'real-time-engagement-update',
          payload: update
        })
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to broadcast engagement update:', error);
      }
    }
  }

  // Get cached behavior profile
  getBehaviorProfile(userId: string): UserBehaviorProfile | null {
    return this.behaviorPatterns.get(userId) || null
  }

  // Get cached session analytics
  getSessionAnalytics(sessionId: string): SessionAnalytics | null {
    return this.sessionAnalytics.get(sessionId) || null
  }

  // Clear cache
  clearCache(): void {
    this.behaviorPatterns.clear()
    this.sessionAnalytics.clear()
  }
}

// Export singleton instance
export const behavioralAnalysis = BehavioralAnalysisEngine.getInstance()