/**
 * EmojiScaleQuestion - Emoji-based rating scale question component
 */

"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

// Default emoji scales for different types
const EMOJI_SCALES = {
  satisfaction: ['😞', '😕', '😐', '😊', '😍'],
  agreement: ['😤', '😠', '😐', '👍', '💯'],
  difficulty: ['😴', '😌', '😐', '😰', '🤯'],
  confidence: ['😨', '😟', '😐', '😎', '🚀'],
  energy: ['😴', '😪', '😐', '⚡', '🔥'],
  mood: ['😭', '😢', '😐', '😄', '🥳'],
  stress: ['😌', '😐', '😰', '😫', '🤯'],
  health: ['🤒', '😷', '😐', '💪', '🦸'],
  default: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
}

export default function EmojiScaleQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  if (!question.scale) {
    return <div className="text-red-500">Invalid scale configuration</div>
  }

  const { min, max, step = 1, labels = {} } = question.scale
  const scaleType = question.metadata?.emojiScale || 'default'
  
  // Get emoji scale or fall back to default
  const emojiScale = EMOJI_SCALES[scaleType as keyof typeof EMOJI_SCALES] || EMOJI_SCALES.default
  
  // Generate scale options
  const options = []
  for (let i = min; i <= max; i += step) {
    options.push(i)
  }

  // Map values to emojis (scale emojis to fit our range)
  const getEmoji = (optionValue: number) => {
    const normalizedIndex = Math.min(
      emojiScale.length - 1,
      Math.floor(((optionValue - min) / (max - min)) * (emojiScale.length - 1))
    )
    return emojiScale[normalizedIndex]
  }

  const handleSelect = (selectedValue: number) => {
    onChange(selectedValue)
  }

  const currentValue = value !== null && value !== undefined ? Number(value) : null
  const displayValue = hoveredValue !== null ? hoveredValue : currentValue

  return (
    <div className="space-y-8">
      {/* Large Emoji Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-8xl mb-4">
          {displayValue !== null ? getEmoji(displayValue) : '❓'}
        </div>
        <div className="text-2xl font-bold text-primary mb-2">
          {displayValue !== null ? displayValue : '?'}
        </div>
        {displayValue !== null && labels[displayValue] && (
          <div className="text-lg text-muted-foreground">
            {labels[displayValue].en}
          </div>
        )}
      </motion.div>

      {/* Emoji Scale Options */}
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-3 max-w-md">
          {options.map((option, index) => {
            const isSelected = currentValue === option
            const isHovered = hoveredValue === option
            const emoji = getEmoji(option)
            
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHoveredValue(option)}
                onMouseLeave={() => setHoveredValue(null)}
                className={cn(
                  "relative w-16 h-16 rounded-full border-2 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "flex items-center justify-center text-2xl",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                )}
              >
                {emoji}
                
                {/* Value indicator */}
                <div className={cn(
                  "absolute -bottom-6 text-xs font-medium transition-all duration-200",
                  isSelected || isHovered 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  {option}
                </div>

                {/* Selection ring */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 border-3 border-primary rounded-full"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Scale Labels */}
      {(labels[min] || labels[max]) && (
        <div className="flex justify-between text-sm max-w-md mx-auto">
          <div className="text-left">
            {labels[min] && (
              <div className="p-2 bg-muted rounded-lg">
                <div className="font-semibold">{getEmoji(min)} {min}</div>
                <div className="text-muted-foreground">{labels[min].en}</div>
              </div>
            )}
          </div>
          <div className="text-right">
            {labels[max] && (
              <div className="p-2 bg-muted rounded-lg">
                <div className="font-semibold">{getEmoji(max)} {max}</div>
                <div className="text-muted-foreground">{labels[max].en}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Feedback */}
      {hoveredValue !== null && hoveredValue !== currentValue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-3 bg-primary/10 rounded-lg"
        >
          <div className="text-sm font-medium text-primary">
            {getEmoji(hoveredValue)} {hoveredValue}
            {labels[hoveredValue] && ` - ${labels[hoveredValue].en}`}
          </div>
        </motion.div>
      )}

      {/* Current Selection Summary */}
      {currentValue !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-primary/10 rounded-lg"
        >
          <div className="text-lg font-semibold text-primary">
            You selected: {getEmoji(currentValue)} {currentValue}
          </div>
          {labels[currentValue] && (
            <div className="text-sm text-muted-foreground mt-1">
              {labels[currentValue].en}
            </div>
          )}
        </motion.div>
      )}

      {/* Scale Type Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center text-xs text-muted-foreground">
          Scale type: {scaleType} • Range: {min}-{max}
        </div>
      )}
    </div>
  )
}