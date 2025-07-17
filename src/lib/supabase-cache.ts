import { supabase } from '../../lib/supabase';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '../../lib/supabase';

// Cache TTL constants (in seconds)
const CACHE_TTL = {
  ASSESSMENT_RESULTS: 60 * 60, // 1 hour
  USER_SESSION: 30 * 60, // 30 minutes
  CONTENT: 24 * 60 * 60, // 24 hours
  WEBINAR_LISTING: 15 * 60, // 15 minutes
  LEAD_SCORE: 5 * 60, // 5 minutes
  CONTENT_ENGAGEMENT: 10 * 60, // 10 minutes
  OFFICE_LOCATIONS: 24 * 60 * 60, // 24 hours
  WEBINAR_REGISTRATIONS: 15 * 60, // 15 minutes
};

// Cache statistics for monitoring
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastCleanup: number;
}

// Local in-memory cache for frequently accessed data
interface CacheItem<T> {
  data: T;
  expiry: number;
  lastAccessed: number;
}

// Active subscription tracking
interface ActiveSubscription {
  channel: RealtimeChannel;
  table: string;
  filter?: string;
  callback: (payload: unknown) => void;
  lastEvent?: number;
  eventCount: number;
}

class SupabaseCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private activeSubscriptions: Map<string, ActiveSubscription> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    lastCleanup: Date.now()
  };
  
  // Initialize Supabase client with caching options
  initializeClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'Cache-Control': 'max-age=300', // 5 minutes default cache
        },
      },
    });
  }

  // Get assessment results with caching
  async getAssessmentResults(userId: string, toolId: string) {
    const cacheKey = `assessment:${userId}:${toolId}`;
    
    // Check cache first
    const cachedItem = this.getFromCache<any>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }
    
    // If not in cache, fetch from Supabase
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .eq('is_completed', true)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching assessment results:', error);
      return null;
    }
    
    // Store in cache
    this.setInCache(cacheKey, data, CACHE_TTL.ASSESSMENT_RESULTS);
    
    return data;
  }
  
  // Get user session with caching
  async getUserSession(userId: string) {
    const cacheKey = `user:${userId}`;
    
    // Check cache first
    const cachedItem = this.getFromCache<any>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }
    
    // If not in cache, fetch from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user session:', error);
      return null;
    }
    
    // Store in cache
    this.setInCache(cacheKey, data, CACHE_TTL.USER_SESSION);
    
    return data;
  }
  
  // Optimized query for lead scores
  async getLeadScore(userId: string) {
    const cacheKey = `lead_score:${userId}`;
    
    // Check cache first
    const cachedItem = this.getFromCache<any>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }
    
    // If not in cache, fetch from Supabase using the optimized function
    const { data, error } = await supabase.rpc('calculate_lead_score', {
      p_user_id: userId
    });
    
    if (error) {
      console.error('Error calculating lead score:', error);
      return null;
    }
    
    // Store in cache with shorter TTL since scores change frequently
    this.setInCache(cacheKey, data, 5 * 60); // 5 minutes
    
    return data;
  }
  
  // Invalidate cache for a user when their data changes
  invalidateUserCache(userId: string) {
    // Find and remove all cache entries related to this user
    for (const key of this.cache.keys()) {
      if (key.includes(userId)) {
        this.cache.delete(key);
      }
    }
  }
  
  // Helper method to get from cache
  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size = this.cache.size;
      return null;
    }
    
    // Update last accessed time and increment hit count
    item.lastAccessed = Date.now();
    this.stats.hits++;
    
    return item.data as T;
  }
  
  // Helper method to set in cache
  private setInCache<T>(key: string, data: T, ttlSeconds: number) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { 
      data, 
      expiry,
      lastAccessed: Date.now()
    });
    
    this.stats.size = this.cache.size;
    
    // Run cache cleanup if it's been a while
    if (this.cache.size > 100 && Date.now() - this.stats.lastCleanup > 5 * 60 * 1000) {
      this.cleanupCache();
    }
  }
  
  // Clean up old cache entries
  private cleanupCache() {
    const now = Date.now();
    let removedCount = 0;
    
    // Remove expired items
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry || now - item.lastAccessed > 30 * 60 * 1000) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    
    this.stats.lastCleanup = now;
    this.stats.size = this.cache.size;
    
    console.log(`Cache cleanup: removed ${removedCount} items, current size: ${this.stats.size}`);
  }
  
  // Get content with caching
  async getContent(contentId?: string, category?: string, limit: number = 10) {
    const cacheKey = contentId 
      ? `content:${contentId}` 
      : `content:category:${category || 'all'}:${limit}`;
    
    // Check cache first
    const cachedItem = this.getFromCache<any>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }
    
    // If not in cache, fetch from Supabase
    let query = supabase.from('content').select('*');
    
    if (contentId) {
      query = query.eq('id', contentId).single();
    } else if (category) {
      query = query.eq('category', category).limit(limit);
    } else {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching content:', error);
      return null;
    }
    
    // Store in cache
    this.setInCache(cacheKey, data, CACHE_TTL.CONTENT);
    
    return data;
  }
  
  // Get webinars with caching
  async getWebinars(webinarId?: string, limit: number = 10) {
    const cacheKey = webinarId 
      ? `webinar:${webinarId}` 
      : `webinars:${limit}`;
    
    // Check cache first
    const cachedItem = this.getFromCache<any>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }
    
    // If not in cache, fetch from Supabase
    let query = supabase.from('webinars').select('*');
    
    if (webinarId) {
      query = query.eq('id', webinarId).single();
    } else {
      query = query
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching webinars:', error);
      return null;
    }
    
    // Store in cache
    this.setInCache(cacheKey, data, CACHE_TTL.WEBINAR_LISTING);
    
    return data;
  }
  
  // Get office locations with caching
  async getOfficeLocations() {
    const cacheKey = 'office-locations';
    
    // Check cache first
    const cachedItem = this.getFromCache<any>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }
    
    // If not in cache, fetch from Supabase
    const { data, error } = await supabase
      .from('office_locations')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching office locations:', error);
      return null;
    }
    
    // Store in cache with long TTL since office locations rarely change
    this.setInCache(cacheKey, data, CACHE_TTL.OFFICE_LOCATIONS);
    
    return data;
  }
  
  // Get cache statistics
  getCacheStats() {
    return {
      ...this.stats,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      subscriptions: this.activeSubscriptions.size
    };
  }
  
  // Setup real-time subscription management with optimized approach
  setupRealtimeSubscriptions(userId: string, onUserUpdate: (data: unknown) => void) {
    const subscriptionId = `user-updates-${userId}`;
    
    // Check if subscription already exists
    if (this.activeSubscriptions.has(subscriptionId)) {
      return () => this.removeSubscription(subscriptionId);
    }
    
    // Use a single subscription channel for efficiency
    const channel = supabase.channel(subscriptionId);
    
    // Subscribe to user updates
    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`
      }, (payload) => {
        // Invalidate cache
        this.invalidateUserCache(userId);
        
        // Update subscription stats
        const subscription = this.activeSubscriptions.get(subscriptionId);
        if (subscription) {
          subscription.lastEvent = Date.now();
          subscription.eventCount++;
        }
        
        // Call the callback
        onUserUpdate(payload.new);
      })
      .subscribe();
    
    // Store subscription
    this.activeSubscriptions.set(subscriptionId, {
      channel,
      table: 'users',
      filter: `id=eq.${userId}`,
      callback: onUserUpdate,
      lastEvent: Date.now(),
      eventCount: 0
    });
      
    // Return unsubscribe function
    return () => this.removeSubscription(subscriptionId);
  }
  
  // Setup optimized subscription for multiple tables
  setupMultiTableSubscription(
    userId: string, 
    tables: string[], 
    callbacks: Record<string, (data: unknown) => void>
  ) {
    const subscriptionId = `multi-table-${userId}`;
    
    // Check if subscription already exists
    if (this.activeSubscriptions.has(subscriptionId)) {
      return () => this.removeSubscription(subscriptionId);
    }
    
    // Use a single subscription channel for all tables
    const channel = supabase.channel(subscriptionId);
    
    // Subscribe to each table
    tables.forEach(table => {
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Invalidate relevant cache
        if (table === 'users') {
          this.invalidateUserCache(userId);
        } else {
          // Invalidate specific table cache
          for (const key of this.cache.keys()) {
            if (key.includes(table)) {
              this.cache.delete(key);
            }
          }
        }
        
        // Update subscription stats
        const subscription = this.activeSubscriptions.get(subscriptionId);
        if (subscription) {
          subscription.lastEvent = Date.now();
          subscription.eventCount++;
        }
        
        // Call the appropriate callback
        if (callbacks[table]) {
          callbacks[table](payload);
        }
      });
    });
    
    // Subscribe to the channel
    channel.subscribe();
    
    // Store subscription
    this.activeSubscriptions.set(subscriptionId, {
      channel,
      table: tables.join(','),
      callback: () => {}, // No single callback for multi-table
      lastEvent: Date.now(),
      eventCount: 0
    });
    
    // Return unsubscribe function
    return () => this.removeSubscription(subscriptionId);
  }
  
  // Remove subscription
  private removeSubscription(subscriptionId: string) {
    const subscription = this.activeSubscriptions.get(subscriptionId);
    if (subscription) {
      supabase.removeChannel(subscription.channel);
      this.activeSubscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }
  
  // Clean up inactive subscriptions
  cleanupInactiveSubscriptions(maxAgeMinutes: number = 30) {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [id, subscription] of this.activeSubscriptions.entries()) {
      // Remove subscriptions that haven't received events in the specified time
      if (subscription.lastEvent && now - subscription.lastEvent > maxAgeMinutes * 60 * 1000) {
        supabase.removeChannel(subscription.channel);
        this.activeSubscriptions.delete(id);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} inactive subscriptions`);
    }
    
    return removedCount;
  }
}

// Export singleton instance
export const supabaseCache = new SupabaseCache();