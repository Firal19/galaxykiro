'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { getTouchTargetClass } from '../../lib/responsive-utils';

interface TouchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const TouchInput = React.forwardRef<HTMLInputElement, TouchInputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Touch optimization
              'touch-manipulation',
              // Minimum touch target height
              getTouchTargetClass('medium'),
              // Base styling
              'w-full px-4 py-3',
              'text-base', // 16px to prevent zoom on iOS
              'border border-gray-300 rounded-lg',
              'bg-white',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-growth-500 focus:border-growth-500',
              // Error states
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Disabled state
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="h-5 w-5 text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TouchInput.displayName = 'TouchInput';

export { TouchInput };
export type { TouchInputProps };