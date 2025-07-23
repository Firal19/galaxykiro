'use client'

import React from 'react'
import Link from 'next/link'

interface GalaxyDreamTeamLogoProps {
  variant?: 'full' | 'compact' | 'icon-only'
  size?: 'small' | 'medium' | 'large'
  href?: string
  className?: string
  showTagline?: boolean
}

export function GalaxyDreamTeamLogo({ 
  variant = 'full', 
  size = 'medium',
  href = '/',
  className = '',
  showTagline = false
}: GalaxyDreamTeamLogoProps) {
  const sizeClasses = {
    small: {
      icon: 'w-8 h-8',
      text: 'text-lg',
      tagline: 'text-xs'
    },
    medium: {
      icon: 'w-10 h-10',
      text: 'text-xl',
      tagline: 'text-sm'
    },
    large: {
      icon: 'w-12 h-12',
      text: 'text-2xl',
      tagline: 'text-base'
    }
  }

  const LogoIcon = () => (
    <div className={`${sizeClasses[size].icon} bg-gradient-to-br from-[#FFD700] via-[#078930] to-[#DA121A] rounded-lg flex items-center justify-center shadow-lg`}>
      <div className="relative">
        {/* Galaxy/Star symbol */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-white drop-shadow-sm"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          <circle cx="12" cy="12" r="2" className="opacity-80"/>
        </svg>
      </div>
    </div>
  )

  const LogoContent = () => (
    <div className="flex items-center space-x-3">
      <LogoIcon />
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${sizeClasses[size].text} text-gray-900 leading-tight`}>
              Galaxy Dream Team
            </span>
            {variant === 'compact' && size === 'small' && (
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                GDT
              </span>
            )}
          </div>
          {showTagline && (
            <span className={`${sizeClasses[size].tagline} text-gray-600 font-medium leading-tight`}>
              Unlock Your Hidden Potential
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link 
        href={href} 
        className={`inline-flex items-center touch-manipulation hover:opacity-90 transition-opacity ${className}`}
        aria-label="Galaxy Dream Team - Home"
        data-testid="galaxy-dream-team-logo"
      >
        <LogoContent />
      </Link>
    )
  }

  return (
    <div className={`inline-flex items-center ${className}`} data-testid="galaxy-dream-team-logo">
      <LogoContent />
    </div>
  )
}

// Standalone icon component for use in other contexts
export function GalaxyDreamTeamIcon({ 
  size = 'medium',
  className = ''
}: {
  size?: 'small' | 'medium' | 'large'
  className?: string
}) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-10 h-10'
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-[#FFD700] via-[#078930] to-[#DA121A] rounded-lg flex items-center justify-center shadow-lg ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        className="w-4 h-4 text-white drop-shadow-sm"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        <circle cx="12" cy="12" r="2" className="opacity-80"/>
      </svg>
    </div>
  )
}