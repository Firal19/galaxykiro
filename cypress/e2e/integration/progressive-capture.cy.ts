describe('Progressive Information Capture System', () => {
  beforeEach(() => {
    // Clear local storage and cookies before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should capture email for Level 1 tools', () => {
    // Visit the home page
    cy.visit('/');
    
    // Click on a Level 1 tool (Potential Assessment)
    cy.get('[data-testid="hero-cta-button"]').click();
    
    // Check that the modal requires only email
    cy.get('[data-testid="lead-capture-modal"]').should('be.visible');
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').should('be.visible');
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="tel"]').should('not.exist');
    
    // Fill in the email and submit
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Check that the assessment starts
    cy.get('[data-testid="potential-assessment"]').should('be.visible');
    
    // Check that the email was saved
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.email).to.equal('test@example.com');
      expect(userData.captureLevel).to.equal(1);
    });
  });

  it('should capture phone for Level 2 tools', () => {
    // Set up Level 1 data
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify({
        email: 'test@example.com',
        captureLevel: 1,
        captureTimestamps: {
          level1: new Date().toISOString()
        }
      }));
    });
    
    // Visit the home page
    cy.visit('/');
    
    // Scroll to Change Paradox section
    cy.get('[data-testid="change-paradox-section"]').scrollIntoView();
    
    // Click on a Level 2 tool (Habit Strength Analyzer)
    cy.get('[data-testid="habit-strength-analyzer"]').click();
    
    // Check that the form requires phone number and has pre-filled email
    cy.get('[data-testid="progressive-form"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').should('have.value', 'test@example.com');
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').should('be.visible');
    
    // Fill in phone and submit
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').type('1234567890');
    cy.get('[data-testid="progressive-form"]').find('button[type="submit"]').click();
    
    // Check that the tool starts
    cy.get('[data-testid="habit-strength-analyzer-tool"]').should('be.visible');
    
    // Check that the phone was saved
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.email).to.equal('test@example.com');
      expect(userData.phone).to.equal('1234567890');
      expect(userData.captureLevel).to.equal(2);
    });
  });

  it('should capture full profile for Level 3 tools', () => {
    // Set up Level 2 data
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify({
        email: 'test@example.com',
        phone: '1234567890',
        captureLevel: 2,
        captureTimestamps: {
          level1: new Date().toISOString(),
          level2: new Date().toISOString()
        }
      }));
    });
    
    // Visit the home page
    cy.visit('/');
    
    // Scroll to Vision Void section
    cy.get('[data-testid="vision-void-section"]').scrollIntoView();
    
    // Click on a Level 3 tool (Future Self Visualizer)
    cy.get('[data-testid="future-self-visualizer"]').click();
    
    // Check that the form requires full profile and has pre-filled data
    cy.get('[data-testid="progressive-form"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').should('have.value', 'test@example.com');
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').should('have.value', '1234567890');
    cy.get('[data-testid="progressive-form"]').find('input[name="firstName"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[name="lastName"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[name="city"]').should('be.visible');
    
    // Fill in full profile and submit
    cy.get('[data-testid="progressive-form"]').find('input[name="firstName"]').type('Test');
    cy.get('[data-testid="progressive-form"]').find('input[name="lastName"]').type('User');
    cy.get('[data-testid="progressive-form"]').find('input[name="city"]').type('Addis Ababa');
    cy.get('[data-testid="progressive-form"]').find('button[type="submit"]').click();
    
    // Check that the tool starts
    cy.get('[data-testid="future-self-visualizer-tool"]').should('be.visible');
    
    // Check that the full profile was saved
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.email).to.equal('test@example.com');
      expect(userData.phone).to.equal('1234567890');
      expect(userData.firstName).to.equal('Test');
      expect(userData.lastName).to.equal('User');
      expect(userData.city).to.equal('Addis Ababa');
      expect(userData.captureLevel).to.equal(3);
    });
  });

  it('should pre-populate forms with existing user data', () => {
    // Set up full user data
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify({
        email: 'test@example.com',
        phone: '1234567890',
        firstName: 'Test',
        lastName: 'User',
        city: 'Addis Ababa',
        captureLevel: 3,
        captureTimestamps: {
          level1: new Date().toISOString(),
          level2: new Date().toISOString(),
          level3: new Date().toISOString()
        }
      }));
    });
    
    // Visit webinar registration page
    cy.visit('/webinars');
    cy.get('[data-testid="webinar-card"]').first().click();
    cy.get('[data-testid="webinar-registration-button"]').click();
    
    // Check that the form is pre-populated
    cy.get('[data-testid="webinar-registration-form"]').should('be.visible');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="email"]').should('have.value', 'test@example.com');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="firstName"]').should('have.value', 'Test');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="lastName"]').should('have.value', 'User');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="phone"]').should('have.value', '1234567890');
  });

  it('should persist form data during completion', () => {
    // Visit the home page
    cy.visit('/');
    
    // Click on a Level 3 tool (Future Self Visualizer)
    cy.get('[data-testid="vision-void-section"]').scrollIntoView();
    cy.get('[data-testid="future-self-visualizer"]').click();
    
    // Start filling the form
    cy.get('[data-testid="progressive-form"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').type('test@example.com');
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').type('1234567890');
    cy.get('[data-testid="progressive-form"]').find('input[name="firstName"]').type('Test');
    
    // Simulate page reload
    cy.reload();
    
    // Check that the form data was persisted
    cy.get('[data-testid="progressive-form"]').should('be.visible');
    cy.get('[data-testid="progressive-form"]').find('input[type="email"]').should('have.value', 'test@example.com');
    cy.get('[data-testid="progressive-form"]').find('input[type="tel"]').should('have.value', '1234567890');
    cy.get('[data-testid="progressive-form"]').find('input[name="firstName"]').should('have.value', 'Test');
  });

  it('should validate form inputs before submission', () => {
    // Visit the home page
    cy.visit('/');
    
    // Click on a Level 1 tool
    cy.get('[data-testid="hero-cta-button"]').click();
    
    // Try to submit without email
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Check for validation error
    cy.get('[data-testid="lead-capture-modal"]').find('[data-testid="error-message"]').should('be.visible');
    
    // Enter invalid email
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').type('invalid-email');
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Check for validation error
    cy.get('[data-testid="lead-capture-modal"]').find('[data-testid="error-message"]').should('be.visible');
    
    // Enter valid email
    cy.get('[data-testid="lead-capture-modal"]').find('input[type="email"]').clear().type('test@example.com');
    cy.get('[data-testid="lead-capture-modal"]').find('button[type="submit"]').click();
    
    // Check that the form was submitted successfully
    cy.get('[data-testid="potential-assessment"]').should('be.visible');
  });
});