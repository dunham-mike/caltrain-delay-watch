describe('Create Account', () => {

    const accountEmail = 'test@test.com';
    const accountPassword = 'test_pass';
    const phoneNumber = "2223334444";

    beforeEach(() => {

        // Fixtures
        cy.fixture('loginSuccess.json').as('loginSuccessJSON');
        cy.fixture('fetchUserDataSuccess.json').as('fetchUserDataSuccessJSON').then((userData) => {
            userData.mostRecentNotifications[0].expectedDepartureTime = Cypress.moment.utc();
        });
        cy.fixture('fetchCurrentStatusSuccess.json').as('fetchCurrentStatusSuccessJSON').then((currentStatus) => {
            currentStatus.createdAt = Cypress.moment.utc();
        });

        // Network stubs
        cy.server();

        const backendUrl = Cypress.env('backendUrl');

        // GET
        cy.route('GET', `${backendUrl}/api/user-data`, '@fetchUserDataSuccessJSON').as('fetchUserData');
        cy.route('GET', `${backendUrl}/api/current-status`, '@fetchCurrentStatusSuccessJSON').as('fetchCurrentStatus');

        // POST
        cy.route('POST', `${backendUrl}/api/auth/create-account`, 'Account successfully created.').as('createAccount');
        cy.route('POST', `${backendUrl}/api/auth/login`, '@loginSuccessJSON').as('submitLogin');
    });
    
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

        cy.url().should('eq', Cypress.config().baseUrl + '/create-account');
        
        cy.get('div.is-size-5 div')
            .should('have.text', 'Create Account');
    });

    it('Creates account with Text Message notification', function() {

        cy.get('input').eq(0)
            .type(accountEmail);
        
        cy.get('input').eq(1)
            .type(accountPassword);
        
        cy.get('input').eq(4)
            .type(phoneNumber);
        
        cy.get('button.is-success')
            .should('have.text', 'Create Account')
            .click();

        cy.wait('@createAccount')
            .its('requestBody').should('deep.eq', 
                { 
                    user: {
                        email: accountEmail,
                        password: accountPassword,
                        preferredNotificationMethod: 'sms',
                        phoneNumber: '+1' + phoneNumber                    
                    }
                });
        
        cy.wait('@submitLogin')
            .its('requestBody').should('deep.eq', 
                { 
                    user: {
                        email: accountEmail,
                        password: accountPassword               
                    }
                });

        cy.url().should('eq', Cypress.config().baseUrl + '/');

        // Log out
        cy.get('div.modal-content button')
            .should('have.text', 'Close')
            .click();

        cy.get('div.navbar-burger')
            .click();

        cy.get('div.navbar-end a').eq(1)
            .should('have.text', 'Log out')
            .click();
    });

    it('Creates account with Web App Only notification', function() {
        cy.get('div.buttons a.is-primary')
            .should('have.text', 'Sign up')
            .click();

        cy.url().should('eq', Cypress.config().baseUrl + '/create-account');
        
        cy.get('div.is-size-5 div')
            .should('have.text', 'Create Account');

        cy.get('input').eq(0)
            .type(accountEmail);
        
        cy.get('input').eq(1)
            .type(accountPassword);
        
        cy.get('input').eq(3)
            .click();
        
        cy.get('button.is-success')
            .should('have.text', 'Create Account')
            .click();

        cy.wait('@createAccount')
            .its('requestBody').should('deep.eq', 
                { 
                    user: {
                        email: accountEmail,
                        password: accountPassword,
                        preferredNotificationMethod: 'web app'         
                    }
                });
        
        cy.wait('@submitLogin')
            .its('requestBody').should('deep.eq', 
                { 
                    user: {
                        email: accountEmail,
                        password: accountPassword               
                    }
                });

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    // The below are probably better as unit tests in Jest/Enzyme
    // it('Submit button is disabled until all fields are filled out', function() {
    //     // TODO
    // });

    // it('Phone number field is removed when Web App Only is selected', function() {
    //     // TODO
    // });

    // it('Phone number input is preserved when switching between Text Message and Web App Only', function () {
    //     // TODO
    // });

    // it('Displays correct errors when missing required inputs', function() {
    //     // TODO
    // });

    // it('Displays correct errors when inputs are the wrong format', function() {
    //     // TODO
    // });

    // it('Stores phone numbers with +1 in front', function() {
    //     // TODO
    // });

    // it('Displays a modal with an error message when an email address already has an account', function() {
    //     // TODO
    // });

    // it('Bottom link redirects to the login page', function() {
    //     // TODO
    // });
});