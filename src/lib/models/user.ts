import { supabase, Database } from '../../../lib/supabase'

export type UserRow = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export interface CaptureTimestamps {
  level1: string | null
  level2: string | null
  level3: string | null
}

export interface CommunicationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
}

export class UserModel {
  private data: UserRow

  constructor(data: UserRow) {
    this.data = data
  }

  // Getters
  get id(): string {
    return this.data.id
  }

  get email(): string {
    return this.data.email
  }

  get phone(): string | undefined {
    return this.data.phone
  }

  get fullName(): string | undefined {
    return this.data.full_name
  }

  get city(): string | undefined {
    return this.data.city
  }

  get captureLevel(): number {
    return this.data.capture_level
  }

  get captureTimestamps(): CaptureTimestamps {
    return this.data.capture_timestamps as unknown as CaptureTimestamps
  }

  get engagementScore(): number {
    return this.data.engagement_score
  }

  get readinessIndicator(): number {
    return this.data.readiness_indicator
  }

  get currentTier(): 'browser' | 'engaged' | 'soft-member' {
    return this.data.current_tier
  }

  get language(): 'en' | 'am' {
    return this.data.language
  }

  get entryPoint(): string | undefined {
    return this.data.entry_point
  }

  get lastActivity(): Date {
    return new Date(this.data.last_activity)
  }

  get communicationPreferences(): CommunicationPreferences {
    return this.data.communication_preferences as unknown as CommunicationPreferences
  }

  get createdAt(): Date {
    return new Date(this.data.created_at)
  }

  get updatedAt(): Date {
    return new Date(this.data.updated_at)
  }

  // Progressive capture methods
  canAccessLevel(level: 1 | 2 | 3): boolean {
    return this.captureLevel >= level
  }

  async updateCaptureLevel(level: 1 | 2 | 3, additionalData?: Partial<UserUpdate>): Promise<void> {
    if (level <= this.captureLevel) {
      return // Already at this level or higher
    }

    const timestamps = { ...this.captureTimestamps }
    timestamps[`level${level}` as keyof CaptureTimestamps] = new Date().toISOString()

    const updateData: UserUpdate = {
      capture_level: level,
      capture_timestamps: timestamps,
      updated_at: new Date().toISOString(),
      ...additionalData
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to update capture level: ${error.message}`)
    }

    // Update local data
    this.data = { ...this.data, ...updateData } as UserRow
  }

  async updateEngagementScore(score: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        engagement_score: score,
        readiness_indicator: this.calculateReadinessIndicator(score),
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to update engagement score: ${error.message}`)
    }

    this.data.engagement_score = score
    this.data.readiness_indicator = this.calculateReadinessIndicator(score)
    this.data.last_activity = new Date().toISOString()
  }

  async updateTier(tier: 'browser' | 'engaged' | 'soft-member'): Promise<void> {
    if (tier === this.currentTier) {
      return // Already at this tier
    }

    const { error } = await supabase
      .from('users')
      .update({
        current_tier: tier,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)

    if (error) {
      throw new Error(`Failed to update tier: ${error.message}`)
    }

    this.data.current_tier = tier
  }

  private calculateReadinessIndicator(engagementScore: number): number {
    // Convert engagement score to readiness indicator (0-100)
    if (engagementScore >= 70) return 100 // High readiness
    if (engagementScore >= 30) return 60  // Medium readiness
    return 20 // Low readiness
  }

  // Static methods for creating and finding users
  static async create(userData: UserInsert): Promise<UserModel> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        capture_timestamps: { level1: new Date().toISOString(), level2: null, level3: null },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return new UserModel(data)
  }

  static async findById(id: string): Promise<UserModel | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw new Error(`Failed to find user: ${error.message}`)
    }

    return new UserModel(data)
  }

  static async findByEmail(email: string): Promise<UserModel | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw new Error(`Failed to find user by email: ${error.message}`)
    }

    return new UserModel(data)
  }

  static async findByTier(tier: 'browser' | 'engaged' | 'soft-member'): Promise<UserModel[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('current_tier', tier)
      .order('engagement_score', { ascending: false })

    if (error) {
      throw new Error(`Failed to find users by tier: ${error.message}`)
    }

    return data.map(user => new UserModel(user))
  }

  // Utility methods
  getRequiredFieldsForLevel(level: 1 | 2 | 3): string[] {
    switch (level) {
      case 1:
        return ['email']
      case 2:
        return ['email', 'phone']
      case 3:
        return ['email', 'phone', 'full_name', 'city']
      default:
        return []
    }
  }

  hasRequiredFieldsForLevel(level: 1 | 2 | 3): boolean {
    const required = this.getRequiredFieldsForLevel(level)
    return required.every(field => {
      switch (field) {
        case 'email':
          return !!this.email
        case 'phone':
          return !!this.phone
        case 'full_name':
          return !!this.fullName
        case 'city':
          return !!this.city
        default:
          return false
      }
    })
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      fullName: this.fullName,
      city: this.city,
      captureLevel: this.captureLevel,
      captureTimestamps: this.captureTimestamps,
      engagementScore: this.engagementScore,
      readinessIndicator: this.readinessIndicator,
      currentTier: this.currentTier,
      language: this.language,
      entryPoint: this.entryPoint,
      lastActivity: this.lastActivity.toISOString(),
      communicationPreferences: this.communicationPreferences,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }
}