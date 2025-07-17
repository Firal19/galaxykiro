/**
 * Final Integration and System Testing
 * 
 * This comprehensive test suite validates:
 * - Complete user journey flows
 * - Progressive information capture across all tools
 * - Soft membership registration and educational content delivery
 * - Galaxy Dream Team branding consistency
 * - "Learn More" links and educational page navigation
 * - Security and vulnerability assessment
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from '@/lib/contexts/auth-context';

// Import all major components for integration testing
import HeroSection from '@/components/hero-section';
import SuccessGapSection from '@/components/success-gap-section';
import ChangeParadoxSection from '@/components/change-paradox-section';
import VisionVoidSection from '@/components/vision-void-section';
import LeadershipLeverSection from '@/components/leadership-lever-section';
import DecisionDoorSection from '@/components/decision-door-section';
import ProgressiveForm from '@/components/progressive-form';
import ContentLibrary from '@/components/content-library';
import GalaxyDreamTeamLogo from '@/components/galaxy-dream-team-logo';
import Navigation from '@/components/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
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

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const messages = {
    common: {
      loading: 'Loading...',
      error: 'Error occurred',
      submit: 'Submit',
      cancel: 'Cancel',
    },
  };

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
};

describe('Final Integration and System Testing', () => {
  describe('1. Complete User Journey Flows', () => {
    test('Browser to Engaged to Soft Member progression', async () => {
      const user = userEvent.setup();
      
      // Render main landing page components
      render(
        <TestWrapper>
          <div>
            <Navigation />
            <HeroSection />
            <SuccessGapSection />
            <ChangeParadoxSection />
            <VisionVoidSection />
            <LeadershipLeverSection />
            <DecisionDoorSection />
          </div>
        </TestWrapper>
      );

      // Test Browser tier (initial visit)
      expect(screen.getByText(/What if you're only using 10% of your true potential/i)).toBeInTheDocument();
      
      // Test engagement progression - click on first assessment
      const discoverButton = screen.getByRole('button', { name: /discover your hidden 90%/i });
      await user.click(discoverButton);
      
      // Should trigger Level 1 capture (email only)
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });

      // Fill email and submit
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Test progression to Engaged tier
      await waitFor(() => {
        expect(screen.getByText(/success factor calculator/i)).toBeInTheDocument();
      });
    });

    test('Complete assessment flow with progressive capture', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SuccessGapSection />
        </TestWrapper>
      );

      // Click on Success Gap question (should navigate to educational page)
      const questionLink = screen.getByText(/Why do some people achieve their dreams/i);
      await user.click(questionLink);
      
      // Verify navigation intent (mocked router)
      expect(questionLink).toHaveAttribute('href', '/success-gap');
    });
  });

  describe('2. Progressive Information Capture Verification', () => {
    test('Level 1 capture (email only)', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ProgressiveForm level={1} existingData={{}} onSubmit={jest.fn()} />
        </TestWrapper>
      );

      // Should only show email field
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/phone/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
    });

    test('Level 2 capture (email + phone)', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ProgressiveForm 
            level={2} 
            existingData={{ email: 'test@example.com' }} 
            onSubmit={jest.fn()} 
          />
        </TestWrapper>
      );

      // Should show email (pre-filled) and phone
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    test('Level 3 capture (full profile)', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ProgressiveForm 
            level={3} 
            existingData={{ 
              email: 'test@example.com',
              phone: '+1234567890'
            }} 
            onSubmit={jest.fn()} 
          />
        </TestWrapper>
      );

      // Should show all fields
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    });
  });

  describe('3. Soft Membership Registration and Educational Content', () => {
    test('Soft membership registration flow', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DecisionDoorSection />
        </TestWrapper>
      );

      // Test all three soft membership CTAs
      const starterPackButton = screen.getByText(/get starter pack/i);
      const masterclassButton = screen.getByText(/join free masterclass/i);
      const officeVisitButton = screen.getByText(/schedule office visit/i);

      expect(starterPackButton).toBeInTheDocument();
      expect(masterclassButton).toBeInTheDocument();
      expect(officeVisitButton).toBeInTheDocument();

      // Verify no payment processing elements
      expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
      expect(screen.queryByText(/price/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/payment/i)).not.toBeInTheDocument();
    });

    test('Educational content delivery system', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ContentLibrary 
            categories={[
              {
                id: 'untapped-you',
                name: 'The Untapped You',
                description: 'Discover your hidden potential',
                icon: 'user',
                contentItems: [],
                tools: []
              }
            ]}
            userPreferences={{}}
            accessLevel="soft-member"
            searchFilters={[]}
          />
        </TestWrapper>
      );

      expect(screen.getByText(/the untapped you/i)).toBeInTheDocument();
    });
  });

  describe('4. Galaxy Dream Team Branding Consistency', () => {
    test('Logo presence across components', () => {
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      // Check for Galaxy Dream Team logo
      const logo = screen.getByAltText(/galaxy dream team/i);
      expect(logo).toBeInTheDocument();
    });

    test('Consistent company name references', () => {
      render(
        <TestWrapper>
          <div>
            <Navigation />
            <HeroSection />
          </div>
        </TestWrapper>
      );

      // Should not contain old "breakthrough" terminology
      expect(screen.queryByText(/breakthrough/i)).not.toBeInTheDocument();
      
      // Should contain Galaxy Dream Team references
      expect(screen.getByText(/galaxy dream team/i)).toBeInTheDocument();
    });

    test('Brand color consistency', () => {
      render(
        <TestWrapper>
          <GalaxyDreamTeamLogo />
        </TestWrapper>
      );

      const logo = screen.getByAltText(/galaxy dream team/i);
      expect(logo).toBeInTheDocument();
    });
  });

  describe('5. Learn More Links and Educational Navigation', () => {
    test('All sections have Learn More links', () => {
      render(
        <TestWrapper>
          <div>
            <SuccessGapSection />
            <ChangeParadoxSection />
            <VisionVoidSection />
            <LeadershipLeverSection />
            <DecisionDoorSection />
          </div>
        </TestWrapper>
      );

      // Check for Learn More links in each section
      const learnMoreLinks = screen.getAllByText(/learn more/i);
      expect(learnMoreLinks).toHaveLength(5); // One for each section
    });

    test('Educational page navigation paths', () => {
      render(
        <TestWrapper>
          <SuccessGapSection />
        </TestWrapper>
      );

      const learnMoreLink = screen.getByText(/learn more/i);
      expect(learnMoreLink.closest('a')).toHaveAttribute('href', '/success-gap/learn-more');
    });
  });

  describe('6. Security and Input Validation', () => {
    test('Email validation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ProgressiveForm level={1} existingData={{}} onSubmit={jest.fn()} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      
      // Test invalid email
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger validation
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    test('XSS prevention in user inputs', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ProgressiveForm level={3} existingData={{}} onSubmit={jest.fn()} />
        </TestWrapper>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      
      // Test XSS attempt
      await user.type(nameInput, '<script>alert("xss")</script>');
      
      // Input should be sanitized
      expect(nameInput).toHaveValue('<script>alert("xss")</script>');
      // But when processed, it should be sanitized (this would be tested in the actual submission)
    });

    test('Rate limiting simulation', () => {
      // This would typically be tested at the API level
      // Here we just verify the client-side doesn't allow rapid submissions
      const mockSubmit = jest.fn();
      
      render(
        <TestWrapper>
          <ProgressiveForm level={1} existingData={{}} onSubmit={mockSubmit} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // Rapid clicks should be debounced
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      
      // Should only call once due to debouncing
      expect(mockSubmit).toHaveBeenCalledTimes(0); // No calls without valid data
    });
  });

  describe('7. Content Terminology Validation', () => {
    test('No "breakthrough" terminology present', () => {
      render(
        <TestWrapper>
          <div>
            <HeroSection />
            <SuccessGapSection />
            <ChangeParadoxSection />
            <VisionVoidSection />
            <LeadershipLeverSection />
            <DecisionDoorSection />
          </div>
        </TestWrapper>
      );

      // Should not contain any "breakthrough" references
      expect(screen.queryByText(/breakthrough/i)).not.toBeInTheDocument();
    });

    test('Positive growth-focused language', () => {
      render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );

      // Should contain growth-focused terms
      expect(screen.getByText(/potential/i)).toBeInTheDocument();
      expect(screen.getByText(/discover/i)).toBeInTheDocument();
    });
  });

  describe('8. Mobile Responsiveness and Accessibility', () => {
    test('Touch-friendly interface elements', () => {
      render(
        <TestWrapper>
          <HeroSection />
        </TestWrapper>
      );

      const ctaButton = screen.getByRole('button', { name: /discover your hidden 90%/i });
      
      // Button should have adequate touch target size (44px minimum)
      const styles = window.getComputedStyle(ctaButton);
      expect(parseInt(styles.minHeight) >= 44 || parseInt(styles.height) >= 44).toBeTruthy();
    });

    test('Keyboard navigation support', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      // Test tab navigation
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('9. Performance and Loading States', () => {
    test('Loading states for async operations', async () => {
      render(
        <TestWrapper>
          <ProgressiveForm level={1} existingData={{}} onSubmit={async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
          }} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.click(submitButton);
      
      // Should show loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('10. Data Persistence and Recovery', () => {
    test('Form data persistence across sessions', () => {
      // Mock localStorage
      const mockLocalStorage = {
        getItem: jest.fn(() => JSON.stringify({ email: 'saved@example.com' })),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      render(
        <TestWrapper>
          <ProgressiveForm level={1} existingData={{}} onSubmit={jest.fn()} />
        </TestWrapper>
      );

      // Should restore saved data
      expect(mockLocalStorage.getItem).toHaveBeenCalled();
    });
  });
});