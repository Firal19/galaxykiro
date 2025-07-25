/**
 * NavigationService - Centralized navigation data and configuration management
 */

import { 
  NavigationGroup, 
  NavigationItem, 
  UserRole, 
  NavigationConfig,
  LayoutVariant,
  NavigationContext
} from '@/components/navigation/core/NavigationTypes'
import { 
  Home, 
  Zap, 
  BookOpen, 
  Users, 
  Award,
  BarChart3,
  UserCheck,
  MessageSquare,
  Settings,
  Network,
  FileText,
  Calendar,
  Shield,
  Database,
  Target,
  Brain,
  CheckCircle,
  TrendingUp,
  Globe,
  Search
} from 'lucide-react'

export class NavigationService {
  private static instance: NavigationService

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService()
    }
    return NavigationService.instance
  }

  /**
   * Get navigation groups for specific layout variant
   */
  public getNavigationGroups(variant: LayoutVariant, userRole: UserRole): NavigationGroup[] {
    switch (variant) {
      case 'public':
        return this.getPublicNavigation()
      case 'member':
        return this.getMemberNavigation()
      case 'admin':
        return this.getAdminNavigation()
      default:
        return this.getPublicNavigation()
    }
  }

  /**
   * Get navigation configuration for context
   */
  public getNavigationConfig(
    variant: LayoutVariant, 
    context: NavigationContext
  ): NavigationConfig {
    const baseConfig: NavigationConfig = {
      variant,
      context,
      showLogo: true,
      mobileBreakpoint: 'lg',
      maxWidth: '7xl'
    }

    switch (variant) {
      case 'public':
        return {
          ...baseConfig,
          showSearch: false,
          showNotifications: false,
          showUserMenu: false,
          showLanguageSwitcher: true,
          showThemeToggle: true,
          collapsible: context === 'mobile'
        }
      
      case 'member':
        return {
          ...baseConfig,
          showSearch: true,
          showNotifications: true,
          showUserMenu: true,
          showLanguageSwitcher: true,
          showThemeToggle: true,
          collapsible: context === 'sidebar'
        }
      
      case 'admin':
        return {
          ...baseConfig,
          showSearch: true,
          showNotifications: true,
          showUserMenu: true,
          showLanguageSwitcher: false,
          showThemeToggle: true,
          collapsible: context === 'sidebar'
        }
      
      default:
        return baseConfig
    }
  }

  /**
   * Public navigation structure
   */
  private getPublicNavigation(): NavigationGroup[] {
    return [
      {
        id: 'main',
        items: [
          {
            id: 'home',
            label: 'nav.home',
            href: '/',
            icon: Home
          },
          {
            id: 'tools',
            label: 'nav.tools',
            href: '/tools',
            icon: Zap,
            children: [
              {
                id: 'all-tools',
                label: 'All Tools',
                href: '/tools',
                description: 'Browse our complete assessment toolkit'
              },
              {
                id: 'potential-quotient',
                label: 'Potential Quotient',
                href: '/tools/potential-quotient-calculator',
                description: 'Discover your untapped potential'
              },
              {
                id: 'decision-style',
                label: 'Decision Style',
                href: '/decision-door',
                description: 'Understand your decision-making patterns'
              },
              {
                id: 'leadership-style',
                label: 'Leadership Style',
                href: '/leadership-lever',
                description: 'Identify your leadership approach'
              },
              {
                id: 'success-gap',
                label: 'Success Gap',
                href: '/success-gap',
                description: 'Bridge the gap to your goals'
              },
              {
                id: 'vision-void',
                label: 'Vision Void',
                href: '/vision-void',
                description: 'Clarify your vision and purpose'
              },
              {
                id: 'change-paradox',
                label: 'Change Paradox',
                href: '/change-paradox',
                description: 'Navigate transformation challenges'
              }
            ]
          },
          {
            id: 'content',
            label: 'nav.content',
            href: '/content-library',
            icon: BookOpen,
            children: [
              {
                id: 'content-library',
                label: 'Content Library',
                href: '/content-library',
                description: 'Explore transformational content'
              },
              {
                id: 'webinars',
                label: 'Webinars',
                href: '/webinars',
                description: 'Join live transformation sessions'
              },
              {
                id: 'success-stories',
                label: 'Success Stories',
                href: '#success-stories',
                description: 'Real transformation journeys'
              }
            ]
          },
          {
            id: 'community',
            label: 'nav.community',
            href: '/member',
            icon: Users,
            children: [
              {
                id: 'member-dashboard',
                label: 'Member Dashboard',
                href: '/member',
                description: 'Your transformation hub'
              },
              {
                id: 'register',
                label: 'Register',
                href: '/membership/register',
                description: 'Join our community'
              },
              {
                id: 'network-hub',
                label: 'Network Hub',
                href: '/member#community',
                description: 'Connect with champions'
              }
            ]
          },
          {
            id: 'about',
            label: 'nav.about',
            href: '/about',
            icon: Award
          }
        ]
      }
    ]
  }

  /**
   * Member navigation structure
   */
  private getMemberNavigation(): NavigationGroup[] {
    return [
      {
        id: 'main',
        label: 'Dashboard',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/soft-member/dashboard',
            icon: Home
          },
          {
            id: 'assessments',
            label: 'Assessments',
            href: '/soft-member/assessments',
            icon: Target,
            badge: 'new'
          },
          {
            id: 'progress',
            label: 'My Progress',
            href: '/soft-member/progress',
            icon: TrendingUp
          }
        ]
      },
      {
        id: 'content',
        label: 'Resources',
        items: [
          {
            id: 'content-library',
            label: 'Content Library',
            href: '/soft-member/content',
            icon: BookOpen
          },
          {
            id: 'webinars',
            label: 'Webinars',
            href: '/soft-member/webinars',
            icon: Calendar
          },
          {
            id: 'tools',
            label: 'Tools',
            href: '/soft-member/tools',
            icon: Zap
          }
        ]
      },
      {
        id: 'community',
        label: 'Community',
        items: [
          {
            id: 'network',
            label: 'Network',
            href: '/soft-member/network',
            icon: Network
          },
          {
            id: 'messages',
            label: 'Messages',
            href: '/soft-member/messages',
            icon: MessageSquare,
            badge: 3
          }
        ]
      },
      {
        id: 'account',
        label: 'Account',
        items: [
          {
            id: 'profile',
            label: 'Profile',
            href: '/soft-member/profile',
            icon: UserCheck
          },
          {
            id: 'settings',
            label: 'Settings',
            href: '/soft-member/settings',
            icon: Settings
          }
        ]
      }
    ]
  }

  /**
   * Admin navigation structure
   */
  private getAdminNavigation(): NavigationGroup[] {
    return [
      {
        id: 'overview',
        label: 'Overview',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: Home
          },
          {
            id: 'analytics',
            label: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3
          }
        ]
      },
      {
        id: 'users',
        label: 'User Management',
        items: [
          {
            id: 'leads',
            label: 'Leads',
            href: '/admin/leads',
            icon: UserCheck,
            badge: 'hot'
          },
          {
            id: 'members',
            label: 'Members',
            href: '/admin/members',
            icon: Users
          },
          {
            id: 'network',
            label: 'Network',
            href: '/admin/network',
            icon: Network
          }
        ]
      },
      {
        id: 'content',
        label: 'Content & Tools',
        items: [
          {
            id: 'content',
            label: 'Content Management',
            href: '/admin/content',
            icon: FileText
          },
          {
            id: 'tools',
            label: 'Assessment Tools',
            href: '/admin/tools',
            icon: Brain
          },
          {
            id: 'webinars',
            label: 'Webinars',
            href: '/admin/webinars',
            icon: Calendar
          }
        ]
      },
      {
        id: 'system',
        label: 'System',
        items: [
          {
            id: 'settings',
            label: 'Settings',
            href: '/admin/settings',
            icon: Settings
          },
          {
            id: 'security',
            label: 'Security',
            href: '/admin/security',
            icon: Shield
          },
          {
            id: 'database',
            label: 'Database',
            href: '/admin/database',
            icon: Database
          }
        ]
      }
    ]
  }

  /**
   * Filter navigation items by user permissions
   */
  public filterByPermissions(
    groups: NavigationGroup[], 
    userRole: UserRole
  ): NavigationGroup[] {
    return groups
      .filter(group => this.hasGroupPermission(group, userRole))
      .map(group => ({
        ...group,
        items: group.items
          .filter(item => this.hasItemPermission(item, userRole))
          .map(item => ({
            ...item,
            children: item.children?.filter(child => 
              this.hasItemPermission(child, userRole)
            )
          }))
      }))
  }

  /**
   * Find navigation item by ID
   */
  public findItemById(groups: NavigationGroup[], id: string): NavigationItem | null {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.id === id) return item
        if (item.children) {
          const found = item.children.find(child => child.id === id)
          if (found) return found
        }
      }
    }
    return null
  }

  /**
   * Get breadcrumb trail for current path
   */
  public getBreadcrumbs(groups: NavigationGroup[], currentPath: string): NavigationItem[] {
    const breadcrumbs: NavigationItem[] = []
    
    for (const group of groups) {
      for (const item of group.items) {
        if (currentPath.startsWith(item.href)) {
          breadcrumbs.push(item)
          
          if (item.children) {
            const childMatch = item.children.find(child => 
              currentPath === child.href
            )
            if (childMatch) {
              breadcrumbs.push(childMatch)
            }
          }
          break
        }
      }
    }
    
    return breadcrumbs
  }

  /**
   * Search navigation items
   */
  public searchItems(groups: NavigationGroup[], query: string): NavigationItem[] {
    const results: NavigationItem[] = []
    const searchTerm = query.toLowerCase()
    
    for (const group of groups) {
      for (const item of group.items) {
        if (this.matchesSearch(item, searchTerm)) {
          results.push(item)
        }
        
        if (item.children) {
          const childMatches = item.children.filter(child => 
            this.matchesSearch(child, searchTerm)
          )
          results.push(...childMatches)
        }
      }
    }
    
    return results.slice(0, 10) // Limit results
  }

  /**
   * Check if group has permission
   */
  private hasGroupPermission(group: NavigationGroup, userRole: UserRole): boolean {
    if (!group.permissions) return true
    return group.permissions.includes(userRole)
  }

  /**
   * Check if item has permission
   */
  private hasItemPermission(item: NavigationItem, userRole: UserRole): boolean {
    if (!item.permissions) return true
    return item.permissions.includes(userRole)
  }

  /**
   * Check if item matches search
   */
  private matchesSearch(item: NavigationItem, searchTerm: string): boolean {
    return (
      item.label.toLowerCase().includes(searchTerm) ||
      (item.description?.toLowerCase().includes(searchTerm) ?? false)
    )
  }
}

// Export singleton instance
export const navigationService = NavigationService.getInstance()