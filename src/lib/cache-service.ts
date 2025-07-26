'use client'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 100
  
  // Set cache item with TTL (time to live in ms)
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  // Get cache item if not expired
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  // Remove specific cache item
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  // Clear all cache
  clear(): void {
    this.cache.clear()
  }
  
  // Get cache size
  size(): number {
    return this.cache.size
  }
  
  // Clean expired items
  cleanExpired(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
  
  // Get cache stats
  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0
    
    for (const item of this.cache.values()) {
      if (now - item.timestamp > item.ttl) {
        expired++
      } else {
        valid++
      }
    }
    
    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize
    }
  }
}

// Singleton instance
export const cacheService = new CacheService()

// Browser storage cache for persistence
export class StorageCache {
  private prefix: string
  
  constructor(prefix: string = 'gk_cache_') {
    this.prefix = prefix
  }
  
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    if (typeof window === 'undefined') return
    
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error)
    }
  }
  
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    
    try {
      const itemStr = localStorage.getItem(this.prefix + key)
      if (!itemStr) return null
      
      const item = JSON.parse(itemStr)
      
      // Check if expired
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(this.prefix + key)
        return null
      }
      
      return item.data
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error)
      return null
    }
  }
  
  delete(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.prefix + key)
  }
  
  clear(): void {
    if (typeof window === 'undefined') return
    
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.prefix)
    )
    
    keys.forEach(key => localStorage.removeItem(key))
  }
  
  cleanExpired(): void {
    if (typeof window === 'undefined') return
    
    const now = Date.now()
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.prefix)
    )
    
    keys.forEach(key => {
      try {
        const itemStr = localStorage.getItem(key)
        if (!itemStr) return
        
        const item = JSON.parse(itemStr)
        if (now - item.timestamp > item.ttl) {
          localStorage.removeItem(key)
        }
      } catch (error) {
        // Remove corrupted items
        localStorage.removeItem(key)
      }
    })
  }
}

// Persistent storage cache instance
export const storageCache = new StorageCache()

// Auto-cleanup expired items every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanExpired()
    storageCache.cleanExpired()
  }, 5 * 60 * 1000)
}