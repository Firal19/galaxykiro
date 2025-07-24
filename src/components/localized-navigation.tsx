"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { DirectionAware } from '@/components/ui/localized-content'
import { useI18n } from '@/lib/hooks/use-i18n'
import { Menu, X, Home, Info, Wrench, FileText, Users, LogIn, UserPlus } from 'lucide-react'

interface NavigationItem {
  key: string
  href: string
  icon: React.ComponentType<any>
}

export function LocalizedNavigation() {
  const { t, isRTL } = useI18n()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems: NavigationItem[] = [
    { key: 'nav.home', href: '/', icon: Home },
    { key: 'nav.about', href: '/about', icon: Info },
    { key: 'nav.tools', href: '/tools', icon: Wrench },
    { key: 'nav.content', href: '/content', icon: FileText },
    { key: 'nav.community', href: '/community', icon: Users }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <DirectionAware>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GK</span>
              </div>
              <span className="font-bold text-xl text-foreground hidden sm:inline">
                Galaxy Kiro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(item.key)}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Items */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher variant="dropdown" className="hidden sm:block" />
              
              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('nav.signin')}
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('nav.signup')}
                  </Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-background border-t border-border"
            >
              <div className="container mx-auto px-6 py-4">
                <div className="space-y-4">
                  {/* Mobile Navigation Items */}
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{t(item.key)}</span>
                      </Link>
                    )
                  })}

                  {/* Mobile Language Switcher */}
                  <div className="pt-4 border-t border-border">
                    <LanguageSwitcher variant="minimal" className="justify-center" />
                  </div>

                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        {t('nav.signin')}
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t('nav.signup')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </DirectionAware>
  )
}