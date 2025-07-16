/**
 * Interactive Assessment Tools Core Engine
 * 
 * This module provides a flexible assessment engine that supports multiple question types,
 * real-time scoring, progress saving, and result visualization.
 */

import { z } from 'zod'

// Question type definitions
export type QuestionType = 'multiple-choice' | 'scale' | 'text' | 'ranking' | 'slider' | 'matrix'

// Base question interface
export interface BaseQuestion {
  id: string
  type: QuestionType
  text: string
  description?: string
  required: boolean
  category?: string
  weight?: number
}

// Multiple choice question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice'
  options: {
    id: string
    text: string
    value: string | number
    score?: number
  }[]
  allowMultiple?: boolean
}

// Scale question (1-10, 1-5, etc.)
export interface ScaleQuestion extends BaseQuestion {
  type: 'scale'
  min: number
  max: number
  step?: number
  labels?: {
    min: string
    max: string
    middle?: string
  }
}

// Text input question
export interface TextQuestion extends BaseQuestion {
  type: 'text'
  placeholder?: string
  maxLength?: number
  validation?: RegExp
}

// Ranking question
export interface RankingQuestion extends BaseQuestion {
  type: 'ranking'
  items: {
    id: string
    text: string
    value: string
  }[]
  maxRank?: number
}

// Slider question
export interface SliderQuestion extends BaseQuestion {
  type: 'slider'
  min: number
  max: number
  step?: number
  defaultValue?: number
  unit?: string
}

// Matrix question (multiple questions with same scale)
export interface MatrixQuestion extends BaseQuestion {
  type: 'matrix'
  rows: {
    id: string
    text: string
  }[]
  columns: {
    id: string
    text: string
    value: string | number
    score?: number
  }[]
}

export type Question = 
  | MultipleChoiceQuestion 
  | ScaleQuestion 
  | TextQuestion 
  | RankingQuestion 
  | SliderQuestion 
  | MatrixQuestion

// Response types
export interface QuestionResponse {
  questionId: string
  answer: string | number | string[] | Record<string, string | number>
  timeSpent: number
  timestamp: Date
}

// Assessment configuration
export interface AssessmentConfig {
  id: string
  title: string
  description: string
  questions: Question[]
  scoringConfig: ScoringConfig
  progressSaving: boolean
  timeLimit?: number
  randomizeQuestions?: boolean
  showProgress?: boolean
  allowBackNavigation?: boolean
}

// Scoring configuration
export interface ScoringConfig {
  type: 'weighted' | 'simple' | 'category-based' | 'custom'
  categories?: {
    id: string
    name: string
    weight: number
    questions: string[] // question IDs
  }[]
  customScoring?: (responses: QuestionResponse[], questions: Question[]) => AssessmentScores
  resultTiers?: {
    min: number
    max: number
    label: string
    description: string
    insights: string[]
    recommendations: string[]
  }[]
}

// Assessment scores
export interface AssessmentScores {
  total: number
  percentage: number
  breakdown: Record<string, number>
  categoryScores?: Record<string, {
    score: number
    percentage: number
    maxPossible: number
  }>
  tier?: {
    label: string
    description: string
    insights: string[]
    recommendations: string[]
  }
}

// Assessment state for progress saving
export interface AssessmentState {
  assessmentId: string
  userId: string
  currentQuestionIndex: number
  responses: QuestionResponse[]
  startedAt: Date
  lastUpdatedAt: Date
  completionRate: number
  timeSpent: number
  isCompleted: boolean
}

// Assessment result with visualization data
export interface AssessmentResult {
  id: string
  assessmentId: string
  userId: string
  responses: QuestionResponse[]
  scores: AssessmentScores
  insights: PersonalizedInsight[]
  visualizationData: VisualizationData
  completedAt: Date
  timeSpent: number
  isShared: boolean
  shareToken?: string
}

// Personalized insights
export interface PersonalizedInsight {
  category: string
  type: 'strength' | 'opportunity' | 'recommendation' | 'warning'
  title: string
  message: string
  actionItems?: string[]
  priority: 'high' | 'medium' | 'low'
}

// Visualization data for charts and dashboards
export interface VisualizationData {
  chartType: 'radar' | 'bar' | 'pie' | 'line' | 'gauge'
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string[]
      borderColor?: string[]
    }[]
  }
  options?: Record<string, unknown>
}

// Assessment Engine Class
export class AssessmentEngine {
  private config: AssessmentConfig
  private state: AssessmentState | null = null

  constructor(config: AssessmentConfig) {
    this.config = config
  }

  // Initialize assessment for a user
  async initializeAssessment(userId: string): Promise<AssessmentState> {
    const state: AssessmentState = {
      assessmentId: this.config.id,
      userId,
      currentQuestionIndex: 0,
      responses: [],
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
      completionRate: 0,
      timeSpent: 0,
      isCompleted: false
    }

    this.state = state
    
    if (this.config.progressSaving) {
      await this.saveProgress()
    }

    return state
  }

  // Load existing assessment state
  async loadAssessmentState(userId: string): Promise<AssessmentState | null> {
    try {
      // This would typically load from database
      // For now, we'll use localStorage as fallback
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`assessment_${this.config.id}_${userId}`)
        if (saved) {
          const state = JSON.parse(saved) as AssessmentState
          state.startedAt = new Date(state.startedAt)
          state.lastUpdatedAt = new Date(state.lastUpdatedAt)
          this.state = state
          return state
        }
      }
      return null
    } catch (error) {
      console.error('Error loading assessment state:', error)
      return null
    }
  }

  // Save progress
  async saveProgress(): Promise<void> {
    if (!this.state || !this.config.progressSaving) return

    try {
      // Update state
      this.state.lastUpdatedAt = new Date()
      this.state.completionRate = this.calculateCompletionRate()

      // Save to localStorage (in real implementation, this would save to database)
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `assessment_${this.config.id}_${this.state.userId}`,
          JSON.stringify(this.state)
        )
      }
    } catch (error) {
      console.error('Error saving assessment progress:', error)
    }
  }

  // Submit response for current question
  async submitResponse(response: Omit<QuestionResponse, 'timestamp'>): Promise<void> {
    if (!this.state) {
      throw new Error('Assessment not initialized')
    }

    const fullResponse: QuestionResponse = {
      ...response,
      timestamp: new Date()
    }

    // Update or add response
    const existingIndex = this.state.responses.findIndex(r => r.questionId === response.questionId)
    if (existingIndex >= 0) {
      this.state.responses[existingIndex] = fullResponse
    } else {
      this.state.responses.push(fullResponse)
    }

    // Update time spent
    this.state.timeSpent += response.timeSpent

    // Save progress
    if (this.config.progressSaving) {
      await this.saveProgress()
    }
  }

  // Navigate to next question
  nextQuestion(): Question | null {
    if (!this.state) return null

    if (this.state.currentQuestionIndex < this.config.questions.length - 1) {
      this.state.currentQuestionIndex++
      return this.getCurrentQuestion()
    }

    return null
  }

  // Navigate to previous question
  previousQuestion(): Question | null {
    if (!this.state || !this.config.allowBackNavigation) return null

    if (this.state.currentQuestionIndex > 0) {
      this.state.currentQuestionIndex--
      return this.getCurrentQuestion()
    }

    return null
  }

  // Get current question
  getCurrentQuestion(): Question | null {
    if (!this.state) return null
    return this.config.questions[this.state.currentQuestionIndex] || null
  }

  // Get question by ID
  getQuestionById(questionId: string): Question | null {
    return this.config.questions.find(q => q.id === questionId) || null
  }

  // Calculate completion rate
  calculateCompletionRate(): number {
    if (!this.state) return 0
    return this.state.responses.length / this.config.questions.length
  }

  // Check if assessment is complete
  isComplete(): boolean {
    if (!this.state) return false
    return this.state.responses.length === this.config.questions.length
  }

  // Calculate scores
  calculateScores(): AssessmentScores {
    if (!this.state) {
      throw new Error('Assessment not initialized')
    }

    const { scoringConfig } = this.config
    const { responses } = this.state

    switch (scoringConfig.type) {
      case 'simple':
        return this.calculateSimpleScores(responses)
      case 'weighted':
        return this.calculateWeightedScores(responses)
      case 'category-based':
        return this.calculateCategoryScores(responses)
      case 'custom':
        if (scoringConfig.customScoring) {
          return scoringConfig.customScoring(responses, this.config.questions)
        }
        return this.calculateSimpleScores(responses)
      default:
        return this.calculateSimpleScores(responses)
    }
  }

  // Simple scoring (sum of all scores)
  private calculateSimpleScores(responses: QuestionResponse[]): AssessmentScores {
    let total = 0
    let maxPossible = 0
    const breakdown: Record<string, number> = {}

    responses.forEach(response => {
      const question = this.getQuestionById(response.questionId)
      if (!question) return

      let score = 0
      let maxScore = 0

      switch (question.type) {
        case 'multiple-choice':
          const mcQuestion = question as MultipleChoiceQuestion
          if (Array.isArray(response.answer)) {
            // Multiple selection
            response.answer.forEach(answer => {
              const option = mcQuestion.options.find(opt => opt.value === answer)
              if (option && option.score) score += option.score
            })
          } else {
            // Single selection
            const option = mcQuestion.options.find(opt => opt.value === response.answer)
            if (option && option.score) score = option.score
          }
          maxScore = Math.max(...mcQuestion.options.map(opt => opt.score || 0))
          break

        case 'scale':
          const scaleQuestion = question as ScaleQuestion
          score = Number(response.answer)
          maxScore = scaleQuestion.max
          break

        case 'slider':
          const sliderQuestion = question as SliderQuestion
          score = Number(response.answer)
          maxScore = sliderQuestion.max
          break

        default:
          // For text and ranking questions, assign neutral score
          score = 1
          maxScore = 1
      }

      total += score
      maxPossible += maxScore
      breakdown[question.id] = score
    })

    const percentage = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0

    // Determine tier if configured
    let tier
    if (this.config.scoringConfig.resultTiers) {
      tier = this.config.scoringConfig.resultTiers.find(
        t => percentage >= t.min && percentage <= t.max
      )
    }

    return {
      total,
      percentage,
      breakdown,
      tier
    }
  }

  // Weighted scoring
  private calculateWeightedScores(responses: QuestionResponse[]): AssessmentScores {
    let total = 0
    let maxPossible = 0
    const breakdown: Record<string, number> = {}

    responses.forEach(response => {
      const question = this.getQuestionById(response.questionId)
      if (!question) return

      const weight = question.weight || 1
      let score = 0
      let maxScore = 0

      // Calculate base score (same logic as simple scoring)
      switch (question.type) {
        case 'multiple-choice':
          const mcQuestion = question as MultipleChoiceQuestion
          const option = mcQuestion.options.find(opt => opt.value === response.answer)
          if (option && option.score) score = option.score
          maxScore = Math.max(...mcQuestion.options.map(opt => opt.score || 0))
          break

        case 'scale':
          const scaleQuestion = question as ScaleQuestion
          score = Number(response.answer)
          maxScore = scaleQuestion.max
          break

        default:
          score = 1
          maxScore = 1
      }

      // Apply weight
      const weightedScore = score * weight
      const weightedMaxScore = maxScore * weight

      total += weightedScore
      maxPossible += weightedMaxScore
      breakdown[question.id] = weightedScore
    })

    const percentage = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0

    let tier
    if (this.config.scoringConfig.resultTiers) {
      tier = this.config.scoringConfig.resultTiers.find(
        t => percentage >= t.min && percentage <= t.max
      )
    }

    return {
      total,
      percentage,
      breakdown,
      tier
    }
  }

  // Category-based scoring
  private calculateCategoryScores(responses: QuestionResponse[]): AssessmentScores {
    const categories = this.config.scoringConfig.categories || []
    const categoryScores: Record<string, { score: number; percentage: number; maxPossible: number }> = {}
    let totalWeightedScore = 0
    let totalWeightedMax = 0
    const breakdown: Record<string, number> = {}

    categories.forEach(category => {
      let categoryTotal = 0
      let categoryMax = 0

      category.questions.forEach(questionId => {
        const response = responses.find(r => r.questionId === questionId)
        const question = this.getQuestionById(questionId)
        
        if (!response || !question) return

        let score = 0
        let maxScore = 0

        // Calculate score for this question
        switch (question.type) {
          case 'multiple-choice':
            const mcQuestion = question as MultipleChoiceQuestion
            const option = mcQuestion.options.find(opt => opt.value === response.answer)
            if (option && option.score) score = option.score
            maxScore = Math.max(...mcQuestion.options.map(opt => opt.score || 0))
            break

          case 'scale':
            const scaleQuestion = question as ScaleQuestion
            score = Number(response.answer)
            maxScore = scaleQuestion.max
            break

          default:
            score = 1
            maxScore = 1
        }

        categoryTotal += score
        categoryMax += maxScore
        breakdown[questionId] = score
      })

      const categoryPercentage = categoryMax > 0 ? Math.round((categoryTotal / categoryMax) * 100) : 0
      categoryScores[category.id] = {
        score: categoryTotal,
        percentage: categoryPercentage,
        maxPossible: categoryMax
      }

      // Apply category weight to overall score
      totalWeightedScore += categoryTotal * category.weight
      totalWeightedMax += categoryMax * category.weight
    })

    const percentage = totalWeightedMax > 0 ? Math.round((totalWeightedScore / totalWeightedMax) * 100) : 0

    let tier
    if (this.config.scoringConfig.resultTiers) {
      tier = this.config.scoringConfig.resultTiers.find(
        t => percentage >= t.min && percentage <= t.max
      )
    }

    return {
      total: totalWeightedScore,
      percentage,
      breakdown,
      categoryScores,
      tier
    }
  }

  // Generate personalized insights
  generateInsights(scores: AssessmentScores): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = []

    // Add tier-based insights
    if (scores.tier) {
      insights.push({
        category: 'overall',
        type: 'recommendation',
        title: `You're a ${scores.tier.label}`,
        message: scores.tier.description,
        actionItems: scores.tier.recommendations,
        priority: 'high'
      })

      scores.tier.insights.forEach(insight => {
        insights.push({
          category: 'overall',
          type: 'strength',
          title: 'Key Insight',
          message: insight,
          priority: 'medium'
        })
      })
    }

    // Add category-based insights
    if (scores.categoryScores) {
      Object.entries(scores.categoryScores).forEach(([categoryId, categoryScore]) => {
        const category = this.config.scoringConfig.categories?.find(c => c.id === categoryId)
        if (!category) return

        if (categoryScore.percentage >= 80) {
          insights.push({
            category: categoryId,
            type: 'strength',
            title: `Strong ${category.name}`,
            message: `You scored ${categoryScore.percentage}% in ${category.name}, indicating strong capabilities in this area.`,
            priority: 'medium'
          })
        } else if (categoryScore.percentage <= 40) {
          insights.push({
            category: categoryId,
            type: 'opportunity',
            title: `Growth Opportunity in ${category.name}`,
            message: `Your ${category.name} score of ${categoryScore.percentage}% suggests significant room for improvement.`,
            actionItems: [`Focus on developing your ${category.name.toLowerCase()} skills`],
            priority: 'high'
          })
        }
      })
    }

    return insights
  }

  // Generate visualization data
  generateVisualizationData(scores: AssessmentScores): VisualizationData {
    if (scores.categoryScores) {
      // Radar chart for category scores
      const categories = this.config.scoringConfig.categories || []
      const labels = categories.map(c => c.name)
      const data = categories.map(c => scores.categoryScores![c.id]?.percentage || 0)

      return {
        chartType: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Your Scores',
            data,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)'
          }]
        }
      }
    } else {
      // Gauge chart for overall score
      return {
        chartType: 'gauge',
        data: {
          labels: ['Score'],
          datasets: [{
            label: 'Overall Score',
            data: [scores.percentage],
            backgroundColor: ['rgba(34, 197, 94, 0.8)']
          }]
        }
      }
    }
  }

  // Complete assessment and generate result
  async completeAssessment(): Promise<AssessmentResult> {
    if (!this.state || !this.isComplete()) {
      throw new Error('Assessment not complete')
    }

    const scores = this.calculateScores()
    const insights = this.generateInsights(scores)
    const visualizationData = this.generateVisualizationData(scores)

    const result: AssessmentResult = {
      id: `result_${this.config.id}_${this.state.userId}_${Date.now()}`,
      assessmentId: this.config.id,
      userId: this.state.userId,
      responses: this.state.responses,
      scores,
      insights,
      visualizationData,
      completedAt: new Date(),
      timeSpent: this.state.timeSpent,
      isShared: false
    }

    // Mark state as completed
    this.state.isCompleted = true
    this.state.completionRate = 1.0

    // Save final state
    if (this.config.progressSaving) {
      await this.saveProgress()
    }

    return result
  }

  // Clear saved progress
  async clearProgress(): Promise<void> {
    if (!this.state) return

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`assessment_${this.config.id}_${this.state.userId}`)
      }
      this.state = null
    } catch (error) {
      console.error('Error clearing assessment progress:', error)
    }
  }

  // Get assessment progress summary
  getProgressSummary(): {
    currentQuestion: number
    totalQuestions: number
    completionRate: number
    timeSpent: number
    canGoBack: boolean
    canGoForward: boolean
  } | null {
    if (!this.state) return null

    return {
      currentQuestion: this.state.currentQuestionIndex + 1,
      totalQuestions: this.config.questions.length,
      completionRate: this.calculateCompletionRate(),
      timeSpent: this.state.timeSpent,
      canGoBack: this.config.allowBackNavigation && this.state.currentQuestionIndex > 0,
      canGoForward: this.state.currentQuestionIndex < this.config.questions.length - 1
    }
  }
}

// Validation schemas
export const questionResponseSchema = z.object({
  questionId: z.string(),
  answer: z.union([z.string(), z.number(), z.array(z.string()), z.record(z.union([z.string(), z.number()]))]),
  timeSpent: z.number().min(0)
})

export const assessmentConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['multiple-choice', 'scale', 'text', 'ranking', 'slider', 'matrix']),
    text: z.string(),
    required: z.boolean()
  })),
  scoringConfig: z.object({
    type: z.enum(['weighted', 'simple', 'category-based', 'custom'])
  }),
  progressSaving: z.boolean()
})