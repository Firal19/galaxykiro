import { supabase } from '../../lib/supabase'
import { UserModel } from './models/user'
import { Level1Data, Level2Data, Level3Data, validateProgressiveCapture } from './validations'
import { trackingService } from './tracking'

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: AuthUser
}

export interface ProgressiveRegistrationData {
  level: 1 | 2 | 3
  data: Level1Data | Level2Data | Level3Data
  entryPoint?: string
  memberUrl?: string
  utmParams?: Record<string, string>
}

class AuthService {
  private currentUser: UserModel | null = null
  private currentSession: AuthSession | null = null

  constructor() {
    // Initialize auth state listener
    this.initializeAuthListener()
  }

  private initializeAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        this.currentSession = session
        await this.loadCurrentUser(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        this.currentSession = null
        this.currentUser = null
      } else if (event === 'TOKEN_REFRESHED' && session) {
        this.currentSession = session
      }
    })
  }

  private async loadCurrentUser(userId: string): Promise<void> {
    try {
      this.currentUser = await UserModel.findById(userId)
    } catch (error) {
      console.error('Failed to load current user:', error)
      this.currentUser = null
    }
  }

  // Get current session
  async getSession(): Promise<AuthSession | null> {
    if (this.currentSession) {
      return this.currentSession
    }

    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Failed to get session:', error)
      return null
    }

    this.currentSession = session
    return session
  }

  // Get current user
  async getCurrentUser(): Promise<UserModel | null> {
    if (this.currentUser) {
      return this.currentUser
    }

    const session = await this.getSession()
    if (!session) {
      return null
    }

    await this.loadCurrentUser(session.user.id)
    return this.currentUser
  }

  // Progressive registration with URL tracking
  async progressiveRegister(registrationData: ProgressiveRegistrationData): Promise<{
    user: UserModel
    session: AuthSession
    isNewUser: boolean
  }> {
    const { level, data, entryPoint, memberUrl, utmParams } = registrationData

    // Validate data for the specified level
    const validation = validateProgressiveCapture(level, data)
    if (!validation.success) {
      throw new Error(`Invalid data for level ${level}: ${validation.error.message}`)
    }

    const validatedData = validation.data

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(validatedData.email)
    let isNewUser = false

    if (existingUser) {
      // Update existing user with new information
      const updateData: Record<string, unknown> = {}
      
      if (level >= 2 && 'phone' in validatedData) {
        updateData.phone = validatedData.phone
      }
      
      if (level >= 3 && 'fullName' in validatedData && 'city' in validatedData) {
        updateData.full_name = validatedData.fullName
        updateData.city = validatedData.city
      }

      // Update capture level if higher
      if (level > existingUser.captureLevel) {
        await existingUser.updateCaptureLevel(level, updateData)
      }

      // Track the registration event
      await trackingService.trackUserJourney({
        userId: existingUser.id,
        eventType: 'progressive_registration',
        eventData: {
          level,
          entryPoint,
          memberUrl,
          utmParams,
          isReturningUser: true
        }
      })

      // Get or create auth session
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: this.generateTemporaryPassword(validatedData.email)
      })

      if (authError) {
        // If sign in fails, create new auth user
        const { data: newAuthData, error: signUpError } = await supabase.auth.signUp({
          email: validatedData.email,
          password: this.generateTemporaryPassword(validatedData.email),
          options: {
            data: {
              capture_level: level,
              entry_point: entryPoint,
              member_url: memberUrl,
              utm_params: utmParams
            }
          }
        })

        if (signUpError) {
          throw new Error(`Failed to create auth user: ${signUpError.message}`)
        }

        return {
          user: existingUser,
          session: newAuthData.session!,
          isNewUser: false
        }
      }

      return {
        user: existingUser,
        session: authData.session!,
        isNewUser: false
      }
    } else {
      // Create new user
      isNewUser = true

      // Parse member URL for tracking
      const memberInfo = this.parseMemberUrl(memberUrl)

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: this.generateTemporaryPassword(validatedData.email),
        options: {
          data: {
            capture_level: level,
            entry_point: entryPoint,
            member_url: memberUrl,
            utm_params: utmParams,
            member_id: memberInfo?.memberId,
            post_id: memberInfo?.postId
          }
        }
      })

      if (authError) {
        throw new Error(`Failed to create auth user: ${authError.message}`)
      }

      // Create user profile
      const userCreateData: Record<string, unknown> = {
        id: authData.user!.id,
        email: validatedData.email,
        capture_level: level,
        entry_point: entryPoint || 'direct',
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        communication_preferences: {
          email: true,
          sms: level >= 2,
          push: false,
          frequency: 'weekly'
        }
      }

      if (level >= 2 && 'phone' in validatedData) {
        userCreateData.phone = validatedData.phone
      }

      if (level >= 3 && 'fullName' in validatedData && 'city' in validatedData) {
        userCreateData.full_name = validatedData.fullName
        userCreateData.city = validatedData.city
      }

      const newUser = await UserModel.create(userCreateData)

      // Track the registration event
      await trackingService.trackUserJourney({
        userId: newUser.id,
        eventType: 'progressive_registration',
        eventData: {
          level,
          entryPoint,
          memberUrl,
          utmParams,
          memberInfo,
          isNewUser: true
        }
      })

      this.currentUser = newUser
      this.currentSession = authData.session!

      return {
        user: newUser,
        session: authData.session!,
        isNewUser: true
      }
    }
  }

  // Sign in existing user
  async signIn(email: string, password?: string): Promise<{
    user: UserModel
    session: AuthSession
  }> {
    const actualPassword = password || this.generateTemporaryPassword(email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: actualPassword
    })

    if (error) {
      throw new Error(`Sign in failed: ${error.message}`)
    }

    const user = await UserModel.findById(data.user.id)
    if (!user) {
      throw new Error('User profile not found')
    }

    this.currentUser = user
    this.currentSession = data.session

    // Track sign in event
    await trackingService.trackUserJourney({
      userId: user.id,
      eventType: 'sign_in',
      eventData: {
        method: 'email_password'
      }
    })

    return {
      user,
      session: data.session
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    const currentUser = this.currentUser

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`)
    }

    // Track sign out event
    if (currentUser) {
      await trackingService.trackUserJourney({
        userId: currentUser.id,
        eventType: 'sign_out',
        eventData: {}
      })
    }

    this.currentUser = null
    this.currentSession = null
  }

  // Update user profile
  async updateProfile(updates: Partial<Level3Data>): Promise<UserModel> {
    const currentUser = await this.getCurrentUser()
    if (!currentUser) {
      throw new Error('No authenticated user')
    }

    // Validate updates
    const currentLevel = currentUser.captureLevel
    let newLevel = currentLevel

    // Determine new capture level based on provided data
    if (updates.fullName && updates.city && currentLevel < 3) {
      newLevel = 3
    } else if (updates.phone && currentLevel < 2) {
      newLevel = 2
    }

    // Update user data
    const updateData: Record<string, unknown> = {}
    if (updates.phone) updateData.phone = updates.phone
    if (updates.fullName) updateData.full_name = updates.fullName
    if (updates.city) updateData.city = updates.city

    if (newLevel > currentLevel) {
      await currentUser.updateCaptureLevel(newLevel, updateData)
    } else {
      // Update without changing capture level
      const { error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`)
      }
    }

    // Reload user data
    await this.loadCurrentUser(currentUser.id)

    // Track profile update
    await trackingService.trackUserJourney({
      userId: currentUser.id,
      eventType: 'profile_update',
      eventData: {
        previousLevel: currentLevel,
        newLevel,
        updatedFields: Object.keys(updateData)
      }
    })

    return this.currentUser!
  }

  // Check if user can access specific level
  async canAccessLevel(level: 1 | 2 | 3): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user ? user.canAccessLevel(level) : false
  }

  // Get user tier
  async getUserTier(): Promise<'browser' | 'engaged' | 'soft-member' | null> {
    const user = await this.getCurrentUser()
    return user ? user.currentTier : null
  }

  // Refresh session
  async refreshSession(): Promise<AuthSession | null> {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) {
      console.error('Failed to refresh session:', error)
      return null
    }

    this.currentSession = data.session
    return data.session
  }

  // Helper methods
  private generateTemporaryPassword(email: string): string {
    // Generate a consistent temporary password based on email
    // In production, you might want to use a more secure method
    return `temp_${email.split('@')[0]}_${Date.now().toString().slice(-6)}`
  }

  private parseMemberUrl(memberUrl?: string): { memberId: string; postId: string } | null {
    if (!memberUrl) return null

    // Parse MEMBERID_POSTID format
    const match = memberUrl.match(/([A-Z0-9]+)_([A-Z0-9]+)/)
    if (!match) return null

    return {
      memberId: match[1],
      postId: match[2]
    }
  }

  // Check authentication status
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession()
    return !!session
  }

  // Get JWT token
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession()
    return session?.access_token || null
  }
}

// Export singleton instance
export const authService = new AuthService()