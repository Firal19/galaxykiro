/**
 * BinaryQuestion - Yes/No or True/False question component
 */

"use client"

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

export default function BinaryQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  
  // Default binary options if not provided
  const defaultOptions = [
    { id: 'yes', value: true, label: { en: 'Yes' }, icon: Check },
    { id: 'no', value: false, label: { en: 'No' }, icon: X }
  ]

  // Use provided options or defaults
  const options = question.options && question.options.length === 2 
    ? question.options.map((opt, index) => ({
        ...opt,
        icon: index === 0 ? Check : X
      }))
    : defaultOptions

  const handleSelect = (selectedValue: any) => {
    onChange(selectedValue)
  }

  return (
    <div className="space-y-6">
      {/* Binary Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = value === option.value
          const Icon = option.icon || (index === 0 ? Check : X)
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "relative p-8 rounded-xl border-2 transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "group overflow-hidden",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted"
              )}
            >
              {/* Background Animation */}
              <motion.div
                initial={false}
                animate={{
                  scale: isSelected ? 1 : 0,
                  opacity: isSelected ? 0.1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-current"
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center space-y-4">
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                  isSelected
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                )}>
                  <Icon className="w-8 h-8" />
                </div>

                {/* Label */}
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {option.label.en}
                  </div>
                  {option.metadata?.description && (
                    <div className={cn(
                      "text-sm opacity-80",
                      isSelected ? "text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {option.metadata.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-primary" />
                </motion.div>
              )}

              {/* Hover Effect */}
              <motion.div
                initial={false}
                whileHover={{ scale: isSelected ? 1 : 1.02 }}
                className="absolute inset-0 border-2 border-primary rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-200"
              />
            </motion.button>
          )
        })}
      </div>

      {/* Current Selection Display */}
      {value !== null && value !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/10 rounded-lg"
        >
          <div className="text-lg font-semibold text-primary">
            Your Answer: {options.find(opt => opt.value === value)?.label.en}
          </div>
          {options.find(opt => opt.value === value)?.metadata?.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {options.find(opt => opt.value === value)?.metadata?.description}
            </div>
          )}
        </motion.div>
      )}

      {/* Quick Selection Shortcuts */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Press Y for Yes or N for No</p>
      </div>

      {/* Keyboard Shortcuts Handler */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden"
        onKeyDown={(e) => {
          if (e.key.toLowerCase() === 'y') {
            handleSelect(true)
          } else if (e.key.toLowerCase() === 'n') {
            handleSelect(false)
          }
        }}
        tabIndex={-1}
      />
    </div>
  )
}