"use client"

/**
 * Internationalization (i18n) System for Galaxy Kiro
 * 
 * This system provides:
 * - English/Amharic language support
 * - Dynamic language switching
 * - Localized content delivery
 * - RTL support for Amharic
 * - Cultural adaptations
 * - Date/time formatting
 * - Number formatting
 */

export type Language = 'en' | 'am'
export type LanguageDirection = 'ltr' | 'rtl'

interface TranslationKey {
  en: string
  am: string
}

interface DateFormatOptions {
  locale: string
  calendar?: 'gregory' | 'ethiopic'
  numberingSystem?: 'latn' | 'ethi'
}

export interface LocaleConfig {
  code: Language
  name: string
  nativeName: string
  direction: LanguageDirection
  flag: string
  dateFormat: DateFormatOptions
  numberFormat: Intl.NumberFormatOptions
}

// Language configurations
export const locales: Record<Language, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
    dateFormat: {
      locale: 'en-US',
      calendar: 'gregory',
      numberingSystem: 'latn'
    },
    numberFormat: {
      notation: 'standard',
      numberingSystem: 'latn'
    }
  },
  am: {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    direction: 'ltr', // Amharic is actually LTR
    flag: '🇪🇹',
    dateFormat: {
      locale: 'am-ET',
      calendar: 'ethiopic',
      numberingSystem: 'ethi'
    },
    numberFormat: {
      notation: 'standard',
      numberingSystem: 'ethi'
    }
  }
}

// Translation dictionaries
export const translations: Record<string, TranslationKey> = {
  // Navigation
  'nav.home': {
    en: 'Home',
    am: 'ወደ ቤት'
  },
  'nav.about': {
    en: 'About',
    am: 'ስለ እኛ'
  },
  'nav.tools': {
    en: 'Tools',
    am: 'መሳሪያዎች'
  },
  'nav.content': {
    en: 'Content',
    am: 'ይዘት'
  },
  'nav.community': {
    en: 'Community',
    am: 'ማህበረሰብ'
  },
  'nav.signin': {
    en: 'Sign In',
    am: 'ግባ'
  },
  'nav.signup': {
    en: 'Sign Up',
    am: 'ተመዝግብ'
  },

  // Hero Section
  'hero.title': {
    en: 'Unlock Your Infinite Potential',
    am: 'ያልተወሰነ አቅምዎን ይክፈቱ'
  },
  'hero.subtitle': {
    en: 'Discover who you really are and transform your life with our powerful assessment tools and personalized growth journey.',
    am: 'እርስዎ በእውነት ማን እንደሆኑ ያውቁ እና በኃይለኛ የግምገማ መሳሪያዎቻችን እና በግል የእድገት ጉዞ ህይወትዎን ይለውጡ።'
  },
  'hero.cta.primary': {
    en: 'Start Your Journey',
    am: 'ጉዞዎን ይጀምሩ'
  },
  'hero.cta.secondary': {
    en: 'Learn More',
    am: 'ተጨማሪ ይወቁ'
  },

  // Tools Section
  'tools.heading': {
    en: 'Powerful Assessment Tools',
    am: 'ኃይለኛ የግምገማ መሳሪያዎች'
  },
  'tools.description': {
    en: 'Discover your unique strengths, preferences, and potential with our scientifically-backed assessment tools.',
    am: 'በእኛ በሳይንስ የተደገፉ የግምገማ መሳሪያዎች ልዩ ጥንካሬዎችዎን፣ ምርጫዎችዎን እና አቅምዎን ያግኙ።'
  },

  // Tool Names
  'tool.potential-quotient': {
    en: 'Potential Quotient',
    am: 'የአቅም መጠን'
  },
  'tool.decision-style': {
    en: 'Decision Style',
    am: 'የውሳኔ ዘይቤ'
  },
  'tool.leadership-style': {
    en: 'Leadership Style',
    am: 'የአመራር ዘይቤ'
  },
  'tool.future-self': {
    en: 'Future Self Visualization',
    am: 'የወደፊት ራስ መግለጫ'
  },
  'tool.transformation-readiness': {
    en: 'Transformation Readiness',
    am: 'የለውጥ ዝግጁነት'
  },

  // Tool Descriptions
  'tool.potential-quotient.desc': {
    en: 'Discover your untapped potential and areas for exponential growth.',
    am: 'ያልተጠቀሙባቸውን አቅሞችዎን እና ለባዛ እድገት የሚሆኑ ክፍሎችን ያግኙ።'
  },
  'tool.decision-style.desc': {
    en: 'Understand how you make decisions and optimize your decision-making process.',
    am: 'እንዴት ውሳኔ እንደሚያደርጉ ይረዱ እና የውሳኔ አሰጣጥ ሂደትዎን ያሻሽሉ።'
  },
  'tool.leadership-style.desc': {
    en: 'Identify your natural leadership approach and develop your leadership skills.',
    am: 'የተፈጥሮ የአመራር አቀራረብዎን ይለዩ እና የአመራር ክህሎትዎን ያዳብሩ።'
  },

  // Membership
  'membership.soft.title': {
    en: 'Soft Membership',
    am: 'ቀላል አባልነት'
  },
  'membership.soft.description': {
    en: 'Get started with free access to essential tools and resources.',
    am: 'ወደ አስፈላጊ መሳሪያዎች እና ሀብቶች በነጻ መዳረሻ ጀምር።'
  },
  'membership.full.title': {
    en: 'Full Membership',
    am: 'ሙሉ አባልነት'
  },
  'membership.full.description': {
    en: 'Unlock all premium features, personalized coaching, and exclusive content.',
    am: 'ሁሉንም ተከፋይ ባህሪያት፣ የግል አሰልጣኝ እና ልዩ ይዘቶችን ይክፈቱ。'
  },

  // Buttons & Actions
  'button.start': {
    en: 'Start',
    am: 'ጀምር'
  },
  'button.continue': {
    en: 'Continue',
    am: 'ይቀጥሉ'
  },
  'button.complete': {
    en: 'Complete',
    am: 'ጨርስ'
  },
  'button.save': {
    en: 'Save',
    am: 'አስቀምጥ'
  },
  'button.cancel': {
    en: 'Cancel',
    am: 'ሰርዝ'
  },
  'button.submit': {
    en: 'Submit',
    am: 'አስገባ'
  },
  'button.next': {
    en: 'Next',
    am: 'ቀጣይ'
  },
  'button.previous': {
    en: 'Previous',
    am: 'ቀደም ያለ'
  },
  'button.finish': {
    en: 'Finish',
    am: 'ጨርስ'
  },

  // Form Labels
  'form.email': {
    en: 'Email',
    am: 'ኢሜይል'
  },
  'form.name': {
    en: 'Name',
    am: 'ስም'
  },
  'form.firstName': {
    en: 'First Name',
    am: 'የመጀመሪያ ስም'
  },
  'form.lastName': {
    en: 'Last Name',
    am: 'የአባት ስም'
  },
  'form.password': {
    en: 'Password',
    am: 'የይለፍ ቃል'
  },
  'form.confirmPassword': {
    en: 'Confirm Password',
    am: 'የይለፍ ቃል አረጋግጥ'
  },
  'form.phone': {
    en: 'Phone Number',
    am: 'ስልክ ቁጥር'
  },
  'form.interests': {
    en: 'Interests',
    am: 'ፍላጎቶች'
  },

  // Messages
  'message.welcome': {
    en: 'Welcome to Galaxy Kiro!',
    am: 'ወደ ጋላክሲ ኪሮ እንኳን በደህና መጡ!'
  },
  'message.success': {
    en: 'Success!',
    am: 'ተሳክቷል!'
  },
  'message.error': {
    en: 'Error occurred',
    am: 'ስህተት ተከሰተ'
  },
  'message.loading': {
    en: 'Loading...',
    am: 'በመጫን ላይ...'
  },
  'message.noData': {
    en: 'No data available',
    am: 'ምንም መረጃ የለም'
  },

  // Assessment Questions (samples)
  'question.agree.strongly': {
    en: 'Strongly Agree',
    am: 'በጣም እስማማለሁ'
  },
  'question.agree': {
    en: 'Agree',
    am: 'እስማማለሁ'
  },
  'question.neutral': {
    en: 'Neutral',
    am: 'ገለልተኛ'
  },
  'question.disagree': {
    en: 'Disagree',
    am: 'አልስማማም'
  },
  'question.disagree.strongly': {
    en: 'Strongly Disagree',
    am: 'በጣም አልስማማም'
  },

  // Time & Dates
  'time.minutes': {
    en: 'minutes',
    am: 'ደቂቃዎች'
  },
  'time.hours': {
    en: 'hours',
    am: 'ሰአታት'
  },
  'time.days': {
    en: 'days',
    am: 'ቀናት'
  },
  'time.weeks': {
    en: 'weeks',
    am: 'ሳምንታት'
  },
  'time.months': {
    en: 'months',
    am: 'ወራት'
  },

  // Admin Interface
  'admin.dashboard': {
    en: 'Dashboard',
    am: 'ዳሽቦርድ'
  },
  'admin.analytics': {
    en: 'Analytics',
    am: 'ትንታኔ'
  },
  'admin.users': {
    en: 'Users',
    am: 'ተጠቃሚዎች'
  },
  'admin.content': {
    en: 'Content',
    am: 'ይዘት'
  },
  'admin.tools': {
    en: 'Tools',
    am: 'መሳሪያዎች'
  },
  'admin.settings': {
    en: 'Settings',
    am: 'ቅንብሮች'
  },

  // Results & Insights
  'results.title': {
    en: 'Your Results',
    am: 'የእርስዎ ውጤቶች'
  },
  'results.insights': {
    en: 'Key Insights',
    am: 'ቁልፍ ግንዛቤዎች'
  },
  'results.recommendations': {
    en: 'Recommendations',
    am: 'ምክሮች'
  },
  'results.nextSteps': {
    en: 'Next Steps',
    am: 'ቀጣዮች እርምጃዎች'
  },

  // Network & Community
  'network.connections': {
    en: 'Connections',
    am: 'ተያያዦች'
  },
  'network.messages': {
    en: 'Messages',
    am: 'መልዕክቶች'
  },
  'network.discover': {
    en: 'Discover',
    am: 'ያግኙ'
  },
  'network.activity': {
    en: 'Activity',
    am: 'እንቅስቃሴ'
  }
}

// Context-specific translations for assessments
export const assessmentTranslations: Record<string, Record<string, TranslationKey>> = {
  'potential-quotient': {
    'question.1': {
      en: 'I often think about ways to improve myself and my situation.',
      am: 'ራሴን እና ሁኔታዬን ስለማሻሻል መንገዶች ብዙ ጊዜ እናስባለሁ።'
    },
    'question.2': {
      en: 'I believe I have untapped abilities that I haven\'t fully explored.',
      am: 'በሙሉ ያላየኋቸው ያልተጠቀሙባቸው አቅሞች እንዳሉኝ አምናለሁ።'
    },
    'insight.growth': {
      en: 'You show strong growth mindset characteristics.',
      am: 'ጠንካራ የእድገት አስተሳሰብ ባህሪያትን ያሳያሉ።'
    }
  },
  'decision-style': {
    'question.1': {
      en: 'I prefer to make quick decisions based on my intuition.',
      am: 'በግንዛቤዬ ላይ በመመስረት ፈጣን ውሳኔዎችን ማድረግ እወዳለሁ።'
    },
    'question.2': {
      en: 'I like to gather all available information before making a decision.',
      am: 'ውሳኔ ከማድረጌ በፊት ሁሉንም የቻሉ መረጃዎች መሰብሰብ እወዳለሁ።'
    }
  }
}

class I18nManager {
  private currentLanguage: Language = 'en'
  private fallbackLanguage: Language = 'en'
  
  constructor() {
    // Initialize with browser/stored language preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('galaxy_kiro_language') as Language
      if (stored && locales[stored]) {
        this.currentLanguage = stored
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase()
        if (browserLang.startsWith('am') || browserLang.includes('et')) {
          this.currentLanguage = 'am'
        }
      }
    }
  }

  // Get current language
  getCurrentLanguage(): Language {
    return this.currentLanguage
  }

  // Get current locale config
  getCurrentLocale(): LocaleConfig {
    return locales[this.currentLanguage]
  }

  // Set language
  setLanguage(language: Language): void {
    if (locales[language]) {
      this.currentLanguage = language
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('galaxy_kiro_language', language)
        
        // Update document language and direction
        document.documentElement.lang = language
        document.documentElement.dir = locales[language].direction
        
        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languagechange', {
          detail: { language, locale: locales[language] }
        }))
      }
    }
  }

  // Get translation
  t(key: string, params?: Record<string, string>): string {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation key "${key}" not found`)
      return key
    }

    let text = translation[this.currentLanguage] || translation[this.fallbackLanguage] || key
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), value)
      })
    }

    return text
  }

  // Get assessment-specific translation
  tAssessment(assessmentId: string, key: string): string {
    const assessmentDict = assessmentTranslations[assessmentId]
    if (!assessmentDict || !assessmentDict[key]) {
      return this.t(key)
    }

    const translation = assessmentDict[key]
    return translation[this.currentLanguage] || translation[this.fallbackLanguage] || key
  }

  // Format date according to locale
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.getCurrentLocale()
    const formatOptions = {
      ...options,
      calendar: locale.dateFormat.calendar,
      numberingSystem: locale.dateFormat.numberingSystem
    }

    try {
      return new Intl.DateTimeFormat(locale.dateFormat.locale, formatOptions).format(date)
    } catch (error) {
      // Fallback to English formatting
      return new Intl.DateTimeFormat('en-US', options).format(date)
    }
  }

  // Format number according to locale
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.getCurrentLocale()
    const formatOptions = {
      ...locale.numberFormat,
      ...options
    }

    try {
      return new Intl.NumberFormat(locale.dateFormat.locale, formatOptions).format(number)
    } catch (error) {
      // Fallback to English formatting
      return new Intl.NumberFormat('en-US', options).format(number)
    }
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    // Ethiopian Birr for Amharic, USD for English
    const currencyCode = this.currentLanguage === 'am' ? 'ETB' : currency
    
    return this.formatNumber(amount, {
      style: 'currency',
      currency: currencyCode
    })
  }

  // Get available languages
  getAvailableLanguages(): LocaleConfig[] {
    return Object.values(locales)
  }

  // Check if language is RTL
  isRTL(): boolean {
    return this.getCurrentLocale().direction === 'rtl'
  }

  // Get localized content ID
  getLocalizedContentId(baseId: string): string {
    return `${baseId}_${this.currentLanguage}`
  }

  // Get direction class for CSS
  getDirectionClass(): string {
    return this.isRTL() ? 'rtl' : 'ltr'
  }

  // Pluralization helper
  plural(count: number, singular: string, plural?: string): string {
    const singularText = this.t(singular)
    const pluralText = plural ? this.t(plural) : singularText + 's' // Simple English pluralization
    
    return count === 1 ? singularText : pluralText
  }
}

// Export singleton instance (only on client)
export const i18n = typeof window !== 'undefined' ? new I18nManager() : null as any

// Export utility functions
export const t = (key: string, params?: Record<string, string>) => i18n?.t(key, params) || key
export const tAssessment = (assessmentId: string, key: string) => i18n?.tAssessment(assessmentId, key) || key
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => i18n?.formatDate(date, options) || date.toLocaleDateString()
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => i18n?.formatNumber(number, options) || number.toString()
export const formatCurrency = (amount: number, currency?: string) => i18n?.formatCurrency(amount, currency) || `$${amount}`

// Default export
export default i18n