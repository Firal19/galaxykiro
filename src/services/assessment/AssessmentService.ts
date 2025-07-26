/**
 * AssessmentService - Dynamic assessment tool management
 */

import {
  IAssessmentService,
  ToolConfiguration,
  ToolFilter,
  AssessmentSession,
  AssessmentResponse,
  AssessmentResult,
  QuestionConfig,
  ScoringConfig,
  ValidationError,
  ProcessingError
} from './AssessmentTypes'

export class AssessmentService implements IAssessmentService {
  private static instance: AssessmentService
  private toolConfigurations: Map<string, ToolConfiguration> = new Map()
  private sessions: Map<string, AssessmentSession> = new Map()
  private results: Map<string, AssessmentResult> = new Map()

  public static getInstance(): AssessmentService {
    if (!AssessmentService.instance) {
      AssessmentService.instance = new AssessmentService()
    }
    return AssessmentService.instance
  }

  constructor() {
    this.loadDefaultTools()
    this.loadFromStorage()
  }

  /**
   * Get tool configuration by ID
   */
  async getToolConfiguration(toolId: string): Promise<ToolConfiguration> {
    const config = this.toolConfigurations.get(toolId)
    if (!config) {
      throw new Error(`Tool configuration not found: ${toolId}`)
    }
    return config
  }

  /**
   * List tools with filtering
   */
  async listTools(filter?: ToolFilter): Promise<ToolConfiguration[]> {
    let tools = Array.from(this.toolConfigurations.values())

    if (filter) {
      if (filter.category) {
        tools = tools.filter(tool => tool.category === filter.category)
      }
      if (filter.accessLevel) {
        tools = tools.filter(tool => tool.accessLevel === filter.accessLevel)
      }
      if (filter.isActive !== undefined) {
        tools = tools.filter(tool => tool.isActive === filter.isActive)
      }
      if (filter.tags && filter.tags.length > 0) {
        tools = tools.filter(tool => 
          filter.tags!.some(tag => tool.tags.includes(tag))
        )
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        tools = tools.filter(tool =>
          tool.name.en.toLowerCase().includes(searchLower) ||
          tool.description.en.toLowerCase().includes(searchLower)
        )
      }
    }

    return tools.filter(tool => tool.isActive)
  }

  /**
   * Start new assessment session
   */
  async startSession(toolId: string, userId?: string): Promise<AssessmentSession> {
    const config = await this.getToolConfiguration(toolId)
    
    const session: AssessmentSession = {
      id: this.generateSessionId(),
      toolId,
      userId,
      sessionId: this.generateSessionId(),
      currentQuestionIndex: 0,
      responses: [],
      startedAt: new Date().toISOString(),
      isCompleted: false,
      isPaused: false,
      timeSpent: 0
    }

    this.sessions.set(session.id, session)
    await this.saveToStorage()

    // Track session start
    await this.trackEvent(session.id, 'session_started', {
      toolId,
      userId,
      timestamp: session.startedAt
    })

    return session
  }

  /**
   * Save response to session
   */
  async saveResponse(sessionId: string, response: AssessmentResponse): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }

    // Validate response
    const config = await this.getToolConfiguration(session.toolId)
    const question = config.questions.find(q => q.id === response.questionId)
    if (!question) {
      throw new ValidationError(`Question not found: ${response.questionId}`, sessionId)
    }

    await this.validateResponse(question, response.value)

    // Update or add response
    const existingIndex = session.responses.findIndex(r => r.questionId === response.questionId)
    if (existingIndex >= 0) {
      session.responses[existingIndex] = response
    } else {
      session.responses.push(response)
    }

    // Update session progress
    session.currentQuestionIndex = Math.max(
      session.currentQuestionIndex,
      config.questions.findIndex(q => q.id === response.questionId) + 1
    )

    // Check if completed
    if (session.responses.length >= config.questions.length) {
      session.isCompleted = true
      session.completedAt = new Date().toISOString()
    }

    this.sessions.set(sessionId, session)
    await this.saveToStorage()

    // Track response
    await this.trackEvent(sessionId, 'response_saved', {
      questionId: response.questionId,
      responseTime: response.timeSpent
    })
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<AssessmentSession> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`)
    }
    return session
  }

  /**
   * Process assessment results
   */
  async processResults(sessionId: string): Promise<AssessmentResult> {
    const session = await this.getSession(sessionId)
    const config = await this.getToolConfiguration(session.toolId)

    if (!session.isCompleted) {
      throw new ProcessingError('Session is not completed', sessionId)
    }

    const startTime = Date.now()

    try {
      // Calculate scores
      const scores = await this.calculateScores(session, config)
      
      // Generate insights
      const insights = await this.generateInsights(scores, config)
      
      // Generate recommendations
      const recommendations = await this.generateRecommendations(scores, config)

      const result: AssessmentResult = {
        sessionId,
        toolId: session.toolId,
        userId: session.userId,
        overallScore: scores.overall,
        dimensionScores: scores.dimensions,
        insights,
        recommendations,
        completedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        version: config.version
      }

      this.results.set(sessionId, result)
      await this.saveToStorage()

      // Track completion
      await this.trackEvent(sessionId, 'assessment_completed', {
        overallScore: result.overallScore,
        processingTime: result.processingTime
      })

      return result
    } catch (error) {
      throw new ProcessingError(
        `Failed to process results: ${error}`,
        sessionId
      )
    }
  }

  /**
   * Get processed results
   */
  async getResults(sessionId: string): Promise<AssessmentResult> {
    const result = this.results.get(sessionId)
    if (!result) {
      // Try to process results if session is completed
      const session = await this.getSession(sessionId)
      if (session.isCompleted) {
        return await this.processResults(sessionId)
      }
      throw new Error(`Results not found: ${sessionId}`)
    }
    return result
  }

  /**
   * Track assessment event
   */
  async trackEvent(sessionId: string, event: string, data?: any): Promise<void> {
    const session = this.sessions.get(sessionId)
    if (session) {
      // TODO: Integrate with analytics service
      console.log(`Assessment Event: ${event}`, {
        sessionId,
        toolId: session.toolId,
        userId: session.userId,
        data,
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Validate response value
   */
  private async validateResponse(question: QuestionConfig, value: any): Promise<void> {
    if (question.required && (value === null || value === undefined || value === '')) {
      throw new ValidationError(`Response required for question: ${question.id}`)
    }

    if (question.validation) {
      const { validation } = question
      
      if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
        throw new ValidationError(`Response too short for question: ${question.id}`)
      }
      
      if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
        throw new ValidationError(`Response too long for question: ${question.id}`)
      }
      
      if (validation.pattern && typeof value === 'string') {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(value)) {
          throw new ValidationError(`Invalid response format for question: ${question.id}`)
        }
      }
    }

    // Type-specific validation
    switch (question.type) {
      case 'multiple_choice':
        if (!question.options?.some(opt => opt.value === value)) {
          throw new ValidationError(`Invalid option for question: ${question.id}`)
        }
        break
      
      case 'likert_scale':
      case 'slider':
        if (question.scale) {
          const numValue = Number(value)
          if (numValue < question.scale.min || numValue > question.scale.max) {
            throw new ValidationError(`Value out of range for question: ${question.id}`)
          }
        }
        break
    }
  }

  /**
   * Calculate scores using configuration
   */
  private async calculateScores(session: AssessmentSession, config: ToolConfiguration) {
    const { scoring } = config
    const dimensionScores: Record<string, number> = {}
    let overallScore = 0

    // Calculate dimension scores
    for (const dimension of scoring.dimensions) {
      let dimensionScore = 0
      let totalWeight = 0

      for (const questionWeight of dimension.questions) {
        const response = session.responses.find(r => r.questionId === questionWeight.questionId)
        if (response) {
          let score = Number(response.value) || 0
          
          // Apply transformations
          if (questionWeight.transform === 'reverse' && config.questions.find(q => q.id === questionWeight.questionId)?.scale) {
            const scale = config.questions.find(q => q.id === questionWeight.questionId)!.scale!
            score = scale.max - score + scale.min
          }
          
          dimensionScore += score * questionWeight.weight
          totalWeight += questionWeight.weight
        }
      }

      if (totalWeight > 0) {
        dimensionScores[dimension.id] = (dimensionScore / totalWeight) * dimension.weight
      }
    }

    // Calculate overall score
    switch (scoring.algorithm) {
      case 'weighted_sum':
        overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0)
        break
      
      case 'average':
        overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / Object.keys(dimensionScores).length
        break
      
      default:
        overallScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0)
    }

    // Normalize to max score if specified
    if (scoring.maxScore) {
      overallScore = Math.min(overallScore, scoring.maxScore)
    }

    return {
      overall: Math.round(overallScore * 100) / 100,
      dimensions: Object.fromEntries(
        Object.entries(dimensionScores).map(([key, value]) => [key, Math.round(value * 100) / 100])
      )
    }
  }

  /**
   * Generate insights based on scores
   */
  private async generateInsights(scores: any, config: ToolConfiguration) {
    const insights = []

    for (const insight of config.results.insights) {
      let shouldInclude = false

      if (insight.condition.dimension && insight.condition.minScore !== undefined) {
        const dimensionScore = scores.dimensions[insight.condition.dimension]
        if (dimensionScore >= insight.condition.minScore) {
          shouldInclude = true
        }
      }

      if (insight.condition.maxScore !== undefined) {
        const relevantScore = insight.condition.dimension ? 
          scores.dimensions[insight.condition.dimension] : scores.overall
        if (relevantScore <= insight.condition.maxScore) {
          shouldInclude = true
        }
      }

      if (shouldInclude) {
        insights.push({
          insightId: insight.id,
          title: insight.title.en,
          description: insight.description.en,
          type: insight.type,
          priority: insight.priority
        })
      }
    }

    return insights.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(scores: any, config: ToolConfiguration) {
    return config.results.recommendations.map(rec => ({
      id: rec.id,
      title: rec.title.en,
      description: rec.description.en,
      actionItems: rec.actionItems.map(item => item.en),
      priority: rec.priority
    })).sort((a, b) => b.priority - a.priority)
  }

  /**
   * Load default tool configurations (migrated from existing tools)
   */
  private loadDefaultTools(): void {
    // TODO: Migrate existing tools to this format
    // For now, we'll create a sample tool configuration
    const sampleTool: ToolConfiguration = {
      id: 'potential-quotient-basic',
      name: { en: 'Potential Quotient Calculator' },
      description: { en: 'Discover your untapped potential across key life dimensions' },
      version: '1.0.0',
      category: 'potential',
      tags: ['potential', 'assessment', 'core'],
      estimatedDuration: 10,
      difficulty: 'beginner',
      accessLevel: 'public',
      requiresAuth: false,
      questions: [
        {
          id: 'q1',
          type: 'likert_scale',
          title: { en: 'How confident are you in your ability to achieve your goals?' },
          required: true,
          scale: { min: 1, max: 5, labels: { 1: { en: 'Not confident' }, 5: { en: 'Very confident' } } }
        }
      ],
      scoring: {
        algorithm: 'weighted_sum',
        dimensions: [
          {
            id: 'confidence',
            name: { en: 'Confidence' },
            weight: 1.0,
            questions: [{ questionId: 'q1', weight: 1.0 }]
          }
        ]
      },
      results: {
        visualization: 'gauge',
        insights: [],
        recommendations: [],
        shareableResults: true,
        downloadableReport: false
      },
      saveProgress: true,
      allowRetake: true,
      leadCapture: {
        beforeTool: false,
        afterTool: true,
        progressiveLevel: 1
      },
      trackingEvents: ['tool_started', 'question_answered', 'tool_completed'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system'
    }

    this.toolConfigurations.set(sampleTool.id, sampleTool)
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const sessions = localStorage.getItem('assessment_sessions')
      if (sessions) {
        const sessionData = JSON.parse(sessions)
        this.sessions = new Map(Object.entries(sessionData))
      }

      const results = localStorage.getItem('assessment_results')
      if (results) {
        const resultData = JSON.parse(results)
        this.results = new Map(Object.entries(resultData))
      }
    } catch (error) {
      console.error('Failed to load assessment data from storage:', error)
    }
  }

  /**
   * Save data to localStorage
   */
  private async saveToStorage(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const sessionData = Object.fromEntries(this.sessions)
      localStorage.setItem('assessment_sessions', JSON.stringify(sessionData))

      const resultData = Object.fromEntries(this.results)
      localStorage.setItem('assessment_results', JSON.stringify(resultData))
    } catch (error) {
      console.error('Failed to save assessment data to storage:', error)
    }
  }

  /**
   * Health check
   */
  getHealth(): boolean {
    return this.toolConfigurations.size > 0
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.toolConfigurations.clear()
    this.sessions.clear()
    this.results.clear()
  }
}

// Export singleton instance
export const assessmentService = AssessmentService.getInstance()