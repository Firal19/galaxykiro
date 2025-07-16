'use client'

import React from 'react'
import { trackingService } from './tracking'

// Psychological Trigger Types
export type PsychologicalTrigger = 
  | 'curiosity' 
  | 'urgency' 
  | 'social-proof' 
  | 'personalization' 
  | 'scarcity'
  | 'authority'
  | 'reciprocity'
  | 'commitment'
  | 'loss-aversion'
  | 'anchoring'

// Trigger Configuration Interface
export interface TriggerConfig {
  type: PsychologicalTrigger
  intensity: 'low' | 'medium' | 'high'
  context: string[]
  timing: TriggerTiming
  content: TriggerContent
  conditions: TriggerConditions
}

export interface TriggerTiming {
  delay?: number // seconds
  duration?: number // seconds
  frequency?: 'once' | 'session' | 'daily' | 'always'
  triggers: ('immediate' | 'scroll' | 'time' | 'interaction' | 'exit-intent')[]
  scrollPercentage?: number
}

export interface TriggerContent {
  text: string
  subtext?: string
  icon?: string
  color?: string
  animation?: string
  sound?: boolean
}

export interface TriggerConditions {
  userTier?: ('browser' | 'engaged' | 'soft-member')[]
  engagementScore?: { min?: number; max?: number }
  behaviorPattern?: string[]
  timeOnPage?: number
  sectionsViewed?: string[]
  toolsUsed?: string[]
  deviceType?: ('mobile' | 'desktop' | 'tablet')[]
  returningUser?: boolean
  excludeIfCompleted?: string[]
}

// Predefined Psychological Triggers
const PSYCHOLOGICAL_TRIGGERS: { [key in PsychologicalTrigger]: TriggerConfig[] } = {
  curiosity: [
    {
      type: 'curiosity',
      intensity: 'low',
      context: ['assessment', 'tool', 'content'],
      timing: {
        delay: 0,
        frequency: 'always',
        triggers: ['immediate']
      },
      content: {
        text: 'See Your Score',
        subtext: 'Quick 2-minute assessment',
        icon: '🎯',
        color: 'blue',
        animation: 'pulse'
      },
      conditions: {
        userTier: ['browser'],
        engagementScore: { max: 30 }
      }
    },
    {
      type: 'curiosity',
      intensity: 'medium',
      context: ['insight', 'revelation'],
      timing: {
        delay: 30,
        frequency: 'once',
        triggers: ['time', 'scroll'],
        scrollPercentage: 25
      },
      content: {
        text: 'Discover What\'s Holding You Back',
        subtext: 'Most people never find out...',
        icon: '🔍',
        color: 'purple',
        animation: 'bounce'
      },
      conditions: {
        userTier: ['browser', 'engaged'],
        timeOnPage: 30
      }
    },
    {
      type: 'curiosity',
      intensity: 'high',
      context: ['transformation', 'potential'],
      timing: {
        delay: 60,
        frequency: 'session',
        triggers: ['time', 'interaction']
      },
      content: {
        text: 'What If You\'re Only Using 10% of Your Potential?',
        subtext: 'The hidden 90% is waiting to be unlocked',
        icon: '🚀',
        color: 'gradient',
        animation: 'glow'
      },
      conditions: {
        engagementScore: { min: 20 },
        sectionsViewed: ['success-gap', 'change-paradox']
      }
    }
  ],

  urgency: [
    {
      type: 'urgency',
      intensity: 'low',
      context: ['action', 'decision'],
      timing: {
        delay: 120,
        frequency: 'session',
        triggers: ['time']
      },
      content: {
        text: 'Don\'t Wait - Start Today',
        subtext: 'Every day you wait is a day lost',
        icon: '⏰',
        color: 'orange',
        animation: 'shake'
      },
      conditions: {
        timeOnPage: 120,
        userTier: ['engaged']
      }
    },
    {
      type: 'urgency',
      intensity: 'medium',
      context: ['opportunity', 'limited-time'],
      timing: {
        delay: 180,
        frequency: 'once',
        triggers: ['time', 'exit-intent']
      },
      content: {
        text: 'Limited Time - Act Now',
        subtext: 'This opportunity won\'t last forever',
        icon: '🔥',
        color: 'red',
        animation: 'pulse'
      },
      conditions: {
        engagementScore: { min: 40 },
        sectionsViewed: ['decision-door']
      }
    },
    {
      type: 'urgency',
      intensity: 'high',
      context: ['transformation', 'growth'],
      timing: {
        delay: 300,
        frequency: 'once',
        triggers: ['exit-intent']
      },
      content: {
        text: 'Your Future Self Is Waiting',
        subtext: 'Every moment of delay has a cost',
        icon: '⚡',
        color: 'red',
        animation: 'flash'
      },
      conditions: {
        engagementScore: { min: 60 },
        userTier: ['engaged', 'soft-member']
      }
    }
  ],

  'social-proof': [
    {
      type: 'social-proof',
      intensity: 'low',
      context: ['community', 'numbers'],
      timing: {
        delay: 15,
        frequency: 'always',
        triggers: ['immediate', 'scroll'],
        scrollPercentage: 10
      },
      content: {
        text: '10,000+ People Transformed',
        subtext: 'Join the community of achievers',
        icon: '👥',
        color: 'green',
        animation: 'fade-in'
      },
      conditions: {
        userTier: ['browser']
      }
    },
    {
      type: 'social-proof',
      intensity: 'medium',
      context: ['testimonials', 'success'],
      timing: {
        delay: 45,
        frequency: 'session',
        triggers: ['scroll'],
        scrollPercentage: 50
      },
      content: {
        text: '94% See Results in 30 Days',
        subtext: 'Real people, real transformations',
        icon: '📈',
        color: 'blue',
        animation: 'slide-up'
      },
      conditions: {
        engagementScore: { min: 25 },
        sectionsViewed: ['success-gap']
      }
    },
    {
      type: 'social-proof',
      intensity: 'high',
      context: ['authority', 'expertise'],
      timing: {
        delay: 90,
        frequency: 'once',
        triggers: ['time', 'interaction']
      },
      content: {
        text: 'Trusted by Fortune 500 Leaders',
        subtext: 'The same system used by top performers',
        icon: '🏆',
        color: 'gold',
        animation: 'glow'
      },
      conditions: {
        engagementScore: { min: 50 },
        userTier: ['engaged', 'soft-member']
      }
    }
  ],

  personalization: [
    {
      type: 'personalization',
      intensity: 'low',
      context: ['name', 'location'],
      timing: {
        delay: 0,
        frequency: 'always',
        triggers: ['immediate']
      },
      content: {
        text: 'Your Personal Assessment',
        subtext: 'Customized just for you',
        icon: '👤',
        color: 'purple',
        animation: 'none'
      },
      conditions: {
        userTier: ['engaged', 'soft-member']
      }
    },
    {
      type: 'personalization',
      intensity: 'medium',
      context: ['behavior', 'preferences'],
      timing: {
        delay: 60,
        frequency: 'session',
        triggers: ['interaction']
      },
      content: {
        text: 'Based on Your Interests',
        subtext: 'Tailored recommendations for you',
        icon: '🎯',
        color: 'blue',
        animation: 'pulse'
      },
      conditions: {
        engagementScore: { min: 30 },
        toolsUsed: ['potential-assessment']
      }
    },
    {
      type: 'personalization',
      intensity: 'high',
      context: ['journey', 'progress'],
      timing: {
        delay: 120,
        frequency: 'once',
        triggers: ['time']
      },
      content: {
        text: 'Your Transformation Journey',
        subtext: 'Designed specifically for your goals',
        icon: '🌟',
        color: 'gradient',
        animation: 'glow'
      },
      conditions: {
        engagementScore: { min: 60 },
        sectionsViewed: ['vision-void', 'leadership-lever']
      }
    }
  ],

  scarcity: [
    {
      type: 'scarcity',
      intensity: 'low',
      context: ['availability', 'spots'],
      timing: {
        delay: 180,
        frequency: 'session',
        triggers: ['time']
      },
      content: {
        text: 'Limited Spots Available',
        subtext: 'Only a few spaces left',
        icon: '🎫',
        color: 'orange',
        animation: 'pulse'
      },
      conditions: {
        engagementScore: { min: 40 },
        userTier: ['engaged']
      }
    },
    {
      type: 'scarcity',
      intensity: 'medium',
      context: ['exclusive', 'access'],
      timing: {
        delay: 240,
        frequency: 'once',
        triggers: ['time', 'exit-intent']
      },
      content: {
        text: 'Exclusive Access Ending Soon',
        subtext: 'Don\'t miss this opportunity',
        icon: '🔒',
        color: 'red',
        animation: 'shake'
      },
      conditions: {
        engagementScore: { min: 55 },
        sectionsViewed: ['decision-door']
      }
    },
    {
      type: 'scarcity',
      intensity: 'high',
      context: ['final-chance', 'closing'],
      timing: {
        delay: 300,
        frequency: 'once',
        triggers: ['exit-intent']
      },
      content: {
        text: 'Final Chance - Closing Tonight',
        subtext: 'This won\'t be available again',
        icon: '🚨',
        color: 'red',
        animation: 'flash'
      },
      conditions: {
        engagementScore: { min: 70 },
        userTier: ['soft-member']
      }
    }
  ],

  authority: [
    {
      type: 'authority',
      intensity: 'low',
      context: ['credentials', 'experience'],
      timing: {
        delay: 30,
        frequency: 'always',
        triggers: ['scroll'],
        scrollPercentage: 20
      },
      content: {
        text: '15+ Years of Expertise',
        subtext: 'Proven track record of success',
        icon: '🎓',
        color: 'blue',
        animation: 'fade-in'
      },
      conditions: {
        userTier: ['browser', 'engaged']
      }
    },
    {
      type: 'authority',
      intensity: 'medium',
      context: ['research', 'science'],
      timing: {
        delay: 90,
        frequency: 'session',
        triggers: ['interaction']
      },
      content: {
        text: 'Research-Backed Methods',
        subtext: 'Based on proven psychological principles',
        icon: '🔬',
        color: 'green',
        animation: 'slide-up'
      },
      conditions: {
        engagementScore: { min: 35 },
        sectionsViewed: ['change-paradox']
      }
    }
  ],

  reciprocity: [
    {
      type: 'reciprocity',
      intensity: 'low',
      context: ['free', 'gift'],
      timing: {
        delay: 60,
        frequency: 'session',
        triggers: ['time']
      },
      content: {
        text: 'Free Assessment Gift',
        subtext: 'Our gift to help you get started',
        icon: '🎁',
        color: 'green',
        animation: 'bounce'
      },
      conditions: {
        userTier: ['browser'],
        timeOnPage: 60
      }
    }
  ],

  commitment: [
    {
      type: 'commitment',
      intensity: 'medium',
      context: ['promise', 'pledge'],
      timing: {
        delay: 120,
        frequency: 'once',
        triggers: ['interaction']
      },
      content: {
        text: 'Make a Commitment to Yourself',
        subtext: 'Your future self will thank you',
        icon: '🤝',
        color: 'purple',
        animation: 'glow'
      },
      conditions: {
        engagementScore: { min: 50 },
        sectionsViewed: ['vision-void']
      }
    }
  ],

  'loss-aversion': [
    {
      type: 'loss-aversion',
      intensity: 'medium',
      context: ['missed-opportunity', 'regret'],
      timing: {
        delay: 180,
        frequency: 'once',
        triggers: ['exit-intent']
      },
      content: {
        text: 'Don\'t Let This Opportunity Slip Away',
        subtext: 'You\'ll regret not taking action today',
        icon: '⚠️',
        color: 'orange',
        animation: 'shake'
      },
      conditions: {
        engagementScore: { min: 45 },
        userTier: ['engaged']
      }
    }
  ],

  anchoring: [
    {
      type: 'anchoring',
      intensity: 'low',
      context: ['value', 'comparison'],
      timing: {
        delay: 90,
        frequency: 'session',
        triggers: ['scroll'],
        scrollPercentage: 60
      },
      content: {
        text: 'Incredible Value',
        subtext: 'Available to you today',
        icon: '💎',
        color: 'gold',
        animation: 'glow'
      },
      conditions: {
        engagementScore: { min: 40 },
        sectionsViewed: ['decision-door']
      }
    }
  ]
}

// Psychological Triggers Service
class PsychologicalTriggersService {
  private activeTriggers: Map<string, TriggerConfig> = new Map()
  private triggerHistory: Map<string, Date[]> = new Map()
  private userContext: any = {}

  constructor() {
    this.loadTriggerHistory()
  }

  // Get appropriate triggers for current context
  getTriggersForContext(
    context: string,
    userTier: string,
    engagementScore: number,
    behaviorPattern: string,
    sectionsViewed: string[],
    toolsUsed: string[],
    timeOnPage: number,
    deviceType: string = 'desktop',
    returningUser: boolean = false
  ): TriggerConfig[] {
    const applicableTriggers: TriggerConfig[] = []

    // Check each trigger type
    Object.values(PSYCHOLOGICAL_TRIGGERS).forEach(triggerGroup => {
      triggerGroup.forEach(trigger => {
        if (this.shouldShowTrigger(trigger, {
          context,
          userTier,
          engagementScore,
          behaviorPattern,
          sectionsViewed,
          toolsUsed,
          timeOnPage,
          deviceType,
          returningUser
        })) {
          applicableTriggers.push(trigger)
        }
      })
    })

    // Sort by intensity and relevance
    return applicableTriggers.sort((a, b) => {
      const intensityOrder = { low: 1, medium: 2, high: 3 }
      return intensityOrder[b.intensity] - intensityOrder[a.intensity]
    })
  }

  // Check if trigger should be shown
  private shouldShowTrigger(trigger: TriggerConfig, userContext: any): boolean {
    const conditions = trigger.conditions

    // Check user tier
    if (conditions.userTier && !conditions.userTier.includes(userContext.userTier)) {
      return false
    }

    // Check engagement score
    if (conditions.engagementScore) {
      if (conditions.engagementScore.min && userContext.engagementScore < conditions.engagementScore.min) {
        return false
      }
      if (conditions.engagementScore.max && userContext.engagementScore > conditions.engagementScore.max) {
        return false
      }
    }

    // Check behavior pattern
    if (conditions.behaviorPattern && !conditions.behaviorPattern.includes(userContext.behaviorPattern)) {
      return false
    }

    // Check time on page
    if (conditions.timeOnPage && userContext.timeOnPage < conditions.timeOnPage) {
      return false
    }

    // Check sections viewed
    if (conditions.sectionsViewed && 
        !conditions.sectionsViewed.some(section => userContext.sectionsViewed.includes(section))) {
      return false
    }

    // Check tools used
    if (conditions.toolsUsed && 
        !conditions.toolsUsed.some(tool => userContext.toolsUsed.includes(tool))) {
      return false
    }

    // Check device type
    if (conditions.deviceType && !conditions.deviceType.includes(userContext.deviceType)) {
      return false
    }

    // Check returning user
    if (conditions.returningUser !== undefined && conditions.returningUser !== userContext.returningUser) {
      return false
    }

    // Check exclusions
    if (conditions.excludeIfCompleted && 
        conditions.excludeIfCompleted.some(item => userContext.toolsUsed.includes(item))) {
      return false
    }

    // Check frequency limits
    if (!this.checkFrequencyLimit(trigger)) {
      return false
    }

    return true
  }

  // Check frequency limits
  private checkFrequencyLimit(trigger: TriggerConfig): boolean {
    const triggerId = this.getTriggerKey(trigger)
    const history = this.triggerHistory.get(triggerId) || []
    const now = new Date()

    switch (trigger.timing.frequency) {
      case 'once':
        return history.length === 0
      case 'session':
        // Check if shown in current session (last 30 minutes)
        const sessionStart = new Date(now.getTime() - 30 * 60 * 1000)
        return !history.some(date => date > sessionStart)
      case 'daily':
        // Check if shown today
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return !history.some(date => date > today)
      case 'always':
        return true
      default:
        return true
    }
  }

  // Generate trigger key
  private getTriggerKey(trigger: TriggerConfig): string {
    return `${trigger.type}-${trigger.intensity}-${trigger.context.join('-')}`
  }

  // Track trigger display
  trackTriggerDisplay(trigger: TriggerConfig, userId?: string): void {
    const triggerId = this.getTriggerKey(trigger)
    const history = this.triggerHistory.get(triggerId) || []
    history.push(new Date())
    this.triggerHistory.set(triggerId, history)
    
    this.saveTriggerHistory()
    
    // Track in external service
    if (userId) {
      trackingService.trackPsychologicalTrigger(trigger.type, trigger.intensity, userId, {
        context: trigger.context,
        content: trigger.content.text
      })
    }
  }

  // Track trigger interaction
  trackTriggerInteraction(trigger: TriggerConfig, action: string, userId?: string): void {
    if (userId) {
      trackingService.trackTriggerInteraction(trigger.type, action, userId, {
        intensity: trigger.intensity,
        context: trigger.context,
        content: trigger.content.text
      })
    }
  }

  // Get trigger content with personalization
  getPersonalizedContent(trigger: TriggerConfig, userContext: any): TriggerContent {
    const content = { ...trigger.content }

    // Personalize based on user context
    if (trigger.type === 'personalization') {
      if (userContext.name) {
        content.text = content.text.replace('Your', `${userContext.name}'s`)
      }
      if (userContext.city) {
        content.subtext = `${content.subtext} in ${userContext.city}`
      }
    }

    // Add social proof numbers
    if (trigger.type === 'social-proof') {
      const numbers = this.getSocialProofNumbers()
      content.text = content.text.replace(/\d+,?\d*/g, numbers.users.toLocaleString())
      if (content.subtext) {
        content.subtext = content.subtext.replace(/\d+%/g, `${numbers.successRate}%`)
      }
    }

    // Add urgency timing
    if (trigger.type === 'urgency') {
      const timeLeft = this.getUrgencyTimeLeft()
      if (timeLeft) {
        content.subtext = `${content.subtext} - ${timeLeft}`
      }
    }

    return content
  }

  // Get social proof numbers (would be dynamic in real implementation)
  private getSocialProofNumbers(): { users: number; successRate: number } {
    return {
      users: 10000 + Math.floor(Math.random() * 1000),
      successRate: 94 + Math.floor(Math.random() * 5)
    }
  }

  // Get urgency time left (would be dynamic in real implementation)
  private getUrgencyTimeLeft(): string | null {
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    const now = new Date()
    const hoursLeft = Math.ceil((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60))
    
    if (hoursLeft <= 24) {
      return `${hoursLeft} hours left`
    }
    return null
  }

  // Save trigger history to localStorage
  private saveTriggerHistory(): void {
    try {
      const data = Array.from(this.triggerHistory.entries()).map(([key, dates]) => [
        key,
        dates.map(date => date.toISOString())
      ])
      localStorage.setItem('gdt_trigger_history', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save trigger history:', error)
    }
  }

  // Load trigger history from localStorage
  private loadTriggerHistory(): void {
    try {
      const data = localStorage.getItem('gdt_trigger_history')
      if (data) {
        const parsed = JSON.parse(data)
        this.triggerHistory = new Map(
          parsed.map(([key, dates]: [string, string[]]) => [
            key,
            dates.map(dateStr => new Date(dateStr))
          ])
        )
      }
    } catch (error) {
      console.error('Failed to load trigger history:', error)
    }
  }

  // Get trigger effectiveness analytics
  getTriggerAnalytics(): any {
    const analytics: any = {}
    
    Object.keys(PSYCHOLOGICAL_TRIGGERS).forEach(triggerType => {
      analytics[triggerType] = {
        totalShown: 0,
        totalClicked: 0,
        clickRate: 0,
        avgIntensity: 0
      }
    })

    // This would be populated from actual tracking data
    return analytics
  }
}

// Export singleton instance
export const psychologicalTriggersService = new PsychologicalTriggersService()

// React hook for using psychological triggers
export function usePsychologicalTriggers(
  context: string,
  userTier: string,
  engagementScore: number,
  behaviorPattern: string,
  sectionsViewed: string[],
  toolsUsed: string[],
  timeOnPage: number,
  userId?: string
) {
  const [triggers, setTriggers] = React.useState<TriggerConfig[]>([])
  const [activeTrigger, setActiveTrigger] = React.useState<TriggerConfig | null>(null)

  React.useEffect(() => {
    const applicableTriggers = psychologicalTriggersService.getTriggersForContext(
      context,
      userTier,
      engagementScore,
      behaviorPattern,
      sectionsViewed,
      toolsUsed,
      timeOnPage
    )
    
    setTriggers(applicableTriggers)
    
    // Set the highest priority trigger as active
    if (applicableTriggers.length > 0) {
      setActiveTrigger(applicableTriggers[0])
    }
  }, [context, userTier, engagementScore, behaviorPattern, sectionsViewed, toolsUsed, timeOnPage])

  const trackDisplay = React.useCallback((trigger: TriggerConfig) => {
    psychologicalTriggersService.trackTriggerDisplay(trigger, userId)
  }, [userId])

  const trackInteraction = React.useCallback((trigger: TriggerConfig, action: string) => {
    psychologicalTriggersService.trackTriggerInteraction(trigger, action, userId)
  }, [userId])

  const getPersonalizedContent = React.useCallback((trigger: TriggerConfig) => {
    return psychologicalTriggersService.getPersonalizedContent(trigger, {
      // This would come from user context
      name: 'User',
      city: 'Addis Ababa'
    })
  }, [])

  return {
    triggers,
    activeTrigger,
    trackDisplay,
    trackInteraction,
    getPersonalizedContent
  }
}

export default psychologicalTriggersService