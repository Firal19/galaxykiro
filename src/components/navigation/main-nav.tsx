"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
// import { useI18n } from '@/lib/hooks/use-i18n' // Temporarily disabled to fix translation keys
// import { LanguageSwitcher } from '@/components/ui/language-switcher' // Removed to reduce bundle size
import { Button } from '@/components/ui/button'
// Optimized icon imports - only import what we use
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  LogIn,
  UserPlus,
  ChevronDown,
  Zap,
  Target,
  Brain,
  Award,
  BarChart3,
  Settings,
  User,
  LogOut,
  TrendingUp,
  FileText,
  Video,
  Search,
  Command
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<any>
  children?: NavigationItem[]
  description?: string
  badge?: string
  count?: number
}

interface UserData {
  name: string
  email: string
  role: 'admin' | 'member' | 'visitor'
  status?: string
  avatar?: string
}

type NavigationSection = 'landing' | 'admin' | 'member'

export function MainNav() {
  console.log('🚀 MainNav component is rendering!')
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState<NavigationSection>('landing')
  const [user, setUser] = useState<UserData | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  // const { t } = useI18n() // Temporarily disabled to fix translation keys
  const navRef = useRef<HTMLElement>(null)

  // Detect current section and user
  useEffect(() => {
    let section: NavigationSection = 'landing'
    
    if (pathname.startsWith('/admin')) {
      section = 'admin'
    } else if (pathname.startsWith('/soft-member') || pathname.startsWith('/member')) {
      section = 'member'
    }
    
    setCurrentSection(section)

    // Mock user data - in real app, get from auth context
    if (section === 'admin') {
      setUser({
        name: 'Admin User',
        email: 'admin@galaxykiro.com',
        role: 'admin',
        status: 'online'
      })
    } else if (section === 'member') {
      setUser({
        name: 'Member User',
        email: 'member@galaxykiro.com',
        role: 'member',
        status: 'hot_lead'
      })
    } else {
      setUser(null)
    }
  }, [pathname])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      // Escape to close search or dropdowns
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setOpenDropdown(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Navigation configurations for each section - memoized for performance
  const getNavigationForSection = useCallback((section: NavigationSection): NavigationItem[] => {
    switch (section) {
      case 'landing':
        return [
          {
            label: 'Home',
            href: '/',
            icon: Home
          },
          {
            label: 'Tools',
            href: '/tools',
            icon: Zap,
            children: [
              {
                label: 'All Tools',
                href: '/tools',
                description: 'Browse our complete assessment toolkit',
                icon: Target
              },
              {
                label: 'Potential Quotient',
                href: '/tools/potential-quotient-calculator',
                description: 'Discover your untapped potential',
                icon: Brain
              },
              {
                label: 'Decision Style',
                href: '/decision-door',
                description: 'Understand your decision-making patterns',
                icon: Target
              },
              {
                label: 'Leadership Style',
                href: '/leadership-lever',
                description: 'Identify your leadership approach',
                icon: Award
              },
              {
                label: 'Success Gap',
                href: '/success-gap',
                description: 'Bridge the gap to your goals',
                icon: TrendingUp
              },
              {
                label: 'Vision Void',
                href: '/vision-void',
                description: 'Clarify your vision and purpose',
                icon: Target
              },
              {
                label: 'Change Paradox',
                href: '/change-paradox',
                description: 'Navigate transformation challenges',
                icon: Brain
              }
            ]
          },
          {
            label: 'Content',
            href: '/content-library',
            icon: BookOpen,
            children: [
              {
                label: 'Content Library',
                href: '/content-library',
                description: 'Explore transformational content',
                icon: FileText
              },
              {
                label: 'Webinars',
                href: '/webinars',
                description: 'Join live transformation sessions',
                icon: Video
              },
              {
                label: 'Success Stories',
                href: '#success-stories',
                description: 'Real transformation journeys',
                icon: Award
              }
            ]
          },
          {
            label: 'Community',
            href: '/member',
            icon: Users,
            children: [
              {
                label: 'Member Dashboard',
                href: '/member',
                description: 'Your transformation hub',
                icon: Home
              },
              {
                label: 'Register',
                href: '/membership/register',
                description: 'Join our community',
                icon: UserPlus
              },
              {
                label: 'Network Hub',
                href: '/member#community',
                description: 'Connect with champions',
                icon: Users
              }
            ]
          },
          {
            label: 'About',
            href: '/about',
            icon: Award
          }
        ]

      case 'admin':
        return [
          {
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: Home
          },
          {
            label: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3
          },
          {
            label: 'User Management',
            href: '/admin/users',
            icon: Users,
            children: [
              {
                label: 'Leads',
                href: '/admin/leads',
                description: 'Manage lead pipeline',
                badge: 'hot'
              },
              {
                label: 'Members',
                href: '/admin/members',
                description: 'Active community members'
              },
              {
                label: 'Network',
                href: '/admin/network',
                description: 'Member connections'
              }
            ]
          },
          {
            label: 'Content & Tools',
            href: '/admin/content',
            icon: FileText,
            children: [
              {
                label: 'Content Management',
                href: '/admin/cms',
                description: 'Manage site content'
              },
              {
                label: 'Assessment Tools',
                href: '/admin/tools',
                description: 'Tool configuration'
              },
              {
                label: 'Webinars',
                href: '/admin/webinars',
                description: 'Event management'
              }
            ]
          },
          {
            label: 'System',
            href: '/admin/system',
            icon: Settings,
            children: [
              {
                label: 'Settings',
                href: '/admin/settings',
                description: 'System configuration'
              },
              {
                label: 'Security',
                href: '/admin/security',
                description: 'Security settings'
              },
              {
                label: 'Database',
                href: '/admin/database',
                description: 'Data management'
              }
            ]
          }
        ]

      case 'member':
        return [
          {
            label: 'Dashboard',
            href: '/soft-member/dashboard',
            icon: Home
          },
          {
            label: 'Assessments',
            href: '/soft-member/assessments',
            icon: Target,
            badge: 'new'
          },
          {
            label: 'My Progress',
            href: '/soft-member/progress',
            icon: TrendingUp
          },
          {
            label: 'Resources',
            href: '/soft-member/resources',
            icon: BookOpen,
            children: [
              {
                label: 'Content Library',
                href: '/soft-member/content',
                description: 'Educational resources'
              },
              {
                label: 'Webinars',
                href: '/soft-member/webinars',
                description: 'Live sessions'
              },
              {
                label: 'Tools',
                href: '/soft-member/tools',
                description: 'Assessment tools'
              }
            ]
          },
          {
            label: 'Community',
            href: '/soft-member/community',
            icon: Users,
            children: [
              {
                label: 'Network',
                href: '/soft-member/network',
                description: 'Connect with members'
              },
              {
                label: 'Messages',
                href: '/soft-member/messages',
                description: 'Member communications',
                count: 3
              }
            ]
          },
          {
            label: 'Account',
            href: '/soft-member/profile',
            icon: User,
            children: [
              {
                label: 'Profile',
                href: '/soft-member/profile',
                description: 'Your profile settings'
              },
              {
                label: 'Settings',
                href: '/soft-member/settings',
                description: 'Account preferences'
              }
            ]
          }
        ]

      default:
        return []
    }
  }, [])

  const navigation = useMemo(() => getNavigationForSection(currentSection), [currentSection, getNavigationForSection])

  // Get member badge based on status
  const getMemberBadge = (status: string) => {
    const badges = {
      'visitor': '🌟 Explorer',
      'cold_lead': '🚀 Rising Star', 
      'candidate': '💎 Champion',
      'hot_lead': '👑 Elite',
      'active': '⭐ Member'
    }
    return badges[status as keyof typeof badges] || '⭐ Member'
  }

  // Handle dropdown toggles - memoized for performance
  const handleDropdownToggle = useCallback((itemLabel: string, event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    setOpenDropdown(prev => prev === itemLabel ? null : itemLabel)
  }, [])

  // Auto-close dropdown after navigation - memoized for performance
  const handleNavigation = useCallback((href: string) => {
    setOpenDropdown(null)
    setIsOpen(false)
    router.push(href)
  }, [router])

  // Handle sign out - memoized for performance
  const handleSignOut = useCallback(() => {
    // In real app, handle sign out
    router.push('/')
  }, [router])

  const isActive = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }, [pathname])

  return (
    <nav ref={navRef} className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      scrolled 
        ? "bg-white/95 backdrop-blur-xl border-purple-200/50 shadow-lg" 
        : "bg-white/90 backdrop-blur-lg border-purple-100/30"
    )}
    data-testid="unified-main-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-lg">GK</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
            </motion.div>
            <motion.div
              whileHover={{ x: 2 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent"
            >
              Galaxy Kiro
            </motion.div>
            {currentSection !== 'landing' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-muted-foreground border-l border-border pl-3 ml-2"
              >
                {currentSection === 'admin' ? 'Admin Panel' : 'Member Portal'}
              </motion.div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.href} className="relative">
                {item.children ? (
                  <div>
                    <motion.button
                      onClick={(e) => handleDropdownToggle(item.label, e)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative group overflow-hidden",
                        isActive(item.href)
                          ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-md"
                          : "text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openDropdown === item.label && "rotate-180"
                      )} />
                    </motion.button>

                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-purple-200/50 rounded-xl shadow-xl py-3 z-50 overflow-hidden"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="max-h-96 overflow-y-auto">
                            {item.children.map((child, index) => (
                              <motion.button
                                key={child.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleNavigation(child.href)}
                                className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group border-b border-purple-100/50 last:border-b-0"
                              >
                                <div className="flex items-start space-x-3">
                                  {child.icon && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-200">
                                      <child.icon className="h-4 w-4 text-purple-600" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 group-hover:text-purple-700 transition-colors">
                                      {child.label}
                                    </div>
                                    {child.description && (
                                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {child.description}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end space-y-1">
                                    {child.badge && (
                                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                        {child.badge}
                                      </span>
                                    )}
                                    {child.count && (
                                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                        {child.count}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => handleNavigation(item.href)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative group overflow-hidden",
                      isActive(item.href)
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-md"
                        : "text-gray-700 hover:text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.count && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* User Profile for Admin/Member */}
            {user && (
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{user.name}</div>
                    {currentSection === 'member' && user.status && (
                      <div className="text-xs text-muted-foreground">
                        {getMemberBadge(user.status)}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="h-8"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Search and Public Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <motion.button
                onClick={() => setSearchOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 border border-gray-200"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
                <div className="flex items-center space-x-1 ml-2 px-1.5 py-0.5 bg-gray-200 rounded text-xs text-gray-500">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
              </motion.button>

              {/* Public Actions */}
              {!user && (
                <div className="hidden lg:flex items-center space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" asChild className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                      <Link href="/auth/signin" className="flex items-center space-x-2">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Link href="/auth/signup" className="flex items-center space-x-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Get Started</span>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.href}>
                  <button
                    onClick={() => item.children ? handleDropdownToggle(item.label) : handleNavigation(item.href)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </div>
                    {item.children && (
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openDropdown === item.label && "rotate-180"
                      )} />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {item.children && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-2 space-y-1"
                      >
                        {item.children.map((child) => (
                          <button
                            key={child.href}
                            onClick={() => handleNavigation(child.href)}
                            className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                              {child.count && (
                                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                  {child.count}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Mobile User Actions */}
              {user ? (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      {currentSection === 'member' && user.status && (
                        <div className="text-xs text-muted-foreground">
                          {getMemberBadge(user.status)}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border space-y-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-200">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search tools, content, or pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                    autoFocus
                  />
                  <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                    <span>ESC</span>
                  </div>
                </div>
                
                {searchQuery ? (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-3">Search results for "{searchQuery}"</p>
                      <div className="space-y-2">
                        {navigation.map((item) => {
                          const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase())
                          const childMatches = item.children?.filter(child => 
                            child.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            child.description?.toLowerCase().includes(searchQuery.toLowerCase())
                          ) || []
                          
                          if (!matchesSearch && childMatches.length === 0) return null
                          
                          return (
                            <div key={item.href}>
                              {matchesSearch && (
                                <button
                                  onClick={() => {
                                    handleNavigation(item.href)
                                    setSearchOpen(false)
                                    setSearchQuery('')
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                                >
                                  {item.icon && <item.icon className="h-4 w-4 text-purple-600" />}
                                  <span className="font-medium">{item.label}</span>
                                </button>
                              )}
                              {childMatches.map((child) => (
                                <button
                                  key={child.href}
                                  onClick={() => {
                                    handleNavigation(child.href)
                                    setSearchOpen(false)
                                    setSearchQuery('')
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-3 ml-6"
                                >
                                  {child.icon && <child.icon className="h-4 w-4 text-gray-400" />}
                                  <div>
                                    <div className="font-medium text-sm">{child.label}</div>
                                    <div className="text-xs text-gray-500">{child.description}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Start typing to search</p>
                    <p className="text-sm text-gray-400">Find tools, content, pages, and more</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}