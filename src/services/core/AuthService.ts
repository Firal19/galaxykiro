/**
 * AuthService - Complete Authentication Lifecycle Management
 * 
 * Handles user authentication, session management, and security
 */

import { IAuthService, AuthResult, SessionData, User } from '../interfaces'

export class AuthService implements IAuthService {
  private sessionKey = 'galaxy_kiro_session'
  private currentSession: SessionData | null = null

  constructor() {
    this.loadSession()
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Simulate API call - Replace with actual authentication
      await this.delay(800)

      // Demo authentication logic
      const isAdmin = email === 'admin@galaxykiro.com'
      const isValidUser = email.includes('@') && password.length > 0

      if (!isValidUser) {
        return {
          success: false,
          error: 'Invalid credentials'
        }
      }

      // Create user object
      const user: User = {
        id: this.generateUserId(),
        email,
        name: this.extractNameFromEmail(email),
        status: isAdmin ? 'hot_lead' : 'cold_lead',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Create session
      const session: SessionData = {
        userId: user.id,
        email: user.email,
        role: isAdmin ? 'admin' : 'soft_member',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }

      // Store session
      await this.storeSession(session)
      this.currentSession = session

      return {
        success: true,
        user,
        session
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      // Clear session storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.sessionKey)
        document.cookie = `${this.sessionKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }

      this.currentSession = null
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.currentSession) {
      return false
    }

    // Check if session is expired
    const expiresAt = new Date(this.currentSession.expiresAt)
    const now = new Date()

    if (now > expiresAt) {
      this.signOut()
      return false
    }

    return true
  }

  /**
   * Refresh current session
   */
  async refreshSession(): Promise<boolean> {
    if (!this.currentSession) {
      return false
    }

    try {
      // Extend session expiry
      const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      
      const refreshedSession: SessionData = {
        ...this.currentSession,
        expiresAt: newExpiresAt
      }

      await this.storeSession(refreshedSession)
      this.currentSession = refreshedSession

      return true
    } catch (error) {
      console.error('Session refresh error:', error)
      return false
    }
  }

  /**
   * Create demo session (for development bypass)
   */
  async createDemoSession(role: 'admin' | 'member'): Promise<AuthResult> {
    const email = role === 'admin' ? 'admin@galaxykiro.com' : 'demo@galaxykiro.com'
    return this.signIn(email, 'demo')
  }

  /**
   * Get user info from session
   */
  getCurrentUser(): User | null {
    if (!this.currentSession) {
      return null
    }

    return {
      id: this.currentSession.userId,
      email: this.currentSession.email,
      name: this.extractNameFromEmail(this.currentSession.email),
      status: 'hot_lead', // Default for authenticated users
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  /**
   * Load session from storage
   */
  private loadSession(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const stored = localStorage.getItem(this.sessionKey)
      if (stored) {
        const session = JSON.parse(stored) as SessionData
        
        // Validate session hasn't expired
        const expiresAt = new Date(session.expiresAt)
        const now = new Date()

        if (now <= expiresAt) {
          this.currentSession = session
        } else {
          // Clean up expired session
          localStorage.removeItem(this.sessionKey)
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      localStorage.removeItem(this.sessionKey)
    }
  }

  /**
   * Store session in localStorage and cookie
   */
  private async storeSession(session: SessionData): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Store in localStorage
      localStorage.setItem(this.sessionKey, JSON.stringify(session))

      // Store in cookie for middleware
      const cookieValue = JSON.stringify(session)
      const maxAge = 30 * 24 * 60 * 60 // 30 days in seconds
      document.cookie = `${this.sessionKey}=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Lax`
    } catch (error) {
      console.error('Failed to store session:', error)
      throw new Error('Session storage failed')
    }
  }

  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Extract name from email
   */
  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0]
    return localPart.charAt(0).toUpperCase() + localPart.slice(1)
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Health check
   */
  getHealth(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.currentSession = null
  }
}