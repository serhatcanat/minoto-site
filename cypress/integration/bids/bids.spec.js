context('Bid', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/citroen-c5-aircross-suv-shine-1-5-bluehdi-130-hp-eat8-tek-kar-otomotiv-istanbul-tek-kar-otomotiv-istanbul-M4629156');
    });

    describe('Bid modal behaviour to unauthorized and authorized accounts', () => {
        it('.should() - open a modal for login route', () => {
            cy.get('button.controls-button.bid.primary.uppercase.has-info.btn').click().then(() => {
                cy.get('div.modal-bid div.bid-login').then(($div) => {
                    expect($div.text()).to.contain('Teklif vermek için giriş yapmalısınız.');
                    cy.get('button.wide.big.btn').click().then(() => {
                        cy.wait(200);

                        cy.get('.form.loginform-form [name="email"]').first()
                            .type("gulsah@thinkerfox.com");

                        cy.get('.form.loginform-form [name="password"]').first()
                            .type("minoto121");

                        cy.get(".loginform-form .btn-content")
                            .click();
                        cy.get(".form.loginform-form")
                            .find("div.loginform-message.success")
                            .should("exist");
                        cy.wait(400);

                        cy.get("div.imagewrap.image-iconloader")
                            .find("div")
                            .should("have.class", "imagewrap-image");
                    }).then(() => {
                        cy.get('button.controls-button.bid.primary.uppercase.has-info.btn').click().then(() => {
                            cy.get('div.modal-bid div.modal-content div.modal-innercontent form.form.bid-form').then(($form) => {
                                expect($form).to.have.length(1);
                            })
                        })
                    })
                })
            })
        });
    })
});
