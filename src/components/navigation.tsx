'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// Removed next-intl imports
import { TouchButton } from './ui/touch-button'
import { usePWA } from '../lib/hooks/use-pwa'
// Removed language switcher import
import { GalaxyDreamTeamLogo } from './galaxy-dream-team-logo'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  // Hardcoded locale and translations
  const locale = 'en'
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'home': 'Home',
      'about': 'About',
      'services': 'Services',
      'contact': 'Contact',
      'menu': 'Menu',
      'close': 'Close',
    };
    return translations[key] || key;
  }
  const tCta = (key: string) => {
    const translations: Record<string, string> = {
      'learnMore': 'Learn More',
      'getStarted': 'Get Started',
      'discover': 'Discover Your Hidden 90%',
      'continue': 'Continue',
    };
    return translations[key] || key;
  }
  const { isInstallable, installApp, isOnline } = usePWA()

  const navItems = [
    { href: `/${locale}/webinars`, label: 'Webinars' },
    { href: '/community', label: 'Network' },
    { href: '/membership/dashboard', label: 'Member' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="backdrop-blur bg-white/60 dark:bg-black/60 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[60px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <GalaxyDreamTeamLogo 
              href={`/${locale}`}
              variant="full"
              size="medium"
              className="transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-growth-500 rounded-lg"
            />
          </div>

          {/* Online/Offline Indicator */}
          {!isOnline && (
            <div className="hidden sm:flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Offline
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    `relative px-4 py-2 rounded-full font-medium transition-all duration-200 min-h-[44px] flex items-center outline-none focus-visible:ring-2 focus-visible:ring-growth-500
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-growth-500)] text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-growth-700'}
                    `
                  }
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  tabIndex={0}
                  role="tab"
                >
                  <span className="z-10">{item.label}</span>
                  {/* Animated underline for active/hover */}
                  <span className={`absolute left-2 right-2 -bottom-1 h-1 rounded-full transition-all duration-300 ${isActive(item.href) ? 'bg-gradient-to-r from-[var(--color-energy-400)] to-[var(--color-growth-400)] opacity-80' : 'opacity-0 group-hover:opacity-40'}`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isInstallable && (
              <TouchButton
                variant="outline"
                size="small"
                onClick={installApp}
                className="text-xs"
              >
                Install App
              </TouchButton>
            )}
            <Link href="/membership/register">
              <TouchButton 
                variant="cta"
                size="medium"
              >
                Join Free
              </TouchButton>
            </Link>
            {/* User avatar/CTA reserved here */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {!isOnline && (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-growth-500"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden backdrop-blur-lg bg-white/90 dark:bg-black/90 border-t border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-full text-base font-medium transition-all duration-200 min-h-[44px] flex items-center outline-none focus-visible:ring-2 focus-visible:ring-growth-500
                  ${isActive(item.href)
                    ? 'bg-gradient-to-r from-[var(--color-energy-500)] to-[var(--color-growth-500)] text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-growth-700'}
                `}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
                tabIndex={0}
                role="tab"
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Actions */}
            <div className="pt-4 space-y-3">
              {isInstallable && (
                <TouchButton
                  variant="secondary"
                  size="medium"
                  onClick={() => {
                    installApp();
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Install App
                </TouchButton>
              )}
              <Link href="/membership/register" onClick={() => setIsOpen(false)}>
                <TouchButton 
                  variant="cta"
                  size="medium"
                  className="w-full"
                >
                  Join Free
                </TouchButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}