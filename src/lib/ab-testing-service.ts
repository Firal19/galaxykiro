import { supabase } from './supabase'

export interface ABTest {
  id: string
  name: string
  status: 'active' | 'completed' | 'draft'
  startDate: string
  endDate?: string
  targetMetric: 'engagement' | 'conversion' | 'completion' | 'time-on-page'
  targetAudience: 'all' | 'new-visitors' | 'returning-visitors' | 'soft-members'
  sampleSize: number
  confidenceLevel: number
  createdAt: string
  updatedAt: string
}

export interface ABTestVariant {
  id: string
  testId: string
  name: string
  contentId?: string
  type: 'title' | 'hook' | 'cta' | 'content-format' | 'image'
  value: string
  impressions: number
  conversions: number
  conversionRate: number
  createdAt: string
}

export interface ABTestResult {
  testId: string
  variantId: string
  userId: string
  sessionId: string
  action: 'impression' | 'conversion' | 'engagement'
  value?: number
  metadata?: Record<string, any>
  timestamp: string
}

class ABTestingService {
  /**
   * Create a new A/B test
   */
  async createTest(test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .insert({
          name: test.name,
          status: test.status,
          start_date: test.startDate,
          end_date: test.endDate,
          target_metric: test.targetMetric,
          target_audience: test.targetAudience,
          sample_size: test.sampleSize,
          confidence_level: test.confidenceLevel
        })
        .select('id')
        .single()

      if (error) {
        throw new Error(`Failed to create A/B test: ${error.message}`)
      }

      return data.id
    } catch (error) {
      console.error('Error creating A/B test:', error)
      throw error
    }
  }

  /**
   * Add a variant to an A/B test
   */
  async addVariant(variant: Omit<ABTestVariant, 'id' | 'createdAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('ab_test_variants')
        .insert({
          test_id: variant.testId,
          name: variant.name,
          content_id: variant.contentId,
          type: variant.type,
          value: variant.value,
          impressions: variant.impressions || 0,
          conversions: variant.conversions || 0,
          conversion_rate: variant.conversionRate || 0
        })
        .select('id')
        .single()

      if (error) {
        throw new Error(`Failed to add variant: ${error.message}`)
      }

      return data.id
    } catch (error) {
      console.error('Error adding variant:', error)
      throw error
    }
  }

  /**
   * Get all A/B tests
   */
  async getTests(status?: 'active' | 'completed' | 'draft'): Promise<ABTest[]> {
    try {
      let query = supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        // If table doesn't exist, return empty array instead of throwing
        if (error.message.includes('relation "public.ab_tests" does not exist')) {
          console.warn('A/B tests table does not exist. Returning empty array.')
          return []
        }
        throw new Error(`Failed to fetch A/B tests: ${error.message}`)
      }

      return data ? data.map(this.mapTestFromDatabase) : []
    } catch (error) {
      console.error('Error fetching A/B tests:', error)
      // Return empty array instead of throwing to prevent UI crashes
      if (error instanceof Error && error.message.includes('does not exist')) {
        return []
      }
      throw error
    }
  }

  /**
   * Get a specific A/B test with its variants
   */
  async getTest(testId: string): Promise<{ test: ABTest; variants: ABTestVariant[] } | null> {
    try {
      // Get test
      const { data: testData, error: testError } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('id', testId)
        .single()

      if (testError) {
        if (testError.code === 'PGRST116') {
          return null
        }
        throw new Error(`Failed to fetch test: ${testError.message}`)
      }

      // Get variants
      const { data: variantsData, error: variantsError } = await supabase
        .from('ab_test_variants')
        .select('*')
        .eq('test_id', testId)
        .order('created_at', { ascending: true })

      if (variantsError) {
        throw new Error(`Failed to fetch variants: ${variantsError.message}`)
      }

      return {
        test: this.mapTestFromDatabase(testData),
        variants: variantsData.map(this.mapVariantFromDatabase)
      }
    } catch (error) {
      console.error('Error fetching A/B test:', error)
      throw error
    }
  }

  /**
   * Record a test result
   */
  async recordResult(result: Omit<ABTestResult, 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_test_results')
        .insert({
          test_id: result.testId,
          variant_id: result.variantId,
          user_id: result.userId,
          session_id: result.sessionId,
          action: result.action,
          value: result.value,
          metadata: result.metadata
        })

      if (error) {
        throw new Error(`Failed to record result: ${error.message}`)
      }
    } catch (error) {
      console.error('Error recording A/B test result:', error)
      throw error
    }
  }

  /**
   * Get test results for analysis
   */
  async getTestResults(testId: string): Promise<ABTestResult[]> {
    try {
      const { data, error } = await supabase
        .from('ab_test_results')
        .select('*')
        .eq('test_id', testId)
        .order('timestamp', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch test results: ${error.message}`)
      }

      return data.map(this.mapResultFromDatabase)
    } catch (error) {
      console.error('Error fetching test results:', error)
      throw error
    }
  }

  /**
   * Update test status
   */
  async updateTestStatus(testId: string, status: 'active' | 'completed' | 'draft'): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({ 
          status,
          end_date: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', testId)

      if (error) {
        throw new Error(`Failed to update test status: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating test status:', error)
      throw error
    }
  }

  /**
   * Get test statistics
   */
  async getTestStats(testId: string): Promise<{
    totalImpressions: number
    totalConversions: number
    overallConversionRate: number
    winner?: string
    confidenceLevel: number
  }> {
    try {
      const { data, error } = await supabase
        .from('ab_test_variants')
        .select('impressions, conversions, conversion_rate')
        .eq('test_id', testId)

      if (error) {
        throw new Error(`Failed to fetch test stats: ${error.message}`)
      }

      const totalImpressions = data.reduce((sum, variant) => sum + variant.impressions, 0)
      const totalConversions = data.reduce((sum, variant) => sum + variant.conversions, 0)
      const overallConversionRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0

      // Find winner (highest conversion rate with sufficient sample size)
      const winner = data
        .filter(variant => variant.impressions >= 100) // Minimum sample size
        .sort((a, b) => b.conversion_rate - a.conversion_rate)[0]

      return {
        totalImpressions,
        totalConversions,
        overallConversionRate,
        winner: winner?.id,
        confidenceLevel: 95 // This would be calculated based on statistical significance
      }
    } catch (error) {
      console.error('Error fetching test stats:', error)
      throw error
    }
  }

  /**
   * Assign user to test variant
   */
  async assignUserToVariant(testId: string, userId: string, sessionId: string): Promise<string> {
    try {
      // Get test variants
      const { data: variants, error } = await supabase
        .from('ab_test_variants')
        .select('id')
        .eq('test_id', testId)

      if (error) {
        throw new Error(`Failed to fetch variants: ${error.message}`)
      }

      if (!variants || variants.length === 0) {
        throw new Error('No variants found for test')
      }

      // Simple random assignment (in production, you might want more sophisticated logic)
      const randomIndex = Math.floor(Math.random() * variants.length)
      const selectedVariantId = variants[randomIndex].id

      // Record the assignment
      await this.recordResult({
        testId,
        variantId: selectedVariantId,
        userId,
        sessionId,
        action: 'impression'
      })

      return selectedVariantId
    } catch (error) {
      console.error('Error assigning user to variant:', error)
      throw error
    }
  }

  /**
   * Map database record to ABTest interface
   */
  private mapTestFromDatabase(dbTest: any): ABTest {
    return {
      id: dbTest.id,
      name: dbTest.name,
      status: dbTest.status,
      startDate: dbTest.start_date,
      endDate: dbTest.end_date,
      targetMetric: dbTest.target_metric,
      targetAudience: dbTest.target_audience,
      sampleSize: dbTest.sample_size,
      confidenceLevel: dbTest.confidence_level,
      createdAt: dbTest.created_at,
      updatedAt: dbTest.updated_at
    }
  }

  /**
   * Map database record to ABTestVariant interface
   */
  private mapVariantFromDatabase(dbVariant: any): ABTestVariant {
    return {
      id: dbVariant.id,
      testId: dbVariant.test_id,
      name: dbVariant.name,
      contentId: dbVariant.content_id,
      type: dbVariant.type,
      value: dbVariant.value,
      impressions: dbVariant.impressions,
      conversions: dbVariant.conversions,
      conversionRate: dbVariant.conversion_rate,
      createdAt: dbVariant.created_at
    }
  }

  /**
   * Map database record to ABTestResult interface
   */
  private mapResultFromDatabase(dbResult: any): ABTestResult {
    return {
      testId: dbResult.test_id,
      variantId: dbResult.variant_id,
      userId: dbResult.user_id,
      sessionId: dbResult.session_id,
      action: dbResult.action,
      value: dbResult.value,
      metadata: dbResult.metadata,
      timestamp: dbResult.timestamp
    }
  }
}

// Export singleton instance
export const abTestingService = new ABTestingService()

// Export types
export type { ABTest, ABTestVariant, ABTestResult } 