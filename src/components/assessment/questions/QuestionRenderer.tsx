/**
 * QuestionRenderer - Dynamic question component renderer
 */

"use client"

import React, { lazy, Suspense } from 'react'
import { QuestionConfig, QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

// Lazy load question components for better performance
const MultipleChoiceQuestion = lazy(() => import('./MultipleChoiceQuestion'))
const LikertScaleQuestion = lazy(() => import('./LikertScaleQuestion'))
const SliderQuestion = lazy(() => import('./SliderQuestion'))
const TextInputQuestion = lazy(() => import('./TextInputQuestion'))
const RankingQuestion = lazy(() => import('./RankingQuestion'))
const BinaryQuestion = lazy(() => import('./BinaryQuestion'))
const EmojiScaleQuestion = lazy(() => import('./EmojiScaleQuestion'))
const ScenarioQuestion = lazy(() => import('./ScenarioQuestion'))

interface QuestionRendererProps extends QuestionComponentProps {
  questionNumber: number
  totalQuestions: number
  progress: number
  className?: string
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  error,
  questionNumber,
  totalQuestions,
  progress,
  className
}: QuestionRendererProps) {

  // Get the appropriate question component
  const getQuestionComponent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return MultipleChoiceQuestion
      case 'likert_scale':
        return LikertScaleQuestion
      case 'slider':
        return SliderQuestion
      case 'text_input':
        return TextInputQuestion
      case 'ranking':
        return RankingQuestion
      case 'binary':
        return BinaryQuestion
      case 'emoji_scale':
        return EmojiScaleQuestion
      case 'scenario':
        return ScenarioQuestion
      default:
        return MultipleChoiceQuestion // Fallback
    }
  }

  const QuestionComponent = getQuestionComponent()

  // Loading component for suspense
  const LoadingQuestion = () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-2xl mx-auto ${className}`}
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 shadow-lg">
        <div className="space-y-6">
          {/* Question Header */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {question.title.en}
            </h2>
            {question.description && (
              <p className="text-muted-foreground">
                {question.description.en}
              </p>
            )}
            {question.required && (
              <span className="text-xs text-red-500 mt-1 block">* Required</span>
            )}
          </div>

          {/* Dynamic Question Component */}
          <div className="min-h-[200px]">
            <Suspense fallback={<LoadingQuestion />}>
              <QuestionComponent
                question={question}
                value={value}
                onChange={onChange}
                onNext={onNext}
                onPrevious={onPrevious}
                isFirst={isFirst}
                isLast={isLast}
                error={error}
              />
            </Suspense>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirst}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {question.category && (
                <span className="px-2 py-1 bg-muted rounded-full">
                  {question.category}
                </span>
              )}
              {question.tags && question.tags.length > 0 && (
                question.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-muted rounded-full">
                    {tag}
                  </span>
                ))
              )}
            </div>

            <Button
              onClick={onNext}
              disabled={question.required && (!value || value === '')}
              className="flex items-center space-x-2"
            >
              <span>{isLast ? 'Complete' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Question Metadata (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-xs">
          <div><strong>ID:</strong> {question.id}</div>
          <div><strong>Type:</strong> {question.type}</div>
          <div><strong>Required:</strong> {question.required ? 'Yes' : 'No'}</div>
          {question.conditional && (
            <div><strong>Conditional:</strong> Depends on {question.conditional.dependsOn}</div>
          )}
        </div>
      )}
    </motion.div>
  )
}