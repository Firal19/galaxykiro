'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { useSectionSwipeNavigation } from '../lib/hooks/use-swipe-navigation';

interface SwipeSectionNavigatorProps {
  sections: Array<{
    id: string;
    title: string;
    component: React.ReactNode;
  }>;
  initialSection?: string;
  onSectionChange?: (sectionId: string) => void;
  className?: string;
}

export const SwipeSectionNavigator: React.FC<SwipeSectionNavigatorProps> = ({
  sections,
  initialSection,
  onSectionChange,
  className
}) => {
  const [currentSection, setCurrentSection] = useState(initialSection || sections[0]?.id);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sectionIds = sections.map(s => s.id);
  const currentIndex = sectionIds.indexOf(currentSection);
  
  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
    onSectionChange?.(sectionId);
  };

  const { attachSwipeListeners } = useSectionSwipeNavigation(
    sectionIds,
    currentSection,
    handleSectionChange
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    return attachSwipeListeners(container);
  }, [attachSwipeListeners]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Section Content */}
      <div
        ref={containerRef}
        className="relative w-full h-full touch-pan-y"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="flex w-full h-full">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex-shrink-0 w-full h-full"
              style={{ minWidth: '100%' }}
            >
              {section.component}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-200',
              'touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center',
              index === currentIndex
                ? 'bg-growth-500'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
            aria-label={`Go to ${section.title}`}
          >
            <span className="sr-only">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Swipe Indicators */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        {currentIndex > 0 && (
          <div className="flex items-center text-gray-400 animate-pulse">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm ml-1">Swipe</span>
          </div>
        )}
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        {currentIndex < sections.length - 1 && (
          <div className="flex items-center text-gray-400 animate-pulse">
            <span className="text-sm mr-1">Swipe</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};