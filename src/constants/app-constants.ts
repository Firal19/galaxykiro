/**
 * Application Constants
 * 
 * Centralized constants for URLs, configuration values, and other hardcoded data
 */

// Application URLs and Endpoints
export const APP_URLS = {
  SUPABASE_FALLBACK: 'https://placeholder.supabase.co',
  LOCALHOST: 'http://localhost:3000',
  CONTACT_EMAIL: 'mailto:info@galaxydreamteam.com',
  WEBSITE: 'https://galaxydreamteam.com',
  SUPPORT: 'https://support.galaxydreamteam.com'
} as const

// Assessment and Tool Configuration
export const ASSESSMENT_CONFIG = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds  
  MAX_QUESTIONS: 100,
  MIN_COMPLETION_RATE: 0.8,
  PROGRESS_SAVE_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT: 1800000, // 30 minutes
  MAX_RETRIES: 3
} as const

// Engagement and Scoring Thresholds
export const ENGAGEMENT_THRESHOLDS = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 90
} as const

export const LEAD_SCORE_THRESHOLDS = {
  BROWSER: { min: 0, max: 30 },
  ENGAGED: { min: 31, max: 70 },
  SOFT_MEMBER: { min: 71, max: 100 }
} as const

// Time Constants (in milliseconds)
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
} as const

// Time Constants (in seconds for easier use)
export const TIME_SECONDS = {
  MINUTE: 60,
  FIVE_MINUTES: 5 * 60,
  TEN_MINUTES: 10 * 60,
  THIRTY_MINUTES: 30 * 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60
} as const

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 200, // milliseconds
  TOAST_DURATION: 5000, // milliseconds
  MODAL_Z_INDEX: 1050,
  DROPDOWN_Z_INDEX: 1000,
  OVERLAY_Z_INDEX: 999,
  MAX_CONTENT_WIDTH: '1200px',
  SIDEBAR_WIDTH: '256px',
  MOBILE_BREAKPOINT: 768 // pixels
} as const

// A/B Testing Configuration
export const AB_TEST_CONFIG = {
  DEFAULT_TRAFFIC_SPLIT: 0.5,
  MIN_SAMPLE_SIZE: 100,
  DEFAULT_CONFIDENCE_LEVEL: 0.95,
  TEST_DURATION_DAYS: 14,
  STATISTICAL_SIGNIFICANCE_THRESHOLD: 0.05
} as const

// Analytics and Tracking
export const ANALYTICS_CONFIG = {
  PAGE_VIEW_TIMEOUT: 15000, // 15 seconds
  INTERACTION_DEBOUNCE: 300, // milliseconds
  SCROLL_DEPTH_INTERVALS: [25, 50, 75, 90, 100], // percentages
  SESSION_TIMEOUT: 1800000, // 30 minutes
  BATCH_SIZE: 50,
  FLUSH_INTERVAL: 10000 // 10 seconds
} as const

// Performance Monitoring
export const PERFORMANCE_CONFIG = {
  SLOW_QUERY_THRESHOLD: 1000, // 1 second
  SLOW_COMPONENT_RENDER: 16, // 16ms (60fps)
  MEMORY_WARNING_THRESHOLD: 100 * 1024 * 1024, // 100MB
  BUNDLE_SIZE_WARNING: 250 * 1024, // 250KB
  IMAGE_OPTIMIZATION_QUALITY: 0.8,
  LAZY_LOADING_THRESHOLD: 100 // pixels
} as const

// Security Configuration
export const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * TIME_CONSTANTS.MINUTE,
  PASSWORD_MIN_LENGTH: 8,
  SESSION_COOKIE_MAX_AGE: 24 * TIME_CONSTANTS.HOUR,
  CSRF_TOKEN_LENGTH: 32,
  RATE_LIMIT_WINDOW: TIME_CONSTANTS.MINUTE,
  RATE_LIMIT_MAX_REQUESTS: 100
} as const

// Email Configuration
export const EMAIL_CONFIG = {
  MAX_RECIPIENTS: 100,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  TEMPLATE_CACHE_TTL: TIME_CONSTANTS.HOUR,
  BOUNCE_THRESHOLD: 0.05, // 5%
  UNSUBSCRIBE_GRACE_PERIOD: 7 * TIME_CONSTANTS.DAY
} as const

// Internationalization
export const I18N_CONFIG = {
  DEFAULT_LOCALE: 'en',
  SUPPORTED_LOCALES: ['en', 'am'] as const,
  DATE_FORMAT: {
    en: 'MM/dd/yyyy',
    am: 'dd/MM/yyyy'
  },
  CURRENCY_FORMAT: {
    en: 'USD',
    am: 'ETB'
  }
} as const

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'] as const,
  UPLOAD_TIMEOUT: 30000, // 30 seconds
  CHUNK_SIZE: 1024 * 1024, // 1MB
  MAX_CONCURRENT_UPLOADS: 3
} as const

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: TIME_CONSTANTS.HOUR,
  USER_DATA_TTL: 15 * TIME_CONSTANTS.MINUTE,
  API_RESPONSE_TTL: 5 * TIME_CONSTANTS.MINUTE,
  STATIC_CONTENT_TTL: TIME_CONSTANTS.DAY,
  MAX_CACHE_SIZE: 100, // number of entries
  CLEANUP_INTERVAL: TIME_CONSTANTS.HOUR
} as const

// Error Configuration
export const ERROR_CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAYS: [1000, 2000, 4000], // exponential backoff in ms
  ERROR_REPORTING_THRESHOLD: 'high' as const,
  MAX_ERROR_QUEUE_SIZE: 100,
  ERROR_DISPLAY_DURATION: 5000 // milliseconds
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_AB_TESTING: true,
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_REPORTING: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PWA: false,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_REAL_TIME_UPDATES: true
} as const

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  PAGINATION_LIMIT: 20,
  MAX_PAGINATION_LIMIT: 100
} as const

// Colors and Themes
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#3B82F6', // blue-500
    SECONDARY: '#10B981', // green-500
    ACCENT: '#F59E0B', // yellow-500
    DANGER: '#EF4444', // red-500
    WARNING: '#F59E0B', // yellow-500
    INFO: '#3B82F6', // blue-500
    SUCCESS: '#10B981' // green-500
  },
  BREAKPOINTS: {
    MOBILE: '640px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE: '1280px',
    XLARGE: '1536px'
  }
} as const

// Export utility type for getting constant values
export type AppConstants = typeof APP_URLS | typeof ASSESSMENT_CONFIG | typeof ENGAGEMENT_THRESHOLDS