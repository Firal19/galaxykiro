'use client'

import { useEffect, useState } from 'react'
import { initPerformanceMonitoring } from '@/lib/analytics/web-vitals'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

export function PerformanceMonitorEnhanced() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    // Only initialize in browser and development mode
    if (typeof window !== 'undefined') {
      initPerformanceMonitoring()

      // Show metrics panel in development
      if (process.env.NODE_ENV === 'development') {
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            setShowMetrics(prev => !prev)
          }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [])

  // Listen for custom performance events
  useEffect(() => {
    const handlePerformanceUpdate = (event: CustomEvent) => {
      const metric = event.detail as PerformanceMetric
      setMetrics(prev => [...prev.slice(-9), metric]) // Keep last 10 metrics
    }

    window.addEventListener('performance-metric', handlePerformanceUpdate as EventListener)
    return () => window.removeEventListener('performance-metric', handlePerformanceUpdate as EventListener)
  }, [])

  if (!showMetrics || process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white text-xs p-3 rounded-lg max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">Performance Metrics</h4>
        <button
          onClick={() => setShowMetrics(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        {metrics.length === 0 ? (
          <p className="text-gray-400">Monitoring performance...</p>
        ) : (
          metrics.slice(-5).map((metric, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="truncate">{metric.name}</span>
              <div className="flex items-center gap-2">
                <span>{Math.round(metric.value)}ms</span>
                <div className={`w-2 h-2 rounded-full ${
                  metric.rating === 'good' ? 'bg-green-500' :
                  metric.rating === 'needs-improvement' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}

// Utility function to emit performance metrics
export function emitPerformanceMetric(
  name: string, 
  value: number, 
  rating: 'good' | 'needs-improvement' | 'poor' = 'good'
) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('performance-metric', {
      detail: { name, value, rating, timestamp: Date.now() }
    })
    window.dispatchEvent(event)
  }
}

// Hook to measure component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const renderTime = performance.now() - startTime
      emitPerformanceMetric(
        `${componentName} render`,
        renderTime,
        renderTime < 16 ? 'good' : renderTime < 50 ? 'needs-improvement' : 'poor'
      )
    }
  }, [componentName])
}