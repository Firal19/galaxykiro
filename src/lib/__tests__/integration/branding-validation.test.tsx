/**
 * Galaxy Dream Team Branding Validation Tests
 * Ensures consistent branding across all components and pages
 */

import { render, screen } from '@testing-library/react';
import { GalaxyDreamTeamLogo } from '@/components/galaxy-dream-team-logo';
import { GalaxyDreamTeamFooter } from '@/components/galaxy-dream-team-footer';
import HeroSection from '@/components/hero-section';
import { ContentLibrary } from '@/components/content-library';
import { AssessmentTool } from '@/components/assessment/assessment-tool';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
}));

describe('Galaxy Dream Team Branding Validation', () => {
  describe('Logo Consistency', () => {
    test('should display Galaxy Dream Team logo with correct styling', () => {
      render(<GalaxyDreamTeamLogo />);
      
      const logo = screen.getByTestId('galaxy-dream-team-logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('alt', 'Galaxy Dream Team');
      
      // Check logo styling
      expect(logo).toHaveClass('h-8', 'w-auto'); // Standard height
      
      // Check for SVG or image source
      const logoImage = screen.getByRole('img', { name: /galaxy dream team/i });
      expect(logoImage).toBeInTheDocument();
    });

    test('should display logo in header across all components', () => {
      const components = [
        <HeroSection key="hero" />,
        <ContentLibrary key="content" />,
        <AssessmentTool key="assessment" toolId="potential-quotient-calculator" />
      ];
      
      components.forEach((component) => {
        render(component);
        
        // Should have logo in header
        const headerLogo = screen.getByTestId('header-logo');
        expect(headerLogo).toBeInTheDocument();
        expect(headerLogo).toHaveAttribute('alt', 'Galaxy Dream Team');
      });
    });
  });

  describe('Company Name Consistency', () => {
    test('should reference Galaxy Dream Team consistently in content', () => {
      render(<HeroSection />);
      
      // Check for company name in various contexts
      const companyReferences = screen.getAllByText(/galaxy dream team/i);
      expect(companyReferences.length).toBeGreaterThan(0);
      
      // Should not have old company names
      expect(screen.queryByText(/old company name/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/previous brand/i)).not.toBeInTheDocument();
    });

    test('should display company name in testimonials and success stories', () => {
      render(<HeroSection />);
      
      // Check testimonial attribution
      const testimonialText = screen.getByTestId('video-testimonial-text');
      expect(testimonialText).toHaveTextContent(/galaxy dream team/i);
      
      // Check success story attribution
      const successStories = screen.getAllByTestId(/success-story/);
      successStories.forEach((story) => {
        expect(story).toHaveTextContent(/galaxy dream team/i);
      });
    });
  });

  describe('Footer Branding', () => {
    test('should display complete Galaxy Dream Team footer information', () => {
      render(<GalaxyDreamTeamFooter />);
      
      // Company name
      expect(screen.getByText(/galaxy dream team/i)).toBeInTheDocument();
      
      // Copyright notice
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear} Galaxy Dream Team`, 'i'))).toBeInTheDocument();
      
      // Contact information
      expect(screen.getByTestId('company-contact')).toHaveTextContent(/galaxy dream team/i);
      
      // Address information
      expect(screen.getByTestId('company-address')).toBeInTheDocument();
      
      // Social media links
      const socialLinks = screen.getAllByTestId(/social-link/);
      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Educational Content Attribution', () => {
    test('should attribute all educational content to Galaxy Dream Team', () => {
      render(<ContentLibrary />);
      
      // Check content categories
      const contentCategories = [
        'The Untapped You',
        'Dreams to Reality', 
        'The Daily Edge',
        'The Inner Game',
        'The Multiplier Effect'
      ];
      
      contentCategories.forEach((category) => {
        const categoryElement = screen.getByText(category);
        expect(categoryElement).toBeInTheDocument();
        
        // Should have Galaxy Dream Team attribution nearby
        const categoryContainer = categoryElement.closest('[data-testid*="category"]');
        expect(categoryContainer).toHaveTextContent(/galaxy dream team/i);
      });
    });

    test('should show Galaxy Dream Team expertise in assessment results', () => {
      render(<AssessmentTool toolId="potential-quotient-calculator" />);
      
      // Mock assessment completion
      const mockResults = {
        scores: { overall: 75 },
        insights: ['High potential for growth'],
        recommendations: ['Focus on daily habits']
      };
      
      // Simulate assessment completion
      const assessmentContainer = screen.getByTestId('assessment-container');
      expect(assessmentContainer).toBeInTheDocument();
      
      // Should show Galaxy Dream Team branding in results
      const resultsSection = screen.getByTestId('assessment-results');
      expect(resultsSection).toHaveTextContent(/galaxy dream team methodology/i);
    });
  });

  describe('Downloadable Resources Branding', () => {
    test('should include Galaxy Dream Team branding in downloadable resources', () => {
      render(<ContentLibrary />);
      
      // Check downloadable resources
      const downloadButtons = screen.getAllByTestId(/download-resource/);
      
      downloadButtons.forEach((button) => {
        // Should indicate Galaxy Dream Team branding
        expect(button).toHaveAttribute('data-brand', 'galaxy-dream-team');
      });
      
      // Check resource templates
      const resourceTemplates = screen.getAllByTestId(/resource-template/);
      resourceTemplates.forEach((template) => {
        expect(template).toHaveTextContent(/galaxy dream team/i);
      });
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
      
      // Website
      const websiteLink = screen.getByTestId('company-website');
      expect(websiteLink).toHaveAttribute('href', 'https://galaxydreamteam.com');
    });
  });

  describe('Visual Identity Consistency', () => {
    test('should use consistent Galaxy Dream Team color scheme', () => {
      render(<HeroSection />);
      
      // Check primary brand colors
      const primaryElements = screen.getAllByTestId(/primary-brand/);
      primaryElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        // Should use brand colors (these would be defined in your design system)
        expect(styles.color).toMatch(/(#10B981|#3B82F6|#8B5CF6)/); // Brand colors
      });
      
      // Check accent colors
      const accentElements = screen.getAllByTestId(/accent-brand/);
      accentElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        expect(styles.color).toMatch(/(#F59E0B|#EF4444)/); // Accent colors
      });
    });

    test('should use consistent typography', () => {
      render(<HeroSection />);
      
      // Check heading fonts
      const headings = screen.getAllByRole('heading');
      headings.forEach((heading) => {
        const styles = window.getComputedStyle(heading);
        expect(styles.fontFamily).toContain('Plus Jakarta Sans');
      });
      
      // Check body text fonts
      const bodyText = screen.getAllByTestId(/body-text/);
      bodyText.forEach((text) => {
        const styles = window.getComputedStyle(text);
        expect(styles.fontFamily).toContain('Inter');
      });
    });
  });

  describe('Certification and Credentials', () => {
    test('should display Galaxy Dream Team certifications and credentials', () => {
      render(<ContentLibrary />);
      
      // Check for professional credentials
      const credentials = screen.getByTestId('company-credentials');
      expect(credentials).toHaveTextContent(/galaxy dream team/i);
      expect(credentials).toHaveTextContent(/certified/i);
      
      // Check for industry affiliations
      const affiliations = screen.getByTestId('industry-affiliations');
      expect(affiliations).toBeInTheDocument();
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
      
      // Should indicate Galaxy Dream Team ownership
      const legalText = screen.getByTestId('legal-text');
      expect(legalText).toHaveTextContent(/galaxy dream team/i);
    });
  });

  describe('Multi-language Branding', () => {
    test('should maintain Galaxy Dream Team branding in Amharic content', () => {
      // Mock Amharic language setting
      Object.defineProperty(navigator, 'language', {
        value: 'am',
        configurable: true
      });
      
      render(<HeroSection />);
      
      // Should show Galaxy Dream Team in both languages
      const brandingElements = screen.getAllByTestId(/brand-name/);
      brandingElements.forEach((element) => {
        // Should contain either English or Amharic version
        expect(element).toHaveTextContent(/(Galaxy Dream Team|ጋላክሲ ድሪም ቲም)/);
      });
    });
  });

  describe('Error Pages Branding', () => {
    test('should maintain branding on error pages', () => {
      // Mock 404 error page
      render(
        <div data-testid="error-page">
          <GalaxyDreamTeamLogo />
          <h1>Page Not Found</h1>
          <p>Galaxy Dream Team - We're here to help you reach your potential</p>
          <GalaxyDreamTeamFooter />
        </div>
      );
      
      // Should have logo
      expect(screen.getByTestId('galaxy-dream-team-logo')).toBeInTheDocument();
      
      // Should have company name
      expect(screen.getByText(/galaxy dream team/i)).toBeInTheDocument();
      
      // Should have footer
      expect(screen.getByTestId('galaxy-dream-team-footer')).toBeInTheDocument();
    });
  });
});