/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client with proper configuration
 * for authentication, database access, and real-time subscriptions.
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton pattern to prevent multiple GoTrueClient instances
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = (() => {
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseClient;
})();

// Cache for optimizing repeated queries
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Cached query function to optimize repeated database calls
 * @param queryFn Function that performs the actual Supabase query
 * @param cacheKey Unique key to identify this query in cache
 * @param ttl Time-to-live for cache entry in milliseconds
 */
export async function cachedQuery<T>(
  queryFn: () => Promise<{ data: T; error: any }>,
  cacheKey: string,
  ttl: number = CACHE_TTL
): Promise<{ data: T | null; error: any }> {
  const cached = queryCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return { data: cached.data, error: null };
  }
  
  const result = await queryFn();
  
  if (!result.error && result.data) {
    queryCache.set(cacheKey, {
      data: result.data,
      timestamp: Date.now(),
    });
  }
  
  return result;
}

/**
 * Clear cache entries for specific keys or patterns
 * @param pattern String or RegExp to match cache keys
 */
export function clearCache(pattern?: string | RegExp): void {
  if (!pattern) {
    queryCache.clear();
    return;
  }
  
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  
  for (const key of queryCache.keys()) {
    if (regex.test(key)) {
      queryCache.delete(key);
    }
  }
}

/**
 * Get user session with automatic refresh handling
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Get current user with profile data
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, error };
  }
  
  // Get additional profile data
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return { 
    user: { 
      ...user, 
      profile 
    }, 
    error: null 
  };
}

/**
 * Setup real-time subscription for user data changes
 * @param userId User ID to subscribe to
 * @param callback Function to call when data changes
 */
export function subscribeToUserChanges(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`user-${userId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
      filter: `id=eq.${userId}`
    }, callback)
    .subscribe();
}

export default supabase;