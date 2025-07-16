import { supabase } from '../../lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface RealtimeSubscription {
  channel: RealtimeChannel
  unsubscribe: () => void
}

export interface UserEngagementUpdate {
  userId: string
  sessionId: string
  engagementType: string
  scoreIncrement: number
  newEngagementScore: number
  leadScore?: any
  tierChanged?: boolean
  newTier?: string
  previousTier?: string
  timestamp: string
}

export interface AssessmentUpdate {
  userId: string
  toolId: string
  toolName: string
  scores: Record<string, number>
  insights: Array<{ category: string; message: string; recommendation: string }>
  isCompleted: boolean
  leadScore?: any
  timestamp: string
}

export interface TierChangeNotification {
  userId: string
  userProfile: any
  previousTier: string
  newTier: string
  score: number
  message: string
  nextStep: string
  celebrationMessage: string
  timestamp: string
  actionRequired: boolean
}

export interface UserCaptureUpdate {
  userId: string
  captureLevel: number
  isNewUser: boolean
  leadScore?: any
  timestamp: string
}

export class RealtimeClient {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private userId?: string
  private sessionId?: string

  constructor(userId?: string, sessionId?: string) {
    this.userId = userId
    this.sessionId = sessionId
  }

  // Subscribe to user-specific engagement updates
  subscribeToUserEngagement(
    userId: string,
    onUpdate: (update: UserEngagementUpdate) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `user-engagement-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'engagement-score-updated' }, (payload) => {
        if (payload.payload.userId === userId) {
          onUpdate(payload.payload as UserEngagementUpdate)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to user engagement updates for ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to user engagement updates for ${userId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Subscribe to assessment completion updates
  subscribeToAssessmentUpdates(
    userId: string,
    onUpdate: (update: AssessmentUpdate) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `assessment-updates-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'assessment-processed' }, (payload) => {
        if (payload.payload.userId === userId) {
          onUpdate(payload.payload as AssessmentUpdate)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to assessment updates for ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to assessment updates for ${userId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Subscribe to tier change notifications
  subscribeToTierChanges(
    userId: string,
    onTierChange: (notification: TierChangeNotification) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `tier-changes-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'tier_change' }, (payload) => {
        if (payload.payload.userId === userId) {
          onTierChange(payload.payload as TierChangeNotification)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to tier changes for ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to tier changes for ${userId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Subscribe to user capture updates
  subscribeToUserCapture(
    userId: string,
    onUpdate: (update: UserCaptureUpdate) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `user-capture-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'user-capture-update' }, (payload) => {
        if (payload.payload.userId === userId) {
          onUpdate(payload.payload as UserCaptureUpdate)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to user capture updates for ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to user capture updates for ${userId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Subscribe to general notifications
  subscribeToNotifications(
    userId: string,
    onNotification: (notification: any) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `user-notifications-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: '*' }, (payload) => {
        // Handle all notification types
        onNotification(payload.payload)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to notifications for ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to notifications for ${userId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Subscribe to database changes (RLS-protected)
  subscribeToUserDataChanges(
    userId: string,
    onUserUpdate: (user: any) => void,
    onLeadScoreUpdate: (leadScore: any) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `user-data-${userId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          onUserUpdate(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_scores',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onLeadScoreUpdate(payload.new)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to user data changes for ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to user data changes for ${userId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Subscribe to session-based updates (for anonymous users)
  subscribeToSessionUpdates(
    sessionId: string,
    onUpdate: (update: any) => void,
    onError?: (error: any) => void
  ): RealtimeSubscription {
    const channelName = `session-${sessionId}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: '*' }, (payload) => {
        if (payload.payload.sessionId === sessionId) {
          onUpdate(payload.payload)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to session updates for ${sessionId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to session updates for ${sessionId}`)
          onError?.(status)
        }
      })

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        supabase.removeChannel(channel)
        this.subscriptions.delete(channelName)
      }
    }

    this.subscriptions.set(channelName, subscription)
    return subscription
  }

  // Utility methods for sending real-time updates
  async sendUserUpdate(userId: string, updateData: any): Promise<void> {
    const channel = supabase.channel('user-updates')
    await channel.send({
      type: 'broadcast',
      event: 'user-update',
      payload: {
        userId,
        ...updateData,
        timestamp: new Date().toISOString()
      }
    })
  }

  async sendEngagementUpdate(userId: string, sessionId: string, engagementData: any): Promise<void> {
    const channel = supabase.channel('engagement-updates')
    await channel.send({
      type: 'broadcast',
      event: 'engagement-update',
      payload: {
        userId,
        sessionId,
        ...engagementData,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Cleanup all subscriptions
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
    this.subscriptions.clear()
  }

  // Get active subscription count
  getActiveSubscriptionCount(): number {
    return this.subscriptions.size
  }

  // Get list of active channels
  getActiveChannels(): string[] {
    return Array.from(this.subscriptions.keys())
  }

  // Check if subscribed to a specific channel
  isSubscribedTo(channelName: string): boolean {
    return this.subscriptions.has(channelName)
  }

  // Update user context
  updateUserContext(userId: string, sessionId?: string): void {
    this.userId = userId
    if (sessionId) {
      this.sessionId = sessionId
    }
  }

  // Get current user context
  getUserContext(): { userId?: string; sessionId?: string } {
    return {
      userId: this.userId,
      sessionId: this.sessionId
    }
  }
}

// Export singleton instance
export const realtimeClient = new RealtimeClient()

// Export utility functions for common use cases
export const subscribeToUserEngagement = (
  userId: string,
  onUpdate: (update: UserEngagementUpdate) => void,
  onError?: (error: any) => void
) => realtimeClient.subscribeToUserEngagement(userId, onUpdate, onError)

export const subscribeToAssessmentUpdates = (
  userId: string,
  onUpdate: (update: AssessmentUpdate) => void,
  onError?: (error: any) => void
) => realtimeClient.subscribeToAssessmentUpdates(userId, onUpdate, onError)

export const subscribeToTierChanges = (
  userId: string,
  onTierChange: (notification: TierChangeNotification) => void,
  onError?: (error: any) => void
) => realtimeClient.subscribeToTierChanges(userId, onTierChange, onError)

export const subscribeToNotifications = (
  userId: string,
  onNotification: (notification: any) => void,
  onError?: (error: any) => void
) => realtimeClient.subscribeToNotifications(userId, onNotification, onError)