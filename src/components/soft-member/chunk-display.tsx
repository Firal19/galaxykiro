"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  BookOpen,
  Lightbulb,
  Target,
  Heart,
  MessageSquare,
  Award,
  Star
} from 'lucide-react'
import { 
  NurturingChunk, 
  InteractionElement,
  softMemberNurturingService 
} from '@/lib/soft-member-nurturing'

interface ChunkDisplayProps {
  chunk: NurturingChunk
  memberId: string
  onComplete: () => void
  onCancel: () => void
}

export function ChunkDisplay({ chunk, memberId, onComplete, onCancel }: ChunkDisplayProps) {
  const [currentSection, setCurrentSection] = useState<'hook' | 'insight' | 'application' | 'hungerBuilder' | 'nextStep' | 'interactions'>('hook')
  const [timeSpent, setTimeSpent] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completedInteractions, setCompletedInteractions] = useState<string[]>([])
  const [interactionResponses, setInteractionResponses] = useState<Record<string, any>>({})
  const [reflectionNotes, setReflectionNotes] = useState<string[]>([])
  const [currentReflection, setCurrentReflection] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    setIsActive(true)
    return () => setIsActive(false)
  }, [])

  const sections = [
    { key: 'hook', title: 'Hook', icon: Target, description: 'Grab your attention' },
    { key: 'insight', title: 'Insight', icon: Lightbulb, description: 'Core wisdom' },
    { key: 'application', title: 'Application', icon: Play, description: 'Take action' },
    { key: 'hungerBuilder', title: 'Hunger Builder', icon: Heart, description: 'Expand your vision' },
    { key: 'nextStep', title: 'Next Step', icon: ArrowRight, description: 'Continue forward' },
    { key: 'interactions', title: 'Interactions', icon: MessageSquare, description: 'Engage deeply' }
  ]

  const currentSectionIndex = sections.findIndex(s => s.key === currentSection)
  const progress = ((currentSectionIndex + 1) / sections.length) * 100

  const handleInteractionComplete = (elementId: string, response: any) => {
    setCompletedInteractions(prev => [...prev, elementId])
    setInteractionResponses(prev => ({ ...prev, [elementId]: response }))
  }

  const addReflectionNote = () => {
    if (currentReflection.trim()) {
      setReflectionNotes(prev => [...prev, currentReflection.trim()])
      setCurrentReflection('')
    }
  }

  const canComplete = () => {
    const requiredInteractionIds = chunk.completionCriteria.requiredInteractions
    const hasRequiredInteractions = requiredInteractionIds.every(id => 
      completedInteractions.includes(id)
    )
    const hasMinTime = timeSpent >= (chunk.completionCriteria.minimumTimeSpent * 60)
    const hasReflection = !chunk.completionCriteria.reflectionRequired || reflectionNotes.length > 0

    return hasRequiredInteractions && hasMinTime && hasReflection
  }

  const handleComplete = async () => {
    if (!canComplete()) return

    try {
      await softMemberNurturingService.updateChunkProgress(memberId, chunk.id, {
        status: 'completed',
        timeSpent: Math.floor(timeSpent / 60), // Convert to minutes
        completedInteractions,
        reflectionNotes,
        engagementScore: calculateEngagementScore()
      })
      onComplete()
    } catch (error) {
      console.error('Error completing chunk:', error)
    }
  }

  const calculateEngagementScore = () => {
    const interactionScore = (completedInteractions.length / chunk.interactionElements.length) * 40
    const timeScore = Math.min((timeSpent / (chunk.estimatedTime * 60)) * 30, 30)
    const reflectionScore = reflectionNotes.length > 0 ? 30 : 0
    return Math.round(interactionScore + timeScore + reflectionScore)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'hook':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">The Hook</h3>
              <p className="text-gray-400">Something to grab your attention and pull you in</p>
            </div>
            <Card className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <p className="text-lg text-gray-200 leading-relaxed">{chunk.content.hook}</p>
            </Card>
          </div>
        )

      case 'insight':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">The Insight</h3>
              <p className="text-gray-400">The core wisdom that changes everything</p>
            </div>
            <Card className="p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30">
              <p className="text-lg text-gray-200 leading-relaxed">{chunk.content.insight}</p>
            </Card>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Full Content</h4>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: chunk.content.mainContent.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          </div>
        )

      case 'application':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Play className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Application</h3>
              <p className="text-gray-400">How to use this insight right now</p>
            </div>
            <Card className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30">
              <p className="text-lg text-gray-200 leading-relaxed">{chunk.content.application}</p>
            </Card>
            {chunk.actionItems.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Action Items</h4>
                {chunk.actionItems.map((action, index) => (
                  <Card key={action.id} className="p-4 bg-slate-700/50 border-slate-600">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                      <div className="flex-1">
                        <h5 className="font-medium text-white">{action.title}</h5>
                        <p className="text-sm text-gray-400 mb-2">{action.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏱️ {action.estimatedTime} min</span>
                          <span>🎯 {action.priority}</span>
                          <span>📁 {action.category}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 'hungerBuilder':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Hunger Builder</h3>
              <p className="text-gray-400">Expand your vision of what's possible</p>
            </div>
            <Card className="p-6 bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500/30">
              <p className="text-lg text-gray-200 leading-relaxed">{chunk.content.hungerBuilder}</p>
            </Card>
          </div>
        )

      case 'nextStep':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <ArrowRight className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Next Step</h3>
              <p className="text-gray-400">Your clear path forward</p>
            </div>
            <Card className="p-6 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
              <p className="text-lg text-gray-200 leading-relaxed">{chunk.content.nextStep}</p>
            </Card>
          </div>
        )

      case 'interactions':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Interactive Elements</h3>
              <p className="text-gray-400">Engage deeply with the content</p>
            </div>
            
            {chunk.interactionElements.map((element, index) => (
              <Card key={element.id} className="p-6 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{element.type.replace('_', ' ')}</Badge>
                    {completedInteractions.includes(element.id) && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {element.points} points
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-3">{element.title}</h4>
                <p className="text-gray-300 mb-4">{element.content}</p>
                
                {element.type === 'quiz' && element.options && (
                  <RadioGroup
                    value={interactionResponses[element.id] || ''}
                    onValueChange={(value) => {
                      setInteractionResponses(prev => ({ ...prev, [element.id]: value }))
                      if (!completedInteractions.includes(element.id)) {
                        handleInteractionComplete(element.id, value)
                      }
                    }}
                  >
                    {element.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${element.id}-${optionIndex}`} />
                        <Label htmlFor={`${element.id}-${optionIndex}`} className="text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {element.type === 'reflection' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts and reflections..."
                      value={interactionResponses[element.id] || ''}
                      onChange={(e) => {
                        setInteractionResponses(prev => ({ ...prev, [element.id]: e.target.value }))
                        if (e.target.value.length > 50 && !completedInteractions.includes(element.id)) {
                          handleInteractionComplete(element.id, e.target.value)
                        }
                      }}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                    />
                  </div>
                )}
                
                {element.type === 'action_plan' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Create your action plan..."
                      value={interactionResponses[element.id] || ''}
                      onChange={(e) => {
                        setInteractionResponses(prev => ({ ...prev, [element.id]: e.target.value }))
                        if (e.target.value.length > 100 && !completedInteractions.includes(element.id)) {
                          handleInteractionComplete(element.id, e.target.value)
                        }
                      }}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={6}
                    />
                  </div>
                )}
              </Card>
            ))}
            
            {chunk.reflectionPrompts.length > 0 && (
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Reflection Prompts</h4>
                {chunk.reflectionPrompts.map((prompt, index) => (
                  <div key={index} className="mb-3">
                    <p className="text-gray-300 mb-2">• {prompt}</p>
                  </div>
                ))}
                
                <div className="mt-6 space-y-3">
                  <Textarea
                    placeholder="Add your reflection..."
                    value={currentReflection}
                    onChange={(e) => setCurrentReflection(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                  <Button onClick={addReflectionNote} disabled={!currentReflection.trim()}>
                    Add Reflection
                  </Button>
                </div>
                
                {reflectionNotes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-white">Your Reflections:</h5>
                    {reflectionNotes.map((note, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                        <p className="text-gray-300 text-sm">{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6 bg-slate-800/80 backdrop-blur-sm border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onCancel} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{chunk.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                <span>📚 {chunk.stage}</span>
                <span>⚡ {chunk.type}</span>
                <span>⏱️ {formatTime(timeSpent)} / {chunk.estimatedTime}min</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Progress</div>
            <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
          </div>
        </div>
        
        <Progress value={progress} className="mt-4" />
      </Card>

      {/* Navigation */}
      <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <div className="flex items-center justify-between overflow-x-auto">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            const isActive = section.key === currentSection
            const isCompleted = index < currentSectionIndex
            
            return (
              <button
                key={section.key}
                onClick={() => setCurrentSection(section.key as any)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all min-w-0 ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : isCompleted 
                      ? 'text-green-400 hover:bg-slate-700' 
                      : 'text-gray-400 hover:bg-slate-700'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{section.title}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Content */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderContent()}
      </motion.div>

      {/* Footer */}
      <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                const prevIndex = Math.max(0, currentSectionIndex - 1)
                setCurrentSection(sections[prevIndex].key as any)
              }}
              disabled={currentSectionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => {
                const nextIndex = Math.min(sections.length - 1, currentSectionIndex + 1)
                setCurrentSection(sections[nextIndex].key as any)
              }}
              disabled={currentSectionIndex === sections.length - 1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <Button
            onClick={handleComplete}
            disabled={!canComplete()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Award className="w-4 h-4 mr-2" />
            Complete Chunk
          </Button>
        </div>
        
        {!canComplete() && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              To complete this chunk: 
              {chunk.completionCriteria.requiredInteractions.length > completedInteractions.length && 
                ` Complete ${chunk.completionCriteria.requiredInteractions.length - completedInteractions.length} more interactions.`}
              {timeSpent < (chunk.completionCriteria.minimumTimeSpent * 60) && 
                ` Spend ${Math.ceil((chunk.completionCriteria.minimumTimeSpent * 60 - timeSpent) / 60)} more minutes.`}
              {chunk.completionCriteria.reflectionRequired && reflectionNotes.length === 0 && 
                ` Add at least one reflection.`}
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}