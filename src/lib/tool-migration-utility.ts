/**
 * Tool Migration Utility
 * Converts existing assessment tools to dynamic tool format
 */

import { z } from 'zod'

// Dynamic tool schema
export const DynamicToolSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['goal', 'leadership', 'habit', 'potential', 'mind']),
  icon: z.string().optional(),
  estimatedTime: z.number(),
  leadCaptureLevel: z.number().min(1).max(3),
  progressSaving: z.boolean(),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum([
      'multiple_choice',
      'scale',
      'text_input',
      'ranking',
      'slider',
      'matrix',
      'binary',
      'emoji_scale',
      'scenario'
    ]),
    text: z.string(),
    description: z.string().optional(),
    required: z.boolean().default(true),
    weight: z.number().default(1),
    category: z.string().optional(),
    options: z.array(z.object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
      description: z.string().optional()
    })).optional(),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional()
    }).optional(),
    conditionalLogic: z.object({
      dependsOn: z.string(),
      conditions: z.array(z.object({
        operator: z.enum(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan']),
        value: z.any()
      }))
    }).optional()
  })),
  scoringConfig: z.object({
    type: z.enum(['simple', 'weighted', 'category', 'complex']),
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      weight: z.number().default(1)
    })).optional(),
    thresholds: z.array(z.object({
      min: z.number(),
      max: z.number(),
      label: z.string(),
      description: z.string(),
      recommendations: z.array(z.string())
    })),
    algorithm: z.string().optional()
  }),
  resultsConfig: z.object({
    showOverallScore: z.boolean().default(true),
    showCategoryScores: z.boolean().default(false),
    showDetailedAnalysis: z.boolean().default(true),
    shareableResults: z.boolean().default(true),
    certificateEnabled: z.boolean().default(false)
  }),
  metadata: z.object({
    author: z.string().optional(),
    version: z.string().default('1.0.0'),
    lastUpdated: z.string().datetime(),
    tags: z.array(z.string()).optional(),
    scientificBasis: z.string().optional()
  })
})

export type DynamicTool = z.infer<typeof DynamicToolSchema>

// Question type mapping
const QUESTION_TYPE_MAP: Record<string, DynamicTool['questions'][0]['type']> = {
  'multiple-choice': 'multiple_choice',
  'scale': 'scale',
  'text': 'text_input',
  'ranking': 'ranking',
  'slider': 'slider',
  'matrix': 'matrix'
}

// Category extraction patterns
const CATEGORY_PATTERNS = {
  goal: ['goal', 'achievement', 'objective', 'target', 'dream'],
  leadership: ['leadership', 'leader', 'influence', 'team', 'management'],
  habit: ['habit', 'routine', 'behavior', 'practice', 'consistency'],
  potential: ['potential', 'growth', 'transformation', 'capability', 'readiness'],
  mind: ['mind', 'mental', 'psychology', 'thought', 'belief', 'mindset']
}

export class ToolMigrationUtility {
  /**
   * Extract category from tool path or title
   */
  static extractCategory(toolPath: string, title: string): DynamicTool['category'] {
    // Check path first
    for (const [category] of Object.entries(CATEGORY_PATTERNS)) {
      if (toolPath.includes(`/tools/${category}/`)) {
        return category as DynamicTool['category']
      }
    }

    // Check title
    const lowerTitle = title.toLowerCase()
    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
      if (patterns.some(pattern => lowerTitle.includes(pattern))) {
        return category as DynamicTool['category']
      }
    }

    return 'potential' // default
  }

  /**
   * Parse question from standard tool format
   */
  static parseQuestion(question: any, index: number): DynamicTool['questions'][0] {
    const type = QUESTION_TYPE_MAP[question.type] || 'multiple_choice'
    
    const baseQuestion: DynamicTool['questions'][0] = {
      id: question.id || `q${index + 1}`,
      type,
      text: question.text,
      description: question.helpText,
      required: question.required !== false,
      weight: question.weight || 1,
      category: question.category
    }

    // Add type-specific properties
    switch (type) {
      case 'multiple_choice':
        baseQuestion.options = question.options?.map((opt: any) => ({
          value: opt.value,
          label: opt.label,
          description: opt.description
        }))
        break
      
      case 'scale':
        baseQuestion.validation = {
          min: question.min || 1,
          max: question.max || 10
        }
        break
      
      case 'text_input':
        baseQuestion.validation = {
          minLength: question.minLength,
          maxLength: question.maxLength,
          pattern: question.pattern
        }
        break
      
      case 'slider':
        baseQuestion.validation = {
          min: question.min || 0,
          max: question.max || 100
        }
        break
    }

    return baseQuestion
  }

  /**
   * Extract scoring configuration
   */
  static extractScoringConfig(tool: any): DynamicTool['scoringConfig'] {
    // Check for category-based scoring
    const categories = tool.categories || tool.scoringCategories
    if (categories && categories.length > 0) {
      return {
        type: 'category',
        categories: categories.map((cat: any) => ({
          id: cat.id || cat.name.toLowerCase().replace(/\s+/g, '-'),
          name: cat.name,
          description: cat.description,
          weight: cat.weight || 1
        })),
        thresholds: this.extractThresholds(tool)
      }
    }

    // Check for weighted scoring
    const hasWeightedQuestions = tool.questions?.some((q: any) => q.weight && q.weight !== 1)
    if (hasWeightedQuestions) {
      return {
        type: 'weighted',
        thresholds: this.extractThresholds(tool)
      }
    }

    // Default to simple scoring
    return {
      type: 'simple',
      thresholds: this.extractThresholds(tool)
    }
  }

  /**
   * Extract result thresholds
   */
  static extractThresholds(tool: any): DynamicTool['scoringConfig']['thresholds'] {
    const thresholds = tool.thresholds || tool.resultTiers || []
    
    if (thresholds.length > 0) {
      return thresholds.map((tier: any) => ({
        min: tier.min || tier.minScore || 0,
        max: tier.max || tier.maxScore || 100,
        label: tier.label || tier.name,
        description: tier.description || tier.message,
        recommendations: tier.recommendations || tier.suggestions || []
      }))
    }

    // Default thresholds
    return [
      {
        min: 0,
        max: 39,
        label: 'Beginner',
        description: 'You\'re just starting your journey',
        recommendations: ['Start with basic exercises', 'Set small, achievable goals']
      },
      {
        min: 40,
        max: 69,
        label: 'Intermediate',
        description: 'You\'re making good progress',
        recommendations: ['Challenge yourself with new techniques', 'Track your progress regularly']
      },
      {
        min: 70,
        max: 100,
        label: 'Advanced',
        description: 'You\'re well on your way to mastery',
        recommendations: ['Share your knowledge with others', 'Set ambitious goals']
      }
    ]
  }

  /**
   * Migrate a standard tool to dynamic format
   */
  static migrateTool(toolPath: string, toolConfig: any): DynamicTool {
    const category = this.extractCategory(toolPath, toolConfig.title)
    
    return {
      id: toolConfig.id || toolPath.split('/').pop()?.replace('.tsx', '') || 'unknown',
      title: toolConfig.title,
      description: toolConfig.description,
      category,
      icon: toolConfig.icon,
      estimatedTime: toolConfig.estimatedTime || 10,
      leadCaptureLevel: toolConfig.leadCaptureLevel || 1,
      progressSaving: toolConfig.progressSaving !== false,
      questions: toolConfig.questions.map((q: any, i: number) => this.parseQuestion(q, i)),
      scoringConfig: this.extractScoringConfig(toolConfig),
      resultsConfig: {
        showOverallScore: toolConfig.showScore !== false,
        showCategoryScores: !!toolConfig.categories,
        showDetailedAnalysis: toolConfig.showAnalysis !== false,
        shareableResults: toolConfig.shareable !== false,
        certificateEnabled: toolConfig.certificate === true
      },
      metadata: {
        author: 'Galaxy Dream Team',
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        tags: toolConfig.tags || [category],
        scientificBasis: toolConfig.scientificBasis
      }
    }
  }

  /**
   * Validate migrated tool
   */
  static validateTool(tool: any): { valid: boolean; errors?: string[] } {
    try {
      DynamicToolSchema.parse(tool)
      return { valid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        }
      }
      return { valid: false, errors: ['Unknown validation error'] }
    }
  }

  /**
   * Generate migration report
   */
  static generateMigrationReport(tools: Array<{ path: string; original: any; migrated: DynamicTool; valid: boolean; errors?: string[] }>) {
    const report = {
      summary: {
        total: tools.length,
        successful: tools.filter(t => t.valid).length,
        failed: tools.filter(t => !t.valid).length
      },
      byCategory: {} as Record<string, number>,
      byQuestionType: {} as Record<string, number>,
      failures: [] as Array<{ path: string; errors: string[] }>
    }

    tools.forEach(tool => {
      if (tool.valid) {
        // Count by category
        report.byCategory[tool.migrated.category] = (report.byCategory[tool.migrated.category] || 0) + 1
        
        // Count question types
        tool.migrated.questions.forEach(q => {
          report.byQuestionType[q.type] = (report.byQuestionType[q.type] || 0) + 1
        })
      } else {
        report.failures.push({
          path: tool.path,
          errors: tool.errors || ['Unknown error']
        })
      }
    })

    return report
  }

  /**
   * Export tool as JSON
   */
  static exportToolAsJSON(tool: DynamicTool): string {
    return JSON.stringify(tool, null, 2)
  }

  /**
   * Export tool as TypeScript
   */
  static exportToolAsTypeScript(tool: DynamicTool): string {
    return `import { DynamicTool } from '@/lib/tool-migration-utility'

export const ${tool.id.replace(/-/g, '_')}: DynamicTool = ${JSON.stringify(tool, null, 2)}`
  }

  /**
   * Batch migrate tools
   */
  static async batchMigrate(toolPaths: string[], toolConfigs: any[]): Promise<{
    tools: DynamicTool[]
    report: ReturnType<typeof ToolMigrationUtility.generateMigrationReport>
  }> {
    const results = toolPaths.map((path, index) => {
      const original = toolConfigs[index]
      const migrated = this.migrateTool(path, original)
      const validation = this.validateTool(migrated)
      
      return {
        path,
        original,
        migrated,
        valid: validation.valid,
        errors: validation.errors
      }
    })

    const validTools = results.filter(r => r.valid).map(r => r.migrated)
    const report = this.generateMigrationReport(results)

    return { tools: validTools, report }
  }
}