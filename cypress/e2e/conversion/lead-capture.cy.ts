describe('Lead Capture Conversion Path', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
  });

  it('should convert visitor to lead through hero section CTA', () => {
    // Click on the CTA button in the hero section
    cy.get('[data-testid="hero-cta-button"]').click();
    
    // Fill in the email and submit
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Complete the assessment
    cy.get('[data-testid="potential-assessment"]').should('be.visible');
    
    // Answer all questions in the assessment
    cy.get('[data-testid="assessment-question"]').each(($question, index) => {
      // Select an answer (assuming multiple choice)
      cy.wrap($question).find('input[type="radio"]').first().check();
      
      // Click next button
      cy.get('[data-testid="assessment-next-button"]').click();
    });
    
    // Check that the assessment results are shown
    cy.get('[data-testid="assessment-results"]').should('be.visible');
    
    // Check that the lead was created in the system
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.email).to.equal('test@example.com');
      expect(userData.leadScore).to.exist;
      expect(userData.toolUsage).to.exist;
    });
    
    // Check that the soft membership CTA is shown
    cy.get('[data-testid="soft-membership-cta"]').should('be.visible');
    
    // Click on the soft membership CTA
    cy.get('[data-testid="soft-membership-cta"]').click();
    
    // Check that we're redirected to the membership registration page
    cy.url().should('include', '/membership/register');
  });

  it('should convert visitor to lead through floating curiosity bar', () => {
    // Wait for the floating curiosity bar to appear (after 30 seconds)
    cy.clock();
    cy.tick(31000);
    cy.get('[data-testid="floating-curiosity-bar"]').should('be.visible');
    
    // Click on a question in the curiosity bar
    cy.get('[data-testid="curiosity-question"]').first().click();
    
    // Check that the lead capture modal appears
    cy.get('[data-testid="lead-capture-modal"]').should('be.visible');
    
    // Fill in the email and submit
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Check that the tool related to the question is shown
    cy.get('[data-testid="tool-container"]').should('be.visible');
    
    // Check that the lead was created in the system
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.email).to.equal('test@example.com');
    });
  });

  it('should convert visitor to lead through exit intent', () => {
    // Trigger exit intent
    cy.get('body').trigger('mouseleave', { clientY: -10, force: true });
    
    // Check that the exit intent modal appears
    cy.get('[data-testid="exit-intent-capture"]').should('be.visible');
    
    // Fill in the email and submit
    cy.get('[data-testid="exit-intent-capture"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="exit-intent-capture"]').find('button[type="submit"]').click();
    
    // Check that the assessment starts
    cy.get('[data-testid="potential-assessment"]').should('be.visible');
    
    // Check that the lead was created in the system
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.email).to.equal('test@example.com');
    });
  });
});