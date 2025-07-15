import { supabase, Database } from '../../../lib/supabase'

export type InteractionRow = Database['public']['Tables']['interactions']['Row']
export type InteractionInsert = Database['public']['Tables']['interactions']['Insert']
export type InteractionUpdate = Database['public']['Tables']['interactions']['Update']

export interface InteractionEventData {
  [key: string]: unknown
}

export class InteractionModel {
  private data: InteractionRow

  constructor(data: InteractionRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get userId(): string | undefined {
    return this.data.user_id
  }

  get sessionId(): string {
    return this.data.session_id
  }

  get eventType(): string {
    return this.data.event_type
  }

  get eventData(): InteractionEventData {
    return this.data.event_data as InteractionEventData
  }

  get pageUrl(): string | undefined {
    return this.data.page_url
  }

  get referrer(): string | undefined {
    return this.data.referrer
  }

  get userAgent(): string | undefined {
    return this.data.user_agent
  }

  get ipAddress(): string | undefined {
    return this.data.ip_address
  }

  get timestamp(): Date {
    return new Date(this.data.timestamp)
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  // Static methods for creating and querying interactions
  static async create(interactionData: InteractionInsert): Promise<InteractionModel> {
    const { data, error } = await supabase
      .from('interactions')
      .insert({
        ...interactionData,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create interaction: ${error.message}`)
    }

    return new InteractionModel(data)
  }

  static async findByUserId(userId: string, limit = 100): Promise<InteractionModel[]> {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to find interactions by user ID: ${error.message}`)
    }

    return data.map(interaction => new InteractionModel(interaction))
  }

  static async findBySessionId(sessionId: string): Promise<InteractionModel[]> {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })

    if (error) {
      throw new Error(`Failed to find interactions by session ID: ${error.message}`)
    }

    return data.map(interaction => new InteractionModel(interaction))
  }

  static async findByEventType(eventType: string, limit = 100): Promise<InteractionModel[]> {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('event_type', eventType)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to find interactions by event type: ${error.message}`)
    }

    return data.map(interaction => new InteractionModel(interaction))
  }

  // Utility methods for common event types
  static async trackPageView(
    sessionId: string,
    pageUrl: string,
    userId?: string,
    referrer?: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<InteractionModel> {
    return this.create({
      user_id: userId,
      session_id: sessionId,
      event_type: 'page_view',
      event_data: { page_url: pageUrl },
      page_url: pageUrl,
      referrer,
      user_agent: userAgent,
      ip_address: ipAddress
    })
  }

  static async trackCTAClick(
    sessionId: string,
    ctaId: string,
    ctaText: string,
    pageUrl: string,
    userId?: string
  ): Promise<InteractionModel> {
    return this.create({
      user_id: userId,
      session_id: sessionId,
      event_type: 'cta_click',
      event_data: {
        cta_id: ctaId,
        cta_text: ctaText,
        page_url: pageUrl
      },
      page_url: pageUrl
    })
  }

  static async trackToolStart(
    sessionId: string,
    toolId: string,
    toolName: string,
    userId?: string
  ): Promise<InteractionModel> {
    return this.create({
      user_id: userId,
      session_id: sessionId,
      event_type: 'tool_start',
      event_data: {
        tool_id: toolId,
        tool_name: toolName
      }
    })
  }

  static async trackContentDownload(
    sessionId: string,
    contentId: string,
    contentType: string,
    userId?: string
  ): Promise<InteractionModel> {
    return this.create({
      user_id: userId,
      session_id: sessionId,
      event_type: 'content_download',
      event_data: {
        content_id: contentId,
        content_type: contentType
      }
    })
  }

  static async trackWebinarRegistration(
    sessionId: string,
    webinarId: string,
    webinarTitle: string,
    userId?: string
  ): Promise<InteractionModel> {
    return this.create({
      user_id: userId,
      session_id: sessionId,
      event_type: 'webinar_registration',
      event_data: {
        webinar_id: webinarId,
        webinar_title: webinarTitle
      }
    })
  }

  static async trackFormSubmission(
    sessionId: string,
    formId: string,
    formData: Record<string, unknown>,
    userId?: string
  ): Promise<InteractionModel> {
    return this.create({
      user_id: userId,
      session_id: sessionId,
      event_type: 'form_submission',
      event_data: {
        form_id: formId,
        form_data: formData
      }
    })
  }

  // Analytics methods
  static async getUserJourneyStats(userId: string): Promise<{
    totalInteractions: number
    uniqueSessions: number
    eventTypeCounts: Record<string, number>
    firstInteraction: Date | null
    lastInteraction: Date | null
  }> {
    const interactions = await this.findByUserId(userId, 1000)
    
    const uniqueSessions = new Set(interactions.map(i => i.sessionId)).size
    const eventTypeCounts: Record<string, number> = {}
    
    interactions.forEach(interaction => {
      eventTypeCounts[interaction.eventType] = (eventTypeCounts[interaction.eventType] || 0) + 1
    })

    return {
      totalInteractions: interactions.length,
      uniqueSessions,
      eventTypeCounts,
      firstInteraction: interactions.length > 0 ? interactions[interactions.length - 1].timestamp : null,
      lastInteraction: interactions.length > 0 ? interactions[0].timestamp : null
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId,
      eventType: this.eventType,
      eventData: this.eventData,
      pageUrl: this.pageUrl,
      referrer: this.referrer,
      userAgent: this.userAgent,
      ipAddress: this.ipAddress,
      timestamp: this.timestamp.toISOString(),
      createdAt: this.createdAt.toISOString()
    }
  }
}