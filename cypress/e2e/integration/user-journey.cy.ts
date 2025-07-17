describe('User Journey Flows', () => {
  beforeEach(() => {
    // Clear local storage and cookies before each test
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Visit the home page
    cy.visit('/');
  });

  it('should navigate through the curiosity cascade sections', () => {
    // Check hero section is visible
    cy.get('[data-testid="hero-section"]').should('be.visible');
    cy.get('[data-testid="hero-section"]').contains('What if you\'re only using 10% of your true potential?');
    
    // Scroll to Success Gap section
    cy.get('[data-testid="success-gap-section"]').scrollIntoView();
    cy.get('[data-testid="success-gap-section"]').should('be.visible');
    cy.get('[data-testid="success-gap-section"]').contains('Why do some people achieve their dreams while others just dream?');
    
    // Scroll to Change Paradox section
    cy.get('[data-testid="change-paradox-section"]').scrollIntoView();
    cy.get('[data-testid="change-paradox-section"]').should('be.visible');
    cy.get('[data-testid="change-paradox-section"]').contains('You know what to do. So why aren\'t you doing it?');
    
    // Scroll to Vision Void section
    cy.get('[data-testid="vision-void-section"]').scrollIntoView();
    cy.get('[data-testid="vision-void-section"]').should('be.visible');
    cy.get('[data-testid="vision-void-section"]').contains('Can you describe your life 5 years from now in detail?');
    
    // Scroll to Leadership Lever section
    cy.get('[data-testid="leadership-lever-section"]').scrollIntoView();
    cy.get('[data-testid="leadership-lever-section"]').should('be.visible');
    cy.get('[data-testid="leadership-lever-section"]').contains('Are you leading your life, or is life leading you?');
    
    // Scroll to Decision Door section
    cy.get('[data-testid="decision-door-section"]').scrollIntoView();
    cy.get('[data-testid="decision-door-section"]').should('be.visible');
    cy.get('[data-testid="decision-door-section"]').contains('You\'re standing at the Decision Door');
  });

  it('should open lead capture modal from hero section', () => {
    // Click on the CTA button in the hero section
    cy.get('[data-testid="hero-cta-button"]').click();
    
    // Check that the lead capture modal is visible
    cy.get('[data-testid="lead-capture-modal"]').should('be.visible');
    
    // Check that the modal requires only email (Level 1)
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').should('be.visible');
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="tel"]').should('not.exist');
    
    // Fill in the email and submit
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Check that the assessment starts
    cy.get('[data-testid="potential-assessment"]').should('be.visible');
  });

  it('should progressively capture user information through tools', () => {
    // Start with Level 1 tool (email only)
    cy.get('[data-testid="success-gap-section"]').scrollIntoView();
    cy.get('[data-testid="success-factor-calculator"]').click();
    
    // Should show Level 1 capture form
    cy.get('[data-testid="progressive-form"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').should('not.exist');
    
    // Fill in email and submit
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="progressive-form"]').find('button[type="submit"]').click();
    
    // Should show the Success Factor Calculator
    cy.get('[data-testid="success-factor-calculator-tool"]').should('be.visible');
    cy.get('[data-testid="success-factor-calculator-tool"]').find('button[type="submit"]').click();
    
    // Now try Level 2 tool (requires phone)
    cy.visit('/');
    cy.get('[data-testid="change-paradox-section"]').scrollIntoView();
    cy.get('[data-testid="habit-strength-analyzer"]').click();
    
    // Should show Level 2 capture form with pre-filled email
    cy.get('[data-testid="progressive-form"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').should('have.value', 'test@example.com');
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').should('be.visible');
    
    // Fill in phone and submit
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').type('1234567890');
    cy.get('[data-testid="progressive-form"]').find('button[type="submit"]').click();
    
    // Should show the Habit Strength Analyzer
    cy.get('[data-testid="habit-strength-analyzer-tool"]').should('be.visible');
  });

  it('should track user journey and update engagement score', () => {
    // Visit multiple pages to increase page view count
    cy.visit('/');
    cy.visit('/success-gap');
    cy.visit('/change-paradox');
    cy.visit('/vision-void');
    
    // Use a tool to increase tool usage count
    cy.visit('/');
    cy.get('[data-testid="success-gap-section"]').scrollIntoView();
    cy.get('[data-testid="success-factor-calculator"]').click();
    
    // Fill in email and submit
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="progressive-form"]').find('button[type="submit"]').click();
    
    // Complete the tool
    cy.get('[data-testid="success-factor-calculator-tool"]').should('be.visible');
    cy.get('[data-testid="success-factor-calculator-tool"]').find('button[type="submit"]').click();
    
    // Check that the lead score has been updated
    cy.window().then((win) => {
      // Check localStorage for lead score data
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.leadScore).to.exist;
      expect(userData.leadScore.pageViewsScore).to.be.greaterThan(0);
      expect(userData.leadScore.toolUsageScore).to.be.greaterThan(0);
    });
  });

  it('should register for a webinar and track attendance', () => {
    // Visit webinars page
    cy.visit('/webinars');
    
    // Click on a webinar
    cy.get('[data-testid="webinar-card"]').first().click();
    
    // Click register button
    cy.get('[data-testid="webinar-registration-button"]').click();
    
    // Fill in registration form
    cy.get('[data-testid="webinar-registration-form"]').should('be.visible');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="email"]').type('test@example.com');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="firstName"]').type('Test');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="lastName"]').type('User');
    cy.get('[data-testid="webinar-registration-form"]').find('button[type="submit"]').click();
    
    // Check confirmation page
    cy.get('[data-testid="webinar-confirmation"]').should('be.visible');
    cy.get('[data-testid="webinar-confirmation"]').contains('You\'re registered!');
    
    // Check that lead score has been updated with webinar registration
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.leadScore).to.exist;
      expect(userData.leadScore.webinarRegistrationScore).to.be.greaterThan(0);
    });
  });

  it('should book an office visit', () => {
    // Visit office visit page
    cy.visit('/office-visit-test');
    
    // Click on book appointment button
    cy.get('[data-testid="book-appointment-button"]').click();
    
    // Select office location
    cy.get('[data-testid="office-location-select"]').select('Addis Ababa');
    
    // Select date and time
    cy.get('[data-testid="date-picker"]').click();
    cy.get('.rdp-day').not('.rdp-day_disabled').first().click();
    cy.get('[data-testid="time-slot"]').first().click();
    
    // Fill in contact information
    cy.get('[data-testid="office-visit-form"]').find('input[name="email"]').type('test@example.com');
    cy.get('[data-testid="office-visit-form"]').find('input[name="phone"]').type('1234567890');
    cy.get('[data-testid="office-visit-form"]').find('input[name="name"]').type('Test User');
    
    // Submit form
    cy.get('[data-testid="office-visit-form"]').find('button[type="submit"]').click();
    
    // Check confirmation page
    cy.get('[data-testid="office-visit-confirmation"]').should('be.visible');
    cy.get('[data-testid="office-visit-confirmation"]').contains('Your appointment is confirmed');
  });

  it('should register for soft membership', () => {
    // Visit membership registration page
    cy.visit('/membership/register');
    
    // Fill in registration form
    cy.get('[data-testid="soft-membership-form"]').find('input[name="email"]').type('test@example.com');
    cy.get('[data-testid="soft-membership-form"]').find('input[name="firstName"]').type('Test');
    cy.get('[data-testid="soft-membership-form"]').find('input[name="lastName"]').type('User');
    cy.get('[data-testid="soft-membership-form"]').find('input[name="phone"]').type('1234567890');
    
    // Select communication preferences
    cy.get('[data-testid="communication-preference-email"]').check();
    cy.get('[data-testid="communication-preference-sms"]').check();
    
    // Submit form
    cy.get('[data-testid="soft-membership-form"]').find('button[type="submit"]').click();
    
    // Check dashboard redirect
    cy.url().should('include', '/membership/dashboard');
    cy.get('[data-testid="membership-dashboard"]').should('be.visible');
    cy.get('[data-testid="membership-dashboard"]').contains('Welcome to your membership dashboard');
  });
});