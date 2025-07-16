'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SwipeConfig {
  threshold?: number; // Minimum distance for swipe
  velocity?: number;  // Minimum velocity for swipe
  preventScroll?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeNavigation = (config: SwipeConfig = {}) => {
  const {
    threshold = 50,
    velocity = 0.3,
    preventScroll = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = config;

  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    touchEnd.current = null;
    setIsTracking(true);
    
    if (preventScroll) {
      e.preventDefault();
    }
  }, [preventScroll]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    if (preventScroll) {
      e.preventDefault();
    }
  }, [preventScroll]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current || !touchEnd.current) {
      setIsTracking(false);
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const swipeVelocity = distance / deltaTime;

    // Check if swipe meets threshold and velocity requirements
    if (distance < threshold || swipeVelocity < velocity) {
      setIsTracking(false);
      return;
    }

    // Determine swipe direction
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    setIsTracking(false);
    
    if (preventScroll) {
      e.preventDefault();
    }
  }, [threshold, velocity, preventScroll, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const attachSwipeListeners = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventScroll });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll]);

  return {
    attachSwipeListeners,
    isTracking
  };
};

// Hook for section navigation
export const useSectionSwipeNavigation = (sections: string[], currentSection: string, onSectionChange: (section: string) => void) => {
  const currentIndex = sections.indexOf(currentSection);
  
  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < sections.length - 1) {
      onSectionChange(sections[currentIndex + 1]);
    }
  }, [currentIndex, sections, onSectionChange]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex > 0) {
      onSectionChange(sections[currentIndex - 1]);
    }
  }, [currentIndex, sections, onSectionChange]);

  return useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 75,
    velocity: 0.4
  });
};