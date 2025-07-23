import { leadScoringEngine, UserActivityData, ScoreBreakdown } from '../lead-scoring-engine'

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          head: true,
          count: 'exact'
        })),
        gte: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn()
          }))
        })),
        order: jest.fn(() => ({
          limit: jest.fn()
        })),
        not: jest.fn(() => ({
          select: jest.fn()
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      rpc: jest.fn()
    }))
  }
}))

describe('LeadScoringEngine', () => {
  describe('calculateScore', () => {
    it('should calculate correct score for browser tier user', () => {
      const activityData: UserActivityData = {
        userId: 'test-user-1',
        pageViewsCount: 5, // 5 * 0.5 = 2.5 points
        toolUsageCount: 1, // 1 * 5 = 5 points
        contentDownloadsCount: 0, // 0 points
        webinarRegistrationsCount: 0, // 0 points
        totalTimeOnSiteMinutes: 3, // 3 * 2 = 6 points (under 5 min threshold)
        averageScrollDepth: 60, // 60% * 5 = 3 points
        ctaClicksCount: 2, // Under 5 clicks, so 0 bonus
        lastActivityAt: new Date()
      }

      const result: ScoreBreakdown = leadScoringEngine.calculateScore(activityData)

      expect(result.pageViewsScore).toBe(2.5)
      expect(result.toolUsageScore).toBe(5)
      expect(result.contentDownloadsScore).toBe(0)
      expect(result.webinarRegistrationScore).toBe(0)
      expect(result.timeOnSiteScore).toBe(6)
      expect(result.scrollDepthScore).toBe(3)
      expect(result.ctaEngagementScore).toBe(0)
      expect(result.totalScore).toBe(17) // Should be browser tier (0-29)
    })

    it('should calculate correct score for engaged tier user', () => {
      const activityData: UserActivityData = {
        userId: 'test-user-2',
        pageViewsCount: 20, // 20 * 0.5 = 10 points (max 10)
        toolUsageCount: 4, // 4 * 5 = 20 points
        contentDownloadsCount: 3, // 3 * 4 = 12 points
        webinarRegistrationsCount: 0, // 0 points
        totalTimeOnSiteMinutes: 8, // 10 points (over 5 min threshold)
        averageScrollDepth: 85, // 85% * 5 = 4.25 points
        ctaClicksCount: 6, // Over 5 clicks, so 10 bonus points
        lastActivityAt: new Date()
      }

      const result: ScoreBreakdown = leadScoringEngine.calculateScore(activityData)

      expect(result.pageViewsScore).toBe(10) // Capped at max
      expect(result.toolUsageScore).toBe(20)
      expect(result.contentDownloadsScore).toBe(12)
      expect(result.webinarRegistrationScore).toBe(0)
      expect(result.timeOnSiteScore).toBe(10)
      expect(result.scrollDepthScore).toBe(4.3) // Rounded
      expect(result.ctaEngagementScore).toBe(10)
      expect(result.totalScore).toBe(66) // Should be engaged tier (30-69)
    })

    it('should calculate correct score for soft member tier user', () => {
      const activityData: UserActivityData = {
        userId: 'test-user-3',
        pageViewsCount: 25, // 25 * 0.5 = 12.5, capped at 10
        toolUsageCount: 6, // 6 * 5 = 30 points (max 30)
        contentDownloadsCount: 5, // 5 * 4 = 20 points (max 20)
        webinarRegistrationsCount: 1, // 1 * 25 = 25 points
        totalTimeOnSiteMinutes: 15, // 10 points (over 5 min threshold)
        averageScrollDepth: 95, // 95% * 5 = 4.75 points
        ctaClicksCount: 8, // Over 5 clicks, so 10 bonus points
        lastActivityAt: new Date()
      }

      const result: ScoreBreakdown = leadScoringEngine.calculateScore(activityData)

      expect(result.pageViewsScore).toBe(10) // Capped at max
      expect(result.toolUsageScore).toBe(30) // Capped at max
      expect(result.contentDownloadsScore).toBe(20) // Capped at max
      expect(result.webinarRegistrationScore).toBe(25)
      expect(result.timeOnSiteScore).toBe(10)
      expect(result.scrollDepthScore).toBe(4.8) // Rounded
      expect(result.ctaEngagementScore).toBe(10)
      expect(result.totalScore).toBe(110) // Should be soft member tier (70+)
    })

    it('should handle edge cases correctly', () => {
      const activityData: UserActivityData = {
        userId: 'test-user-4',
        pageViewsCount: 0,
        toolUsageCount: 0,
        contentDownloadsCount: 0,
        webinarRegistrationsCount: 0,
        totalTimeOnSiteMinutes: 0,
        averageScrollDepth: 0,
        ctaClicksCount: 0,
        lastActivityAt: new Date()
      }

      const result: ScoreBreakdown = leadScoringEngine.calculateScore(activityData)

      expect(result.totalScore).toBe(0)
      expect(leadScoringEngine.getTierFromScore(result.totalScore)).toBe('browser')
    })
  })

  describe('getTierFromScore', () => {
    it('should return correct tier for browser range', () => {
      expect(leadScoringEngine.getTierFromScore(0)).toBe('browser')
      expect(leadScoringEngine.getTierFromScore(15)).toBe('browser')
      expect(leadScoringEngine.getTierFromScore(29)).toBe('browser')
    })

    it('should return correct tier for engaged range', () => {
      expect(leadScoringEngine.getTierFromScore(30)).toBe('engaged')
      expect(leadScoringEngine.getTierFromScore(50)).toBe('engaged')
      expect(leadScoringEngine.getTierFromScore(69)).toBe('engaged')
    })

    it('should return correct tier for soft member range', () => {
      expect(leadScoringEngine.getTierFromScore(70)).toBe('soft-member')
      expect(leadScoringEngine.getTierFromScore(85)).toBe('soft-member')
      expect(leadScoringEngine.getTierFromScore(100)).toBe('soft-member')
    })
  })

  describe('getReadinessLevel', () => {
    it('should return correct readiness level', () => {
      expect(leadScoringEngine.getReadinessLevel(15)).toBe('low')
      expect(leadScoringEngine.getReadinessLevel(45)).toBe('medium')
      expect(leadScoringEngine.getReadinessLevel(75)).toBe('high')
    })
  })

  describe('scoring configuration validation', () => {
    it('should respect maximum point limits', () => {
      const activityData: UserActivityData = {
        userId: 'test-user-max',
        pageViewsCount: 100, // Should be capped at 10 points
        toolUsageCount: 20, // Should be capped at 30 points
        contentDownloadsCount: 10, // Should be capped at 20 points
        webinarRegistrationsCount: 5, // No cap, should be 125 points
        totalTimeOnSiteMinutes: 30, // Should be capped at 10 points
        averageScrollDepth: 100, // Should be capped at 5 points
        ctaClicksCount: 20, // Should get 10 bonus points
        lastActivityAt: new Date()
      }

      const result: ScoreBreakdown = leadScoringEngine.calculateScore(activityData)

      expect(result.pageViewsScore).toBe(10) // Capped
      expect(result.toolUsageScore).toBe(30) // Capped
      expect(result.contentDownloadsScore).toBe(20) // Capped
      expect(result.webinarRegistrationScore).toBe(125) // No cap
      expect(result.timeOnSiteScore).toBe(10) // Capped
      expect(result.scrollDepthScore).toBe(5) // Capped
      expect(result.ctaEngagementScore).toBe(10) // Bonus applied
    })

    it('should handle time on site threshold correctly', () => {
      // Under threshold
      const underThreshold: UserActivityData = {
        userId: 'test-under',
        pageViewsCount: 0,
        toolUsageCount: 0,
        contentDownloadsCount: 0,
        webinarRegistrationsCount: 0,
        totalTimeOnSiteMinutes: 3, // Under 5 minute threshold
        averageScrollDepth: 0,
        ctaClicksCount: 0,
        lastActivityAt: new Date()
      }

      const underResult = leadScoringEngine.calculateScore(underThreshold)
      expect(underResult.timeOnSiteScore).toBe(6) // 3 * 2

      // Over threshold
      const overThreshold: UserActivityData = {
        userId: 'test-over',
        pageViewsCount: 0,
        toolUsageCount: 0,
        contentDownloadsCount: 0,
        webinarRegistrationsCount: 0,
        totalTimeOnSiteMinutes: 8, // Over 5 minute threshold
        averageScrollDepth: 0,
        ctaClicksCount: 0,
        lastActivityAt: new Date()
      }

      const overResult = leadScoringEngine.calculateScore(overThreshold)
      expect(overResult.timeOnSiteScore).toBe(10) // Max points for over threshold
    })

    it('should handle CTA engagement bonus correctly', () => {
      // Under bonus threshold
      const underBonus: UserActivityData = {
        userId: 'test-under-bonus',
        pageViewsCount: 0,
        toolUsageCount: 0,
        contentDownloadsCount: 0,
        webinarRegistrationsCount: 0,
        totalTimeOnSiteMinutes: 0,
        averageScrollDepth: 0,
        ctaClicksCount: 3, // Under 5 click threshold
        lastActivityAt: new Date()
      }

      const underResult = leadScoringEngine.calculateScore(underBonus)
      expect(underResult.ctaEngagementScore).toBe(0) // No bonus

      // Over bonus threshold
      const overBonus: UserActivityData = {
        userId: 'test-over-bonus',
        pageViewsCount: 0,
        toolUsageCount: 0,
        contentDownloadsCount: 0,
        webinarRegistrationsCount: 0,
        totalTimeOnSiteMinutes: 0,
        averageScrollDepth: 0,
        ctaClicksCount: 7, // Over 5 click threshold
        lastActivityAt: new Date()
      }

      const overResult = leadScoringEngine.calculateScore(overBonus)
      expect(overResult.ctaEngagementScore).toBe(10) // Bonus applied
    })
  })

  describe('tier progression scenarios', () => {
    it('should identify tier progression from browser to engaged', () => {
      const browserScore = 25
      const engagedScore = 45

      expect(leadScoringEngine.getTierFromScore(browserScore)).toBe('browser')
      expect(leadScoringEngine.getTierFromScore(engagedScore)).toBe('engaged')
    })

    it('should identify tier progression from engaged to soft member', () => {
      const engagedScore = 65
      const softMemberScore = 75

      expect(leadScoringEngine.getTierFromScore(engagedScore)).toBe('engaged')
      expect(leadScoringEngine.getTierFromScore(softMemberScore)).toBe('soft-member')
    })

    it('should handle direct progression from browser to soft member', () => {
      const browserScore = 20
      const softMemberScore = 85

      expect(leadScoringEngine.getTierFromScore(browserScore)).toBe('browser')
      expect(leadScoringEngine.getTierFromScore(softMemberScore)).toBe('soft-member')
    })
  })

  describe('real-world scoring scenarios', () => {
    it('should score a typical engaged user correctly', () => {
      // User who has viewed multiple pages, used some tools, downloaded content
      const typicalEngaged: UserActivityData = {
        userId: 'typical-engaged',
        pageViewsCount: 15, // 7.5 points
        toolUsageCount: 3, // 15 points
        contentDownloadsCount: 2, // 8 points
        webinarRegistrationsCount: 0, // 0 points
        totalTimeOnSiteMinutes: 12, // 10 points (over threshold)
        averageScrollDepth: 75, // 3.75 points
        ctaClicksCount: 4, // 0 bonus (under 5)
        lastActivityAt: new Date()
      }

      const result = leadScoringEngine.calculateScore(typicalEngaged)
      expect(result.totalScore).toBe(44) // Should be engaged tier
      expect(leadScoringEngine.getTierFromScore(result.totalScore)).toBe('engaged')
    })

    it('should score a webinar-focused user correctly', () => {
      // User who primarily engages through webinars
      const webinarFocused: UserActivityData = {
        userId: 'webinar-focused',
        pageViewsCount: 8, // 4 points
        toolUsageCount: 1, // 5 points
        contentDownloadsCount: 1, // 4 points
        webinarRegistrationsCount: 2, // 50 points
        totalTimeOnSiteMinutes: 6, // 10 points
        averageScrollDepth: 50, // 2.5 points
        ctaClicksCount: 3, // 0 bonus
        lastActivityAt: new Date()
      }

      const result = leadScoringEngine.calculateScore(webinarFocused)
      expect(result.totalScore).toBe(76) // Should be soft member tier
      expect(leadScoringEngine.getTierFromScore(result.totalScore)).toBe('soft-member')
    })

    it('should score a tool-heavy user correctly', () => {
      // User who loves using tools but doesn't engage with other content much
      const toolHeavy: UserActivityData = {
        userId: 'tool-heavy',
        pageViewsCount: 10, // 5 points
        toolUsageCount: 5, // 25 points
        contentDownloadsCount: 1, // 4 points
        webinarRegistrationsCount: 0, // 0 points
        totalTimeOnSiteMinutes: 20, // 10 points
        averageScrollDepth: 90, // 4.5 points
        ctaClicksCount: 8, // 10 bonus points
        lastActivityAt: new Date()
      }

      const result = leadScoringEngine.calculateScore(toolHeavy)
      expect(result.totalScore).toBe(59) // Should be engaged tier
      expect(leadScoringEngine.getTierFromScore(result.totalScore)).toBe('engaged')
    })
  })
})