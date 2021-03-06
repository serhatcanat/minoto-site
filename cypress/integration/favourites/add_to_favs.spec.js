context('Add to Favourites', () => {


    describe('Add to favourites to authenticated client profile', () => {
        it('.should() - add to favourites list of authenticated user when the user clicks on favourites button', () => {
            cy.visit('localhost:3000')
            cy.get('button.nav-link  ~ button.nav-link')
                .click();

            cy.wait(200);

            cy.get('.form.loginform-form [name="email"]').first()
                .type("gulsah@thinkerfox.com");

            cy.get('.form.loginform-form [name="password"]').first()
                .type("minoto121");

            cy.get(".loginform-form .btn-content")
                .click();

            cy.wait(1000);
            let $selected = Math.floor(Math.random() * 27) + 1;
            cy.get('ul.content-results').find('li:nth-child(' + $selected + ')').then(($li) => {
                if ($li.hasClass('banner')) {
                    $selected++;
                }
                cy.get('ul.content-results').find('li:nth-child(' + $selected + ')').then(($li) => {

                    let $href = $li.find("div.contentbox .contentbox-innerwrap").attr('href');
                    cy.visit('http://localhost:3000' + $href).then(() => {
                        cy.wait(3000).then(() => {
                            if (!Cypress.$("div .fav-button").hasClass('faved')) {
                                cy.get(".fav-button-btn").click();
                                cy.wait(1000).then(() => {
                                    cy.url().then(($url) => {
                                        let $ref = $url;
                                        let n = $url.split("-");
                                        $url = n[n.length - 1];
                                        Cypress.env({
                                            'faved_url': $url,
                                            'url': $ref
                                        })
                                    })
                                })
                            }
                        });

                    })
                });
            }).then(() => {
                cy.visit("http://localhost:3000/hesabim/favorilerim/araclar").then(() => {
                    cy.wait(3000).then(() => {
                        var $count = 0;
                        var $url = Cypress.env('faved_url');
                        console.log($url);
                        cy.get("ul.favorites-list li.list-item").each(($li) => {
                            let $href = $li.find('.contentbox-innerwrap').attr('href');
                            let n = $href.split("-");
                            $href = n[n.length - 1];
                            if ($url === $href) {
                                $count++
                            }
                        }).then(() => {
                            expect($count).to.equal(1);
                        });

                    });
                })
            }).then(() => {
                let $url = Cypress.env('url');
                cy.visit($url).then(() => {
                    cy.wait(3000).then(() => {
                        cy.get(".fav-button-btn").click();
                        cy.wait(1000);
                    });
                })
            }).then(() => {
                cy.visit("http://localhost:3000/hesabim/favorilerim/araclar").then(() => {
                    cy.wait(3000).then(() => {
                        var $count = 0;
                        var $url = Cypress.env('faved_url');
                        console.log($url);
                        cy.get("ul.favorites-list li.list-item").each(($li) => {
                            let $href = $li.find('.contentbox-innerwrap').attr('href');
                            let n = $href.split("-");
                            $href = n[n.length - 1];
                            if ($url === $href) {
                                $count++
                            }
                        }).then(() => {
                            expect($count).to.equal(0);
                        });
                    })
                })
            });

        });
    });
});