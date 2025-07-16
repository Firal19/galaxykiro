'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface ThumbZoneLayoutProps {
  children: React.ReactNode;
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

/**
 * ThumbZoneLayout optimizes content for one-thumb reachability
 * - Easy zone (bottom): Primary actions and navigation
 * - Medium zone (middle): Secondary actions and interactive content
 * - Hard zone (top): Static content and information
 */
export const ThumbZoneLayout: React.FC<ThumbZoneLayoutProps> = ({
  children,
  primaryActions,
  secondaryActions,
  content,
  className
}) => {
  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      {/* Hard Reach Zone - Top 1/3 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {content || children}
      </div>

      {/* Medium Reach Zone - Middle area for secondary actions */}
      {secondaryActions && (
        <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-200">
          <div className="max-w-sm mx-auto">
            {secondaryActions}
          </div>
        </div>
      )}

      {/* Easy Reach Zone - Bottom for primary actions */}
      {primaryActions && (
        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 safe-area-inset-bottom">
          <div className="max-w-sm mx-auto">
            {primaryActions}
          </div>
        </div>
      )}
    </div>
  );
};

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  variant?: 'primary' | 'secondary';
  className?: string;
}

/**
 * Floating Action Button positioned in thumb-friendly zone
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  variant = 'primary',
  className
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  const variantClasses = {
    primary: 'bg-growth-500 text-white hover:bg-growth-600 shadow-lg',
    secondary: 'bg-white text-growth-600 border-2 border-growth-500 hover:bg-growth-50 shadow-md'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed z-50',
        'w-14 h-14 rounded-full',
        'flex items-center justify-center',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-growth-500',
        'active:scale-95',
        'touch-manipulation',
        positionClasses[position],
        variantClasses[variant],
        className
      )}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
}

/**
 * Bottom Sheet for thumb-friendly modal interactions
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto'
}) => {
  const heightClasses = {
    auto: 'max-h-[80vh]',
    half: 'h-1/2',
    full: 'h-full'
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white rounded-t-xl shadow-xl',
          'transform transition-transform duration-300 ease-out',
          heightClasses[height],
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  );
};

interface ThumbFriendlyTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * Tabs optimized for thumb navigation
 */
export const ThumbFriendlyTabs: React.FC<ThumbFriendlyTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>

      {/* Tab Navigation - Bottom for thumb access */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center',
                'min-h-[60px] px-2 py-3',
                'text-xs font-medium',
                'transition-colors duration-200',
                'touch-manipulation',
                activeTab === tab.id
                  ? 'text-growth-600 bg-growth-50'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.icon && (
                <div className="mb-1">
                  {tab.icon}
                </div>
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};