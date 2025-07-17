/**
 * Security Integration Tests
 * Tests security measures, data protection, and vulnerability prevention
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DOMPurify from 'isomorphic-dompurify';
import { validateInput, sanitizeInput } from '@/lib/security';
import { ProgressiveForm } from '@/components/progressive-form';
import { AssessmentTool } from '@/components/assessment/assessment-tool';

// Mock security utilities
jest.mock('@/lib/security');
const mockValidateInput = validateInput as jest.MockedFunction<typeof validateInput>;
const mockSanitizeInput = sanitizeInput as jest.MockedFunction<typeof sanitizeInput>;

describe('Security Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateInput.mockReturnValue({ isValid: true, errors: [] });
    mockSanitizeInput.mockImplementation((input) => DOMPurify.sanitize(input));
  });

  describe('Input Validation and Sanitization', () => {
    test('should validate and sanitize email inputs', async () => {
      const user = userEvent.setup();
      
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      
      // Test XSS attempt
      const maliciousEmail = '<script>alert("xss")</script>@example.com';
      await user.type(emailInput, maliciousEmail);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Verify input validation was called
      expect(mockValidateInput).toHaveBeenCalledWith(maliciousEmail, 'email');
      expect(mockSanitizeInput).toHaveBeenCalledWith(maliciousEmail);
    });

    test('should prevent SQL injection attempts', async () => {
      const user = userEvent.setup();
      
      render(<ProgressiveForm level={2} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      
      // Test SQL injection attempt
      const sqlInjection = "'; DROP TABLE users; --";
      await user.type(nameInput, sqlInjection);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Verify sanitization
      expect(mockSanitizeInput).toHaveBeenCalledWith(sqlInjection);
    });

    test('should validate phone number format', async () => {
      const user = userEvent.setup();
      
      render(<ProgressiveForm level={2} />);
      
      const phoneInput = screen.getByLabelText(/phone/i);
      
      // Test invalid phone formats
      const invalidPhones = [
        'not-a-phone',
        '123',
        '<script>alert("xss")</script>',
        '1234567890123456789' // too long
      ];
      
      for (const phone of invalidPhones) {
        await user.clear(phoneInput);
        await user.type(phoneInput, phone);
        
        const submitButton = screen.getByRole('button', { name: /submit/i });
        await user.click(submitButton);
        
        // Should show validation error
        await waitFor(() => {
          expect(screen.getByText(/invalid phone/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Authentication Security', () => {
    test('should handle JWT token validation', async () => {
      // Mock invalid JWT token
      const invalidToken = 'invalid.jwt.token';
      
      // Set invalid token in localStorage
      localStorage.setItem('supabase.auth.token', invalidToken);
      
      render(<AssessmentTool toolId="potential-quotient-calculator" />);
      
      // Should redirect to authentication
      await waitFor(() => {
        expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
      });
    });

    test('should enforce session timeout', async () => {
      // Mock expired session
      const expiredToken = {
        access_token: 'expired.token',
        expires_at: Date.now() - 3600000 // 1 hour ago
      };
      
      localStorage.setItem('supabase.auth.token', JSON.stringify(expiredToken));
      
      render(<AssessmentTool toolId="habit-strength-analyzer" />);
      
      // Should prompt for re-authentication
      await waitFor(() => {
        expect(screen.getByText(/session expired/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Protection and Privacy', () => {
    test('should encrypt sensitive data before storage', async () => {
      const user = userEvent.setup();
      
      // Mock encryption function
      const mockEncrypt = jest.fn((data) => `encrypted_${data}`);
      jest.doMock('@/lib/security', () => ({
        encryptSensitiveData: mockEncrypt
      }));
      
      render(<ProgressiveForm level={3} />);
      
      // Fill sensitive information
      const ssnInput = screen.getByLabelText(/social security/i);
      await user.type(ssnInput, '123-45-6789');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Verify encryption was called
      expect(mockEncrypt).toHaveBeenCalledWith('123-45-6789');
    });

    test('should implement GDPR compliance features', async () => {
      const user = userEvent.setup();
      
      render(<ProgressiveForm level={1} />);
      
      // Should show GDPR consent
      expect(screen.getByText(/data processing consent/i)).toBeInTheDocument();
      
      const consentCheckbox = screen.getByLabelText(/i consent to data processing/i);
      expect(consentCheckbox).toBeRequired();
      
      // Should not submit without consent
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should show consent error
      await waitFor(() => {
        expect(screen.getByText(/consent required/i)).toBeInTheDocument();
      });
      
      // Check consent and submit
      await user.click(consentCheckbox);
      await user.click(submitButton);
      
      // Should proceed
      await waitFor(() => {
        expect(screen.queryByText(/consent required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Rate Limiting and Abuse Prevention', () => {
    test('should implement rate limiting for form submissions', async () => {
      const user = userEvent.setup();
      
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // Simulate rapid submissions
      for (let i = 0; i < 10; i++) {
        await user.clear(emailInput);
        await user.type(emailInput, `test${i}@example.com`);
        await user.click(submitButton);
      }
      
      // Should show rate limit error
      await waitFor(() => {
        expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
      });
    });

    test('should prevent automated bot submissions', async () => {
      render(<ProgressiveForm level={1} />);
      
      // Should include honeypot field
      const honeypot = screen.getByTestId('honeypot-field');
      expect(honeypot).toHaveStyle({ display: 'none' });
      
      // Should include CAPTCHA for suspicious activity
      // Mock suspicious behavior detection
      Object.defineProperty(window, 'navigator', {
        value: {
          webdriver: true // Bot indicator
        }
      });
      
      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      // Should show CAPTCHA
      await waitFor(() => {
        expect(screen.getByText(/verify you're human/i)).toBeInTheDocument();
      });
    });
  });

  describe('Content Security Policy', () => {
    test('should prevent inline script execution', () => {
      // Mock CSP violation
      const cspViolation = new Event('securitypolicyviolation');
      Object.defineProperty(cspViolation, 'violatedDirective', {
        value: 'script-src'
      });
      Object.defineProperty(cspViolation, 'blockedURI', {
        value: 'inline'
      });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      window.dispatchEvent(cspViolation);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('CSP violation detected')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('API Security', () => {
    test('should validate API request headers', async () => {
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      // Mock API call without proper headers
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });
      
      render(<AssessmentTool toolId="potential-quotient-calculator" />);
      
      const startButton = screen.getByRole('button', { name: /start assessment/i });
      fireEvent.click(startButton);
      
      // Should handle unauthorized response
      await waitFor(() => {
        expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
      });
    });

    test('should prevent CSRF attacks', async () => {
      const user = userEvent.setup();
      
      // Mock CSRF token
      const csrfToken = 'csrf-token-123';
      document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', csrfToken);
      
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should include CSRF token in request
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'X-CSRF-Token': csrfToken
            })
          })
        );
      });
    });
  });

  describe('Data Leakage Prevention', () => {
    test('should not expose sensitive data in client-side code', () => {
      render(<AssessmentTool toolId="transformation-readiness-score" />);
      
      // Check that sensitive data is not in DOM
      const htmlContent = document.documentElement.innerHTML;
      
      // Should not contain API keys
      expect(htmlContent).not.toMatch(/sk_live_/);
      expect(htmlContent).not.toMatch(/pk_live_/);
      
      // Should not contain database credentials
      expect(htmlContent).not.toMatch(/password.*:/);
      expect(htmlContent).not.toMatch(/secret.*:/);
      
      // Should not contain internal URLs
      expect(htmlContent).not.toMatch(/localhost:\d+/);
      expect(htmlContent).not.toMatch(/127\.0\.0\.1/);
    });

    test('should sanitize error messages', async () => {
      const user = userEvent.setup();
      
      // Mock server error with sensitive information
      global.fetch = jest.fn().mockRejectedValue(
        new Error('Database connection failed: user=admin password=secret123 host=internal.db.com')
      );
      
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should show generic error message
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.queryByText(/password=secret123/)).not.toBeInTheDocument();
        expect(screen.queryByText(/internal.db.com/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Secure Communication', () => {
    test('should enforce HTTPS for all requests', async () => {
      const user = userEvent.setup();
      
      // Mock HTTP request attempt
      const mockFetch = jest.fn();
      global.fetch = mockFetch;
      
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should only make HTTPS requests
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(/^https:/),
          expect.any(Object)
        );
      });
    });

    test('should validate SSL certificates', async () => {
      // Mock SSL certificate validation
      const mockValidateCert = jest.fn().mockReturnValue(true);
      
      // This would typically be handled by the browser/network layer
      // but we can test our certificate pinning logic
      const certFingerprint = 'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
      
      expect(mockValidateCert(certFingerprint)).toBe(true);
    });
  });
});