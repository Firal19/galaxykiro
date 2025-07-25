/**
 * Navigation System Exports
 * 
 * Centralized exports for the unified navigation system
 */

// Core types and context
export * from './core/NavigationTypes'
export * from './core/NavigationContext'

// Components
export { NavigationItem } from './components/NavigationItem'
export { NavigationGroup } from './components/NavigationGroup'

// Layouts
export { UnifiedHeader } from './layouts/UnifiedHeader'
export { UnifiedSidebar } from './layouts/UnifiedSidebar'

// Services
export { navigationService } from '@/services/navigation/NavigationService'

// Convenience re-exports for backward compatibility
export { UnifiedHeader as MainNav } from './layouts/UnifiedHeader'