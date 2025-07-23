/**
 * Realtime Client
 * 
 * Handles real-time communication and data synchronization
 * using WebSocket connections and event-driven architecture.
 */

import { supabase } from './supabase'

// Realtime event types
interface RealtimeEvent {
  id: string
  type: 'insert' | 'update' | 'delete'
  table: string
  record: Record<string, unknown>
  timestamp: Date
  userId?: string
}

interface RealtimeSubscription {
  id: string
  table: string
  event: string
  filter?: string
  callback: (payload: RealtimeEvent) => void
  active: boolean
  lastEvent?: Date
  eventCount: number
}

interface RealtimeMessage {
  type: 'event' | 'heartbeat' | 'error' | 'reconnect'
  payload?: RealtimeEvent
  timestamp: Date
  sessionId: string
}

interface RealtimeConnection {
  id: string
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastHeartbeat: Date
  reconnectAttempts: number
  maxReconnectAttempts: number
  reconnectDelay: number
}

interface RealtimeConfig {
  url: string
  heartbeatInterval: number
  reconnectDelay: number
  maxReconnectAttempts: number
  eventBufferSize: number
}

class RealtimeClient {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private connection: RealtimeConnection
  private config: RealtimeConfig
  private eventBuffer: RealtimeEvent[] = []
  private messageHandlers: Map<string, (message: RealtimeMessage) => void> = new Map()
  private reconnectTimer?: NodeJS.Timeout
  private heartbeatTimer?: NodeJS.Timeout

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      heartbeatInterval: 30000, // 30 seconds
      reconnectDelay: 1000, // 1 second
      maxReconnectAttempts: 5,
      eventBufferSize: 100
    }

    this.connection = {
      id: this.generateConnectionId(),
      status: 'disconnected',
      lastHeartbeat: new Date(),
      reconnectAttempts: 0,
      maxReconnectAttempts: this.config.maxReconnectAttempts,
      reconnectDelay: this.config.reconnectDelay
    }

    this.initializeMessageHandlers()
  }

  /**
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Initialize message handlers
   */
  private initializeMessageHandlers(): void {
    this.messageHandlers.set('event', this.handleEventMessage.bind(this))
    this.messageHandlers.set('heartbeat', this.handleHeartbeatMessage.bind(this))
    this.messageHandlers.set('error', this.handleErrorMessage.bind(this))
    this.messageHandlers.set('reconnect', this.handleReconnectMessage.bind(this))
  }

  /**
   * Connect to realtime service
   */
  async connect(): Promise<void> {
    try {
      this.connection.status = 'connecting'
      
      // Initialize Supabase realtime
      const channel = supabase.channel('realtime-client')
      
      // Subscribe to all active subscriptions
      this.subscriptions.forEach((subscription) => {
        if (subscription.active) {
          this.subscribeToTable(subscription.table, subscription.event, subscription.filter)
        }
      })

      this.connection.status = 'connected'
      this.connection.lastHeartbeat = new Date()
      this.connection.reconnectAttempts = 0

      // Start heartbeat
      this.startHeartbeat()

      if (process.env.NODE_ENV === 'development') {
        console.log('Realtime client connected successfully');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to connect to realtime service:', error);
      }
      this.connection.status = 'error'
      this.scheduleReconnect()
    }
  }

  /**
   * Disconnect from realtime service
   */
  async disconnect(): Promise<void> {
    try {
      this.connection.status = 'disconnected'
      
      // Clear timers
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer)
        this.heartbeatTimer = undefined
      }
      
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = undefined
      }

      // Unsubscribe from all channels
      await supabase.removeAllChannels()

      if (process.env.NODE_ENV === 'development') {
        console.log('Realtime client disconnected');
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error disconnecting from realtime service:', error);
      }
    }
  }

  /**
   * Subscribe to table changes
   */
  subscribeToTable(
    table: string,
    event: string,
    filter?: string,
    callback?: (payload: RealtimeEvent) => void
  ): string {
    const subscriptionId = this.generateSubscriptionId(table, event, filter)
    
    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      table,
      event,
      filter,
      callback: callback || this.defaultCallback.bind(this),
      active: true,
      eventCount: 0
    }

    this.subscriptions.set(subscriptionId, subscription)

    // Subscribe to Supabase realtime
    const channel = supabase.channel(subscriptionId)
    
    if (filter) {
      channel.on('postgres_changes', {
        event: event as 'INSERT' | 'UPDATE' | 'DELETE',
        schema: 'public',
        table: table,
        filter: filter
      }, (payload) => {
        this.handleRealtimeEvent(subscriptionId, payload)
      })
    } else {
      channel.on('postgres_changes', {
        event: event as 'INSERT' | 'UPDATE' | 'DELETE',
        schema: 'public',
        table: table
      }, (payload) => {
        this.handleRealtimeEvent(subscriptionId, payload)
      })
    }

    return subscriptionId
  }

  /**
   * Unsubscribe from table changes
   */
  unsubscribeFromTable(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId)
    
    if (!subscription) {
      return false
    }

    subscription.active = false
    this.subscriptions.delete(subscriptionId)

    // Unsubscribe from Supabase channel
    supabase.removeChannel(subscriptionId)

    return true
  }

  /**
   * Generate subscription ID
   */
  private generateSubscriptionId(table: string, event: string, filter?: string): string {
    const filterHash = filter ? `_${this.hashString(filter)}` : ''
    return `sub_${table}_${event}${filterHash}_${Date.now()}`
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Handle realtime event from Supabase
   */
  private handleRealtimeEvent(subscriptionId: string, payload: Record<string, unknown>): void {
    const subscription = this.subscriptions.get(subscriptionId)
    
    if (!subscription || !subscription.active) {
      return
    }

    const event: RealtimeEvent = {
      id: this.generateEventId(),
      type: payload.eventType as 'insert' | 'update' | 'delete',
      table: payload.table as string,
      record: payload.new || payload.old || {},
      timestamp: new Date(),
      userId: payload.userId as string
    }

    // Update subscription stats
    subscription.lastEvent = new Date()
    subscription.eventCount++

    // Add to buffer
    this.addToEventBuffer(event)

    // Call callback
    try {
      subscription.callback(event)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error in realtime event callback:', error);
      }
    }
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add event to buffer
   */
  private addToEventBuffer(event: RealtimeEvent): void {
    this.eventBuffer.push(event)
    
    // Keep buffer size manageable
    if (this.eventBuffer.length > this.config.eventBufferSize) {
      this.eventBuffer = this.eventBuffer.slice(-this.config.eventBufferSize)
    }
  }

  /**
   * Default callback for events
   */
  private defaultCallback(event: RealtimeEvent): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Realtime event received:', event);
    }
  }

  /**
   * Handle event message
   */
  private handleEventMessage(message: RealtimeMessage): void {
    if (message.payload) {
      this.addToEventBuffer(message.payload)
    }
  }

  /**
   * Handle heartbeat message
   */
  private handleHeartbeatMessage(message: RealtimeMessage): void {
    this.connection.lastHeartbeat = new Date()
  }

  /**
   * Handle error message
   */
  private handleErrorMessage(message: RealtimeMessage): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Realtime error:', message);
    }
    this.connection.status = 'error'
    this.scheduleReconnect()
  }

  /**
   * Handle reconnect message
   */
  private handleReconnectMessage(message: RealtimeMessage): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Realtime reconnect requested');
    }
    this.reconnect()
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat()
    }, this.config.heartbeatInterval)
  }

  /**
   * Send heartbeat
   */
  private sendHeartbeat(): void {
    const message: RealtimeMessage = {
      type: 'heartbeat',
      timestamp: new Date(),
      sessionId: this.connection.id
    }

    // In a real implementation, this would send to the server
    if (process.env.NODE_ENV === 'development') {
      console.log('Heartbeat sent:', message);
    }
  }

  /**
   * Schedule reconnect
   */
  private scheduleReconnect(): void {
    if (this.connection.reconnectAttempts >= this.connection.maxReconnectAttempts) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Max reconnect attempts reached');
      }
      return
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnect()
    }, this.connection.reconnectDelay * Math.pow(2, this.connection.reconnectAttempts))
  }

  /**
   * Reconnect to realtime service
   */
  private async reconnect(): Promise<void> {
    this.connection.reconnectAttempts++
    if (process.env.NODE_ENV === 'development') {
      console.log(`Reconnecting... Attempt ${this.connection.reconnectAttempts}`);
    }
    
    await this.disconnect()
    await this.connect()
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): RealtimeConnection['status'] {
    return this.connection.status
  }

  /**
   * Get active subscriptions
   */
  getActiveSubscriptions(): RealtimeSubscription[] {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active)
  }

  /**
   * Get event buffer
   */
  getEventBuffer(): RealtimeEvent[] {
    return [...this.eventBuffer]
  }

  /**
   * Clear event buffer
   */
  clearEventBuffer(): void {
    this.eventBuffer = []
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    status: RealtimeConnection['status']
    activeSubscriptions: number
    totalEvents: number
    lastHeartbeat: Date
    reconnectAttempts: number
  } {
    const totalEvents = Array.from(this.subscriptions.values())
      .reduce((sum, sub) => sum + sub.eventCount, 0)

    return {
      status: this.connection.status,
      activeSubscriptions: this.getActiveSubscriptions().length,
      totalEvents,
      lastHeartbeat: this.connection.lastHeartbeat,
      reconnectAttempts: this.connection.reconnectAttempts
    }
  }

  /**
   * Send custom message
   */
  sendMessage(type: string, payload?: Record<string, unknown>): void {
    const message: RealtimeMessage = {
      type: type as RealtimeMessage['type'],
      payload: payload as RealtimeEvent,
      timestamp: new Date(),
      sessionId: this.connection.id
    }

    // In a real implementation, this would send to the server
    if (process.env.NODE_ENV === 'development') {
      console.log('Message sent:', message);
    }
  }

  /**
   * Register message handler
   */
  onMessage(type: string, handler: (message: RealtimeMessage) => void): void {
    this.messageHandlers.set(type, handler)
  }

  /**
   * Remove message handler
   */
  offMessage(type: string): void {
    this.messageHandlers.delete(type)
  }
}

// Export singleton instance
export const realtimeClient = new RealtimeClient()

// Hook for React components
export function useRealtimeClient() {
  return {
    connect: () => realtimeClient.connect(),
    disconnect: () => realtimeClient.disconnect(),
    subscribeToTable: (
      table: string,
      event: string,
      filter?: string,
      callback?: (payload: RealtimeEvent) => void
    ) => realtimeClient.subscribeToTable(table, event, filter, callback),
    unsubscribeFromTable: (subscriptionId: string) => 
      realtimeClient.unsubscribeFromTable(subscriptionId),
    getConnectionStatus: () => realtimeClient.getConnectionStatus(),
    getActiveSubscriptions: () => realtimeClient.getActiveSubscriptions(),
    getEventBuffer: () => realtimeClient.getEventBuffer(),
    clearEventBuffer: () => realtimeClient.clearEventBuffer(),
    getConnectionStats: () => realtimeClient.getConnectionStats(),
    sendMessage: (type: string, payload?: Record<string, unknown>) => 
      realtimeClient.sendMessage(type, payload),
    onMessage: (type: string, handler: (message: RealtimeMessage) => void) => 
      realtimeClient.onMessage(type, handler),
    offMessage: (type: string) => realtimeClient.offMessage(type)
  }
}