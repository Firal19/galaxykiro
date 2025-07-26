'use client'

import { QueryClient } from '@tanstack/react-query'

// Create a client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes  
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry for client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for critical data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 2000,
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Admin queries
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    leads: ['admin', 'leads'] as const,
    lead: (id: string) => ['admin', 'leads', id] as const,
    analytics: (timeRange: string) => ['admin', 'analytics', timeRange] as const,
    activity: ['admin', 'activity'] as const,
    users: ['admin', 'users'] as const,
    content: ['admin', 'content'] as const,
  },
  // Assessment queries
  assessments: {
    tools: ['assessments', 'tools'] as const,
    tool: (id: string) => ['assessments', 'tools', id] as const,
    results: (toolId: string, userId?: string) => 
      ['assessments', 'results', toolId, userId] as const,
    progress: (toolId: string, userId?: string) => 
      ['assessments', 'progress', toolId, userId] as const,
  },
  // User queries
  user: {
    profile: ['user', 'profile'] as const,
    settings: ['user', 'settings'] as const,
    activity: ['user', 'activity'] as const,
  },
  // Content queries
  content: {
    posts: ['content', 'posts'] as const,
    post: (id: string) => ['content', 'posts', id] as const,
    pages: ['content', 'pages'] as const,
  },
} as const

// Type helpers for query keys
export type QueryKey = typeof queryKeys[keyof typeof queryKeys]
export type AdminQueryKey = typeof queryKeys.admin[keyof typeof queryKeys.admin]
export type AssessmentQueryKey = typeof queryKeys.assessments[keyof typeof queryKeys.assessments]