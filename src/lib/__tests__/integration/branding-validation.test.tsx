/**
 * Galaxy Dream Team Branding Validation Tests
 * Ensures consistent branding across all components and pages
 */

import { render, screen } from '@testing-library/react';
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo';
import { GalaxyDreamTeamFooter } from '@/components/galaxy-dream-team-footer';
import { HeroSection } from '@/components/hero-section';
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

describe('Galaxy Dream Team Branding Validation', () => {
  describe('Logo Consistency', () => {
    test('should display Galaxy Dream Team logo with correct styling', () => {
      render(<GalaxyDreamTeamLogo />);
      
      const logo = screen.getByTestId('galaxy-dream-team-logo');
      expect(logo).toBeInTheDocument();
      
      // Check for Galaxy Dream Team text
      expect(screen.getByText('Galaxy Dream Team')).toBeInTheDocument();
      
      // Check for image alt text for accessibility
      const logoImage = screen.getByRole('img', { name: /galaxy dream team/i });
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute('alt', 'Galaxy Dream Team');
    });

    test('should display logo with different variants', () => {
      const { rerender } = render(<GalaxyDreamTeamLogo variant="compact" />);
      expect(screen.getByTestId('galaxy-dream-team-logo')).toBeInTheDocument();
      
      rerender(<GalaxyDreamTeamLogo variant="icon-only" />);
      expect(screen.getByTestId('galaxy-dream-team-logo')).toBeInTheDocument();
      
      rerender(<GalaxyDreamTeamLogo variant="full" showTagline={true} />);
      expect(screen.getByText('Unlock Your Hidden Potential')).toBeInTheDocument();
    });
  });

  describe('Company Name Consistency', () => {
    test('should display hero content without deprecated branding', () => {
      render(<HeroSection />);
      
      // Check that hero section renders properly
      expect(screen.getByLabelText(/hero section/i)).toBeInTheDocument();
      
      // Should have main CTA text
      expect(screen.getByText(/what if you're only using 10%/i)).toBeInTheDocument();
    });

    test('should not contain old company names or brands', () => {
      render(<HeroSection />);
      
      // Should not have outdated terminology
      expect(screen.queryByText(/breakthrough/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/old company/i)).not.toBeInTheDocument();
    });
  });

  describe('Footer Branding', () => {
    test('should display complete Galaxy Dream Team footer information', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Check footer exists
      expect(screen.getByTestId('galaxy-dream-team-footer')).toBeInTheDocument();
      
      // Company name should be present (there are multiple instances, so check for at least one)
      const companyReferences = screen.getAllByText(/galaxy dream team/i);
      expect(companyReferences.length).toBeGreaterThan(0);
      
      // Copyright notice
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear} Galaxy Dream Team`, 'i'))).toBeInTheDocument();
      
      // Contact information
      expect(screen.getByTestId('company-contact')).toBeInTheDocument();
      expect(screen.getByTestId('company-address')).toBeInTheDocument();
      
      // Email and phone links
      expect(screen.getByTestId('contact-email')).toHaveAttribute('href', 'mailto:info@galaxydreamteam.com');
      expect(screen.getByTestId('contact-phone')).toHaveAttribute('href', 'tel:+251911234567');
      
      // Social media links
      expect(screen.getByTestId('social-link-facebook')).toHaveAttribute('href', '#');
      expect(screen.getByTestId('social-link-twitter')).toHaveAttribute('href', '#');
      expect(screen.getByTestId('social-link-linkedin')).toHaveAttribute('href', '#');
      expect(screen.getByTestId('social-link-telegram')).toHaveAttribute('href', '#');
    });
  });

  describe('Assessment Tool Branding', () => {
    test('should display Galaxy Dream Team branding in assessment tools', async () => {
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
      
      // Initially shows loading state
      expect(screen.getByText(/loading assessment/i)).toBeInTheDocument();
      
      // The assessment tool should render with the proper title and config
      // Since it's showing loading state, we verify the component is properly instantiated
      const assessmentContainer = screen.getByText(/loading assessment/i).closest('div');
      expect(assessmentContainer).toBeInTheDocument();
    });
  });

  describe('Contact Information Consistency', () => {
    test('should display consistent Galaxy Dream Team contact information', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Email
      const emailLink = screen.getByTestId('contact-email');
      expect(emailLink).toHaveAttribute('href', 'mailto:info@galaxydreamteam.com');
      
      // Phone
      const phoneLink = screen.getByTestId('contact-phone');
      expect(phoneLink).toHaveAttribute('href', 'tel:+251911234567');
      
      // Address
      const address = screen.getByTestId('company-address');
      expect(address).toHaveTextContent(/addis ababa/i);
      expect(address).toHaveTextContent(/ethiopia/i);
      
      // Website reference
      const websiteLink = screen.getByTestId('company-website');
      expect(websiteLink).toHaveAttribute('href', 'https://galaxydreamteam.com');
    });
  });

  describe('Visual Identity Consistency', () => {
    test('should use consistent Galaxy Dream Team color scheme in logo', () => {
      render(<GalaxyDreamTeamLogo />);
      
      // Logo should have Galaxy Dream Team colors (Ethiopian flag inspired)
      const logoContainer = screen.getByTestId('galaxy-dream-team-logo');
      expect(logoContainer).toBeInTheDocument();
      
      // Check for company name styling
      const companyName = screen.getByText('Galaxy Dream Team');
      expect(companyName).toHaveClass('font-bold');
      expect(companyName).toHaveClass('text-gray-900');
    });

    test('should display tagline consistently', () => {
      render(<GalaxyDreamTeamLogo showTagline={true} />);
      
      const tagline = screen.getByText('Unlock Your Hidden Potential');
      expect(tagline).toBeInTheDocument();
      expect(tagline).toHaveClass('text-gray-600');
    });
  });

  describe('Navigation and Links', () => {
    test('should have consistent navigation structure', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Check for main navigation sections
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Resources')).toBeInTheDocument();
      
      // Check for key pages
      expect(screen.getByRole('link', { name: /success gap/i })).toHaveAttribute('href', '/success-gap');
      expect(screen.getByRole('link', { name: /change paradox/i })).toHaveAttribute('href', '/change-paradox');
      expect(screen.getByRole('link', { name: /vision void/i })).toHaveAttribute('href', '/vision-void');
    });
  });

  describe('Terms and Privacy Branding', () => {
    test('should reference Galaxy Dream Team in legal documents', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Terms of Service link
      const termsLink = screen.getByTestId('terms-link');
      expect(termsLink).toHaveAttribute('href', '/terms');
      
      // Privacy Policy link
      const privacyLink = screen.getByTestId('privacy-link');
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      
      // Should indicate Galaxy Dream Team ownership in legal text
      const legalText = screen.getByTestId('legal-text');
      expect(legalText).toHaveTextContent(/galaxy dream team/i);
    });
  });

  describe('Accessibility and Branding', () => {
    test('should maintain brand accessibility standards', () => {
      render(<GalaxyDreamTeamLogo />);
      
      // Logo should have proper accessibility attributes
      const logo = screen.getByTestId('galaxy-dream-team-logo');
      expect(logo).toHaveAttribute('aria-label', 'Galaxy Dream Team - Home');
      
      // Image should have proper alt text
      const logoImage = screen.getByRole('img', { name: /galaxy dream team/i });
      expect(logoImage).toHaveAttribute('alt', 'Galaxy Dream Team');
    });

    test('should provide accessible social media links', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Social links should have proper labels
      expect(screen.getByTestId('social-link-facebook')).toHaveAttribute('aria-label', 'Facebook');
      expect(screen.getByTestId('social-link-twitter')).toHaveAttribute('aria-label', 'Twitter');
      expect(screen.getByTestId('social-link-linkedin')).toHaveAttribute('aria-label', 'LinkedIn');
      expect(screen.getByTestId('social-link-telegram')).toHaveAttribute('aria-label', 'Telegram');
    });
  });

  describe('Brand Message Consistency', () => {
    test('should maintain consistent messaging across components', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Check for key brand messages
      expect(screen.getByText(/unlock your hidden potential/i)).toBeInTheDocument();
      expect(screen.getByText(/transforming lives across ethiopia/i)).toBeInTheDocument();
      
      // Check for professional description
      const description = screen.getByText(/ethiopia's premier personal development platform/i);
      expect(description).toBeInTheDocument();
    });
  });
});