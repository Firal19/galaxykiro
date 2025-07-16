import { supabase, Database } from '../../../lib/supabase'

export type WebinarRow = Database['public']['Tables']['webinars']['Row']
export type WebinarInsert = Database['public']['Tables']['webinars']['Insert']
export type WebinarUpdate = Database['public']['Tables']['webinars']['Update']

export type WebinarRegistrationRow = Database['public']['Tables']['webinar_registrations']['Row']
export type WebinarRegistrationInsert = Database['public']['Tables']['webinar_registrations']['Insert']
export type WebinarRegistrationUpdate = Database['public']['Tables']['webinar_registrations']['Update']

export interface WebinarRegistrationData {
  interests?: string[]
  experience_level?: string
  goals?: string[]
  company?: string
  role?: string
  how_heard?: string
  questions?: string
}

export class WebinarModel {
  private data: WebinarRow

  constructor(data: WebinarRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get title(): string {
    return this.data.title
  }

  get description(): string | null {
    return this.data.description
  }

  get presenterName(): string | null {
    return this.data.presenter_name
  }

  get presenterBio(): string | null {
    return this.data.presenter_bio
  }

  get scheduledAt(): Date {
    return new Date(this.data.scheduled_at)
  }

  get durationMinutes(): number {
    return this.data.duration_minutes || 90
  }

  get maxAttendees(): number | null {
    return this.data.max_attendees
  }

  get registrationDeadline(): Date | null {
    return this.data.registration_deadline ? new Date(this.data.registration_deadline) : null
  }

  get webinarUrl(): string | null {
    return this.data.webinar_url
  }

  get recordingUrl(): string | null {
    return this.data.recording_url
  }

  get status(): string {
    return this.data.status || 'scheduled'
  }

  get tags(): string[] {
    return this.data.tags || []
  }

  get thumbnailUrl(): string | null {
    return this.data.thumbnail_url
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  // Static methods
  static async findAll(limit = 50): Promise<WebinarModel[]> {
    const { data, error } = await supabase
      .from('webinars')
      .select('*')
      .order('scheduled_at', { ascending: true })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch webinars: ${error.message}`)
    }

    return data.map(webinar => new WebinarModel(webinar))
  }

  static async findUpcoming(limit = 10): Promise<WebinarModel[]> {
    const { data, error } = await supabase
      .from('webinars')
      .select('*')
      .gte('scheduled_at', new Date().toISOString())
      .eq('status', 'scheduled')
      .order('scheduled_at', { ascending: true })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch upcoming webinars: ${error.message}`)
    }

    return data.map(webinar => new WebinarModel(webinar))
  }

  static async findById(id: string): Promise<WebinarModel | null> {
    const { data, error } = await supabase
      .from('webinars')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return new WebinarModel(data)
  }

  static async create(webinarData: WebinarInsert): Promise<WebinarModel> {
    const { data, error } = await supabase
      .from('webinars')
      .insert(webinarData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create webinar: ${error.message}`)
    }

    return new WebinarModel(data)
  }

  // Instance methods
  async update(updateData: WebinarUpdate): Promise<void> {
    const { data, error } = await supabase
      .from('webinars')
      .update(updateData)
      .eq('id', this.data.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update webinar: ${error.message}`)
    }

    this.data = data
  }

  async getRegistrationCount(): Promise<number> {
    const { count, error } = await supabase
      .from('webinar_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('webinar_id', this.data.id)

    if (error) {
      throw new Error(`Failed to get registration count: ${error.message}`)
    }

    return count || 0
  }

  async getAttendanceCount(): Promise<number> {
    const { count, error } = await supabase
      .from('webinar_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('webinar_id', this.data.id)
      .eq('attended', true)

    if (error) {
      throw new Error(`Failed to get attendance count: ${error.message}`)
    }

    return count || 0
  }

  async getRegistrations(): Promise<WebinarRegistrationModel[]> {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('webinar_id', this.data.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to get registrations: ${error.message}`)
    }

    return data.map(registration => new WebinarRegistrationModel(registration))
  }

  isRegistrationOpen(): boolean {
    const now = new Date()
    const deadline = this.registrationDeadline || this.scheduledAt
    return now < deadline && this.status === 'scheduled'
  }

  isFull(): boolean {
    // This would need to be checked asynchronously in practice
    return false // Placeholder - would need to check current registration count
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      presenterName: this.presenterName,
      presenterBio: this.presenterBio,
      scheduledAt: this.scheduledAt.toISOString(),
      durationMinutes: this.durationMinutes,
      maxAttendees: this.maxAttendees,
      registrationDeadline: this.registrationDeadline?.toISOString(),
      webinarUrl: this.webinarUrl,
      recordingUrl: this.recordingUrl,
      status: this.status,
      tags: this.tags,
      thumbnailUrl: this.thumbnailUrl,
      createdAt: this.createdAt.toISOString()
    }
  }
}

export class WebinarRegistrationModel {
  private data: WebinarRegistrationRow

  constructor(data: WebinarRegistrationRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get webinarId(): string {
    return this.data.webinar_id
  }

  get userId(): string {
    return this.data.user_id
  }

  get registrationSource(): string | null {
    return this.data.registration_source
  }

  get registrationData(): WebinarRegistrationData {
    return this.data.registration_data as WebinarRegistrationData || {}
  }

  get attended(): boolean {
    return this.data.attended || false
  }

  get attendanceDurationMinutes(): number {
    return this.data.attendance_duration_minutes || 0
  }

  get engagementScore(): number {
    return this.data.engagement_score || 0
  }

  get feedbackRating(): number | null {
    return this.data.feedback_rating
  }

  get feedbackComment(): string | null {
    return this.data.feedback_comment
  }

  get noShowFollowUpSent(): boolean {
    return this.data.no_show_follow_up_sent || false
  }

  get recordingAccessed(): boolean {
    return this.data.recording_accessed || false
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  // Static methods
  static async create(registrationData: WebinarRegistrationInsert): Promise<WebinarRegistrationModel> {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .insert(registrationData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create webinar registration: ${error.message}`)
    }

    return new WebinarRegistrationModel(data)
  }

  static async findByUserAndWebinar(userId: string, webinarId: string): Promise<WebinarRegistrationModel | null> {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('webinar_id', webinarId)
      .single()

    if (error || !data) {
      return null
    }

    return new WebinarRegistrationModel(data)
  }

  static async findByUser(userId: string): Promise<WebinarRegistrationModel[]> {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find registrations by user: ${error.message}`)
    }

    return data.map(registration => new WebinarRegistrationModel(registration))
  }

  static async findByWebinar(webinarId: string): Promise<WebinarRegistrationModel[]> {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .select('*')
      .eq('webinar_id', webinarId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to find registrations by webinar: ${error.message}`)
    }

    return data.map(registration => new WebinarRegistrationModel(registration))
  }

  // Instance methods
  async update(updateData: WebinarRegistrationUpdate): Promise<void> {
    const { data, error } = await supabase
      .from('webinar_registrations')
      .update(updateData)
      .eq('id', this.data.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update webinar registration: ${error.message}`)
    }

    this.data = data
  }

  async markAttended(durationMinutes: number, engagementScore: number): Promise<void> {
    await this.update({
      attended: true,
      attendance_duration_minutes: durationMinutes,
      engagement_score: engagementScore
    })
  }

  async markNoShowFollowUpSent(): Promise<void> {
    await this.update({
      no_show_follow_up_sent: true
    })
  }

  async markRecordingAccessed(): Promise<void> {
    await this.update({
      recording_accessed: true
    })
  }

  async submitFeedback(rating: number, comment?: string): Promise<void> {
    await this.update({
      feedback_rating: rating,
      feedback_comment: comment
    })
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      webinarId: this.webinarId,
      userId: this.userId,
      registrationSource: this.registrationSource,
      registrationData: this.registrationData,
      attended: this.attended,
      attendanceDurationMinutes: this.attendanceDurationMinutes,
      engagementScore: this.engagementScore,
      feedbackRating: this.feedbackRating,
      feedbackComment: this.feedbackComment,
      noShowFollowUpSent: this.noShowFollowUpSent,
      recordingAccessed: this.recordingAccessed,
      createdAt: this.createdAt.toISOString()
    }
  }
}