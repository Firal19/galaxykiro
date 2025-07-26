import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

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

// PQC Assessment Types
interface Answer {
  questionId: string;
  value: any;
  timeSpent: number;
  timestamp: Date;
  interactionQuality: number;
  responseTime: number;
}

interface PQCResult {
  overallScore: number;
  dimensionScores: Record<string, number>;
  insights: Insight[];
  recommendations: Recommendation[];
  percentile: number;
  potentialLevel: any;
  growthTrajectory: string;
  shareLink?: string;
  totalPoints: number;
  achievements: Achievement[];
}

interface Insight {
  type: 'strength' | 'opportunity' | 'pattern';
  title: string;
  description: string;
  icon: string;
}

interface Recommendation {
  type: 'priority' | 'quick_win' | 'development_plan' | 'resources';
  urgency: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions?: string[];
  timeRequired?: string;
  expectedImpact?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface EngagementMetrics {
  userEnergyLevel: number;
  averageResponseTime: number;
  interactionQuality: number;
  preferredInteractionTypes: string[];
  attentionSpan: number;
  fatigueLevel: number;
  engagementTrend: 'increasing' | 'decreasing' | 'stable';
}

type AssessmentStage = 'intro' | 'section-intro' | 'assessment' | 'energy-boost' | 'processing' | 'results';

interface PQCAssessmentState {
  sessionId: string;
  stage: AssessmentStage;
  currentQuestion: number;
  currentDimension: number;
  answers: Map<string, Answer>;
  result: PQCResult | null;
  startTime: Date | null;
  questionStartTime: Date | null;
  currentLanguage: 'en' | 'am';
  engagementMetrics: EngagementMetrics;
  adaptiveRecommendations: any[];
  lastBreakIndex: number;
  showAdaptiveMessage: string | null;
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
  
  // PQC Assessment state
  pqcAssessment: PQCAssessmentState
  setPQCStage: (stage: AssessmentStage) => void
  setPQCCurrentQuestion: (question: number) => void
  setPQCCurrentDimension: (dimension: number) => void
  addPQCAnswer: (questionId: string, answer: Answer) => void
  setPQCResult: (result: PQCResult) => void
  setPQCStartTime: (time: Date) => void
  setPQCQuestionStartTime: (time: Date) => void
  setPQCLanguage: (language: 'en' | 'am') => void
  updatePQCEngagementMetrics: (metrics: Partial<EngagementMetrics>) => void
  setPQCAdaptiveRecommendations: (recommendations: any[]) => void
  setPQCLastBreakIndex: (index: number) => void
  setPQCShowAdaptiveMessage: (message: string | null) => void
  resetPQCAssessment: () => void
  
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

// Server-side snapshot for SSR compatibility
const createServerSnapshot = () => ({
  user: null,
  leadScore: null,
  assessment: {
    responses: {},
    progress: 0,
    isCompleted: false,
  },
  pqcAssessment: {
    sessionId: 'ssr_session',
    stage: 'intro' as const,
    currentQuestion: 0,
    currentDimension: 0,
    answers: new Map(),
    result: null,
    startTime: null,
    questionStartTime: null,
    currentLanguage: 'en' as const,
    engagementMetrics: {
      userEnergyLevel: 100,
      averageResponseTime: 0,
      interactionQuality: 100,
      preferredInteractionTypes: [],
      attentionSpan: 100,
      fatigueLevel: 0,
      engagementTrend: 'stable' as const
    },
    adaptiveRecommendations: [],
    lastBreakIndex: -1,
    showAdaptiveMessage: null
  },
  journey: {
    sessionId: 'ssr_session',
    sectionsViewed: [],
    toolsUsed: [],
    contentConsumed: [],
    ctasClicked: [],
    timeOnPage: {},
    scrollDepth: 0,
  },
  isLoading: false,
  activeModal: null,
});

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
      
      // Initial PQC assessment state
      pqcAssessment: {
        sessionId: typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `pqc_session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        stage: 'intro',
        currentQuestion: 0,
        currentDimension: 0,
        answers: new Map(),
        result: null,
        startTime: null,
        questionStartTime: null,
        currentLanguage: 'en',
        engagementMetrics: {
          userEnergyLevel: 100,
          averageResponseTime: 0,
          interactionQuality: 100,
          preferredInteractionTypes: [],
          attentionSpan: 100,
          fatigueLevel: 0,
          engagementTrend: 'stable'
        },
        adaptiveRecommendations: [],
        lastBreakIndex: -1,
        showAdaptiveMessage: null
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
      
      // PQC Assessment actions
      setPQCStage: (stage) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, stage }
      })),
      setPQCCurrentQuestion: (currentQuestion) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, currentQuestion }
      })),
      setPQCCurrentDimension: (currentDimension) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, currentDimension }
      })),
      addPQCAnswer: (questionId, answer) => set((state) => {
        const newAnswers = new Map(state.pqcAssessment.answers);
        newAnswers.set(questionId, answer);
        return {
          pqcAssessment: { ...state.pqcAssessment, answers: newAnswers }
        };
      }),
      setPQCResult: (result) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, result }
      })),
      setPQCStartTime: (startTime) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, startTime }
      })),
      setPQCQuestionStartTime: (questionStartTime) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, questionStartTime }
      })),
      setPQCLanguage: (currentLanguage) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, currentLanguage }
      })),
      updatePQCEngagementMetrics: (metrics) => set((state) => ({
        pqcAssessment: { 
          ...state.pqcAssessment, 
          engagementMetrics: { ...state.pqcAssessment.engagementMetrics, ...metrics }
        }
      })),
      setPQCAdaptiveRecommendations: (adaptiveRecommendations) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, adaptiveRecommendations }
      })),
      setPQCLastBreakIndex: (lastBreakIndex) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, lastBreakIndex }
      })),
      setPQCShowAdaptiveMessage: (showAdaptiveMessage) => set((state) => ({
        pqcAssessment: { ...state.pqcAssessment, showAdaptiveMessage }
      })),
      resetPQCAssessment: () => set((state) => ({
        pqcAssessment: {
          sessionId: typeof crypto !== 'undefined' && crypto.randomUUID 
            ? crypto.randomUUID() 
            : `pqc_session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          stage: 'intro',
          currentQuestion: 0,
          currentDimension: 0,
          answers: new Map(),
          result: null,
          startTime: null,
          questionStartTime: null,
          currentLanguage: 'en',
          engagementMetrics: {
            userEnergyLevel: 100,
            averageResponseTime: 0,
            interactionQuality: 100,
            preferredInteractionTypes: [],
            attentionSpan: 100,
            fatigueLevel: 0,
            engagementTrend: 'stable'
          },
          adaptiveRecommendations: [],
          lastBreakIndex: -1,
          showAdaptiveMessage: null
        }
      })),
      
      // Initial journey state
      journey: {
        sessionId: typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
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
          const response = await fetch('/api/capture-user-info', {
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
          if (process.env.NODE_ENV !== 'production') {
            console.error('Error capturing user info:', error);
          }
          throw error;
        } finally {
          set({ isLoading: false })
        }
      },
      
      trackInteraction: async (eventType, eventData, pageUrl) => {
        const state = get()
        
        try {
          const response = await fetch('/api/track-interaction', {
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
          if (process.env.NODE_ENV !== 'production') {
            console.error('Error tracking interaction:', error);
          }
          // Don't throw error for tracking failures to avoid disrupting user experience
        }
      },
      
      updateEngagementScore: async () => {
        const state = get()
        
        if (!state.user?.id) {
          return
        }
        
        try {
          const response = await fetch('/api/update-engagement-score', {
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
          if (process.env.NODE_ENV !== 'production') {
            console.error('Error updating engagement score:', error);
          }
          throw error;
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
        pqcAssessment: {
          ...state.pqcAssessment,
          answers: Array.from(state.pqcAssessment.answers.entries()), // Convert Map to array for serialization
        }
      }),
      onRehydrateStorage: () => (state) => {
        // Rehydrate the Map from array
        if (state?.pqcAssessment && Array.isArray(state.pqcAssessment.answers)) {
          state.pqcAssessment.answers = new Map(state.pqcAssessment.answers);
        }
      },
      // SSR support - provide server snapshot
      skipHydration: typeof window === 'undefined'
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

// Stable selectors for PQC Assessment
const selectPQCAssessment = (state: AppState) => state.pqcAssessment;
const selectPQCStage = (state: AppState) => state.pqcAssessment.stage;
const selectPQCCurrentQuestion = (state: AppState) => state.pqcAssessment.currentQuestion;
const selectPQCCurrentDimension = (state: AppState) => state.pqcAssessment.currentDimension;
const selectPQCAnswers = (state: AppState) => state.pqcAssessment.answers;
const selectPQCResult = (state: AppState) => state.pqcAssessment.result;
const selectPQCEngagementMetrics = (state: AppState) => state.pqcAssessment.engagementMetrics;
const selectPQCAdaptiveRecommendations = (state: AppState) => state.pqcAssessment.adaptiveRecommendations;
const selectPQCShowAdaptiveMessage = (state: AppState) => state.pqcAssessment.showAdaptiveMessage;

// PQC Assessment selectors using stable functions
export const usePQCAssessment = () => useAppStore(selectPQCAssessment);
export const usePQCStage = () => useAppStore(selectPQCStage);
export const usePQCCurrentQuestion = () => useAppStore(selectPQCCurrentQuestion);
export const usePQCCurrentDimension = () => useAppStore(selectPQCCurrentDimension);
export const usePQCAnswers = () => useAppStore(selectPQCAnswers);
export const usePQCResult = () => useAppStore(selectPQCResult);
export const usePQCEngagementMetrics = () => useAppStore(selectPQCEngagementMetrics);
export const usePQCAdaptiveRecommendations = () => useAppStore(selectPQCAdaptiveRecommendations);
export const usePQCShowAdaptiveMessage = () => useAppStore(selectPQCShowAdaptiveMessage);

// Stable selector functions - memoized to prevent infinite loops
const selectPQCActions = (state: AppState) => {
  // Create a stable reference by using the actions directly
  return {
    setPQCStage: state.setPQCStage,
    setPQCCurrentQuestion: state.setPQCCurrentQuestion,
    setPQCCurrentDimension: state.setPQCCurrentDimension,
    addPQCAnswer: state.addPQCAnswer,
    setPQCResult: state.setPQCResult,
    setPQCStartTime: state.setPQCStartTime,
    setPQCQuestionStartTime: state.setPQCQuestionStartTime,
    setPQCLanguage: state.setPQCLanguage,
    updatePQCEngagementMetrics: state.updatePQCEngagementMetrics,
    setPQCAdaptiveRecommendations: state.setPQCAdaptiveRecommendations,
    setPQCLastBreakIndex: state.setPQCLastBreakIndex,
    setPQCShowAdaptiveMessage: state.setPQCShowAdaptiveMessage,
    resetPQCAssessment: state.resetPQCAssessment
  } as const;
};

// PQC Assessment actions - using Zustand's shallow equality to prevent infinite loops
export const usePQCActions = () => {
  return useAppStore(
    (state) => ({
      setPQCStage: state.setPQCStage,
      setPQCCurrentQuestion: state.setPQCCurrentQuestion,
      setPQCCurrentDimension: state.setPQCCurrentDimension,
      addPQCAnswer: state.addPQCAnswer,
      setPQCResult: state.setPQCResult,
      setPQCStartTime: state.setPQCStartTime,
      setPQCQuestionStartTime: state.setPQCQuestionStartTime,
      setPQCLanguage: state.setPQCLanguage,
      updatePQCEngagementMetrics: state.updatePQCEngagementMetrics,
      setPQCAdaptiveRecommendations: state.setPQCAdaptiveRecommendations,
      setPQCLastBreakIndex: state.setPQCLastBreakIndex,
      setPQCShowAdaptiveMessage: state.setPQCShowAdaptiveMessage,
      resetPQCAssessment: state.resetPQCAssessment
    }),
    shallow
  );
};

// Additional selectors for convenience
export const useUserTier = () => useAppStore((state) => state.user?.currentTier || 'browser')
export const useEngagementScore = () => useAppStore((state) => state.leadScore?.totalScore || 0)
export const useReadinessLevel = () => useAppStore((state) => state.leadScore?.readinessLevel || 'low')

// Stable computed selectors
const selectPQCProgress = (state: AppState) => {
  const totalQuestions = 49;
  return ((state.pqcAssessment.currentQuestion + 1) / totalQuestions) * 100;
};

const selectPQCSessionDuration = (state: AppState) => {
  if (!state.pqcAssessment.startTime) return 0;
  return Date.now() - state.pqcAssessment.startTime.getTime();
};

// PQC computed selectors using stable functions
export const usePQCProgress = () => useAppStore(selectPQCProgress);
export const usePQCTotalQuestions = () => 49;
export const usePQCAnswerForQuestion = (questionId: string) => 
  useAppStore((state) => state.pqcAssessment.answers.get(questionId));
export const usePQCSessionDuration = () => useAppStore(selectPQCSessionDuration);