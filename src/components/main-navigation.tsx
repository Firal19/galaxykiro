"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home,
  Brain,
  Users,
  BookOpen,
  MessageSquare,
  LogIn,
  UserPlus,
  ChevronDown,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
  Zap,
  Award
} from 'lucide-react'

const publicNavItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home
  },
  {
    label: 'Webinar',
    href: '/webinars',
    icon: MessageSquare
  },
  {
    label: 'Members',
    href: '#',
    icon: Users,
    children: [
      { 
        label: 'Soft Member Portal', 
        href: '/auth/signin?redirect=member', 
        icon: Heart,
        description: 'Access personalized content and tools'
      },
      { 
        label: 'Admin Panel', 
        href: '/auth/signin?redirect=admin', 
        icon: Award,
        description: 'Administrative control center'
      }
    ]
  }
]

export function MainNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                G
              </div>
              <span className={`ml-3 font-bold text-2xl tracking-tight ${
                isScrolled ? 'text-gray-900 dark:text-white' : 'text-white drop-shadow-lg'
              }`}>
                Galaxy Kiro
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {publicNavItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                        isActive(item.href)
                          ? isScrolled 
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 shadow-lg'
                            : 'bg-white/25 text-white shadow-lg backdrop-blur-sm'
                          : isScrolled
                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700'
                            : 'text-white/95 hover:bg-white/15 hover:text-white hover:shadow-lg'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <div className="p-2">
                            {item.children.map((child, index) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="flex items-start p-4 rounded-lg text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 group"
                              >
                                <div className="flex-shrink-0 mr-4">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <child.icon className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {child.label}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    {child.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      isActive(item.href)
                        ? isScrolled 
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 shadow-lg'
                          : 'bg-white/25 text-white shadow-lg backdrop-blur-sm'
                        : isScrolled
                          ? 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700'
                          : 'text-white/95 hover:bg-white/15 hover:text-white hover:shadow-lg'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                size="lg"
                className={`font-semibold transition-all duration-300 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                    : 'text-white hover:bg-white/15 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl font-semibold px-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isScrolled 
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-6 py-8 space-y-4">
              {publicNavItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <div className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      <div className="ml-8 space-y-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-start p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
                          >
                            <div className="flex-shrink-0 mr-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <child.icon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                {child.label}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {child.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center py-3 px-4 rounded-xl text-gray-700 dark:text-gray-300 font-semibold text-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 ${
                        isActive(item.href) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <Link href="/auth/signin" className="block">
                  <Button variant="outline" className="w-full h-12 text-lg font-semibold">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-lg font-semibold shadow-lg">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}