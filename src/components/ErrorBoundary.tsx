'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service (Sentry, etc.)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription>
                We encountered an unexpected error. This has been logged and we'll look into it.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>
              
              <Button 
                onClick={this.handleGoHome}
                className="w-full"
                variant="ghost"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>

              {/* Error details for development */}
              {(this.props.showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <summary className="cursor-pointer font-medium text-sm text-gray-700 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Error Message:</p>
                      <p className="text-sm text-red-600 font-mono">{this.state.error.message}</p>
                    </div>
                    
                    {this.state.error.stack && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Stack Trace:</p>
                        <pre className="text-xs text-gray-600 overflow-x-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Component Stack:</p>
                        <pre className="text-xs text-gray-600 overflow-x-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Specialized error boundaries for different contexts
export function AdminErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log admin-specific errors
        console.error('Admin Error:', error, errorInfo)
      }}
      fallback={
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Admin Panel Error</h3>
          <p className="text-gray-600 mb-4">Something went wrong in the admin panel.</p>
          <Button onClick={() => window.location.reload()}>
            Reload Admin Panel
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export function AssessmentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log assessment-specific errors
        console.error('Assessment Error:', error, errorInfo)
      }}
      fallback={
        <div className="p-8 text-center max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Assessment Error</h3>
          <p className="text-gray-600 mb-4">We couldn't load this assessment. Your progress has been saved.</p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
            <Button onClick={() => window.location.href = '/tools'} variant="outline" className="w-full">
              Back to Tools
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}