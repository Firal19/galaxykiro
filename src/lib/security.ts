/**
 * Security Utilities
 * 
 * This file contains security-related functions for encryption,
 * data protection, and secure operations.
 */

import crypto from 'crypto';

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-for-development-only-change-in-prod';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16 bytes
// const AUTH_TAG_LENGTH = ...; // Unused
const SALT_LENGTH = 64;

/**
 * Encrypt sensitive data using AES-256-GCM
 * @param text Plain text to encrypt
 * @returns Encrypted data as base64 string
 */
export function encryptSensitiveData(text: string): string {
  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Generate a random salt
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Create key using PBKDF2
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get the auth tag
    const authTag = cipher.getAuthTag();
    
    // Combine everything into a single string
    // Format: base64(iv):base64(salt):base64(authTag):base64(encrypted)
    const result = [
      iv.toString('base64'),
      salt.toString('base64'),
      authTag.toString('base64'),
      encrypted
    ].join(':');
    
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData Encrypted data as base64 string
 * @returns Decrypted plain text
 */
export function decryptSensitiveData(encryptedData: string): string {
  try {
    // Split the encrypted data into its components
    const [ivBase64, saltBase64, authTagBase64, encryptedText] = encryptedData.split(':');
    
    // Convert base64 strings back to buffers
    const iv = Buffer.from(ivBase64, 'base64');
    const salt = Buffer.from(saltBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    // Recreate the key using PBKDF2
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return ''; // Return empty string on error
  }
}

/**
 * Generate a secure random token
 * @param length Length of the token
 * @returns Random token string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a password using bcrypt-like approach
 * @param password Password to hash
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the password with the salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  // Return the salt and hash together
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 * @param password Password to verify
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if password matches
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  // Extract the salt and hash
  const [salt, originalHash] = hashedPassword.split(':');
  
  // Hash the password with the same salt
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  
  // Compare the hashes
  return hash === originalHash;
}

/**
 * Generate a CSRF token
 * @returns CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate a JWT token structure
 * @param token JWT token to validate
 * @returns Boolean indicating if token structure is valid
 */
export function validateJWTStructure(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Basic structure validation
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    return !!header.alg && !!payload.exp;
  } catch {
    return false;
  }
}

/**
 * Generate security headers for API responses
 * @returns Object containing security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
  };
}

/**
 * Session manager for handling user sessions
 */
export class SessionManager {
  private sessions: Map<string, { userId: string; expires: number }> = new Map();
  
  /**
   * Create a new session
   * @param userId User ID for the session
   * @param duration Session duration in milliseconds (default: 24 hours)
   * @returns Session ID
   */
  createSession(userId: string, duration: number = 24 * 60 * 60 * 1000): string {
    const sessionId = generateSecureToken();
    const expires = Date.now() + duration;
    
    this.sessions.set(sessionId, { userId, expires });
    return sessionId;
  }
  
  /**
   * Validate a session
   * @param sessionId Session ID to validate
   * @returns Boolean indicating if session is valid
   */
  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    if (session.expires < Date.now()) {
      this.sessions.delete(sessionId);
      return false;
    }
    
    return true;
  }
  
  /**
   * Get user ID from session
   * @param sessionId Session ID
   * @returns User ID or null if session is invalid
   */
  getUserId(sessionId: string): string | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.expires < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session.userId;
  }
  
  /**
   * Destroy a session
   * @param sessionId Session ID to destroy
   */
  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
  
  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expires < now) {
        this.sessions.delete(sessionId);
      }
    }
  }
}/**
 * 
Apply security headers to a response
 * @param response NextResponse object
 * @returns NextResponse with security headers
 */
export function applySecurityHeaders(response: any): any {
  const headers = getSecurityHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Apply CORS headers to a response
 * @param response NextResponse object
 * @returns NextResponse with CORS headers
 */
export function applyCorsHeaders(response: any): any {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

/**
 * Rate limiting middleware
 * @param request NextRequest object
 * @returns NextResponse if rate limit is exceeded, null otherwise
 */
export function rateLimit(request: any): any | null {
  // Simple in-memory rate limiting
  // In production, use a more robust solution like Redis
  const ip = request.ip || '127.0.0.1';
  const now = Date.now();
  
  // Store would be replaced with Redis or similar in production
  const rateLimitStore: Map<string, { count: number, resetTime: number }> = new Map();
  
  // Get current rate limit data for this IP
  const rateData = rateLimitStore.get(ip) || { count: 0, resetTime: now + 60000 }; // 1 minute window
  
  // Reset if window has expired
  if (now > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = now + 60000;
  }
  
  // Increment request count
  rateData.count++;
  rateLimitStore.set(ip, rateData);
  
  // Check if rate limit exceeded (100 requests per minute)
  if (rateData.count > 100) {
    const response = new Response('Rate limit exceeded', { status: 429 });
    response.headers.set('Retry-After', '60');
    return response;
  }
  
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
 * Sanitize HTML content to prevent XSS attacks
 * @param html HTML content to sanitize
 * @returns Sanitized HTML content
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
}

/**
 * Sanitize an object by sanitizing all string values
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize input data
 * @param data Data to validate and sanitize
 * @param schema Zod schema for validation
 * @returns Validated and sanitized data
 */
export function validateAndSanitize(data: any, schema?: any): any {
  // Sanitize the data first
  const sanitized = sanitizeObject(data);
  
  // If schema is provided, validate
  if (schema) {
    return schema.parse(sanitized);
  }
  
  return sanitized;
}

/**
 * Security wrapper for API handlers
 * @param handler API handler function
 * @param options Security options
 * @returns Wrapped handler with security features
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
    try {
      // Apply rate limiting
      if (options.rateLimit) {
        const rateLimitResponse = rateLimit(request);
        if (rateLimitResponse) return rateLimitResponse;
      }
      
      // Validate request body if schema provided
      if (options.validateSchema && (request.method === 'POST' || request.method === 'PUT')) {
        try {
          const body = await request.json();
          const validatedBody = validateAndSanitize(body, options.validateSchema);
          // Attach validated body to request
          (request as any).validatedBody = validatedBody;
        } catch (error) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid request data' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Call the original handler
      const response = await handler(request);
      
      // Apply security headers
      if (options.securityHeaders) {
        applySecurityHeaders(response);
      }
      
      // Apply CORS headers
      if (options.cors) {
        applyCorsHeaders(response);
      }
      
      return response;
    } catch (error) {
      console.error('Security wrapper error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}