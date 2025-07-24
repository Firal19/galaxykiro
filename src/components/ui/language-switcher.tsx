"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/hooks/use-i18n'
import { Language, LocaleConfig } from '@/lib/i18n'

interface LanguageSwitcherProps {
  variant?: 'button' | 'dropdown' | 'minimal'
  showFlag?: boolean
  showName?: boolean
  className?: string
}

export function LanguageSwitcher({ 
  variant = 'dropdown',
  showFlag = true,
  showName = true,
  className 
}: LanguageSwitcherProps) {
  const { currentLanguage, currentLocale, changeLanguage, getAvailableLanguages } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  
  const availableLanguages = getAvailableLanguages()

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language)
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {availableLanguages.map((locale) => (
          <button
            key={locale.code}
            onClick={() => handleLanguageChange(locale.code)}
            className={cn(
              "text-sm font-medium transition-colors px-2 py-1 rounded",
              currentLanguage === locale.code
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {showFlag && locale.flag} {showName && locale.nativeName}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {availableLanguages.map((locale) => (
          <Button
            key={locale.code}
            variant={currentLanguage === locale.code ? "default" : "outline"}
            size="sm"
            onClick={() => handleLanguageChange(locale.code)}
            className="flex items-center space-x-1"
          >
            {showFlag && <span>{locale.flag}</span>}
            {showName && <span>{locale.nativeName}</span>}
          </Button>
        ))}
      </div>
    )
  }

  // Dropdown variant (default)
  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Globe className="h-4 w-4" />
        {showFlag && <span>{currentLocale.flag}</span>}
        {showName && <span className="hidden sm:inline">{currentLocale.nativeName}</span>}
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] bg-background border border-border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-1">
                {availableLanguages.map((locale) => {
                  const isSelected = currentLanguage === locale.code
                  
                  return (
                    <motion.button
                      key={locale.code}
                      whileHover={{ backgroundColor: 'var(--muted)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLanguageChange(locale.code)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                        isSelected && "bg-primary/10 text-primary"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {showFlag && (
                          <span className="text-lg" role="img" aria-label={locale.name}>
                            {locale.flag}
                          </span>
                        )}
                        <div className="text-left">
                          <div className="font-medium">{locale.nativeName}</div>
                          <div className="text-xs text-muted-foreground">{locale.name}</div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}