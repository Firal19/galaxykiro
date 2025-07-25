"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Zap,
  Network,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Bell,
  Search,
  Shield,
  Activity,
  UserCog,
  Database
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  children?: NavigationItem[]
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(5)

  useEffect(() => {
    // Check admin authentication
    const checkAdminAuth = async () => {
      // This would be a real auth check in production
      const session = typeof window !== 'undefined' ? localStorage.getItem('galaxy_kiro_session') : null
      
      if (!session) {
        router.push('/login')
        return
      }

      // Parse session and check role
      try {
        const sessionData = JSON.parse(session)
        if (sessionData.role !== 'admin') {
          router.push('/soft-member/dashboard')
          return
        }
        setIsAdmin(true)
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [router])

  const navigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      badge: 'Live'
    },
    {
      label: 'Lead Management',
      href: '/admin/leads',
      icon: Users,
      badge: notifications.toString()
    },
    {
      label: 'Content Management',
      href: '/admin/cms',
      icon: FileText,
      children: [
        {
          label: 'Dashboard',
          href: '/admin/cms/dashboard',
          icon: LayoutDashboard
        },
        {
          label: 'Create Content',
          href: '/admin/cms/create',
          icon: FileText
        },
        {
          label: 'Distribute',
          href: '/admin/cms/distribute',
          icon: Activity
        }
      ]
    },
    {
      label: 'Tools',
      href: '/admin/tools',
      icon: Zap
    },
    {
      label: 'Webinars',
      href: '/admin/webinars',
      icon: Database
    },
    {
      label: 'Network',
      href: '/admin/network',
      icon: Network
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: UserCog
    }
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('galaxy_kiro_session')
      localStorage.removeItem('galaxy_kiro_admin')
    }
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden lg:flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-2 bg-muted rounded-lg px-3 py-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads, content, or tools..."
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* Admin Profile */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/admin-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:block bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16"
            >
              <nav className="p-4 space-y-1 h-full overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const hasChildren = item.children && item.children.length > 0
                  const isExpanded = openDropdown === item.label

                  if (hasChildren) {
                    return (
                      <div key={item.href}>
                        <button
                          onClick={() => setOpenDropdown(isExpanded ? null : item.label)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <span className="flex items-center space-x-3">
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </span>
                          <ChevronLeft className={cn(
                            "w-4 h-4 transition-transform",
                            isExpanded && "-rotate-90"
                          )} />
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-1 space-y-1 overflow-hidden"
                            >
                              {item.children.map((child) => {
                                const ChildIcon = child.icon
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors",
                                      isActive(child.href)
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                  >
                                    <ChildIcon className="w-4 h-4" />
                                    <span>{child.label}</span>
                                  </Link>
                                )
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  }

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
                        <Badge variant={item.badge === 'Live' ? 'default' : 'destructive'}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}

                <div className="pt-4 mt-4 border-t border-border space-y-1">
                  <Link href="/admin/settings">
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
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:block fixed z-30 bg-primary text-primary-foreground p-1 rounded-r-md shadow-lg hover:bg-primary/90 transition-colors"
          style={{
            left: isSidebarOpen ? '280px' : '0',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="font-bold">Admin Panel</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
                {navigation.map((item) => {
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
                        <Badge variant={item.badge === 'Live' ? 'default' : 'destructive'}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
                <Link href="/admin/settings" onClick={() => setIsMobileMenuOpen(false)}>
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