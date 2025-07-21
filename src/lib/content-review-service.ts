import { supabase } from './supabase'

export interface ContentReview {
  id: string
  userId: string
  contentId: string
  contentType: string
  rating: number
  reviewText?: string
  tags: string[]
  verified: boolean
  helpfulVotes: number
  reportCount: number
  reportedReason?: string
  createdAt: string
  updatedAt: string
}

export interface ContentMetrics {
  contentId: string
  contentType: string
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number>
  tagFrequency: Record<string, number>
  engagementScore: number
  verifiedReviewsCount: number
  totalHelpfulVotes: number
  reportedReviewsCount: number
  lastReviewAt: string
}

export interface ContentInsights {
  strengths: string[]
  improvements: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  recommendationScore: number
}

class ContentReviewService {
  /**
   * Submit a new content review
   */
  async submitReview(review: Omit<ContentReview, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'helpfulVotes' | 'reportCount'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .insert({
          user_id: review.userId,
          content_id: review.contentId,
          content_type: review.contentType,
          rating: review.rating,
          review_text: review.reviewText,
          tags: review.tags
        })
        .select('id')
        .single()

      if (error) {
        throw new Error(`Failed to submit review: ${error.message}`)
      }

      return data.id
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }

  /**
   * Get reviews for a specific content item
   */
  async getContentReviews(contentId: string, options?: {
    limit?: number
    sortBy?: 'newest' | 'oldest' | 'rating' | 'helpful'
    minRating?: number
    verified?: boolean
  }): Promise<ContentReview[]> {
    try {
      let query = supabase
        .from('content_reviews')
        .select('*')
        .eq('content_id', contentId)

      // Apply filters
      if (options?.minRating) {
        query = query.gte('rating', options.minRating)
      }

      if (options?.verified !== undefined) {
        query = query.eq('verified', options.verified)
      }

      // Apply sorting
      switch (options?.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        case 'helpful':
          query = query.order('helpful_votes', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to fetch reviews: ${error.message}`)
      }

      return data.map(this.mapReviewFromDatabase)
    } catch (error) {
      console.error('Error fetching content reviews:', error)
      throw error
    }
  }

  /**
   * Get metrics for a specific content item
   */
  async getContentMetrics(contentId: string): Promise<ContentMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('content_metrics')
        .select('*')
        .eq('content_id', contentId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No reviews found
          return null
        }
        throw new Error(`Failed to fetch content metrics: ${error.message}`)
      }

      // Get tag frequency
      const { data: tagData } = await supabase
        .from('content_reviews')
        .select('tags')
        .eq('content_id', contentId)

      const tagFrequency: Record<string, number> = {}
      tagData?.forEach(review => {
        review.tags?.forEach((tag: string) => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
        })
      })

      return {
        contentId: data.content_id,
        contentType: data.content_type,
        totalReviews: data.total_reviews,
        averageRating: parseFloat(data.average_rating),
        ratingDistribution: {
          1: data.rating_1_count,
          2: data.rating_2_count,
          3: data.rating_3_count,
          4: data.rating_4_count,
          5: data.rating_5_count
        },
        tagFrequency,
        engagementScore: parseFloat(data.engagement_score),
        verifiedReviewsCount: data.verified_reviews_count,
        totalHelpfulVotes: data.total_helpful_votes,
        reportedReviewsCount: data.reported_reviews_count,
        lastReviewAt: data.last_review_at
      }
    } catch (error) {
      console.error('Error fetching content metrics:', error)
      throw error
    }
  }

  /**
   * Get insights for a specific content item
   */
  async getContentInsights(contentId: string): Promise<ContentInsights | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_content_insights', { content_id_param: contentId })

      if (error) {
        throw new Error(`Failed to fetch content insights: ${error.message}`)
      }

      if (!data) {
        return null
      }

      return {
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        sentiment: data.sentiment,
        recommendationScore: parseFloat(data.recommendation_score)
      }
    } catch (error) {
      console.error('Error fetching content insights:', error)
      throw error
    }
  }

  /**
   * Vote a review as helpful
   */
  async voteHelpful(reviewId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_reviews')
        .update({ helpful_votes: supabase.raw('helpful_votes + 1') })
        .eq('id', reviewId)

      if (error) {
        throw new Error(`Failed to vote helpful: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error voting helpful:', error)
      return false
    }
  }

  /**
   * Report a review
   */
  async reportReview(reviewId: string, userId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_reviews')
        .update({ 
          report_count: supabase.raw('report_count + 1'),
          reported_reason: reason
        })
        .eq('id', reviewId)

      if (error) {
        throw new Error(`Failed to report review: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error reporting review:', error)
      return false
    }
  }

  /**
   * Verify a review (admin only)
   */
  async verifyReview(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_reviews')
        .update({ verified: true })
        .eq('id', reviewId)

      if (error) {
        throw new Error(`Failed to verify review: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error verifying review:', error)
      return false
    }
  }

  /**
   * Remove a review (admin only)
   */
  async removeReview(reviewId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_reviews')
        .delete()
        .eq('id', reviewId)

      if (error) {
        throw new Error(`Failed to remove review: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error removing review:', error)
      return false
    }
  }

  /**
   * Get top rated content
   */
  async getTopRatedContent(limit: number = 10): Promise<Array<{ contentId: string; metrics: ContentMetrics }>> {
    try {
      const { data, error } = await supabase
        .from('content_metrics')
        .select('*')
        .gte('total_reviews', 3) // Only content with at least 3 reviews
        .order('average_rating', { ascending: false })
        .order('total_reviews', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to fetch top rated content: ${error.message}`)
      }

      return data.map(item => ({
        contentId: item.content_id,
        metrics: {
          contentId: item.content_id,
          contentType: item.content_type,
          totalReviews: item.total_reviews,
          averageRating: parseFloat(item.average_rating),
          ratingDistribution: {
            1: item.rating_1_count,
            2: item.rating_2_count,
            3: item.rating_3_count,
            4: item.rating_4_count,
            5: item.rating_5_count
          },
          tagFrequency: {},
          engagementScore: parseFloat(item.engagement_score),
          verifiedReviewsCount: item.verified_reviews_count,
          totalHelpfulVotes: item.total_helpful_votes,
          reportedReviewsCount: item.reported_reviews_count,
          lastReviewAt: item.last_review_at
        }
      }))
    } catch (error) {
      console.error('Error fetching top rated content:', error)
      throw error
    }
  }

  /**
   * Get user's review history
   */
  async getUserReviews(userId: string): Promise<ContentReview[]> {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch user reviews: ${error.message}`)
      }

      return data.map(this.mapReviewFromDatabase)
    } catch (error) {
      console.error('Error fetching user reviews:', error)
      throw error
    }
  }

  /**
   * Check if user has already reviewed content
   */
  async hasUserReviewed(userId: string, contentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('content_reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to check user review: ${error.message}`)
      }

      return !!data
    } catch (error) {
      console.error('Error checking user review:', error)
      return false
    }
  }

  /**
   * Map database record to ContentReview interface
   */
  private mapReviewFromDatabase(dbReview: any): ContentReview {
    return {
      id: dbReview.id,
      userId: dbReview.user_id,
      contentId: dbReview.content_id,
      contentType: dbReview.content_type,
      rating: dbReview.rating,
      reviewText: dbReview.review_text,
      tags: dbReview.tags || [],
      verified: dbReview.verified,
      helpfulVotes: dbReview.helpful_votes,
      reportCount: dbReview.report_count,
      reportedReason: dbReview.reported_reason,
      createdAt: dbReview.created_at,
      updatedAt: dbReview.updated_at
    }
  }
}

// Export singleton instance
export const contentReviewService = new ContentReviewService()

// Export types
export type { ContentReview, ContentMetrics, ContentInsights } 