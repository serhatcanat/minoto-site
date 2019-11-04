context('Car Filter', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/markalar");
        cy.server();
    });
    describe('Filter Car List Test', () => {
        it('should() - visit a brand page', () => {

            cy.get('div.listing-content ul.content-results').then((ul) => {
                let $brandCount = ul.children('li').length;
                let $selected = Math.floor(Math.random() * $brandCount) + 1;
                cy.get('div.type-brand ul.content-results')
                    .find('li:nth-child(' + $selected + ')').then(($li) => {
                    let $a = $li.find("div.contentbox .contentbox-innerwrap");
                    let $href = $a.attr('href');
                    let $brand_name = $a.find('div.contentbox-content .contentbox-title').text();
                    let $count_text = $a.find('div.contentbox-content div.contentbox-additions div.additions-title').text();
                    let n = $count_text.split(" ");
                    let $car_count = parseInt(n[0]);
                    Cypress.env({
                        'brand_url': $href,
                        'brand_name': $brand_name,
                        'car_count': $car_count
                    });
                })
            });
        });
        it('should() - contain cars of the selected brand in the brand page', ()=>{
            cy.visit("http://localhost:3000"+Cypress.env('brand_url')).then(()=>{
                cy.wait(3000).then(()=>{
                    cy.get('div.listing-content ul.content-results li').should(($lis)=>{
                        if(Cypress.env('car_count')<24){
                            expect($lis).to.have.length(Cypress.env('car_count'));
                        }else{
                            expect($lis).to.have.length(24);//TODO:change this after scroll
                        }

                    });
                    let $count = 0;
                    cy.get('div.listing-content ul.content-results li').each(($li)=>{
                        console.log($li.find('div.contentbox a.contentbox-innerwrap div.contentbox-content .contentbox-title').text().toLowerCase())
                        if($li.find('div.contentbox a.contentbox-innerwrap div.contentbox-content .contentbox-title').text().toLowerCase().includes(Cypress.env('brand_name').toLowerCase())){
                            $count++;
                        }
                    }).then(()=>{
                        if(Cypress.env('car_count')<24){
                            expect($count).to.equal(Cypress.env('car_count'))
                        }else{
                            expect($count).to.equal(24)
                        }
                    })
                })
            })
        })
    });
});
