/**
 * ScenarioQuestion - Scenario-based question with contextual responses
 */

"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Lightbulb, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

export default function ScenarioQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  const [expandedScenario, setExpandedScenario] = useState(false)
  const [selectedOption, setSelectedOption] = useState<any>(value)

  if (!question.options || question.options.length === 0) {
    return <div className="text-red-500">No response options configured</div>
  }

  const scenario = question.scenario || question.description
  const hasDetailedScenario = scenario && scenario.en.length > 200

  const handleSelect = (optionValue: any) => {
    setSelectedOption(optionValue)
    onChange(optionValue)
  }

  const isSelected = (optionValue: any) => selectedOption === optionValue

  return (
    <div className="space-y-6">
      {/* Scenario Context */}
      {scenario && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-3">
                Scenario
              </h3>
              
              <div className="prose prose-sm max-w-none">
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedScenario || !hasDetailedScenario ? 'auto' : '4rem'
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {scenario.en}
                  </p>
                </motion.div>
                
                {hasDetailedScenario && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedScenario(!expandedScenario)}
                    className="mt-2 p-0 h-auto font-normal text-primary hover:text-primary/80"
                  >
                    {expandedScenario ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Read more
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Response Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            How would you respond in this situation?
          </span>
        </div>

        {question.options.map((option, index) => {
          const selected = isSelected(option.value)
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selected
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Option Letter */}
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Option Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground mb-2">
                        {option.label.en}
                      </div>
                      
                      {option.metadata?.description && (
                        <div className="text-sm text-muted-foreground">
                          {option.metadata.description}
                        </div>
                      )}

                      {/* Option Tags */}
                      {option.metadata?.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {option.metadata.tags.map((tag: string) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    <AnimatePresence>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedOption !== null && selectedOption !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/10 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
            </div>
            <div className="text-sm font-medium text-primary">
              You selected: {question.options.find(opt => opt.value === selectedOption)?.label.en}
            </div>
          </div>
        </motion.div>
      )}

      {/* Question Metadata */}
      {question.category && (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {question.category}
          </Badge>
        </div>
      )}
    </div>
  )
}