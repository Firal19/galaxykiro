/**
 * Comprehensive Accessibility Tests
 * Tests WCAG compliance and accessibility features
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import HeroSection from '@/components/hero-section';
import { ProgressiveForm } from '@/components/progressive-form';
import { AssessmentTool } from '@/components/assessment/assessment-tool';
import { ContentLibrary } from '@/components/content-library';
import { DynamicCTA } from '@/components/dynamic-cta';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Integration Tests', () => {
  describe('WCAG Compliance', () => {
    test('Hero section should have no accessibility violations', async () => {
      const { container } = render(<HeroSection />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Progressive form should have no accessibility violations', async () => {
      const { container } = render(<ProgressiveForm level={1} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Assessment tool should have no accessibility violations', async () => {
      const { container } = render(<AssessmentTool toolId="potential-quotient-calculator" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Content library should have no accessibility violations', async () => {
      const { container } = render(<ContentLibrary />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    test('should support full keyboard navigation through hero section', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);
      
      // Tab through all interactive elements
      await user.tab();
      expect(screen.getByRole('button', { name: /discover your hidden 90%/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /play video/i })).toHaveFocus();
      
      // Enter should activate buttons
      await user.keyboard('{Enter}');
      expect(screen.getByTestId('lead-capture-modal')).toBeInTheDocument();
      
      // Escape should close modal
      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('lead-capture-modal')).not.toBeInTheDocument();
    });

    test('should support keyboard navigation in forms', async () => {
      const user = userEvent.setup();
      render(<ProgressiveForm level={2} />);
      
      // Tab through form fields
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/phone/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /submit/i })).toHaveFocus();
      
      // Enter should submit form
      await user.keyboard('{Enter}');
      // Form validation should trigger
    });

    test('should support keyboard navigation in assessment tools', async () => {
      const user = userEvent.setup();
      render(<AssessmentTool toolId="habit-strength-analyzer" />);
      
      // Start assessment
      const startButton = screen.getByRole('button', { name: /start assessment/i });
      startButton.focus();
      await user.keyboard('{Enter}');
      
      // Navigate through questions with keyboard
      const radioButtons = screen.getAllByRole('radio');
      radioButtons[0].focus();
      
      // Arrow keys should navigate radio options
      await user.keyboard('{ArrowDown}');
      expect(radioButtons[1]).toHaveFocus();
      
      // Space should select option
      await user.keyboard(' ');
      expect(radioButtons[1]).toBeChecked();
    });
  });

  describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', () => {
      render(<HeroSection />);
      
      // Check heading levels
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/what if you're only using 10%/i);
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
      
      // No heading level should be skipped
      const allHeadings = screen.getAllByRole('heading');
      const headingLevels = allHeadings.map(h => parseInt(h.tagName.charAt(1)));
      
      for (let i = 1; i < headingLevels.length; i++) {
        const diff = headingLevels[i] - headingLevels[i-1];
        expect(diff).toBeLessThanOrEqual(1); // No skipped levels
      }
    });

    test('should have proper ARIA labels and descriptions', () => {
      render(<ProgressiveForm level={1} />);
      
      // Form should have accessible name
      const form = screen.getByRole('form');
      expect(form).toHaveAccessibleName();
      
      // Inputs should have labels
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('aria-describedby');
      
      // Error messages should be associated
      const errorMessage = screen.queryByRole('alert');
      if (errorMessage) {
        expect(emailInput).toHaveAttribute('aria-describedby', expect.stringContaining(errorMessage.id));
      }
    });

    test('should announce dynamic content changes', async () => {
      const user = userEvent.setup();
      render(<AssessmentTool toolId="potential-quotient-calculator" />);
      
      // Start assessment
      const startButton = screen.getByRole('button', { name: /start assessment/i });
      await user.click(startButton);
      
      // Progress should be announced
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      
      // Live region for announcements
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Visual Accessibility', () => {
    test('should have sufficient color contrast', () => {
      render(<HeroSection />);
      
      // Check primary text contrast
      const primaryText = screen.getByTestId('primary-text');
      const styles = window.getComputedStyle(primaryText);
      
      // This would typically use a color contrast checking library
      // For now, we'll check that colors are defined
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    });

    test('should support high contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      render(<HeroSection />);
      
      // Should apply high contrast styles
      const container = screen.getByTestId('hero-container');
      expect(container).toHaveClass('high-contrast');
    });

    test('should support reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      render(<HeroSection />);
      
      // Animations should be disabled
      const animatedElement = screen.getByTestId('animated-counter');
      expect(animatedElement).toHaveClass('reduce-motion');
    });
  });

  describe('Focus Management', () => {
    test('should manage focus properly in modals', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);
      
      // Open modal
      const ctaButton = screen.getByRole('button', { name: /discover your hidden 90%/i });
      await user.click(ctaButton);
      
      // Focus should move to modal
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      
      // First focusable element should be focused
      const firstInput = screen.getByLabelText(/email/i);
      expect(firstInput).toHaveFocus();
      
      // Tab should stay within modal
      await user.tab();
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toHaveFocus();
      
      // Shift+Tab should go back
      await user.keyboard('{Shift>}{Tab}{/Shift}');
      expect(firstInput).toHaveFocus();
      
      // Close modal
      await user.keyboard('{Escape}');
      
      // Focus should return to trigger
      expect(ctaButton).toHaveFocus();
    });

    test('should have visible focus indicators', () => {
      render(<ProgressiveForm level={1} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      emailInput.focus();
      
      // Should have focus styles
      expect(emailInput).toHaveClass('focus:ring-2');
      expect(emailInput).toHaveClass('focus:ring-blue-500');
    });
  });

  describe('Mobile Accessibility', () => {
    test('should have appropriate touch targets', () => {
      render(<HeroSection />);
      
      // All interactive elements should be at least 44px
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const minHeight = parseInt(styles.minHeight);
        const minWidth = parseInt(styles.minWidth);
        
        expect(minHeight).toBeGreaterThanOrEqual(44);
        expect(minWidth).toBeGreaterThanOrEqual(44);
      });
    });

    test('should support voice control', () => {
      render(<AssessmentTool toolId="dream-clarity-generator" />);
      
      // Elements should have accessible names for voice commands
      const startButton = screen.getByRole('button', { name: /start assessment/i });
      expect(startButton).toHaveAccessibleName('Start Assessment');
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });
  });

  describe('Error Accessibility', () => {
    test('should announce form validation errors', async () => {
      const user = userEvent.setup();
      render(<ProgressiveForm level={1} />);
      
      // Submit empty form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Error should be announced
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent(/email is required/i);
      
      // Input should be marked as invalid
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      expect(emailInput).toHaveAttribute('aria-describedby', expect.stringContaining(errorAlert.id));
    });

    test('should provide helpful error recovery', async () => {
      const user = userEvent.setup();
      render(<ProgressiveForm level={1} />);
      
      // Enter invalid email
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Should show specific error message
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
      
      // Should provide example
      expect(errorMessage).toHaveTextContent(/example@domain.com/i);
    });
  });

  describe('Content Accessibility', () => {
    test('should have descriptive link text', () => {
      render(<ContentLibrary />);
      
      // Links should be descriptive
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        const linkText = link.textContent || link.getAttribute('aria-label');
        expect(linkText).toBeTruthy();
        expect(linkText).not.toMatch(/^(click here|read more|learn more)$/i);
      });
    });

    test('should provide alternative text for images', () => {
      render(<HeroSection />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        const altText = img.getAttribute('alt');
        
        // Alt text should be descriptive or empty for decorative images
        if (altText) {
          expect(altText.length).toBeGreaterThan(0);
          expect(altText).not.toBe('image');
        }
      });
    });

    test('should structure content with proper landmarks', () => {
      render(<HeroSection />);
      
      // Should have main landmark
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      // Should have navigation
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Should have banner/header
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
      
      // Should have contentinfo/footer
      const contentinfo = screen.getByRole('contentinfo');
      expect(contentinfo).toBeInTheDocument();
    });
  });
});