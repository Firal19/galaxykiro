"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSoftMembership } from '@/lib/hooks/use-soft-membership'
import { leadScoringService } from '@/lib/lead-scoring-service'
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  Package,
  Users,
  User,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Bell,
  Award,
  Sparkles
} from 'lucide-react'

interface SoftMemberLayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  requiresHotLead?: boolean
}

export function SoftMemberLayout({ children }: SoftMemberLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { status, loading } = useSoftMembership()
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    // Load member profile
    const loadProfile = async () => {
      const currentProfile = leadScoringService.getCurrentProfile()
      setProfile(currentProfile)
      
      // Check for new content/notifications
      // This would be a real API call in production
      setNotifications(3)
    }
    
    loadProfile()
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && status === 'pending_approval') {
      router.push('/approval-pending')
    } else if (!loading && !status) {
      router.push('/login')
    }
  }, [status, loading, router])

  const navigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/soft-member/dashboard',
      icon: LayoutDashboard,
      badge: notifications > 0 ? notifications.toString() : undefined
    },
    {
      label: 'Content Library',
      href: '/soft-member/content',
      icon: BookOpen
    },
    {
      label: 'Tools',
      href: '/soft-member/tools',
      icon: Zap
    },
    {
      label: 'My Toolbox',
      href: '/soft-member/toolbox',
      icon: Package
    },
    {
      label: 'Network Hub',
      href: '/soft-member/network',
      icon: Users,
      requiresHotLead: true
    },
    {
      label: 'Calendar',
      href: '/soft-member/calendar',
      icon: Calendar
    },
    {
      label: 'Profile',
      href: '/soft-member/profile',
      icon: User
    }
  ]

  const filteredNavigation = navigation.filter(item => 
    !item.requiresHotLead || (item.requiresHotLead && profile?.status === 'hot_lead')
  )

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    // Clear session and redirect
    if (typeof window !== 'undefined') {
      localStorage.removeItem('galaxy_kiro_session')
      localStorage.removeItem('galaxy_kiro_referral')
    }
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/soft-member/dashboard" className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Galaxy Kiro</span>
          </Link>
          <div className="flex items-center space-x-2">
            {notifications > 0 && (
              <Badge variant="destructive" className="px-2 py-1">
                {notifications}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex flex-col bg-card border-r border-border"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-border">
                <Link href="/soft-member/dashboard" className="flex items-center space-x-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <div>
                    <h1 className="font-bold text-xl">Galaxy Kiro</h1>
                    <p className="text-xs text-muted-foreground">Member Portal</p>
                  </div>
                </Link>
              </div>

              {/* Member Status */}
              {profile && (
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={cn(
                      "capitalize",
                      profile.status === 'hot_lead' && "bg-red-500 text-white",
                      profile.status === 'candidate' && "bg-orange-500 text-white",
                      profile.status === 'soft_member' && "bg-purple-500 text-white"
                    )}>
                      {profile.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Engagement</span>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="font-bold">{profile.score}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-border space-y-2">
                <Link href="/soft-member/settings">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground p-1 rounded-r-md shadow-lg hover:bg-primary/90 transition-colors"
          style={{ left: isSidebarOpen ? '280px' : '0' }}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", !isSidebarOpen && "rotate-180")} />
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <Badge variant="destructive">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
                <Link href="/soft-member/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}