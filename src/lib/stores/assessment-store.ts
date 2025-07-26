import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AssessmentProgress {
  responses: Record<string, any>
  currentQuestionIndex: number
  lastUpdated: string
}

interface AssessmentStore {
  // Progress tracking
  progress: Record<string, AssessmentProgress>
  saveProgress: (toolId: string, progress: AssessmentProgress) => void
  loadProgress: (toolId: string) => AssessmentProgress | null
  clearProgress: (toolId: string) => void
  clearAllProgress: () => void
  
  // Completed assessments
  completedAssessments: string[]
  markAsCompleted: (toolId: string) => void
  isCompleted: (toolId: string) => boolean
  
  // Results caching
  results: Record<string, any>
  saveResults: (toolId: string, results: any) => void
  getResults: (toolId: string) => any | null
  clearResults: (toolId: string) => void
}

export const useAssessmentStore = create<AssessmentStore>(
  persist(
    (set, get) => ({
      // Progress tracking
      progress: {},
      
      saveProgress: (toolId, progress) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [toolId]: progress
          }
        }))
      },
      
      loadProgress: (toolId) => {
        return get().progress[toolId] || null
      },
      
      clearProgress: (toolId) => {
        set((state) => {
          const newProgress = { ...state.progress }
          delete newProgress[toolId]
          return { progress: newProgress }
        })
      },
      
      clearAllProgress: () => {
        set({ progress: {} })
      },
      
      // Completed assessments
      completedAssessments: [],
      
      markAsCompleted: (toolId) => {
        set((state) => ({
          completedAssessments: [...new Set([...state.completedAssessments, toolId])]
        }))
      },
      
      isCompleted: (toolId) => {
        return get().completedAssessments.includes(toolId)
      },
      
      // Results caching
      results: {},
      
      saveResults: (toolId, results) => {
        set((state) => ({
          results: {
            ...state.results,
            [toolId]: {
              ...results,
              savedAt: new Date().toISOString()
            }
          }
        }))
      },
      
      getResults: (toolId) => {
        return get().results[toolId] || null
      },
      
      clearResults: (toolId) => {
        set((state) => {
          const newResults = { ...state.results }
          delete newResults[toolId]
          return { results: newResults }
        })
      }
    }),
    {
      name: 'assessment-storage',
      partialize: (state) => ({
        progress: state.progress,
        completedAssessments: state.completedAssessments,
        results: state.results
      })
    }
  )
)