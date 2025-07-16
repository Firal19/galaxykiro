'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { getTouchTargetClass } from '../../lib/responsive-utils';

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, variant = 'primary', size = 'medium', loading, children, disabled, ...props }, ref) => {
    const baseClasses = cn(
      // Touch optimization
      'touch-manipulation',
      'select-none',
      'cursor-pointer',
      // Minimum touch target
      getTouchTargetClass(size),
      // Base styling
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      // Disabled state
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      // Active state feedback
      'active:scale-95'
    );

    const variants = {
      primary: cn(
        'bg-growth-500 text-white',
        'hover:bg-growth-600 active:bg-growth-700',
        'focus:ring-growth-500',
        'shadow-sm hover:shadow-md'
      ),
      secondary: cn(
        'bg-white text-growth-600',
        'border-2 border-growth-500',
        'hover:bg-growth-50 active:bg-growth-100',
        'focus:ring-growth-500'
      ),
      cta: cn(
        'bg-energy-500 text-white',
        'hover:bg-energy-600 active:bg-energy-700',
        'focus:ring-energy-500',
        'shadow-lg hover:shadow-xl',
        'font-semibold'
      ),
      ghost: cn(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus:ring-gray-500'
      ),
      outline: cn(
        'bg-transparent text-gray-700',
        'border-2 border-gray-300',
        'hover:bg-gray-50 active:bg-gray-100',
        'focus:ring-gray-500'
      )
    };

    const sizes = {
      small: 'px-3 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';

export { TouchButton };
export type { TouchButtonProps };