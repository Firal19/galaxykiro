/**
 * Input validation utilities
 */

/**
 * Validate email address format
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
 * Validate password strength
 * @param password Password to validate
 * @returns Object with validation result and requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      }
    };
  }

  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isValid = Object.values(requirements).every(req => req);

  return { isValid, requirements };
}

/**
 * Validate URL format
 * @param url URL to validate
 * @returns Boolean indicating if URL is valid
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate name format (no special characters, reasonable length)
 * @param name Name to validate
 * @returns Boolean indicating if name is valid
 */
export function validateName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
}

/**
 * Validate city name format
 * @param city City name to validate
 * @returns Boolean indicating if city is valid
 */
export function validateCity(city: string): boolean {
  if (!city || typeof city !== 'string') return false;
  
  // Allow letters, spaces, hyphens, and common city name characters
  const cityRegex = /^[a-zA-Z\s'-.,]{2,100}$/;
  return cityRegex.test(city.trim());
}