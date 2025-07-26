/**
 * Navigation Types - Unified type definitions for all navigation components
 */

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

// User roles and contexts
export type UserRole = 'public' | 'member' | 'admin'
export type NavigationContext = 'header' | 'sidebar' | 'mobile' | 'breadcrumb'
export type LayoutVariant = 'public' | 'member' | 'admin'

// Base navigation item structure
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  description?: string
  isActive?: boolean
  isExternal?: boolean
  children?: NavigationItem[]
  permissions?: UserRole[]
  metadata?: Record<string, any>
}

// Navigation group for organizing items
export interface NavigationGroup {
  id: string
  label?: string
  items: NavigationItem[]
  collapsible?: boolean
  defaultOpen?: boolean
  permissions?: UserRole[]
}

// User context for navigation personalization
export interface NavigationUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  status?: string
  notifications?: number
  isOnline?: boolean
  badge?: string // Member-specific badge or title
}

// Navigation configuration
export interface NavigationConfig {
  variant: LayoutVariant
  context: NavigationContext
  showLogo?: boolean
  showSearch?: boolean
  showNotifications?: boolean
  showUserMenu?: boolean
  showLanguageSwitcher?: boolean
  showThemeToggle?: boolean
  collapsible?: boolean
  mobileBreakpoint?: 'sm' | 'md' | 'lg'
  maxWidth?: string
  className?: string
}

// Navigation state
export interface NavigationState {
  isOpen: boolean
  activeItem: string | null
  openGroups: string[]
  searchQuery: string
  isCollapsed: boolean
}

// Navigation actions
export interface NavigationActions {
  toggleOpen: () => void
  setActiveItem: (itemId: string | null) => void
  toggleGroup: (groupId: string) => void
  setSearchQuery: (query: string) => void
  toggleCollapse: () => void
  navigate: (href: string) => void
}

// Component props
export interface NavigationProps {
  config: NavigationConfig
  groups: NavigationGroup[]
  user?: NavigationUser
  onNavigate?: (item: NavigationItem) => void
  onUserMenuClick?: () => void
  onNotificationClick?: () => void
  className?: string
  children?: ReactNode
}

// Responsive navigation props
export interface ResponsiveNavigationProps extends NavigationProps {
  mobileComponent?: ReactNode
  desktopComponent?: ReactNode
  tabletComponent?: ReactNode
}

// Search configuration
export interface NavigationSearchConfig {
  enabled: boolean
  placeholder?: string
  categories?: string[]
  maxResults?: number
  onSearch?: (query: string) => Promise<NavigationItem[]>
}

// Notification configuration
export interface NavigationNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  read: boolean
  href?: string
}

// Language configuration
export interface NavigationLanguage {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
}

// Theme configuration
export interface NavigationTheme {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
}

// Analytics tracking
export interface NavigationAnalytics {
  trackClick: (item: NavigationItem) => void
  trackSearch: (query: string, results: number) => void
  trackUserAction: (action: string, context?: any) => void
}

// Accessibility configuration
export interface NavigationA11y {
  skipLinkText?: string
  ariaLabel?: string
  landmarkRole?: string
  keyboardShortcuts?: Record<string, () => void>
}

// Performance optimization
export interface NavigationPerformance {
  lazyLoad?: boolean
  preloadRoutes?: string[]
  cacheItems?: boolean
  virtualScrolling?: boolean
}

// Export unified navigation context type
export interface UnifiedNavigationContext {
  state: NavigationState
  actions: NavigationActions
  config: NavigationConfig
  user?: NavigationUser
  analytics?: NavigationAnalytics
}