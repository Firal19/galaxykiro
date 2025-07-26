/**
 * Assessment Types - Unified type system for dynamic tools
 */

// Base types
export type QuestionType = 
  | 'multiple_choice'
  | 'likert_scale' 
  | 'slider'
  | 'text_input'
  | 'ranking'
  | 'binary'
  | 'emoji_scale'
  | 'scenario'
  | 'word_cloud'
  | 'priority_pyramid'
  | 'future_visualization'

export type ScoringAlgorithm = 'weighted_sum' | 'average' | 'complex' | 'custom'
export type ResultVisualization = 'bar_chart' | 'radar_chart' | 'pie_chart' | 'gauge' | 'custom'

// Localization support
export interface LocalizedString {
  en: string
  am?: string // Amharic
}

// Question option
export interface QuestionOption {
  id: string
  label: LocalizedString
  value: number | string
  metadata?: Record<string, any>
}

// Question configuration
export interface QuestionConfig {
  id: string
  type: QuestionType
  title: LocalizedString
  description?: LocalizedString
  required: boolean
  
  // Type-specific configurations
  options?: QuestionOption[] // For multiple_choice, ranking
  scale?: {
    min: number
    max: number
    step?: number
    labels?: { [key: number]: LocalizedString }
  }
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    customValidator?: string // Function name for custom validation
  }
  
  // Advanced configurations
  conditional?: {
    dependsOn: string // Question ID
    showWhen: string | number | boolean
  }
  randomizeOptions?: boolean
  allowMultiple?: boolean
  
  // Metadata
  category?: string
  tags?: string[]
  metadata?: Record<string, any>
}

// Scoring configuration
export interface ScoringDimension {
  id: string
  name: LocalizedString
  description?: LocalizedString
  weight: number
  questions: {
    questionId: string
    weight: number
    transform?: 'reverse' | 'normalize' | 'custom'
  }[]
}

export interface ScoringConfig {
  algorithm: ScoringAlgorithm
  dimensions: ScoringDimension[]
  maxScore?: number
  passThreshold?: number
  customScoringFunction?: string // Function name for custom scoring
}

// Result configuration
export interface ResultInsight {
  id: string
  title: LocalizedString
  description: LocalizedString
  condition: {
    dimension?: string
    minScore?: number
    maxScore?: number
    customCondition?: string
  }
  priority: number
  type: 'strength' | 'weakness' | 'opportunity' | 'recommendation'
}

export interface ResultConfig {
  visualization: ResultVisualization
  insights: ResultInsight[]
  recommendations: {
    id: string
    title: LocalizedString
    description: LocalizedString
    actionItems: LocalizedString[]
    priority: number
  }[]
  shareableResults: boolean
  downloadableReport: boolean
}

// Complete tool configuration
export interface ToolConfiguration {
  // Basic info
  id: string
  name: LocalizedString
  description: LocalizedString
  version: string
  
  // Metadata
  category: string
  tags: string[]
  estimatedDuration: number // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  
  // Access control
  accessLevel: 'public' | 'cold_lead' | 'candidate' | 'hot_lead' | 'member' | 'admin'
  requiresAuth: boolean
  
  // Configuration
  questions: QuestionConfig[]
  scoring: ScoringConfig
  results: ResultConfig
  
  // Progressive features
  saveProgress: boolean
  allowRetake: boolean
  retakeDelay?: number // hours
  
  // Lead generation
  leadCapture: {
    beforeTool: boolean
    afterTool: boolean
    progressiveLevel: 1 | 2 | 3
  }
  
  // UI customization
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    fontFamily?: string
  }
  
  // Analytics
  trackingEvents: string[]
  
  // Status
  isActive: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Runtime types
export interface AssessmentSession {
  id: string
  toolId: string
  userId?: string
  sessionId: string
  
  // Progress
  currentQuestionIndex: number
  responses: AssessmentResponse[]
  startedAt: string
  completedAt?: string
  
  // User context
  userEmail?: string
  leadData?: Record<string, any>
  
  // State
  isCompleted: boolean
  isPaused: boolean
  timeSpent: number // seconds
}

export interface AssessmentResponse {
  questionId: string
  value: any
  timestamp: string
  timeSpent?: number // seconds on question
  metadata?: Record<string, any>
}

export interface AssessmentResult {
  sessionId: string
  toolId: string
  userId?: string
  
  // Scores
  overallScore: number
  dimensionScores: Record<string, number>
  percentileRank?: number
  
  // Insights
  insights: {
    insightId: string
    title: string
    description: string
    type: string
    priority: number
  }[]
  
  // Recommendations
  recommendations: {
    id: string
    title: string
    description: string
    actionItems: string[]
    priority: number
  }[]
  
  // Metadata
  completedAt: string
  processingTime: number // ms
  version: string
}

// Component interfaces for dynamic rendering
export interface QuestionComponentProps {
  question: QuestionConfig
  value: any
  onChange: (value: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
  error?: string
}

export interface ResultComponentProps {
  result: AssessmentResult
  config: ToolConfiguration
  onRetake: () => void
  onShare: () => void
  onDownload: () => void
}

// Service interfaces
export interface IAssessmentService {
  // Tool management
  getToolConfiguration(toolId: string): Promise<ToolConfiguration>
  listTools(filter?: ToolFilter): Promise<ToolConfiguration[]>
  
  // Session management
  startSession(toolId: string, userId?: string): Promise<AssessmentSession>
  saveResponse(sessionId: string, response: AssessmentResponse): Promise<void>
  getSession(sessionId: string): Promise<AssessmentSession>
  
  // Processing
  processResults(sessionId: string): Promise<AssessmentResult>
  getResults(sessionId: string): Promise<AssessmentResult>
  
  // Analytics
  trackEvent(sessionId: string, event: string, data?: any): Promise<void>
}

export interface ToolFilter {
  category?: string
  accessLevel?: string
  isActive?: boolean
  tags?: string[]
  search?: string
}

// Error types
export class AssessmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public sessionId?: string
  ) {
    super(message)
    this.name = 'AssessmentError'
  }
}

export class ValidationError extends AssessmentError {
  constructor(message: string, sessionId?: string) {
    super(message, 'VALIDATION_ERROR', sessionId)
  }
}

export class ProcessingError extends AssessmentError {
  constructor(message: string, sessionId?: string) {
    super(message, 'PROCESSING_ERROR', sessionId)
  }
}