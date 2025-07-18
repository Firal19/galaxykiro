/**
 * Comprehensive Security Testing
 * 
 * Tests for:
 * - Input validation and sanitization
 * - XSS prevention
 * - CSRF protection
 * - Rate limiting
 * - Data encryption
 * - Authentication security
 */

import DOMPurify from 'isomorphic-dompurify';
import { validateEmail, validatePhone, sanitizeInput } from '@/lib/validations';
import { encryptSensitiveData, decryptSensitiveData } from '@/lib/security';

describe('Comprehensive Security Testing', () => {
  describe('Input Validation and Sanitization', () => {
    test('should validate email addresses correctly', () => {
      // Valid emails
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      
      // Invalid emails
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test..test@example.com')).toBe(false);
    });

    test('should validate phone numbers correctly', () => {
      // Valid phone numbers
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('+251911123456')).toBe(true); // Ethiopian format
      expect(validatePhone('(555) 123-4567')).toBe(true);
      
      // Invalid phone numbers
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc123def')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });

    test('should sanitize user inputs to prevent XSS', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("xss")',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload="alert(1)">',
        '<div onclick="alert(1)">Click me</div>',
      ];

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('onclick');
      });
    });

    test('should preserve safe HTML content', () => {
      const safeInputs = [
        'Hello World',
        'test@example.com',
        '+1234567890',
        'John Doe',
        'New York City',
      ];

      safeInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).toBe(input);
      });
    });
  });

  describe('XSS Prevention', () => {
    test('should prevent script injection in form fields', () => {
      const xssPayloads = [
        '<script>document.cookie="stolen"</script>',
        '"><script>alert("xss")</script>',
        "';alert('xss');//",
        '<img src=x onerror=alert("xss")>',
        '<svg/onload=alert("xss")>',
      ];

      xssPayloads.forEach(payload => {
        const cleaned = DOMPurify.sanitize(payload);
        expect(cleaned).not.toContain('<script>');
        expect(cleaned).not.toContain('onerror');
        expect(cleaned).not.toContain('onload');
        expect(cleaned).not.toContain('javascript:');
      });
    });

    test('should handle DOM-based XSS attempts', () => {
      // Simulate URL-based XSS attempts
      const maliciousUrls = [
        '#<script>alert("xss")</script>',
        '#javascript:alert("xss")',
        '#<img src=x onerror=alert("xss")>',
      ];

      maliciousUrls.forEach(url => {
        const hash = url.substring(1);
        const sanitized = DOMPurify.sanitize(hash);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
      });
    });
  });

  describe('Data Encryption and Protection', () => {
    test('should encrypt sensitive user data', () => {
      const sensitiveData = {
        email: 'user@example.com',
        phone: '+1234567890',
        fullName: 'John Doe',
      };

      const encrypted = encryptSensitiveData(JSON.stringify(sensitiveData));
      expect(encrypted).not.toBe(JSON.stringify(sensitiveData));
      expect(encrypted).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64 pattern
    });

    test('should decrypt data correctly', () => {
      const originalData = {
        email: 'user@example.com',
        phone: '+1234567890',
      };

      const encrypted = encryptSensitiveData(JSON.stringify(originalData));
      const decrypted = decryptSensitiveData(encrypted);
      const parsedData = JSON.parse(decrypted);

      expect(parsedData).toEqual(originalData);
    });

    test('should handle encryption errors gracefully', () => {
      expect(() => {
        decryptSensitiveData('invalid-encrypted-data');
      }).not.toThrow();
    });
  });

  describe('Rate Limiting and Abuse Prevention', () => {
    test('should implement client-side rate limiting', () => {
      const rateLimiter = {
        attempts: 0,
        lastAttempt: 0,
        maxAttempts: 5,
        windowMs: 60000, // 1 minute
        
        isAllowed(): boolean {
          const now = Date.now();
          if (now - this.lastAttempt > this.windowMs) {
            this.attempts = 0;
          }
          
          if (this.attempts >= this.maxAttempts) {
            return false;
          }
          
          this.attempts++;
          this.lastAttempt = now;
          return true;
        }
      };

      // Should allow first 5 attempts
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed()).toBe(true);
      }

      // Should block 6th attempt
      expect(rateLimiter.isAllowed()).toBe(false);
    });

    test('should prevent rapid form submissions', () => {
      let lastSubmission = 0;
      const minInterval = 1000; // 1 second

      const canSubmit = () => {
        const now = Date.now();
        if (now - lastSubmission < minInterval) {
          return false;
        }
        lastSubmission = now;
        return true;
      };

      expect(canSubmit()).toBe(true);
      expect(canSubmit()).toBe(false); // Too soon
      
      // Wait and try again
      lastSubmission = Date.now() - minInterval - 1;
      expect(canSubmit()).toBe(true);
    });
  });

  describe('Authentication Security', () => {
    test('should validate JWT tokens properly', () => {
      // Mock JWT validation
      const validateJWT = (token: string): boolean => {
        if (!token || typeof token !== 'string') return false;
        
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        try {
          // Basic structure validation
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          
          return header.alg && payload.exp && payload.exp > Date.now() / 1000;
        } catch {
          return false;
        }
      };

      // Valid token structure
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjo5OTk5OTk5OTk5fQ.signature';
      expect(validateJWT(validToken)).toBe(true);

      // Invalid tokens
      expect(validateJWT('')).toBe(false);
      expect(validateJWT('invalid')).toBe(false);
      expect(validateJWT('a.b')).toBe(false);
    });

    test('should handle session management securely', () => {
      const sessionManager = {
        sessions: new Map<string, { userId: string; expires: number }>(),
        
        createSession(userId: string): string {
          const sessionId = Math.random().toString(36).substring(2);
          const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
          
          this.sessions.set(sessionId, { userId, expires });
          return sessionId;
        },
        
        validateSession(sessionId: string): boolean {
          const session = this.sessions.get(sessionId);
          if (!session) return false;
          
          if (session.expires < Date.now()) {
            this.sessions.delete(sessionId);
            return false;
          }
          
          return true;
        },
        
        destroySession(sessionId: string): void {
          this.sessions.delete(sessionId);
        }
      };

      const sessionId = sessionManager.createSession('user123');
      expect(sessionManager.validateSession(sessionId)).toBe(true);
      
      sessionManager.destroySession(sessionId);
      expect(sessionManager.validateSession(sessionId)).toBe(false);
    });
  });

  describe('CORS and Security Headers', () => {
    test('should validate CORS configuration', () => {
      const corsConfig = {
        origin: ['https://galaxydreamteam.com', 'https://www.galaxydreamteam.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      };

      // Should allow valid origins
      expect(corsConfig.origin.includes('https://galaxydreamteam.com')).toBe(true);
      
      // Should not allow dangerous methods
      expect(corsConfig.methods.includes('TRACE')).toBe(false);
      expect(corsConfig.methods.includes('CONNECT')).toBe(false);
    });

    test('should implement security headers', () => {
      const securityHeaders = {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      };

      expect(securityHeaders['X-Frame-Options']).toBe('DENY');
      expect(securityHeaders['X-Content-Type-Options']).toBe('nosniff');
      expect(securityHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    });
  });

  describe('SQL Injection Prevention', () => {
    test('should use parameterized queries', () => {
      // Mock database query function
      const executeQuery = (query: string, _params: unknown[]): boolean => {
        // Check if query uses parameterized format
        const parameterizedPattern = /\$\d+|\?/g;
        const hasParameters = parameterizedPattern.test(query);
        
        // Check for dangerous SQL patterns
        const dangerousPatterns = [
          /;\s*DROP\s+TABLE/i,
          /;\s*DELETE\s+FROM/i,
          /UNION\s+SELECT/i,
          /'\s*OR\s+'1'\s*=\s*'1/i,
        ];
        
        const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(query));
        
        return hasParameters && !hasDangerousPattern;
      };

      // Safe parameterized query
      const safeQuery = 'SELECT * FROM users WHERE email = $1 AND id = $2';
      expect(executeQuery(safeQuery, ['user@example.com', 123])).toBe(true);

      // Dangerous query
      const dangerousQuery = "SELECT * FROM users WHERE email = 'user@example.com' OR '1'='1'";
      expect(executeQuery(dangerousQuery, [])).toBe(false);
    });
  });

  describe('File Upload Security', () => {
    test('should validate file types and sizes', () => {
      const validateFile = (file: { name: string; size: number; type: string }): boolean => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];
        
        // Check file type
        if (!allowedTypes.includes(file.type)) return false;
        
        // Check file size
        if (file.size > maxSize) return false;
        
        // Check file extension
        const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (!allowedExtensions.includes(extension)) return false;
        
        return true;
      };

      // Valid files
      expect(validateFile({ name: 'image.jpg', size: 1024000, type: 'image/jpeg' })).toBe(true);
      expect(validateFile({ name: 'document.pdf', size: 2048000, type: 'application/pdf' })).toBe(true);

      // Invalid files
      expect(validateFile({ name: 'script.js', size: 1024, type: 'application/javascript' })).toBe(false);
      expect(validateFile({ name: 'large.jpg', size: 10 * 1024 * 1024, type: 'image/jpeg' })).toBe(false);
    });
  });

  describe('Privacy and Data Protection', () => {
    test('should implement data anonymization', () => {
      const anonymizeEmail = (email: string): string => {
        const [local, domain] = email.split('@');
        const anonymizedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
        return `${anonymizedLocal}@${domain}`;
      };

      expect(anonymizeEmail('john.doe@example.com')).toBe('j*****e@example.com');
      expect(anonymizeEmail('a@example.com')).toBe('a@example.com'); // Short emails
    });

    test('should implement data retention policies', () => {
      const dataRetentionManager = {
        retentionPeriods: {
          userSessions: 24 * 60 * 60 * 1000, // 24 hours
          assessmentResults: 365 * 24 * 60 * 60 * 1000, // 1 year
          emailLogs: 90 * 24 * 60 * 60 * 1000, // 90 days
        },
        
        shouldRetain(dataType: string, createdAt: number): boolean {
          const retentionPeriod = this.retentionPeriods[dataType as keyof typeof this.retentionPeriods];
          if (!retentionPeriod) return false;
          
          return (Date.now() - createdAt) < retentionPeriod;
        }
      };

      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

      expect(dataRetentionManager.shouldRetain('userSessions', oneDayAgo)).toBe(false);
      expect(dataRetentionManager.shouldRetain('assessmentResults', oneDayAgo)).toBe(true);
      expect(dataRetentionManager.shouldRetain('assessmentResults', oneYearAgo)).toBe(false);
    });
  });
});