'use client'

import React from 'react'
import { trackingService } from './tracking'

// A/B Test Configuration Types
export interface ABTestConfig {
  testId: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate: Date
  endDate?: Date
  trafficAllocation: number // 0-1, percentage of users to include
  variants: ABTestVariant[]
  targetMetric: string
  minimumSampleSize: number
  confidenceLevel: number
  segmentation?: UserSegment[]
}

export interface ABTestVariant {
  id: string
  name: string
  weight: number // 0-1, traffic split within test
  config: VariantConfig
  metrics: VariantMetrics
}

export interface VariantConfig {
  // CTA specific configurations
  text?: string
  color?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  placement?: 'top' | 'middle' | 'bottom' | 'floating' | 'sticky'
  timing?: {
    delay?: number // seconds
    trigger?: 'immediate' | 'scroll' | 'time' | 'exit-intent'
    scrollPercentage?: number
  }
  copy?: {
    headline?: string
    description?: string
    urgencyText?: string
    socialProofText?: string
  }
  styling?: {
    className?: string
    animation?: string
    icon?: string
  }
}

export interface VariantMetrics {
  impressions: number
  clicks: number
  conversions: number
  conversionRate: number
  confidenceInterval: [number, number]
  statisticalSignificance: number
}

export interface UserSegment {
  id: string
  name: string
  criteria: SegmentCriteria
}

export interface SegmentCriteria {
  engagementScore?: { min?: number; max?: number }
  behaviorPattern?: string[]
  tier?: string[]
  timeOnSite?: { min?: number; max?: number }
  deviceType?: 'mobile' | 'desktop' | 'tablet'
  trafficSource?: string[]
  geography?: string[]
  returningUser?: boolean
}

// A/B Testing Service
class ABTestingService {
  private tests: Map<string, ABTestConfig> = new Map()
  private userAssignments: Map<string, Map<string, string>> = new Map() // userId -> testId -> variantId
  private impressions: Map<string, number> = new Map()
  private conversions: Map<string, number> = new Map()

  constructor() {
    this.loadFromStorage()
    this.initializeDefaultTests()
  }

  // Initialize default CTA tests
  private initializeDefaultTests() {
    // CTA Color Test
    this.createTest({
      testId: 'cta-color-test',
      name: 'CTA Button Color Optimization',
      description: 'Testing different button colors for conversion optimization',
      status: 'active',
      startDate: new Date(),
      trafficAllocation: 0.5,
      variants: [
        {
          id: 'control',
          name: 'Blue (Control)',
          weight: 0.33,
          config: {
            color: 'blue',
            variant: 'default',
            styling: { className: 'bg-blue-600 hover:bg-blue-700' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'variant-a',
          name: 'Orange (Urgency)',
          weight: 0.33,
          config: {
            color: 'orange',
            variant: 'default',
            styling: { className: 'bg-orange-600 hover:bg-orange-700' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'variant-b',
          name: 'Green (Success)',
          weight: 0.34,
          config: {
            color: 'green',
            variant: 'default',
            styling: { className: 'bg-green-600 hover:bg-green-700' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        }
      ],
      targetMetric: 'click-through-rate',
      minimumSampleSize: 1000,
      confidenceLevel: 0.95
    })

    // CTA Copy Test
    this.createTest({
      testId: 'cta-copy-test',
      name: 'CTA Copy Optimization',
      description: 'Testing different CTA text for psychological triggers',
      status: 'active',
      startDate: new Date(),
      trafficAllocation: 0.4,
      variants: [
        {
          id: 'control',
          name: 'Direct (Control)',
          weight: 0.25,
          config: {
            text: 'Get Started',
            copy: { headline: 'Get Started', description: 'Begin your journey' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'curiosity',
          name: 'Curiosity Trigger',
          weight: 0.25,
          config: {
            text: 'Discover Your Hidden Potential',
            copy: { headline: 'Discover Your Hidden Potential', description: 'What if you\'re only using 10% of your abilities?' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'urgency',
          name: 'Urgency Trigger',
          weight: 0.25,
          config: {
            text: 'Start Now - Limited Time',
            copy: { headline: 'Start Now', description: 'Don\'t wait - your future self will thank you', urgencyText: 'Limited spots available' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'social-proof',
          name: 'Social Proof Trigger',
          weight: 0.25,
          config: {
            text: 'Join 10,000+ Achievers',
            copy: { headline: 'Join 10,000+ Achievers', description: 'See why thousands trust us with their growth', socialProofText: '10,000+ people transformed' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        }
      ],
      targetMetric: 'conversion-rate',
      minimumSampleSize: 800,
      confidenceLevel: 0.95
    })

    // CTA Placement Test
    this.createTest({
      testId: 'cta-placement-test',
      name: 'CTA Placement Optimization',
      description: 'Testing different CTA placements for maximum visibility',
      status: 'active',
      startDate: new Date(),
      trafficAllocation: 0.3,
      variants: [
        {
          id: 'control',
          name: 'Bottom (Control)',
          weight: 0.33,
          config: {
            placement: 'bottom',
            timing: { trigger: 'immediate' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'floating',
          name: 'Floating Sticky',
          weight: 0.33,
          config: {
            placement: 'floating',
            timing: { trigger: 'scroll', scrollPercentage: 25 }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'exit-intent',
          name: 'Exit Intent',
          weight: 0.34,
          config: {
            placement: 'middle',
            timing: { trigger: 'exit-intent' }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        }
      ],
      targetMetric: 'engagement-rate',
      minimumSampleSize: 1200,
      confidenceLevel: 0.95
    })

    // CTA Timing Test
    this.createTest({
      testId: 'cta-timing-test',
      name: 'CTA Timing Optimization',
      description: 'Testing optimal timing for CTA presentation',
      status: 'active',
      startDate: new Date(),
      trafficAllocation: 0.35,
      variants: [
        {
          id: 'immediate',
          name: 'Immediate (Control)',
          weight: 0.25,
          config: {
            timing: { trigger: 'immediate', delay: 0 }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'delayed-30s',
          name: '30 Second Delay',
          weight: 0.25,
          config: {
            timing: { trigger: 'time', delay: 30 }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'scroll-50',
          name: '50% Scroll Trigger',
          weight: 0.25,
          config: {
            timing: { trigger: 'scroll', scrollPercentage: 50 }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        },
        {
          id: 'engagement-based',
          name: 'Engagement Based',
          weight: 0.25,
          config: {
            timing: { trigger: 'time', delay: 60 }
          },
          metrics: { impressions: 0, clicks: 0, conversions: 0, conversionRate: 0, confidenceInterval: [0, 0], statisticalSignificance: 0 }
        }
      ],
      targetMetric: 'time-to-conversion',
      minimumSampleSize: 1000,
      confidenceLevel: 0.95
    })
  }

  // Create a new A/B test
  createTest(config: ABTestConfig): void {
    this.tests.set(config.testId, config)
    this.saveToStorage()
  }

  // Get user's variant for a specific test
  getUserVariant(userId: string, testId: string): string | null {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'active') {
      return null
    }

    // Check if user is already assigned
    const userTests = this.userAssignments.get(userId)
    if (userTests?.has(testId)) {
      return userTests.get(testId) || null
    }

    // Check traffic allocation
    if (Math.random() > test.trafficAllocation) {
      return null
    }

    // Assign user to variant based on weights
    const random = Math.random()
    let cumulativeWeight = 0
    
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight
      if (random <= cumulativeWeight) {
        this.assignUserToVariant(userId, testId, variant.id)
        return variant.id
      }
    }

    // Fallback to control
    const controlVariant = test.variants[0]
    this.assignUserToVariant(userId, testId, controlVariant.id)
    return controlVariant.id
  }

  // Assign user to variant
  private assignUserToVariant(userId: string, testId: string, variantId: string): void {
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map())
    }
    this.userAssignments.get(userId)!.set(testId, variantId)
    this.saveToStorage()
  }

  // Track impression
  trackImpression(userId: string, testId: string, variantId: string): void {
    const key = `${testId}-${variantId}`
    this.impressions.set(key, (this.impressions.get(key) || 0) + 1)
    
    // Update test metrics
    const test = this.tests.get(testId)
    if (test) {
      const variant = test.variants.find(v => v.id === variantId)
      if (variant) {
        variant.metrics.impressions++
        this.updateConversionRate(variant)
      }
    }

    this.saveToStorage()
    
    // Track in external service
    trackingService.trackABTestImpression(testId, variantId, userId)
  }

  // Track click
  trackClick(userId: string, testId: string, variantId: string): void {
    const key = `${testId}-${variantId}`
    const impressionKey = `${key}-clicks`
    this.impressions.set(impressionKey, (this.impressions.get(impressionKey) || 0) + 1)
    
    // Update test metrics
    const test = this.tests.get(testId)
    if (test) {
      const variant = test.variants.find(v => v.id === variantId)
      if (variant) {
        variant.metrics.clicks++
        this.updateConversionRate(variant)
      }
    }

    this.saveToStorage()
    
    // Track in external service
    trackingService.trackABTestClick(testId, variantId, userId)
  }

  // Track conversion
  trackConversion(userId: string, testId: string, variantId: string): void {
    const key = `${testId}-${variantId}`
    this.conversions.set(key, (this.conversions.get(key) || 0) + 1)
    
    // Update test metrics
    const test = this.tests.get(testId)
    if (test) {
      const variant = test.variants.find(v => v.id === variantId)
      if (variant) {
        variant.metrics.conversions++
        this.updateConversionRate(variant)
      }
    }

    this.saveToStorage()
    
    // Track in external service
    trackingService.trackABTestConversion(testId, variantId, userId)
  }

  // Update conversion rate and statistical significance
  private updateConversionRate(variant: ABTestVariant): void {
    if (variant.metrics.impressions > 0) {
      variant.metrics.conversionRate = variant.metrics.conversions / variant.metrics.impressions
    }
    
    // Calculate confidence interval (simplified)
    const n = variant.metrics.impressions
    const p = variant.metrics.conversionRate
    const z = 1.96 // 95% confidence
    const margin = z * Math.sqrt((p * (1 - p)) / n)
    
    variant.metrics.confidenceInterval = [
      Math.max(0, p - margin),
      Math.min(1, p + margin)
    ]
    
    // Simple statistical significance calculation
    if (n > 30) {
      variant.metrics.statisticalSignificance = Math.min(0.99, 1 - (margin / p))
    }
  }

  // Get test results
  getTestResults(testId: string): ABTestConfig | null {
    return this.tests.get(testId) || null
  }

  // Get all active tests
  getActiveTests(): ABTestConfig[] {
    return Array.from(this.tests.values()).filter(test => test.status === 'active')
  }

  // Get variant configuration
  getVariantConfig(testId: string, variantId: string): VariantConfig | null {
    const test = this.tests.get(testId)
    if (!test) return null
    
    const variant = test.variants.find(v => v.id === variantId)
    return variant?.config || null
  }

  // Check if user matches segment criteria
  private matchesSegment(userId: string, segment: UserSegment): boolean {
    // This would integrate with user data to check segment criteria
    // For now, return true (all users match)
    return true
  }

  // Save to localStorage
  private saveToStorage(): void {
    try {
      const data = {
        tests: Array.from(this.tests.entries()),
        userAssignments: Array.from(this.userAssignments.entries()).map(([userId, tests]) => [
          userId,
          Array.from(tests.entries())
        ]),
        impressions: Array.from(this.impressions.entries()),
        conversions: Array.from(this.conversions.entries())
      }
      localStorage.setItem('gdt_ab_tests', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save A/B test data:', error)
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('gdt_ab_tests')
      if (data) {
        const parsed = JSON.parse(data)
        
        this.tests = new Map(parsed.tests || [])
        
        this.userAssignments = new Map(
          (parsed.userAssignments || []).map(([userId, tests]: [string, [string, string][]]) => [
            userId,
            new Map(tests)
          ])
        )
        
        this.impressions = new Map(parsed.impressions || [])
        this.conversions = new Map(parsed.conversions || [])
      }
    } catch (error) {
      console.error('Failed to load A/B test data:', error)
    }
  }

  // Export test results for analysis
  exportResults(testId: string): any | null {
    const test = this.tests.get(testId)
    if (!test) return null

    return {
      testId: test.testId,
      name: test.name,
      status: test.status,
      startDate: test.startDate,
      endDate: test.endDate,
      variants: test.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        weight: variant.weight,
        metrics: variant.metrics,
        isWinner: this.isWinningVariant(test, variant.id),
        statisticalSignificance: variant.metrics.statisticalSignificance
      })),
      totalImpressions: test.variants.reduce((sum, v) => sum + v.metrics.impressions, 0),
      totalConversions: test.variants.reduce((sum, v) => sum + v.metrics.conversions, 0),
      overallConversionRate: test.variants.reduce((sum, v) => sum + v.metrics.conversions, 0) / 
                            test.variants.reduce((sum, v) => sum + v.metrics.impressions, 0)
    }
  }

  // Determine winning variant
  private isWinningVariant(test: ABTestConfig, variantId: string): boolean {
    const variant = test.variants.find(v => v.id === variantId)
    if (!variant) return false

    const maxConversionRate = Math.max(...test.variants.map(v => v.metrics.conversionRate))
    return variant.metrics.conversionRate === maxConversionRate && 
           variant.metrics.statisticalSignificance > 0.95
  }
}

// Export singleton instance
export const abTestingService = new ABTestingService()

// Hook for using A/B testing in components
export function useABTest(testId: string, userId?: string) {
  const [variant, setVariant] = React.useState<string | null>(null)
  const [config, setConfig] = React.useState<VariantConfig | null>(null)

  React.useEffect(() => {
    if (!userId) return

    const assignedVariant = abTestingService.getUserVariant(userId, testId)
    setVariant(assignedVariant)
    
    if (assignedVariant) {
      const variantConfig = abTestingService.getVariantConfig(testId, assignedVariant)
      setConfig(variantConfig)
      
      // Track impression
      abTestingService.trackImpression(userId, testId, assignedVariant)
    }
  }, [testId, userId])

  const trackClick = React.useCallback(() => {
    if (userId && variant) {
      abTestingService.trackClick(userId, testId, variant)
    }
  }, [testId, userId, variant])

  const trackConversion = React.useCallback(() => {
    if (userId && variant) {
      abTestingService.trackConversion(userId, testId, variant)
    }
  }, [testId, userId, variant])

  return {
    variant,
    config,
    trackClick,
    trackConversion,
    isInTest: variant !== null
  }
}

export default abTestingService