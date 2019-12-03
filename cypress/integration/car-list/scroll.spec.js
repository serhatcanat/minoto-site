context('Car List', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
        cy.server();
    });

    describe('Scroll Car Load Test', () => {
        it('.should() - fetch a chunk of cars when the page is scrolled down', () => {
            cy.viewport(1920,900);
            cy.get('ul.content-results').children().children('.contentbox')
                .should('have.length', 24);
            cy.scrollTo('bottom');
            cy.route('https://beta-api.minoto.com/v1/shared/*').as('cars');
            cy.wait('@cars').then(()=>{
                cy.get('ul.content-results').children().children('.contentbox')
                    .should('have.length', 48);
            });
        });
    });
});