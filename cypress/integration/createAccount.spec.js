describe('Create Account', () => {
    
    it('LandingPage successfully loads', function() {
        cy.visit('/');

        // Header renders
        cy.get('div.navbar-brand a')
            .should('have.text', 'Caltrain Delay Watch');
        
        // Content renders
        cy.get('div.is-size-3')
            .should('have.text', 'Your commute just became a lot more reliable');

        // Footer renders
        cy.get('footer strong')
            .should('have.text', 'Caltrain Delay Watch');
    });

    it('CreateAccount page successfully loads', function() {
        cy.get('button.is-primary')
            .should('have.text', 'Create an account')
            .click();
        
        cy.get('div.is-size-5 div')
            .should('have.text', 'Create Account');

        // TODO: Check other labels

        // TODO: Check button text
    });

    it('Creates account with Web App Only notification', function() {
        // TODO
    });

    it('Creates account with Text Message notification', function() {
        // TODO
    });

    it('Redirects to the Dashboard when logged in', function() {
        // TODO
    });

    it('Submit button is disabled until all fields are filled out', function() {
        // TODO
    });

    it('Phone number field is removed when Web App Only is selected', function() {
        // TODO
    });

    it('Phone number input is preserved when switching between Text Message and Web App Only', function () {
        // TODO
    });

    it('Displays correct errors when missing required inputs', function() {
        // TODO
    });

    it('Displays correct errors when inputs are the wrong format', function() {
        // TODO
    });

    it('Stores phone numbers with +1 in front', function() {
        // TODO
    });

    it('Displays a modal with an error message when an email address already has an account', function() {
        // TODO
    });

    it('Bottom link redirects to the login page', function() {
        // TODO
    });
});