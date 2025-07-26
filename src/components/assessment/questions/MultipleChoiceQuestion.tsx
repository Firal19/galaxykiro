/**
 * MultipleChoiceQuestion - Multiple choice question component
 */

"use client"

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

export default function MultipleChoiceQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  
  if (!question.options || question.options.length === 0) {
    return <div className="text-red-500">No options configured for this question</div>
  }

  const handleSelect = (selectedValue: any) => {
    if (question.allowMultiple) {
      // Handle multiple selection
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter(v => v !== selectedValue)
        : [...currentValues, selectedValue]
      onChange(newValues)
    } else {
      // Single selection
      onChange(selectedValue)
    }
  }

  const isSelected = (optionValue: any) => {
    if (question.allowMultiple) {
      return Array.isArray(value) && value.includes(optionValue)
    }
    return value === optionValue
  }

  return (
    <div className="space-y-4">
      {question.options.map((option, index) => {
        const selected = isSelected(option.value)
        
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
              "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:border-primary/50 hover:bg-muted"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">
                  {option.label.en}
                </div>
                {option.metadata?.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {option.metadata.description}
                  </div>
                )}
              </div>
              
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </motion.button>
        )
      })}

      {question.allowMultiple && value && Array.isArray(value) && value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-primary/10 rounded-lg"
        >
          <div className="text-sm font-medium text-primary">
            Selected {value.length} option{value.length !== 1 ? 's' : ''}
          </div>
        </motion.div>
      )}
    </div>
  )
}