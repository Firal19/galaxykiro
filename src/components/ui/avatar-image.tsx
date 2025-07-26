'use client'

import { useState } from 'react'
import { OptimizedImage } from './optimized-image'
import { cn } from '@/lib/utils'

interface AvatarImageProps {
  src?: string
  alt: string
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Generate a consistent color based on name
function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-lg'
}

export function AvatarImage({
  src,
  alt,
  name,
  className,
  size = 'md'
}: AvatarImageProps) {
  const [imageError, setImageError] = useState(false)
  
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)
  const sizeClass = sizeClasses[size]

  if (!src || imageError) {
    return (
      <div className={cn(
        'rounded-full flex items-center justify-center text-white font-medium',
        colorClass,
        sizeClass,
        className
      )}>
        {initials}
      </div>
    )
  }

  return (
    <div className={cn('rounded-full overflow-hidden', sizeClass, className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  )
}