"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/hooks/use-i18n'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  Briefcase,
  Phone,
  LogIn,
  UserPlus,
  ChevronDown,
  Zap,
  Target,
  Brain,
  Award,
  Calendar,
  MessageSquare,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<any>
  children?: NavigationItem[]
  description?: string
}

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { t } = useI18n()

  const navigation: NavigationItem[] = [
    {
      label: t('nav.home'),
      href: '/',
      icon: Home
    },
    {
      label: t('nav.tools'),
      href: '/tools',
      icon: Zap,
      children: [
        {
          label: 'All Tools',
          href: '/tools',
          description: 'Browse our complete assessment toolkit'
        },
        {
          label: 'Potential Quotient',
          href: '/tools/potential-quotient-calculator',
          description: 'Discover your untapped potential'
        },
        {
          label: 'Decision Style',
          href: '/decision-door',
          description: 'Understand your decision-making patterns'
        },
        {
          label: 'Leadership Style',
          href: '/leadership-lever',
          description: 'Identify your leadership approach'
        },
        {
          label: 'Success Gap',
          href: '/success-gap',
          description: 'Bridge the gap to your goals'
        },
        {
          label: 'Vision Void',
          href: '/vision-void',
          description: 'Clarify your vision and purpose'
        },
        {
          label: 'Change Paradox',
          href: '/change-paradox',
          description: 'Navigate transformation challenges'
        }
      ]
    },
    {
      label: t('nav.content'),
      href: '/content-library',
      icon: BookOpen,
      children: [
        {
          label: 'Content Library',
          href: '/content-library',
          description: 'Explore transformational content'
        },
        {
          label: 'Webinars',
          href: '/webinars',
          description: 'Join live transformation sessions'
        },
        {
          label: 'Success Stories',
          href: '#success-stories',
          description: 'Real transformation journeys'
        }
      ]
    },
    {
      label: t('nav.community'),
      href: '/member',
      icon: Users,
      children: [
        {
          label: 'Member Dashboard',
          href: '/member',
          description: 'Your transformation hub'
        },
        {
          label: 'Register',
          href: '/membership/register',
          description: 'Join our community'
        },
        {
          label: 'Network Hub',
          href: '/member#community',
          description: 'Connect with champions'
        }
      ]
    },
    {
      label: t('nav.about'),
      href: '/about',
      icon: Award
    }
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  useEffect(() => {
    setIsOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Galaxy Kiro
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.href} className="relative">
                {item.children ? (
                  <div
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-3 hover:bg-muted transition-colors"
                          >
                            <div className="font-medium text-sm">{child.label}</div>
                            {child.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {child.description}
                              </div>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                {t('nav.signin')}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                {t('nav.signup')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-background border-t border-border"
        >
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <span className="flex items-center space-x-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform",
                          openDropdown === item.label && "rotate-180"
                        )} 
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t border-border space-y-2">
              <Link href="/auth/signin">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('nav.signin')}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="w-full justify-start" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('nav.signup')}
                </Button>
              </Link>
              <div className="flex justify-center pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}