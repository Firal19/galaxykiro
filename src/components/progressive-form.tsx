"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { z } from "zod"
import { 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
      icon: User, // Changed from Briefcase to User for consistency
      required: false,
    },
    {
      name: 'goals',
      label: 'Main Goals',
      placeholder: 'What are your main goals? (optional)',
      type: 'textarea',
      icon: User, // Changed from Target to User for consistency
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
  existingData?: Record<string, unknown>
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
  className,
  existingData
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
  const validationSchema = useMemo(() => {
    if (specialFields) {
      const fields = SPECIAL_FIELD_CONFIGS[specialFields]
      if (!fields || !Array.isArray(fields)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Special field config "${specialFields}" not found, falling back to level1Schema`)
        }
        return level1Schema
      }
      
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
          default:
            if (field.required) {
              schemaFields[field.name] = z.string().min(1, `${field.label} is required`)
            } else {
              schemaFields[field.name] = z.string().optional()
            }
        }
      })
      
      // Ensure we have at least one field
      if (Object.keys(schemaFields).length === 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`No valid fields found for special config "${specialFields}", falling back to level1Schema`)
        }
        return level1Schema
      }
      
      return z.object(schemaFields)
    }
    
    // Regular level-based validation - ensure we always return a valid schema
    switch (currentLevel) {
      case 2:
        return level2Schema || level1Schema
      case 3:
        return level3Schema || level1Schema
      case 1:
      default:
        return level1Schema
    }
  }, [currentLevel, specialFields])
  
  // Initialize form with react-hook-form
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: formData
  })

  const { handleSubmit, formState: { errors, isValid, isDirty }, reset, watch, setValue } = methods

  // Pre-populate form with existing user data
  useEffect(() => {
    let dataToSet: Record<string, unknown> = {}
    
    // Get data from user context
    if (user) {
      if (user.email) dataToSet.email = user.email
      if (user.phone) dataToSet.phone = user.phone
      if (user.fullName) dataToSet.fullName = user.fullName
      if (user.city) dataToSet.city = user.city
    }
    
    // Override with explicitly passed existingData
    if (existingData) {
      dataToSet = { ...dataToSet, ...existingData }
    }
    
    // Update form if we have any data
    if (Object.keys(dataToSet).length > 0) {
      setFormData(prev => ({ ...prev, ...dataToSet }))
      
      // Update form values
      Object.entries(dataToSet).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [user, existingData, setValue])

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

  // Handle form submission
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true)
    try {
      // Use the submitted data directly instead of calling watch()
      const completeData = { ...formData, ...data }
      
      // Save to localStorage
      localStorage.setItem('progressive-form-data', JSON.stringify(completeData))
      
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
          <label htmlFor={field.name} className="block text-sm font-medium text-foreground mb-2">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <select
              id={field.name}
              {...methods.register(field.name)}
              aria-describedby={error ? `${field.name}-error` : `${field.name}-help`}
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
          {!error && (
            <p id={`${field.name}-help`} className="text-muted-foreground text-sm mt-1">
              {field.placeholder || `Enter your ${field.label.toLowerCase()}`}
            </p>
          )}
          {error && (
            <motion.p
              id={`${field.name}-error`}
              role="alert"
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
          <label htmlFor={field.name} className="block text-sm font-medium text-foreground mb-2">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <div className="relative">
            <Icon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <textarea
              id={field.name}
              {...methods.register(field.name)}
              placeholder={field.placeholder}
              aria-describedby={error ? `${field.name}-error` : `${field.name}-help`}
              rows={3}
              className={cn(
                "w-full pl-10 pr-4 py-3 border border-border rounded-lg resize-none",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-energy-500)] focus:border-transparent",
                "bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200",
                error && "border-destructive focus:ring-destructive"
              )}
            />
          </div>
          {!error && (
            <p id={`${field.name}-help`} className="text-muted-foreground text-sm mt-1">
              {field.placeholder || `Enter your ${field.label.toLowerCase()}`}
            </p>
          )}
          {error && (
            <motion.p
              id={`${field.name}-error`}
              role="alert"
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
        <label htmlFor={field.name} className="block text-sm font-medium text-foreground mb-2">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id={field.name}
            {...methods.register(field.name)}
            type={field.type}
            placeholder={field.placeholder}
            aria-describedby={error ? `${field.name}-error` : `${field.name}-help`}
            className={cn(
              "w-full pl-10 pr-4 py-3 border border-border rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-energy-500)] focus:border-transparent",
              "bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200",
              error && "border-destructive focus:ring-destructive"
            )}
          />
        </div>
        {!error && (
          <p id={`${field.name}-help`} className="text-muted-foreground text-sm mt-1">
            {field.placeholder || `Enter your ${field.label.toLowerCase()}`}
          </p>
        )}
        {error && (
          <motion.p
            id={`${field.name}-error`}
            role="alert"
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
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="space-y-6"
        role="form"
        aria-label={title || `Level ${currentLevel} Information Form`}
      >
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
                  <ChevronLeft className="h-4 w-4 mr-2" />
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    {ctaText}
                    <ChevronRight className="h-4 w-4 ml-2" />
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
    </div>
  )
}