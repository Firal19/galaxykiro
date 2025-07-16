'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { containerClasses, responsiveSpacing } from '../lib/responsive-utils';

interface MobileFirstLayoutProps {
  children: React.ReactNode;
  variant?: 'full' | 'constrained' | 'content' | 'narrow';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Mobile-first layout container with responsive spacing and constraints
 */
export const MobileFirstLayout: React.FC<MobileFirstLayoutProps> = ({
  children,
  variant = 'constrained',
  spacing = 'medium',
  className
}) => {
  const spacingClasses = {
    none: '',
    small: responsiveSpacing.itemY,
    medium: responsiveSpacing.contentY,
    large: responsiveSpacing.sectionY
  };

  return (
    <div className={cn(
      containerClasses[variant],
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Responsive grid system with mobile-first breakpoints
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'medium',
  className
}) => {
  const gapClasses = {
    small: 'gap-4 sm:gap-6',
    medium: 'gap-4 sm:gap-6 lg:gap-8',
    large: 'gap-6 sm:gap-8 lg:gap-12'
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const gridClasses = cn(
    'grid',
    gridCols[columns.mobile || 1],
    columns.tablet && `sm:${gridCols[columns.tablet]}`,
    columns.desktop && `lg:${gridCols[columns.desktop]}`,
    gapClasses[gap]
  );

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
};

interface MobileStackProps {
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

/**
 * Vertical stack layout optimized for mobile
 */
export const MobileStack: React.FC<MobileStackProps> = ({
  children,
  spacing = 'normal',
  className
}) => {
  const spacingClasses = {
    tight: 'space-y-2 sm:space-y-3',
    normal: 'space-y-4 sm:space-y-6',
    loose: 'space-y-6 sm:space-y-8 lg:space-y-12'
  };

  return (
    <div className={cn('flex flex-col', spacingClasses[spacing], className)}>
      {children}
    </div>
  );
};

interface ResponsiveTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Responsive text component with mobile-first typography
 */
export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  align = 'left',
  className
}) => {
  const variants = {
    h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold',
    h2: 'text-2xl sm:text-3xl lg:text-4xl font-bold',
    h3: 'text-xl sm:text-2xl lg:text-3xl font-semibold',
    h4: 'text-lg sm:text-xl lg:text-2xl font-semibold',
    body: 'text-base sm:text-lg',
    small: 'text-sm sm:text-base'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return (
    <Component className={cn(
      variants[variant],
      alignClasses[align],
      className
    )}>
      {children}
    </Component>
  );
};

interface MobileCardProps {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
  shadow?: boolean;
  border?: boolean;
  className?: string;
}

/**
 * Mobile-optimized card component
 */
export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  padding = 'medium',
  shadow = true,
  border = true,
  className
}) => {
  const paddingClasses = {
    small: 'p-4 sm:p-6',
    medium: 'p-6 sm:p-8',
    large: 'p-8 sm:p-12'
  };

  return (
    <div className={cn(
      'bg-white rounded-lg',
      paddingClasses[padding],
      shadow && 'shadow-sm hover:shadow-md transition-shadow',
      border && 'border border-gray-200',
      className
    )}>
      {children}
    </div>
  );
};

interface TouchOptimizedListProps {
  items: Array<{
    id: string;
    content: React.ReactNode;
    onClick?: () => void;
    href?: string;
  }>;
  className?: string;
}

/**
 * Touch-optimized list component
 */
export const TouchOptimizedList: React.FC<TouchOptimizedListProps> = ({
  items,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const baseClasses = cn(
          'block w-full p-4 rounded-lg',
          'min-h-[44px] flex items-center',
          'bg-white border border-gray-200',
          'hover:bg-gray-50 active:bg-gray-100',
          'transition-colors duration-200',
          'touch-manipulation'
        );

        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              className={baseClasses}
            >
              {item.content}
            </a>
          );
        }

        if (item.onClick) {
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={baseClasses}
            >
              {item.content}
            </button>
          );
        }

        return (
          <div key={item.id} className={baseClasses}>
            {item.content}
          </div>
        );
      })}
    </div>
  );
};