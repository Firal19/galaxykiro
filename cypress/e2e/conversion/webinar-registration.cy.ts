describe('Webinar Registration Conversion Path', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should convert visitor to webinar registrant', () => {
    // Visit webinars page
    cy.visit('/webinars');
    
    // Check that webinar listings are visible
    cy.get('[data-testid="webinar-listing"]').should('be.visible');
    
    // Click on a webinar
    cy.get('[data-testid="webinar-card"]').first().click();
    
    // Check that webinar details are shown
    cy.get('[data-testid="webinar-details"]').should('be.visible');
    
    // Click register button
    cy.get('[data-testid="webinar-registration-button"]').click();
    
    // Fill in registration form
    cy.get('[data-testid="webinar-registration-form"]').should('be.visible');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="email"]').type('test@example.com');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="firstName"]').type('Test');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="lastName"]').type('User');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="phone"]').type('1234567890');
    
    // Submit form
    cy.get('[data-testid="webinar-registration-form"]').find('button[type="submit"]').click();
    
    // Check confirmation page
    cy.get('[data-testid="webinar-confirmation"]').should('be.visible');
    cy.get('[data-testid="webinar-confirmation"]').contains('You\'re registered!');
    
    // Check that calendar invite is available
    cy.get('[data-testid="calendar-invite-button"]').should('be.visible');
    
    // Check that lead score has been updated with webinar registration
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.leadScore).to.exist;
      expect(userData.leadScore.webinarRegistrationScore).to.be.greaterThan(0);
    });
    
    // Check that soft membership CTA is shown
    cy.get('[data-testid="soft-membership-cta"]').should('be.visible');
  });

  it('should convert visitor to webinar registrant through Decision Door CTA', () => {
    // Visit home page
    cy.visit('/');
    
    // Scroll to Decision Door section
    cy.get('[data-testid="decision-door-section"]').scrollIntoView();
    
    // Click on "Join Free Masterclass" CTA
    cy.get('[data-testid="join-masterclass-cta"]').click();
    
    // Check that we're redirected to webinar registration
    cy.url().should('include', '/webinars');
    
    // Select a webinar
    cy.get('[data-testid="webinar-card"]').first().click();
    cy.get('[data-testid="webinar-registration-button"]').click();
    
    // Fill in registration form
    cy.get('[data-testid="webinar-registration-form"]').should('be.visible');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="email"]').type('test@example.com');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="firstName"]').type('Test');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="lastName"]').type('User');
    cy.get('[data-testid="webinar-registration-form"]').find('input[name="phone"]').type('1234567890');
    
    // Submit form
    cy.get('[data-testid="webinar-registration-form"]').find('button[type="submit"]').click();
    
    // Check confirmation page
    cy.get('[data-testid="webinar-confirmation"]').should('be.visible');
    
    // Check that lead score has been updated
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.leadScore).to.exist;
      expect(userData.leadScore.webinarRegistrationScore).to.be.greaterThan(0);
    });
  });

  it('should handle webinar attendance tracking', () => {
    // Set up user data with webinar registration
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        webinarRegistrations: [{
          webinarId: 'test-webinar-1',
          registeredAt: new Date().toISOString(),
          attended: false
        }]
      }));
    });
    
    // Visit webinar attendance page (simulating clicking a link from email)
    cy.visit('/webinars/test-webinar-1/attend?token=test-token');
    
    // Check that webinar room is shown
    cy.get('[data-testid="webinar-room"]').should('be.visible');
    
    // Simulate watching the webinar for some time
    cy.clock();
    cy.tick(600000); // 10 minutes
    
    // Check that attendance is tracked
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user_data') || '{}');
      expect(userData.webinarRegistrations[0].attended).to.be.true;
      expect(userData.webinarRegistrations[0].attendanceMinutes).to.be.greaterThan(0);
      expect(userData.leadScore.totalScore).to.be.greaterThan(70); // Should be soft member tier
    });
    
    // Check that post-webinar CTA is shown
    cy.get('[data-testid="post-webinar-cta"]').should('be.visible');
  });
});