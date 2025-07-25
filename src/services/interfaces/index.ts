/**
 * Service Interfaces
 * 
 * Defines contracts for all business services
 */

// Base interfaces
export interface IService {
  dispose?(): void
  getHealth?(): boolean
}

// User Management
export interface IUserService extends IService {
  getCurrentUser(): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
  getUserProfile(id: string): Promise<UserProfile>
  captureUserInfo(data: UserCaptureData): Promise<void>
}

// Authentication
export interface IAuthService extends IService {
  signIn(email: string, password: string): Promise<AuthResult>
  signOut(): Promise<void>
  getCurrentSession(): SessionData | null
  isAuthenticated(): boolean
  refreshSession(): Promise<boolean>
}

// Lead Management
export interface ILeadService extends IService {
  createLead(userData: UserData): Promise<Lead>
  updateLeadScore(leadId: string, points: number): Promise<LeadProfile>
  getLeadProfile(sessionId: string): Promise<LeadProfile>
  trackEngagement(action: string, metadata?: any): Promise<void>
  calculateLeadStatus(profile: LeadProfile): VisitorStatus
}

// Assessment Tools
export interface IAssessmentService extends IService {
  processAssessment(toolId: string, responses: AssessmentResponse[]): Promise<AssessmentResult>
  getToolConfiguration(toolId: string): Promise<ToolConfiguration>
  saveProgress(sessionId: string, toolId: string, progress: AssessmentProgress): Promise<void>
  getResults(sessionId: string, toolId: string): Promise<AssessmentResult | null>
}

// Content Management
export interface IContentService extends IService {
  getContent(type: ContentType): Promise<Content[]>
  trackContentEngagement(contentId: string, engagement: EngagementData): Promise<void>
  getPersonalizedContent(userId: string): Promise<Content[]>
}

// Analytics
export interface IAnalyticsService extends IService {
  trackEvent(event: string, properties?: any): Promise<void>
  trackPageView(page: string, properties?: any): Promise<void>
  getUserAnalytics(userId: string): Promise<UserAnalytics>
  getSystemMetrics(): Promise<SystemMetrics>
}

// Notification
export interface INotificationService extends IService {
  sendEmail(to: string, template: string, data: any): Promise<boolean>
  triggerWelcomeSequence(user: User): Promise<void>
  scheduleFollowUp(userId: string, delay: number): Promise<void>
}

// Data Types
export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  status: VisitorStatus
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  assessmentResults: AssessmentResult[]
  engagementHistory: EngagementActivity[]
  preferences: UserPreferences
}

export interface UserCaptureData {
  email?: string
  phone?: string
  name?: string
  source?: string
  campaign?: string
}

export interface AuthResult {
  success: boolean
  user?: User
  session?: SessionData
  error?: string
}

export interface SessionData {
  userId: string
  email: string
  role: string
  status: string
  expiresAt: string
}

export interface Lead {
  id: string
  email: string
  source: string
  status: VisitorStatus
  score: number
  createdAt: string
}

export interface LeadProfile {
  id: string
  status: VisitorStatus
  engagementScore: number
  demographicScore: number
  behavioralScore: number
  conversionReadiness: number
  lastActivity: string
  source: string
  attributionData: AttributionData
  activities: EngagementActivity[]
  predictions: LeadPredictions
}

export interface EngagementActivity {
  timestamp: string
  action: string
  points: number
  page_url: string
  metadata?: any
}

export interface LeadPredictions {
  conversionProbability: number
  timeToConversion: number
  bestConversionPath: string[]
  nextBestAction: string
  riskOfChurn: number
}

export interface AttributionData {
  content_id?: string
  member_id?: string
  platform?: string
  referrer?: string
}

export interface AssessmentResponse {
  questionId: string
  value: any
  timestamp: string
}

export interface AssessmentResult {
  toolId: string
  sessionId: string
  responses: AssessmentResponse[]
  scores: Record<string, number>
  insights: string[]
  recommendations: string[]
  completedAt: string
}

export interface AssessmentProgress {
  currentStep: number
  totalSteps: number
  responses: AssessmentResponse[]
  startedAt: string
}

export interface ToolConfiguration {
  id: string
  name: string
  description: string
  interactions: InteractionDefinition[]
  scoring: ScoringConfiguration
  metadata: ToolMetadata
}

export interface InteractionDefinition {
  id: string
  type: string
  config: any
  validation?: any
}

export interface ScoringConfiguration {
  dimensions: string[]
  weights: Record<string, number>
  algorithm: string
}

export interface ToolMetadata {
  version: string
  author: string
  tags: string[]
  estimatedTime: number
}

export interface Content {
  id: string
  title: string
  type: ContentType
  content: string
  metadata: any
  publishedAt: string
}

export interface EngagementData {
  duration: number
  scrollDepth: number
  interactions: number
  completed: boolean
}

export interface UserAnalytics {
  userId: string
  sessions: number
  pageViews: number
  avgSessionDuration: number
  topPages: string[]
  conversionEvents: number
}

export interface SystemMetrics {
  activeUsers: number
  totalSessions: number
  avgLoadTime: number
  errorRate: number
  topErrors: string[]
}

export interface UserPreferences {
  language: string
  notifications: boolean
  theme: string
  timezone: string
}

export type VisitorStatus = 'visitor' | 'cold_lead' | 'candidate' | 'hot_lead'
export type ContentType = 'article' | 'video' | 'webinar' | 'tool' | 'assessment'