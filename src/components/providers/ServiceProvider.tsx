/**
 * Service Provider - Initialize services for the application
 * 
 * Provides service initialization and error boundaries
 */

"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { initializeServices, Services, getServiceHealth, disposeServices } from '@/services/ServiceRegistry'

interface ServiceContextType {
  services: typeof Services
  isInitialized: boolean
  error: string | null
  healthStatus: Record<string, 'healthy' | 'unhealthy' | 'unknown'>
}

const ServiceContext = createContext<ServiceContextType | null>(null)

interface ServiceProviderProps {
  children: ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [healthStatus, setHealthStatus] = useState<Record<string, 'healthy' | 'unhealthy' | 'unknown'>>({})

  useEffect(() => {
    const initServices = async () => {
      try {
        initializeServices()
        setIsInitialized(true)
        setHealthStatus(getServiceHealth())
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Service initialization failed'
        setError(errorMessage)
        console.error('ServiceProvider initialization error:', err)
      }
    }

    initServices()

    // Cleanup on unmount
    return () => {
      disposeServices()
    }
  }, [])

  // Health check interval
  useEffect(() => {
    if (!isInitialized) return

    const healthCheckInterval = setInterval(() => {
      setHealthStatus(getServiceHealth())
    }, 30000) // Check every 30 seconds

    return () => clearInterval(healthCheckInterval)
  }, [isInitialized])

  const contextValue: ServiceContextType = {
    services: Services,
    isInitialized,
    error,
    healthStatus
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing services...</p>
        </div>
      </div>
    )
  }

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  )
}

// Hook to use services
export function useServices(): ServiceContextType {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider')
  }
  return context
}

// Individual service hooks for convenience
export function useAuthService() {
  const { services } = useServices()
  return services.auth
}

export function useLeadService() {
  const { services } = useServices()
  return services.lead
}