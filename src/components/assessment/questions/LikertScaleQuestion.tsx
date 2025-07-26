/**
 * LikertScaleQuestion - Likert scale question component
 */

"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

export default function LikertScaleQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  if (!question.scale) {
    return <div className="text-red-500">Invalid scale configuration</div>
  }

  const { min, max, step = 1, labels = {} } = question.scale
  const options = []

  // Generate scale options
  for (let i = min; i <= max; i += step) {
    options.push(i)
  }

  const handleSelect = (selectedValue: number) => {
    onChange(selectedValue)
  }

  return (
    <div className="space-y-6">
      {/* Scale Options */}
      <div className="grid grid-cols-5 gap-4">
        {options.map((option, index) => {
          const isSelected = value === option
          const isHovered = hoveredValue === option
          
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHoveredValue(option)}
              onMouseLeave={() => setHoveredValue(null)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted"
              )}
            >
              {/* Option Number */}
              <div className="text-2xl font-bold mb-2">
                {option}
              </div>
              
              {/* Option Label */}
              {labels[option] && (
                <div className="text-xs opacity-80">
                  {labels[option].en}
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Scale Labels */}
      {(labels[min] || labels[max]) && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="text-left">
            {labels[min] && (
              <>
                <div className="font-medium">{min}</div>
                <div>{labels[min].en}</div>
              </>
            )}
          </div>
          <div className="text-right">
            {labels[max] && (
              <>
                <div className="font-medium">{max}</div>
                <div>{labels[max].en}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Current Selection Display */}
      {value !== null && value !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/10 rounded-lg"
        >
          <div className="text-lg font-semibold text-primary">
            Your Answer: {value}
          </div>
          {labels[value] && (
            <div className="text-sm text-muted-foreground mt-1">
              {labels[value].en}
            </div>
          )}
        </motion.div>
      )}

      {/* Interactive Feedback */}
      {hoveredValue !== null && hoveredValue !== value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Hover: {hoveredValue} {labels[hoveredValue] && `- ${labels[hoveredValue].en}`}
        </motion.div>
      )}
    </div>
  )
}