describe('Login', () => {
    it('should login successfully with correct credentials', () => {
      cy.visit('/login');
  
      cy.get('input[name="email"]').type('user@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'Welcome');
    });
  
    it('should show an error message with incorrect credentials', () => {
      cy.visit('/login');
  
      cy.get('input[name="email"]').type('user@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.get('.error-message').should('be.visible').and('contain', 'Invalid credentials');
      cy.url().should('include', '/login');
    });
  });