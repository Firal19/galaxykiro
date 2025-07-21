"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowLeft, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProgressiveForm } from "./progressive-form"
import { useAppStore } from "@/lib/store"
import { useProgressiveCaptureState } from "@/lib/hooks/use-form-persistence"
import { cn } from "@/lib/utils"

interface CaptureStep {
  level: 1 | 2 | 3
  title: string
  description: string
  benefits: string[]
  ctaText: string
  specialFields?: string
}

const CAPTURE_STEPS: CaptureStep[] = [
  {
    level: 1,
    title: "Get Started",
    description: "Enter your email to access your personalized assessment and insights.",
    benefits: [
      "Instant access to assessment tools",
      "Personalized insights and recommendations",
      "No spam, ever - we respect your privacy"
    ],
    ctaText: "Get My Assessment"
  },
  {
    level: 2,
    title: "Unlock More Features",
    description: "Add your phone number to receive personalized tips and exclusive content.",
    benefits: [
      "SMS tips and reminders",
      "Priority access to webinars",
      "Personalized coaching insights"
    ],
    ctaText: "Unlock Features"
  },
  {
    level: 3,
    title: "Complete Your Profile",
    description: "Complete your profile for the most personalized experience possible.",
    benefits: [
      "Fully customized recommendations",
      "Local office visit scheduling",
      "Premium content access"
    ],
    ctaText: "Complete Profile"
  }
]

interface ProgressiveCaptureWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: Record<string, unknown>, level: number) => void
  initialLevel?: 1 | 2 | 3
  specialFields?: string
  entryPoint?: string
  title?: string
  description?: string
  showBenefits?: boolean
  allowSkip?: boolean
  className?: string
}

export function ProgressiveCaptureWizard({
  isOpen,
  onClose,
  onComplete,
  initialLevel = 1,
  specialFields,
  entryPoint,
  title,
  description,
  showBenefits = true,
  allowSkip = false,
  className
}: ProgressiveCaptureWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [collectedData, setCollectedData] = useState<Record<string, unknown>>({})
  
  const { user } = useAppStore()
  const { saveState, loadState, clearState } = useProgressiveCaptureState()

  // Determine which steps to show based on user's current capture level
  const getAvailableSteps = useCallback(() => {
    if (specialFields) {
      return [{
        level: initialLevel,
        title: title || "Provide Information",
        description: description || "Please provide the required information to continue.",
        benefits: [],
        ctaText: "Continue",
        specialFields
      }]
    }

    const userLevel = user?.captureLevel || 0
    return CAPTURE_STEPS.filter(step => step.level > userLevel)
  }, [user?.captureLevel, specialFields, initialLevel, title, description])

  const availableSteps = getAvailableSteps()

  // Load saved state on mount
  useEffect(() => {
    if (isOpen) {
      const savedState = loadState()
      if (savedState) {
        setCurrentStep(savedState.currentStep || 0)
        setCompletedSteps(savedState.completedSteps || [])
        setCollectedData(savedState.collectedData || {})
      }
    }
  }, [isOpen, loadState])

  // Save state when it changes
  useEffect(() => {
    if (isOpen) {
      saveState({
        currentStep,
        completedSteps,
        collectedData,
        lastActivity: new Date().toISOString(),
        entryPoint
      })
    }
  }, [currentStep, completedSteps, collectedData, isOpen, saveState, entryPoint])

  // Handle form submission for each step
  const handleStepSubmit = async (data: Record<string, unknown>, level: number) => {
    setIsSubmitting(true)
    try {
      const updatedData = { ...collectedData, ...data }
      setCollectedData(updatedData)
      
      // Mark step as completed
      const stepIndex = availableSteps.findIndex(step => step.level === level)
      if (stepIndex !== -1 && !completedSteps.includes(stepIndex)) {
        setCompletedSteps(prev => [...prev, stepIndex])
      }

      // Call parent completion handler
      await onComplete(updatedData, level)

      // Move to next step or close if this was the last step
      if (currentStep < availableSteps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        // All steps completed
        clearState()
        onClose()
      }
    } catch (error) {
      console.error('Error submitting step:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle step navigation
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < availableSteps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    if (allowSkip) {
      onClose()
    }
  }

  if (!isOpen || availableSteps.length === 0) {
    return null
  }

  const currentStepData = availableSteps[currentStep]
  const isLastStep = currentStep === availableSteps.length - 1
  const canGoBack = currentStep > 0

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className={cn(
          "bg-background border border-border rounded-lg shadow-xl",
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground mt-1">
                {currentStepData.description}
              </p>
            </div>
            {allowSkip && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          {availableSteps.length > 1 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {availableSteps.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentStep + 1) / availableSteps.length) * 100)}% Complete
                </span>
              </div>
              <div className="flex space-x-2">
                {availableSteps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 h-2 rounded-full transition-all duration-300",
                      index <= currentStep
                        ? "bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)]"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgressiveForm
                    level={currentStepData.level}
                    specialFields={currentStepData.specialFields}
                    onSubmit={handleStepSubmit}
                    ctaText={currentStepData.ctaText}
                    allowLevelProgression={false}
                    showProgress={false}
                    entryPoint={entryPoint}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Benefits Section */}
            {showBenefits && currentStepData.benefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[var(--color-energy-500)] drop-shadow-md" />
                    What you&apos;ll get:
                  </h3>
                  <ul className="space-y-3">
                    {currentStepData.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-start"
                      >
                        <CheckCircle className="h-5 w-5 text-[var(--color-growth-500)] mr-3 mt-0.5 flex-shrink-0 drop-shadow-md" />
                        <span className="text-muted-foreground drop-shadow-md">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-muted/50 rounded-lg p-4"
                >
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-[var(--color-energy-500)] mr-2 drop-shadow-md" />
                    <span className="text-sm font-medium text-foreground drop-shadow-md">
                      Join 10,000+ people
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground drop-shadow-md">
                    Who have already discovered their hidden potential and are transforming their lives.
                  </p>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center drop-shadow-md">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      100% Free
                    </span>
                    <span className="flex items-center drop-shadow-md">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      No Spam
                    </span>
                    <span className="flex items-center drop-shadow-md">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Instant Access
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        {availableSteps.length > 1 && (
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              {canGoBack ? (
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {/* Step Indicators */}
              <div className="flex space-x-2">
                {availableSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index)}
                    disabled={isSubmitting}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      index === currentStep
                        ? "bg-[var(--color-energy-500)] scale-125"
                        : completedSteps.includes(index)
                        ? "bg-[var(--color-growth-500)]"
                        : "bg-muted hover:bg-muted-foreground/20"
                    )}
                  />
                ))}
              </div>

              {/* Next/Skip Button */}
              <div className="flex items-center space-x-2">
                {!isLastStep && allowSkip && (
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                    className="text-muted-foreground"
                  >
                    Skip
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}