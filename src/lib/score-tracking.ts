import { useAppStore } from './store'

// Score-affecting action types
export type ScoreAction = 
  | 'page_view'
  | 'tool_start'
  | 'tool_complete'
  | 'content_download'
  | 'webinar_register'
  | 'cta_click'
  | 'session_extend'
  | 'scroll_depth'
  | 'form_submit'
  | 'video_complete'

export interface ScoreActionData {
  action: ScoreAction
  userId?: string
  metadata?: {
    toolId?: string
    contentId?: string
    webinarId?: string
    ctaId?: string
    scrollDepth?: number
    sessionDuration?: number
    pageUrl?: string
    [key: string]: any
  }
  timestamp?: Date
}

class ScoreTracker {
  private actionQueue: ScoreActionData[] = []
  private isProcessing = false
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly BATCH_SIZE = 10
  private readonly BATCH_DELAY = 5000 // 5 seconds

  /**
   * Track a score-affecting action
   */
  trackAction(actionData: ScoreActionData): void {
    const { user } = useAppStore.getState()
    
    if (!user?.id && !actionData.userId) {
      console.warn('Cannot track score action: no user ID available')
      return
    }

    const enrichedAction: ScoreActionData = {
      ...actionData,
      userId: actionData.userId || user?.id,
      timestamp: actionData.timestamp || new Date(),
      metadata: {
        ...actionData.metadata,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined
      }
    }

    // Add to queue
    this.actionQueue.push(enrichedAction)

    // Process queue if it reaches batch size
    if (this.actionQueue.length >= this.BATCH_SIZE) {
      this.processBatch()
    } else {
      // Set timeout to process remaining actions
      this.scheduleBatchProcessing()
    }

    // Also track in interactions table for immediate analytics
    this.trackInteraction(enrichedAction)
  }

  /**
   * Track multiple actions at once
   */
  trackActions(actions: ScoreActionData[]): void {
    actions.forEach(action => this.trackAction(action))
  }

  /**
   * Schedule batch processing
   */
  private scheduleBatchProcessing(): void {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
    }

    this.batchTimeout = setTimeout(() => {
      this.processBatch()
    }, this.BATCH_DELAY)
  }

  /**
   * Process queued actions in batch
   */
  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.actionQueue.length === 0) {
      return
    }

    this.isProcessing = true

    try {
      // Get actions to process
      const actionsToProcess = this.actionQueue.splice(0, this.BATCH_SIZE)
      
      // Group actions by user ID
      const actionsByUser = this.groupActionsByUser(actionsToProcess)

      // Update scores for each user
      const updatePromises = Object.keys(actionsByUser).map(userId => 
        this.updateUserScore(userId, actionsByUser[userId])
      )

      await Promise.allSettled(updatePromises)

    } catch (error) {
      console.error('Error processing score action batch:', error)
    } finally {
      this.isProcessing = false

      // Process remaining actions if any
      if (this.actionQueue.length > 0) {
        setTimeout(() => this.processBatch(), 1000)
      }
    }
  }

  /**
   * Group actions by user ID
   */
  private groupActionsByUser(actions: ScoreActionData[]): Record<string, ScoreActionData[]> {
    return actions.reduce((groups, action) => {
      const userId = action.userId!
      if (!groups[userId]) {
        groups[userId] = []
      }
      groups[userId].push(action)
      return groups
    }, {} as Record<string, ScoreActionData[]>)
  }

  /**
   * Update user score based on actions
   */
  private async updateUserScore(userId: string, actions: ScoreActionData[]): Promise<void> {
    try {
      // Check if any actions are significant enough to trigger score update
      const significantActions = actions.filter(action => 
        this.isSignificantAction(action.action)
      )

      if (significantActions.length === 0) {
        return
      }

      // Call the update lead score function
      const response = await fetch('/.netlify/functions/update-lead-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
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

      // If tier changed, dispatch event for UI updates
      if (result.tierChange) {
        this.dispatchTierChangeEvent(result.tierChange)
      }

    } catch (error) {
      console.error(`Error updating score for user ${userId}:`, error)
    }
  }

  /**
   * Check if action is significant enough to trigger score update
   */
  private isSignificantAction(action: ScoreAction): boolean {
    const significantActions: ScoreAction[] = [
      'tool_complete',
      'content_download',
      'webinar_register',
      'session_extend'
    ]

    return significantActions.includes(action)
  }

  /**
   * Track interaction in database for immediate analytics
   */
  private async trackInteraction(actionData: ScoreActionData): Promise<void> {
    try {
      await fetch('/.netlify/functions/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: actionData.userId,
          interactionType: actionData.action,
          metadata: actionData.metadata,
          timestamp: actionData.timestamp?.toISOString()
        })
      })
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }
  }

  /**
   * Dispatch tier change event for UI updates
   */
  private dispatchTierChangeEvent(tierChange: any): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('tierChanged', {
        detail: tierChange
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Force process all queued actions immediately
   */
  async flushQueue(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
      this.batchTimeout = null
    }

    while (this.actionQueue.length > 0) {
      await this.processBatch()
    }
  }

  /**
   * Get queue status for debugging
   */
  getQueueStatus(): {
    queueLength: number
    isProcessing: boolean
    hasPendingTimeout: boolean
  } {
    return {
      queueLength: this.actionQueue.length,
      isProcessing: this.isProcessing,
      hasPendingTimeout: this.batchTimeout !== null
    }
  }
}

// Create singleton instance
export const scoreTracker = new ScoreTracker()

// Convenience functions for common actions
export const trackPageView = (pageUrl?: string) => {
  scoreTracker.trackAction({
    action: 'page_view',
    metadata: { pageUrl }
  })
}

export const trackToolStart = (toolId: string) => {
  scoreTracker.trackAction({
    action: 'tool_start',
    metadata: { toolId }
  })
}

export const trackToolComplete = (toolId: string, results?: any) => {
  scoreTracker.trackAction({
    action: 'tool_complete',
    metadata: { toolId, results }
  })
}

export const trackContentDownload = (contentId: string, contentType?: string) => {
  scoreTracker.trackAction({
    action: 'content_download',
    metadata: { contentId, contentType }
  })
}

export const trackWebinarRegistration = (webinarId: string) => {
  scoreTracker.trackAction({
    action: 'webinar_register',
    metadata: { webinarId }
  })
}

export const trackCTAClick = (ctaId: string, ctaText?: string) => {
  scoreTracker.trackAction({
    action: 'cta_click',
    metadata: { ctaId, ctaText }
  })
}

export const trackScrollDepth = (scrollDepth: number) => {
  scoreTracker.trackAction({
    action: 'scroll_depth',
    metadata: { scrollDepth }
  })
}

export const trackSessionExtend = (sessionDuration: number) => {
  scoreTracker.trackAction({
    action: 'session_extend',
    metadata: { sessionDuration }
  })
}

export const trackFormSubmit = (formId: string, formData?: any) => {
  scoreTracker.trackAction({
    action: 'form_submit',
    metadata: { formId, formData }
  })
}

export const trackVideoComplete = (videoId: string, duration?: number) => {
  scoreTracker.trackAction({
    action: 'video_complete',
    metadata: { videoId, duration }
  })
}

// Auto-tracking setup for common browser events
export const setupAutoTracking = () => {
  if (typeof window === 'undefined') return

  // Track page views
  let currentPath = window.location.pathname
  const trackPageViewChange = () => {
    const newPath = window.location.pathname
    if (newPath !== currentPath) {
      currentPath = newPath
      trackPageView(window.location.href)
    }
  }

  // Listen for navigation changes
  window.addEventListener('popstate', trackPageViewChange)
  
  // Override pushState and replaceState to catch programmatic navigation
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function(...args) {
    originalPushState.apply(history, args)
    setTimeout(trackPageViewChange, 0)
  }

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args)
    setTimeout(trackPageViewChange, 0)
  }

  // Track scroll depth
  let maxScrollDepth = 0
  let scrollTimeout: NodeJS.Timeout | null = null

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent

      // Debounce scroll tracking
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        trackScrollDepth(maxScrollDepth)
      }, 1000)
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  // Track session duration
  const sessionStart = Date.now()
  const trackSessionDuration = () => {
    const duration = Math.round((Date.now() - sessionStart) / 1000)
    if (duration > 300) { // Only track sessions longer than 5 minutes
      trackSessionExtend(duration)
    }
  }

  // Track session on page unload
  window.addEventListener('beforeunload', trackSessionDuration)

  // Track session every 5 minutes for long sessions
  setInterval(() => {
    const duration = Math.round((Date.now() - sessionStart) / 1000)
    if (duration > 300 && duration % 300 === 0) { // Every 5 minutes after initial 5 minutes
      trackSessionExtend(duration)
    }
  }, 60000) // Check every minute

  // Flush queue on page unload
  window.addEventListener('beforeunload', () => {
    scoreTracker.flushQueue()
  })
}

// Initialize auto-tracking when module loads
if (typeof window !== 'undefined') {
  // Delay initialization to ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAutoTracking)
  } else {
    setupAutoTracking()
  }
}