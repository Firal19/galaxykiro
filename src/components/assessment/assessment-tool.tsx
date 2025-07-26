"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  Clock, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  AssessmentEngine, 
  AssessmentConfig, 
  Question, 
  QuestionResponse, 
  AssessmentResult,
  MultipleChoiceQuestion,
  ScaleQuestion,
  TextQuestion,
  RankingQuestion,
  SliderQuestion,
  MatrixQuestion
} from '@/lib/assessment-engine'
import { ResultVisualization } from './result-visualization'
import { useLeadScoring } from '@/lib/hooks/use-lead-scoring'
import { useAuth } from '@/lib/contexts/auth-context'
import { ProgressiveForm } from '../progressive-form'

// Types for the assessment tool props
export interface AssessmentToolProps {
  toolId: string;
  title: string;
  description: string;
  config: AssessmentConfig;
  leadCaptureLevel?: 1 | 2 | 3;
  onComplete?: (result: AssessmentResult) => void;
  showSharing?: boolean;
  compact?: boolean;
  theme?: 'default' | 'minimal' | 'detailed';
}

// Form schema for lead capture
const leadCaptureSchema = {
  1: z.object({
    email: z.string().email({ message: "Please enter a valid email address" })
  }),
  2: z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" })
  }),
  3: z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
    fullName: z.string().min(2, { message: "Please enter your full name" }),
    city: z.string().min(2, { message: "Please enter your city" })
  })
};

export function AssessmentTool({
  toolId,
  title,
  description,
  config,
  leadCaptureLevel = 1,
  onComplete,
  showSharing = true,
  compact = false,
  theme = 'default'
}: AssessmentToolProps) {
  // State management
  const [engine, setEngine] = useState<AssessmentEngine | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({})
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // References and hooks
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { addToolUsagePoints } = useLeadScoring()
  
  // Initialize assessment engine
  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        setIsLoading(true)
        
        // Create assessment engine with config
        const assessmentEngine = new AssessmentEngine(config)
        setEngine(assessmentEngine)
        
        // If user is authenticated, try to load existing state
        if (isAuthenticated && user?.id) {
          const existingState = await assessmentEngine.loadAssessmentState(user.id)
          
          if (existingState) {
            // Resume existing assessment
            setCurrentIndex(existingState.currentQuestionIndex)
            
            // Reconstruct responses from saved state
            const savedResponses: Record<string, any> = {}
            const savedTimeSpent: Record<string, number> = {}
            
            existingState.responses.forEach(response => {
              savedResponses[response.questionId] = response.answer
              savedTimeSpent[response.questionId] = response.timeSpent
            })
            
            setResponses(savedResponses)
            setTimeSpent(savedTimeSpent)
            setProgress(assessmentEngine.calculateCompletionRate() * 100)
          } else {
            // Initialize new assessment
            await assessmentEngine.initializeAssessment(user.id)
          }
        } else {
          // For non-authenticated users, create temporary ID
          const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
          await assessmentEngine.initializeAssessment(tempUserId)
        }
        
        // Set current question
        const question = assessmentEngine.getCurrentQuestion()
        setCurrentQuestion(question)
        setStartTime(new Date())
        setIsLoading(false)
      } catch (err) {
        console.error('Error initializing assessment:', err)
        setError('Failed to initialize assessment. Please try again.')
        setIsLoading(false)
      }
    }
    
    initializeAssessment()
    
    // Cleanup timer on unmount
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
      }
    }
  }, [config, isAuthenticated, user])
  
  // Update progress when responses change
  useEffect(() => {
    if (engine && config.questions.length > 0) {
      const completionRate = Object.keys(responses).length / config.questions.length
      setProgress(completionRate * 100)
    }
  }, [responses, engine, config.questions.length])
  
  // Start timer for current question
  useEffect(() => {
    if (currentQuestion && startTime) {
      // Clear any existing timer
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
      }
      
      // Start new timer
      questionTimerRef.current = setInterval(() => {
        // This just keeps the timer running, actual time is calculated on question change
      }, 1000)
    }
    
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current)
      }
    }
  }, [currentQuestion, startTime])
  
  // Handle question navigation
  const handleNextQuestion = async () => {
    if (!engine || !currentQuestion) return
    
    // Calculate time spent on current question
    const questionTimeSpent = calculateTimeSpent()
    
    // Save response and time spent
    const currentResponse = responses[currentQuestion.id]
    
    if (currentResponse !== undefined) {
      try {
        // Submit response to engine
        await engine.submitResponse({
          questionId: currentQuestion.id,
          answer: currentResponse,
          timeSpent: questionTimeSpent
        })
        
        // Update time spent tracking
        setTimeSpent(prev => ({
          ...prev,
          [currentQuestion.id]: questionTimeSpent
        }))
        
        // Move to next question
        const nextQuestion = engine.nextQuestion()
        
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion)
          setCurrentIndex(prev => prev + 1)
          setStartTime(new Date())
        } else {
          // No more questions, check if we need lead capture
          if (!isAuthenticated && leadCaptureLevel > 0) {
            setShowLeadCapture(true)
          } else {
            // Complete assessment
            handleCompleteAssessment()
          }
        }
      } catch (err) {
        console.error('Error submitting response:', err)
        toast({
          title: "Error saving response",
          description: "Please try again or refresh the page",
          variant: "destructive"
        })
      }
    } else {
      // Question is required but no answer
      if (currentQuestion.required) {
        toast({
          title: "Response required",
          description: "Please answer this question before continuing",
          variant: "destructive"
        })
      } else {
        // Skip optional question
        const nextQuestion = engine.nextQuestion()
        
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion)
          setCurrentIndex(prev => prev + 1)
          setStartTime(new Date())
        } else {
          // No more questions, check if we need lead capture
          if (!isAuthenticated && leadCaptureLevel > 0) {
            setShowLeadCapture(true)
          } else {
            // Complete assessment
            handleCompleteAssessment()
          }
        }
      }
    }
  }
  
  const handlePreviousQuestion = async () => {
    if (!engine || !currentQuestion) return
    
    // Calculate time spent on current question
    const questionTimeSpent = calculateTimeSpent()
    
    // Update time spent tracking
    setTimeSpent(prev => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + questionTimeSpent
    }))
    
    // Move to previous question
    const prevQuestion = engine.previousQuestion()
    
    if (prevQuestion) {
      setCurrentQuestion(prevQuestion)
      setCurrentIndex(prev => prev - 1)
      setStartTime(new Date())
    }
  }
  
  // Calculate time spent on current question
  const calculateTimeSpent = (): number => {
    if (!startTime) return 0
    
    const now = new Date()
    const timeSpentMs = now.getTime() - startTime.getTime()
    return Math.round(timeSpentMs / 1000) // Convert to seconds
  }
  
  // Handle response changes
  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }
  
  // Handle lead capture form submission
  const handleLeadCaptureSubmit = async (data: Record<string, unknown>, level: number) => {
    if (!engine) return
    
    try {
      setIsSubmitting(true)
      
      // Update user profile or create new user
      if (isAuthenticated) {
        // Update user profile via API
        console.log('Updating user profile with data:', data)
        // TODO: Implement user profile update API call
      } else {
        // Create new user or update anonymous user
        // This would typically call an API endpoint to create/update user
        console.log('Creating/updating user with data:', data)
        // For demo purposes, we'll just log the data
      }
      
      // Complete assessment
      await handleCompleteAssessment()
      
      setIsSubmitting(false)
    } catch (err) {
      console.error('Error submitting lead capture form:', err)
      setIsSubmitting(false)
      toast({
        title: "Error saving your information",
        description: "Please try again or refresh the page",
        variant: "destructive"
      })
    }
  }
  
  // Complete assessment and generate result
  const handleCompleteAssessment = async () => {
    if (!engine) return
    
    try {
      setIsSubmitting(true)
      
      // Complete assessment and get result
      const assessmentResult = await engine.completeAssessment()
      setResult(assessmentResult)
      
      // Add points to lead score
      addToolUsagePoints(toolId)
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(assessmentResult)
      }
      
      setIsSubmitting(false)
    } catch (err) {
      console.error('Error completing assessment:', err)
      setIsSubmitting(false)
      toast({
        title: "Error generating your results",
        description: "Please try again or refresh the page",
        variant: "destructive"
      })
    }
  }
  
  // Render question based on type
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoiceQuestion(question as MultipleChoiceQuestion)
      case 'scale':
        return renderScaleQuestion(question as ScaleQuestion)
      case 'text':
        return renderTextQuestion(question as TextQuestion)
      case 'ranking':
        return renderRankingQuestion(question as RankingQuestion)
      case 'slider':
        return renderSliderQuestion(question as SliderQuestion)
      case 'matrix':
        return renderMatrixQuestion(question as MatrixQuestion)
      default:
        return <p>Unsupported question type</p>
    }
  }
  
  // Render multiple choice question
  const renderMultipleChoiceQuestion = (question: MultipleChoiceQuestion) => {
    const currentResponse = responses[question.id]
    
    if (question.allowMultiple) {
      // Multiple selection (checkboxes)
      return (
        <div className="space-y-4">
          {question.options.map(option => (
            <div key={option.id} className="flex items-start space-x-3 p-3 rounded-md border hover:bg-muted/50 transition-colors">
              <Checkbox
                id={option.id}
                checked={Array.isArray(currentResponse) && currentResponse.includes(option.value)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(currentResponse) ? [...currentResponse] : []
                  if (checked) {
                    handleResponseChange(question.id, [...currentValues, option.value])
                  } else {
                    handleResponseChange(
                      question.id,
                      currentValues.filter(value => value !== option.value)
                    )
                  }
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={option.id}
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.text}
                </Label>
              </div>
            </div>
          ))}
        </div>
      )
    } else {
      // Single selection (radio buttons)
      return (
        <RadioGroup
          value={currentResponse}
          onValueChange={(value) => handleResponseChange(question.id, value)}
          className="space-y-4"
        >
          {question.options.map(option => (
            <div key={option.id} className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={option.value.toString()} id={option.id} />
              <Label htmlFor={option.id} className="text-base font-medium">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )
    }
  }
  
  // Render scale question
  const renderScaleQuestion = (question: ScaleQuestion) => {
    const currentResponse = responses[question.id] || question.min
    const scalePoints = Array.from(
      { length: question.max - question.min + 1 },
      (_, i) => question.min + i
    )
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {question.labels?.min || question.min}
          </span>
          <span className="text-xl font-bold">{currentResponse}</span>
          <span className="text-sm text-muted-foreground">
            {question.labels?.max || question.max}
          </span>
        </div>
        
        <div className="grid grid-cols-10 gap-2">
          {scalePoints.map(point => (
            <Button
              key={point}
              type="button"
              variant={currentResponse === point ? "default" : "outline"}
              className={cn(
                "h-12 w-full",
                currentResponse === point && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleResponseChange(question.id, point)}
            >
              {point}
            </Button>
          ))}
        </div>
        
        {question.labels?.middle && (
          <div className="text-center text-sm text-muted-foreground">
            {question.labels.middle}
          </div>
        )}
      </div>
    )
  }
  
  // Render text question
  const renderTextQuestion = (question: TextQuestion) => {
    const currentResponse = responses[question.id] || ""
    
    return (
      <div className="space-y-4">
        {question.maxLength ? (
          <div className="space-y-2">
            <Textarea
              value={currentResponse}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              maxLength={question.maxLength}
              className="min-h-[120px]"
            />
            <div className="text-right text-sm text-muted-foreground">
              {currentResponse.length}/{question.maxLength} characters
            </div>
          </div>
        ) : (
          <Textarea
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="min-h-[120px]"
          />
        )}
      </div>
    )
  }
  
  // Render ranking question
  const renderRankingQuestion = (question: RankingQuestion) => {
    const currentResponse = responses[question.id] || {}
    const [draggedItem, setDraggedItem] = useState<string | null>(null)
    
    // Initialize rankings if not already set
    useEffect(() => {
      if (Object.keys(currentResponse).length === 0 && question.items.length > 0) {
        const initialRanking: Record<string, number> = {}
        question.items.forEach((item, index) => {
          initialRanking[item.id] = index + 1
        })
        handleResponseChange(question.id, initialRanking)
      }
    }, [question.id, question.items, currentResponse])
    
    // Get sorted items based on current ranking
    const sortedItems = [...question.items].sort((a, b) => {
      return (currentResponse[a.id] || 0) - (currentResponse[b.id] || 0)
    })
    
    // Handle drag start
    const handleDragStart = (itemId: string) => {
      setDraggedItem(itemId)
    }
    
    // Handle drag over
    const handleDragOver = (e: React.DragEvent, targetItemId: string) => {
      e.preventDefault()
      if (!draggedItem || draggedItem === targetItemId) return
      
      // Get current rankings
      const updatedRanking = { ...currentResponse }
      const draggedRank = updatedRanking[draggedItem]
      const targetRank = updatedRanking[targetItemId]
      
      // Update rankings for all affected items
      Object.keys(updatedRanking).forEach(id => {
        if (id === draggedItem) {
          updatedRanking[id] = targetRank
        } else if (
          draggedRank < targetRank && 
          updatedRanking[id] > draggedRank && 
          updatedRanking[id] <= targetRank
        ) {
          updatedRanking[id]--
        } else if (
          draggedRank > targetRank && 
          updatedRanking[id] < draggedRank && 
          updatedRanking[id] >= targetRank
        ) {
          updatedRanking[id]++
        }
      })
      
      handleResponseChange(question.id, updatedRanking)
    }
    
    // Handle drag end
    const handleDragEnd = () => {
      setDraggedItem(null)
    }
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Drag and drop items to rank them in order of importance to you:
        </p>
        
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center p-3 rounded-md border cursor-move",
                draggedItem === item.id ? "opacity-50 border-dashed" : "hover:bg-muted/50",
                "transition-colors"
              )}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <span className="font-medium">{currentResponse[item.id]}</span>
              </div>
              <span className="text-base">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Render slider question
  const renderSliderQuestion = (question: SliderQuestion) => {
    const currentResponse = responses[question.id] !== undefined 
      ? responses[question.id] 
      : question.defaultValue !== undefined 
        ? question.defaultValue 
        : question.min
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{question.min}</span>
          <span className="text-xl font-bold">
            {currentResponse}
            {question.unit && <span className="ml-1 text-sm">{question.unit}</span>}
          </span>
          <span className="text-sm text-muted-foreground">{question.max}</span>
        </div>
        
        <Slider
          value={[currentResponse]}
          min={question.min}
          max={question.max}
          step={question.step || 1}
          onValueChange={(values) => handleResponseChange(question.id, values[0])}
          className="py-4"
        />
      </div>
    )
  }
  
  // Render matrix question
  const renderMatrixQuestion = (question: MatrixQuestion) => {
    const currentResponse = responses[question.id] || {}
    
    return (
      <div className="space-y-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left"></th>
              {question.columns.map(column => (
                <th key={column.id} className="p-2 text-center text-sm font-medium">
                  {column.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map(row => (
              <tr key={row.id} className="border-t">
                <td className="p-2 text-left font-medium">{row.text}</td>
                {question.columns.map(column => (
                  <td key={`${row.id}-${column.id}`} className="p-2 text-center">
                    <RadioGroupItem
                      value={column.value.toString()}
                      id={`${row.id}-${column.id}`}
                      checked={currentResponse[row.id] === column.value}
                      onClick={() => {
                        const updatedResponse = {
                          ...currentResponse,
                          [row.id]: column.value
                        }
                        handleResponseChange(question.id, updatedResponse)
                      }}
                      className="mx-auto"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  // Render lead capture form
  const renderLeadCaptureForm = () => {
    const schema = leadCaptureLevel === 1 
      ? leadCaptureSchema[1] 
      : leadCaptureLevel === 2 
        ? leadCaptureSchema[2] 
        : leadCaptureSchema[3]
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Almost there!</CardTitle>
          <CardDescription>
            Please provide your information to see your personalized results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressiveForm
            level={leadCaptureLevel}
            existingData={user ? { 
              email: user.email || ''
            } : {}}
            onSubmit={handleLeadCaptureSubmit}
          />
        </CardContent>
      </Card>
    )
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-center text-muted-foreground">Loading assessment...</p>
      </div>
    )
  }
  
  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <p className="text-center text-destructive font-medium mb-2">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }
  
  // Render results
  if (result) {
    return (
      <div className="w-full">
        <ResultVisualization 
          result={result} 
          showSharing={showSharing} 
          compact={compact} 
        />
      </div>
    )
  }
  
  // Render lead capture form
  if (showLeadCapture) {
    return renderLeadCaptureForm()
  }
  
  // Render assessment questions
  return (
    <Card className={cn(
      "w-full",
      theme === 'minimal' && "border-none shadow-none",
      compact && "max-w-md mx-auto"
    )}>
      <CardHeader className={cn(
        theme === 'minimal' && "px-0 pt-0"
      )}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Question {currentIndex + 1} of {config.questions.length}</span>
          </Badge>
        </div>
        {config.showProgress && (
          <Progress value={progress} className="h-2" />
        )}
      </CardHeader>
      
      <CardContent className={cn(
        "space-y-6",
        theme === 'minimal' && "px-0"
      )}>
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
                  {currentQuestion.description && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                          <HelpCircle className="h-4 w-4" />
                          <span className="sr-only">More info</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">{currentQuestion.description}</p>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                {currentQuestion.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </div>
              
              {renderQuestion(currentQuestion)}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
      
      <CardFooter className={cn(
        "flex justify-between",
        theme === 'minimal' && "px-0 pb-0"
      )}>
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentIndex === 0 || !config.allowBackNavigation}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <Button onClick={handleNextQuestion}>
          {currentIndex < config.questions.length - 1 ? (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Complete
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}