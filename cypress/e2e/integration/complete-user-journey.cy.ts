/**
 * Complete User Journey End-to-End Tests
 * Tests the full user experience from browser to soft member
 */

describe('Complete User Journey Integration', () => {
  beforeEach(() => {
    // Clear all data before each test
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Mock Supabase responses
    cy.intercept('POST', '**/auth/v1/signup', {
      statusCode: 200,
      body: { user: { id: 'test-user', email: 'test@example.com' } }
    }).as('signUp');
    
    cy.intercept('POST', '**/rest/v1/users', {
      statusCode: 201,
      body: { id: 'test-user' }
    }).as('createUser');
    
    cy.intercept('GET', '**/rest/v1/users*', {
      statusCode: 200,
      body: { id: 'test-user', email: 'test@example.com', captureLevel: 1 }
    }).as('getUser');
  });

  describe('Browser to Engaged User Journey', () => {
    it('should complete the full progression from landing to Level 2 capture', () => {
      cy.visit('/');
      
      // 1. Landing page interaction
      cy.get('[data-testid="hero-section"]').should('be.visible');
      cy.get('[data-testid="animated-counter"]').should('contain', '10%');
      
      // 2. Video testimonial interaction
      cy.get('[data-testid="video-testimonial"]').click();
      cy.get('[data-testid="video-player"]').should('be.visible');
      
      // 3. Primary CTA interaction
      cy.get('[data-testid="primary-cta"]').click();
      
      // 4. Level 1 capture modal
      cy.get('[data-testid="lead-capture-modal"]').should('be.visible');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="submit-email"]').click();
      
      cy.wait('@createUser');
      
      // 5. Assessment delivery
      cy.get('[data-testid="potential-assessment"]').should('be.visible');
      cy.get('[data-testid="start-assessment"]').click();
      
      // Complete assessment
      cy.get('[data-testid="assessment-question"]').should('be.visible');
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="answer-option-0"]').click();
        cy.get('[data-testid="next-question"]').click();
      }
      
      // 6. Results and progression
      cy.get('[data-testid="assessment-results"]').should('be.visible');
      cy.get('[data-testid="engagement-score"]').should('exist');
      
      // 7. Scroll to Success Gap section
      cy.get('[data-testid="success-gap-section"]').scrollIntoView();
      cy.get('[data-testid="success-gap-question"]').should('be.visible');
      
      // 8. Enhanced hook display
      cy.get('[data-testid="success-gap-hook"]').should('contain', 'Understanding success factors');
      
      // 9. Success Factor Calculator interaction
      cy.get('[data-testid="success-factor-calculator"]').click();
      
      // 10. Level 2 capture (phone number)
      cy.get('[data-testid="phone-capture-modal"]').should('be.visible');
      cy.get('[data-testid="phone-input"]').type('+1234567890');
      cy.get('[data-testid="submit-phone"]').click();
      
      // 11. Tool completion
      cy.get('[data-testid="calculator-questions"]').should('be.visible');
      cy.get('[data-testid="habit-question-1"]').click();
      cy.get('[data-testid="habit-question-2"]').click();
      cy.get('[data-testid="calculate-score"]').click();
      
      // 12. Results with Success Probability Score
      cy.get('[data-testid="success-probability-score"]').should('be.visible');
      cy.get('[data-testid="score-visualization"]').should('exist');
    });
  });

  describe('Engaged to Soft Member Journey', () => {
    beforeEach(() => {
      // Set up engaged user state
      cy.window().then((win) => {
        win.localStorage.setItem('userTier', 'engaged');
        win.localStorage.setItem('captureLevel', '2');
        win.localStorage.setItem('engagementScore', '45');
      });
    });

    it('should complete progression to soft membership', () => {
      cy.visit('/');
      
      // 1. Continue to Change Paradox section
      cy.get('[data-testid="change-paradox-section"]').scrollIntoView();
      cy.get('[data-testid="change-paradox-question"]').click();
      
      // Should navigate to educational page
      cy.url().should('include', '/change-paradox');
      cy.get('[data-testid="educational-content"]').should('be.visible');
      
      // 2. Return and engage with Habit Strength Analyzer
      cy.go('back');
      cy.get('[data-testid="habit-strength-analyzer"]').click();
      
      // 3. Level 3 capture (name and city)
      cy.get('[data-testid="name-city-capture"]').should('be.visible');
      cy.get('[data-testid="name-input"]').type('John Doe');
      cy.get('[data-testid="city-input"]').type('New York');
      cy.get('[data-testid="submit-profile"]').click();
      
      // 4. Complete habit analysis
      cy.get('[data-testid="habit-loop-visualization"]').should('be.visible');
      cy.get('[data-testid="habit-questions"]').should('exist');
      
      // Answer habit questions
      for (let i = 0; i < 3; i++) {
        cy.get(`[data-testid="habit-answer-${i}"]`).click();
      }
      cy.get('[data-testid="analyze-habits"]').click();
      
      // 5. Results and soft membership offer
      cy.get('[data-testid="habit-analysis-results"]').should('be.visible');
      cy.get('[data-testid="soft-membership-offer"]').should('be.visible');
      
      // 6. Register for soft membership
      cy.get('[data-testid="register-soft-member"]').click();
      
      // 7. Subscription options
      cy.get('[data-testid="subscription-options"]').should('be.visible');
      cy.get('[data-testid="email-subscription"]').click();
      cy.get('[data-testid="complete-registration"]').click();
      
      // 8. Soft member dashboard
      cy.get('[data-testid="soft-member-dashboard"]').should('be.visible');
      cy.get('[data-testid="saved-results"]').should('contain', 'Potential Assessment');
      cy.get('[data-testid="saved-results"]').should('contain', 'Habit Analysis');
    });
  });

  describe('Educational Content Navigation', () => {
    it('should navigate through all educational pages', () => {
      const sections = [
        'success-gap',
        'change-paradox', 
        'vision-void',
        'leadership-lever',
        'decision-door'
      ];
      
      sections.forEach((section) => {
        cy.visit('/');
        
        // Click section question
        cy.get(`[data-testid="${section}-question"]`).click();
        
        // Verify navigation to educational page
        cy.url().should('include', `/${section}`);
        
        // Verify educational content
        cy.get('[data-testid="educational-content"]').should('be.visible');
        cy.get('[data-testid="content-categories"]').should('exist');
        
        // Check Learn More link
        cy.get(`[data-testid="${section}-learn-more"]`).click();
        cy.url().should('include', `/${section}/learn-more`);
        
        // Verify comprehensive content
        cy.get('[data-testid="comprehensive-content"]').should('be.visible');
        cy.get('[data-testid="blog-posts"]').should('exist');
        cy.get('[data-testid="video-content"]').should('exist');
        cy.get('[data-testid="downloadable-resources"]').should('exist');
      });
    });
  });

  describe('Galaxy Dream Team Branding Validation', () => {
    it('should display consistent branding across all pages', () => {
      const pages = [
        '/',
        '/success-gap',
        '/change-paradox',
        '/vision-void', 
        '/leadership-lever',
        '/decision-door',
        '/tools',
        '/content-library',
        '/webinars'
      ];
      
      pages.forEach((page) => {
        cy.visit(page);
        
        // Check header logo
        cy.get('[data-testid="galaxy-dream-team-logo"]').should('be.visible');
        
        // Check company name in content
        cy.get('body').should('contain', 'Galaxy Dream Team');
        
        // Check footer branding
        cy.get('[data-testid="galaxy-dream-team-footer"]').should('be.visible');
        
        // Check contact information
        cy.get('[data-testid="company-contact"]').should('contain', 'Galaxy Dream Team');
      });
    });
  });

  describe('Tool Suite Integration', () => {
    it('should access all 15 named tools with progressive capture', () => {
      const tools = [
        // Potential tools
        { name: 'potential-quotient-calculator', captureLevel: 1 },
        { name: 'limiting-belief-identifier', captureLevel: 2 },
        { name: 'transformation-readiness-score', captureLevel: 3 },
        
        // Goal tools
        { name: 'dream-clarity-generator', captureLevel: 1 },
        { name: 'goal-achievement-predictor', captureLevel: 2 },
        { name: 'life-wheel-diagnostic', captureLevel: 3 },
        
        // Habit tools
        { name: 'habit-strength-analyzer', captureLevel: 1 },
        { name: 'routine-optimizer', captureLevel: 2 },
        { name: 'habit-installer', captureLevel: 3 },
        
        // Mind tools
        { name: 'inner-dialogue-decoder', captureLevel: 1 },
        { name: 'affirmation-architect', captureLevel: 2 },
        { name: 'mental-model-mapper', captureLevel: 3 },
        
        // Leadership tools
        { name: 'leadership-style-profiler', captureLevel: 1 },
        { name: 'influence-quotient-calculator', captureLevel: 2 },
        { name: 'team-builder-simulator', captureLevel: 3 }
      ];
      
      tools.forEach((tool) => {
        cy.visit('/tools');
        
        // Click on tool
        cy.get(`[data-testid="${tool.name}"]`).click();
        
        // Verify tool page loads
        cy.url().should('include', `/tools/${tool.name}`);
        cy.get('[data-testid="tool-interface"]').should('be.visible');
        
        // Verify appropriate capture level required
        if (tool.captureLevel === 1) {
          cy.get('[data-testid="email-capture"]').should('be.visible');
        } else if (tool.captureLevel === 2) {
          cy.get('[data-testid="phone-capture"]').should('be.visible');
        } else {
          cy.get('[data-testid="full-profile-capture"]').should('be.visible');
        }
      });
    });
  });

  describe('Micro-Conversion Widgets', () => {
    it('should display and interact with micro-conversion elements', () => {
      cy.visit('/');
      
      // 1. Floating Curiosity Bar (appears after 30 seconds)
      cy.wait(31000);
      cy.get('[data-testid="floating-curiosity-bar"]').should('be.visible');
      cy.get('[data-testid="rotating-question"]').should('exist');
      
      // Click curiosity bar
      cy.get('[data-testid="curiosity-bar-cta"]').click();
      cy.get('[data-testid="tool-access-modal"]').should('be.visible');
      
      // 2. Exit Intent Capture
      cy.get('body').trigger('mouseleave');
      cy.get('[data-testid="exit-intent-modal"]').should('be.visible');
      cy.get('[data-testid="exit-intent-message"]').should('contain', 'potential assessment is ready');
      
      // 3. Scroll Triggered Reveals
      cy.scrollTo('bottom');
      cy.get('[data-testid="scroll-reveal"]').should('be.visible');
      cy.get('[data-testid="mini-cta"]').should('exist');
    });
  });

  describe('Performance and Mobile Responsiveness', () => {
    it('should perform well on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      
      // Check mobile layout
      cy.get('[data-testid="mobile-navigation"]').should('be.visible');
      cy.get('[data-testid="thumb-zone-layout"]').should('exist');
      
      // Test swipe navigation
      cy.get('[data-testid="swipe-section"]').trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] });
      cy.get('[data-testid="swipe-section"]').trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] });
      cy.get('[data-testid="swipe-section"]').trigger('touchend');
      
      // Verify section navigation
      cy.get('[data-testid="next-section"]').should('be.visible');
      
      // Test touch interactions
      cy.get('[data-testid="touch-button"]').should('have.css', 'min-height', '44px');
      cy.get('[data-testid="touch-input"]').should('have.css', 'min-height', '44px');
    });
  });

  describe('Offline Functionality', () => {
    it('should work offline with service worker', () => {
      cy.visit('/');
      
      // Register service worker
      cy.window().then((win) => {
        return win.navigator.serviceWorker.register('/sw.js');
      });
      
      // Go offline
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new Event('offline'));
      });
      
      // Verify offline indicator
      cy.get('[data-testid="offline-indicator"]').should('be.visible');
      
      // Test offline tool functionality
      cy.get('[data-testid="potential-quotient-calculator"]').click();
      cy.get('[data-testid="offline-tool-interface"]').should('be.visible');
      
      // Complete assessment offline
      cy.get('[data-testid="start-offline-assessment"]').click();
      cy.get('[data-testid="offline-results"]').should('be.visible');
    });
  });
});