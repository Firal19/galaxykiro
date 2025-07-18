"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { Mail, Phone, User, MapPin, Briefcase, Target, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { level1Schema, level2Schema, level3Schema, validateFormData } from "@/lib/validations"

// Form field configuration
interface FieldConfig {
  name: string
  label: string
  placeholder: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  icon: React.ComponentType<{ className?: string }>
  required: boolean
  options?: { value: string; label: string }[]
  validation?: Record<string, unknown>
}

// Level-based field configurations
const LEVEL_FIELDS: Record<number, FieldConfig[]> = {
  1: [
    {
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      type: 'email',
      icon: Mail,
      required: true,
    }
  ],
  2: [
    {
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      type: 'email',
      icon: Mail,
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      type: 'tel',
      icon: Phone,
      required: true,
    }
  ],
  3: [
    {
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      type: 'email',
      icon: Mail,
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      type: 'tel',
      icon: Phone,
      required: true,
    },
    {
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      type: 'text',
      icon: User,
      required: true,
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'Enter your city',
      type: 'text',
      icon: MapPin,
      required: true,
    }
  ]
}

// Special field configurations for different capture scenarios
const SPECIAL_FIELD_CONFIGS: Record<string, FieldConfig[]> = {
  'name-city': [
    {
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      type: 'text',
      icon: User,
      required: true,
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'Enter your city',
      type: 'text',
      icon: MapPin,
      required: true,
    }
  ],
  'office-location': [
    {
      name: 'officeLocation',
      label: 'Preferred Office Location',
      placeholder: 'Select office location',
      type: 'select',
      icon: MapPin,
      required: true,
      options: [
        { value: 'addis-ababa-bole', label: 'Addis Ababa - Bole' },
        { value: 'addis-ababa-piazza', label: 'Addis Ababa - Piazza' },
        { value: 'bahir-dar', label: 'Bahir Dar' },
        { value: 'hawassa', label: 'Hawassa' },
        { value: 'mekelle', label: 'Mekelle' },
        { value: 'dire-dawa', label: 'Dire Dawa' },
      ]
    }
  ],
  'full-profile': [
    {
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      type: 'email',
      icon: Mail,
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      type: 'tel',
      icon: Phone,
      required: true,
    },
    {
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      type: 'text',
      icon: User,
      required: true,
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'Enter your city',
      type: 'text',
      icon: MapPin,
      required: true,
    },
    {
      name: 'occupation',
      label: 'Occupation',
      placeholder: 'Enter your occupation (optional)',
      type: 'text',
      icon: Briefcase,
      required: false,
    },
    {
      name: 'goals',
      label: 'Main Goals',
      placeholder: 'What are your main goals? (optional)',
      type: 'textarea',
      icon: Target,
      required: false,
    }
  ]
}

interface ProgressiveFormProps {
  level?: 1 | 2 | 3
  specialFields?: string
  onSubmit: (data: Record<string, unknown>, level: number) => Promise<void>
  onLevelChange?: (level: number) => void
  title?: string
  description?: string
  ctaText?: string
  allowLevelProgression?: boolean
  showProgress?: boolean
  entryPoint?: string
  className?: string
}

export function ProgressiveForm({
  level: initialLevel = 1,
  specialFields,
  onSubmit,
  onLevelChange,
  title,
  description,
  ctaText = "Continue",
  allowLevelProgression = true,
  showProgress = true,
  entryPoint,
  className
}: ProgressiveFormProps) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const { user, captureUserInfo, isLoading } = useAppStore()

  // Get field configuration based on level or special fields
  const getFieldConfig = useCallback(() => {
    if (specialFields && SPECIAL_FIELD_CONFIGS[specialFields]) {
      return SPECIAL_FIELD_CONFIGS[specialFields]
    }
    return LEVEL_FIELDS[currentLevel] || LEVEL_FIELDS[1]
  }, [currentLevel, specialFields])

  // Get validation schema based on level or special fields
  const getValidationSchema = useCallback(() => {
    if (specialFields) {
      const fields = SPECIAL_FIELD_CONFIGS[specialFields]
      if (!fields || !Array.isArray(fields)) return level1Schema
      
      const schemaFields: Record<string, z.ZodTypeAny> = {}
      fields.forEach(field => {
        switch (field.type) {
          case 'email':
            schemaFields[field.name] = z.string().email('Please enter a valid email address')
            break
          case 'tel':
            schemaFields[field.name] = z.string().min(10, 'Phone number must be at least 10 digits')
            break
          case 'text':
          case 'select':
            if (field.required) {
              schemaFields[field.name] = z.string().min(2, `${field.label} must be at least 2 characters`)
            } else {
              schemaFields[field.name] = z.string().optional()
            }
            break
          case 'textarea':
            schemaFields[field.name] = z.string().optional()
            break
        }
      })
      return z.object(schemaFields)
    }
    
    switch (currentLevel) {
      case 2:
        return level2Schema
      case 3:
        return level3Schema
      default:
        return level1Schema
    }
  }, [currentLevel, specialFields])

  // Initialize form with react-hook-form
  const methods = useForm({
    resolver: zodResolver(getValidationSchema()),
    mode: 'onChange',
    defaultValues: formData
  })

  const { handleSubmit, formState: { errors, isValid, isDirty }, reset, watch, setValue } = methods

  // Pre-populate form with existing user data
  useEffect(() => {
    if (user) {
      const existingData: Record<string, unknown> = {}
      
      if (user.email) existingData.email = user.email
      if (user.phone) existingData.phone = user.phone
      if (user.fullName) existingData.fullName = user.fullName
      if (user.city) existingData.city = user.city
      
      setFormData(prev => ({ ...prev, ...existingData }))
      
      // Update form values
      Object.entries(existingData).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [user, setValue])

  // Persist form data to localStorage for recovery
  const watchedValues = watch()
  useEffect(() => {
    if (isDirty) {
      const dataToSave = { ...formData, ...watchedValues }
      localStorage.setItem('progressive-form-data', JSON.stringify(dataToSave))
      setFormData(dataToSave)
    }
  }, [watchedValues, isDirty, formData])

  // Recover form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('progressive-form-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
        reset(parsedData)
      } catch (error) {
        console.error('Error recovering form data:', error)
      }
    }
  }, [reset])

  // Real-time validation
  useEffect(() => {
    try {
      const currentData = { ...formData, ...watchedValues }
      const validation = validateFormData(currentData, currentLevel as 1 | 2 | 3)
      
      if (!validation.success && validation.errors) {
        setValidationErrors(validation.errors)
      } else {
        setValidationErrors({})
      }
    } catch (error) {
      console.error('Validation error:', error)
      setValidationErrors({})
    }
  }, [watchedValues, currentLevel, formData])

  // Handle form submission
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      // Merge with existing form data
      const completeData = { ...formData, ...data }
      
      // Submit to parent component
      await onSubmit(completeData, currentLevel)
      
      // Update user data in store
      await captureUserInfo(currentLevel as 1 | 2 | 3, completeData, entryPoint)
      
      // Clear saved form data on successful submission
      localStorage.removeItem('progressive-form-data')
      
      setIsSuccess(true)
      
      // Reset success state after delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)
      
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle level progression
  const handleLevelProgression = () => {
    if (currentLevel < 3 && allowLevelProgression) {
      const nextLevel = currentLevel + 1
      setCurrentLevel(nextLevel)
      onLevelChange?.(nextLevel)
    }
  }

  // Handle level regression
  const handleLevelRegression = () => {
    if (currentLevel > 1) {
      const prevLevel = currentLevel - 1
      setCurrentLevel(prevLevel)
      onLevelChange?.(prevLevel)
    }
  }

  // Render form field
  const renderField = (field: FieldConfig) => {
    const Icon = field.icon
    const error = errors[field.name] || validationErrors[field.name]

    if (field.type === 'select') {
      return (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-foreground mb-2">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              {...methods.register(field.name)}
              className={cn(
                "w-full pl-10 pr-4 py-3 border border-border rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-energy-500)] focus:border-transparent",
                "bg-background text-foreground transition-all duration-200",
                error && "border-destructive focus:ring-destructive",
                "appearance-none"
              )}
            >
              <option value="">{field.placeholder}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {error.message || error}
            </motion.p>
          )}
        </motion.div>
      )
    }

    if (field.type === 'textarea') {
      return (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-foreground mb-2">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <textarea
              {...methods.register(field.name)}
              placeholder={field.placeholder}
              rows={3}
              className={cn(
                "w-full pl-10 pr-4 py-3 border border-border rounded-lg resize-none",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-energy-500)] focus:border-transparent",
                "bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200",
                error && "border-destructive focus:ring-destructive"
              )}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm mt-1 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {error.message || error}
            </motion.p>
          )}
        </motion.div>
      )
    }

    return (
      <motion.div
        key={field.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-foreground mb-2">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            {...methods.register(field.name)}
            type={field.type}
            placeholder={field.placeholder}
            className={cn(
              "w-full pl-10 pr-4 py-3 border border-border rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-energy-500)] focus:border-transparent",
              "bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200",
              error && "border-destructive focus:ring-destructive"
            )}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm mt-1 flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {error.message || error}
          </motion.p>
        )}
      </motion.div>
    )
  }

  const fields = getFieldConfig() || []

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Header */}
          {(title || description) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              {title && (
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-muted-foreground">
                  {description}
                </p>
              )}
            </motion.div>
          )}

          {/* Progress Indicator */}
          {showProgress && !specialFields && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentLevel} of 3
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentLevel / 3) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentLevel / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-transformation-500)] h-2 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* Form Fields */}
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={`level-${currentLevel}-${specialFields}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {fields && fields.length > 0 ? (
                  fields.map(field => renderField(field))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No form fields configured
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-16 h-16 bg-[var(--color-growth-500)] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Information Saved!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for providing your information. You can now access more personalized features.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Actions */}
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-between pt-4"
            >
              {/* Back Button */}
              {currentLevel > 1 && allowLevelProgression && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLevelRegression}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}

              <div className="flex-1" />

              {/* Submit/Next Button */}
              <Button
                type="submit"
                variant="cta"
                disabled={isSubmitting || isLoading || !isValid}
                className="flex items-center"
              >
                {isSubmitting || isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <>
                    {ctaText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Level Progression Button */}
          {!isSuccess && currentLevel < 3 && allowLevelProgression && isValid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center pt-4 border-t border-border"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={handleLevelProgression}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Want to provide more information for better personalization?
              </Button>
            </motion.div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}