context('Aliasing', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
    });

    describe('Google Login IFrame load', () => {
        it('.should() - pass login in iphone 6 viewport preset', () => {
            cy.get('div.consentbar button.btn.wide.low').click().then(() => {
                cy.viewport('iphone-6');
                cy.get('.nav-menubtn').click().then(() => {
                        cy.server();
                        cy.route('https://accounts.google.com/*').as('auth_req');
                        cy.get('button.userbar-link  ~ button.userbar-link')
                            .click();
                        cy.get('iframe#ssIFrame_google').then(($google)=>{
                            expect($google).to.have.length(1);
                        })
                });
            })
        });
    })
});
