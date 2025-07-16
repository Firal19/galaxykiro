/**
 * Mobile-First Responsive Design Utilities
 * Provides consistent breakpoints, spacing, and layout utilities
 */

// Mobile-first breakpoints (min-width)
export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Large laptops
  '2xl': '1536px' // Desktop
} as const;

// Touch-friendly spacing system
export const touchSpacing = {
  // Minimum touch target size (44px)
  minTouch: '44px',
  // Comfortable touch spacing
  touchPadding: '12px',
  // Section spacing for mobile
  sectionMobile: '24px',
  sectionTablet: '48px',
  sectionDesktop: '64px',
  // Content spacing
  contentGap: '16px',
  contentGapLarge: '24px'
} as const;

// Responsive typography scale
export const responsiveText = {
  // Headings
  h1: {
    mobile: 'text-2xl',    // 24px
    tablet: 'text-3xl',    // 30px
    desktop: 'text-4xl'    // 36px
  },
  h2: {
    mobile: 'text-xl',     // 20px
    tablet: 'text-2xl',    // 24px
    desktop: 'text-3xl'    // 30px
  },
  h3: {
    mobile: 'text-lg',     // 18px
    tablet: 'text-xl',     // 20px
    desktop: 'text-2xl'    // 24px
  },
  body: {
    mobile: 'text-base',   // 16px
    tablet: 'text-base',   // 16px
    desktop: 'text-lg'     // 18px
  },
  small: {
    mobile: 'text-sm',     // 14px
    tablet: 'text-sm',     // 14px
    desktop: 'text-base'   // 16px
  }
} as const;

// Container utilities for consistent layouts
export const containerClasses = {
  // Full width with padding
  full: 'w-full px-4 sm:px-6 lg:px-8',
  // Constrained width
  constrained: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  // Content width for reading
  content: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
  // Narrow content
  narrow: 'max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'
} as const;

// Grid system utilities
export const gridClasses = {
  // Responsive grid
  responsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
  // Two column grid
  twoCol: 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8',
  // Assessment grid
  assessment: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6',
  // Tool grid
  tools: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
} as const;

// Touch-optimized button classes
export const touchButtonClasses = {
  // Primary touch button
  primary: `
    min-h-[${touchSpacing.minTouch}] 
    px-6 py-3 
    text-base font-medium 
    rounded-lg 
    bg-growth-500 text-white 
    hover:bg-growth-600 
    active:bg-growth-700 
    focus:outline-none focus:ring-2 focus:ring-growth-500 focus:ring-offset-2
    transition-colors duration-200
    touch-manipulation
  `,
  // Secondary touch button
  secondary: `
    min-h-[${touchSpacing.minTouch}] 
    px-6 py-3 
    text-base font-medium 
    rounded-lg 
    bg-white text-growth-600 
    border-2 border-growth-500 
    hover:bg-growth-50 
    active:bg-growth-100 
    focus:outline-none focus:ring-2 focus:ring-growth-500 focus:ring-offset-2
    transition-colors duration-200
    touch-manipulation
  `,
  // CTA button
  cta: `
    min-h-[${touchSpacing.minTouch}] 
    px-8 py-4 
    text-lg font-semibold 
    rounded-xl 
    bg-energy-500 text-white 
    hover:bg-energy-600 
    active:bg-energy-700 
    focus:outline-none focus:ring-2 focus:ring-energy-500 focus:ring-offset-2
    transition-all duration-200
    touch-manipulation
    shadow-lg hover:shadow-xl
  `
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  // Vertical spacing
  sectionY: 'py-12 sm:py-16 lg:py-20',
  contentY: 'py-8 sm:py-12 lg:py-16',
  itemY: 'py-4 sm:py-6 lg:py-8',
  
  // Horizontal spacing
  sectionX: 'px-4 sm:px-6 lg:px-8',
  contentX: 'px-6 sm:px-8 lg:px-12',
  
  // Gap spacing
  gap: 'gap-4 sm:gap-6 lg:gap-8',
  gapLarge: 'gap-6 sm:gap-8 lg:gap-12'
} as const;

// One-thumb reachability zones
export const thumbZones = {
  // Easy reach zone (bottom 1/3 of screen)
  easy: 'bottom-0 left-0 right-0 h-1/3',
  // Medium reach zone (middle 1/3)
  medium: 'top-1/3 left-0 right-0 h-1/3',
  // Hard reach zone (top 1/3)
  hard: 'top-0 left-0 right-0 h-1/3'
} as const;

// Utility functions
export const getResponsiveClass = (
  mobileClass: string,
  tabletClass?: string,
  desktopClass?: string
): string => {
  let classes = mobileClass;
  if (tabletClass) classes += ` md:${tabletClass}`;
  if (desktopClass) classes += ` lg:${desktopClass}`;
  return classes;
};

export const getTouchTargetClass = (size: 'small' | 'medium' | 'large' = 'medium'): string => {
  const sizes = {
    small: 'min-h-[40px] min-w-[40px]',
    medium: 'min-h-[44px] min-w-[44px]',
    large: 'min-h-[48px] min-w-[48px]'
  };
  return sizes[size];
};

// Responsive visibility utilities
export const visibilityClasses = {
  mobileOnly: 'block sm:hidden',
  tabletOnly: 'hidden sm:block lg:hidden',
  desktopOnly: 'hidden lg:block',
  mobileTablet: 'block lg:hidden',
  tabletDesktop: 'hidden sm:block'
} as const;