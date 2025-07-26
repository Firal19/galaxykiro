import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'white' | 'gray'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  white: 'text-white',
  gray: 'text-gray-400'
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary'
}: LoadingSpinnerProps) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <svg
        className={cn(
          'animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 rounded',
            i === lines - 1 ? 'h-4' : 'h-4 mb-2',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('p-6 bg-white rounded-lg border animate-pulse', className)}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export function LoadingButton({ 
  children, 
  loading, 
  disabled, 
  className,
  onClick 
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading && <LoadingSpinner size="sm" color="white" />}
      {children}
    </button>
  )
}