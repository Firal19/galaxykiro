'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Save, Share2 } from 'lucide-react'
import { z } from 'zod'

// Import question components
import SliderQuestion from './questions/SliderQuestion'
import TextInputQuestion from './questions/TextInputQuestion'
import RankingQuestion from './questions/RankingQuestion'
import BinaryQuestion from './questions/BinaryQuestion'
import EmojiScaleQuestion from './questions/EmojiScaleQuestion'
import ScenarioQuestion from './questions/ScenarioQuestion'

// Import results and loading components
import { ResultsDisplay } from './results/ResultsDisplay'
import { LoadingScreen } from './ui/LoadingScreen'
import { ErrorDisplay } from './ui/ErrorDisplay'

// Import types and utilities
import type { DynamicTool } from '@/lib/tool-migration-utility'
import { cn } from '@/lib/utils'
// import { useAssessmentStore } from '@/lib/stores/assessment-store' // TODO: Create assessment store
import { useLeadScoring, useScoreUpdater } from '@/lib/hooks/use-lead-scoring'

interface DynamicAssessmentEngineProps {
  tool: DynamicTool
  onComplete?: (results: AssessmentResults) => void
  className?: string
}

interface AssessmentResults {
  toolId: string
  overallScore: number
  categoryScores?: Record<string, number>
  threshold: DynamicTool['scoringConfig']['thresholds'][0]
  responses: Record<string, any>
  completedAt: string
}

export function DynamicAssessmentEngine({ 
  tool, 
  onComplete,
  className 
}: DynamicAssessmentEngineProps) {
  const router = useRouter()
  const { addToolUsagePoints } = useLeadScoring()
  const { triggerScoreUpdate } = useScoreUpdater()
  // const { saveProgress, loadProgress, clearProgress } = useAssessmentStore() // TODO: Implement assessment store
  const saveProgress = () => {} // Placeholder
  const loadProgress = () => {} // Placeholder
  const clearProgress = () => {} // Placeholder
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [startTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<AssessmentResults | null>(null)

  const currentQuestion = tool.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / tool.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === tool.questions.length - 1

  // Load saved progress on mount
  useEffect(() => {
    // const savedProgress = loadProgress(tool.id) // TODO: Implement assessment store
    // if (savedProgress) {
    //   setResponses(savedProgress.responses)
    //   setCurrentQuestionIndex(savedProgress.currentQuestionIndex)
    // }
  }, [tool.id])

  // Save progress when responses change
  useEffect(() => {
    // if (Object.keys(responses).length > 0 && tool.progressSaving) {
    //   saveProgress(tool.id, {
    //     responses,
    //     currentQuestionIndex,
    //     lastUpdated: new Date().toISOString()
    //   })
    // }
  }, [responses, currentQuestionIndex, tool.id])

  const handleResponseChange = useCallback((value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }, [currentQuestion.id])

  const calculateResults = useCallback((): AssessmentResults => {
    let overallScore = 0
    const categoryScores: Record<string, number> = {}
    const categoryWeights: Record<string, number> = {}
    const categoryMaxScores: Record<string, number> = {}

    // Calculate scores based on scoring type
    tool.questions.forEach(question => {
      const response = responses[question.id]
      if (!response) return

      let questionScore = 0
      const weight = question.weight || 1

      // Calculate base score based on question type
      switch (question.type) {
        case 'scale':
        case 'slider':
          const max = question.validation?.max || 10
          const min = question.validation?.min || 1
          questionScore = ((response - min) / (max - min)) * 100
          break
        
        case 'multiple_choice':
        case 'binary':
        case 'scenario':
          // Assign scores based on option values
          if (question.options) {
            const selectedOption = question.options.find(opt => opt.value === response)
            if (selectedOption) {
              // Use option index as score if no explicit scoring
              const optionIndex = question.options.indexOf(selectedOption)
              questionScore = ((optionIndex + 1) / question.options.length) * 100
            }
          }
          break
        
        case 'emoji_scale':
          if (question.options) {
            questionScore = (response / question.options.length) * 100
          }
          break
        
        case 'ranking':
          // Ranking questions are complex, assign base score
          questionScore = 70 // Default moderate score
          break
        
        case 'text_input':
          // Text inputs get full score if answered
          questionScore = response.length >= (question.validation?.minLength || 1) ? 100 : 50
          break
      }

      // Apply weight
      const weightedScore = questionScore * weight

      // Add to category if specified
      if (question.category && tool.scoringConfig.type === 'category') {
        categoryScores[question.category] = (categoryScores[question.category] || 0) + weightedScore
        categoryWeights[question.category] = (categoryWeights[question.category] || 0) + weight
        categoryMaxScores[question.category] = (categoryMaxScores[question.category] || 0) + (100 * weight)
      } else {
        // Add to overall score directly
        overallScore += weightedScore
      }
    })

    // Calculate final scores
    if (tool.scoringConfig.type === 'category' && tool.scoringConfig.categories) {
      // Average category scores with category weights
      tool.scoringConfig.categories.forEach(category => {
        if (categoryScores[category.id] && categoryMaxScores[category.id]) {
          const normalizedScore = (categoryScores[category.id] / categoryMaxScores[category.id]) * 100
          categoryScores[category.id] = Math.round(normalizedScore)
          overallScore += normalizedScore * (category.weight || 1)
        }
      })
      
      // Normalize overall score
      const totalCategoryWeight = tool.scoringConfig.categories.reduce((sum, cat) => sum + (cat.weight || 1), 0)
      overallScore = Math.round(overallScore / totalCategoryWeight)
    } else {
      // Simple or weighted scoring
      const maxPossibleScore = tool.questions.reduce((sum, q) => sum + (100 * (q.weight || 1)), 0)
      overallScore = Math.round((overallScore / maxPossibleScore) * 100)
    }

    // Find appropriate threshold
    const threshold = tool.scoringConfig.thresholds.find(
      t => overallScore >= t.min && overallScore <= t.max
    ) || tool.scoringConfig.thresholds[0]

    return {
      toolId: tool.id,
      overallScore,
      categoryScores: tool.scoringConfig.type === 'category' ? categoryScores : undefined,
      threshold,
      responses,
      completedAt: new Date().toISOString()
    }
  }, [responses, tool])

  const handleNext = useCallback(async () => {
    // Validate current response
    const response = responses[currentQuestion.id]
    if (currentQuestion.required && !response) {
      setError('Please answer this question before continuing')
      return
    }

    // Track question completion
    const timeSpent = Date.now() - questionStartTime
    triggerScoreUpdate('assessment_question', {
      toolId: tool.id,
      questionId: currentQuestion.id,
      questionType: currentQuestion.type,
      timeSpent: Math.round(timeSpent / 1000)
    })

    if (isLastQuestion) {
      // Complete assessment
      setIsLoading(true)
      try {
        const assessmentResults = calculateResults()
        setResults(assessmentResults)
        
        // Track completion
        await addToolUsagePoints(tool.id)
        triggerScoreUpdate('tool_completed', {
          toolId: tool.id,
          score: assessmentResults.overallScore,
          timeSpent: Math.round((Date.now() - startTime) / 1000),
          questionsAnswered: Object.keys(responses).length
        })
        
        // Clear saved progress
        // if (tool.progressSaving) {
        //   clearProgress(tool.id)
        // }
        
        // Call completion callback
        if (onComplete) {
          onComplete(assessmentResults)
        }
        
        setShowResults(true)
      } catch (err) {
        setError('Failed to calculate results. Please try again.')
        console.error('Assessment error:', err)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1)
      setQuestionStartTime(Date.now())
      setError(null)
    }
  }, [currentQuestion, responses, isLastQuestion, calculateResults, addToolUsagePoints, triggerScoreUpdate, tool, startTime, questionStartTime, onComplete])

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setQuestionStartTime(Date.now())
      setError(null)
    }
  }, [currentQuestionIndex])

  const renderQuestion = () => {
    const value = responses[currentQuestion.id]
    
    switch (currentQuestion.type) {
      case 'slider':
        return (
          <SliderQuestion
            question={currentQuestion}
            value={value}
            onChange={handleResponseChange}
          />
        )
      
      case 'text_input':
        return (
          <TextInputQuestion
            question={currentQuestion}
            value={value}
            onChange={handleResponseChange}
          />
        )
      
      case 'ranking':
        return (
          <RankingQuestion
            question={currentQuestion}
            value={value}
            onChange={handleResponseChange}
          />
        )
      
      case 'binary':
        return (
          <BinaryQuestion
            question={currentQuestion}
            value={value}
            onChange={handleResponseChange}
          />
        )
      
      case 'emoji_scale':
        return (
          <EmojiScaleQuestion
            question={currentQuestion}
            value={value}
            onChange={handleResponseChange}
          />
        )
      
      case 'scenario':
        return (
          <ScenarioQuestion
            question={currentQuestion}
            value={value}
            onChange={handleResponseChange}
          />
        )
      
      case 'multiple_choice':
      case 'scale':
      default:
        // Default to multiple choice rendering
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponseChange(option.value)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all",
                  value === option.value
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Calculating your results..." />
  }

  if (showResults && results) {
    return (
      <ResultsDisplay
        result={results}
        tool={tool}
        onShare={() => {
          // Implement share functionality
          console.log('Share results')
        }}
        onRetake={() => {
          setResponses({})
          setCurrentQuestionIndex(0)
          setShowResults(false)
          setResults(null)
          setError(null)
        }}
      />
    )
  }

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      <Card className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{tool.title}</h1>
          <p className="text-gray-600">{tool.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {tool.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-2">
              {currentQuestion.text}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 mb-6">{currentQuestion.description}</p>
            )}
            
            {renderQuestion()}
            
            {error && (
              <p className="text-red-500 text-sm mt-4">{error}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="ml-auto"
          >
            {isLastQuestion ? 'Complete' : 'Next'}
            {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  )
}