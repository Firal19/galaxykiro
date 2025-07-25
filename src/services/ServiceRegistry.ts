/**
 * Service Registry - Central service registration and bootstrapping
 * 
 * Registers all services with the container and provides easy access
 */

import { serviceContainer } from './core/ServiceContainer'
import { AuthService } from './core/AuthService'
import { LeadService } from './business/LeadService'

// Service registration
export function registerServices(): void {
  // Core Services
  serviceContainer.register(
    'AuthService',
    () => new AuthService(),
    { singleton: true }
  )

  serviceContainer.register(
    'LeadService', 
    () => new LeadService(),
    { singleton: true }
  )

  // Additional services will be registered here as we create them
  // serviceContainer.register('UserService', () => new UserService(), { singleton: true })
  // serviceContainer.register('AssessmentService', () => new AssessmentService(), { singleton: true })
  // serviceContainer.register('AnalyticsService', () => new AnalyticsService(), { singleton: true })
}

// Service accessors with type safety
export const Services = {
  get auth(): AuthService {
    return serviceContainer.resolve<AuthService>('AuthService')
  },

  get lead(): LeadService {
    return serviceContainer.resolve<LeadService>('LeadService')
  },

  // Additional services will be added here
  // get user(): UserService {
  //   return serviceContainer.resolve<UserService>('UserService')
  // },
  
  // get assessment(): AssessmentService {
  //   return serviceContainer.resolve<AssessmentService>('AssessmentService')
  // },
  
  // get analytics(): AnalyticsService {
  //   return serviceContainer.resolve<AnalyticsService>('AnalyticsService')
  // }
}

// Initialize services
export function initializeServices(): void {
  try {
    registerServices()
    
    // Warm up singleton services
    Services.auth
    Services.lead
    
    console.log('✅ Services initialized successfully')
    console.log('📋 Registered services:', serviceContainer.getRegisteredServices())
  } catch (error) {
    console.error('❌ Service initialization failed:', error)
    throw error
  }
}

// Health check for all services
export function getServiceHealth(): Record<string, 'healthy' | 'unhealthy' | 'unknown'> {
  return serviceContainer.getHealthStatus()
}

// Cleanup all services
export function disposeServices(): void {
  serviceContainer.dispose()
  console.log('🧹 Services disposed')
}