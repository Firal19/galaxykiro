/**
 * Network Hub Service
 * Based on Galaxy Dream Team Master Project Plan
 * Implements direct messaging and networking for hot leads
 */

import { leadScoringService, VisitorStatus } from './lead-scoring-service'

export type MessageType = 'text' | 'audio' | 'video' | 'file' | 'system'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'
export type ConversationType = 'direct' | 'group' | 'broadcast' | 'support'
export type UserRole = 'hot_lead' | 'mentor' | 'admin' | 'coach'

export interface NetworkUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen: string
  visitorStatus: VisitorStatus
  
  // Profile Info
  bio?: string
  location?: string
  timezone: string
  joinedAt: string
  
  // Networking Stats
  connectionsCount: number
  messagesCount: number
  engagementLevel: number
  
  // Preferences
  isAvailableForMentoring: boolean
  communicationPreferences: {
    allowDirectMessages: boolean
    allowGroupInvites: boolean
    allowVoiceCalls: boolean
    allowVideoCall: boolean
    quietHours: {
      start: string
      end: string
    }
  }
  
  // Verification
  isVerified: boolean
  badgeLevel: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId?: string
  type: MessageType
  content: string
  metadata?: {
    fileName?: string
    fileSize?: number
    duration?: number // for audio/video
    thumbnail?: string
    originalMessage?: string // for replies
  }
  
  status: MessageStatus
  timestamp: string
  editedAt?: string
  
  // Reactions and engagement
  reactions: MessageReaction[]
  isImportant: boolean
  isPinned: boolean
  
  // Threading
  threadId?: string
  replyCount: number
}

export interface MessageReaction {
  userId: string
  emoji: string
  timestamp: string
}

export interface Conversation {
  id: string
  type: ConversationType
  title?: string
  description?: string
  
  // Participants
  participants: string[] // user IDs
  admins: string[] // user IDs with admin rights
  createdBy: string
  
  // Settings
  isArchived: boolean
  isMuted: boolean
  allowNewMembers: boolean
  requireApproval: boolean
  
  // Content
  lastMessage?: Message
  messageCount: number
  unreadCount: number
  
  // Metadata
  createdAt: string
  updatedAt: string
  
  // Group specific
  groupSettings?: {
    maxMembers: number
    isPublic: boolean
    tags: string[]
    category: 'general' | 'accountability' | 'mastermind' | 'support' | 'project'
  }
}

export interface NetworkConnection {
  id: string
  userId: string
  connectedUserId: string
  status: 'pending' | 'accepted' | 'blocked'
  connectionType: 'peer' | 'mentor' | 'mentee' | 'accountability'
  
  requestMessage?: string
  connectedAt: string
  
  // Interaction stats
  messagesExchanged: number
  lastInteraction: string
  connectionStrength: number // 0-100
  
  // Connection context
  sharedInterests: string[]
  meetingHistory: Array<{
    date: string
    type: 'video' | 'audio' | 'text'
    duration: number
    notes?: string
  }>
}

export interface NetworkActivity {
  id: string
  userId: string
  type: 'message_sent' | 'connection_made' | 'group_joined' | 'achievement_unlocked' | 'content_shared'
  description: string
  timestamp: string
  isPublic: boolean
  
  metadata?: {
    targetUserId?: string
    conversationId?: string
    achievementId?: string
    contentId?: string
  }
}

class NetworkHubService {
  private static instance: NetworkHubService
  private users: Map<string, NetworkUser> = new Map()
  private conversations: Map<string, Conversation> = new Map()
  private messages: Map<string, Message[]> = new Map()
  private connections: Map<string, NetworkConnection[]> = new Map()
  private activities: NetworkActivity[] = []

  private constructor() {
    this.initializeMockData()
  }

  public static getInstance(): NetworkHubService {
    if (!NetworkHubService.instance) {
      NetworkHubService.instance = new NetworkHubService()
    }
    return NetworkHubService.instance
  }

  /**
   * Initialize mock data for demonstration
   */
  private initializeMockData(): void {
    // Mock users
    const mockUsers: NetworkUser[] = [
      {
        id: 'user_mentor_1',
        name: 'Sarah Tesfaye',
        email: 'sarah@example.com',
        avatar: '/avatars/sarah.jpg',
        role: 'mentor',
        status: 'online',
        lastSeen: new Date().toISOString(),
        visitorStatus: 'hot_lead',
        bio: 'Transformation coach specializing in mindset shifts. Helped 200+ people unlock their potential.',
        location: 'Addis Ababa, Ethiopia',
        timezone: 'Africa/Addis_Ababa',
        joinedAt: '2024-01-01T00:00:00Z',
        connectionsCount: 45,
        messagesCount: 1250,
        engagementLevel: 95,
        isAvailableForMentoring: true,
        communicationPreferences: {
          allowDirectMessages: true,
          allowGroupInvites: true,
          allowVoiceCalls: true,
          allowVideoCall: true,
          quietHours: { start: '22:00', end: '07:00' }
        },
        isVerified: true,
        badgeLevel: 'gold'
      },
      {
        id: 'user_hotlead_1',
        name: 'Daniel Mulugeta',
        email: 'daniel@example.com',
        role: 'hot_lead',
        status: 'online',
        lastSeen: new Date().toISOString(),
        visitorStatus: 'hot_lead',
        bio: 'Entrepreneur building the next generation of African businesses.',
        location: 'Nairobi, Kenya',
        timezone: 'Africa/Nairobi',
        joinedAt: '2024-01-10T00:00:00Z',
        connectionsCount: 12,
        messagesCount: 150,
        engagementLevel: 88,
        isAvailableForMentoring: false,
        communicationPreferences: {
          allowDirectMessages: true,
          allowGroupInvites: true,
          allowVoiceCalls: false,
          allowVideoCall: true,
          quietHours: { start: '23:00', end: '06:00' }
        },
        isVerified: true,
        badgeLevel: 'silver'
      }
    ]

    mockUsers.forEach(user => this.users.set(user.id, user))

    // Mock conversation
    const mockConversation: Conversation = {
      id: 'conv_mentorship_1',
      type: 'direct',
      participants: ['user_mentor_1', 'user_hotlead_1'],
      admins: [],
      createdBy: 'user_hotlead_1',
      isArchived: false,
      isMuted: false,
      allowNewMembers: false,
      requireApproval: false,
      messageCount: 8,
      unreadCount: 2,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString()
    }

    this.conversations.set(mockConversation.id, mockConversation)

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: 'msg_1',
        conversationId: 'conv_mentorship_1',
        senderId: 'user_hotlead_1',
        receiverId: 'user_mentor_1',
        type: 'text',
        content: 'Hi Sarah! I saw your profile and would love to connect. I\'m working on scaling my business and could use guidance.',
        status: 'read',
        timestamp: '2024-01-15T10:00:00Z',
        reactions: [],
        isImportant: false,
        isPinned: false,
        replyCount: 0
      },
      {
        id: 'msg_2',
        conversationId: 'conv_mentorship_1',
        senderId: 'user_mentor_1',
        receiverId: 'user_hotlead_1',
        type: 'text',
        content: 'Hi Daniel! Absolutely, I\'d be happy to help. What specific challenges are you facing with scaling?',
        status: 'read',
        timestamp: '2024-01-15T10:05:00Z',
        reactions: [{ userId: 'user_hotlead_1', emoji: '❤️', timestamp: '2024-01-15T10:06:00Z' }],
        isImportant: false,
        isPinned: false,
        replyCount: 0
      }
    ]

    this.messages.set('conv_mentorship_1', mockMessages)
  }

  /**
   * Get user profile by ID
   */
  public async getUserProfile(userId: string): Promise<NetworkUser | null> {
    return this.users.get(userId) || null
  }

  /**
   * Search for users based on criteria
   */
  public async searchUsers(criteria: {
    query?: string
    role?: UserRole
    isOnline?: boolean
    isAvailableForMentoring?: boolean
    badgeLevel?: string
    location?: string
  }): Promise<NetworkUser[]> {
    let results = Array.from(this.users.values())

    if (criteria.query) {
      const query = criteria.query.toLowerCase()
      results = results.filter(user => 
        user.name.toLowerCase().includes(query) ||
        (user.bio && user.bio.toLowerCase().includes(query)) ||
        (user.location && user.location.toLowerCase().includes(query))
      )
    }

    if (criteria.role) {
      results = results.filter(user => user.role === criteria.role)
    }

    if (criteria.isOnline !== undefined) {
      results = results.filter(user => criteria.isOnline ? user.status === 'online' : user.status !== 'online')
    }

    if (criteria.isAvailableForMentoring !== undefined) {
      results = results.filter(user => user.isAvailableForMentoring === criteria.isAvailableForMentoring)
    }

    if (criteria.badgeLevel) {
      results = results.filter(user => user.badgeLevel === criteria.badgeLevel)
    }

    if (criteria.location) {
      results = results.filter(user => user.location?.includes(criteria.location || ''))
    }

    return results
  }

  /**
   * Create or get direct conversation
   */
  public async createDirectConversation(userId1: string, userId2: string): Promise<Conversation> {
    // Check if conversation already exists
    const existingConv = Array.from(this.conversations.values()).find(conv => 
      conv.type === 'direct' && 
      conv.participants.includes(userId1) && 
      conv.participants.includes(userId2)
    )

    if (existingConv) {
      return existingConv
    }

    // Create new conversation
    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      type: 'direct',
      participants: [userId1, userId2],
      admins: [],
      createdBy: userId1,
      isArchived: false,
      isMuted: false,
      allowNewMembers: false,
      requireApproval: false,
      messageCount: 0,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.conversations.set(conversation.id, conversation)
    this.messages.set(conversation.id, [])

    return conversation
  }

  /**
   * Send a message
   */
  public async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: MessageType = 'text',
    metadata?: any
  ): Promise<Message> {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId,
      receiverId: conversation.type === 'direct' 
        ? conversation.participants.find(p => p !== senderId)
        : undefined,
      type,
      content,
      metadata,
      status: 'sent',
      timestamp: new Date().toISOString(),
      reactions: [],
      isImportant: false,
      isPinned: false,
      replyCount: 0
    }

    // Add message to conversation
    const messages = this.messages.get(conversationId) || []
    messages.push(message)
    this.messages.set(conversationId, messages)

    // Update conversation
    conversation.lastMessage = message
    conversation.messageCount += 1
    conversation.updatedAt = new Date().toISOString()

    // Update unread count for other participants
    conversation.participants.forEach(participantId => {
      if (participantId !== senderId) {
        conversation.unreadCount += 1
      }
    })

    // Track activity
    this.trackActivity({
      id: `activity_${Date.now()}`,
      userId: senderId,
      type: 'message_sent',
      description: `Sent a message in ${conversation.type} conversation`,
      timestamp: new Date().toISOString(),
      isPublic: false,
      metadata: { conversationId }
    })

    // Update lead scoring for engagement
    await leadScoringService.updateEngagement('message_sent', {
      conversation_type: conversation.type,
      message_type: type,
      recipient_count: conversation.participants.length - 1
    })

    return message
  }

  /**
   * Get messages for a conversation
   */
  public async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    const messages = this.messages.get(conversationId) || []
    return messages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit)
  }

  /**
   * Get conversations for a user
   */
  public async getUserConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.participants.includes(userId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  /**
   * Create connection request
   */
  public async sendConnectionRequest(
    fromUserId: string,
    toUserId: string,
    connectionType: NetworkConnection['connectionType'] = 'peer',
    message?: string
  ): Promise<NetworkConnection> {
    const connection: NetworkConnection = {
      id: `conn_${Date.now()}`,
      userId: fromUserId,
      connectedUserId: toUserId,
      status: 'pending',
      connectionType,
      requestMessage: message,
      connectedAt: new Date().toISOString(),
      messagesExchanged: 0,
      lastInteraction: new Date().toISOString(),
      connectionStrength: 0,
      sharedInterests: [],
      meetingHistory: []
    }

    // Add to connections
    const fromUserConnections = this.connections.get(fromUserId) || []
    fromUserConnections.push(connection)
    this.connections.set(fromUserId, fromUserConnections)

    // Track activity
    this.trackActivity({
      id: `activity_${Date.now()}`,
      userId: fromUserId,
      type: 'connection_made',
      description: `Sent connection request to ${this.users.get(toUserId)?.name}`,
      timestamp: new Date().toISOString(),
      isPublic: true,
      metadata: { targetUserId: toUserId }
    })

    return connection
  }

  /**
   * Accept connection request
   */
  public async acceptConnectionRequest(connectionId: string): Promise<NetworkConnection> {
    // Find connection across all users
    for (const [userId, connections] of this.connections.entries()) {
      const connection = connections.find(c => c.id === connectionId)
      if (connection) {
        connection.status = 'accepted'
        connection.connectedAt = new Date().toISOString()

        // Update user connection counts
        const fromUser = this.users.get(connection.userId)
        const toUser = this.users.get(connection.connectedUserId)
        
        if (fromUser) fromUser.connectionsCount += 1
        if (toUser) toUser.connectionsCount += 1

        // Create reciprocal connection
        const reciprocalConnection: NetworkConnection = {
          ...connection,
          id: `conn_${Date.now()}`,
          userId: connection.connectedUserId,
          connectedUserId: connection.userId
        }

        const toUserConnections = this.connections.get(connection.connectedUserId) || []
        toUserConnections.push(reciprocalConnection)
        this.connections.set(connection.connectedUserId, toUserConnections)

        return connection
      }
    }

    throw new Error('Connection not found')
  }

  /**
   * Get user connections
   */
  public async getUserConnections(userId: string): Promise<NetworkConnection[]> {
    return this.connections.get(userId) || []
  }

  /**
   * Get recommended connections
   */
  public async getRecommendedConnections(userId: string): Promise<NetworkUser[]> {
    const currentUser = this.users.get(userId)
    if (!currentUser) return []

    const userConnections = await this.getUserConnections(userId)
    const connectedUserIds = new Set(userConnections.map(c => c.connectedUserId))

    // Filter out already connected users and recommend based on criteria
    return Array.from(this.users.values())
      .filter(user => 
        user.id !== userId &&
        !connectedUserIds.has(user.id) &&
        user.visitorStatus === 'hot_lead' && // Only recommend hot leads
        user.isAvailableForMentoring !== currentUser.isAvailableForMentoring // Complement skills
      )
      .sort((a, b) => b.engagementLevel - a.engagementLevel)
      .slice(0, 10)
  }

  /**
   * Track user activity
   */
  private trackActivity(activity: NetworkActivity): void {
    this.activities.push(activity)
    // Keep only last 1000 activities
    if (this.activities.length > 1000) {
      this.activities = this.activities.slice(-1000)
    }
  }

  /**
   * Get network activity feed
   */
  public async getActivityFeed(
    userId: string,
    includeConnections: boolean = true,
    limit: number = 20
  ): Promise<NetworkActivity[]> {
    let activities = this.activities.filter(activity => activity.isPublic)

    if (includeConnections) {
      const connections = await this.getUserConnections(userId)
      const connectionUserIds = new Set(connections.map(c => c.connectedUserId))
      connectionUserIds.add(userId)

      activities = activities.filter(activity => connectionUserIds.has(activity.userId))
    } else {
      activities = activities.filter(activity => activity.userId === userId)
    }

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  /**
   * Mark conversation as read
   */
  public async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = this.conversations.get(conversationId)
    if (conversation && conversation.participants.includes(userId)) {
      conversation.unreadCount = 0
    }
  }

  /**
   * Update user status
   */
  public async updateUserStatus(userId: string, status: NetworkUser['status']): Promise<void> {
    const user = this.users.get(userId)
    if (user) {
      user.status = status
      user.lastSeen = new Date().toISOString()
    }
  }

  /**
   * Get online users
   */
  public async getOnlineUsers(): Promise<NetworkUser[]> {
    return Array.from(this.users.values())
      .filter(user => user.status === 'online')
      .sort((a, b) => b.engagementLevel - a.engagementLevel)
  }

  /**
   * Search conversations
   */
  public async searchConversations(
    userId: string,
    query: string
  ): Promise<Array<{ conversation: Conversation; matchedMessages: Message[] }>> {
    const userConversations = await this.getUserConversations(userId)
    const results: Array<{ conversation: Conversation; matchedMessages: Message[] }> = []

    for (const conversation of userConversations) {
      const messages = this.messages.get(conversation.id) || []
      const matchedMessages = messages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase())
      )

      if (matchedMessages.length > 0) {
        results.push({ conversation, matchedMessages })
      }
    }

    return results
  }
}

// Export singleton instance
export const networkHubService = NetworkHubService.getInstance()

// Export types for use in components
export type {
  NetworkUser,
  Message,
  Conversation,
  NetworkConnection,
  NetworkActivity
}