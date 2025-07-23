/**
 * Simplified security utilities
 */

/**
 * Encrypt sensitive data (simplified implementation for testing)
 */
export function encryptSensitiveData(data: string): string {
  // Simple base64 encoding for testing (not for production)
  const encoded = Buffer.from(data).toString('base64');
  const key = Buffer.from('test-key').toString('base64');
  const iv = Buffer.from('test-iv').toString('base64');
  const auth = Buffer.from('test-auth').toString('base64');
  return `${encoded}:${key}:${iv}:${auth}`;
}

/**
 * Decrypt sensitive data (simplified implementation for testing)
 */
export function decryptSensitiveData(encryptedData: string): string {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 4) return '';
    const encoded = parts[0];
    return Buffer.from(encoded, 'base64').toString();
  } catch {
    return '';
  }
}

/**
 * Anonymize email for privacy
 */
export function anonymizeEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  
  const [local, domain] = email.split('@');
  if (local.length <= 2) return email;
  
  const visibleChars = 1;
  const hiddenCount = local.length - (visibleChars * 2);
  const stars = '*'.repeat(Math.max(5, hiddenCount)); // Ensure at least 5 stars
  
  return `${local[0]}${stars}${local[local.length - 1]}@${domain}`;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: Response): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
}

/**
 * Apply CORS headers to response
 */
export function applyCorsHeaders(response: Response): void {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Rate limiting middleware
 */
export function rateLimit(request: Request): Response | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!rateLimiter.isAllowed(ip)) {
    return new Response('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60'
      }
    });
  }
  
  return null;
}