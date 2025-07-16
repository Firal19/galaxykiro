"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Modal } from "@/components/ui/modal"
import { Sparkles } from "lucide-react"
import { ProgressiveForm } from "./progressive-form"
import { ProgressiveCaptureWizard } from "./progressive-capture-wizard"

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => Promise<void>
  onStartAssessment?: (data: Record<string, unknown>) => void
  title?: string
  description?: string
  ctaText?: string
  level?: 1 | 2 | 3
  fields?: string[]
  placeholder?: string
  inputType?: string
  useWizard?: boolean
  specialFields?: string
  entryPoint?: string
  showBenefits?: boolean
  allowSkip?: boolean
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  onStartAssessment,
  title = "Discover Your Hidden 90%",
  description = "Get instant access to your personalized Potential Assessment and unlock insights that could transform your life.",
  ctaText = "Get My Assessment",
  level = 1,

  useWizard = false,
  specialFields,
  entryPoint,
  showBenefits = true,
  allowSkip = false
}: LeadCaptureModalProps) {
  const [isSuccess, setIsSuccess] = useState(false)

  // Handle form submission
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    try {
      await onSubmit(data)
      setIsSuccess(true)
      
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        // Start the assessment after successful capture
        if (onStartAssessment) {
          onStartAssessment(data)
        }
      }, 2000)
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  const handleClose = () => {
    onClose()
    setIsSuccess(false)
  }

  // Use wizard for multi-step capture or complex forms
  if (useWizard) {
    return (
      <ProgressiveCaptureWizard
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleFormSubmit}
        initialLevel={level}
        specialFields={specialFields}
        entryPoint={entryPoint}
        title={title}
        description={description}
        showBenefits={showBenefits}
        allowSkip={allowSkip}
      />
    )
  }

  // Use simple modal with progressive form for basic capture
  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <div className="text-center">
        {!isSuccess ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[var(--color-energy-500)] to-[var(--color-transformation-500)] rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {title}
              </h2>
              <p className="text-muted-foreground">
                {description}
              </p>
            </motion.div>

            {/* Progressive Form */}
            <ProgressiveForm
              level={level}
              specialFields={specialFields}
              onSubmit={handleFormSubmit}
              title=""
              description=""
              ctaText={ctaText}
              allowLevelProgression={false}
              showProgress={false}
              entryPoint={entryPoint}
            />

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xs text-muted-foreground"
            >
              <p>✓ Free assessment • ✓ Instant results • ✓ No spam, ever</p>
            </motion.div>
          </>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="py-8"
          >
            <div className="mx-auto w-16 h-16 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-white text-xl"
              >
                ✓
              </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              You&apos;re All Set!
            </h3>
            <p className="text-muted-foreground">
              {level === 1 ? "Check your email for your personalized assessment." : 
               level === 2 ? "We'll be in touch soon with your personalized insights." :
               "Thank you for your information. Your personalized plan is being prepared."}
            </p>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}