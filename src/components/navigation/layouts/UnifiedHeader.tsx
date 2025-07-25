/**
 * UnifiedHeader - Main navigation header component
 */

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Search, Bell, User, Globe, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { cn } from '@/lib/utils'
import { NavigationProvider, useNavigation, useNavigationGroups } from '../core/NavigationContext'
import { NavigationGroup } from '../components/NavigationGroup'
import { NavigationItem } from '../components/NavigationItem'
import { LayoutVariant, NavigationUser } from '../core/NavigationTypes'

interface UnifiedHeaderProps {
  variant: LayoutVariant
  user?: NavigationUser
  className?: string
}

function HeaderContent({ variant, user, className }: UnifiedHeaderProps) {
  const { state, actions, config } = useNavigation()
  const groups = useNavigationGroups()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    actions.setSearchQuery(query)
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled 
        ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" 
        : "bg-background/60 backdrop-blur-sm",
      className
    )}>
      <div className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        config.maxWidth && `max-w-${config.maxWidth}`
      )}>
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          {config.showLogo && (
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                Galaxy Kiro
              </motion.div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center space-x-1">
                {group.items.map((item) => (
                  <div key={item.id} className="relative group">
                    <NavigationItem
                      item={item}
                      variant="horizontal"
                      showIcon={true}
                      showBadge={true}
                      className="hover:bg-muted/50"
                    />
                    
                    {/* Dropdown Menu */}
                    {item.children && item.children.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg overflow-hidden",
                          "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto",
                          "transition-all duration-200"
                        )}
                      >
                        {item.children.map((child) => (
                          <NavigationItem
                            key={child.id}
                            item={child}
                            variant="vertical"
                            showIcon={false}
                            showBadge={true}
                            showDescription={true}
                            className="hover:bg-muted border-b border-border last:border-b-0"
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Search */}
            {config.showSearch && (
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}

            {/* Language Switcher */}
            {config.showLanguageSwitcher && (
              <LanguageSwitcher />
            )}

            {/* Theme Toggle */}
            {config.showThemeToggle && (
              <Button variant="ghost" size="sm">
                <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            {/* Notifications */}
            {config.showNotifications && user && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {user.notifications && user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {user.notifications > 99 ? '99+' : user.notifications}
                  </span>
                )}
              </Button>
            )}

            {/* User Menu */}
            {config.showUserMenu && user ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:inline text-sm">{user.name}</span>
                </Button>
              </div>
            ) : (
              !config.showUserMenu && variant === 'public' && (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={actions.toggleOpen}
            >
              {state.isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {state.isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-background border-t border-border"
        >
          <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
            {groups.map((group) => (
              <NavigationGroup
                key={group.id}
                group={group}
                variant="mobile"
                showIcons={true}
                showBadges={true}
                showDescriptions={false}
              />
            ))}
            
            {/* Mobile Search */}
            {config.showSearch && (
              <div className="pt-4 border-t border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Mobile Auth Buttons */}
            {variant === 'public' && !user && (
              <div className="pt-4 border-t border-border space-y-2">
                <Link href="/auth/signin" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="block">
                  <Button className="w-full justify-start">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}

// Main component with provider
export function UnifiedHeader(props: UnifiedHeaderProps) {
  return (
    <NavigationProvider variant={props.variant} context="header" user={props.user}>
      <HeaderContent {...props} />
    </NavigationProvider>
  )
}