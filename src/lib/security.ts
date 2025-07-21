/**
 * Security utilities for data encryption, validation, and protection
 */

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-for-development-only-change-in-prod';

// Data types for security operations
interface EncryptionResult {
  encrypted: string;
  iv: string;
}

interface DecryptionResult {
  decrypted: string;
  success: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface SecurityConfig {
  encryptionKey: string;
  algorithm: string;
  keyLength: number;
  ivLength: number;
}

// Security configuration
const securityConfig: SecurityConfig = {
  encryptionKey: ENCRYPTION_KEY,
  algorithm: 'AES-GCM',
  keyLength: 256,
  ivLength: 12
};

/**
 * Encrypt sensitive data
 */
export async function encryptData(data: string): Promise<EncryptionResult> {
  try {
    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(securityConfig.ivLength));
    
    // Import the encryption key
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(securityConfig.encryptionKey),
      { name: securityConfig.algorithm },
      false,
      ['encrypt']
    );
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: securityConfig.algorithm, iv },
      key,
      new TextEncoder().encode(data)
    );
    
    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv))
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt sensitive data
 */
export async function decryptData(encryptedData: string, iv: string): Promise<DecryptionResult> {
  try {
    // Import the encryption key
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(securityConfig.encryptionKey),
      { name: securityConfig.algorithm },
      false,
      ['decrypt']
    );
    
    // Decode the encrypted data and IV
    const encryptedBytes = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    const ivBytes = new Uint8Array(
      atob(iv).split('').map(char => char.charCodeAt(0))
    );
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: securityConfig.algorithm, iv: ivBytes },
      key,
      encryptedBytes
    );
    
    return {
      decrypted: new TextDecoder().decode(decrypted),
      success: true
    };
  } catch (error) {
    console.error('Decryption error:', error);
    return {
      decrypted: '',
      success: false
    };
  }
}

/**
 * Hash sensitive data (one-way encryption)
 */
export async function hashData(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
}

/**
 * Validate user input for security
 */
export function validateInput(input: string, type: 'email' | 'phone' | 'name' | 'general'): ValidationResult {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'string') {
    errors.push('Input is required and must be a string');
    return { isValid: false, errors };
  }
  
  // Remove potentially dangerous characters
  const sanitized = input.replace(/[<>\"'&]/g, '');
  
  if (sanitized !== input) {
    errors.push('Input contains potentially dangerous characters');
  }
  
  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(input.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Invalid phone number format');
      }
      break;
      
    case 'name':
      const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
      if (!nameRegex.test(input)) {
        errors.push('Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes');
      }
      break;
      
    case 'general':
      if (input.length > 1000) {
        errors.push('Input is too long (maximum 1000 characters)');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length);
  }
  
  return result;
}

/**
 * Validate API request
 */
export function validateApiRequest(
  method: string,
  headers: Record<string, string>,
  body?: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];
  
  // Check method
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(method.toUpperCase())) {
    errors.push('Invalid HTTP method');
  }
  
  // Check content type for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    const contentType = headers['content-type'] || headers['Content-Type'];
    if (!contentType || !contentType.includes('application/json')) {
      errors.push('Content-Type must be application/json');
    }
  }
  
  // Validate body if present
  if (body && typeof body !== 'object') {
    errors.push('Request body must be an object');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
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
    
    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
  
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Export user data securely
 */
export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  try {
    // This would typically fetch from database
    const userData = {
      id: userId,
      email: 'user@example.com',
      name: 'John Doe',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        notifications: true
      }
    };
    
    // Encrypt sensitive fields
    const encryptedData = { ...userData };
    if (userData.email) {
      const encrypted = await encryptData(userData.email);
      encryptedData.email = encrypted.encrypted;
    }
    
    return encryptedData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw new Error('Failed to export user data');
  }
}

/**
 * Delete user data securely
 */
export async function deleteUserData(userId: string): Promise<boolean> {
  try {
    // This would typically delete from database
    console.log(`Deleting data for user: ${userId}`);
    
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return false;
  }
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
): ValidationResult {
  const errors: string[] = [];
  
  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  // Check file name for security
  const fileName = file.name.toLowerCase();
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    errors.push('Invalid file name');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate secure password requirements
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter();