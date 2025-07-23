import { engagementEngine, type UserBehavior, type EngagementLevel } from './engagement-engine'
import { personalizationEngine, type PersonalizationContext } from './personalization-engine'
import { useAppStore } from './store'
import { trackingService } from './tracking'

// Behavioral trigger types
export interface BehaviorTrigger {
  id: string
  name: string
  description: string
  triggerType: 'time-based' | 'action-based' | 'engagement-based' | 'exit-intent' | 'scroll-based'
  priority: number
  conditions: TriggerCondition[]
  actions: TriggerAction[]
  cooldown: number // minutes
  maxTriggers: number // per session
  abTestConfig?: ABTestConfig
  isActive: boolean
  lastTriggered?: Date
  triggerCount: number
}

export interface TriggerCondition {
  type: 'time' | 'scroll' | 'engagement' | 'behavior' | 'content' | 'device' | 'custom'
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'includes' | 'excludes'
  value: string | number | boolean | string[]
  field?: string
}

export interface TriggerAction {
  type: 'modal' | 'notification' | 'cta-change' | 'content-recommend' | 'email-trigger' | 'redirect'
  config: ActionConfig
  delay?: number // seconds
}

export interface ABTestConfig {
  variants: ABTestVariant[]
  trafficSplit: number[] // percentages
  conversionGoal: string
}

export interface ABTestVariant {
  id: string
  name: string
  config: Record<string, unknown>
  weight: number
}

// Action configuration types
export type ActionConfig = 
  | ModalConfig
  | NotificationConfig
  | CTAChangeConfig
  | ContentRecommendConfig
  | EmailTriggerConfig
  | RedirectConfig

export interface ModalConfig {
  modalId: string
  title: string
  message: string
  ctaText?: string
  ctaAction?: string
}

export interface NotificationConfig {
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  cta?: string
  ctaAction?: string
}

export interface CTAChangeConfig {
  newCTA: {
    text: string
    action: string
    variant?: string
  }
}

export interface ContentRecommendConfig {
  title: string
  recommendations: 'related-content' | 'personalized' | 'trending'
  maxItems: number
  category?: string
}

export interface EmailTriggerConfig {
  templateId: string
  recipientId: string
  data?: Record<string, unknown>
}

export interface RedirectConfig {
  url: string
  newTab?: boolean
}

// Escalation commitment levels
export type CommitmentLevel = 'micro' | 'midi' | 'macro'

export interface CommitmentEscalation {
  currentLevel: CommitmentLevel
  nextLevel: CommitmentLevel
  readinessScore: number
  recommendedActions: string[]
  escalationTriggers: string[]
}

// Predefined behavioral triggers
const BEHAVIORAL_TRIGGERS: BehaviorTrigger[] = [
  {
    id: 'exit-intent-capture',
    name: 'Exit Intent Lead Capture',
    description: 'Capture leads when they attempt to leave the page',
    triggerType: 'exit-intent',
    priority: 10,
    conditions: [
      { type: 'engagement', operator: 'gte', value: 25 },
      { type: 'time', operator: 'gte', value: 60 }, // 60 seconds
      { type: 'behavior', operator: 'includes', value: ['explorer', 'action-taker'], field: 'behaviorPattern' }
    ],
    actions: [
      {
        type: 'modal',
        config: {
          modalId: 'exit-intent-capture',
          title: 'Wait! Your Potential Assessment is Ready',
          message: 'Don\'t leave without discovering what\'s possible for you.',
          cta: 'Get My Assessment',
          offer: 'potential-assessment'
        }
      }
    ],
    cooldown: 30,
    maxTriggers: 2,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'deep-engagement-escalation',
    name: 'Deep Engagement Escalation',
    description: 'Escalate commitment for highly engaged users',
    triggerType: 'engagement-based',
    priority: 9,
    conditions: [
      { type: 'engagement', operator: 'gte', value: 60 },
      { type: 'content', operator: 'gte', value: 2, field: 'toolsUsed' },
      { type: 'time', operator: 'gte', value: 300 } // 5 minutes
    ],
    actions: [
      {
        type: 'cta-change',
        config: {
          newCTA: {
            text: 'Get Your Complete Transformation Plan',
            action: 'personalized-report',
            style: 'premium'
          }
        }
      },
      {
        type: 'notification',
        config: {
          message: 'Based on your engagement, you\'re ready for the next level!',
          type: 'success',
          duration: 5000
        },
        delay: 2
      }
    ],
    cooldown: 60,
    maxTriggers: 1,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'tool-completion-follow-up',
    name: 'Tool Completion Follow-up',
    description: 'Follow up after tool completion with next steps',
    triggerType: 'action-based',
    priority: 8,
    conditions: [
      { type: 'custom', operator: 'eq', value: true, field: 'toolCompleted' },
      { type: 'engagement', operator: 'gte', value: 40 }
    ],
    actions: [
      {
        type: 'content-recommend',
        config: {
          title: 'Great job! Here\'s what to do next:',
          recommendations: 'related-content',
          maxItems: 3
        }
      },
      {
        type: 'modal',
        config: {
          modalId: 'tool-completion-follow-up',
          title: 'Congratulations on Completing Your Assessment!',
          message: 'Ready to take the next step in your transformation?',
          cta: 'See My Next Steps',
          offer: 'next-level-content'
        },
        delay: 3
      }
    ],
    cooldown: 15,
    maxTriggers: 3,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'scroll-depth-engagement',
    name: 'Scroll Depth Engagement',
    description: 'Engage users who scroll deeply but don\'t interact',
    triggerType: 'scroll-based',
    priority: 6,
    conditions: [
      { type: 'scroll', operator: 'gte', value: 75 },
      { type: 'engagement', operator: 'lt', value: 30 },
      { type: 'time', operator: 'gte', value: 120 }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          message: 'Curious about your potential? Take our 2-minute assessment!',
          type: 'info',
          cta: 'Quick Assessment',
          action: 'open-assessment'
        }
      }
    ],
    cooldown: 45,
    maxTriggers: 2,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'return-visitor-welcome',
    name: 'Return Visitor Welcome',
    description: 'Welcome back returning visitors with personalized content',
    triggerType: 'time-based',
    priority: 7,
    conditions: [
      { type: 'custom', operator: 'eq', value: true, field: 'returnVisitor' },
      { type: 'time', operator: 'gte', value: 10 }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          message: 'Welcome back! Pick up where you left off.',
          type: 'info',
          cta: 'Continue Journey',
          action: 'resume-progress'
        }
      },
      {
        type: 'content-recommend',
        config: {
          title: 'Recommended for you:',
          recommendations: 'personalized',
          maxItems: 2
        }
      }
    ],
    cooldown: 1440, // 24 hours
    maxTriggers: 1,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'mobile-optimization',
    name: 'Mobile User Optimization',
    description: 'Optimize experience for mobile users',
    triggerType: 'time-based',
    priority: 5,
    conditions: [
      { type: 'device', operator: 'eq', value: 'mobile' },
      { type: 'time', operator: 'gte', value: 90 },
      { type: 'engagement', operator: 'gte', value: 20 }
    ],
    actions: [
      {
        type: 'cta-change',
        config: {
          newCTA: {
            text: 'Quick Mobile Assessment',
            action: 'mobile-assessment',
            style: 'mobile-optimized'
          }
        }
      }
    ],
    cooldown: 60,
    maxTriggers: 1,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'content-consumer-nurture',
    name: 'Content Consumer Nurture',
    description: 'Nurture users who consume lots of content',
    triggerType: 'engagement-based',
    priority: 6,
    conditions: [
      { type: 'content', operator: 'gte', value: 3, field: 'contentConsumed' },
      { type: 'behavior', operator: 'includes', value: ['researcher'], field: 'behaviorPattern' },
      { type: 'engagement', operator: 'gte', value: 35 }
    ],
    actions: [
      {
        type: 'modal',
        config: {
          modalId: 'content-consumer-nurture',
          title: 'You\'re a Knowledge Seeker!',
          message: 'Get our complete research library and advanced tools.',
          cta: 'Access Premium Content',
          offer: 'premium-library'
        }
      }
    ],
    cooldown: 90,
    maxTriggers: 1,
    isActive: true,
    triggerCount: 0
  },
  {
    id: 'skeptic-social-proof',
    name: 'Skeptic Social Proof',
    description: 'Show social proof to skeptical users',
    triggerType: 'engagement-based',
    priority: 4,
    conditions: [
      { type: 'behavior', operator: 'includes', value: ['skeptic'], field: 'behaviorPattern' },
      { type: 'time', operator: 'gte', value: 180 },
      { type: 'engagement', operator: 'lt', value: 40 }
    ],
    actions: [
      {
        type: 'notification',
        config: {
          message: 'Join 10,000+ people who\'ve discovered their potential',
          type: 'info',
          cta: 'See Success Stories',
          action: 'show-testimonials'
        }
      }
    ],
    cooldown: 120,
    maxTriggers: 1,
    isActive: true,
    triggerCount: 0
  }
]

class BehavioralTriggerSystem {
  private triggers: Map<string, BehaviorTrigger>
  private activeListeners: Map<string, () => void>
  private sessionTriggerCounts: Map<string, number>

  constructor() {
    this.triggers = new Map()
    this.activeListeners = new Map()
    this.sessionTriggerCounts = new Map()
    
    // Initialize triggers
    BEHAVIORAL_TRIGGERS.forEach(trigger => {
      this.triggers.set(trigger.id, { ...trigger })
    })

    if (typeof window !== 'undefined') {
      this.initializeListeners()
    }
  }

  private initializeListeners(): void {
    // Exit intent listener
    let exitIntentTriggered = false
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true
        this.checkTrigger('exit-intent-capture')
        setTimeout(() => { exitIntentTriggered = false }, 5000)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    this.activeListeners.set('mouseleave', () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    })

    // Scroll listener
    let scrollTicking = false
    const handleScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          this.checkScrollBasedTriggers()
          scrollTicking = false
        })
        scrollTicking = true
      }
    }
    window.addEventListener('scroll', handleScroll)
    this.activeListeners.set('scroll', () => {
      window.removeEventListener('scroll', handleScroll)
    })

    // Time-based triggers
    setInterval(() => {
      this.checkTimeBasedTriggers()
    }, 10000) // Check every 10 seconds

    // Engagement-based triggers
    setInterval(() => {
      this.checkEngagementBasedTriggers()
    }, 30000) // Check every 30 seconds
  }

  // Check if a specific trigger should fire
  private async checkTrigger(triggerId: string, customData?: Record<string, unknown>): Promise<void> {
    const trigger = this.triggers.get(triggerId)
    if (!trigger || !trigger.isActive) return

    // Check cooldown
    if (trigger.lastTriggered) {
      const timeSinceTriggered = Date.now() - trigger.lastTriggered.getTime()
      const cooldownMs = trigger.cooldown * 60 * 1000
      if (timeSinceTriggered < cooldownMs) return
    }

    // Check max triggers per session
    const sessionCount = this.sessionTriggerCounts.get(triggerId) || 0
    if (sessionCount >= trigger.maxTriggers) return

    // Get current context
    const behavior = engagementEngine.getCurrentBehavior()
    const engagementScore = engagementEngine.calculateEngagementScore(behavior)
    const engagement = engagementEngine.determineEngagementLevel(engagementScore, behavior)

    // Check conditions
    const conditionsMet = this.evaluateConditions(trigger.conditions, {
      behavior,
      engagement,
      customData
    })

    if (conditionsMet) {
      await this.executeTrigger(trigger)
    }
  }

  // Evaluate trigger conditions
  private evaluateConditions(
    conditions: TriggerCondition[],
    context: {
      behavior: UserBehavior
      engagement: EngagementLevel
      customData?: Record<string, unknown>
    }
  ): boolean {
    return conditions.every(condition => {
      let value: string | number | boolean | string[]

      switch (condition.type) {
        case 'time':
          value = context.behavior.sessionDuration
          break
        case 'scroll':
          value = context.behavior.scrollDepth
          break
        case 'engagement':
          value = context.engagement.score
          break
        case 'behavior':
          value = condition.field === 'behaviorPattern' 
            ? context.engagement.behaviorPattern 
            : context.behavior[condition.field as keyof UserBehavior]
          break
        case 'content':
          if (condition.field === 'toolsUsed') {
            value = context.behavior.toolsUsed.length
          } else if (condition.field === 'contentConsumed') {
            value = context.behavior.contentConsumed.length
          }
          break
        case 'device':
          value = context.behavior.deviceType
          break
        case 'custom':
          value = context.customData?.[condition.field || '']
          break
        default:
          return false
      }

      return this.evaluateOperator(value, condition.operator, condition.value)
    })
  }

  // Evaluate condition operator
  private evaluateOperator(actual: string | number | boolean | string[], operator: string, expected: string | number | boolean | string[]): boolean {
    switch (operator) {
      case 'gt': return actual > expected
      case 'lt': return actual < expected
      case 'eq': return actual === expected
      case 'gte': return actual >= expected
      case 'lte': return actual <= expected
      case 'includes': 
        return Array.isArray(expected) 
          ? expected.includes(actual)
          : actual.includes(expected)
      case 'excludes':
        return Array.isArray(expected)
          ? !expected.includes(actual)
          : !actual.includes(expected)
      default:
        return false
    }
  }

  // Execute trigger actions
  private async executeTrigger(trigger: BehaviorTrigger): Promise<void> {
    try {
      // Update trigger state
      trigger.lastTriggered = new Date()
      trigger.triggerCount++
      this.sessionTriggerCounts.set(trigger.id, 
        (this.sessionTriggerCounts.get(trigger.id) || 0) + 1
      )

      // Track trigger execution
      await trackingService.trackUserJourney({
        eventType: 'behavioral_trigger',
        eventData: {
          triggerId: trigger.id,
          triggerName: trigger.name,
          triggerType: trigger.triggerType,
          actions: trigger.actions.map(a => a.type)
        }
      })

      // Execute actions
      for (const action of trigger.actions) {
        if (action.delay) {
          setTimeout(() => this.executeAction(action, trigger), action.delay * 1000)
        } else {
          await this.executeAction(action, trigger)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error executing trigger:', error)
      }
    }
  }

  // Execute individual action
  private async executeAction(action: TriggerAction, trigger: BehaviorTrigger): Promise<void> {
    const { setActiveModal } = useAppStore.getState()

    switch (action.type) {
      case 'modal':
        setActiveModal(action.config.modalId)
        break

      case 'notification':
        this.showNotification(action.config)
        break

      case 'cta-change':
        this.changeCTA(action.config)
        break

      case 'content-recommend':
        await this.showContentRecommendations(action.config)
        break

      case 'email-trigger':
        await this.triggerEmail(action.config)
        break

      case 'redirect':
        if (typeof window !== 'undefined') {
          window.location.href = action.config.url
        }
        break

      default:
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Unknown action type: ${action.type}`)
        }
    }
  }

  // Show notification
  private showNotification(config: NotificationConfig): void {
    // This would integrate with your notification system
    if (process.env.NODE_ENV === 'development') {
      console.log('Notification:', config)
    }
    
    // Example implementation with a simple toast
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div')
      notification.className = `
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
        ${config.type === 'success' ? 'bg-green-500' : 
          config.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} 
        text-white
      `
      notification.innerHTML = `
        <div class="flex items-center justify-between">
          <span>${config.message}</span>
          <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        ${config.cta ? `
          <button class="mt-2 px-3 py-1 bg-white text-blue-600 rounded text-sm hover:bg-gray-100" 
                  onclick="window.behaviorTriggerSystem.handleNotificationCTA('${config.action}')">
            ${config.cta}
          </button>
        ` : ''}
      `
      
      document.body.appendChild(notification)
      
      // Auto-remove after duration
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, config.duration || 5000)
    }
  }

  // Handle notification CTA click
  handleNotificationCTA(action: string): void {
    const { setActiveModal } = useAppStore.getState()
    
    switch (action) {
      case 'open-assessment':
        setActiveModal('potential-assessment')
        break
      case 'resume-progress':
        // Resume user's progress
        const savedProgress = localStorage.getItem('gdt_saved_progress')
        if (savedProgress) {
          const progress = JSON.parse(savedProgress)
          // Restore progress logic here
        }
        break
      case 'show-testimonials':
        setActiveModal('testimonials')
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Unknown notification action: ${action}`)
        }
    }
  }

  // Change CTA
  private changeCTA(config: CTAChangeConfig): void {
    // This would update the CTA in the UI
    if (process.env.NODE_ENV === 'development') {
      console.log('CTA Change:', config)
    }
    
    // Dispatch custom event for CTA change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cta-change', { detail: config }))
    }
  }

  // Show content recommendations
  private async showContentRecommendations(config: ContentRecommendConfig): Promise<void> {
    const behavior = engagementEngine.getCurrentBehavior()
    const engagementScore = engagementEngine.calculateEngagementScore(behavior)
    const engagement = engagementEngine.determineEngagementLevel(engagementScore, behavior)
    
    const context: PersonalizationContext = {
      behavior,
      engagement,
      preferences: personalizationEngine.inferUserPreferences(behavior, engagement, {
        viewed: [],
        completed: [],
        shared: [],
        bookmarked: [],
        timeSpent: {},
        engagementScores: {}
      }),
      history: {
        viewed: [],
        completed: [],
        shared: [],
        bookmarked: [],
        timeSpent: {},
        engagementScores: {}
      },
      currentContext: 'behavioral-trigger',
      timeOfDay: behavior.timeOfDay,
      deviceType: behavior.deviceType
    }

    const recommendations = personalizationEngine.getPersonalizedRecommendations(
      context,
      config.maxItems || 3
    )

    // Show recommendations in UI
    if (process.env.NODE_ENV === 'development') {
      console.log('Content Recommendations:', recommendations)
    }
    
    // Dispatch event for content recommendations
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('content-recommendations', { 
        detail: { title: config.title, recommendations } 
      }))
    }
  }

  // Trigger email
  private async triggerEmail(config: EmailTriggerConfig): Promise<void> {
    // This would integrate with your email system
    if (process.env.NODE_ENV === 'development') {
      console.log('Email Trigger:', config)
    }
  }

  // Check scroll-based triggers
  private checkScrollBasedTriggers(): void {
    this.triggers.forEach(trigger => {
      if (trigger.triggerType === 'scroll-based') {
        this.checkTrigger(trigger.id)
      }
    })
  }

  // Check time-based triggers
  private checkTimeBasedTriggers(): void {
    this.triggers.forEach(trigger => {
      if (trigger.triggerType === 'time-based') {
        this.checkTrigger(trigger.id)
      }
    })
  }

  // Check engagement-based triggers
  private checkEngagementBasedTriggers(): void {
    this.triggers.forEach(trigger => {
      if (trigger.triggerType === 'engagement-based') {
        this.checkTrigger(trigger.id)
      }
    })
  }

  // Public methods for manual trigger checking
  async checkActionBasedTrigger(action: string, data?: Record<string, unknown>): Promise<void> {
    this.triggers.forEach(trigger => {
      if (trigger.triggerType === 'action-based') {
        this.checkTrigger(trigger.id, { [action]: true, ...data })
      }
    })
  }

  // Get commitment escalation recommendations
  getCommitmentEscalation(
    behavior: UserBehavior,
    engagement: EngagementLevel
  ): CommitmentEscalation {
    let currentLevel: CommitmentLevel
    let nextLevel: CommitmentLevel
    let readinessScore: number

    // Determine current commitment level
    if (engagement.score < 30) {
      currentLevel = 'micro'
      nextLevel = 'midi'
      readinessScore = Math.min(engagement.score * 2, 100)
    } else if (engagement.score < 70) {
      currentLevel = 'midi'
      nextLevel = 'macro'
      readinessScore = Math.min((engagement.score - 30) * 2.5, 100)
    } else {
      currentLevel = 'macro'
      nextLevel = 'macro'
      readinessScore = 100
    }

    // Get recommended actions
    const recommendedActions = this.getRecommendedActions(currentLevel, nextLevel, engagement)
    
    // Get escalation triggers
    const escalationTriggers = this.getEscalationTriggers(currentLevel, nextLevel)

    return {
      currentLevel,
      nextLevel,
      readinessScore,
      recommendedActions,
      escalationTriggers
    }
  }

  private getRecommendedActions(
    current: CommitmentLevel,
    next: CommitmentLevel,
    engagement: EngagementLevel
  ): string[] {
    const actionMap = {
      'micro-to-midi': [
        'Complete your personalized assessment',
        'Download our comprehensive guide',
        'Join our free webinar',
        'Start the 7-day challenge'
      ],
      'midi-to-macro': [
        'Schedule a personal consultation',
        'Apply for our transformation program',
        'Book an office visit',
        'Join our premium community'
      ],
      'macro-to-macro': [
        'Upgrade to our advanced program',
        'Become a transformation partner',
        'Access our executive coaching',
        'Join our leadership circle'
      ]
    }

    const key = `${current}-to-${next}` as keyof typeof actionMap
    return actionMap[key] || []
  }

  private getEscalationTriggers(current: CommitmentLevel, next: CommitmentLevel): string[] {
    return [
      'tool-completion-follow-up',
      'deep-engagement-escalation',
      'content-consumer-nurture'
    ]
  }

  // Cleanup listeners
  destroy(): void {
    this.activeListeners.forEach(cleanup => cleanup())
    this.activeListeners.clear()
  }
}

// Export singleton instance
export const behavioralTriggerSystem = new BehavioralTriggerSystem()

// Make it available globally for notification CTAs
if (typeof window !== 'undefined') {
  (window as any).behaviorTriggerSystem = behavioralTriggerSystem
}

// Export types
export type {
  BehaviorTrigger,
  TriggerCondition,
  TriggerAction,
  CommitmentLevel,
  CommitmentEscalation
}