/**
 * TextInputQuestion - Text input question component
 */

"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

export default function TextInputQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  const [localValue, setLocalValue] = useState(value || '')
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [isFocused, setIsFocused] = useState(false)

  const isMultiline = question.inputType === 'textarea' || question.inputType === 'long_text'
  const validation = question.validation
  const maxLength = validation?.maxLength
  const minLength = validation?.minLength
  const placeholder = question.placeholder?.en || 'Enter your response...'

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  useEffect(() => {
    const text = localValue.toString()
    setCharCount(text.length)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
  }, [localValue])

  const handleChange = (newValue: string) => {
    // Apply max length constraint
    if (maxLength && newValue.length > maxLength) {
      return
    }

    setLocalValue(newValue)
    onChange(newValue)
  }

  const getValidationMessage = () => {
    if (!validation) return null

    const text = localValue.toString()
    
    if (validation.minLength && text.length < validation.minLength) {
      return `Minimum ${validation.minLength} characters required`
    }
    
    if (validation.pattern) {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(text)) {
        return validation.errorMessage?.en || 'Invalid format'
      }
    }
    
    return null
  }

  const validationMessage = getValidationMessage()
  const isValid = !validationMessage
  const showCharCount = maxLength || minLength

  return (
    <div className="space-y-4">
      <div className="relative">
        {isMultiline ? (
          <Textarea
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "min-h-[120px] resize-none transition-all duration-200",
              isFocused && "ring-2 ring-primary ring-offset-2",
              !isValid && "border-red-500 focus:ring-red-500"
            )}
            maxLength={maxLength}
          />
        ) : (
          <Input
            type={question.inputType === 'email' ? 'email' : 'text'}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "transition-all duration-200",
              isFocused && "ring-2 ring-primary ring-offset-2",
              !isValid && "border-red-500 focus:ring-red-500"
            )}
            maxLength={maxLength}
          />
        )}

        {/* Focus Animation */}
        {isFocused && (
          <motion.div
            initial={{ scale: 1.02, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none"
          />
        )}
      </div>

      {/* Character/Word Count and Validation */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {validationMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 flex items-center space-x-1"
            >
              <span>⚠</span>
              <span>{validationMessage}</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Word Count */}
          {isMultiline && (
            <Badge variant="outline" className="text-xs">
              {wordCount} word{wordCount !== 1 ? 's' : ''}
            </Badge>
          )}

          {/* Character Count */}
          {showCharCount && (
            <Badge 
              variant={charCount > (maxLength || 0) * 0.8 ? "destructive" : "outline"}
              className="text-xs"
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </Badge>
          )}
        </div>
      </div>

      {/* Input Type Hints */}
      {question.inputType === 'email' && (
        <div className="text-xs text-muted-foreground">
          <span>💡 Please enter a valid email address</span>
        </div>
      )}

      {/* Progress Indication for Long Text */}
      {isMultiline && minLength && (
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min(100, (charCount / minLength) * 100)}%` 
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "h-2 rounded-full transition-colors duration-200",
              charCount >= minLength ? "bg-green-500" : "bg-primary"
            )}
          />
        </div>
      )}

      {/* Helpful Examples */}
      {question.examples && question.examples.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isFocused ? 1 : 0.7, y: 0 }}
          className="p-3 bg-muted rounded-lg"
        >
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Examples:
          </div>
          <div className="space-y-1">
            {question.examples.slice(0, 2).map((example, index) => (
              <div key={index} className="text-xs text-foreground italic">
                "{example.en}"
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-time Validation Feedback */}
      {localValue && isValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green-600 text-sm flex items-center space-x-1"
        >
          <span>✓</span>
          <span>Looks good!</span>
        </motion.div>
      )}
    </div>
  )
}