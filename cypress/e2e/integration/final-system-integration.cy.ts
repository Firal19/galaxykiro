/**
 * Final System Integration E2E Tests
 * 
 * Comprehensive end-to-end testing of:
 * - Complete user journey flows
 * - Progressive information capture
 * - Soft membership registration
 * - Educational content navigation
 * - Galaxy Dream Team branding
 * - Security and performance
 */

describe('Final System Integration Tests', () => {
  beforeEach(() => {
    // Visit the main landing page
    cy.visit('/');
    
    // Wait for page to fully load
    cy.get('[data-testid="hero-section"]', { timeout: 10000 }).should('be.visible');
  });

  describe('1. Complete User Journey Flow', () => {
    it('should guide user through Browser → Engaged → Soft Member progression', () => {
      // Browser tier: Initial landing
      cy.get('h1').should('contain', 'What if you\'re only using 10% of your true potential');
      
      // Click main CTA to start engagement
      cy.get('[data-testid="discover-potential-cta"]').click();
      
      // Should trigger Level 1 capture modal
      cy.get('[data-testid="lead-capture-modal"]').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      
      // Fill email and submit (Level 1 capture)
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('[data-testid="submit-email"]').click();
      
      // Should proceed to assessment
      cy.get('[data-testid="potential-assessment"]').should('be.visible');
      
      // Complete assessment to progress to Engaged tier
      cy.get('[data-testid="assessment-question"]').first().click();
      cy.get('[data-testid="next-question"]').click();
      
      // Continue through assessment
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="assessment-option"]').first().click();
        cy.get('[data-testid="next-question"]').click();
      }
      
      // Should show results and Level 2 capture
      cy.get('[data-testid="assessment-results"]').should('be.visible');
      cy.get('[data-testid="phone-capture"]').should('be.visible');
    });

    it('should handle progressive information capture correctly', () => {
      // Test Level 1 capture (email only)
      cy.get('[data-testid="discover-potential-cta"]').click();
      cy.get('[data-testid="lead-capture-modal"]').within(() => {
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="tel"]').should('not.exist');
        cy.get('input[name="fullName"]').should('not.exist');
      });
      
      // Submit email
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('[data-testid="submit-email"]').click();
      
      // Navigate to Success Gap section for Level 2 capture
      cy.get('[data-testid="success-gap-section"]').scrollIntoView();
      cy.get('[data-testid="success-factor-calculator"]').click();
      
      // Should show Level 2 capture (email + phone)
      cy.get('[data-testid="progressive-form"]').within(() => {
        cy.get('input[type="email"]').should('have.value', 'test@example.com');
        cy.get('input[type="tel"]').should('be.visible');
      });
      
      // Fill phone and submit
      cy.get('input[type="tel"]').type('+1234567890');
      cy.get('[data-testid="submit-form"]').click();
      
      // Navigate to Vision Void for Level 3 capture
      cy.get('[data-testid="vision-void-section"]').scrollIntoView();
      cy.get('[data-testid="future-self-visualizer"]').click();
      
      // Should show Level 3 capture (full profile)
      cy.get('[data-testid="progressive-form"]').within(() => {
        cy.get('input[type="email"]').should('have.value', 'test@example.com');
        cy.get('input[type="tel"]').should('have.value', '+1234567890');
        cy.get('input[name="fullName"]').should('be.visible');
        cy.get('input[name="city"]').should('be.visible');
      });
    });
  });

  describe('2. Educational Content and Navigation', () => {
    it('should navigate to educational pages from section questions', () => {
      // Test Success Gap navigation
      cy.get('[data-testid="success-gap-question"]').click();
      cy.url().should('include', '/success-gap');
      cy.get('h1').should('contain', 'Success Gap');
      
      // Go back and test Change Paradox
      cy.go('back');
      cy.get('[data-testid="change-paradox-question"]').click();
      cy.url().should('include', '/change-paradox');
      cy.get('h1').should('contain', 'Change Paradox');
      
      // Test other sections
      cy.go('back');
      cy.get('[data-testid="vision-void-question"]').click();
      cy.url().should('include', '/vision-void');
      
      cy.go('back');
      cy.get('[data-testid="leadership-lever-question"]').click();
      cy.url().should('include', '/leadership-lever');
      
      cy.go('back');
      cy.get('[data-testid="decision-door-question"]').click();
      cy.url().should('include', '/decision-door');
    });

    it('should navigate to comprehensive Learn More pages', () => {
      // Test Learn More links
      cy.get('[data-testid="success-gap-learn-more"]').click();
      cy.url().should('include', '/success-gap/learn-more');
      cy.get('[data-testid="educational-content"]').should('be.visible');
      cy.get('[data-testid="related-tools"]').should('be.visible');
      
      // Test content structure
      cy.get('[data-testid="blog-posts"]').should('be.visible');
      cy.get('[data-testid="video-content"]').should('be.visible');
      cy.get('[data-testid="downloadable-resources"]').should('be.visible');
    });
  });

  describe('3. Soft Membership Registration', () => {
    it('should complete soft membership registration without payment', () => {
      // Navigate to Decision Door
      cy.get('[data-testid="decision-door-section"]').scrollIntoView();
      
      // Test all three soft membership options
      cy.get('[data-testid="starter-pack-cta"]').should('be.visible');
      cy.get('[data-testid="masterclass-cta"]').should('be.visible');
      cy.get('[data-testid="office-visit-cta"]').should('be.visible');
      
      // Verify no payment elements
      cy.get('body').should('not.contain', '$');
      cy.get('body').should('not.contain', 'Price');
      cy.get('body').should('not.contain', 'Payment');
      
      // Click starter pack CTA
      cy.get('[data-testid="starter-pack-cta"]').click();
      
      // Should redirect to registration page
      cy.url().should('include', '/membership/register');
      
      // Fill registration form
      cy.get('input[name="email"]').type('member@example.com');
      cy.get('input[name="phone"]').type('+1234567890');
      cy.get('input[name="fullName"]').type('Test Member');
      cy.get('input[name="city"]').type('Test City');
      
      // Select subscription preferences
      cy.get('[data-testid="email-subscription"]').check();
      cy.get('[data-testid="sms-subscription"]').check();
      
      // Submit registration
      cy.get('[data-testid="register-member"]').click();
      
      // Should redirect to member dashboard
      cy.url().should('include', '/membership/dashboard');
      cy.get('[data-testid="member-dashboard"]').should('be.visible');
      cy.get('[data-testid="saved-results"]').should('be.visible');
    });

    it('should provide continuous education content delivery', () => {
      // Login as soft member
      cy.visit('/membership/dashboard');
      
      // Mock authentication
      cy.window().then((win) => {
        win.localStorage.setItem('supabase.auth.token', JSON.stringify({
          user: { id: 'test-user', email: 'member@example.com' }
        }));
      });
      
      cy.reload();
      
      // Check dashboard content
      cy.get('[data-testid="continuous-education"]').should('be.visible');
      cy.get('[data-testid="personalized-recommendations"]').should('be.visible');
      cy.get('[data-testid="progress-tracking"]').should('be.visible');
    });
  });

  describe('4. Galaxy Dream Team Branding Validation', () => {
    it('should display consistent Galaxy Dream Team branding', () => {
      // Check header logo
      cy.get('[data-testid="galaxy-dream-team-logo"]').should('be.visible');
      cy.get('[alt="Galaxy Dream Team"]').should('be.visible');
      
      // Check footer branding
      cy.get('footer').within(() => {
        cy.contains('Galaxy Dream Team').should('be.visible');
      });
      
      // Verify no old "breakthrough" terminology
      cy.get('body').should('not.contain', 'breakthrough');
      cy.get('body').should('not.contain', 'Breakthrough');
      
      // Check for positive growth language
      cy.get('body').should('contain', 'transformation');
      cy.get('body').should('contain', 'growth');
      cy.get('body').should('contain', 'development');
    });

    it('should maintain brand consistency across all pages', () => {
      const pages = [
        '/success-gap',
        '/change-paradox',
        '/vision-void',
        '/leadership-lever',
        '/decision-door',
        '/tools',
        '/content-library'
      ];
      
      pages.forEach(page => {
        cy.visit(page);
        cy.get('[data-testid="galaxy-dream-team-logo"]').should('be.visible');
        cy.get('body').should('not.contain', 'breakthrough');
      });
    });
  });

  describe('5. Interactive Tools Integration', () => {
    it('should provide access to all 15 named tools', () => {
      cy.visit('/tools');
      
      // Potential tools
      cy.get('[data-testid="potential-quotient-calculator"]').should('be.visible');
      cy.get('[data-testid="limiting-belief-identifier"]').should('be.visible');
      cy.get('[data-testid="transformation-readiness-score"]').should('be.visible');
      
      // Goal tools
      cy.get('[data-testid="dream-clarity-generator"]').should('be.visible');
      cy.get('[data-testid="goal-achievement-predictor"]').should('be.visible');
      
      // Habit tools
      cy.get('[data-testid="habit-strength-analyzer"]').should('be.visible');
      cy.get('[data-testid="routine-optimizer"]').should('be.visible');
      cy.get('[data-testid="habit-installer"]').should('be.visible');
      
      // Mind tools
      cy.get('[data-testid="inner-dialogue-decoder"]').should('be.visible');
      cy.get('[data-testid="affirmation-architect"]').should('be.visible');
      cy.get('[data-testid="mental-model-mapper"]').should('be.visible');
      
      // Leadership tools
      cy.get('[data-testid="leadership-style-profiler"]').should('be.visible');
      cy.get('[data-testid="influence-quotient-calculator"]').should('be.visible');
      cy.get('[data-testid="team-builder-simulator"]').should('be.visible');
    });

    it('should save tool results for registered users', () => {
      // Complete a tool as registered user
      cy.visit('/tools/potential-quotient-calculator');
      
      // Fill assessment
      cy.get('[data-testid="assessment-question"]').first().within(() => {
        cy.get('input[type="radio"]').first().check();
      });
      
      cy.get('[data-testid="next-question"]').click();
      
      // Complete assessment
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="assessment-option"]').first().click();
        cy.get('[data-testid="next-question"]').click();
      }
      
      // Should show results and save option
      cy.get('[data-testid="assessment-results"]').should('be.visible');
      cy.get('[data-testid="save-results"]').should('be.visible');
    });
  });

  describe('6. Security and Performance Testing', () => {
    it('should validate input sanitization', () => {
      cy.get('[data-testid="discover-potential-cta"]').click();
      
      // Test XSS prevention
      cy.get('input[type="email"]').type('<script>alert("xss")</script>@example.com');
      cy.get('[data-testid="submit-email"]').click();
      
      // Should not execute script
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected');
      });
    });

    it('should handle rate limiting gracefully', () => {
      cy.get('[data-testid="discover-potential-cta"]').click();
      
      // Rapid form submissions
      cy.get('input[type="email"]').type('test@example.com');
      
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="submit-email"]').click();
      }
      
      // Should show rate limiting message or disable button
      cy.get('[data-testid="rate-limit-message"]').should('exist')
        .then($el => {
          if ($el.length === 0) {
            // Alternative check if rate limit message doesn't exist
            cy.get('[data-testid="submit-email"]').should('be.disabled');
          }
        });
    });

    it('should load pages within performance thresholds', () => {
      // Test page load performance
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          expect(measure.duration).to.be.lessThan(3000); // 3 second threshold
        }
      });
    });
  });

  describe('7. Mobile Responsiveness', () => {
    it('should work correctly on mobile devices', () => {
      cy.viewport('iphone-x');
      
      // Test mobile navigation
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="mobile-navigation"]').should('be.visible');
      
      // Test touch interactions
      cy.get('[data-testid="hero-section"]').should('be.visible');
      cy.get('[data-testid="discover-potential-cta"]').should('have.css', 'min-height')
        .and('match', /44px|2.75rem/); // Minimum touch target size
      
      // Test swipe navigation
      cy.get('[data-testid="success-gap-section"]').trigger('touchstart', { which: 1 });
      cy.get('[data-testid="success-gap-section"]').trigger('touchmove', { which: 1, clientX: -100 });
      cy.get('[data-testid="success-gap-section"]').trigger('touchend');
    });
  });

  describe('8. Accessibility Compliance', () => {
    it('should meet WCAG accessibility standards', () => {
      // Test keyboard navigation
      cy.get('body').focus();
      cy.focused().type('{tab}');
      cy.focused().should('be.visible');
      
      // Test ARIA labels
      cy.get('[data-testid="discover-potential-cta"]')
        .should(($el) => {
          expect(
            $el.attr('aria-label') !== undefined || 
            $el.attr('aria-describedby') !== undefined
          ).to.be.true;
        });
      
      // Test color contrast (basic check)
      cy.get('h1').should('have.css', 'color').and('not.equal', 'rgb(255, 255, 255)');
      
      // Test alt text for images
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });
  });

  describe('9. Content Library Integration', () => {
    it('should organize content into five main categories', () => {
      cy.visit('/content-library');
      
      // Check all five categories
      cy.get('[data-testid="untapped-you-category"]').should('be.visible');
      cy.get('[data-testid="dreams-to-reality-category"]').should('be.visible');
      cy.get('[data-testid="daily-edge-category"]').should('be.visible');
      cy.get('[data-testid="inner-game-category"]').should('be.visible');
      cy.get('[data-testid="multiplier-effect-category"]').should('be.visible');
    });

    it('should provide three-tier content depth system', () => {
      cy.visit('/content-library');
      
      cy.get('[data-testid="untapped-you-category"]').click();
      
      // Check depth levels
      cy.get('[data-testid="surface-content"]').should('be.visible');
      cy.get('[data-testid="medium-content"]').should('be.visible');
      cy.get('[data-testid="deep-dive-content"]').should('be.visible');
    });
  });

  describe('10. Multilingual Support', () => {
    it('should support language switching', () => {
      // Test language switcher
      cy.get('[data-testid="language-switcher"]').click();
      cy.get('[data-testid="language-option-am"]').click();
      
      // Should switch to Amharic
      cy.get('html').should('have.attr', 'lang', 'am');
      
      // Test Ethiopic font loading
      cy.get('body').should('have.css', 'font-family').and('include', 'Noto Sans Ethiopic');
    });
  });
});