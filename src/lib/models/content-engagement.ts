import { supabase, Database } from '../supabase'

export type ContentEngagementRow = Database['public']['Tables']['content_engagement']['Row']
export type ContentEngagementInsert = Database['public']['Tables']['content_engagement']['Insert']
export type ContentEngagementUpdate = Database['public']['Tables']['content_engagement']['Update']

export interface EngagementData {
  clicks?: number
  shares?: number
  bookmarks?: number
  comments?: number
  reactions?: Record<string, number>
  [key: string]: unknown
}

export class ContentEngagementModel {
  private data: ContentEngagementRow

  constructor(data: ContentEngagementRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get userId(): string | undefined {
    return this.data.user_id
  }

  get contentId(): string {
    return this.data.content_id
  }

  get contentType(): string {
    return this.data.content_type
  }

  get contentCategory(): string | undefined {
    return this.data.content_category
  }

  get timeSpent(): number {
    return this.data.time_spent
  }

  get scrollDepth(): number {
    return this.data.scroll_depth
  }

  get interactionsCount(): number {
    return this.data.interactions_count
  }

  get engagementData(): EngagementData {
    return this.data.engagement_data as EngagementData
  }

  get sessionId(): string | undefined {
    return this.data.session_id
  }

  get pageUrl(): string | undefined {
    return this.data.page_url
  }

  get referrer(): string | undefined {
    return this.data.referrer
  }

  get startedAt(): Date {
    return new Date(this.data.started_at)
  }

  get lastInteractionAt(): Date {
    return new Date(this.data.last_interaction_at)
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  get updatedAt(): Date {
    return new Date(this.data.updated_at)
  }

  // Methods for updating engagement
  async updateTimeSpent(additionalTime: number): Promise<void> {
    const newTimeSpent = this.timeSpent + additionalTime

    const { error } = await supabase
      .from('content_engagement')
      .update({
        time_spent: newTimeSpent,
        last_interaction_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to update time spent: ${error.message}`)
    }

    this.data.time_spent = newTimeSpent
    this.data.last_interaction_at = new Date().toISOString()
  }

  async updateScrollDepth(scrollDepth: number): Promise<void> {
    // Only update if new scroll depth is greater
    if (scrollDepth <= this.scrollDepth) {
      return
    }

    const { error } = await supabase
      .from('content_engagement')
      .update({
        scroll_depth: scrollDepth,
        last_interaction_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to update scroll depth: ${error.message}`)
    }

    this.data.scroll_depth = scrollDepth
    this.data.last_interaction_at = new Date().toISOString()
  }

  async incrementInteraction(interactionType?: string): Promise<void> {
    const newInteractionsCount = this.interactionsCount + 1
    const updatedEngagementData = { ...this.engagementData }

    if (interactionType) {
      updatedEngagementData[interactionType] = (updatedEngagementData[interactionType] as number || 0) + 1
    }

    const { error } = await supabase
      .from('content_engagement')
      .update({
        interactions_count: newInteractionsCount,
        engagement_data: updatedEngagementData,
        last_interaction_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to increment interaction: ${error.message}`)
    }

    this.data.interactions_count = newInteractionsCount
    this.data.engagement_data = updatedEngagementData
    this.data.last_interaction_at = new Date().toISOString()
  }

  // Calculate engagement score
  getEngagementScore(): number {
    const timeScore = Math.min(this.timeSpent / 60, 10) // Max 10 points for 1 minute
    const scrollScore = this.scrollDepth * 5 // Max 5 points for full scroll
    const interactionScore = Math.min(this.interactionsCount * 2, 10) // Max 10 points for 5 interactions
    
    return Math.round(timeScore + scrollScore + interactionScore)
  }

  // Static methods for creating and finding content engagement
  static async create(engagementData: ContentEngagementInsert): Promise<ContentEngagementModel> {
    const { data, error } = await supabase
      .from('content_engagement')
      .insert({
        ...engagementData,
        started_at: new Date().toISOString(),
        last_interaction_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create content engagement: ${error.message}`)
    }

    return new ContentEngagementModel(data)
  }

  static async findById(id: string): Promise<ContentEngagementModel | null> {
    const { data, error } = await supabase
      .from('content_engagement')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Content engagement not found
      }
      throw new Error(`Failed to find content engagement: ${error.message}`)
    }

    return new ContentEngagementModel(data)
  }

  static async findByUserId(userId: string): Promise<ContentEngagementModel[]> {
    const { data, error } = await supabase
      .from('content_engagement')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find content engagement by user ID: ${error.message}`)
    }

    return data.map(engagement => new ContentEngagementModel(engagement))
  }

  static async findByContentId(contentId: string): Promise<ContentEngagementModel[]> {
    const { data, error } = await supabase
      .from('content_engagement')
      .select('*')
      .eq('content_id', contentId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find content engagement by content ID: ${error.message}`)
    }

    return data.map(engagement => new ContentEngagementModel(engagement))
  }

  static async findBySessionId(sessionId: string): Promise<ContentEngagementModel[]> {
    const { data, error } = await supabase
      .from('content_engagement')
      .select('*')
      .eq('session_id', sessionId)
      .order('started_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to find content engagement by session ID: ${error.message}`)
    }

    return data.map(engagement => new ContentEngagementModel(engagement))
  }

  static async findOrCreate(
    userId: string | undefined,
    contentId: string,
    contentType: string,
    sessionId?: string,
    contentCategory?: string
  ): Promise<ContentEngagementModel> {
    // Try to find existing engagement for this user/session and content
    let existingEngagement: ContentEngagementModel | null = null

    if (userId) {
      const { data, error } = await supabase
        .from('content_engagement')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        existingEngagement = new ContentEngagementModel(data)
      }
    } else if (sessionId) {
      const { data, error } = await supabase
        .from('content_engagement')
        .select('*')
        .eq('session_id', sessionId)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        existingEngagement = new ContentEngagementModel(data)
      }
    }

    if (existingEngagement) {
      return existingEngagement
    }

    // Create new engagement record
    return this.create({
      user_id: userId,
      content_id: contentId,
      content_type: contentType,
      content_category: contentCategory,
      session_id: sessionId,
      time_spent: 0,
      scroll_depth: 0,
      interactions_count: 0,
      engagement_data: {}
    })
  }

  // Analytics methods
  static async getContentStats(contentId: string): Promise<{
    totalViews: number
    uniqueUsers: number
    averageTimeSpent: number
    averageScrollDepth: number
    totalInteractions: number
    engagementRate: number
  }> {
    const engagements = await this.findByContentId(contentId)
    
    const totalViews = engagements.length
    const uniqueUsers = new Set(engagements.map(e => e.userId).filter(Boolean)).size
    const averageTimeSpent = engagements.reduce((sum, e) => sum + e.timeSpent, 0) / totalViews
    const averageScrollDepth = engagements.reduce((sum, e) => sum + e.scrollDepth, 0) / totalViews
    const totalInteractions = engagements.reduce((sum, e) => sum + e.interactionsCount, 0)
    const engagementRate = engagements.filter(e => e.getEngagementScore() > 5).length / totalViews

    return {
      totalViews,
      uniqueUsers,
      averageTimeSpent,
      averageScrollDepth,
      totalInteractions,
      engagementRate
    }
  }

  static async getUserEngagementStats(userId: string): Promise<{
    totalContentViewed: number
    totalTimeSpent: number
    averageScrollDepth: number
    totalInteractions: number
    topCategories: Array<{ category: string; count: number }>
  }> {
    const engagements = await this.findByUserId(userId)
    
    const totalContentViewed = engagements.length
    const totalTimeSpent = engagements.reduce((sum, e) => sum + e.timeSpent, 0)
    const averageScrollDepth = engagements.reduce((sum, e) => sum + e.scrollDepth, 0) / totalContentViewed
    const totalInteractions = engagements.reduce((sum, e) => sum + e.interactionsCount, 0)
    
    const categoryCounts: Record<string, number> = {}
    engagements.forEach(e => {
      if (e.contentCategory) {
        categoryCounts[e.contentCategory] = (categoryCounts[e.contentCategory] || 0) + 1
      }
    })
    
    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalContentViewed,
      totalTimeSpent,
      averageScrollDepth,
      totalInteractions,
      topCategories
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      contentId: this.contentId,
      contentType: this.contentType,
      contentCategory: this.contentCategory,
      timeSpent: this.timeSpent,
      scrollDepth: this.scrollDepth,
      interactionsCount: this.interactionsCount,
      engagementData: this.engagementData,
      sessionId: this.sessionId,
      pageUrl: this.pageUrl,
      referrer: this.referrer,
      startedAt: this.startedAt.toISOString(),
      lastInteractionAt: this.lastInteractionAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      engagementScore: this.getEngagementScore()
    }
  }
}