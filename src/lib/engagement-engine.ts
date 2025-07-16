import { useAppStore } from './store'
import { trackingService } from './tracking'

// Engagement scoring configuration
export interface EngagementConfig {
  timeOnPage: {
    weight: number
    thresholds: { [key: string]: number }
  }
  scrollDepth: {
    weight: number
    thresholds: { [key: string]: number }
  }
  interactions: {
    weight: number
    values: { [key: string]: number }
  }
  content: {
    weight: number
    values: { [key: string]: number }
  }
  tools: {
    weight: number
    values: { [key: string]: number }
  }
}

// Default engagement scoring configuration
const DEFAULT_ENGAGEMENT_CONFIG: EngagementConfig = {
  timeOnPage: {
    weight: 0.2,
    thresholds: {
      '30s': 5,
      '1min': 10,
      '2min': 20,
      '5min': 35,
      '10min': 50,
    }
  },
  scrollDepth: {
    weight: 0.15,
    thresholds: {
      '25%': 5,
      '50%': 10,
      '75%': 15,
      '90%': 20,
      '100%': 25,
    }
  },
  interactions: {
    weight: 0.25,
    values: {
      'section_view': 2,
      'cta_click': 5,
      'form_focus': 3,
      'form_submit': 10,
      'modal_open': 4,
      'video_play': 6,
      'video_complete': 12,
    }
  },
  content: {
    weight: 0.2,
    values: {
      'blog_read': 8,
      'guide_download': 12,
      'resource_access': 10,
      'content_share': 15,
    }
  },
  tools: {
    weight: 0.2,
    values: {
      'tool_start': 8,
      'tool_progress': 5,
      'tool_complete': 20,
      'result_view': 10,
      'result_share': 15,
    }
  }
}

// User behavior patterns interface
export interface UserBehavior {
  sessionDuration: number
  scrollDepth: number
  sectionsViewed: string[]
  toolsUsed: string[]
  contentConsumed: string[]
  ctasClicked: string[]
  interactionCount: number
  returnVisitor: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  dayOfWeek: string
}

// Engagement level interface
export interface EngagementLevel {
  score: number
  level: 'low' | 'medium' | 'high' | 'very-high'
  tier: 'browser' | 'engaged' | 'soft-member'
  readinessIndicator: number
  behaviorPattern: 'explorer' | 'researcher' | 'action-taker' | 'skeptic'
}

// Behavioral trigger interface
export interface BehaviorTrigger {
  id: string
  name: string
  condition: (behavior: UserBehavior, engagement: EngagementLevel) => boolean
  priority: number
  cooldown: number // minutes
  lastTriggered?: Date
}

class EngagementEngine {
  private config: EngagementConfig
  private behaviorTriggers: BehaviorTrigger[]
  private sessionStartTime: Date
  private pageStartTime: Date
  private currentPageId: string
  private scrollTracker: number = 0
  private interactionTracker: Map<string, number> = new Map()

  constructor(config: EngagementConfig = DEFAULT_ENGAGEMENT_CONFIG) {
    this.config = config
    this.sessionStartTime = new Date()
    this.pageStartTime = new Date()
    this.currentPageId = typeof window !== 'undefined' ? window.location.pathname : '/'
    this.behaviorTriggers = this.initializeBehaviorTriggers()
    
    if (typeof window !== 'undefined') {
      this.initializeTracking()
    }
  }

  private initializeBehaviorTriggers(): BehaviorTrigger[] {
    return [
      {
        id: 'exit-intent',
        name: 'Exit Intent Capture',
        condition: (behavior, engagement) => 
          engagement.level === 'medium' && behavior.sessionDuration > 60,
        priority: 10,
        cooldown: 30,
      },
      {
        id: 'deep-engagement',
        name: 'Deep Engagement Escalation',
        condition: (behavior, engagement) => 
          engagement.score > 50 && behavior.toolsUsed.length > 1,
        priority: 8,
        cooldown: 60,
      },
      {
        id: 'tool-completion',
        name: 'Tool Completion Follow-up',
        condition: (behavior, engagement) => 
          behavior.toolsUsed.length > 0 && engagement.level === 'high',
        priority: 9,
        cooldown: 15,
      },
      {
        id: 'content-consumer',
        name: 'Content Consumer Nurture',
        condition: (behavior, engagement) => 
          behavior.contentConsumed.length > 2 && engagement.behaviorPattern === 'researcher',
        priority: 7,
        cooldown: 45,
      },
      {
        id: 'return-visitor',
        name: 'Return Visitor Welcome',
        condition: (behavior, engagement) => 
          behavior.returnVisitor && engagement.tier === 'browser',
        priority: 6,
        cooldown: 1440, // 24 hours
      },
      {
        id: 'mobile-optimization',
        name: 'Mobile User Optimization',
        condition: (behavior, engagement) => 
          behavior.deviceType === 'mobile' && behavior.sessionDuration > 120,
        priority: 5,
        cooldown: 60,
      }
    ]
  }

  private initializeTracking(): void {
    // Track scroll depth
    let ticking = false
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)
      
      if (scrollPercent > this.scrollTracker) {
        this.scrollTracker = scrollPercent
        useAppStore.getState().updateScrollDepth(scrollPercent)
      }
      ticking = false
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth)
        ticking = true
      }
    })

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateTimeOnPage()
      } else {
        this.pageStartTime = new Date()
      }
    })

    // Track beforeunload for final time update
    window.addEventListener('beforeunload', () => {
      this.updateTimeOnPage()
    })

    // Update time on page every 30 seconds
    setInterval(() => {
      this.updateTimeOnPage()
    }, 30000)
  }

  private updateTimeOnPage(): void {
    const timeSpent = Math.round((Date.now() - this.pageStartTime.getTime()) / 1000)
    useAppStore.getState().updateTimeOnPage(this.currentPageId, timeSpent)
  }

  // Calculate engagement score based on current behavior
  calculateEngagementScore(behavior: UserBehavior): number {
    let score = 0

    // Time on page scoring
    const timeScore = this.calculateTimeScore(behavior.sessionDuration)
    score += timeScore * this.config.timeOnPage.weight

    // Scroll depth scoring
    const scrollScore = this.calculateScrollScore(behavior.scrollDepth)
    score += scrollScore * this.config.scrollDepth.weight

    // Interaction scoring
    const interactionScore = this.calculateInteractionScore(behavior)
    score += interactionScore * this.config.interactions.weight

    // Content consumption scoring
    const contentScore = this.calculateContentScore(behavior.contentConsumed)
    score += contentScore * this.config.content.weight

    // Tool usage scoring
    const toolScore = this.calculateToolScore(behavior.toolsUsed)
    score += toolScore * this.config.tools.weight

    return Math.min(Math.round(score), 100)
  }

  private calculateTimeScore(duration: number): number {
    const thresholds = this.config.timeOnPage.thresholds
    
    if (duration >= 600) return thresholds['10min'] // 10+ minutes
    if (duration >= 300) return thresholds['5min']  // 5+ minutes
    if (duration >= 120) return thresholds['2min']  // 2+ minutes
    if (duration >= 60) return thresholds['1min']   // 1+ minute
    if (duration >= 30) return thresholds['30s']    // 30+ seconds
    
    return 0
  }

  private calculateScrollScore(depth: number): number {
    const thresholds = this.config.scrollDepth.thresholds
    
    if (depth >= 100) return thresholds['100%']
    if (depth >= 90) return thresholds['90%']
    if (depth >= 75) return thresholds['75%']
    if (depth >= 50) return thresholds['50%']
    if (depth >= 25) return thresholds['25%']
    
    return 0
  }

  private calculateInteractionScore(behavior: UserBehavior): number {
    let score = 0
    const values = this.config.interactions.values

    // Section views
    score += behavior.sectionsViewed.length * values.section_view

    // CTA clicks
    score += behavior.ctasClicked.length * values.cta_click

    // General interaction count
    score += behavior.interactionCount * 2

    return score
  }

  private calculateContentScore(contentConsumed: string[]): number {
    let score = 0
    const values = this.config.content.values

    contentConsumed.forEach(contentId => {
      // Determine content type and add appropriate score
      if (contentId.includes('blog')) {
        score += values.blog_read
      } else if (contentId.includes('guide')) {
        score += values.guide_download
      } else {
        score += values.resource_access
      }
    })

    return score
  }

  private calculateToolScore(toolsUsed: string[]): number {
    let score = 0
    const values = this.config.tools.values

    toolsUsed.forEach(toolId => {
      score += values.tool_start
      // Additional scoring based on completion would be tracked separately
    })

    return score
  }

  // Determine engagement level based on score and behavior
  determineEngagementLevel(score: number, behavior: UserBehavior): EngagementLevel {
    let level: 'low' | 'medium' | 'high' | 'very-high'
    let tier: 'browser' | 'engaged' | 'soft-member'
    let readinessIndicator: number

    // Determine level based on score
    if (score >= 80) {
      level = 'very-high'
      tier = 'soft-member'
      readinessIndicator = 90
    } else if (score >= 50) {
      level = 'high'
      tier = 'engaged'
      readinessIndicator = 70
    } else if (score >= 25) {
      level = 'medium'
      tier = 'engaged'
      readinessIndicator = 50
    } else {
      level = 'low'
      tier = 'browser'
      readinessIndicator = 20
    }

    // Determine behavior pattern
    const behaviorPattern = this.determineBehaviorPattern(behavior, score)

    return {
      score,
      level,
      tier,
      readinessIndicator,
      behaviorPattern
    }
  }

  private determineBehaviorPattern(behavior: UserBehavior, score: number): 'explorer' | 'researcher' | 'action-taker' | 'skeptic' {
    const toolToContentRatio = behavior.toolsUsed.length / Math.max(behavior.contentConsumed.length, 1)
    const ctaToViewRatio = behavior.ctasClicked.length / Math.max(behavior.sectionsViewed.length, 1)

    if (toolToContentRatio > 1.5 && ctaToViewRatio > 0.5) {
      return 'action-taker'
    } else if (behavior.contentConsumed.length > 3 && toolToContentRatio < 0.5) {
      return 'researcher'
    } else if (behavior.sectionsViewed.length > 4 && score < 30) {
      return 'skeptic'
    } else {
      return 'explorer'
    }
  }

  // Get current user behavior from store
  getCurrentBehavior(): UserBehavior {
    const store = useAppStore.getState()
    const journey = store.journey
    
    const sessionDuration = Math.round((Date.now() - this.sessionStartTime.getTime()) / 1000)
    const now = new Date()
    const hour = now.getHours()
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    if (hour >= 6 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening'
    else timeOfDay = 'night'

    const deviceType = this.getDeviceType()
    const returnVisitor = this.isReturnVisitor()

    return {
      sessionDuration,
      scrollDepth: journey.scrollDepth,
      sectionsViewed: journey.sectionsViewed,
      toolsUsed: journey.toolsUsed,
      contentConsumed: journey.contentConsumed,
      ctasClicked: journey.ctasClicked,
      interactionCount: journey.ctasClicked.length + journey.sectionsViewed.length,
      returnVisitor,
      deviceType,
      timeOfDay,
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
    }
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private isReturnVisitor(): boolean {
    if (typeof localStorage === 'undefined') return false
    
    const lastVisit = localStorage.getItem('gdt_last_visit')
    const now = Date.now()
    
    if (lastVisit) {
      const timeSinceLastVisit = now - parseInt(lastVisit)
      const isReturn = timeSinceLastVisit > 30 * 60 * 1000 // 30 minutes
      
      localStorage.setItem('gdt_last_visit', now.toString())
      return isReturn
    } else {
      localStorage.setItem('gdt_last_visit', now.toString())
      return false
    }
  }

  // Check and trigger behavioral triggers
  checkBehaviorTriggers(behavior: UserBehavior, engagement: EngagementLevel): BehaviorTrigger[] {
    const triggeredBehaviors: BehaviorTrigger[] = []
    const now = new Date()

    this.behaviorTriggers
      .sort((a, b) => b.priority - a.priority)
      .forEach(trigger => {
        // Check cooldown
        if (trigger.lastTriggered) {
          const timeSinceTriggered = now.getTime() - trigger.lastTriggered.getTime()
          const cooldownMs = trigger.cooldown * 60 * 1000
          
          if (timeSinceTriggered < cooldownMs) {
            return
          }
        }

        // Check condition
        if (trigger.condition(behavior, engagement)) {
          trigger.lastTriggered = now
          triggeredBehaviors.push(trigger)
        }
      })

    return triggeredBehaviors
  }

  // Track specific interaction
  trackInteraction(type: string, data?: any): void {
    const count = this.interactionTracker.get(type) || 0
    this.interactionTracker.set(type, count + 1)

    // Track in store and external service
    trackingService.trackUserJourney({
      eventType: type,
      eventData: data,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined
    })
  }

  // Get engagement insights for personalization
  getEngagementInsights(): {
    primaryInterest: string
    recommendedContent: string[]
    nextBestAction: string
    personalizedMessage: string
  } {
    const behavior = this.getCurrentBehavior()
    const score = this.calculateEngagementScore(behavior)
    const engagement = this.determineEngagementLevel(score, behavior)

    // Determine primary interest based on sections viewed
    const primaryInterest = this.determinePrimaryInterest(behavior.sectionsViewed)
    
    // Recommend content based on behavior pattern
    const recommendedContent = this.getRecommendedContent(engagement.behaviorPattern, primaryInterest)
    
    // Suggest next best action
    const nextBestAction = this.getNextBestAction(engagement, behavior)
    
    // Create personalized message
    const personalizedMessage = this.getPersonalizedMessage(engagement, behavior)

    return {
      primaryInterest,
      recommendedContent,
      nextBestAction,
      personalizedMessage
    }
  }

  private determinePrimaryInterest(sectionsViewed: string[]): string {
    const sectionInterests: { [key: string]: string } = {
      'success-gap': 'Achievement & Success',
      'change-paradox': 'Habit Formation',
      'vision-void': 'Goal Setting & Vision',
      'leadership-lever': 'Leadership Development',
      'decision-door': 'Decision Making'
    }

    // Find most viewed section type
    const sectionCounts: { [key: string]: number } = {}
    sectionsViewed.forEach(section => {
      const interest = sectionInterests[section] || 'Personal Development'
      sectionCounts[interest] = (sectionCounts[interest] || 0) + 1
    })

    return Object.keys(sectionCounts).reduce((a, b) => 
      sectionCounts[a] > sectionCounts[b] ? a : b
    ) || 'Personal Development'
  }

  private getRecommendedContent(pattern: string, interest: string): string[] {
    const contentMap: { [key: string]: { [key: string]: string[] } } = {
      'action-taker': {
        'Achievement & Success': ['Success Factor Calculator', 'Goal Achievement Predictor', '90-Day Action Plan'],
        'Habit Formation': ['21-Day Habit Installer', 'Habit Strength Analyzer', 'Routine Optimizer'],
        'Goal Setting & Vision': ['Dream Clarity Generator', 'Life Wheel Diagnostic', 'Vision Board Creator'],
        'Leadership Development': ['Leadership Style Profiler', 'Team Builder Simulator', 'Influence Calculator'],
        'Decision Making': ['Cost of Inaction Calculator', 'Decision Framework Tool', 'Priority Matrix']
      },
      'researcher': {
        'Achievement & Success': ['Success Research Library', 'Achievement Psychology Guide', 'Success Stories Collection'],
        'Habit Formation': ['Neuroscience of Habits', 'Behavior Change Research', 'Habit Formation Guide'],
        'Goal Setting & Vision': ['Vision Psychology Research', 'Goal Setting Science', 'Future Self Studies'],
        'Leadership Development': ['Leadership Research Hub', 'Management Psychology', 'Influence Studies'],
        'Decision Making': ['Decision Science Library', 'Cognitive Bias Guide', 'Choice Architecture']
      },
      'explorer': {
        'Achievement & Success': ['Potential Assessment', 'Success Gap Analysis', 'Achievement Readiness'],
        'Habit Formation': ['Habit Discovery Tool', 'Change Readiness Quiz', 'Behavior Pattern Analysis'],
        'Goal Setting & Vision': ['Vision Clarity Assessment', 'Life Balance Wheel', 'Future Self Visualizer'],
        'Leadership Development': ['Leadership Style Quiz', 'Influence Assessment', 'Team Dynamics Tool'],
        'Decision Making': ['Decision Style Assessment', 'Choice Clarity Tool', 'Priority Discovery']
      },
      'skeptic': {
        'Achievement & Success': ['Success Myth Busters', 'Evidence-Based Achievement', 'Research-Backed Methods'],
        'Habit Formation': ['Habit Science Facts', 'Debunked Change Myths', 'Evidence-Based Habits'],
        'Goal Setting & Vision': ['Goal Setting Research', 'Vision Science Facts', 'Evidence-Based Planning'],
        'Leadership Development': ['Leadership Research', 'Management Science', 'Evidence-Based Leadership'],
        'Decision Making': ['Decision Science', 'Choice Research', 'Evidence-Based Decisions']
      }
    }

    return contentMap[pattern]?.[interest] || contentMap['explorer'][interest] || []
  }

  private getNextBestAction(engagement: EngagementLevel, behavior: UserBehavior): string {
    if (engagement.level === 'very-high') {
      return 'Schedule a personal consultation to accelerate your transformation'
    } else if (engagement.level === 'high') {
      return 'Complete your personalized action plan with our advanced tools'
    } else if (engagement.level === 'medium') {
      return 'Take our comprehensive potential assessment to unlock deeper insights'
    } else {
      return 'Explore our interactive tools to discover your hidden potential'
    }
  }

  private getPersonalizedMessage(engagement: EngagementLevel, behavior: UserBehavior): string {
    const patterns = {
      'action-taker': "You're ready to take action! Let's turn your insights into results.",
      'researcher': "You love to learn! Here are some research-backed resources for you.",
      'explorer': "You're curious about your potential! Let's explore what's possible.",
      'skeptic': "You want proof! Here's the evidence-based approach to transformation."
    }

    const timeMessages = {
      'morning': "Great way to start your day with personal development!",
      'afternoon': "Perfect time for a growth break!",
      'evening': "Ending your day with self-improvement - excellent choice!",
      'night': "Late night learning? Your dedication is impressive!"
    }

    const baseMessage = patterns[engagement.behaviorPattern]
    const timeMessage = timeMessages[behavior.timeOfDay]

    return `${baseMessage} ${timeMessage}`
  }

  // Reset tracking for new session
  resetSession(): void {
    this.sessionStartTime = new Date()
    this.pageStartTime = new Date()
    this.scrollTracker = 0
    this.interactionTracker.clear()
  }
}

// Export singleton instance
export const engagementEngine = new EngagementEngine()

// Export types and interfaces
export type { UserBehavior, EngagementLevel, BehaviorTrigger, EngagementConfig }