"use client"

import { ReactNode } from 'react'
import { useI18n } from '@/lib/hooks/use-i18n'
import { Language } from '@/lib/i18n'

interface LocalizedContentProps {
  children: {
    [K in Language]?: ReactNode
  }
  fallback?: ReactNode
}

interface LocalizedTextProps {
  content: {
    [K in Language]?: string
  }
  fallback?: string
  className?: string
}

interface LocalizedImageProps {
  src: {
    [K in Language]?: string
  }
  alt: {
    [K in Language]?: string
  }
  fallbackSrc?: string
  fallbackAlt?: string
  className?: string
  [key: string]: any
}

// Component for localizing any content based on current language
export function LocalizedContent({ children, fallback }: LocalizedContentProps) {
  const { currentLanguage } = useI18n()
  
  const content = children[currentLanguage] || children.en || fallback
  
  return <>{content}</>
}

// Component for localizing text content
export function LocalizedText({ 
  content, 
  fallback, 
  className 
}: LocalizedTextProps) {
  const { currentLanguage } = useI18n()
  
  const text = content[currentLanguage] || content.en || fallback || ''
  
  return <span className={className}>{text}</span>
}

// Component for localizing images
export function LocalizedImage({ 
  src, 
  alt, 
  fallbackSrc, 
  fallbackAlt, 
  className,
  ...props 
}: LocalizedImageProps) {
  const { currentLanguage } = useI18n()
  
  const imageSrc = src[currentLanguage] || src.en || fallbackSrc || ''
  const imageAlt = alt[currentLanguage] || alt.en || fallbackAlt || ''
  
  return (
    <img 
      src={imageSrc}
      alt={imageAlt}
      className={className}
      {...props}
    />
  )
}

// Higher-order component for direction-aware styling
interface DirectionAwareProps {
  children: ReactNode
  rtlClassName?: string
  ltrClassName?: string
  className?: string
}

export function DirectionAware({ 
  children, 
  rtlClassName = '', 
  ltrClassName = '', 
  className = '' 
}: DirectionAwareProps) {
  const { isRTL } = useI18n()
  
  const directionClass = isRTL() ? rtlClassName : ltrClassName
  const combinedClassName = [className, directionClass].filter(Boolean).join(' ')
  
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  )
}

// Component for localized dates
interface LocalizedDateProps {
  date: Date
  options?: Intl.DateTimeFormatOptions
  className?: string
  format?: 'short' | 'medium' | 'long' | 'full' | 'relative'
}

export function LocalizedDate({ 
  date, 
  options, 
  className,
  format = 'medium'
}: LocalizedDateProps) {
  const { formatDate, currentLanguage } = useI18n()
  
  let formatOptions: Intl.DateTimeFormatOptions = options || {}
  
  // Apply preset formats
  if (!options) {
    switch (format) {
      case 'short':
        formatOptions = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }
        break
      case 'medium':
        formatOptions = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }
        break
      case 'long':
        formatOptions = { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }
        break
      case 'full':
        formatOptions = { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
        break
      case 'relative':
        // Simple relative time formatting
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
          return <span className={className}>
            {currentLanguage === 'am' ? 'ዛሬ' : 'Today'}
          </span>
        } else if (diffDays === 1) {
          return <span className={className}>
            {currentLanguage === 'am' ? 'ትናንት' : 'Yesterday'}
          </span>
        } else if (diffDays < 7) {
          return <span className={className}>
            {diffDays} {currentLanguage === 'am' ? 'ቀናት በፊት' : 'days ago'}
          </span>
        }
        // Fall back to short format for older dates
        formatOptions = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }
        break
    }
  }
  
  const formattedDate = formatDate(date, formatOptions)
  
  return <span className={className}>{formattedDate}</span>
}

// Component for localized numbers
interface LocalizedNumberProps {
  value: number
  options?: Intl.NumberFormatOptions
  className?: string
  format?: 'decimal' | 'currency' | 'percent'
  currency?: string
}

export function LocalizedNumber({ 
  value, 
  options, 
  className,
  format = 'decimal',
  currency = 'USD'
}: LocalizedNumberProps) {
  const { formatNumber, formatCurrency } = useI18n()
  
  let formatOptions: Intl.NumberFormatOptions = options || {}
  
  if (!options) {
    switch (format) {
      case 'currency':
        return <span className={className}>{formatCurrency(value, currency)}</span>
      case 'percent':
        formatOptions = { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 1 }
        break
      case 'decimal':
      default:
        formatOptions = { minimumFractionDigits: 0, maximumFractionDigits: 2 }
        break
    }
  }
  
  const formattedNumber = formatNumber(value, formatOptions)
  
  return <span className={className}>{formattedNumber}</span>
}

// Component for localized pluralization
interface LocalizedPluralProps {
  count: number
  singular: string
  plural?: string
  showCount?: boolean
  className?: string
}

export function LocalizedPlural({ 
  count, 
  singular, 
  plural,
  showCount = true,
  className 
}: LocalizedPluralProps) {
  const { plural: pluralize, formatNumber } = useI18n()
  
  const text = pluralize(count, singular, plural)
  const formattedCount = formatNumber(count)
  
  return (
    <span className={className}>
      {showCount && `${formattedCount} `}{text}
    </span>
  )
}