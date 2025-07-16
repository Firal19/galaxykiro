/**
 * Content Review System for Terminology Consistency
 * 
 * This system helps maintain consistent, encouraging, and growth-focused language
 * throughout the Galaxy Dream Team platform by scanning content for terminology
 * that should be avoided or replaced with more positive alternatives.
 */

// Terms to avoid and their preferred alternatives
export const TERMINOLOGY_GUIDELINES = {
  // Avoid negative/limiting language
  discouraged: [
    'breakthrough', // Use: transformation, growth, development, progress
    'fail', 'failure', 'failed', // Use: learn, grow, develop, improve
    'stuck', // Use: exploring, developing, growing
    'problem', 'issue', // Use: opportunity, challenge, area for growth
    'wrong', 'bad', 'negative', // Use: different approach, area for improvement
    'can\'t', 'impossible', // Use: challenging, developing the ability to
    'never', 'always' // Use: rarely, often, frequently
  ],
  
  // Preferred growth-focused alternatives
  encouraged: [
    'transformation', 'growth', 'development', 'progress',
    'opportunity', 'potential', 'possibility',
    'learn', 'discover', 'explore', 'develop',
    'challenge', 'journey', 'path', 'process',
    'improve', 'enhance', 'strengthen', 'build',
    'achieve', 'accomplish', 'create', 'realize'
  ]
}

// Content categories that require review
export const CONTENT_CATEGORIES = [
  'components', // React components
  'messages', // Translation files
  'content', // Static content
  'assessments', // Assessment questions and results
  'ctas', // Call-to-action text
  'emails', // Email templates
  'notifications' // User-facing notifications
]

// Review result interface
export interface ReviewResult {
  file: string
  line: number
  column: number
  term: string
  context: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
  category: string
}

// Content review configuration
export interface ReviewConfig {
  includePatterns: string[]
  excludePatterns: string[]
  customTerms?: {
    discouraged: string[]
    encouraged: string[]
  }
  contextWindow: number // Number of characters around the term to show
}

class ContentReviewSystem {
  private config: ReviewConfig
  private guidelines: typeof TERMINOLOGY_GUIDELINES

  constructor(config: ReviewConfig) {
    this.config = config
    this.guidelines = {
      ...TERMINOLOGY_GUIDELINES,
      ...(config.customTerms && {
        discouraged: [...TERMINOLOGY_GUIDELINES.discouraged, ...config.customTerms.discouraged],
        encouraged: [...TERMINOLOGY_GUIDELINES.encouraged, ...config.customTerms.encouraged]
      })
    }
  }

  /**
   * Review content for terminology consistency
   */
  reviewContent(content: string, filePath: string): ReviewResult[] {
    const results: ReviewResult[] = []
    const lines = content.split('\n')

    lines.forEach((line, lineIndex) => {
      this.guidelines.discouraged.forEach(term => {
        const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi')
        let match

        while ((match = regex.exec(line)) !== null) {
          const context = this.getContext(line, match.index, this.config.contextWindow)
          const suggestion = this.getSuggestion(term)
          const severity = this.getSeverity(term, context)
          const category = this.getCategory(filePath)

          results.push({
            file: filePath,
            line: lineIndex + 1,
            column: match.index + 1,
            term,
            context,
            severity,
            suggestion,
            category
          })
        }
      })
    })

    return results
  }

  /**
   * Get context around a term
   */
  private getContext(line: string, index: number, windowSize: number): string {
    const start = Math.max(0, index - windowSize)
    const end = Math.min(line.length, index + windowSize)
    return line.substring(start, end)
  }

  /**
   * Get suggestion for replacing a discouraged term
   */
  private getSuggestion(term: string): string {
    const suggestions: { [key: string]: string } = {
      'breakthrough': 'transformation, growth, or development',
      'fail': 'learn or grow',
      'failure': 'learning opportunity or growth experience',
      'failed': 'learned or grew',
      'stuck': 'exploring options or developing',
      'problem': 'opportunity or challenge',
      'issue': 'area for growth or opportunity',
      'wrong': 'different approach or alternative',
      'bad': 'area for improvement',
      'negative': 'challenging or area for growth',
      'can\'t': 'developing the ability to',
      'impossible': 'challenging or requires development',
      'never': 'rarely or infrequently',
      'always': 'often or frequently'
    }

    return suggestions[term.toLowerCase()] || 'consider more positive phrasing'
  }

  /**
   * Determine severity of terminology issue
   */
  private getSeverity(term: string, context: string): 'high' | 'medium' | 'low' {
    // High severity for user-facing content
    if (context.includes('title') || context.includes('description') || 
        context.includes('cta') || context.includes('message')) {
      return 'high'
    }

    // Medium severity for assessment content
    if (context.includes('assessment') || context.includes('result') || 
        context.includes('insight')) {
      return 'medium'
    }

    // Low severity for technical content
    return 'low'
  }

  /**
   * Determine content category
   */
  private getCategory(filePath: string): string {
    if (filePath.includes('components')) return 'components'
    if (filePath.includes('messages')) return 'messages'
    if (filePath.includes('assessment')) return 'assessments'
    if (filePath.includes('email')) return 'emails'
    if (filePath.includes('notification')) return 'notifications'
    return 'content'
  }

  /**
   * Escape regex special characters
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * Generate review report
   */
  generateReport(results: ReviewResult[]): string {
    if (results.length === 0) {
      return '✅ No terminology issues found! Content follows growth-focused language guidelines.'
    }

    const report = ['📝 Content Terminology Review Report', '']
    
    // Summary
    const highSeverity = results.filter(r => r.severity === 'high').length
    const mediumSeverity = results.filter(r => r.severity === 'medium').length
    const lowSeverity = results.filter(r => r.severity === 'low').length

    report.push(`📊 Summary:`)
    report.push(`   🔴 High Priority: ${highSeverity} issues`)
    report.push(`   🟡 Medium Priority: ${mediumSeverity} issues`)
    report.push(`   🟢 Low Priority: ${lowSeverity} issues`)
    report.push(`   📁 Total Files: ${new Set(results.map(r => r.file)).size}`)
    report.push('')

    // Group by severity
    const groupedResults = {
      high: results.filter(r => r.severity === 'high'),
      medium: results.filter(r => r.severity === 'medium'),
      low: results.filter(r => r.severity === 'low')
    }

    Object.entries(groupedResults).forEach(([severity, items]) => {
      if (items.length === 0) return

      const icon = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢'
      report.push(`${icon} ${severity.toUpperCase()} PRIORITY ISSUES:`)
      report.push('')

      items.forEach(result => {
        report.push(`   📄 ${result.file}:${result.line}:${result.column}`)
        report.push(`   🎯 Term: "${result.term}"`)
        report.push(`   📝 Context: "${result.context}"`)
        report.push(`   💡 Suggestion: ${result.suggestion}`)
        report.push(`   🏷️  Category: ${result.category}`)
        report.push('')
      })
    })

    // Guidelines reminder
    report.push('📋 TERMINOLOGY GUIDELINES:')
    report.push('')
    report.push('✅ USE (Growth-focused language):')
    this.guidelines.encouraged.forEach(term => {
      report.push(`   • ${term}`)
    })
    report.push('')
    report.push('❌ AVOID (Limiting language):')
    this.guidelines.discouraged.forEach(term => {
      report.push(`   • ${term}`)
    })

    return report.join('\n')
  }

  /**
   * Check if content follows guidelines
   */
  isContentCompliant(content: string, filePath: string): boolean {
    const results = this.reviewContent(content, filePath)
    return results.filter(r => r.severity === 'high').length === 0
  }

  /**
   * Get positive language suggestions
   */
  getPositiveAlternatives(term: string): string[] {
    const alternatives: { [key: string]: string[] } = {
      'breakthrough': ['transformation', 'growth', 'development', 'progress', 'advancement'],
      'fail': ['learn', 'grow', 'develop', 'improve', 'discover'],
      'stuck': ['exploring', 'developing', 'growing', 'progressing', 'evolving'],
      'problem': ['opportunity', 'challenge', 'growth area', 'development focus'],
      'wrong': ['different approach', 'alternative method', 'new direction'],
      'bad': ['area for improvement', 'growth opportunity', 'development area']
    }

    return alternatives[term.toLowerCase()] || this.guidelines.encouraged.slice(0, 5)
  }
}

// Default configuration for the Galaxy Dream Team platform
export const DEFAULT_REVIEW_CONFIG: ReviewConfig = {
  includePatterns: [
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md'
  ],
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**'
  ],
  contextWindow: 50
}

// Export singleton instance
export const contentReviewSystem = new ContentReviewSystem(DEFAULT_REVIEW_CONFIG)

// Utility functions for easy use
export const reviewFunctions = {
  /**
   * Quick review of a single piece of content
   */
  quickReview: (content: string, filePath: string = 'content') => {
    return contentReviewSystem.reviewContent(content, filePath)
  },

  /**
   * Check if text is compliant with guidelines
   */
  isCompliant: (content: string, filePath: string = 'content') => {
    return contentReviewSystem.isContentCompliant(content, filePath)
  },

  /**
   * Get suggestions for better phrasing
   */
  getSuggestions: (term: string) => {
    return contentReviewSystem.getPositiveAlternatives(term)
  },

  /**
   * Generate a report for multiple content pieces
   */
  generateReport: (contentPieces: { content: string; filePath: string }[]) => {
    const allResults: ReviewResult[] = []
    
    contentPieces.forEach(({ content, filePath }) => {
      const results = contentReviewSystem.reviewContent(content, filePath)
      allResults.push(...results)
    })

    return contentReviewSystem.generateReport(allResults)
  }
}

// Export types
export type { ReviewResult, ReviewConfig }