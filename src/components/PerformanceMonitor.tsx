'use client'

import { useEffect } from 'react'
import { initPerformanceMonitoring } from '@/lib/analytics/web-vitals'

export function PerformanceMonitor() {
  useEffect(() => {
    // Only initialize in browser
    if (typeof window !== 'undefined') {
      initPerformanceMonitoring()
    }
  }, [])

  // This component renders nothing
  return null
}