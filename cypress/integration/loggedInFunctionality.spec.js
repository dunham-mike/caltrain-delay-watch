describe('Logged In Functionality', () => {

    const token = 'test_token';

    beforeEach(() => {
        
        // Fixtures
        cy.fixture('loginSuccess.json').as('loginSuccessJSON');
        cy.fixture('fetchUserDataSuccess.json').as('fetchUserDataSuccessJSON').then((userData) => {
            userData.mostRecentNotifications[0].expectedDepartureTime = Cypress.moment.utc();
        });
        cy.fixture('fetchCurrentStatusSuccess.json').as('fetchCurrentStatusSuccessJSON').then((currentStatus) => {
            currentStatus.createdAt = Cypress.moment.utc();
        });
        cy.fixture('fetchTimetablesSuccess.json').as('fetchTimetablesSuccessJSON');

        // Network stubs
        cy.server();

        const backendUrl = Cypress.env('backendUrl');

        // GET
        cy.route('GET', `${backendUrl}/api/user-data`, '@fetchUserDataSuccessJSON').as('fetchUserData');
        cy.route('GET', `${backendUrl}/api/current-status`, '@fetchCurrentStatusSuccessJSON').as('fetchCurrentStatus');
        cy.route('GET', `${backendUrl}/api/timetables/caltrain/weekday`, '@fetchTimetablesSuccessJSON').as('fetchTimetables');

        // POST
        cy.route('POST', `${backendUrl}/api/auth/login`, '@loginSuccessJSON').as('submitLogin');
        cy.route('POST', `${backendUrl}/api/user-data`, {}).as('addWatchedTrain');
        cy.route('POST', `${backendUrl}/api/user-data/preferences`, 'User preferences successfully updated.').as('updateSettings');

        // DELETE
        cy.route('DELETE', `${backendUrl}/api/user-data`, {}).as('deleteWatchedTrain');
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
            .should('have.text', 'Current Notification');
    
        cy.get('div.is-size-5').eq(1)
            .should('have.text', 'Your AM Train');
        
        cy.get('div.is-size-5').eq(2)
            .should('have.text', 'Your PM Train');
    });

    it('Adds train for AM commute', function () {

        // Navigate to AM Watch Commute page
        cy.get('button.is-warning')
            .should('have.text', 'Select a morning train to watch!')
            .click();
        
        cy.url().should('eq', Cypress.config().baseUrl + '/watch-commute');

        cy.wait('@fetchTimetables')
            .its('requestHeaders.Authorization').should('deep.eq', 
                `Bearer ${token}`);

        cy.get('div.is-size-5').eq(1)
            .should('have.text', 'Update AM Commute');

        // Select AM train
        cy.get('select')
            .select('Burlingame');

        cy.get('div.field.has-addons button span').eq(1)
            .should('have.text', 'Northbound')
            .click();
        
        cy.get('button.is-info.is-outlined').eq(4)
            .should('have.text', '8:30 am - NB 221')
            .click();

        // Wait for stubbed POST request
        cy.get('@addWatchedTrain').should((req) => {
            expect(req.request.headers.Authorization).to.deep.equal(`Bearer ${token}`);

            expect(req.request.body).to.deep.equal({
                commuteType: 'AM',
                trainInfo: {
                    operator: 'Caltrain',
                    scheduleType: 'Weekday',
                    station: 'Burlingame',
                    stopId: '70081',
                    direction: 'NB',
                    time: '8:30 am',
                    trainNumber: '221'
                }
            });
        });
            
        // Redirect to Dashboard and display added train
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        cy.get('button.is-light.is-warning').eq(0)
            .should('have.text', 'Burlingame Station: NB 221 at 8:30 am');
    });

    it('Displays notifications and current status for AM train', function () {
        cy.get('div.has-text-white.has-text-centered')
            .contains('Late - Expected Departure: 8:45 am');
        
        cy.get('div.content div.has-text-centered')
            .should('have.text', 'Delayed: NB 221 at Burlingame Station');
    });

    it('Deletes the AM train', function () {
        cy.get('button.is-light.is-warning')
            .contains('Burlingame Station: NB 221 at 8:30 am')
            .click();
        
        cy.get('button.is-primary.is-outlined span').eq(1)
            .should('have.text', 'Or Delete Current Train')
            .click();
        
        // Wait for stubbed DELETE request
        cy.get('@deleteWatchedTrain').should((req) => {
            expect(req.request.headers.Authorization).to.deep.equal(`Bearer ${token}`);
            expect(req.request.body).to.deep.equal({
                commuteType: 'AM'
            });
        });
        
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Adds a PM train', function () {

        // Navigate to PM Watch Commute page
        cy.get('button.is-info').eq(1)
            .should('have.text', 'Select an evening train to watch!')
            .click();
        
        cy.url().should('eq', Cypress.config().baseUrl + '/watch-commute');

        cy.get('div.is-size-5').eq(1)
            .should('have.text', 'Update PM Commute');

        // Select PM train
        cy.get('select')
            .select('San Francisco');

        cy.get('div.field.has-addons button span').eq(2)
            .should('have.text', 'Southbound')
            .click();


        cy.get('button.is-warning').eq(1)
            .should('have.text', 'Show More Times')
            .click();
        
        cy.get('button.is-info.is-outlined').eq(9)
            .should('have.text', '8:30 pm - SB 192')
            .click();

        // Wait for stubbed POST request
        cy.get('@addWatchedTrain').should((req) => {
            expect(req.request.headers.Authorization).to.deep.equal(`Bearer ${token}`);

            expect(req.request.body).to.deep.equal({
                commuteType: 'PM',
                trainInfo: {
                    operator: 'Caltrain',
                    scheduleType: 'Weekday',
                    station: 'San Francisco',
                    stopId: '70012',
                    direction: 'SB',
                    time: '8:30 pm',
                    trainNumber: '192'
                }
            });
        });
            
        // Redirect to Dashboard and display added train
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        cy.get('button.is-light.is-info').eq(0)
            .should('have.text', 'San Francisco Station: SB 192 at 8:30 pm');
    });

    it('Updates an existing PM train', function () {

        // Navigate to PM Watch Commute page
        cy.get('button.is-light.is-info').eq(0)
            .click();
        
        cy.url().should('eq', Cypress.config().baseUrl + '/watch-commute');

        // Select PM train
        cy.get('select')
            .select('San Bruno');

        cy.get('div.field.has-addons button span').eq(2)
            .should('have.text', 'Southbound')
            .click();
        
        cy.get('button.is-info.is-outlined').eq(3)
            .should('have.text', '3:20 pm - SB 156')
            .click();

        // Wait for stubbed POST request
        cy.get('@addWatchedTrain').should((req) => {
            expect(req.request.headers.Authorization).to.deep.equal(`Bearer ${token}`);

            expect(req.request.body).to.deep.equal({
                commuteType: 'PM',
                trainInfo: {
                    operator: 'Caltrain',
                    scheduleType: 'Weekday',
                    station: 'San Bruno',
                    stopId: '70052',
                    direction: 'SB',
                    time: '3:20 pm',
                    trainNumber: '156'
                }
            });
        });
            
        // Redirect to Dashboard and display updated train
        cy.url().should('eq', Cypress.config().baseUrl + '/');

        cy.get('button.is-light.is-info').eq(0)
            .should('have.text', 'San Bruno Station: SB 156 at 3:20 pm');
    });

    it('Updates settings', function () {
        cy.get('div.navbar-burger')
            .click();

        cy.get('div.navbar-end a').eq(0)
            .should('have.text', 'Settings')
            .click();
        
        cy.url().should('eq', Cypress.config().baseUrl + '/settings');

        cy.get('label.radio').eq(1)
            .should('have.text', 'Web App Only')
            .click();

        cy.get('button.is-success')
            .should('have.text', 'Update Settings')
            .click();
        
        // Wait for stubbed POST request
        cy.get('@updateSettings').should((req) => {
            expect(req.request.headers.Authorization).to.deep.equal(`Bearer ${token}`);

            expect(req.request.body).to.deep.equal({
                preferredNotificationMethod: 'web app',
                phoneNumber: null
            });
        });

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Displays a modal when attempting to refresh', function () {
        cy.get('button.is-small')
            .click();

        cy.get('div.modal-content div.box')
            .contains('New status updates are available every 5 minutes on weekdays. Please try again after');

        cy.get('div.modal-content button')
            .should('have.text', 'Close')
            .click();
    });

    it('Logs out successfully', function () {
        cy.get('div.navbar-burger')
            .click();

        cy.get('div.navbar-end a').eq(1)
            .should('have.text', 'Log out')
            .click();
        
        // LandingPage content renders
        cy.get('div.is-size-3')
            .should('have.text', 'Your commute just became a lot more reliable');
    });
});