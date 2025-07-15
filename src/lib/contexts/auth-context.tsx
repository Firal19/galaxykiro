'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, AuthSession } from '../auth'
import { UserModel } from '../models/user'
import { trackingService } from '../tracking'

interface AuthContextType {
  user: UserModel | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  captureLevel: number
  userTier: 'browser' | 'engaged' | 'soft-member'
  canAccessLevel: (level: 1 | 2 | 3) => boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserModel | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Get current session
      const currentSession = await authService.getSession()
      setSession(currentSession)

      if (currentSession) {
        // Get current user
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)

        // Update tracking with user ID
        if (currentUser) {
          trackingService.updateSessionWithUser(currentUser.id)
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setSession(null)
      
      // Clear tracking data
      trackingService.clearTrackingData()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const canAccessLevel = (level: 1 | 2 | 3): boolean => {
    return user ? user.canAccessLevel(level) : false
  }

  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    captureLevel: user?.captureLevel || 1,
    userTier: user?.currentTier || 'browser',
    canAccessLevel,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Custom hooks for specific auth checks
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to sign in
      window.location.href = '/auth/signin?returnTo=' + encodeURIComponent(window.location.pathname)
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}

export function useRequireLevel(requiredLevel: 1 | 2 | 3) {
  const { user, canAccessLevel, isLoading } = useAuth()
  
  const hasAccess = canAccessLevel(requiredLevel)
  
  useEffect(() => {
    if (!isLoading && user && !hasAccess) {
      // Redirect to capture page
      window.location.href = `/auth/capture?level=${requiredLevel}&returnTo=` + encodeURIComponent(window.location.pathname)
    }
  }, [user, hasAccess, isLoading, requiredLevel])

  return { hasAccess, isLoading, currentLevel: user?.captureLevel || 1 }
}

export function useRequireTier(requiredTier: 'engaged' | 'soft-member') {
  const { user, userTier, isLoading } = useAuth()
  
  const hasAccess = userTier === requiredTier || (requiredTier === 'engaged' && userTier === 'soft-member')
  
  useEffect(() => {
    if (!isLoading && user && !hasAccess) {
      // Redirect to upgrade page
      window.location.href = `/upgrade?tier=${requiredTier}&returnTo=` + encodeURIComponent(window.location.pathname)
    }
  }, [user, hasAccess, isLoading, requiredTier])

  return { hasAccess, isLoading, currentTier: userTier }
}