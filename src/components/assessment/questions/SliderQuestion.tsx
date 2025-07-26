/**
 * SliderQuestion - Slider-based question component
 */

"use client"

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

export default function SliderQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  const [isDragging, setIsDragging] = useState(false)

  if (!question.scale) {
    return <div className="text-red-500">Invalid scale configuration</div>
  }

  const { min, max, step = 1, labels = {} } = question.scale
  const currentValue = value !== null && value !== undefined ? Number(value) : min

  const handleValueChange = useCallback((newValue: number[]) => {
    onChange(newValue[0])
  }, [onChange])

  const handleValueCommit = useCallback((newValue: number[]) => {
    setIsDragging(false)
    onChange(newValue[0])
  }, [onChange])

  // Generate tick marks
  const tickCount = Math.min(11, Math.floor((max - min) / step) + 1)
  const tickStep = (max - min) / (tickCount - 1)
  const ticks = Array.from({ length: tickCount }, (_, i) => min + (i * tickStep))

  return (
    <div className="space-y-8">
      {/* Current Value Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-6xl font-bold text-primary mb-2">
          {currentValue}
        </div>
        {labels[currentValue] && (
          <div className="text-lg text-muted-foreground">
            {labels[currentValue].en}
          </div>
        )}
      </motion.div>

      {/* Slider Component */}
      <div className="relative px-4">
        <Slider
          value={[currentValue]}
          onValueChange={handleValueChange}
          onValueCommit={handleValueCommit}
          min={min}
          max={max}
          step={step}
          className="w-full"
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
        />

        {/* Tick Marks */}
        <div className="flex justify-between mt-2 px-2">
          {ticks.map((tick, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center text-xs transition-all duration-200",
                Math.abs(tick - currentValue) < step ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <div 
                className={cn(
                  "w-1 h-3 rounded-full mb-1 transition-all duration-200",
                  Math.abs(tick - currentValue) < step ? "bg-primary" : "bg-border"
                )}
              />
              <span>{Math.round(tick)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Range Labels */}
      {(labels[min] || labels[max]) && (
        <div className="flex justify-between text-sm">
          <div className="text-left max-w-[45%]">
            {labels[min] && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-semibold text-muted-foreground">{min}</div>
                <div className="text-foreground">{labels[min].en}</div>
              </div>
            )}
          </div>
          <div className="text-right max-w-[45%]">
            {labels[max] && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-semibold text-muted-foreground">{max}</div>
                <div className="text-foreground">{labels[max].en}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Feedback */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/10 rounded-lg"
        >
          <div className="text-sm font-medium text-primary">
            Adjusting value to {currentValue}
          </div>
          {labels[currentValue] && (
            <div className="text-xs text-muted-foreground mt-1">
              {labels[currentValue].en}
            </div>
          )}
        </motion.div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Drag the slider or click anywhere on the track to select your value</p>
      </div>
    </div>
  )
}