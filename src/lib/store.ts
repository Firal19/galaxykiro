import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// User state interface
interface User {
  id?: string
  email?: string
  phone?: string
  fullName?: string
  city?: string
  captureLevel: 1 | 2 | 3
  captureTimestamps?: Record<string, string | null>
  engagementScore: number
  readinessIndicator: number
  currentTier: 'browser' | 'engaged' | 'soft-member'
  entryPoint?: string
  language: 'en' | 'am'
  lastActivity?: string
  communicationPreferences?: Record<string, unknown>
}

// Lead score state interface
interface LeadScore {
  totalScore: number
  tier: 'browser' | 'engaged' | 'soft-member'
  scoreBreakdown: Record<string, number>
  readinessLevel: 'low' | 'medium' | 'high'
  tierChanged?: boolean
}

// Assessment state interface
interface AssessmentState {
  currentTool?: string
  responses: Record<string, unknown>
  progress: number
  isCompleted: boolean
}

// User journey tracking interface
interface UserJourney {
  sessionId: string
  sectionsViewed: string[]
  toolsUsed: string[]
  contentConsumed: string[]
  ctasClicked: string[]
  timeOnPage: Record<string, number>
  scrollDepth: number
}

// Main store interface
interface AppState {
  // User state
  user: User | null
  leadScore: LeadScore | null
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  setLeadScore: (leadScore: LeadScore | null) => void
  
  // Assessment state
  assessment: AssessmentState
  setCurrentTool: (toolName: string) => void
  updateAssessmentResponse: (questionId: string, response: unknown) => void
  setAssessmentProgress: (progress: number) => void
  completeAssessment: () => void
  resetAssessment: () => void
  
  // User journey tracking
  journey: UserJourney
  trackSectionView: (sectionId: string) => void
  trackToolUsage: (toolName: string) => void
  trackContentConsumption: (contentId: string) => void
  trackCTAClick: (ctaId: string) => void
  updateTimeOnPage: (pageId: string, time: number) => void
  updateScrollDepth: (depth: number) => void
  
  // API methods for progressive capture
  captureUserInfo: (level: 1 | 2 | 3, data: unknown, entryPoint?: string) => Promise<void>
  trackInteraction: (eventType: string, eventData?: unknown, pageUrl?: string) => Promise<void>
  updateEngagementScore: () => Promise<void>
  
  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // Modal state
  activeModal: string | null
  setActiveModal: (modalId: string | null) => void
}

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial user state
      user: null,
      leadScore: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      setLeadScore: (leadScore) => set({ leadScore }),
      
      // Initial assessment state
      assessment: {
        responses: {},
        progress: 0,
        isCompleted: false,
      },
      setCurrentTool: (toolName) => set((state) => ({
        assessment: { ...state.assessment, currentTool: toolName }
      })),
      updateAssessmentResponse: (questionId, response) => set((state) => ({
        assessment: {
          ...state.assessment,
          responses: { ...state.assessment.responses, [questionId]: response }
        }
      })),
      setAssessmentProgress: (progress) => set((state) => ({
        assessment: { ...state.assessment, progress }
      })),
      completeAssessment: () => set((state) => ({
        assessment: { ...state.assessment, isCompleted: true, progress: 100 }
      })),
      resetAssessment: () => set({
        assessment: {
          responses: {},
          progress: 0,
          isCompleted: false,
        }
      }),
      
      // Initial journey state
      journey: {
        sessionId: crypto.randomUUID(),
        sectionsViewed: [],
        toolsUsed: [],
        contentConsumed: [],
        ctasClicked: [],
        timeOnPage: {},
        scrollDepth: 0,
      },
      trackSectionView: (sectionId) => set((state) => ({
        journey: {
          ...state.journey,
          sectionsViewed: [...new Set([...state.journey.sectionsViewed, sectionId])]
        }
      })),
      trackToolUsage: (toolName) => set((state) => ({
        journey: {
          ...state.journey,
          toolsUsed: [...new Set([...state.journey.toolsUsed, toolName])]
        }
      })),
      trackContentConsumption: (contentId) => set((state) => ({
        journey: {
          ...state.journey,
          contentConsumed: [...new Set([...state.journey.contentConsumed, contentId])]
        }
      })),
      trackCTAClick: (ctaId) => set((state) => ({
        journey: {
          ...state.journey,
          ctasClicked: [...state.journey.ctasClicked, ctaId]
        }
      })),
      updateTimeOnPage: (pageId, time) => set((state) => ({
        journey: {
          ...state.journey,
          timeOnPage: { ...state.journey.timeOnPage, [pageId]: time }
        }
      })),
      updateScrollDepth: (depth) => set((state) => ({
        journey: {
          ...state.journey,
          scrollDepth: Math.max(state.journey.scrollDepth, depth)
        }
      })),
      
      // API methods for progressive capture
      captureUserInfo: async (level, data, entryPoint) => {
        const state = get()
        set({ isLoading: true })
        
        try {
          const response = await fetch('/.netlify/functions/capture-user-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              level,
              data,
              userId: state.user?.id,
              sessionId: state.journey.sessionId,
              entryPoint,
            }),
          })
          
          if (!response.ok) {
            throw new Error('Failed to capture user info')
          }
          
          const result = await response.json()
          
          if (result.success && result.data.user) {
            set({
              user: {
                id: result.data.user.id,
                email: result.data.user.email,
                phone: result.data.user.phone,
                fullName: result.data.user.fullName,
                city: result.data.user.city,
                captureLevel: result.data.user.captureLevel,
                captureTimestamps: result.data.user.captureTimestamps,
                engagementScore: result.data.user.engagementScore,
                readinessIndicator: result.data.user.readinessIndicator,
                currentTier: result.data.user.currentTier,
                entryPoint: result.data.user.entryPoint,
                language: result.data.user.language,
                lastActivity: result.data.user.lastActivity,
                communicationPreferences: result.data.user.communicationPreferences,
              }
            })
            
            if (result.data.leadScore) {
              set({
                leadScore: {
                  totalScore: result.data.leadScore.totalScore,
                  tier: result.data.leadScore.tier,
                  scoreBreakdown: result.data.leadScore.scoreBreakdown,
                  readinessLevel: result.data.leadScore.readinessLevel,
                  tierChanged: result.data.leadScore.hasRecentTierChange,
                }
              })
            }
          }
        } catch (error) {
          console.error('Error capturing user info:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
      
      trackInteraction: async (eventType, eventData, pageUrl) => {
        const state = get()
        
        try {
          const response = await fetch('/.netlify/functions/track-interaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventType,
              eventData,
              sessionId: state.journey.sessionId,
              userId: state.user?.id,
              pageUrl: pageUrl || window.location.href,
              referrer: document.referrer,
              userAgent: navigator.userAgent,
            }),
          })
          
          if (!response.ok) {
            throw new Error('Failed to track interaction')
          }
          
          const result = await response.json()
          
          // Update lead score if returned
          if (result.data.leadScore) {
            set({
              leadScore: {
                totalScore: result.data.leadScore.totalScore,
                tier: result.data.leadScore.tier,
                scoreBreakdown: result.data.leadScore.scoreBreakdown,
                readinessLevel: result.data.leadScore.readinessLevel,
                tierChanged: result.data.leadScore.hasRecentTierChange,
              }
            })
          }
        } catch (error) {
          console.error('Error tracking interaction:', error)
          // Don't throw error for tracking failures to avoid disrupting user experience
        }
      },
      
      updateEngagementScore: async () => {
        const state = get()
        
        if (!state.user?.id) {
          return
        }
        
        try {
          const response = await fetch('/.netlify/functions/update-engagement-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: state.user.id,
            }),
          })
          
          if (!response.ok) {
            throw new Error('Failed to update engagement score')
          }
          
          const result = await response.json()
          
          if (result.success && result.data.user) {
            set({
              user: {
                ...state.user,
                engagementScore: result.data.user.engagementScore,
                readinessIndicator: result.data.user.readinessIndicator,
                currentTier: result.data.user.currentTier,
                lastActivity: result.data.user.lastActivity,
              }
            })
            
            if (result.data.leadScore) {
              set({
                leadScore: {
                  totalScore: result.data.leadScore.totalScore,
                  tier: result.data.leadScore.tier,
                  scoreBreakdown: result.data.leadScore.scoreBreakdown,
                  readinessLevel: result.data.leadScore.readinessLevel,
                  tierChanged: result.data.changes.tierChanged,
                }
              })
            }
          }
        } catch (error) {
          console.error('Error updating engagement score:', error)
          throw error
        }
      },
      
      // Initial UI state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Initial modal state
      activeModal: null,
      setActiveModal: (modalId) => set({ activeModal: modalId }),
    }),
    {
      name: 'galaxy-dream-store',
      partialize: (state) => ({
        user: state.user,
        assessment: state.assessment,
        journey: state.journey,
      }),
    }
  )
)

// Selectors for common state access patterns
export const useUser = () => useAppStore((state) => state.user)
export const useLeadScore = () => useAppStore((state) => state.leadScore)
export const useAssessment = () => useAppStore((state) => state.assessment)
export const useJourney = () => useAppStore((state) => state.journey)
export const useUI = () => useAppStore((state) => ({
  isLoading: state.isLoading,
  activeModal: state.activeModal,
}))

// Additional selectors for convenience
export const useUserTier = () => useAppStore((state) => state.user?.currentTier || 'browser')
export const useEngagementScore = () => useAppStore((state) => state.leadScore?.totalScore || 0)
export const useReadinessLevel = () => useAppStore((state) => state.leadScore?.readinessLevel || 'low')