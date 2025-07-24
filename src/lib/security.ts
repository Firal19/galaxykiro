/**
 * Simplified security utilities
 */

// Simple HTML sanitization (not for production)
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Basic HTML tag removal and entity encoding
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Input validation interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Basic input validation
export function validateInput(input: string, rules: { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp } = {}): ValidationResult {
  const errors: string[] = [];
  
  if (rules.required && (!input || input.trim().length === 0)) {
    errors.push('Input is required');
  }
  
  if (rules.minLength && input.length < rules.minLength) {
    errors.push(`Input must be at least ${rules.minLength} characters`);
  }
  
  if (rules.maxLength && input.length > rules.maxLength) {
    errors.push(`Input must be no more than ${rules.maxLength} characters`);
  }
  
  if (rules.pattern && !rules.pattern.test(input)) {
    errors.push('Input format is invalid');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Basic sanitization - remove dangerous characters
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000); // Limit length
}

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

/**
 * Sanitize object properties
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize input
 */
export function validateAndSanitize(
  input: string, 
  rules: { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp } = {}
): { valid: boolean; sanitized: string; errors: string[] } {
  const validation = validateInput(input, rules);
  const sanitized = sanitizeInput(input);
  
  return {
    valid: validation.isValid,
    sanitized,
    errors: validation.errors
  };
}

/**
 * Security wrapper for API routes
 */
export function withSecurity<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  options: {
    rateLimit?: number;
    cors?: boolean;
    securityHeaders?: boolean;
    validateSchema?: any;
  } = {}
) {
  return async (...args: T): Promise<R> => {
    // For now, just call the handler
    // In a real implementation, you would apply security measures here
    return handler(...args);
  };
}