"use client"

import { useState, useEffect, useCallback } from 'react'
import i18n, { Language, LocaleConfig } from '@/lib/i18n'

export function useI18n() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => i18n?.getCurrentLanguage() || 'en')
  const [currentLocale, setCurrentLocale] = useState<LocaleConfig>(() => i18n?.getCurrentLocale() || {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
    dateFormat: { locale: 'en-US', calendar: 'gregory', numberingSystem: 'latn' },
    numberFormat: { notation: 'standard', numberingSystem: 'latn' }
  })

  // Update state when language changes
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language)
      setCurrentLocale(event.detail.locale)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('languagechange', handleLanguageChange as EventListener)
      
      return () => {
        window.removeEventListener('languagechange', handleLanguageChange as EventListener)
      }
    }
  }, [])

  // Change language
  const changeLanguage = useCallback((language: Language) => {
    i18n?.setLanguage(language)
  }, [])

  // Translation function with SSR compatibility
  const t = useCallback((key: string, params?: Record<string, string>) => {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback - use simple translations
      const translations: Record<string, string> = {
        'nav.home': 'Home',
        'nav.tools': 'Tools',
        'nav.content': 'Content',
        'nav.community': 'Community',
        'nav.about': 'About',
        'nav.signin': 'Sign In',
        'nav.signup': 'Sign Up'
      }
      return translations[key] || key
    }
    return i18n?.t(key, params) || key
  }, [])

  // Assessment translation function
  const tAssessment = useCallback((assessmentId: string, key: string) => {
    return i18n?.tAssessment(assessmentId, key) || key
  }, [])

  // Format date
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return i18n?.formatDate(date, options) || date.toLocaleDateString()
  }, [])

  // Format number
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return i18n?.formatNumber(number, options) || number.toString()
  }, [])

  // Format currency
  const formatCurrency = useCallback((amount: number, currency?: string) => {
    return i18n?.formatCurrency(amount, currency) || `$${amount}`
  }, [])

  // Check if current language is RTL
  const isRTL = useCallback(() => {
    return i18n?.isRTL() || false
  }, [currentLanguage])

  // Get direction class
  const getDirectionClass = useCallback(() => {
    return i18n?.getDirectionClass() || 'ltr'
  }, [currentLanguage])

  // Get available languages
  const getAvailableLanguages = useCallback(() => {
    return i18n?.getAvailableLanguages() || []
  }, [])

  // Pluralization helper
  const plural = useCallback((count: number, singular: string, plural?: string) => {
    return i18n?.plural(count, singular, plural) || (count === 1 ? singular : (plural || singular + 's'))
  }, [])

  return {
    // Current state
    currentLanguage,
    currentLocale,
    
    // Language management
    changeLanguage,
    getAvailableLanguages,
    
    // Translation functions
    t,
    tAssessment,
    
    // Formatting functions
    formatDate,
    formatNumber,
    formatCurrency,
    
    // Utility functions
    isRTL,
    getDirectionClass,
    plural
  }
}