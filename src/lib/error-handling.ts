/**
 * Centralized Error Handling Utilities
 * 
 * Provides consistent error handling, logging, and user feedback across the application
 */

// Error types
export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER_ERROR = 'server_error',
  CLIENT_ERROR = 'client_error',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface AppError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  userMessage?: string
  details?: Record<string, unknown>
  timestamp: Date
  userId?: string
  context?: string
  stack?: string
}

export interface ErrorHandlerOptions {
  showToUser?: boolean
  logToConsole?: boolean
  reportToService?: boolean
  fallbackMessage?: string
  context?: string
}

// Error logging service interface
interface ErrorLogger {
  log: (error: AppError) => void
  report: (error: AppError) => Promise<void>
}

// Default error logger implementation
class ConsoleErrorLogger implements ErrorLogger {
  log(error: AppError): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.type.toUpperCase()} ERROR [${error.severity}]`)
      console.error('Message:', error.message)
      console.error('User Message:', error.userMessage)
      console.error('Context:', error.context)
      console.error('Details:', error.details)
      if (error.stack) {
        console.error('Stack:', error.stack)
      }
      console.groupEnd()
    }
  }

  async report(error: AppError): Promise<void> {
    // In a real application, this would send to an error reporting service
    // like Sentry, LogRocket, or custom backend
    if (process.env.NODE_ENV === 'production' && error.severity === ErrorSeverity.CRITICAL) {
      // Report critical errors in production
      try {
        // await reportToExternalService(error)
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError)
      }
    }
  }
}

// Error handler class
class ErrorHandler {
  private logger: ErrorLogger
  private errorQueue: AppError[] = []
  private maxQueueSize = 100

  constructor(logger: ErrorLogger = new ConsoleErrorLogger()) {
    this.logger = logger
  }

  // Create standardized error
  createError(
    type: ErrorType,
    message: string,
    options: {
      severity?: ErrorSeverity
      userMessage?: string
      details?: Record<string, unknown>
      context?: string
      userId?: string
      originalError?: Error
    } = {}
  ): AppError {
    const error: AppError = {
      id: this.generateErrorId(),
      type,
      severity: options.severity || ErrorSeverity.MEDIUM,
      message,
      userMessage: options.userMessage || this.getDefaultUserMessage(type),
      details: options.details,
      timestamp: new Date(),
      userId: options.userId,
      context: options.context,
      stack: options.originalError?.stack
    }

    return error
  }

  // Handle error with specified options
  async handleError(
    error: Error | AppError,
    options: ErrorHandlerOptions = {}
  ): Promise<AppError> {
    const appError = this.normalizeError(error, options)
    
    // Add to queue
    this.addToQueue(appError)
    
    // Log error
    if (options.logToConsole !== false) {
      this.logger.log(appError)
    }
    
    // Report to external service
    if (options.reportToService === true) {
      await this.logger.report(appError)
    }
    
    return appError
  }

  // Handle async operations with error boundary
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string,
    options: ErrorHandlerOptions = {}
  ): Promise<{ data: T | null; error: AppError | null }> {
    try {
      const data = await operation()
      return { data, error: null }
    } catch (error) {
      const appError = await this.handleError(error as Error, {
        ...options,
        context
      })
      return { data: null, error: appError }
    }
  }

  // Handle sync operations with error boundary
  withSyncErrorHandling<T>(
    operation: () => T,
    context: string,
    options: ErrorHandlerOptions = {}
  ): { data: T | null; error: AppError | null } {
    try {
      const data = operation()
      return { data, error: null }
    } catch (error) {
      const appError = this.createError(
        ErrorType.CLIENT_ERROR,
        (error as Error).message,
        {
          context,
          originalError: error as Error,
          ...options
        }
      )
      
      this.logger.log(appError)
      return { data: null, error: appError }
    }
  }

  // Get recent errors
  getRecentErrors(limit = 10): AppError[] {
    return this.errorQueue.slice(-limit)
  }

  // Clear error queue
  clearErrors(): void {
    this.errorQueue = []
  }

  // Private methods
  private normalizeError(error: Error | AppError, options: ErrorHandlerOptions): AppError {
    if (this.isAppError(error)) {
      return error
    }

    // Determine error type from error message/properties
    const errorType = this.categorizeError(error)
    const severity = this.determineSeverity(error, errorType)

    return this.createError(errorType, error.message, {
      severity,
      context: options.context,
      originalError: error,
      userMessage: options.fallbackMessage
    })
  }

  private isAppError(error: unknown): error is AppError {
    return typeof error === 'object' && error !== null && 'type' in error && 'severity' in error
  }

  private categorizeError(error: Error): ErrorType {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return ErrorType.AUTHENTICATION
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return ErrorType.AUTHORIZATION
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorType.NOT_FOUND
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION
    }
    if (message.includes('server') || message.includes('500')) {
      return ErrorType.SERVER_ERROR
    }
    
    return ErrorType.UNKNOWN
  }

  private determineSeverity(error: Error, type: ErrorType): ErrorSeverity {
    // Critical errors that need immediate attention
    if (type === ErrorType.SERVER_ERROR || error.name === 'ChunkLoadError') {
      return ErrorSeverity.CRITICAL
    }
    
    // High severity errors
    if (type === ErrorType.AUTHENTICATION || type === ErrorType.AUTHORIZATION) {
      return ErrorSeverity.HIGH
    }
    
    // Medium severity errors
    if (type === ErrorType.NETWORK || type === ErrorType.VALIDATION) {
      return ErrorSeverity.MEDIUM
    }
    
    // Default to low severity
    return ErrorSeverity.LOW
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages = {
      [ErrorType.VALIDATION]: 'Please check your input and try again.',
      [ErrorType.NETWORK]: 'Connection error. Please check your internet connection.',
      [ErrorType.AUTHENTICATION]: 'Please sign in to continue.',
      [ErrorType.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
      [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorType.SERVER_ERROR]: 'Server error. Please try again later.',
      [ErrorType.CLIENT_ERROR]: 'Something went wrong. Please try again.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    }
    
    return messages[type] || messages[ErrorType.UNKNOWN]
  }

  private generateErrorId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  private addToQueue(error: AppError): void {
    this.errorQueue.push(error)
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize)
    }
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler()

// Convenience functions
export const handleError = (error: Error | AppError, options?: ErrorHandlerOptions) => 
  errorHandler.handleError(error, options)

export const withErrorHandling = <T>(
  operation: () => Promise<T>,
  context: string,
  options?: ErrorHandlerOptions
) => errorHandler.withErrorHandling(operation, context, options)

export const withSyncErrorHandling = <T>(
  operation: () => T,
  context: string,
  options?: ErrorHandlerOptions
) => errorHandler.withSyncErrorHandling(operation, context, options)

export const createError = (
  type: ErrorType,
  message: string,
  options?: Parameters<typeof errorHandler.createError>[2]
) => errorHandler.createError(type, message, options)

// React hook for error handling
export function useErrorHandler() {
  return {
    handleError: errorHandler.handleError.bind(errorHandler),
    withErrorHandling: errorHandler.withErrorHandling.bind(errorHandler),
    withSyncErrorHandling: errorHandler.withSyncErrorHandling.bind(errorHandler),
    createError: errorHandler.createError.bind(errorHandler),
    getRecentErrors: errorHandler.getRecentErrors.bind(errorHandler),
    clearErrors: errorHandler.clearErrors.bind(errorHandler)
  }
}