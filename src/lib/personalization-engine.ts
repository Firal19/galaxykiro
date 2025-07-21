/**
 * Personalization Engine
 * 
 * Handles dynamic content personalization based on user behavior,
 * engagement patterns, and contextual data.
 */

import { engagementEngine } from './engagement-engine'
import { useAppStore } from './store'

// Personalization types
interface UserBehavior {
  pageViews: number
  timeOnSite: number
  interactions: number
  lastVisit: Date
  preferences: string[]
}

interface EngagementData {
  score: number
  level: 'low' | 'medium' | 'high'
  interests: string[]
  engagementHistory: Array<{
    timestamp: Date
    action: string
    value: number
  }>
}

interface UserPreferences {
  language: string
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  contentType: string[]
}

interface PersonalizationContext {
  userAgent: string
  location: string
  device: 'mobile' | 'tablet' | 'desktop'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: number
}

interface PersonalizedContent {
  title: string
  description: string
  ctaText: string
  ctaStyle: 'primary' | 'secondary' | 'outline'
  imageUrl: string
  priority: number
}

interface PersonalizationRule {
  id: string
  condition: (context: PersonalizationContext) => boolean
  action: (context: PersonalizationContext) => PersonalizedContent
  priority: number
  active: boolean
}

class PersonalizationEngine {
  private rules: PersonalizationRule[] = []
  private userProfiles: Map<string, UserBehavior> = new Map()
  private engagementData: Map<string, EngagementData> = new Map()
  private userPreferences: Map<string, UserPreferences> = new Map()

  constructor() {
    this.initializeDefaultRules()
  }

  /**
   * Initialize default personalization rules
   */
  private initializeDefaultRules(): void {
    // Rule 1: Time-based personalization
    this.addRule({
      id: 'time-based',
      condition: (context: PersonalizationContext) => {
        return context.timeOfDay === 'morning' || context.timeOfDay === 'evening'
      },
      action: (context: PersonalizationContext) => ({
        title: context.timeOfDay === 'morning' ? 'Start Your Day Right' : 'End Your Day Strong',
        description: context.timeOfDay === 'morning' 
          ? 'Discover tools to boost your morning productivity'
          : 'Reflect on your achievements and plan tomorrow',
        ctaText: 'Get Started',
        ctaStyle: 'primary',
        imageUrl: context.timeOfDay === 'morning' ? '/images/morning.jpg' : '/images/evening.jpg',
        priority: 1
      }),
      priority: 1,
      active: true
    })

    // Rule 2: Device-based personalization
    this.addRule({
      id: 'device-based',
      condition: (context: PersonalizationContext) => context.device === 'mobile',
      action: (context: PersonalizationContext) => ({
        title: 'Optimized for Mobile',
        description: 'Get the most out of your mobile experience with our streamlined tools',
        ctaText: 'Explore Mobile Tools',
        ctaStyle: 'secondary',
        imageUrl: '/images/mobile-optimized.jpg',
        priority: 2
      }),
      priority: 2,
      active: true
    })

    // Rule 3: Engagement-based personalization
    this.addRule({
      id: 'engagement-based',
      condition: (context: PersonalizationContext) => {
        // This would check actual engagement data
        return true
      },
      action: (context: PersonalizationContext) => ({
        title: 'Based on Your Interests',
        description: 'We\'ve curated content specifically for your learning style',
        ctaText: 'View Recommendations',
        ctaStyle: 'outline',
        imageUrl: '/images/personalized.jpg',
        priority: 3
      }),
      priority: 3,
      active: true
    })
  }

  /**
   * Add a new personalization rule
   */
  addRule(rule: PersonalizationRule): void {
    this.rules.push(rule)
    this.rules.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Remove a personalization rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId)
  }

  /**
   * Update user behavior data
   */
  updateUserBehavior(userId: string, behavior: Partial<UserBehavior>): void {
    const existing = this.userProfiles.get(userId) || {
      pageViews: 0,
      timeOnSite: 0,
      interactions: 0,
      lastVisit: new Date(),
      preferences: []
    }

    this.userProfiles.set(userId, { ...existing, ...behavior })
  }

  /**
   * Update engagement data
   */
  updateEngagementData(userId: string, data: Partial<EngagementData>): void {
    const existing = this.engagementData.get(userId) || {
      score: 0,
      level: 'low',
      interests: [],
      engagementHistory: []
    }

    this.engagementData.set(userId, { ...existing, ...data })
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): void {
    const existing = this.userPreferences.get(userId) || {
      language: 'en',
      theme: 'auto',
      notifications: true,
      contentType: []
    }

    this.userPreferences.set(userId, { ...existing, ...preferences })
  }

  /**
   * Get personalized content based on context
   */
  getPersonalizedContent(context: PersonalizationContext): PersonalizedContent {
    // Find the first matching rule
    const matchingRule = this.rules.find(rule => 
      rule.active && rule.condition(context)
    )

    if (matchingRule) {
      return matchingRule.action(context)
    }

    // Return default content if no rules match
    return {
      title: 'Welcome to Galaxy Dream Team',
      description: 'Discover tools and resources to unlock your potential',
      ctaText: 'Get Started',
      ctaStyle: 'primary',
      imageUrl: '/images/default.jpg',
      priority: 0
    }
  }

  /**
   * Get user behavior data
   */
  getUserBehavior(userId: string): UserBehavior | undefined {
    return this.userProfiles.get(userId)
  }

  /**
   * Get engagement data
   */
  getEngagementData(userId: string): EngagementData | undefined {
    return this.engagementData.get(userId)
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId: string): UserPreferences | undefined {
    return this.userPreferences.get(userId)
  }

  /**
   * Analyze user behavior patterns
   */
  analyzeBehaviorPatterns(userId: string): {
    engagementLevel: 'low' | 'medium' | 'high'
    preferredContent: string[]
    optimalTime: string
    devicePreference: string
  } {
    const behavior = this.getUserBehavior(userId)
    const engagement = this.getEngagementData(userId)

    if (!behavior || !engagement) {
      return {
        engagementLevel: 'low',
        preferredContent: [],
        optimalTime: 'morning',
        devicePreference: 'desktop'
      }
    }

    // Calculate engagement level
    let engagementLevel: 'low' | 'medium' | 'high' = 'low'
    if (engagement.score > 70) engagementLevel = 'high'
    else if (engagement.score > 40) engagementLevel = 'medium'

    // Analyze preferred content
    const preferredContent = engagement.interests.slice(0, 3)

    // Determine optimal time (simplified)
    const optimalTime = behavior.timeOnSite > 300 ? 'evening' : 'morning'

    // Device preference
    const devicePreference = behavior.pageViews > 10 ? 'desktop' : 'mobile'

    return {
      engagementLevel,
      preferredContent,
      optimalTime,
      devicePreference
    }
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(userId: string): Array<{
    type: 'tool' | 'content' | 'webinar' | 'assessment'
    title: string
    description: string
    confidence: number
    reason: string
  }> {
    const patterns = this.analyzeBehaviorPatterns(userId)
    const recommendations: Array<{
      type: 'tool' | 'content' | 'webinar' | 'assessment'
      title: string
      description: string
      confidence: number
      reason: string
    }> = []

    // High engagement users get advanced tools
    if (patterns.engagementLevel === 'high') {
      recommendations.push({
        type: 'tool',
        title: 'Advanced Analytics Dashboard',
        description: 'Deep dive into your performance metrics',
        confidence: 0.9,
        reason: 'High engagement level indicates readiness for advanced features'
      })
    }

    // Users with specific interests get targeted content
    if (patterns.preferredContent.includes('leadership')) {
      recommendations.push({
        type: 'webinar',
        title: 'Leadership Mastery Workshop',
        description: 'Advanced leadership techniques for experienced professionals',
        confidence: 0.8,
        reason: 'Based on your leadership interest patterns'
      })
    }

    // New users get assessment tools
    if (patterns.engagementLevel === 'low') {
      recommendations.push({
        type: 'assessment',
        title: 'Personal Development Assessment',
        description: 'Discover your strengths and growth areas',
        confidence: 0.7,
        reason: 'New users benefit from self-assessment tools'
      })
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Get personalization statistics
   */
  getStatistics(): {
    totalUsers: number
    activeRules: number
    averageEngagement: number
    topPerformingRule: string
  } {
    const totalUsers = this.userProfiles.size
    const activeRules = this.rules.filter(rule => rule.active).length
    
    let totalEngagement = 0
    let userCount = 0
    
    this.engagementData.forEach(data => {
      totalEngagement += data.score
      userCount++
    })
    
    const averageEngagement = userCount > 0 ? totalEngagement / userCount : 0
    
    // Find top performing rule (simplified)
    const topPerformingRule = this.rules.find(rule => rule.active)?.id || 'none'

    return {
      totalUsers,
      activeRules,
      averageEngagement,
      topPerformingRule
    }
  }
}

// Export singleton instance
export const personalizationEngine = new PersonalizationEngine()

// Hook for React components
export function usePersonalization() {
  const store = useAppStore()
  
  return {
    getPersonalizedContent: (context: PersonalizationContext) => 
      personalizationEngine.getPersonalizedContent(context),
    updateUserBehavior: (behavior: Partial<UserBehavior>) => {
      if (store.user?.id) {
        personalizationEngine.updateUserBehavior(store.user.id, behavior)
      }
    },
    updateEngagementData: (data: Partial<EngagementData>) => {
      if (store.user?.id) {
        personalizationEngine.updateEngagementData(store.user.id, data)
      }
    },
    updateUserPreferences: (preferences: Partial<UserPreferences>) => {
      if (store.user?.id) {
        personalizationEngine.updateUserPreferences(store.user.id, preferences)
      }
    },
    generateRecommendations: () => {
      if (store.user?.id) {
        return personalizationEngine.generateRecommendations(store.user.id)
      }
      return []
    },
    getStatistics: () => personalizationEngine.getStatistics()
  }
}