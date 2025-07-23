import { supabase } from '../supabase'
import type { Database } from '../supabase'

export interface UserData {
  id: string
  email: string
  phone?: string
  full_name?: string
  city?: string
  capture_level: number
  capture_timestamps: Record<string, string | null>
  engagement_score: number
  readiness_indicator: number
  last_activity: string
  entry_point?: string
  current_tier: 'browser' | 'engaged' | 'soft-member'
  language: 'en' | 'am'
  timezone: string
  communication_preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

export class UserModel {
  private data: UserData

  constructor(data: UserData) {
    this.data = data
  }

  // Static methods for database operations
  static async findById(id: string): Promise<UserModel | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        return null
      }

      return new UserModel(data)
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  }

  static async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        return null
      }

      return new UserModel(data)
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  static async create(userData: Partial<UserData>): Promise<UserModel> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email!,
          phone: userData.phone,
          full_name: userData.full_name,
          city: userData.city,
          capture_level: userData.capture_level || 1,
          capture_timestamps: userData.capture_timestamps || {
            level1: new Date().toISOString(),
            level2: null,
            level3: null,
          },
          engagement_score: userData.engagement_score || 0,
          readiness_indicator: userData.readiness_indicator || 0,
          entry_point: userData.entry_point || 'direct',
          current_tier: userData.current_tier || 'browser',
          language: userData.language || 'en',
          timezone: userData.timezone || 'UTC',
          communication_preferences: userData.communication_preferences || {},
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create user: ${error.message}`)
      }

      return new UserModel(data)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  static async findOrCreate(email: string, userData: Partial<UserData>): Promise<{ user: UserModel; isNew: boolean }> {
    try {
      // Try to find existing user
      const existingUser = await UserModel.findByEmail(email)
      
      if (existingUser) {
        return { user: existingUser, isNew: false }
      }

      // Create new user
      const newUser = await UserModel.create({ ...userData, email })
      return { user: newUser, isNew: true }
    } catch (error) {
      console.error('Error in findOrCreate:', error)
      throw error
    }
  }

  // Instance methods
  get id(): string {
    return this.data.id
  }

  get email(): string {
    return this.data.email
  }

  get captureLevel(): number {
    return this.data.capture_level
  }

  get currentTier(): 'browser' | 'engaged' | 'soft-member' {
    return this.data.current_tier
  }

  get engagementScore(): number {
    return this.data.engagement_score
  }

  get language(): 'en' | 'am' {
    return this.data.language
  }

  get fullName(): string | undefined {
    return this.data.full_name
  }

  get phone(): string | undefined {
    return this.data.phone
  }

  get city(): string | undefined {
    return this.data.city
  }

  get entryPoint(): string | undefined {
    return this.data.entry_point
  }

  async updateCaptureLevel(level: number, additionalData: Partial<UserData> = {}): Promise<void> {
    try {
      const updateData: any = {
        capture_level: Math.max(this.data.capture_level, level),
        capture_timestamps: {
          ...this.data.capture_timestamps,
          [`level${level}`]: new Date().toISOString(),
        },
        last_activity: new Date().toISOString(),
        ...additionalData,
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', this.data.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update capture level: ${error.message}`)
      }

      this.data = data
    } catch (error) {
      console.error('Error updating capture level:', error)
      throw error
    }
  }

  async updateEngagementScore(score: number): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          engagement_score: score,
          last_activity: new Date().toISOString(),
        })
        .eq('id', this.data.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update engagement score: ${error.message}`)
      }

      this.data = data
    } catch (error) {
      console.error('Error updating engagement score:', error)
      throw error
    }
  }

  async updateTier(tier: 'browser' | 'engaged' | 'soft-member'): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          current_tier: tier,
          last_activity: new Date().toISOString(),
        })
        .eq('id', this.data.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update tier: ${error.message}`)
      }

      this.data = data
    } catch (error) {
      console.error('Error updating tier:', error)
      throw error
    }
  }

  async updateProfile(profileData: {
    full_name?: string
    phone?: string
    city?: string
    language?: 'en' | 'am'
    timezone?: string
    communication_preferences?: Record<string, unknown>
  }): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...profileData,
          last_activity: new Date().toISOString(),
        })
        .eq('id', this.data.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      this.data = data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  async updateLastActivity(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          last_activity: new Date().toISOString(),
        })
        .eq('id', this.data.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update last activity: ${error.message}`)
      }

      this.data = data
    } catch (error) {
      console.error('Error updating last activity:', error)
      throw error
    }
  }

  // Get user's capture progress
  getCaptureProgress(): {
    level1: boolean
    level2: boolean
    level3: boolean
    timestamps: Record<string, string | null>
  } {
    return {
      level1: this.data.capture_level >= 1,
      level2: this.data.capture_level >= 2,
      level3: this.data.capture_level >= 3,
      timestamps: this.data.capture_timestamps,
    }
  }

  // Check if user can access certain features
  canAccessFeature(requiredLevel: number): boolean {
    return this.data.capture_level >= requiredLevel
  }

  canAccessTier(requiredTier: 'browser' | 'engaged' | 'soft-member'): boolean {
    const tierLevels = { browser: 1, engaged: 2, 'soft-member': 3 }
    const userTierLevel = tierLevels[this.data.current_tier]
    const requiredTierLevel = tierLevels[requiredTier]
    
    return userTierLevel >= requiredTierLevel
  }

  // Get user's journey statistics
  async getJourneyStats(): Promise<{
    daysSinceJoined: number
    totalInteractions: number
    toolsCompleted: number
    contentEngaged: number
  }> {
    try {
      const joinDate = new Date(this.data.created_at)
      const daysSinceJoined = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))

      // Get interaction count
      const { count: totalInteractions } = await supabase
        .from('interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', this.data.id)

      // Get completed tools count
      const { count: toolsCompleted } = await supabase
        .from('tool_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', this.data.id)
        .eq('is_completed', true)

      // Get content engagement count
      const { count: contentEngaged } = await supabase
        .from('content_engagement')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', this.data.id)

      return {
        daysSinceJoined,
        totalInteractions: totalInteractions || 0,
        toolsCompleted: toolsCompleted || 0,
        contentEngaged: contentEngaged || 0,
      }
    } catch (error) {
      console.error('Error getting journey stats:', error)
      return {
        daysSinceJoined: 0,
        totalInteractions: 0,
        toolsCompleted: 0,
        contentEngaged: 0,
      }
    }
  }

  // Convert to JSON for API responses
  toJSON(): Omit<UserData, 'communication_preferences'> & {
    communication_preferences: Record<string, unknown>
  } {
    return {
      ...this.data,
      communication_preferences: this.data.communication_preferences,
    }
  }

  // Get safe public profile (no sensitive data)
  toPublicProfile(): {
    id: string
    full_name?: string
    city?: string
    current_tier: string
    language: string
    created_at: string
  } {
    return {
      id: this.data.id,
      full_name: this.data.full_name,
      city: this.data.city,
      current_tier: this.data.current_tier,
      language: this.data.language,
      created_at: this.data.created_at,
    }
  }
}