/**
 * RankingQuestion - Drag-and-drop ranking question component
 */

"use client"

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuestionComponentProps } from '@/services/assessment/AssessmentTypes'
import { cn } from '@/lib/utils'

interface RankingItem {
  id: string
  value: any
  label: string
  description?: string
  originalIndex: number
}

export default function RankingQuestion({
  question,
  value,
  onChange
}: QuestionComponentProps) {
  const [items, setItems] = useState<RankingItem[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  if (!question.options || question.options.length === 0) {
    return <div className="text-red-500">No options configured for ranking</div>
  }

  // Initialize items from question options
  useEffect(() => {
    const initialItems: RankingItem[] = question.options!.map((option, index) => ({
      id: option.id,
      value: option.value,
      label: option.label.en,
      description: option.metadata?.description,
      originalIndex: index
    }))

    // If there's a saved value, use that order
    if (value && Array.isArray(value)) {
      const orderedItems = value.map((savedValue: any) => 
        initialItems.find(item => item.value === savedValue)
      ).filter(Boolean) as RankingItem[]
      
      // Add any missing items at the end
      const usedValues = new Set(value)
      const missingItems = initialItems.filter(item => !usedValues.has(item.value))
      
      setItems([...orderedItems, ...missingItems])
    } else {
      setItems(initialItems)
    }
  }, [question.options, value])

  const handleReorder = (newItems: RankingItem[]) => {
    setItems(newItems)
    const newValue = newItems.map(item => item.value)
    onChange(newValue)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
      handleReorder(newItems)
    }
  }

  const resetOrder = () => {
    const resetItems = [...items].sort((a, b) => a.originalIndex - b.originalIndex)
    handleReorder(resetItems)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Drag and drop the items below to rank them in order of preference (most preferred at the top).
          You can also use the arrow buttons to move items up or down.
        </p>
      </div>

      {/* Ranking List */}
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item.id}
            value={item}
            onDragStart={() => setDraggedItem(item.id)}
            onDragEnd={() => setDraggedItem(null)}
            className={cn(
              "group cursor-grab active:cursor-grabbing",
              draggedItem === item.id && "z-10"
            )}
          >
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, rotate: 2 }}
              className={cn(
                "flex items-center p-4 bg-background border-2 rounded-lg transition-all duration-200",
                "hover:border-primary/50 hover:shadow-md",
                draggedItem === item.id 
                  ? "border-primary shadow-lg bg-primary/5" 
                  : "border-border"
              )}
            >
              {/* Rank Number */}
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mr-4">
                {index + 1}
              </div>

              {/* Drag Handle */}
              <div className="flex-shrink-0 mr-3 text-muted-foreground group-hover:text-primary transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">
                  {item.label}
                </div>
                {item.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </div>
                )}
              </div>

              {/* Arrow Controls */}
              <div className="flex-shrink-0 flex flex-col space-y-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="w-8 h-8 p-0"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="w-8 h-8 p-0"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={resetOrder}
          className="text-sm"
        >
          Reset to Original Order
        </Button>
      </div>

      {/* Current Rankings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary/10 rounded-lg"
      >
        <div className="text-sm font-medium text-primary mb-2">
          Current Rankings:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {items.slice(0, 6).map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2">
              <span className="font-medium text-primary">#{index + 1}</span>
              <span className="text-foreground truncate">{item.label}</span>
            </div>
          ))}
          {items.length > 6 && (
            <div className="text-muted-foreground">
              ... and {items.length - 6} more
            </div>
          )}
        </div>
      </motion.div>

      {/* Progress Indicator */}
      {items.length > 0 && (
        <div className="text-center text-xs text-muted-foreground">
          <p>Ranking {items.length} items • {value && Array.isArray(value) ? 'Saved' : 'Not saved'}</p>
        </div>
      )}
    </div>
  )
}