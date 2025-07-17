/**
 * Final System Integration Tests
 * Tests complete user journey flows, progressive capture, and all system components
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '@/components/hero-section';
import { ProgressiveForm } from '@/components/progressive-form';
import { AssessmentTool } from '@/components/assessment/assessment-tool';
import { ContentLibrary } from '@/components/content-library';
import { DynamicCTA } from '@/components/dynamic-cta';

// Mock Supabase client
jest.mock('@supabase/supabase-js');
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => Promise.resolve({ data: null, error: null })),
  })),
};

(createClient as jest.Mock).mockReturnValue(mockSupabase);

describe('System Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage
    localStorage.clear();
    // Reset sessionStorage
    sessionStorage.clear();
  });

  describe('Complete User Journey Flow', () => {
    test('Browser to Engaged to Soft Member progression', async () => {
      const user = userEvent.setup();
      
      // 1. Browser tier - Hero section interaction
      render(<HeroSection />);
      
      // Check hero section loads
      expect(screen.getByText(/What if you're only using 10% of your true potential/i)).toBeInTheDocument();
      
      // Click CTA to trigger Level 1 capture
      const ctaButton = screen.getByRole('button', { name: /discover your hidden 90%/i });
      await user.click(ctaButton);
      
      // Verify modal opens for email capture
      await waitFor(() => {
        expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
      });
      
      // Enter email (Level 1 capture)
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /get assessment/i });
      await user.click(submitButton);
      
      // Verify progression to engaged tier
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('users');
      });
    });

    test('Progressive information capture across tools', async () => {
      const user = userEvent.setup();
      
      // Mock user with Level 1 data
      const mockUser = {
        id: 'test-user',
        email: 'test@example.com',
        captureLevel: 1,
        engagementScore: 15
      };
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });
      
      // Test Level 2 tool requiring phone
      render(<AssessmentTool toolId="habit-strength-analyzer" />);
      
      // Should show phone capture form
      await waitFor(() => {
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      });
      
      // Enter phone number
      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, '+1234567890');
      
      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);
      
      // Verify Level 2 capture
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('users');
      });
    });
  });

  describe('Soft Membership Registration Flow', () => {
    test('Complete soft membership registration process', async () => {
      const user = userEvent.setup();
      
      // Mock assessment completion
      const mockAssessmentResult = {
        toolId: 'potential-quotient-calculator',
        scores: { overall: 75 },
        insights: ['High potential for growth']
      };
      
      render(<AssessmentTool toolId="potential-quotient-calculator" />);
      
      // Complete assessment
      const startButton = screen.getByRole('button', { name: /start assessment/i });
      await user.click(startButton);
      
      // Mock assessment completion
      fireEvent(window, new CustomEvent('assessmentComplete', {
        detail: mockAssessmentResult
      }));
      
      // Should show soft membership registration option
      await waitFor(() => {
        expect(screen.getByText(/become a soft member/i)).toBeInTheDocument();
      });
      
      const registerButton = screen.getByRole('button', { name: /register for soft membership/i });
      await user.click(registerButton);
      
      // Should navigate to registration page
      await waitFor(() => {
        expect(screen.getByText(/choose your subscription/i)).toBeInTheDocument();
      });
      
      // Select email subscription
      const emailOption = screen.getByLabelText(/email updates/i);
      await user.click(emailOption);
      
      const completeButton = screen.getByRole('button', { name: /complete registration/i });
      await user.click(completeButton);
      
      // Verify soft membership creation
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('users');
      });
    });
  });

  describe('Educational Content Delivery', () => {
    test('Educational page navigation and content access', async () => {
      const user = userEvent.setup();
      
      // Mock soft member user
      const mockSoftMember = {
        id: 'soft-member',
        email: 'member@example.com',
        currentTier: 'soft-member',
        captureLevel: 3
      };
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockSoftMember },
        error: null
      });
      
      render(<ContentLibrary />);
      
      // Should show all content categories
      await waitFor(() => {
        expect(screen.getByText(/The Untapped You/i)).toBeInTheDocument();
        expect(screen.getByText(/Dreams to Reality/i)).toBeInTheDocument();
        expect(screen.getByText(/The Daily Edge/i)).toBeInTheDocument();
        expect(screen.getByText(/The Inner Game/i)).toBeInTheDocument();
        expect(screen.getByText(/The Multiplier Effect/i)).toBeInTheDocument();
      });
      
      // Click on deep dive content
      const deepDiveContent = screen.getByText(/Deep Dive/i);
      await user.click(deepDiveContent);
      
      // Should access content without restrictions
      await waitFor(() => {
        expect(screen.getByText(/comprehensive guide/i)).toBeInTheDocument();
      });
    });
  });

  describe('Dynamic CTA System', () => {
    test('CTA adaptation based on engagement level', async () => {
      const user = userEvent.setup();
      
      // Mock different engagement levels
      const mockEngagementData = {
        timeOnPage: 300, // 5 minutes
        scrollDepth: 80,
        toolsUsed: 2,
        ctaClicks: 3
      };
      
      render(<DynamicCTA userBehavior={mockEngagementData} />);
      
      // Should show Midi-level CTAs for engaged user
      await waitFor(() => {
        expect(screen.getByText(/Get Your Personalized Report/i)).toBeInTheDocument();
      });
      
      // Simulate high engagement
      const highEngagementData = {
        timeOnPage: 1800, // 30 minutes
        scrollDepth: 95,
        toolsUsed: 5,
        ctaClicks: 8
      };
      
      render(<DynamicCTA userBehavior={highEngagementData} />);
      
      // Should show Macro-level CTAs
      await waitFor(() => {
        expect(screen.getByText(/Book Your Transformation Session/i)).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Features', () => {
    test('Real-time engagement tracking', async () => {
      const user = userEvent.setup();
      
      // Mock real-time subscription
      const mockSubscription = {
        subscribe: jest.fn(),
        unsubscribe: jest.fn()
      };
      
      mockSupabase.channel = jest.fn(() => ({
        on: jest.fn(() => mockSubscription),
        subscribe: jest.fn(() => mockSubscription)
      }));
      
      render(<HeroSection />);
      
      // Simulate user interaction
      const videoPlayer = screen.getByRole('button', { name: /play video/i });
      await user.click(videoPlayer);
      
      // Verify real-time tracking
      await waitFor(() => {
        expect(mockSupabase.channel).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    test('Network error handling and retry logic', async () => {
      const user = userEvent.setup();
      
      // Mock network error
      mockSupabase.from.mockImplementation(() => ({
        insert: jest.fn(() => Promise.reject(new Error('Network error')))
      }));
      
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
      
      // Should show retry option
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    test('Offline functionality through service worker', async () => {
      // Mock service worker
      Object.defineProperty(navigator, 'serviceWorker', {
        value: {
          register: jest.fn(() => Promise.resolve()),
          ready: Promise.resolve({
            active: {
              postMessage: jest.fn()
            }
          })
        },
        writable: true
      });
      
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });
      
      render(<AssessmentTool toolId="potential-quotient-calculator" />);
      
      // Should show offline indicator
      await waitFor(() => {
        expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
      });
      
      // Should still allow tool usage
      expect(screen.getByRole('button', { name: /start assessment/i })).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    test('Component loading performance', async () => {
      const startTime = performance.now();
      
      render(<HeroSection />);
      
      await waitFor(() => {
        expect(screen.getByText(/What if you're only using 10% of your true potential/i)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Should load within 100ms
      expect(loadTime).toBeLessThan(100);
    });

    test('Keyboard navigation accessibility', async () => {
      const user = userEvent.setup();
      
      render(<HeroSection />);
      
      // Tab through interactive elements
      await user.tab();
      expect(screen.getByRole('button', { name: /discover your hidden 90%/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /play video/i })).toHaveFocus();
      
      // Enter should activate buttons
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
      });
    });
  });
});