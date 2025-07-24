"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Network,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Shield,
  Calendar
} from 'lucide-react'

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    label: 'Leads',
    href: '/admin/leads',
    icon: Users
  },
  {
    label: 'Content',
    href: '/admin/content',
    icon: FileText
  },
  {
    label: 'Tools',
    href: '/admin/tools',
    icon: Wrench
  },
  {
    label: 'Webinars',
    href: '/admin/webinars',
    icon: Calendar
  },
  {
    label: 'Network',
    href: '/admin/network',
    icon: Network
  }
]

export function AdminNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    // Handle sign out
    window.location.href = '/auth/signin'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                G
              </div>
              <span className="ml-2 font-bold text-xl text-white">
                Galaxy Kiro
              </span>
              <span className="ml-2 px-2 py-1 bg-purple-900 text-purple-200 text-xs font-semibold rounded-full flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                ADMIN
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-purple-900 text-purple-200'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* System Status */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-900 text-green-200 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              System Online
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:bg-gray-800 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="bg-purple-900 text-purple-200">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-300">
                  Admin
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">Admin Account</p>
                    <p className="text-xs text-gray-400">admin@galaxykiro.com</p>
                  </div>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="px-4 py-6 space-y-3">
            {adminNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2 font-medium ${
                  isActive(item.href) ? 'text-purple-400' : 'text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </div>
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <Link href="/admin/settings" className="block">
                <Button variant="outline" className="w-full bg-gray-800 border-gray-700 text-gray-300">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full bg-gray-800 border-gray-700 text-red-400 hover:bg-red-900/20"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}