/**
 * Validation Utilities
 * 
 * This file contains validation functions for form inputs,
 * data sanitization, and security checks.
 */

import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

/**
 * Email validation using regex pattern
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation with international format support
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export function validatePhone(phone: string): boolean {
  // Support various formats including international
  // More flexible regex to support various international formats
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{1,4})\)?[- ]?([0-9]{1,5})[- ]?([0-9]{1,9})$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input User input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  // Configure DOMPurify to block javascript: URLs
  const config = {
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  };
  
  // Apply sanitization with config
  return DOMPurify.sanitize(input, config);
}

/**
 * Validate URL for security
 * @param url URL to validate
 * @returns Boolean indicating if URL is safe
 */
export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
}

/**
 * Zod schema for email validation
 */
export const emailSchema = z.string().email({
  message: "Invalid email address format"
});

/**
 * Zod schema for phone validation
 */
export const phoneSchema = z.string().refine(validatePhone, {
  message: "Invalid phone number format"
});

/**
 * Zod schema for Level 1 capture (email only)
 */
export const level1Schema = z.object({
  email: emailSchema
});

/**
 * Zod schema for Level 2 capture (email + phone)
 */
export const level2Schema = z.object({
  email: emailSchema,
  phone: phoneSchema
});

/**
 * Zod schema for Level 3 capture (full profile)
 */
export const level3Schema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters")
});

/**
 * Validate form data against appropriate schema based on level
 * @param data Form data to validate
 * @param level Capture level (1, 2, or 3)
 * @returns Validation result with success flag and optional errors
 */
export function validateFormData(data: unknown, level: 1 | 2 | 3) {
  let schema;
  
  switch (level) {
    case 1:
      schema = level1Schema;
      break;
    case 2:
      schema = level2Schema;
      break;
    case 3:
      schema = level3Schema;
      break;
    default:
      schema = level1Schema;
  }
  
  try {
    schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.reduce((acc, curr) => {
          const field = curr.path[0] as string;
          acc[field] = curr.message;
          return acc;
        }, {} as Record<string, string>)
      };
    }
    return { success: false, errors: { form: 'Validation failed' } };
  }
}

/**
 * Rate limiting utility to prevent abuse
 */
export class RateLimiter {
  private attempts: number = 0;
  private lastAttempt: number = 0;
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  isAllowed(): boolean {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.lastAttempt > this.windowMs) {
      this.attempts = 0;
    }
    
    // Check if max attempts reached
    if (this.attempts >= this.maxAttempts) {
      return false;
    }
    
    // Increment counter and update timestamp
    this.attempts++;
    this.lastAttempt = now;
    return true;
  }
  
  reset(): void {
    this.attempts = 0;
  }
}

/**
 * Debounce function to limit rapid submissions
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validate file upload for security
 * @param file File object to validate
 * @param allowedTypes Array of allowed MIME types
 * @param maxSize Maximum file size in bytes
 * @returns Boolean indicating if file is valid
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): boolean {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  
  // Check file size
  if (file.size > maxSize) {
    return false;
  }
  
  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
  if (!allowedExtensions.includes(extension)) {
    return false;
  }
  
  return true;
}

/**
 * Anonymize email for privacy
 * @param email Email to anonymize
 * @returns Anonymized email
 */
export function anonymizeEmail(email: string): string {
  const [local, domain] = email.split('@');
  
  if (local.length <= 2) {
    return email; // Too short to anonymize
  }
  
  // Use exactly 5 asterisks for consistency with tests
  const anonymizedLocal = local.charAt(0) + '*****' + local.charAt(local.length - 1);
  return `${anonymizedLocal}@${domain}`;
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result and strength score
 */
export function validatePassword(password: string): { valid: boolean; score: number; message: string } {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let score = 0;
  let message = '';
  
  if (password.length >= minLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChars) score++;
  
  const valid = password.length >= minLength && score >= 3;
  
  if (!valid) {
    message = 'Password must be at least 8 characters and include 3 of the following: uppercase letters, lowercase letters, numbers, special characters';
  } else if (score < 5) {
    message = 'Password is acceptable but could be stronger';
  } else {
    message = 'Strong password';
  }
  
  return { valid, score, message };
}