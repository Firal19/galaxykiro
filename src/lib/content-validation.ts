/**
 * Content validation utilities for enforcing Value Escalator format,
 * content quality standards, and security measures
 */

import DOMPurify from 'isomorphic-dompurify';

interface ValueEscalatorContent {
  hook: string
  insight: string
  application: string
  hungerBuilder: string
  nextStep: string
}

interface ValidationResult {
  isValid: boolean
  messages: string[]
}

/**
 * Security utilities for content sanitization
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
  });
}

/**
 * Sanitizes plain text input
 * @param input Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(input: string): string {
  // Remove any potentially dangerous characters
  return input.replace(/[<>]/g, '');
}

/**
 * Sanitizes an object's string properties recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    }
  });
  
  return result;
}

/**
 * Validates content against the Value Escalator format requirements
 */
export function validateValueEscalator(content: ValueEscalatorContent): ValidationResult {
  const messages: string[] = []
  
  // Check minimum lengths
  if (content.hook.length < 20) {
    messages.push('Hook should be at least 20 characters to effectively capture attention')
  }
  
  if (content.insight.length < 30) {
    messages.push('Insight should be at least 30 characters to provide meaningful information')
  }
  
  if (content.application.length < 30) {
    messages.push('Application should be at least 30 characters to provide actionable guidance')
  }
  
  if (content.hungerBuilder.length < 20) {
    messages.push('Hunger Builder should be at least 20 characters to create desire for more')
  }
  
  if (content.nextStep.length < 20) {
    messages.push('Next Step should be at least 20 characters to provide clear direction')
  }
  
  // Check for question in hook (common pattern)
  if (!content.hook.includes('?') && content.hook.length < 60) {
    messages.push('Consider adding a question in your hook to increase engagement')
  }
  
  // Check for action words in application
  const actionWords = ['use', 'apply', 'try', 'implement', 'practice', 'start', 'create', 'build', 'develop']
  if (!actionWords.some(word => content.application.toLowerCase().includes(word))) {
    messages.push('Application should include action words (use, apply, try, implement, etc.)')
  }
  
  // Check for future-focused language in hunger builder
  const futureWords = ['imagine', 'what if', 'could', 'would', 'future', 'potential', 'possibility', 'transform']
  if (!futureWords.some(word => content.hungerBuilder.toLowerCase().includes(word))) {
    messages.push('Hunger Builder should include future-focused language to create desire')
  }
  
  // Check for clear CTA in next step
  const ctaWords = ['get', 'download', 'access', 'start', 'join', 'register', 'complete', 'take', 'book']
  if (!ctaWords.some(word => content.nextStep.toLowerCase().includes(word))) {
    messages.push('Next Step should include a clear call-to-action')
  }
  
  return {
    isValid: messages.length === 0,
    messages
  }
}

/**
 * Validates content length based on depth level
 */
export function validateContentLength(content: string, depthLevel: 'surface' | 'medium' | 'deep'): ValidationResult {
  const messages: string[] = []
  const contentLength = content.length
  
  if (depthLevel === 'surface' && contentLength < 300) {
    messages.push(`Surface content should be at least 300 characters (currently ${contentLength})`)
  } else if (depthLevel === 'medium' && contentLength < 1000) {
    messages.push(`Medium content should be at least 1000 characters (currently ${contentLength})`)
  } else if (depthLevel === 'deep' && contentLength < 2000) {
    messages.push(`Deep content should be at least 2000 characters (currently ${contentLength})`)
  }
  
  return {
    isValid: messages.length === 0,
    messages
  }
}

/**
 * Analyzes content quality and provides improvement suggestions
 */
export function analyzeContentQuality(content: string): ValidationResult {
  const messages: string[] = []
  
  // Check for paragraph length (readability)
  const paragraphs = content.split('\n\n')
  const longParagraphs = paragraphs.filter(p => p.length > 300).length
  
  if (longParagraphs > 0) {
    messages.push(`Found ${longParagraphs} paragraphs that are too long. Consider breaking them up for better readability.`)
  }
  
  // Check for heading structure
  const headings = content.match(/^#+\s.+$/gm) || []
  if (headings.length < 2 && content.length > 500) {
    messages.push('Consider adding more headings to structure your content better')
  }
  
  // Check for bullet points or numbered lists
  const hasBulletPoints = content.includes('- ') || content.includes('* ') || content.includes('1. ')
  if (!hasBulletPoints && content.length > 700) {
    messages.push('Consider adding bullet points or numbered lists to improve scanability')
  }
  
  // Check for engagement elements
  const hasQuestions = (content.match(/\?/g) || []).length
  if (hasQuestions < 2 && content.length > 1000) {
    messages.push('Consider adding more questions to engage the reader')
  }
  
  return {
    isValid: messages.length === 0,
    messages
  }
}

/**
 * Validates SEO metadata
 */
export function validateSEO(title: string, metaDescription: string, slug: string): ValidationResult {
  const messages: string[] = []
  
  if (title.length < 20) {
    messages.push('Title should be at least 20 characters for better SEO')
  }
  
  if (title.length > 70) {
    messages.push('Title should be no more than 70 characters for optimal display in search results')
  }
  
  if (metaDescription.length < 50) {
    messages.push('Meta description should be at least 50 characters for better SEO')
  }
  
  if (metaDescription.length > 160) {
    messages.push('Meta description should be no more than 160 characters for optimal display in search results')
  }
  
  if (slug.includes(' ')) {
    messages.push('Slug should not contain spaces')
  }
  
  if (slug.length > 60) {
    messages.push('Slug should be no more than 60 characters for better SEO')
  }
  
  return {
    isValid: messages.length === 0,
    messages
  }
}

/**
 * Comprehensive content validation with security sanitization
 */
export function validateContent(content: {
  title: string
  category: string
  depthLevel: 'surface' | 'medium' | 'deep'
  contentType: string
  hook: string
  insight: string
  application: string
  hungerBuilder: string
  nextStep: string
  content: string
  excerpt: string
  slug: string
  metaDescription: string
  tags: string[]
}): ValidationResult & { sanitizedContent: typeof content } {
  const messages: string[] = []
  
  // Value Escalator validation
  const valueEscalatorResult = validateValueEscalator({
    hook: content.hook,
    insight: content.insight,
    application: content.application,
    hungerBuilder: content.hungerBuilder,
    nextStep: content.nextStep
  })
  
  if (!valueEscalatorResult.isValid) {
    messages.push(...valueEscalatorResult.messages)
  }
  
  // Content length validation
  const contentLengthResult = validateContentLength(content.content, content.depthLevel)
  if (!contentLengthResult.isValid) {
    messages.push(...contentLengthResult.messages)
  }
  
  // Content quality analysis
  const qualityResult = analyzeContentQuality(content.content)
  if (!qualityResult.isValid) {
    messages.push(...qualityResult.messages)
  }
  
  // SEO validation
  const seoResult = validateSEO(content.title, content.metaDescription, content.slug)
  if (!seoResult.isValid) {
    messages.push(...seoResult.messages)
  }
  
  // Tags validation
  if (!content.tags || content.tags.length === 0) {
    messages.push('At least one tag is required for better content discoverability')
  }
  
  if (content.tags && content.tags.length > 10) {
    messages.push('Too many tags may dilute relevance. Consider using fewer, more focused tags.')
  }
  
  // Sanitize content for security
  const sanitizedContent = {
    ...content,
    title: sanitizeText(content.title),
    category: sanitizeText(content.category),
    contentType: sanitizeText(content.contentType),
    hook: sanitizeHtml(content.hook),
    insight: sanitizeHtml(content.insight),
    application: sanitizeHtml(content.application),
    hungerBuilder: sanitizeHtml(content.hungerBuilder),
    nextStep: sanitizeHtml(content.nextStep),
    content: sanitizeHtml(content.content),
    excerpt: sanitizeHtml(content.excerpt),
    slug: sanitizeText(content.slug),
    metaDescription: sanitizeText(content.metaDescription),
    tags: content.tags.map(tag => sanitizeText(tag))
  };
  
  return {
    isValid: messages.length === 0,
    messages,
    sanitizedContent
  }
}