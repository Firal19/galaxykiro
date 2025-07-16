import { trackingService } from './tracking'
import { useAppStore } from './store'

// A/B Testing interfaces
export interface ABTest {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  startDate: Date
  endDate?: Date
  trafficAllocation: number // percentage of traffic to include
  variants: ABTestVariant[]
  conversionGoals: ConversionGoal[]
  targetingRules: TargetingRule[]
  results?: ABTestResults
}

export interface ABTestVariant {
  id: string
  name: string
  trafficWeight: number // percentage of test traffic
  config: any // variant-specific configuration
  isControl: boolean
}

export interface ConversionGoal {
  id: string
  name: string
  type: 'click' | 'form_submit' | 'page_view' | 'time_on_page' | 'custom'
  target: string // CSS selector, URL, or custom event name
  value?: number // for weighted conversions
}

export interface TargetingRule {
  type: 'device' | 'behavior' | 'engagement' | 'tier' | 'time' | 'location'
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'includes' | 'excludes'
  value: any
}

export interface ABTestResults {
  totalParticipants: number
  variantResults: VariantResults[]
  statisticalSignificance: number
  confidenceLevel: number
  winner?: string
  liftPercentage?: number
}

export interface VariantResults {
  variantId: string
  participants: number
  conversions: number
  conversionRate: number
  averageValue?: number
}

export interface ABTestParticipant {
  userId?: string
  sessionId: string
  testId: string
  variantId: string
  assignedAt: Date
  conversions: ABTestConversion[]
}

export interface ABTestConversion {
  goalId: string
  convertedAt: Date
  value?: number
  metadata?: any
}

// Predefined A/B tests for CTA optimization
const AB_TESTS: ABTest[] = [
  {
    id: 'cta-colors-test',
    name: 'CTA Button Colors',
    description: 'Test different button colors for primary CTAs',
    status: 'running',
    startDate: new Date('2024-01-01'),
    trafficAllocation: 100,
    variants: [
      {
        id: 'control',
        name: 'Blue (Control)',
        trafficWeight: 33,
        config: { buttonColor: '#3B82F6', textColor: '#FFFFFF' },
        isControl: true
      },
      {
        id: 'green',
        name: 'Green',
        trafficWeight: 33,
        config: { buttonColor: '#10B981', textColor: '#FFFFFF' },
        isControl: false
      },
      {
        id: 'orange',
        name: 'Orange',
        trafficWeight: 34,
        config: { buttonColor: '#F59E0B', textColor: '#FFFFFF' },
        isControl: false
      }
    ],
    conversionGoals: [
      {
        id: 'cta-click',
        name: 'CTA Click',
        type: 'click',
        target: '[data-testid="primary-cta"]'
      }
    ],
    targetingRules: []
  },
  {
    id: 'cta-copy-test',
    name: 'CTA Button Copy',
    description: 'Test different button text for assessment CTAs',
    status: 'running',
    startDate: new Date('2024-01-01'),
    trafficAllocation: 80,
    variants: [
      {
        id: 'control',
        name: 'Discover Your Potential (Control)',
        trafficWeight: 25,
        config: { buttonText: 'Discover Your Potential' },
        isControl: true
      },
      {
        id: 'curiosity',
        name: 'See Your Hidden 90%',
        trafficWeight: 25,
        config: { buttonText: 'See Your Hidden 90%' },
        isControl: false
      },
      {
        id: 'urgency',
        name: 'Unlock Your Potential Now',
        trafficWeight: 25,
        config: { buttonText: 'Unlock Your Potential Now' },
        isControl: false
      },
      {
        id: 'social-proof',
        name: 'Join 10,000+ Achievers',
        trafficWeight: 25,
        config: { buttonText: 'Join 10,000+ Achievers' },
        isControl: false
      }
    ],
    conversionGoals: [
      {
        id: 'assessment-start',
        name: 'Assessment Start',
        type: 'custom',
        target: 'assessment_started'
      },
      {
        id: 'assessment-complete',
        name: 'Assessment Complete',
        type: 'custom',
        target: 'assessment_completed',
        value: 10
      }
    ],
    targetingRules: [
      {
        type: 'engagement',
        operator: 'lt',
        value: 50
      }
    ]
  },
  {
    id: 'modal-timing-test',
    name: 'Modal Timing',
    description: 'Test different timing for exit-intent modals',
    status: 'running',
    startDate: new Date('2024-01-01'),
    trafficAllocation: 60,
    variants: [
      {
        id: 'control',
        name: '30 seconds (Control)',
        trafficWeight: 33,
        config: { modalDelay: 30 },
        isControl: true
      },
      {
        id: 'fast',
        name: '15 seconds',
        trafficWeight: 33,
        config: { modalDelay: 15 },
        isControl: false
      },
      {
        id: 'slow',
        name: '60 seconds',
        trafficWeight: 34,
        config: { modalDelay: 60 },
        isControl: false
      }
    ],
    conversionGoals: [
      {
        id: 'modal-conversion',
        name: 'Modal Conversion',
        type: 'form_submit',
        target: '[data-testid="exit-intent-form"]'
      }
    ],
    targetingRules: [
      {
        type: 'device',
        operator: 'neq',
        value: 'mobile'
      }
    ]
  },
  {
    id: 'personalization-test',
    name: 'Personalized vs Generic CTAs',
    description: 'Test personalized CTAs vs generic ones',
    status: 'running',
    startDate: new Date('2024-01-01'),
    trafficAllocation: 50,
    variants: [
      {
        id: 'control',
        name: 'Generic (Control)',
        trafficWeight: 50,
        config: { personalized: false },
        isControl: true
      },
      {
        id: 'personalized',
        name: 'Personalized',
        trafficWeight: 50,
        config: { personalized: true },
        isControl: false
      }
    ],
    conversionGoals: [
      {
        id: 'any-conversion',
        name: 'Any Conversion',
        type: 'custom',
        target: 'conversion_event'
      }
    ],
    targetingRules: [
      {
        type: 'tier',
        operator: 'neq',
        value: 'browser'
      }
    ]
  }
]

class ABTestingSystem {
  private tests: Map<string, ABTest>
  private participants: Map<string, ABTestParticipant[]>
  private sessionAssignments: Map<string, Map<string, string>> // sessionId -> testId -> variantId

  constructor() {
    this.tests = new Map()
    this.participants = new Map()
    this.sessionAssignments = new Map()
    
    // Initialize tests
    AB_TESTS.forEach(test => {
      this.tests.set(test.id, test)
    })
  }

  // Get variant for a user/session in a specific test
  getVariant(testId: string, sessionId: string, userId?: string): ABTestVariant | null {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'running') {
      return null
    }

    // Check if already assigned
    const sessionAssignments = this.sessionAssignments.get(sessionId) || new Map()
    const existingVariant = sessionAssignments.get(testId)
    
    if (existingVariant) {
      return test.variants.find(v => v.id === existingVariant) || null
    }

    // Check if user should be included in test
    if (!this.shouldIncludeInTest(test, sessionId, userId)) {
      return null
    }

    // Assign variant
    const variant = this.assignVariant(test)
    if (!variant) return null

    // Store assignment
    sessionAssignments.set(testId, variant.id)
    this.sessionAssignments.set(sessionId, sessionAssignments)

    // Track participation
    this.trackParticipation(test.id, variant.id, sessionId, userId)

    return variant
  }

  // Check if user should be included in test
  private shouldIncludeInTest(test: ABTest, sessionId: string, userId?: string): boolean {
    // Check traffic allocation
    const random = Math.random() * 100
    if (random > test.trafficAllocation) {
      return false
    }

    // Check targeting rules
    return this.evaluateTargetingRules(test.targetingRules, sessionId, userId)
  }

  // Evaluate targeting rules
  private evaluateTargetingRules(rules: TargetingRule[], sessionId: string, userId?: string): boolean {
    if (rules.length === 0) return true

    // Get current context for evaluation
    const store = useAppStore.getState()
    const user = store.user
    const journey = store.journey

    return rules.every(rule => {
      let actualValue: any

      switch (rule.type) {
        case 'device':
          actualValue = this.getDeviceType()
          break
        case 'behavior':
          // This would need to be implemented based on your behavior tracking
          actualValue = 'explorer' // placeholder
          break
        case 'engagement':
          actualValue = store.leadScore?.totalScore || 0
          break
        case 'tier':
          actualValue = user?.currentTier || 'browser'
          break
        case 'time':
          actualValue = new Date().getHours()
          break
        case 'location':
          // This would need geolocation implementation
          actualValue = 'unknown'
          break
        default:
          return true
      }

      return this.evaluateCondition(actualValue, rule.operator, rule.value)
    })
  }

  private evaluateCondition(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'eq': return actual === expected
      case 'neq': return actual !== expected
      case 'gt': return actual > expected
      case 'lt': return actual < expected
      case 'includes': return Array.isArray(expected) ? expected.includes(actual) : actual.includes(expected)
      case 'excludes': return Array.isArray(expected) ? !expected.includes(actual) : !actual.includes(expected)
      default: return true
    }
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'desktop'
    
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  // Assign variant based on traffic weights
  private assignVariant(test: ABTest): ABTestVariant | null {
    const random = Math.random() * 100
    let cumulative = 0

    for (const variant of test.variants) {
      cumulative += variant.trafficWeight
      if (random <= cumulative) {
        return variant
      }
    }

    // Fallback to control
    return test.variants.find(v => v.isControl) || test.variants[0] || null
  }

  // Track test participation
  private async trackParticipation(testId: string, variantId: string, sessionId: string, userId?: string): Promise<void> {
    const participant: ABTestParticipant = {
      userId,
      sessionId,
      testId,
      variantId,
      assignedAt: new Date(),
      conversions: []
    }

    // Store participant
    const testParticipants = this.participants.get(testId) || []
    testParticipants.push(participant)
    this.participants.set(testId, testParticipants)

    // Track in external service
    try {
      await trackingService.trackUserJourney({
        userId,
        eventType: 'ab_test_participation',
        eventData: {
          testId,
          variantId,
          testName: this.tests.get(testId)?.name
        }
      })
    } catch (error) {
      console.error('Error tracking A/B test participation:', error)
    }
  }

  // Track conversion for a test
  async trackConversion(
    testId: string,
    goalId: string,
    sessionId: string,
    userId?: string,
    value?: number,
    metadata?: any
  ): Promise<void> {
    const test = this.tests.get(testId)
    if (!test) return

    const testParticipants = this.participants.get(testId) || []
    const participant = testParticipants.find(p => 
      p.sessionId === sessionId && (userId ? p.userId === userId : true)
    )

    if (!participant) return

    // Add conversion
    const conversion: ABTestConversion = {
      goalId,
      convertedAt: new Date(),
      value,
      metadata
    }

    participant.conversions.push(conversion)

    // Track in external service
    try {
      await trackingService.trackUserJourney({
        userId,
        eventType: 'ab_test_conversion',
        eventData: {
          testId,
          variantId: participant.variantId,
          goalId,
          value,
          metadata
        }
      })
    } catch (error) {
      console.error('Error tracking A/B test conversion:', error)
    }
  }

  // Get test results
  getTestResults(testId: string): ABTestResults | null {
    const test = this.tests.get(testId)
    const participants = this.participants.get(testId)
    
    if (!test || !participants || participants.length === 0) {
      return null
    }

    // Calculate results for each variant
    const variantResults: VariantResults[] = test.variants.map(variant => {
      const variantParticipants = participants.filter(p => p.variantId === variant.id)
      const conversions = variantParticipants.reduce((total, p) => total + p.conversions.length, 0)
      const totalValue = variantParticipants.reduce((total, p) => 
        total + p.conversions.reduce((sum, c) => sum + (c.value || 0), 0), 0
      )

      return {
        variantId: variant.id,
        participants: variantParticipants.length,
        conversions,
        conversionRate: variantParticipants.length > 0 ? (conversions / variantParticipants.length) * 100 : 0,
        averageValue: conversions > 0 ? totalValue / conversions : 0
      }
    })

    // Calculate statistical significance (simplified)
    const controlResults = variantResults.find(r => 
      test.variants.find(v => v.id === r.variantId)?.isControl
    )
    
    let winner: string | undefined
    let liftPercentage: number | undefined
    let statisticalSignificance = 0

    if (controlResults) {
      const bestVariant = variantResults.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      )

      if (bestVariant.variantId !== controlResults.variantId && 
          bestVariant.participants > 30 && controlResults.participants > 30) {
        winner = bestVariant.variantId
        liftPercentage = ((bestVariant.conversionRate - controlResults.conversionRate) / controlResults.conversionRate) * 100
        
        // Simplified statistical significance calculation
        // In production, you'd want a proper statistical test
        const totalParticipants = bestVariant.participants + controlResults.participants
        statisticalSignificance = Math.min(95, (totalParticipants / 100) * 95)
      }
    }

    return {
      totalParticipants: participants.length,
      variantResults,
      statisticalSignificance,
      confidenceLevel: 95,
      winner,
      liftPercentage
    }
  }

  // Get all active tests
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.status === 'running')
  }

  // Get test configuration for a specific test
  getTestConfig(testId: string, sessionId: string, userId?: string): any {
    const variant = this.getVariant(testId, sessionId, userId)
    return variant?.config || null
  }

  // Check if user is in a specific test variant
  isInVariant(testId: string, variantId: string, sessionId: string): boolean {
    const sessionAssignments = this.sessionAssignments.get(sessionId)
    return sessionAssignments?.get(testId) === variantId
  }

  // Start a new test
  startTest(test: ABTest): void {
    test.status = 'running'
    test.startDate = new Date()
    this.tests.set(test.id, test)
  }

  // Stop a test
  stopTest(testId: string): void {
    const test = this.tests.get(testId)
    if (test) {
      test.status = 'completed'
      test.endDate = new Date()
    }
  }

  // Pause a test
  pauseTest(testId: string): void {
    const test = this.tests.get(testId)
    if (test) {
      test.status = 'paused'
    }
  }

  // Resume a test
  resumeTest(testId: string): void {
    const test = this.tests.get(testId)
    if (test) {
      test.status = 'running'
    }
  }

  // Clear session assignments (for testing)
  clearSessionAssignments(): void {
    this.sessionAssignments.clear()
  }
}

// Export singleton instance
export const abTestingSystem = new ABTestingSystem()

// Hook for using A/B testing in components
export function useABTest(testId: string) {
  const { journey, user } = useAppStore()
  
  const variant = abTestingSystem.getVariant(testId, journey.sessionId, user?.id)
  const config = variant?.config || {}
  
  const trackConversion = async (goalId: string, value?: number, metadata?: any) => {
    await abTestingSystem.trackConversion(testId, goalId, journey.sessionId, user?.id, value, metadata)
  }

  return {
    variant,
    config,
    isInTest: variant !== null,
    trackConversion
  }
}

// Export types
export type {
  ABTest,
  ABTestVariant,
  ConversionGoal,
  ABTestResults,
  ABTestParticipant
}