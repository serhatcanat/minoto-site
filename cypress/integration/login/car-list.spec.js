context('Car List', () => {
    beforeEach(() => {
        cy.visit('localhost:3000')
    });
    describe('First Car Load Test', () => {
        it('.should() - fetch a chunk of cars when the page is loaded', () => {
            cy.get('ul.content-results').children().children('.contentbox')
                .should('have.length', 24)
        });
    });
    describe('Scroll Car Load Test', () => {
        it('.should() - fetch a chunk of cars when the page is scrolled down', () => {
            cy.get('ul.content-results').children().children('.contentbox')
                .should('have.length', 24)
            cy.scrollTo('bottom');
            cy.wait(3000);
            cy.get('ul.content-results').children().children('.contentbox')
                .should('have.length', 48)
        });
    });
});