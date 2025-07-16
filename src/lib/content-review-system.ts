interface ContentReview {
  id: string
  contentId: string
  userId: string
  rating: number // 1-5 stars
  reviewText?: string
  tags: string[] // helpful, inspiring, practical, etc.
  createdAt: string
  updatedAt: string
  verified: boolean
  helpfulVotes: number
  reportCount: number
}

interface ContentMetrics {
  contentId: string
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number> // 1: count, 2: count, etc.
  tagFrequency: Record<string, number>
  completionRate: number
  engagementScore: number
  lastUpdated: string
}

interface ReviewPrompt {
  id: string
  trigger: 'completion' | 'time-based' | 'engagement-threshold'
  contentTypes: string[]
  questions: Array<{
    id: string
    text: string
    type: 'rating' | 'text' | 'tags' | 'multiple-choice'
    options?: string[]
    required: boolean
  }>
  timing: {
    delay?: number // seconds after trigger
    maxAttempts: number
    cooldownPeriod: number // hours
  }
}

class ContentReviewSystem {
  private reviews: Map<string, ContentReview[]> = new Map()
  private metrics: Map<string, ContentMetrics> = new Map()
  private reviewPrompts: ReviewPrompt[] = []
  private userReviewHistory: Map<string, string[]> = new Map() // userId -> reviewIds

  constructor() {
    this.initializeReviewPrompts()
  }

  private initializeReviewPrompts() {
    this.reviewPrompts = [
      {
        id: 'completion-review',
        trigger: 'completion',
        contentTypes: ['article', 'video', 'exercise'],
        questions: [
          {
            id: 'rating',
            text: 'How helpful was this content?',
            type: 'rating',
            required: true
          },
          {
            id: 'tags',
            text: 'What made this content valuable? (Select all that apply)',
            type: 'tags',
            options: ['Practical', 'Inspiring', 'Eye-opening', 'Actionable', 'Well-explained', 'Relevant'],
            required: false
          },
          {
            id: 'feedback',
            text: 'Any additional thoughts or suggestions?',
            type: 'text',
            required: false
          }
        ],
        timing: {
          delay: 5,
          maxAttempts: 2,
          cooldownPeriod: 24
        }
      },
      {
        id: 'assessment-review',
        trigger: 'completion',
        contentTypes: ['assessment'],
        questions: [
          {
            id: 'rating',
            text: 'How accurate were your results?',
            type: 'rating',
            required: true
          },
          {
            id: 'insight-quality',
            text: 'How would you rate the insights provided?',
            type: 'rating',
            required: true
          },
          {
            id: 'actionability',
            text: 'How actionable were the recommendations?',
            type: 'multiple-choice',
            options: ['Very actionable', 'Somewhat actionable', 'Not very actionable', 'Not actionable at all'],
            required: true
          },
          {
            id: 'feedback',
            text: 'What could make this assessment more valuable?',
            type: 'text',
            required: false
          }
        ],
        timing: {
          delay: 10,
          maxAttempts: 3,
          cooldownPeriod: 48
        }
      },
      {
        id: 'engagement-review',
        trigger: 'engagement-threshold',
        contentTypes: ['article', 'video'],
        questions: [
          {
            id: 'rating',
            text: 'How would you rate this content overall?',
            type: 'rating',
            required: true
          },
          {
            id: 'recommendation',
            text: 'Would you recommend this to others on a similar journey?',
            type: 'multiple-choice',
            options: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not'],
            required: true
          },
          {
            id: 'improvement',
            text: 'What would make this content even better?',
            type: 'text',
            required: false
          }
        ],
        timing: {
          delay: 0,
          maxAttempts: 1,
          cooldownPeriod: 72
        }
      }
    ]
  }

  // Review submission and management
  submitReview(review: Omit<ContentReview, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'helpfulVotes' | 'reportCount'>): string {
    const reviewId = `review-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    
    const newReview: ContentReview = {
      ...review,
      id: reviewId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: false,
      helpfulVotes: 0,
      reportCount: 0
    }

    // Add to reviews map
    const contentReviews = this.reviews.get(review.contentId) || []
    contentReviews.push(newReview)
    this.reviews.set(review.contentId, contentReviews)

    // Update user review history
    const userReviews = this.userReviewHistory.get(review.userId) || []
    userReviews.push(reviewId)
    this.userReviewHistory.set(review.userId, userReviews)

    // Update content metrics
    this.updateContentMetrics(review.contentId)

    return reviewId
  }

  private updateContentMetrics(contentId: string): void {
    const reviews = this.reviews.get(contentId) || []
    
    if (reviews.length === 0) return

    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    
    // Calculate rating distribution
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1
    })

    // Calculate tag frequency
    const tagFrequency: Record<string, number> = {}
    reviews.forEach(review => {
      review.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    })

    // Calculate engagement score (weighted average considering recency and helpfulness)
    const engagementScore = this.calculateEngagementScore(reviews)

    const metrics: ContentMetrics = {
      contentId,
      totalReviews,
      averageRating,
      ratingDistribution,
      tagFrequency,
      completionRate: 0.85, // This would come from actual completion data
      engagementScore,
      lastUpdated: new Date().toISOString()
    }

    this.metrics.set(contentId, metrics)
  }

  private calculateEngagementScore(reviews: ContentReview[]): number {
    if (reviews.length === 0) return 0

    let totalScore = 0
    let totalWeight = 0

    reviews.forEach(review => {
      // Base score from rating
      let score = review.rating * 20 // Convert 1-5 to 20-100 scale

      // Boost for helpful votes
      score += Math.min(review.helpfulVotes * 2, 20)

      // Penalty for reports
      score -= Math.min(review.reportCount * 10, 30)

      // Recency weight (newer reviews have slightly more weight)
      const daysSinceReview = (Date.now() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      const recencyWeight = Math.max(0.5, 1 - (daysSinceReview / 365)) // Decay over a year

      // Text review bonus
      const textBonus = review.reviewText && review.reviewText.length > 20 ? 5 : 0
      score += textBonus

      totalScore += score * recencyWeight
      totalWeight += recencyWeight
    })

    return Math.round(totalScore / totalWeight)
  }

  // Review retrieval and filtering
  getContentReviews(contentId: string, options?: {
    limit?: number
    sortBy?: 'newest' | 'oldest' | 'rating' | 'helpful'
    minRating?: number
    verified?: boolean
  }): ContentReview[] {
    let reviews = this.reviews.get(contentId) || []

    // Apply filters
    if (options?.minRating) {
      reviews = reviews.filter(review => review.rating >= options.minRating!)
    }

    if (options?.verified !== undefined) {
      reviews = reviews.filter(review => review.verified === options.verified)
    }

    // Apply sorting
    switch (options?.sortBy) {
      case 'newest':
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'rating':
        reviews.sort((a, b) => b.rating - a.rating)
        break
      case 'helpful':
        reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes)
        break
      default:
        // Default to newest
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Apply limit
    if (options?.limit) {
      reviews = reviews.slice(0, options.limit)
    }

    return reviews
  }

  getContentMetrics(contentId: string): ContentMetrics | null {
    return this.metrics.get(contentId) || null
  }

  getUserReviews(userId: string): ContentReview[] {
    const reviewIds = this.userReviewHistory.get(userId) || []
    const userReviews: ContentReview[] = []

    // Collect all reviews by this user
    this.reviews.forEach(contentReviews => {
      contentReviews.forEach(review => {
        if (reviewIds.includes(review.id)) {
          userReviews.push(review)
        }
      })
    })

    return userReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Review interaction
  voteHelpful(reviewId: string, userId: string): boolean {
    // Find the review
    let targetReview: ContentReview | null = null
    let contentId = ''

    for (const [cId, reviews] of this.reviews.entries()) {
      const review = reviews.find(r => r.id === reviewId)
      if (review) {
        targetReview = review
        contentId = cId
        break
      }
    }

    if (!targetReview) return false

    // Prevent self-voting
    if (targetReview.userId === userId) return false

    // In a real implementation, you'd track who voted to prevent duplicate votes
    targetReview.helpfulVotes += 1
    targetReview.updatedAt = new Date().toISOString()

    // Update metrics
    this.updateContentMetrics(contentId)

    return true
  }

  reportReview(reviewId: string, userId: string, reason: string): boolean {
    // Find the review
    let targetReview: ContentReview | null = null
    let contentId = ''

    for (const [cId, reviews] of this.reviews.entries()) {
      const review = reviews.find(r => r.id === reviewId)
      if (review) {
        targetReview = review
        contentId = cId
        break
      }
    }

    if (!targetReview) return false

    targetReview.reportCount += 1
    targetReview.updatedAt = new Date().toISOString()

    // Auto-hide reviews with too many reports
    if (targetReview.reportCount >= 3) {
      // In a real implementation, you'd flag for moderation
      console.log(`Review ${reviewId} flagged for moderation due to reports`)
    }

    // Update metrics
    this.updateContentMetrics(contentId)

    return true
  }

  // Review prompting system
  shouldPromptReview(userId: string, contentId: string, contentType: string, trigger: ReviewPrompt['trigger']): ReviewPrompt | null {
    // Check if user has already reviewed this content
    const userReviews = this.getUserReviews(userId)
    const hasReviewed = userReviews.some(review => review.contentId === contentId)
    
    if (hasReviewed) return null

    // Find appropriate prompt
    const prompt = this.reviewPrompts.find(p => 
      p.trigger === trigger && 
      p.contentTypes.includes(contentType)
    )

    if (!prompt) return null

    // Check cooldown period (simplified - in practice you'd track attempts per user/content)
    return prompt
  }

  getReviewPrompt(promptId: string): ReviewPrompt | null {
    return this.reviewPrompts.find(p => p.id === promptId) || null
  }

  // Analytics and insights
  getTopRatedContent(limit: number = 10): Array<{ contentId: string; metrics: ContentMetrics }> {
    const allMetrics = Array.from(this.metrics.entries())
      .map(([contentId, metrics]) => ({ contentId, metrics }))
      .filter(item => item.metrics.totalReviews >= 3) // Minimum reviews for reliability
      .sort((a, b) => b.metrics.averageRating - a.metrics.averageRating)

    return allMetrics.slice(0, limit)
  }

  getContentInsights(contentId: string): {
    strengths: string[]
    improvements: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
    recommendationScore: number
  } | null {
    const reviews = this.reviews.get(contentId) || []
    const metrics = this.metrics.get(contentId)

    if (!metrics || reviews.length === 0) return null

    // Analyze tag frequency for strengths
    const strengths: string[] = []
    Object.entries(metrics.tagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .forEach(([tag]) => strengths.push(tag))

    // Analyze text reviews for improvement suggestions (simplified)
    const improvements: string[] = []
    reviews.forEach(review => {
      if (review.reviewText && review.rating <= 3) {
        // In a real implementation, you'd use NLP to extract improvement suggestions
        if (review.reviewText.toLowerCase().includes('too long')) {
          improvements.push('Consider shortening content length')
        }
        if (review.reviewText.toLowerCase().includes('more examples')) {
          improvements.push('Add more practical examples')
        }
        if (review.reviewText.toLowerCase().includes('unclear')) {
          improvements.push('Improve clarity and explanation')
        }
      }
    })

    // Determine sentiment
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (metrics.averageRating >= 4) sentiment = 'positive'
    else if (metrics.averageRating <= 2.5) sentiment = 'negative'

    // Calculate recommendation score
    const recommendationScore = Math.round(
      (metrics.averageRating / 5) * 100 * 
      Math.min(1, metrics.totalReviews / 10) // Confidence factor based on review count
    )

    return {
      strengths: [...new Set(strengths)], // Remove duplicates
      improvements: [...new Set(improvements)],
      sentiment,
      recommendationScore
    }
  }

  // Moderation tools
  verifyReview(reviewId: string): boolean {
    for (const reviews of this.reviews.values()) {
      const review = reviews.find(r => r.id === reviewId)
      if (review) {
        review.verified = true
        review.updatedAt = new Date().toISOString()
        return true
      }
    }
    return false
  }

  removeReview(reviewId: string): boolean {
    for (const [contentId, reviews] of this.reviews.entries()) {
      const reviewIndex = reviews.findIndex(r => r.id === reviewId)
      if (reviewIndex !== -1) {
        reviews.splice(reviewIndex, 1)
        this.reviews.set(contentId, reviews)
        this.updateContentMetrics(contentId)
        return true
      }
    }
    return false
  }
}

// Singleton instance
export const contentReviewSystem = new ContentReviewSystem()

// Helper functions for external use
export function submitContentReview(review: Omit<ContentReview, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'helpfulVotes' | 'reportCount'>) {
  return contentReviewSystem.submitReview(review)
}

export function getReviewsForContent(contentId: string, options?: Parameters<typeof contentReviewSystem.getContentReviews>[1]) {
  return contentReviewSystem.getContentReviews(contentId, options)
}

export function getContentMetrics(contentId: string) {
  return contentReviewSystem.getContentMetrics(contentId)
}

export function shouldShowReviewPrompt(userId: string, contentId: string, contentType: string, trigger: ReviewPrompt['trigger']) {
  return contentReviewSystem.shouldPromptReview(userId, contentId, contentType, trigger)
}

export function voteReviewHelpful(reviewId: string, userId: string) {
  return contentReviewSystem.voteHelpful(reviewId, userId)
}

export function getContentInsights(contentId: string) {
  return contentReviewSystem.getContentInsights(contentId)
}

export type { ContentReview, ContentMetrics, ReviewPrompt }