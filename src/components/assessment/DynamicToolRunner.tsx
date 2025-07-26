/**
 * DynamicToolRunner - Main component for running dynamic assessment tools
 */

"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuestionRenderer } from './questions/QuestionRenderer'
import { ResultsDisplay } from './results/ResultsDisplay'
import { LoadingScreen } from './ui/LoadingScreen'
import { ErrorDisplay } from './ui/ErrorDisplay'
import { LeadCaptureModal } from '@/components/lead-capture-modal'
import { assessmentService } from '@/services/assessment/AssessmentService'
import { useLeadService } from '@/components/providers/ServiceProvider'
import {
  ToolConfiguration,
  AssessmentSession,
  AssessmentResponse,
  AssessmentResult
} from '@/services/assessment/AssessmentTypes'

interface DynamicToolRunnerProps {
  toolId: string
  userId?: string
  onComplete?: (result: AssessmentResult) => void
  onError?: (error: Error) => void
  className?: string
}

type RunnerState = 'loading' | 'lead_capture' | 'running' | 'processing' | 'results' | 'error'

export function DynamicToolRunner({
  toolId,
  userId,
  onComplete,
  onError,
  className
}: DynamicToolRunnerProps) {
  // State management
  const [state, setState] = useState<RunnerState>('loading')
  const [config, setConfig] = useState<ToolConfiguration | null>(null)
  const [session, setSession] = useState<AssessmentSession | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const [startTime, setStartTime] = useState<number>(0)

  const leadService = useLeadService()

  // Initialize tool
  useEffect(() => {
    initializeTool()
  }, [toolId])

  const initializeTool = async () => {
    try {
      setState('loading')
      setError(null)

      // Load tool configuration
      const toolConfig = await assessmentService.getToolConfiguration(toolId)
      setConfig(toolConfig)

      // Check if lead capture is required before tool
      if (toolConfig.leadCapture.beforeTool && !userId && !userEmail) {
        setState('lead_capture')
        return
      }

      // Start assessment session
      await startSession(toolConfig)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize tool'
      setError(errorMessage)
      setState('error')
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    }
  }

  const startSession = async (toolConfig: ToolConfiguration) => {
    try {
      // Track tool start
      await leadService.trackEngagement('tool_usage', {
        toolId,
        toolName: toolConfig.name.en,
        userEmail
      })

      // Create assessment session
      const newSession = await assessmentService.startSession(toolId, userId)
      setSession(newSession)
      setStartTime(Date.now())
      setState('running')
    } catch (err) {
      throw new Error(`Failed to start session: ${err}`)
    }
  }

  // Handle lead capture completion
  const handleLeadCapture = async (email: string) => {
    setUserEmail(email)
    
    // Track email capture
    await leadService.trackEngagement('email_captured', {
      email,
      source: `tool_${toolId}`,
      entryPoint: 'assessment-tool'
    })

    if (config) {
      await startSession(config)
    }
  }

  // Handle question response
  const handleResponse = useCallback(async (value: any) => {
    if (!session || !config) return

    const currentQuestion = config.questions[currentQuestionIndex]
    if (!currentQuestion) return

    try {
      const response: AssessmentResponse = {
        questionId: currentQuestion.id,
        value,
        timestamp: new Date().toISOString(),
        timeSpent: Math.round((Date.now() - startTime) / 1000)
      }

      // Save response to session
      await assessmentService.saveResponse(session.id, response)
      
      // Update local state
      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }))

      // Track response
      await leadService.trackEngagement('content_engagement', {
        action: 'question_answered',
        toolId,
        questionId: currentQuestion.id,
        questionIndex: currentQuestionIndex
      })

    } catch (err) {
      console.error('Failed to save response:', err)
    }
  }, [session, config, currentQuestionIndex, startTime, toolId, leadService])

  // Navigate to next question
  const handleNext = useCallback(() => {
    if (!config) return

    if (currentQuestionIndex < config.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Complete assessment
      completeAssessment()
    }
  }, [config, currentQuestionIndex])

  // Navigate to previous question
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex])

  // Complete assessment and process results
  const completeAssessment = async () => {
    if (!session || !config) return

    try {
      setState('processing')

      // Track completion
      await leadService.trackEngagement('assessment_completed', {
        toolId,
        toolName: config.name.en,
        totalTime: Math.round((Date.now() - startTime) / 1000),
        questionsAnswered: Object.keys(responses).length,
        userEmail
      })

      // Process results
      const assessmentResult = await assessmentService.processResults(session.id)
      setResult(assessmentResult)
      setState('results')

      // Handle post-tool lead capture
      if (config.leadCapture.afterTool && !userId && !userEmail) {
        // Show lead capture modal with results
        // This would be handled by the parent component
      }

      onComplete?.(assessmentResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process results'
      setError(errorMessage)
      setState('error')
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    }
  }

  // Handle retake
  const handleRetake = () => {
    setCurrentQuestionIndex(0)
    setResponses({})
    setResult(null)
    initializeTool()
  }

  // Render based on current state
  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <LoadingScreen 
            message="Loading assessment..."
            progress={0}
          />
        )

      case 'lead_capture':
        return (
          <LeadCaptureModal
            isOpen={true}
            onClose={() => setState('error')}
            onEmailCapture={handleLeadCapture}
            title="Start Your Assessment"
            description="Enter your email to begin your personalized assessment journey."
          />
        )

      case 'running':
        if (!config || !session) return null

        const currentQuestion = config.questions[currentQuestionIndex]
        const progress = ((currentQuestionIndex + 1) / config.questions.length) * 100

        return (
          <QuestionRenderer
            question={currentQuestion}
            value={responses[currentQuestion.id]}
            onChange={handleResponse}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === config.questions.length - 1}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={config.questions.length}
            progress={progress}
          />
        )

      case 'processing':
        return (
          <LoadingScreen 
            message="Processing your results..."
            progress={100}
            showSpinner={true}
          />
        )

      case 'results':
        if (!result || !config) return null

        return (
          <ResultsDisplay
            result={result}
            config={config}
            onRetake={config.allowRetake ? handleRetake : undefined}
            onShare={() => {
              // Handle sharing
              console.log('Share results:', result)
            }}
            onDownload={() => {
              // Handle download
              console.log('Download results:', result)
            }}
          />
        )

      case 'error':
        return (
          <ErrorDisplay
            message={error || 'An unexpected error occurred'}
            onRetry={initializeTool}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Tool Metadata (Development) */}
      {process.env.NODE_ENV === 'development' && config && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs">
          <div><strong>Tool:</strong> {config.name.en} (v{config.version})</div>
          <div><strong>State:</strong> {state}</div>
          <div><strong>Progress:</strong> {currentQuestionIndex + 1}/{config.questions.length}</div>
          <div><strong>Responses:</strong> {Object.keys(responses).length}</div>
          {session && <div><strong>Session:</strong> {session.id}</div>}
        </div>
      )}
    </div>
  )
}