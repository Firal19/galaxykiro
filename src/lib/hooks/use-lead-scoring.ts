import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../store'
import { ScoreBreakdown, TierChangeResult } from '../lead-scoring-engine'

interface LeadScoringState {
  score: number | null
  tier: 'browser' | 'engaged' | 'soft-member' | null
  readinessLevel: 'low' | 'medium' | 'high' | null
  scoreBreakdown: ScoreBreakdown | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

interface LeadScoringActions {
  updateScore: () => Promise<void>
  refreshScore: () => Promise<void>
  calculateScore: () => Promise<ScoreBreakdown | null>
}

interface UseLeadScoringReturn extends LeadScoringState, LeadScoringActions {
  hasRecentTierChange: boolean
  scoreIncrease: number
  canAccessTier: (requiredTier: 'browser' | 'engaged' | 'soft-member') => boolean
}

export function useLeadScoring(userId?: string): UseLeadScoringReturn {
  const { user } = useAppStore()
  const currentUserId = userId || user?.id

  const [state, setState] = useState<LeadScoringState>({
    score: null,
    tier: null,
    readinessLevel: null,
    scoreBreakdown: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  })

  const [hasRecentTierChange, setHasRecentTierChange] = useState(false)
  const [scoreIncrease, setScoreIncrease] = useState(0)

  // Calculate score without updating database
  const calculateScore = useCallback(async (): Promise<ScoreBreakdown | null> => {
    if (!currentUserId) return null

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch('/.netlify/functions/lead-scoring-analytics/calculate-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUserId })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to calculate score')
      }

      const { scoreBreakdown, tier, readinessLevel } = result.data

      setState(prev => ({
        ...prev,
        score: scoreBreakdown.totalScore,
        tier,
        readinessLevel,
        scoreBreakdown,
        isLoading: false,
        lastUpdated: new Date()
      }))

      return scoreBreakdown
    } catch (error) {
      console.error('Error calculating lead score:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to calculate score'
      }))
      return null
    }
  }, [currentUserId])

  // Update score in database and trigger sequences
  const updateScore = useCallback(async (): Promise<void> => {
    if (!currentUserId) return

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch('/.netlify/functions/update-lead-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: currentUserId,
          triggerSequences: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update score')
      }

      // If there was a tier change, update state accordingly
      if (result.tierChange) {
        const tierChange: TierChangeResult = result.tierChange
        
        setState(prev => ({
          ...prev,
          score: tierChange.totalScore,
          tier: tierChange.newTier,
          readinessLevel: tierChange.totalScore >= 70 ? 'high' : 
                         tierChange.totalScore >= 30 ? 'medium' : 'low',
          isLoading: false,
          lastUpdated: new Date()
        }))

        setHasRecentTierChange(true)
        setScoreIncrease(tierChange.scoreIncrease)

        // Reset tier change flag after 5 minutes
        setTimeout(() => {
          setHasRecentTierChange(false)
          setScoreIncrease(0)
        }, 5 * 60 * 1000)

        // Update user tier in store
        useAppStore.getState().updateUser({
          current_tier: tierChange.newTier
        })
      } else {
        // No tier change, just refresh the score
        await calculateScore()
      }
    } catch (error) {
      console.error('Error updating lead score:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update score'
      }))
    }
  }, [currentUserId, calculateScore])

  // Refresh score from database
  const refreshScore = useCallback(async (): Promise<void> => {
    await calculateScore()
  }, [calculateScore])

  // Check if user can access a specific tier
  const canAccessTier = useCallback((requiredTier: 'browser' | 'engaged' | 'soft-member'): boolean => {
    if (!state.tier) return false

    const tierLevels = { browser: 1, engaged: 2, 'soft-member': 3 }
    const userTierLevel = tierLevels[state.tier]
    const requiredTierLevel = tierLevels[requiredTier]
    
    return userTierLevel >= requiredTierLevel
  }, [state.tier])

  // Auto-update score when user performs significant actions
  useEffect(() => {
    if (!currentUserId) return

    const handleUserAction = (event: CustomEvent) => {
      const { type, data } = event.detail

      // Update score for significant actions
      const significantActions = [
        'tool_completed',
        'content_downloaded',
        'webinar_registered',
        'cta_clicked_multiple',
        'session_extended'
      ]

      if (significantActions.includes(type)) {
        // Debounce updates to avoid too frequent calls
        const lastUpdate = state.lastUpdated
        const now = new Date()
        
        if (!lastUpdate || (now.getTime() - lastUpdate.getTime()) > 60000) { // 1 minute
          updateScore()
        }
      }
    }

    // Listen for user action events
    window.addEventListener('userAction', handleUserAction as EventListener)

    return () => {
      window.removeEventListener('userAction', handleUserAction as EventListener)
    }
  }, [currentUserId, updateScore, state.lastUpdated])

  // Initial score calculation
  useEffect(() => {
    if (currentUserId && !state.score && !state.isLoading) {
      calculateScore()
    }
  }, [currentUserId, state.score, state.isLoading, calculateScore])

  return {
    ...state,
    hasRecentTierChange,
    scoreIncrease,
    updateScore,
    refreshScore,
    calculateScore,
    canAccessTier
  }
}

// Helper hook for triggering score updates from components
export function useScoreUpdater() {
  const triggerScoreUpdate = useCallback((actionType: string, actionData?: any) => {
    // Dispatch custom event that useLeadScoring will listen to
    const event = new CustomEvent('userAction', {
      detail: {
        type: actionType,
        data: actionData,
        timestamp: new Date().toISOString()
      }
    })
    
    window.dispatchEvent(event)
  }, [])

  return { triggerScoreUpdate }
}

// Helper hook for score-based personalization
export function useScorePersonalization() {
  const { tier, score, readinessLevel, canAccessTier } = useLeadScoring()

  const getPersonalizedCTA = useCallback((baseCTA: string): string => {
    if (!tier || !score) return baseCTA

    switch (tier) {
      case 'soft-member':
        return baseCTA.replace(/Get|Try|Start/, 'Unlock Advanced')
      case 'engaged':
        return baseCTA.replace(/Get|Try|Start/, 'Access Premium')
      default:
        return baseCTA
    }
  }, [tier, score])

  const getPersonalizedContent = useCallback((contentType: 'tools' | 'content' | 'webinars'): string[] => {
    if (!tier) return []

    const contentMap = {
      'soft-member': {
        tools: ['Advanced Assessment Suite', 'Personal Development Planner', 'Goal Achievement Tracker'],
        content: ['Exclusive Research Reports', 'Premium Video Series', 'Expert Interviews'],
        webinars: ['VIP Masterclasses', 'One-on-One Sessions', 'Group Coaching']
      },
      'engaged': {
        tools: ['Comprehensive Assessments', 'Progress Trackers', 'Habit Builders'],
        content: ['In-Depth Guides', 'Video Tutorials', 'Case Studies'],
        webinars: ['Live Training Sessions', 'Q&A Webinars', 'Skill Workshops']
      },
      'browser': {
        tools: ['Quick Assessments', 'Basic Calculators', 'Simple Quizzes'],
        content: ['Blog Posts', 'Quick Tips', 'Introduction Guides'],
        webinars: ['Free Introductory Sessions', 'Overview Presentations', 'Getting Started']
      }
    }

    return contentMap[tier][contentType] || []
  }, [tier])

  const shouldShowFeature = useCallback((requiredTier: 'browser' | 'engaged' | 'soft-member'): boolean => {
    return canAccessTier(requiredTier)
  }, [canAccessTier])

  return {
    tier,
    score,
    readinessLevel,
    getPersonalizedCTA,
    getPersonalizedContent,
    shouldShowFeature,
    canAccessTier
  }
}