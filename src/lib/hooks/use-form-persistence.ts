import { useEffect, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormPersistenceOptions {
  storageKey: string
  debounceMs?: number
  excludeFields?: string[]
}

export function useFormPersistence<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  options: FormPersistenceOptions
) {
  const { storageKey, debounceMs = 500, excludeFields = [] } = options
  const { watch, reset, formState: { isDirty } } = form

  // Save form data to localStorage
  const saveFormData = useCallback((data: T) => {
    try {
      // Filter out excluded fields
      const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
        if (!excludeFields.includes(key)) {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, unknown>)

      const dataToSave = {
        data: filteredData,
        timestamp: Date.now(),
        version: '1.0'
      }

      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving form data:', error)
    }
  }, [storageKey, excludeFields])

  // Load form data from localStorage
  const loadFormData = useCallback((): T | null => {
    try {
      const savedData = localStorage.getItem(storageKey)
      if (!savedData) return null

      const parsed = JSON.parse(savedData)
      
      // Check if data is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      if (Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(storageKey)
        return null
      }

      return parsed.data as T
    } catch (error) {
      console.error('Error loading form data:', error)
      localStorage.removeItem(storageKey)
      return null
    }
  }, [storageKey])

  // Clear saved form data
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Error clearing form data:', error)
    }
  }, [storageKey])

  // Check if there's saved data available
  const hasSavedData = useCallback((): boolean => {
    return loadFormData() !== null
  }, [loadFormData])

  // Restore form data from localStorage
  const restoreFormData = useCallback(() => {
    const savedData = loadFormData()
    if (savedData) {
      reset(savedData)
      return true
    }
    return false
  }, [loadFormData, reset])

  // Watch form changes and save to localStorage with debouncing
  const watchedValues = watch()
  useEffect(() => {
    if (!isDirty) return

    const timeoutId = setTimeout(() => {
      saveFormData(watchedValues)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [watchedValues, isDirty, saveFormData, debounceMs])

  // Auto-restore on mount
  useEffect(() => {
    restoreFormData()
  }, [restoreFormData]) // Only run on mount

  return {
    saveFormData,
    loadFormData,
    clearFormData,
    hasSavedData,
    restoreFormData
  }
}

// Hook for managing progressive capture state
export function useProgressiveCaptureState() {
  const storageKey = 'progressive-capture-state'

  const saveState = useCallback((state: {
    currentLevel: number
    completedLevels: number[]
    lastActivity: string
    entryPoint?: string
  }) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        ...state,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error saving capture state:', error)
    }
  }, [])

  const loadState = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return null

      const parsed = JSON.parse(saved)
      
      // Check if state is not too old (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
      if (Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(storageKey)
        return null
      }

      return parsed
    } catch (error) {
      console.error('Error loading capture state:', error)
      return null
    }
  }, [])

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Error clearing capture state:', error)
    }
  }, [])

  return {
    saveState,
    loadState,
    clearState
  }
}

// Hook for managing form validation state
export function useFormValidationState() {
  const validateField = useCallback((
    fieldName: string,
    value: unknown,
    rules: Record<string, unknown>
  ): { isValid: boolean; error?: string } => {
    // Email validation
    if (rules.email && fieldName === 'email') {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      if (!emailRegex.test(value)) {
        return { isValid: false, error: 'Please enter a valid email address' }
      }
    }

    // Phone validation
    if (rules.phone && fieldName === 'phone') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(value) || value.length < 10) {
        return { isValid: false, error: 'Please enter a valid phone number' }
      }
    }

    // Required field validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return { isValid: false, error: `${fieldName} is required` }
    }

    // Minimum length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return { 
        isValid: false, 
        error: `${fieldName} must be at least ${rules.minLength} characters` 
      }
    }

    // Maximum length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return { 
        isValid: false, 
        error: `${fieldName} must be less than ${rules.maxLength} characters` 
      }
    }

    return { isValid: true }
  }, [])

  const validateForm = useCallback((
    formData: Record<string, unknown>,
    fieldRules: Record<string, Record<string, unknown>>
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}
    let isValid = true

    Object.entries(fieldRules).forEach(([fieldName, rules]) => {
      const validation = validateField(fieldName, formData[fieldName], rules)
      if (!validation.isValid) {
        errors[fieldName] = validation.error!
        isValid = false
      }
    })

    return { isValid, errors }
  }, [validateField])

  return {
    validateField,
    validateForm
  }
}