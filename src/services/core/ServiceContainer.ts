/**
 * Service Container - Dependency Injection Container
 * 
 * Provides centralized service registration and resolution
 * with lifecycle management and environment-specific configuration
 */

interface ServiceDefinition<T = any> {
  factory: (...args: any[]) => T
  singleton?: boolean
  dependencies?: string[]
  instance?: T
}

interface ServiceConfig {
  environment: 'development' | 'production' | 'test'
  logging: boolean
  monitoring: boolean
}

export class ServiceContainer {
  private static instance: ServiceContainer
  private services: Map<string, ServiceDefinition> = new Map()
  private config: ServiceConfig
  private logger: (message: string, level?: 'info' | 'warn' | 'error') => void

  private constructor(config: ServiceConfig) {
    this.config = config
    this.logger = this.createLogger()
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: ServiceConfig): ServiceContainer {
    if (!ServiceContainer.instance) {
      const defaultConfig: ServiceConfig = {
        environment: (process.env.NODE_ENV as any) || 'development',
        logging: process.env.NODE_ENV === 'development',
        monitoring: process.env.NODE_ENV === 'production'
      }
      ServiceContainer.instance = new ServiceContainer(config || defaultConfig)
    }
    return ServiceContainer.instance
  }

  /**
   * Register a service
   */
  public register<T>(
    name: string, 
    factory: (...args: any[]) => T, 
    options: {
      singleton?: boolean
      dependencies?: string[]
    } = {}
  ): void {
    const { singleton = true, dependencies = [] } = options

    if (this.services.has(name)) {
      this.logger(`Service '${name}' is already registered. Overwriting...`, 'warn')
    }

    this.services.set(name, {
      factory,
      singleton,
      dependencies,
      instance: undefined
    })

    this.logger(`Registered service: ${name}`, 'info')
  }

  /**
   * Resolve a service by name
   */
  public resolve<T>(name: string): T {
    const service = this.services.get(name)
    
    if (!service) {
      throw new Error(`Service '${name}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`)
    }

    // Return singleton instance if it exists
    if (service.singleton && service.instance) {
      return service.instance as T
    }

    // Resolve dependencies first
    const dependencies = service.dependencies.map(dep => this.resolve(dep))

    try {
      // Create new instance
      const instance = service.factory(...dependencies)

      // Store singleton instance
      if (service.singleton) {
        service.instance = instance
      }

      this.logger(`Resolved service: ${name}`, 'info')
      return instance as T
    } catch (error) {
      this.logger(`Failed to resolve service '${name}': ${error}`, 'error')
      throw error
    }
  }

  /**
   * Check if service is registered
   */
  public has(name: string): boolean {
    return this.services.has(name)
  }

  /**
   * Get all registered service names
   */
  public getRegisteredServices(): string[] {
    return Array.from(this.services.keys())
  }

  /**
   * Clear all services (useful for testing)
   */
  public clear(): void {
    this.services.clear()
    this.logger('Cleared all services', 'info')
  }

  /**
   * Dispose of singleton instances
   */
  public dispose(): void {
    for (const [name, service] of this.services) {
      if (service.instance && typeof service.instance.dispose === 'function') {
        try {
          service.instance.dispose()
          this.logger(`Disposed service: ${name}`, 'info')
        } catch (error) {
          this.logger(`Failed to dispose service '${name}': ${error}`, 'error')
        }
      }
      service.instance = undefined
    }
  }

  /**
   * Get service health status
   */
  public getHealthStatus(): Record<string, 'healthy' | 'unhealthy' | 'unknown'> {
    const status: Record<string, 'healthy' | 'unhealthy' | 'unknown'> = {}

    for (const [name, service] of this.services) {
      if (service.instance) {
        if (typeof service.instance.getHealth === 'function') {
          try {
            status[name] = service.instance.getHealth() ? 'healthy' : 'unhealthy'
          } catch {
            status[name] = 'unhealthy'
          }
        } else {
          status[name] = 'healthy' // Assume healthy if no health check
        }
      } else {
        status[name] = 'unknown' // Not instantiated yet
      }
    }

    return status
  }

  /**
   * Create logger based on configuration
   */
  private createLogger() {
    return (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
      if (!this.config.logging) return

      const timestamp = new Date().toISOString()
      const prefix = `[ServiceContainer ${timestamp}]`

      switch (level) {
        case 'error':
          console.error(`${prefix} ERROR: ${message}`)
          break
        case 'warn':
          console.warn(`${prefix} WARN: ${message}`)
          break
        default:
          console.log(`${prefix} INFO: ${message}`)
      }
    }
  }
}

// Export singleton instance
export const serviceContainer = ServiceContainer.getInstance()