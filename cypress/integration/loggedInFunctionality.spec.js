describe('Logged In Functionality', () => {

    beforeEach(() => {
        
        // Fixtures
        cy.fixture('loginSuccess.json').as('loginSuccessJSON');
        cy.fixture('fetchUserDataSuccess.json').as('fetchUserDataSuccessJSON');
        cy.fixture('fetchCurrentStatusSuccess.json').as('fetchCurrentStatusSuccessJSON');

        const email = 'test@test.com'; // should match fetchUserDataSuccess fixture

        // Network stubs
        cy.server();

        const backendUrl = Cypress.env('backendUrl');

        // Authentication
        cy.route('POST', `${backendUrl}/api/auth/login`, '@loginSuccessJSON').as('submitLogin');
        
        // GET
        cy.route('GET', `${backendUrl}/api/user-data`, '@fetchUserDataSuccessJSON').as('fetchUserData');
        cy.route('GET', `${backendUrl}/api/current-status`, '@fetchCurrentStatusSuccessJSON').as('fetchCurrentStatus');
        
        // // PUT
        // cy.route('PUT', `${backendUrl}/users/${userId}/sprints/*.json?auth=*`, {}).as('addOrUpdateSprint');
        // cy.route('PUT', `${backendUrl}/users/${userId}/sprints/*/projects/*.json?auth=*`, {}).as('addOrUpdateProjectOnSprint');
        // cy.route('PUT', `${backendUrl}/users/${userId}/queue/*.json?auth=*`, {}).as('addOrUpdateProjectOnQueue');

        // // DELETE
        // cy.route('DELETE', `${backendUrl}/users/${userId}/sprints/*.json?auth=*`, {}).as('deleteSprint');
        // cy.route('DELETE', `${backendUrl}/users/${userId}/sprints/*/projects/*.json?auth=*`, {}).as('deleteProjectOnSprint');
        // cy.route('DELETE', `${backendUrl}/users/${userId}/queue/*.json?auth=*`, {}).as('deleteProjectOnQueue');
    });

    it('LandingPage successfully loads', function() {
        cy.visit('/');
        
        // LandingPage content renders
        cy.get('div.is-size-3')
            .should('have.text', 'Your commute just became a lot more reliable');
    });

    it('Successfully logs in with credentials and loads initial user data', function() {

        // Login page loads successfully
        cy.get('div.buttons a').eq(1)
            .should('have.text', 'Log in')
            .click();
        
        cy.get('div.is-size-5 div')
            .should('have.text', 'Log In');
        
        // Submit Login information
        const loginEmail = 'test@test.com';
        const loginPassword = 'test_pass';

        cy.get('input').eq(0)
            .type(loginEmail);
        
        cy.get('input').eq(1)
            .type(loginPassword);
        
        cy.get('button[type="submit"]')
            .click();

        // Wait for stubbed login response
        cy.wait('@submitLogin')
            .its('requestBody').should('deep.eq', 
                { 
                    user: {
                        email: loginEmail,
                        password: loginPassword                    
                    }
                });
        
        // Redirects to Dashboard
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Wait for stubbed user data and current status responses
        const token = 'test_token';

        cy.wait('@fetchUserData')
            .its('requestHeaders.Authorization').should('deep.eq', 
                `Bearer ${token}`);

        cy.wait('@fetchCurrentStatus')
            .its('requestHeaders.Authorization').should('deep.eq', 
                `Bearer ${token}`);
        
        // Dismiss modal
        cy.get('div.modal.is-active')
            .should('have.length', 1);
        
        cy.get('div.modal-content button')
            .should('have.text', 'Close')
            .click();
        
        // Dashboard loads correctly
        cy.get('div.is-size-5 div').eq(0)
            .should('have.text', 'No Current Notifications');
    
        cy.get('div.is-size-5').eq(1)
            .should('have.text', 'Your AM Train');
        
        cy.get('div.is-size-5').eq(2)
            .should('have.text', 'Your PM Train');
    });

    // TODO: Add AM train

    // TODO: See Notification and Status for AM train

    // TODO: Delete AM train

    // TODO: Add PM train (click more trains)
    
    // TODO: Change PM train

    // TODO: Update settings

    // TODO: Refresh button

    // TODO: Log out
});