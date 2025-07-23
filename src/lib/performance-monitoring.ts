/**
 * Performance Monitoring System
 * 
 * This module provides real user metrics (RUM) tracking and integration with
 * Netlify Analytics for comprehensive performance monitoring.
 */

import * as Sentry from '@sentry/nextjs';

// Web Vitals for performance metrics
type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
};

// Performance metrics we want to track
export enum PerformanceMetric {
  FCP = 'FCP', // First Contentful Paint
  LCP = 'LCP', // Largest Contentful Paint
  FID = 'FID', // First Input Delay
  CLS = 'CLS', // Cumulative Layout Shift
  TTFB = 'TTFB', // Time to First Byte
  INP = 'INP', // Interaction to Next Paint
}

// Thresholds for good/needs improvement/poor performance
const performanceThresholds = {
  [PerformanceMetric.FCP]: { good: 1800, poor: 3000 }, // milliseconds
  [PerformanceMetric.LCP]: { good: 2500, poor: 4000 }, // milliseconds
  [PerformanceMetric.FID]: { good: 100, poor: 300 }, // milliseconds
  [PerformanceMetric.CLS]: { good: 0.1, poor: 0.25 }, // unitless
  [PerformanceMetric.TTFB]: { good: 800, poor: 1800 }, // milliseconds
  [PerformanceMetric.INP]: { good: 200, poor: 500 }, // milliseconds
};

// Report performance metrics to our analytics systems
export function reportWebVitals(metric: WebVitalsMetric): void {
  // Only run in browser and when analytics is enabled
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
    return;
  }

  const { name, value, id } = metric;

  // Map web-vitals metrics to our enum
  let metricName: PerformanceMetric;
  switch (name) {
    case 'FCP':
      metricName = PerformanceMetric.FCP;
      break;
    case 'LCP':
      metricName = PerformanceMetric.LCP;
      break;
    case 'FID':
      metricName = PerformanceMetric.FID;
      break;
    case 'CLS':
      metricName = PerformanceMetric.CLS;
      break;
    case 'TTFB':
      metricName = PerformanceMetric.TTFB;
      break;
    case 'INP':
      metricName = PerformanceMetric.INP;
      break;
    default:
      return; // Unknown metric, don't report
  }

  // Determine performance category
  const threshold = performanceThresholds[metricName];
  let performanceCategory = 'good';
  if (threshold) {
    if (value > threshold.poor) {
      performanceCategory = 'poor';
    } else if (value > threshold.good) {
      performanceCategory = 'needs-improvement';
    }
  }

  // Report to Sentry as a performance measurement
  try {
    Sentry.metrics.distribution(`web.vitals.${name.toLowerCase()}`, value, {
      unit: name === 'CLS' ? 'none' : 'millisecond',
      tags: {
        page: window.location.pathname,
        performance_category: performanceCategory,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to report performance metric to Sentry:', error);
    }
  }

  // Report to custom endpoint for dashboard visualization
  try {
    const body = JSON.stringify({
      metric: name,
      value,
      id,
      page: window.location.pathname,
      performanceCategory,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      connection: navigator.connection ? {
        effectiveType: (navigator.connection as any).effectiveType,
        downlink: (navigator.connection as any).downlink,
        rtt: (navigator.connection as any).rtt,
      } : null,
    });

    // Use sendBeacon for more reliable delivery that doesn't block page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/.netlify/functions/track-performance', body);
    } else {
      // Fall back to fetch for browsers that don't support sendBeacon
      fetch('/.netlify/functions/track-performance', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true, // Ensure the request completes even if the page unloads
      }).catch(err => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to report performance metric:', err);
        }
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to report performance metric:', error);
    }
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
    return;
  }

  // Register performance observers
  try {
    // Load web-vitals library dynamically to reduce bundle size
    import('web-vitals').then(({ onFCP, onLCP, onFID, onCLS, onTTFB, onINP }) => {
      onFCP(metric => reportWebVitals({ ...metric, name: 'FCP' }));
      onLCP(metric => reportWebVitals({ ...metric, name: 'LCP' }));
      onFID(metric => reportWebVitals({ ...metric, name: 'FID' }));
      onCLS(metric => reportWebVitals({ ...metric, name: 'CLS' }));
      onTTFB(metric => reportWebVitals({ ...metric, name: 'TTFB' }));
      onINP(metric => reportWebVitals({ ...metric, name: 'INP' }));
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to initialize performance monitoring:', error);
    }
    Sentry.captureException(error);
  }
}

// Track custom performance metrics
export function trackCustomPerformance(name: string, duration: number, tags: Record<string, string> = {}): void {
  if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
    return;
  }

  try {
    // Report to Sentry
    Sentry.metrics.distribution(`custom.${name}`, duration, {
      unit: 'millisecond',
      tags: {
        ...tags,
        page: window.location.pathname,
      },
    });

    // Report to custom endpoint
    const body = JSON.stringify({
      metric: `custom.${name}`,
      value: duration,
      page: window.location.pathname,
      tags,
      timestamp: Date.now(),
    });

    fetch('/.netlify/functions/track-performance', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    }).catch(err => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to report custom performance metric:', err);
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to track custom performance:', error);
    }
  }
}

// Performance monitoring hook for React components
export function usePerformanceMonitoring(componentName: string): {
  trackRender: () => void;
  trackInteraction: (interactionName: string) => () => void;
} {
  return {
    trackRender: () => {
      if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
        return;
      }

      const startTime = performance.now();
      
      // Use requestAnimationFrame to measure after the component has rendered
      requestAnimationFrame(() => {
        const duration = performance.now() - startTime;
        trackCustomPerformance(`component.render.${componentName}`, duration, {
          component: componentName,
        });
      });
    },
    
    trackInteraction: (interactionName: string) => {
      if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') {
        return () => {};
      }

      const startTime = performance.now();
      
      return () => {
        const duration = performance.now() - startTime;
        trackCustomPerformance(`interaction.${interactionName}`, duration, {
          component: componentName,
          interaction: interactionName,
        });
      };
    },
  };
}