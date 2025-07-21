/**
 * Security Utilities
 * 
 * This file contains security-related functions for encryption,
 * data protection, and secure operations.
 */

// Remove Node.js crypto imports and use only Web Crypto API or safe browser/Edge-compatible code.
// All cryptographic and random functions should use Web Crypto API (window.crypto or globalThis.crypto).
// Remove any import crypto from 'crypto' and related Node.js-only code.

/**
 * Generate a secure random token using Web Crypto API
 * @param length Length of the token
 * @returns Random token string
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password using Web Crypto API
 * @param password Password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'default-key-for-development-only-change-in-prod');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against hash
 * @param password Password to verify
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if password matches
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

/**
 * Generate a CSRF token
 * @returns CSRF token string
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Validate JWT structure (basic validation)
 * @param token JWT token to validate
 * @returns Boolean indicating if JWT structure is valid
 */
export function validateJWTStructure(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Basic base64 validation
  try {
    parts.forEach(part => {
      // Add padding if needed
      const padded = part + '='.repeat((4 - part.length % 4) % 4);
      atob(padded);
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get security headers for responses
 * @returns Object with security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Session manager for Edge Runtime
 */
export class SessionManager {
  private sessions: Map<string, { userId: string; expires: number }> = new Map();

  createSession(userId: string, duration: number = 24 * 60 * 60 * 1000): string {
    const sessionId = generateSecureToken(32);
    const expires = Date.now() + duration;
    
    this.sessions.set(sessionId, { userId, expires });
    
    // Clean up expired sessions
    this.cleanupExpiredSessions();
    
    return sessionId;
  }

  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    if (Date.now() > session.expires) {
      this.sessions.delete(sessionId);
      return false;
    }
    
    return true;
  }

  getUserId(sessionId: string): string | null {
    const session = this.sessions.get(sessionId);
    if (!session || Date.now() > session.expires) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session.userId;
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expires) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

/**
 * Apply security headers to response
 * @param response Response object
 * @returns Response with security headers
 */
export function applySecurityHeaders(response: any): any {
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Apply CORS headers to response
 * @param response Response object
 * @returns Response with CORS headers
 */
export function applyCorsHeaders(response: any): any {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * Simple rate limiting for Edge Runtime
 * @param request Request object
 * @returns Rate limit response or null
 */
export function rateLimit(request: any): any | null {
  // Simple IP-based rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  // This is a simplified rate limiter - in production you'd use Redis or similar
  // For now, we'll just return null (no rate limiting)
  return null;
}

/**
 * Validate phone number format
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters except + and ()
  const cleaned = phone.replace(/[^\d+()-\s]/g, '');
  
  // Check for minimum length (at least 10 digits)
  const digits = cleaned.replace(/[^\d]/g, '');
  if (digits.length < 10) return false;
  
  // Basic phone number patterns
  const patterns = [
    /^\+\d{10,15}$/, // International format
    /^\(\d{3}\)\s?\d{3}-?\d{4}$/, // US format with parentheses
    /^\d{3}-?\d{3}-?\d{4}$/, // US format with dashes
    /^\d{10,15}$/, // Simple digit format
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input User input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove script tags and dangerous content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<img[^>]*onerror[^>]*>/gi, '')
    .replace(/<[^>]*onclick[^>]*>/gi, '')
    .replace(/<[^>]*onload[^>]*>/gi, '');
}

/**
 * Sanitize HTML content
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Basic HTML sanitization - in production, use a proper HTML sanitizer
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}

/**
 * Sanitize object recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Validate and sanitize data against a schema
 * @param data Data to validate
 * @param schema Schema to validate against
 * @returns Validated and sanitized data
 */
export function validateAndSanitize(data: any, schema?: any): any {
  const sanitized = sanitizeObject(data);
  
  if (schema) {
    try {
      return schema.parse(sanitized);
    } catch (error) {
      throw new Error('Validation failed');
    }
  }
  
  return sanitized;
}

/**
 * Higher-order function to wrap handlers with security features
 * @param handler Request handler function
 * @param options Security options
 * @returns Wrapped handler function
 */
export function withSecurity(
  handler: (request: any) => Promise<any>,
  options: {
    rateLimit?: number;
    cors?: boolean;
    securityHeaders?: boolean;
    validateSchema?: any;
  } = {}
) {
  return async (request: any) => {
    // Apply rate limiting
    if (options.rateLimit) {
      const rateLimitResponse = rateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }

    // Apply CORS headers
    if (options.cors) {
      applyCorsHeaders(request);
    }

    // Validate schema if provided
    if (options.validateSchema) {
      try {
        const data = await request.json();
        validateAndSanitize(data, options.validateSchema);
      } catch (error) {
        return new Response('Invalid data', { status: 400 });
      }
    }

    // Call the original handler
    const response = await handler(request);

    // Apply security headers
    if (options.securityHeaders !== false) {
      applySecurityHeaders(response);
    }

    return response;
  };
}