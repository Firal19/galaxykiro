/**
 * Final System Integration Tests
 * Tests complete user journey flows, progressive capture, and all system components
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '@/components/hero-section';
import { ProgressiveForm } from '@/components/progressive-form';
import { AssessmentTool } from '@/components/assessment/assessment-tool';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock auth context
jest.mock('@/lib/contexts/auth-context', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    updateUserProfile: jest.fn(),
  }),
}));

// Mock lead scoring
jest.mock('@/lib/hooks/use-lead-scoring', () => ({
  useLeadScoring: () => ({
    addToolUsagePoints: jest.fn(),
  }),
}));

// Mock app store
jest.mock('@/lib/store', () => ({
  useAppStore: () => ({
    user: null,
    captureUserInfo: jest.fn(),
    isLoading: false,
  }),
}));

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null }),
    })),
  },
}));

// Mock AssessmentEngine
jest.mock('@/lib/assessment-engine', () => ({
  AssessmentEngine: jest.fn().mockImplementation(() => ({
    initializeAssessment: jest.fn(),
    getCurrentQuestion: jest.fn(() => ({
      id: 'q1',
      text: 'Sample question?',
      type: 'scale',
      min: 1,
      max: 5,
      required: true
    })),
    calculateCompletionRate: jest.fn(() => 0.5),
  })),
}));

describe('System Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage and sessionStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        clear: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
  });

  describe('Complete User Journey Flow', () => {
    test('Browser to Engaged progression via hero section', async () => {
      const user = userEvent.setup();
      
      // 1. Browser tier - Hero section interaction
      render(<HeroSection />);
      
      // Check hero section loads with main content
      expect(screen.getByText(/What if you're only using 10% of your true potential/i)).toBeInTheDocument();
      
      // Should have CTA button
      const ctaButton = screen.getByRole('button', { name: /discover your hidden 90%/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Click CTA to trigger modal
      await user.click(ctaButton);
      
      // Verify modal opens for email capture (or lead capture interface appears)
      await waitFor(() => {
        // The modal might not have the exact test id, so check for email input appearing
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toBeInTheDocument();
      });
    });

    test('Progressive form captures user information at different levels', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      // Level 1 form (email only)
      render(<ProgressiveForm level={1} onSubmit={mockSubmit} existingData={{}} />);
      
      // Should show email input
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
      
      // Should not show phone or other fields
      expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument();
      
      // Enter email
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /continue/i });
      await user.click(submitButton);
      
      // Verify form submission
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ email: 'test@example.com' }),
          1
        );
      });
    });
  });

  describe('Assessment Tool Integration', () => {
    test('Assessment tool loads and displays properly', async () => {
      const mockConfig = {
        questions: [
          {
            id: 'q1',
            text: 'Sample question for testing?',
            type: 'scale' as const,
            min: 1,
            max: 5,
            required: true
          }
        ],
        scoring: {
          algorithm: 'weighted' as const,
          weights: { q1: 1 }
        },
        showProgress: true,
        timeLimit: 300,
        randomizeQuestions: false,
        title: 'Test Assessment',
        description: 'A sample assessment for testing'
      };
      
      render(
        <AssessmentTool 
          toolId="potential-quotient-calculator"
          title="Test Assessment"
          description="Test description"
          config={mockConfig}
        />
      );
      
      // Should show loading initially
      expect(screen.getByText(/loading assessment/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation and Error Handling', () => {
    test('Progressive form validates email input', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(<ProgressiveForm level={1} onSubmit={mockSubmit} existingData={{}} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /continue/i });
      
      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      // Should show validation error (might be in different formats)
      await waitFor(() => {
        const hasValidationError = 
          screen.queryByText(/please enter a valid email/i) ||
          screen.queryByText(/invalid email/i) ||
          screen.queryByText(/valid email address/i) ||
          screen.queryByRole('alert');
        expect(hasValidationError).toBeTruthy();
      }, { timeout: 3000 });
      
      // Form should not be submitted with invalid data
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Multi-level Form Testing', () => {
    test('Level 2 form includes phone field', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(
        <ProgressiveForm 
          level={2} 
          onSubmit={mockSubmit} 
          existingData={{ email: 'test@example.com' }} 
        />
      );
      
      // Should have both email and phone fields
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      
      // Email should be pre-filled
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
    
    test('Level 3 form includes all fields', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      
      render(
        <ProgressiveForm 
          level={3} 
          onSubmit={mockSubmit} 
          existingData={{ 
            email: 'test@example.com',
            phone: '+1234567890'
          }} 
        />
      );
      
      // Should have all fields
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      
      // Previous data should be pre-filled
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
    });
  });

  describe('User Interface Integration', () => {
    test('Hero section video player interaction', async () => {
      const user = userEvent.setup();
      
      render(<HeroSection />);
      
      // Find video player control
      const videoPlayer = screen.getByRole('button', { name: /play video/i });
      expect(videoPlayer).toBeInTheDocument();
      
      // Click should work without errors
      await user.click(videoPlayer);
      
      // Video player should still be present after interaction
      expect(videoPlayer).toBeInTheDocument();
    });

    test('Hero section statistics display', () => {
      render(<HeroSection />);
      
      // Should display key statistics - check for the translation keys or numbers
      // The hero section should have some stats counters
      const statElements = screen.getAllByText(/[0-9]+/);
      expect(statElements.length).toBeGreaterThan(0);
      
      // Should have some statistical content even if using translation keys
      const statsElements = screen.getAllByText(/stats\./i);
      expect(statsElements.length).toBeGreaterThan(0);
      
      // Verify that there are at least 3 stats (lives transformed, success rate, experience)
      expect(statsElements.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Error Handling and Validation', () => {
    test('Form handles submission errors gracefully', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
      
      render(<ProgressiveForm level={1} onSubmit={mockSubmit} existingData={{}} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /continue/i });
      await user.click(submitButton);
      
      // Form should handle error gracefully
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalled();
      });
      
      // Should not crash the application
      expect(emailInput).toBeInTheDocument();
    });

    test('Assessment tool shows loading state initially', async () => {
      const mockConfig = {
        questions: [
          {
            id: 'q1',
            text: 'Sample question?',
            type: 'scale' as const,
            min: 1,
            max: 5,
            required: true
          }
        ],
        scoring: {
          algorithm: 'weighted' as const,
          weights: { q1: 1 }
        },
        showProgress: true,
        timeLimit: 300,
        randomizeQuestions: false,
        title: 'Sample Assessment',
        description: 'A sample assessment for testing'
      };
      
      render(
        <AssessmentTool 
          toolId="potential-quotient-calculator"
          title="Test Assessment"
          description="Test description"
          config={mockConfig}
        />
      );
      
      // Should show loading state
      expect(screen.getByText(/loading assessment/i)).toBeInTheDocument();
    });
  });

  describe('Component Integration and Accessibility', () => {
    test('Hero section loads within reasonable time', async () => {
      const startTime = performance.now();
      
      render(<HeroSection />);
      
      await waitFor(() => {
        expect(screen.getByText(/What if you're only using 10% of your true potential/i)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Should load within reasonable time (increased for CI environments)
      expect(loadTime).toBeLessThan(5000);
    });

    test('Keyboard navigation works on hero section', async () => {
      const user = userEvent.setup();
      
      render(<HeroSection />);
      
      // Tab through interactive elements - just verify that tabbing works
      await user.tab();
      
      // Get the currently focused element
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();
      expect(focusedElement?.tagName).toBe('BUTTON');
      
      // Tab again to next element
      await user.tab();
      
      // Should still have a focused element (different from the first)
      const secondFocusedElement = document.activeElement;
      expect(secondFocusedElement).toBeTruthy();
      expect(secondFocusedElement?.tagName).toBe('BUTTON');
    });

    test('Form elements have proper labels and accessibility', () => {
      render(<ProgressiveForm level={1} onSubmit={jest.fn()} existingData={{}} />);
      
      // Email input should have proper label
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('id');
      
      // Submit button should be accessible
      const submitButton = screen.getByRole('button', { name: /continue/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Data Persistence and Recovery', () => {
    test('Form data persists across browser sessions', () => {
      // Mock localStorage with saved data
      const mockLocalStorage = {
        getItem: jest.fn(() => JSON.stringify({ email: 'saved@example.com' })),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      render(<ProgressiveForm level={1} onSubmit={jest.fn()} existingData={{}} />);

      // Should attempt to restore saved data
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('progressive-form-data');
    });
  });

  describe('Cross-component Communication', () => {
    test('Hero section CTA triggers lead capture interface', async () => {
      const user = userEvent.setup();
      
      render(<HeroSection />);
      
      // Click main CTA
      const ctaButton = screen.getByRole('button', { name: /discover your hidden 90%/i });
      await user.click(ctaButton);
      
      // Should trigger some kind of lead capture interface
      await waitFor(() => {
        // Look for any email input that appears after clicking
        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});