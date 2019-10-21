/// <reference types="Cypress" />

context('Aliasing', () => {
    beforeEach(() => {
        cy.visit('localhost:3000')
    })

    describe('Basic Test', () => {
        it('.should() - make an assertion about the current subject', () => {
            cy.get('.intro-title span')
                .should('have.class', 'colored')
        })


        it('.should() - login model display none', () => {
            cy.get('.modal-login')
                .should('not.have.class', 'show')
        })


        it('.should() - login model display', () => {
            cy.get('button.nav-link  ~ button.nav-link')
                .click();

            cy.wait(200);

            cy.get('.modal-login')
                .should('have.class', 'show');
        })

        it('.should() - login form fail', () => {
            cy.get('button.nav-link  ~ button.nav-link')
                .click();

            cy.wait(200);

            cy.get('.form.loginform-form [name="email"]').first()
                .type("gulsah@thinkerfox.com")

            cy.get('.form.loginform-form [name="password"]').first()
                .type("thinkerfox111")

            cy.get(".loginform-form .btn-content")
                .click();

            cy.wait(400);

            cy.get(".form.loginform-form")
                .find("div.loginform-message.error")
                .should("have.text", "Böyle bir kayıt yok");



        })

    })
})
