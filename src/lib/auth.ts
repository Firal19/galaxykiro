import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton Supabase client to prevent multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null

// Client-side Supabase client
export const createClientComponentClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Note: Middleware client moved to separate middleware.ts file to avoid server/client conflicts

// User session management
export interface UserSession {
  id: string
  email: string
  captureLevel: number
  currentTier: 'browser' | 'engaged' | 'soft-member'
  engagementScore: number
  language: 'en' | 'am'
  entryPoint?: string
}

export const getCurrentUser = async (): Promise<UserSession | null> => {
  const supabase = createClientComponentClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session?.user) {
      return null
    }

    // Get user profile from our users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError || !userProfile) {
      return null
    }

    return {
      id: userProfile.id,
      email: userProfile.email,
      captureLevel: userProfile.capture_level,
      currentTier: userProfile.current_tier,
      engagementScore: userProfile.engagement_score,
      language: userProfile.language,
      entryPoint: userProfile.entry_point,
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error getting current user:', error);
    }
    return null
  }
}

// Progressive user registration
export interface ProgressiveRegistrationData {
  email: string
  phone?: string
  fullName?: string
  city?: string
  entryPoint?: string
  language?: 'en' | 'am'
}

export const createOrUpdateUser = async (
  level: 1 | 2 | 3,
  data: ProgressiveRegistrationData,
  sessionId: string
): Promise<{ user: UserSession; isNewUser: boolean } | null> => {
  const supabase = createClientComponentClient()
  
  try {
    // Check if user exists by email
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .single()

    let user: any
    let isNewUser = false

    if (existingUser) {
      // Update existing user with new capture level
      const updateData: any = {
        capture_level: Math.max(existingUser.capture_level, level),
        capture_timestamps: {
          ...existingUser.capture_timestamps,
          [`level${level}`]: new Date().toISOString()
        },
        last_activity: new Date().toISOString(),
      }

      if (level >= 2 && data.phone) updateData.phone = data.phone
      if (level >= 3) {
        if (data.fullName) updateData.full_name = data.fullName
        if (data.city) updateData.city = data.city
      }
      if (data.language) updateData.language = data.language

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', existingUser.id)
        .select()
        .single()

      if (error) throw error
      user = updatedUser
    } else {
      // Create new user
      const userData: any = {
        email: data.email,
        capture_level: level,
        capture_timestamps: {
          level1: level >= 1 ? new Date().toISOString() : null,
          level2: level >= 2 ? new Date().toISOString() : null,
          level3: level >= 3 ? new Date().toISOString() : null,
        },
        entry_point: data.entryPoint || 'direct',
        language: data.language || 'en',
        last_activity: new Date().toISOString(),
      }

      if (level >= 2 && data.phone) userData.phone = data.phone
      if (level >= 3) {
        if (data.fullName) userData.full_name = data.fullName
        if (data.city) userData.city = data.city
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (error) throw error
      user = newUser
      isNewUser = true
    }

    // Track the registration interaction
    await supabase.from('interactions').insert({
      user_id: user.id,
      session_id: sessionId,
      event_type: 'progressive_capture',
      event_data: {
        level,
        is_new_user: isNewUser,
        fields_captured: Object.keys(data),
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        captureLevel: user.capture_level,
        currentTier: user.current_tier,
        engagementScore: user.engagement_score,
        language: user.language,
        entryPoint: user.entry_point,
      },
      isNewUser,
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error creating/updating user:', error);
    }
    return null
  }
}

// Session tracking utilities
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return generateSessionId()
  
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// URL tracking for attribution (MEMBERID_POSTID format)
export const parseTrackingUrl = (url: string): { memberId?: string; postId?: string } => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    
    // Look for MEMBERID_POSTID pattern in URL
    const trackingMatch = pathname.match(/\/([A-Z0-9]+)_([A-Z0-9]+)(?:\/|$)/)
    
    if (trackingMatch) {
      return {
        memberId: trackingMatch[1],
        postId: trackingMatch[2],
      }
    }
    
    // Check query parameters as fallback
    const memberId = urlObj.searchParams.get('mid') || urlObj.searchParams.get('member')
    const postId = urlObj.searchParams.get('pid') || urlObj.searchParams.get('post')
    
    return {
      memberId: memberId || undefined,
      postId: postId || undefined,
    }
  } catch {
    return {}
  }
}

// Cookie-based attribution tracking (30-day)
export const setAttributionCookie = (memberId: string, postId: string) => {
  if (typeof document === 'undefined') return
  
  const attribution = { memberId, postId, timestamp: Date.now() }
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  
  document.cookie = `attribution=${JSON.stringify(attribution)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  
  // Backup in localStorage
  localStorage.setItem('attribution', JSON.stringify(attribution))
}

export const getAttributionData = (): { memberId?: string; postId?: string } | null => {
  if (typeof document === 'undefined') return null
  
  try {
    // Try cookie first
    const cookieMatch = document.cookie.match(/attribution=([^;]+)/)
    if (cookieMatch) {
      const attribution = JSON.parse(decodeURIComponent(cookieMatch[1]))
      // Check if within 30 days
      if (Date.now() - attribution.timestamp < 30 * 24 * 60 * 60 * 1000) {
        return { memberId: attribution.memberId, postId: attribution.postId }
      }
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('attribution')
    if (stored) {
      const attribution = JSON.parse(stored)
      if (Date.now() - attribution.timestamp < 30 * 24 * 60 * 60 * 1000) {
        return { memberId: attribution.memberId, postId: attribution.postId }
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error getting attribution data:', error);
    }
  }
  
  return null
}

// User tier detection and management
export const getUserTierFromScore = (score: number): 'browser' | 'engaged' | 'soft-member' => {
  if (score >= 70) return 'soft-member'
  if (score >= 30) return 'engaged'
  return 'browser'
}

export const getTierDisplayName = (tier: 'browser' | 'engaged' | 'soft-member'): string => {
  switch (tier) {
    case 'browser': return 'Explorer'
    case 'engaged': return 'Seeker'
    case 'soft-member': return 'Transformer'
    default: return 'Explorer'
  }
}

export const getTierColor = (tier: 'browser' | 'engaged' | 'soft-member'): string => {
  switch (tier) {
    case 'browser': return 'text-blue-600'
    case 'engaged': return 'text-green-600'
    case 'soft-member': return 'text-purple-600'
    default: return 'text-gray-600'
  }
}

// Authentication state management
export const signOut = async (): Promise<void> => {
  const supabase = createClientComponentClient()
  await supabase.auth.signOut()
  
  // Clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('session_id')
    localStorage.removeItem('attribution')
  }
}

// Auth object for admin routes
export const auth = {
  getSession: async () => {
    const supabase = createClientComponentClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }
    
    return session
  },
  
  isAdmin: async (userId: string): Promise<boolean> => {
    const supabase = createClientComponentClient()
    
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single()
      
      if (error || !userProfile) {
        return false
      }
      
      return userProfile.is_admin === true
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error checking admin status:', error);
      }
      return false
    }
  }
}