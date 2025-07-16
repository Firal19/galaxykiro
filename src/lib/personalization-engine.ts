import { engagementEngine, type UserBehavior, type EngagementLevel } from './engagement-engine'
import { useAppStore } from './store'
import { trackingService } from './tracking'

// Content recommendation interfaces
export interface ContentItem {
  id: string
  title: string
  description: string
  category: ContentCategory
  depthLevel: 'surface' | 'medium' | 'deep'
  contentType: 'blog' | 'guide' | 'tool' | 'video' | 'assessment' | 'resource'
  tags: string[]
  estimatedTime: number // in minutes
  requiredCaptureLevel: 1 | 2 | 3
  targetBehaviorPattern: string[]
  targetEngagementLevel: string[]
  personalityMatch: string[]
  prerequisites?: string[]
  relatedContent: string[]
  conversionGoal: 'engagement' | 'capture' | 'conversion'
  priority: number
}

export interface ContentCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  targetAudience: string[]
}

// Personalization context
export interface PersonalizationContext {
  userId?: string
  behavior: UserBehavior
  engagement: EngagementLevel
  preferences: UserPreferences
  history: ContentHistory
  currentContext: string
  timeOfDay: string
  deviceType: string
}

export interface UserPreferences {
  contentTypes: string[]
  preferredDepth: 'surface' | 'medium' | 'deep'
  timePreference: number // preferred content length in minutes
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  motivationStyle: 'achievement' | 'social' | 'mastery' | 'purpose'
  communicationStyle: 'direct' | 'supportive' | 'analytical' | 'expressive'
}

export interface ContentHistory {
  viewed: string[]
  completed: string[]
  shared: string[]
  bookmarked: string[]
  timeSpent: { [contentId: string]: number }
  engagementScores: { [contentId: string]: number }
}

// Content categories
const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: 'untapped-you',
    name: 'The Untapped You',
    description: 'Discover your hidden potential and unlock your true capabilities',
    icon: '🔓',
    color: 'blue',
    targetAudience: ['explorer', 'skeptic']
  },
  {
    id: 'dreams-to-reality',
    name: 'Dreams to Reality',
    description: 'Transform your vision into actionable plans and measurable results',
    icon: '🎯',
    color: 'green',
    targetAudience: ['action-taker', 'explorer']
  },
  {
    id: 'daily-edge',
    name: 'The Daily Edge',
    description: 'Small daily habits that create extraordinary long-term results',
    icon: '⚡',
    color: 'orange',
    targetAudience: ['action-taker', 'researcher']
  },
  {
    id: 'inner-game',
    name: 'The Inner Game',
    description: 'Master your mindset, emotions, and internal dialogue',
    icon: '🧠',
    color: 'purple',
    targetAudience: ['researcher', 'skeptic']
  },
  {
    id: 'multiplier-effect',
    name: 'The Multiplier Effect',
    description: 'Leadership and influence strategies that amplify your impact',
    icon: '🚀',
    color: 'red',
    targetAudience: ['action-taker', 'researcher']
  }
]

// Sample content library
const CONTENT_LIBRARY: ContentItem[] = [
  // Untapped You - Surface Level
  {
    id: 'potential-myths',
    title: '5 Myths About Human Potential That Keep You Stuck',
    description: 'Debunking common misconceptions about what\'s possible for you',
    category: CONTENT_CATEGORIES[0],
    depthLevel: 'surface',
    contentType: 'blog',
    tags: ['potential', 'mindset', 'myths'],
    estimatedTime: 5,
    requiredCaptureLevel: 1,
    targetBehaviorPattern: ['explorer', 'skeptic'],
    targetEngagementLevel: ['low', 'medium'],
    personalityMatch: ['analytical', 'direct'],
    relatedContent: ['potential-assessment', 'limiting-beliefs-guide'],
    conversionGoal: 'engagement',
    priority: 8
  },
  {
    id: 'potential-assessment',
    title: 'Potential Quotient Calculator',
    description: 'Discover what percentage of your potential you\'re currently using',
    category: CONTENT_CATEGORIES[0],
    depthLevel: 'medium',
    contentType: 'assessment',
    tags: ['assessment', 'potential', 'self-discovery'],
    estimatedTime: 10,
    requiredCaptureLevel: 1,
    targetBehaviorPattern: ['explorer', 'action-taker'],
    targetEngagementLevel: ['medium', 'high'],
    personalityMatch: ['achievement', 'mastery'],
    relatedContent: ['limiting-beliefs-guide', 'breakthrough-readiness'],
    conversionGoal: 'capture',
    priority: 15
  },
  {
    id: 'limiting-beliefs-guide',
    title: 'The Complete Guide to Identifying and Overcoming Limiting Beliefs',
    description: 'A comprehensive system for breaking through mental barriers',
    category: CONTENT_CATEGORIES[0],
    depthLevel: 'deep',
    contentType: 'guide',
    tags: ['beliefs', 'psychology', 'transformation'],
    estimatedTime: 25,
    requiredCaptureLevel: 2,
    targetBehaviorPattern: ['researcher', 'action-taker'],
    targetEngagementLevel: ['high', 'very-high'],
    personalityMatch: ['mastery', 'purpose'],
    prerequisites: ['potential-assessment'],
    relatedContent: ['breakthrough-readiness', 'mindset-mastery'],
    conversionGoal: 'conversion',
    priority: 20
  },

  // Dreams to Reality - Surface Level
  {
    id: 'goal-setting-mistakes',
    title: 'Why 92% of Goals Fail (And How to Be in the 8%)',
    description: 'The science-backed approach to goal achievement',
    category: CONTENT_CATEGORIES[1],
    depthLevel: 'surface',
    contentType: 'blog',
    tags: ['goals', 'achievement', 'science'],
    estimatedTime: 7,
    requiredCaptureLevel: 1,
    targetBehaviorPattern: ['explorer', 'researcher'],
    targetEngagementLevel: ['low', 'medium'],
    personalityMatch: ['achievement', 'analytical'],
    relatedContent: ['goal-achievement-predictor', 'vision-clarity-tool'],
    conversionGoal: 'engagement',
    priority: 9
  },
  {
    id: 'goal-achievement-predictor',
    title: 'Goal Achievement Predictor',
    description: 'Calculate your probability of achieving your current goals',
    category: CONTENT_CATEGORIES[1],
    depthLevel: 'medium',
    contentType: 'tool',
    tags: ['goals', 'prediction', 'planning'],
    estimatedTime: 12,
    requiredCaptureLevel: 2,
    targetBehaviorPattern: ['action-taker', 'researcher'],
    targetEngagementLevel: ['medium', 'high'],
    personalityMatch: ['achievement', 'mastery'],
    relatedContent: ['vision-clarity-tool', 'life-wheel-diagnostic'],
    conversionGoal: 'capture',
    priority: 16
  },
  {
    id: 'vision-clarity-tool',
    title: 'Future Self Visualizer',
    description: 'Create a crystal-clear vision of your ideal future',
    category: CONTENT_CATEGORIES[1],
    depthLevel: 'deep',
    contentType: 'tool',
    tags: ['vision', 'future', 'planning'],
    estimatedTime: 20,
    requiredCaptureLevel: 3,
    targetBehaviorPattern: ['action-taker', 'explorer'],
    targetEngagementLevel: ['high', 'very-high'],
    personalityMatch: ['purpose', 'mastery'],
    prerequisites: ['goal-achievement-predictor'],
    relatedContent: ['life-wheel-diagnostic', 'transformation-roadmap'],
    conversionGoal: 'conversion',
    priority: 22
  },

  // Daily Edge - Habit Formation
  {
    id: 'habit-science',
    title: 'The Neuroscience of Habit Formation (Simplified)',
    description: 'How your brain creates habits and how to hack the process',
    category: CONTENT_CATEGORIES[2],
    depthLevel: 'surface',
    contentType: 'blog',
    tags: ['habits', 'neuroscience', 'behavior'],
    estimatedTime: 6,
    requiredCaptureLevel: 1,
    targetBehaviorPattern: ['researcher', 'skeptic'],
    targetEngagementLevel: ['low', 'medium'],
    personalityMatch: ['analytical', 'mastery'],
    relatedContent: ['habit-strength-analyzer', 'routine-optimizer'],
    conversionGoal: 'engagement',
    priority: 10
  },
  {
    id: 'habit-strength-analyzer',
    title: 'Habit Strength Analyzer',
    description: 'Evaluate the strength of your current habits and identify weak points',
    category: CONTENT_CATEGORIES[2],
    depthLevel: 'medium',
    contentType: 'assessment',
    tags: ['habits', 'analysis', 'improvement'],
    estimatedTime: 8,
    requiredCaptureLevel: 2,
    targetBehaviorPattern: ['action-taker', 'researcher'],
    targetEngagementLevel: ['medium', 'high'],
    personalityMatch: ['achievement', 'mastery'],
    relatedContent: ['routine-optimizer', '21-day-installer'],
    conversionGoal: 'capture',
    priority: 17
  },
  {
    id: '21-day-installer',
    title: '21-Day Habit Installer System',
    description: 'A proven system for installing new habits that stick',
    category: CONTENT_CATEGORIES[2],
    depthLevel: 'deep',
    contentType: 'guide',
    tags: ['habits', 'system', 'implementation'],
    estimatedTime: 30,
    requiredCaptureLevel: 3,
    targetBehaviorPattern: ['action-taker'],
    targetEngagementLevel: ['high', 'very-high'],
    personalityMatch: ['achievement', 'purpose'],
    prerequisites: ['habit-strength-analyzer'],
    relatedContent: ['routine-optimizer', 'daily-edge-mastery'],
    conversionGoal: 'conversion',
    priority: 25
  },

  // Inner Game - Mindset
  {
    id: 'inner-dialogue',
    title: 'The Voice in Your Head: Friend or Foe?',
    description: 'Understanding and optimizing your internal dialogue',
    category: CONTENT_CATEGORIES[3],
    depthLevel: 'surface',
    contentType: 'blog',
    tags: ['mindset', 'psychology', 'self-talk'],
    estimatedTime: 8,
    requiredCaptureLevel: 1,
    targetBehaviorPattern: ['researcher', 'explorer'],
    targetEngagementLevel: ['low', 'medium'],
    personalityMatch: ['supportive', 'analytical'],
    relatedContent: ['inner-dialogue-decoder', 'affirmation-architect'],
    conversionGoal: 'engagement',
    priority: 7
  },
  {
    id: 'inner-dialogue-decoder',
    title: 'Inner Dialogue Decoder',
    description: 'Analyze your self-talk patterns and their impact on your success',
    category: CONTENT_CATEGORIES[3],
    depthLevel: 'medium',
    contentType: 'tool',
    tags: ['self-talk', 'analysis', 'mindset'],
    estimatedTime: 15,
    requiredCaptureLevel: 2,
    targetBehaviorPattern: ['researcher', 'action-taker'],
    targetEngagementLevel: ['medium', 'high'],
    personalityMatch: ['mastery', 'purpose'],
    relatedContent: ['affirmation-architect', 'mental-model-mapper'],
    conversionGoal: 'capture',
    priority: 18
  },

  // Multiplier Effect - Leadership
  {
    id: 'leadership-styles',
    title: 'The 5 Leadership Styles That Actually Work',
    description: 'Research-backed leadership approaches for maximum impact',
    category: CONTENT_CATEGORIES[4],
    depthLevel: 'surface',
    contentType: 'blog',
    tags: ['leadership', 'influence', 'management'],
    estimatedTime: 9,
    requiredCaptureLevel: 1,
    targetBehaviorPattern: ['action-taker', 'researcher'],
    targetEngagementLevel: ['medium', 'high'],
    personalityMatch: ['achievement', 'social'],
    relatedContent: ['leadership-style-profiler', 'influence-calculator'],
    conversionGoal: 'engagement',
    priority: 11
  },
  {
    id: 'leadership-style-profiler',
    title: 'Leadership Style Profiler',
    description: 'Discover your natural leadership style and how to leverage it',
    category: CONTENT_CATEGORIES[4],
    depthLevel: 'medium',
    contentType: 'assessment',
    tags: ['leadership', 'assessment', 'style'],
    estimatedTime: 12,
    requiredCaptureLevel: 2,
    targetBehaviorPattern: ['action-taker'],
    targetEngagementLevel: ['high', 'very-high'],
    personalityMatch: ['achievement', 'social'],
    relatedContent: ['influence-calculator', 'team-builder-simulator'],
    conversionGoal: 'capture',
    priority: 19
  }
]

class PersonalizationEngine {
  private contentLibrary: ContentItem[]
  private categories: ContentCategory[]

  constructor() {
    this.contentLibrary = CONTENT_LIBRARY
    this.categories = CONTENT_CATEGORIES
  }

  // Get personalized content recommendations
  getPersonalizedRecommendations(
    context: PersonalizationContext,
    maxRecommendations: number = 5
  ): ContentItem[] {
    const { behavior, engagement, preferences, history, currentContext } = context

    // Score each content item based on personalization factors
    const scoredContent = this.contentLibrary.map(item => ({
      item,
      score: this.calculatePersonalizationScore(item, context)
    }))

    // Filter out content that doesn't meet requirements
    const eligibleContent = scoredContent.filter(({ item, score }) => {
      // Check capture level requirement
      if (item.requiredCaptureLevel > (context.userId ? 3 : 1)) {
        return false
      }

      // Check prerequisites
      if (item.prerequisites && 
          !item.prerequisites.every(prereq => history.completed.includes(prereq))) {
        return false
      }

      // Check if already consumed recently
      if (history.viewed.includes(item.id) && 
          !this.shouldRecommendAgain(item.id, history)) {
        return false
      }

      // Minimum score threshold
      return score > 0.3
    })

    // Sort by score and return top recommendations
    return eligibleContent
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations)
      .map(({ item }) => item)
  }

  // Calculate personalization score for a content item
  private calculatePersonalizationScore(
    item: ContentItem,
    context: PersonalizationContext
  ): number {
    let score = 0
    const { behavior, engagement, preferences, history } = context

    // Behavior pattern match (30% weight)
    if (item.targetBehaviorPattern.includes(engagement.behaviorPattern)) {
      score += 0.3
    }

    // Engagement level match (25% weight)
    if (item.targetEngagementLevel.includes(engagement.level)) {
      score += 0.25
    }

    // Content type preference (15% weight)
    if (preferences.contentTypes.includes(item.contentType)) {
      score += 0.15
    }

    // Depth level preference (10% weight)
    if (item.depthLevel === preferences.preferredDepth) {
      score += 0.1
    } else if (
      (preferences.preferredDepth === 'medium' && item.depthLevel !== 'surface') ||
      (preferences.preferredDepth === 'deep' && item.depthLevel !== 'surface')
    ) {
      score += 0.05
    }

    // Time preference match (10% weight)
    const timeDiff = Math.abs(item.estimatedTime - preferences.timePreference)
    const timeScore = Math.max(0, 1 - (timeDiff / preferences.timePreference))
    score += timeScore * 0.1

    // Personality/motivation match (10% weight)
    if (item.personalityMatch.includes(preferences.motivationStyle) ||
        item.personalityMatch.includes(preferences.communicationStyle)) {
      score += 0.1
    }

    // Recency and diversity bonus
    score += this.calculateRecencyBonus(item, history)
    score += this.calculateDiversityBonus(item, history)

    // Context relevance bonus
    score += this.calculateContextBonus(item, context)

    // Priority adjustment
    score *= (item.priority / 20) // Normalize priority to 0-1 range

    return Math.min(score, 1) // Cap at 1.0
  }

  // Calculate recency bonus (prefer content not recently viewed)
  private calculateRecencyBonus(item: ContentItem, history: ContentHistory): number {
    if (!history.viewed.includes(item.id)) {
      return 0.05 // Bonus for new content
    }

    // Reduce score for recently viewed content
    const viewCount = history.viewed.filter(id => id === item.id).length
    return Math.max(-0.1, -0.02 * viewCount)
  }

  // Calculate diversity bonus (prefer content from different categories)
  private calculateDiversityBonus(item: ContentItem, history: ContentHistory): number {
    const recentCategories = history.viewed
      .slice(-5) // Last 5 items
      .map(id => this.contentLibrary.find(c => c.id === id)?.category.id)
      .filter(Boolean)

    const categoryCount = recentCategories.filter(cat => cat === item.category.id).length
    
    if (categoryCount === 0) {
      return 0.05 // Bonus for new category
    } else if (categoryCount === 1) {
      return 0.02 // Small bonus
    } else {
      return -0.03 // Penalty for over-representation
    }
  }

  // Calculate context relevance bonus
  private calculateContextBonus(item: ContentItem, context: PersonalizationContext): number {
    let bonus = 0

    // Time of day relevance
    if (context.timeOfDay === 'morning' && item.tags.includes('habits')) {
      bonus += 0.03
    } else if (context.timeOfDay === 'evening' && item.tags.includes('reflection')) {
      bonus += 0.03
    }

    // Device type relevance
    if (context.deviceType === 'mobile' && item.estimatedTime <= 10) {
      bonus += 0.02
    } else if (context.deviceType === 'desktop' && item.estimatedTime > 15) {
      bonus += 0.02
    }

    // Current context relevance
    if (context.currentContext === 'assessment-completion' && 
        item.contentType === 'guide') {
      bonus += 0.05
    }

    return bonus
  }

  // Check if content should be recommended again
  private shouldRecommendAgain(contentId: string, history: ContentHistory): boolean {
    const viewCount = history.viewed.filter(id => id === contentId).length
    const timeSpent = history.timeSpent[contentId] || 0
    const engagementScore = history.engagementScores[contentId] || 0

    // Recommend again if:
    // - High engagement but not completed
    // - Viewed only once and spent little time
    return (engagementScore > 0.7 && !history.completed.includes(contentId)) ||
           (viewCount === 1 && timeSpent < 60)
  }

  // Get content by category with personalization
  getPersonalizedCategoryContent(
    categoryId: string,
    context: PersonalizationContext,
    maxItems: number = 10
  ): ContentItem[] {
    const categoryContent = this.contentLibrary.filter(
      item => item.category.id === categoryId
    )

    const scoredContent = categoryContent.map(item => ({
      item,
      score: this.calculatePersonalizationScore(item, context)
    }))

    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map(({ item }) => item)
  }

  // Get next best content based on current content
  getNextBestContent(
    currentContentId: string,
    context: PersonalizationContext,
    maxSuggestions: number = 3
  ): ContentItem[] {
    const currentContent = this.contentLibrary.find(item => item.id === currentContentId)
    if (!currentContent) return []

    // Get related content
    const relatedContent = this.contentLibrary.filter(item =>
      currentContent.relatedContent.includes(item.id) ||
      item.relatedContent.includes(currentContentId)
    )

    // Get content from same category
    const categoryContent = this.contentLibrary.filter(item =>
      item.category.id === currentContent.category.id &&
      item.id !== currentContentId
    )

    // Combine and score
    const candidateContent = [...new Set([...relatedContent, ...categoryContent])]
    
    const scoredContent = candidateContent.map(item => ({
      item,
      score: this.calculatePersonalizationScore(item, context) +
             (relatedContent.includes(item) ? 0.2 : 0) // Bonus for related content
    }))

    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions)
      .map(({ item }) => item)
  }

  // Get user preferences from behavior and history
  inferUserPreferences(
    behavior: UserBehavior,
    engagement: EngagementLevel,
    history: ContentHistory
  ): UserPreferences {
    // Analyze content consumption patterns
    const contentTypes = this.analyzeContentTypePreferences(history)
    const preferredDepth = this.analyzeDepthPreference(history)
    const timePreference = this.analyzeTimePreference(history)
    const learningStyle = this.analyzeLearningStyle(behavior, history)
    const motivationStyle = this.analyzeMotivationStyle(engagement, behavior)
    const communicationStyle = this.analyzeCommunicationStyle(behavior)

    return {
      contentTypes,
      preferredDepth,
      timePreference,
      learningStyle,
      motivationStyle,
      communicationStyle
    }
  }

  private analyzeContentTypePreferences(history: ContentHistory): string[] {
    const typeCounts: { [key: string]: number } = {}
    
    history.viewed.forEach(contentId => {
      const content = this.contentLibrary.find(item => item.id === contentId)
      if (content) {
        typeCounts[content.contentType] = (typeCounts[content.contentType] || 0) + 1
      }
    })

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type)
  }

  private analyzeDepthPreference(history: ContentHistory): 'surface' | 'medium' | 'deep' {
    const depthCounts: { [key: string]: number } = {}
    
    history.completed.forEach(contentId => {
      const content = this.contentLibrary.find(item => item.id === contentId)
      if (content) {
        depthCounts[content.depthLevel] = (depthCounts[content.depthLevel] || 0) + 1
      }
    })

    const preferredDepth = Object.entries(depthCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] as 'surface' | 'medium' | 'deep'

    return preferredDepth || 'medium'
  }

  private analyzeTimePreference(history: ContentHistory): number {
    const times = Object.values(history.timeSpent).filter(time => time > 0)
    if (times.length === 0) return 10 // Default 10 minutes

    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
    return Math.round(avgTime / 60) // Convert to minutes
  }

  private analyzeLearningStyle(behavior: UserBehavior, history: ContentHistory): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
    // Simple heuristic based on content preferences
    const videoCount = history.viewed.filter(id => 
      this.contentLibrary.find(item => item.id === id)?.contentType === 'video'
    ).length

    const toolCount = behavior.toolsUsed.length
    const readingCount = history.viewed.filter(id => 
      ['blog', 'guide'].includes(this.contentLibrary.find(item => item.id === id)?.contentType || '')
    ).length

    if (videoCount > toolCount && videoCount > readingCount) return 'visual'
    if (toolCount > readingCount) return 'kinesthetic'
    return 'reading'
  }

  private analyzeMotivationStyle(engagement: EngagementLevel, behavior: UserBehavior): 'achievement' | 'social' | 'mastery' | 'purpose' {
    if (engagement.behaviorPattern === 'action-taker') return 'achievement'
    if (engagement.behaviorPattern === 'researcher') return 'mastery'
    if (behavior.contentConsumed.length > behavior.toolsUsed.length) return 'purpose'
    return 'social'
  }

  private analyzeCommunicationStyle(behavior: UserBehavior): 'direct' | 'supportive' | 'analytical' | 'expressive' {
    if (behavior.deviceType === 'mobile' && behavior.sessionDuration < 300) return 'direct'
    if (behavior.sectionsViewed.length > 5) return 'analytical'
    if (behavior.ctasClicked.length > 3) return 'expressive'
    return 'supportive'
  }

  // Track content interaction for learning
  async trackContentInteraction(
    contentId: string,
    interactionType: 'view' | 'complete' | 'share' | 'bookmark',
    userId?: string,
    additionalData?: any
  ): Promise<void> {
    try {
      await trackingService.trackContentEngagement(
        contentId,
        interactionType,
        userId,
        {
          timestamp: Date.now(),
          ...additionalData
        }
      )
    } catch (error) {
      console.error('Error tracking content interaction:', error)
    }
  }

  // Get content categories
  getCategories(): ContentCategory[] {
    return this.categories
  }

  // Get content by ID
  getContentById(contentId: string): ContentItem | undefined {
    return this.contentLibrary.find(item => item.id === contentId)
  }

  // Search content
  searchContent(
    query: string,
    context: PersonalizationContext,
    maxResults: number = 10
  ): ContentItem[] {
    const queryLower = query.toLowerCase()
    
    const matchingContent = this.contentLibrary.filter(item =>
      item.title.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(queryLower))
    )

    // Score and sort by relevance and personalization
    const scoredContent = matchingContent.map(item => ({
      item,
      score: this.calculatePersonalizationScore(item, context) +
             this.calculateSearchRelevance(item, query)
    }))

    return scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(({ item }) => item)
  }

  private calculateSearchRelevance(item: ContentItem, query: string): number {
    const queryLower = query.toLowerCase()
    let relevance = 0

    // Title match
    if (item.title.toLowerCase().includes(queryLower)) {
      relevance += 0.5
    }

    // Description match
    if (item.description.toLowerCase().includes(queryLower)) {
      relevance += 0.3
    }

    // Tag match
    const tagMatches = item.tags.filter(tag => 
      tag.toLowerCase().includes(queryLower)
    ).length
    relevance += tagMatches * 0.1

    return relevance
  }
}

// Export singleton instance
export const personalizationEngine = new PersonalizationEngine()

// Export types
export type {
  ContentItem,
  ContentCategory,
  PersonalizationContext,
  UserPreferences,
  ContentHistory
}