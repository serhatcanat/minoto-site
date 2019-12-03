context('Car Filter', () => {
    beforeEach(() => {
        cy.server();
        cy.visit('localhost:3000')
    });


    describe('Filter Car List Test', () => {
        it('.should() - filter cars on vehicle body and engine size', () => {
            cy.get('div.type-icons div.filter-content ul.filter-list').then(($bodyList) => {
                let $bodyCount = $bodyList.children('li').length;
                let $selected = Math.floor(Math.random() * $bodyCount) + 1;
                cy.get('div.type-icons div.filter-content ul.filter-list li:nth-child(' + 2 + ')').click();//TODO:add $selected variable here
            });
            cy.get('div button:contains("Motor Hacmi")').then(($motorButton) => {
                cy.get('div button:contains("Motor Hacmi")').parent().click();
                cy.wait(1000);
                let $motorList = $motorButton.parent().children('.filter-content').children('ul.filter-list');
                let $motorCount = $motorList.children('li').length;
                let $selected = Math.floor(Math.random() * $motorCount) + 1;
                cy.get('div button:contains("Motor Hacmi")').siblings('.filter-content').children('ul').find('li:nth-child(' + 2 + ')').click();//TODO:add $selected variable here
                cy.wait(3000);
                cy.get('div.filters-header span').then(($text) => {
                    let $numberStr = $text.text().replace(/[^\d.]/g, '');
                    let $cars = parseInt($numberStr);
                    Cypress.env({
                        'cars': $cars
                    });
                    let $carCount = Cypress.env('cars');
                    if ($carCount === 0) {
                        cy.get('div.error-message').should('have.text', "Aradığınız kriterlere uygun bir araç bulamadık. Ancak aşağıdaki araçlar ilginizi çekebilir. ")
                    } else {
                        var $loop = Math.ceil($carCount / 24);
                        if ($carCount < 24) {
                            cy.get('ul.content-results').children().children('.contentbox')
                                .should('have.length', $carCount);
                        } else {
                            cy.get('ul.content-results').children().children('.contentbox')
                                .should('have.length', 24);
                            for (let i = 1; i < $loop; i++) {//TODO:Fix to $loop after scroll
                                cy.route('https://beta-api.minoto.com/v1/shared/*').as('cars');
                                cy.get('ul.content-results').children().children('.contentbox').last().scrollIntoView({
                                    duration: 1000,
                                    easing: "linear"
                                }).then(() => {
                                    cy.wait('@cars');
                                })
                            }
                        }
                    }
                }).then(() => {
                    let $carCount = Cypress.env('cars');
                    cy.get('ul.content-results').children().children('.contentbox')
                        .should('have.length', $carCount);
                });
            });
        });
        it('.should() - clear body type and engine volume filters', () => {
            cy.get('div.filters-header span').then(($text) => {
                var $numberStr = $text.text().replace(/[^\d.]/g, '');
                var $carCount = parseInt($numberStr);
                Cypress.env({
                    'total': $carCount
                })
            });

            cy.get('div.type-icons div.filter-content ul.filter-list').then(($bodyList) => {
                let $bodyCount = $bodyList.children('li').length;
                let $selected = Math.floor(Math.random() * $bodyCount) + 1;
                cy.get('div.type-icons div.filter-content ul.filter-list li:nth-child(' + $selected + ')').click();
            });
            cy.get('div button:contains("Motor Hacmi")').then(($motorButton) => {
                cy.get('div button:contains("Motor Hacmi")').parent().click();
                let $motorList = $motorButton.parent().children('.filter-content').children('ul.filter-list');
                let $motorCount = $motorList.children('li').length;
                let $selected = Math.floor(Math.random() * $motorCount) + 1;
                cy.get('div button:contains("Motor Hacmi")').siblings('.filter-content').children('ul').find('li:nth-child(' + $selected + ')').click();
            });
            cy.get('.header-clear').click().then(() => {
                cy.get('div.filters-header span').should(($h1) => {
                    expect($h1).to.contain(Cypress.env('total'))
                })
            });

        });
    });
});
