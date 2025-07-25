/**
 * NavigationContext - Unified navigation state management
 */

"use client"

import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  NavigationState, 
  NavigationActions, 
  NavigationConfig,
  NavigationGroup,
  NavigationUser,
  NavigationItem,
  UnifiedNavigationContext,
  UserRole,
  LayoutVariant
} from './NavigationTypes'
import { navigationService } from '@/services/navigation/NavigationService'
import { useAuthService } from '@/components/providers/ServiceProvider'

// Navigation state actions
type NavigationAction =
  | { type: 'TOGGLE_OPEN' }
  | { type: 'SET_ACTIVE_ITEM'; payload: string | null }
  | { type: 'TOGGLE_GROUP'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_COLLAPSE' }
  | { type: 'SET_OPEN_GROUPS'; payload: string[] }
  | { type: 'RESET_STATE' }

// Initial state
const initialState: NavigationState = {
  isOpen: false,
  activeItem: null,
  openGroups: [],
  searchQuery: '',
  isCollapsed: false
}

// Navigation reducer
function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen }
    
    case 'SET_ACTIVE_ITEM':
      return { ...state, activeItem: action.payload }
    
    case 'TOGGLE_GROUP':
      const groupId = action.payload
      const isOpen = state.openGroups.includes(groupId)
      return {
        ...state,
        openGroups: isOpen
          ? state.openGroups.filter(id => id !== groupId)
          : [...state.openGroups, groupId]
      }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    
    case 'TOGGLE_COLLAPSE':
      return { ...state, isCollapsed: !state.isCollapsed }
    
    case 'SET_OPEN_GROUPS':
      return { ...state, openGroups: action.payload }
    
    case 'RESET_STATE':
      return initialState
    
    default:
      return state
  }
}

// Context creation
const NavigationContext = createContext<UnifiedNavigationContext | null>(null)

// Provider props
interface NavigationProviderProps {
  children: ReactNode
  variant: LayoutVariant
  context: 'header' | 'sidebar' | 'mobile'
  user?: NavigationUser
}

// Navigation Provider
export function NavigationProvider({ 
  children, 
  variant, 
  context,
  user 
}: NavigationProviderProps) {
  const [state, dispatch] = useReducer(navigationReducer, initialState)
  const pathname = usePathname()
  const router = useRouter()
  const authService = useAuthService()

  // Get navigation configuration
  const config = navigationService.getNavigationConfig(variant, context)
  
  // Get user role
  const getUserRole = useCallback((): UserRole => {
    if (user?.role) return user.role as UserRole
    const session = authService.getCurrentSession()
    if (session?.role === 'admin') return 'admin'
    if (session?.role === 'soft_member') return 'member'
    return 'public'
  }, [user, authService])

  // Get navigation groups based on user role
  const getNavigationGroups = useCallback((): NavigationGroup[] => {
    const userRole = getUserRole()
    const groups = navigationService.getNavigationGroups(variant, userRole)
    return navigationService.filterByPermissions(groups, userRole)
  }, [variant, getUserRole])

  // Navigation actions
  const actions: NavigationActions = {
    toggleOpen: useCallback(() => {
      dispatch({ type: 'TOGGLE_OPEN' })
    }, []),

    setActiveItem: useCallback((itemId: string | null) => {
      dispatch({ type: 'SET_ACTIVE_ITEM', payload: itemId })
    }, []),

    toggleGroup: useCallback((groupId: string) => {
      dispatch({ type: 'TOGGLE_GROUP', payload: groupId })
    }, []),

    setSearchQuery: useCallback((query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
    }, []),

    toggleCollapse: useCallback(() => {
      dispatch({ type: 'TOGGLE_COLLAPSE' })
      // Persist collapse state
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `navigation-collapsed-${variant}`, 
          (!state.isCollapsed).toString()
        )
      }
    }, [state.isCollapsed, variant]),

    navigate: useCallback((href: string) => {
      // Close mobile menu on navigation
      if (state.isOpen && context === 'mobile') {
        dispatch({ type: 'TOGGLE_OPEN' })
      }
      
      // Handle external links
      if (href.startsWith('http') || href.startsWith('mailto:')) {
        window.open(href, '_blank', 'noopener,noreferrer')
        return
      }
      
      // Navigate using Next.js router
      router.push(href)
    }, [state.isOpen, context, router])
  }

  // Set active item based on current pathname
  useEffect(() => {
    const groups = getNavigationGroups()
    let activeItemId: string | null = null
    
    // Find the active item based on current path
    for (const group of groups) {
      for (const item of group.items) {
        if (pathname === item.href || pathname.startsWith(item.href + '/')) {
          activeItemId = item.id
          break
        }
        
        // Check children
        if (item.children) {
          const activeChild = item.children.find(child => 
            pathname === child.href || pathname.startsWith(child.href + '/')
          )
          if (activeChild) {
            activeItemId = activeChild.id
            // Also ensure parent group is open
            if (!state.openGroups.includes(group.id)) {
              dispatch({ type: 'TOGGLE_GROUP', payload: group.id })
            }
            break
          }
        }
      }
      if (activeItemId) break
    }
    
    if (activeItemId !== state.activeItem) {
      actions.setActiveItem(activeItemId)
    }
  }, [pathname, getNavigationGroups, state.activeItem, state.openGroups, actions])

  // Load persisted collapse state
  useEffect(() => {
    if (typeof window !== 'undefined' && context === 'sidebar') {
      const collapsed = localStorage.getItem(`navigation-collapsed-${variant}`)
      if (collapsed === 'true' && !state.isCollapsed) {
        dispatch({ type: 'TOGGLE_COLLAPSE' })
      }
    }
  }, [variant, context, state.isCollapsed])

  // Close mobile menu on route change
  useEffect(() => {
    if (state.isOpen && context === 'mobile') {
      dispatch({ type: 'TOGGLE_OPEN' })
    }
  }, [pathname, state.isOpen, context])

  // Analytics tracking
  const trackNavigation = useCallback((item: NavigationItem) => {
    // TODO: Implement analytics tracking through service
    console.log('Navigation tracked:', item.id, item.href)
  }, [])

  // Context value
  const contextValue: UnifiedNavigationContext = {
    state,
    actions,
    config,
    user,
    analytics: {
      trackClick: trackNavigation,
      trackSearch: (query, results) => {
        console.log('Search tracked:', query, results)
      },
      trackUserAction: (action, context) => {
        console.log('User action tracked:', action, context)
      }
    }
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

// Hook to use navigation context
export function useNavigation(): UnifiedNavigationContext {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

// Convenience hooks
export function useNavigationState() {
  const { state } = useNavigation()
  return state
}

export function useNavigationActions() {
  const { actions } = useNavigation()
  return actions
}

export function useNavigationConfig() {
  const { config } = useNavigation()
  return config
}

export function useNavigationGroups(): NavigationGroup[] {
  const { config } = useNavigation()
  const authService = useAuthService()
  
  return useCallback(() => {
    const session = authService.getCurrentSession()
    const userRole: UserRole = session?.role === 'admin' ? 'admin' : 
                               session?.role === 'soft_member' ? 'member' : 'public'
    
    const groups = navigationService.getNavigationGroups(config.variant, userRole)
    return navigationService.filterByPermissions(groups, userRole)
  }, [config.variant, authService])()
}