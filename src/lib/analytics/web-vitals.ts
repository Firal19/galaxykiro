'use client'

import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals'

// Web Vitals thresholds (Google's recommendations)
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint (replaces FID)
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
}

type VitalName = keyof typeof VITALS_THRESHOLDS
type VitalRating = 'good' | 'needs-improvement' | 'poor'

interface VitalData extends Metric {
  rating: VitalRating
  url: string
  userAgent: string
  timestamp: number
}

// Rate vital based on thresholds
function rateVital(name: VitalName, value: number): VitalRating {
  const thresholds = VITALS_THRESHOLDS[name]
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

// Send vital data to analytics endpoint
function sendToAnalytics(vital: VitalData) {
  // In development, just log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', {
      name: vital.name,
      value: Math.round(vital.value),
      rating: vital.rating,
      delta: Math.round(vital.delta),
      id: vital.id.slice(-8),
    })
    return
  }

  // Send to analytics service in production
  try {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', vital.name, {
        value: Math.round(vital.value),
        metric_rating: vital.rating,
        metric_delta: Math.round(vital.delta),
        metric_id: vital.id,
      })
    }

    // Example: Custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vital),
    }).catch(console.error)

    // Example: Sentry performance monitoring
    if (typeof Sentry !== 'undefined') {
      Sentry.addBreadcrumb({
        message: `Web Vital: ${vital.name}`,
        level: vital.rating === 'poor' ? 'warning' : 'info',
        data: {
          value: vital.value,
          rating: vital.rating,
          delta: vital.delta,
        },
      })
    }
  } catch (error) {
    console.error('Failed to send web vital:', error)
  }
}

// Handle metric collection
function handleMetric(metric: Metric) {
  const vitalData: VitalData = {
    ...metric,
    rating: rateVital(metric.name as VitalName, metric.value),
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  }

  sendToAnalytics(vitalData)
}

// Initialize web vitals monitoring
export function initWebVitals() {
  try {
    // Core Web Vitals
    onCLS(handleMetric)
    onINP(handleMetric) // Interaction to Next Paint (replaces FID)
    onLCP(handleMetric)
    
    // Additional metrics
    onFCP(handleMetric)
    onTTFB(handleMetric)
    
    console.log('✅ Web Vitals monitoring initialized')
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error)
  }
}

// Performance observer for custom metrics
export function observePerformance() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return
  }

  try {
    // Long tasks observer (tasks > 50ms)
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          console.warn('🐌 Long task detected:', {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
            name: entry.name,
          })
          
          // Send to analytics
          sendToAnalytics({
            name: 'long-task',
            value: entry.duration,
            delta: entry.duration,
            id: `long-task-${Date.now()}`,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          } as VitalData)
        }
      })
    })
    
    longTaskObserver.observe({ entryTypes: ['longtask'] })

    // Layout shift observer
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.hadRecentInput) return // Ignore shifts from user input
        
        if (entry.value > 0.1) {
          console.warn('📐 Layout shift detected:', {
            value: entry.value.toFixed(4),
            sources: entry.sources?.length || 0,
          })
        }
      })
    })
    
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })

    // Resource timing observer
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        // Monitor slow resources (> 1s)
        if (entry.duration > 1000) {
          console.warn('🐌 Slow resource:', {
            name: entry.name.split('/').pop(),
            duration: Math.round(entry.duration),
            size: entry.transferSize,
            type: entry.initiatorType,
          })
        }
      })
    })
    
    resourceObserver.observe({ entryTypes: ['resource'] })

  } catch (error) {
    console.error('Failed to set up performance observers:', error)
  }
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return
  }

  const memory = (performance as any).memory
  if (!memory) return

  const memoryInfo = {
    usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
    totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
    jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
  }

  // Warn if memory usage is high
  const usagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100
  
  if (usagePercent > 80) {
    console.warn('🧠 High memory usage:', {
      ...memoryInfo,
      usagePercent: Math.round(usagePercent),
    })
  }

  return memoryInfo
}

// Initialize all performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Initialize web vitals
  initWebVitals()
  
  // Set up performance observers
  observePerformance()
  
  // Monitor memory usage periodically
  setInterval(monitorMemoryUsage, 30000) // Every 30 seconds
  
  // Log initial memory usage
  setTimeout(() => {
    const memory = monitorMemoryUsage()
    if (memory) {
      console.log('🧠 Initial memory usage:', memory)
    }
  }, 1000)
}

// Export for use in _app.tsx or layout.tsx
export { handleMetric as reportWebVitals }