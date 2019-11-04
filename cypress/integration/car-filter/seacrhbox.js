
context('Car Filter', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000");
        cy.server();
    });
    function getSubStringOfAnElement($array){
        let $l=$array.length;
        let $selectedIndex = Math.floor(Math.random() * $l);
        let $selected = $array[$selectedIndex-1];
        let $len =  Math.floor(Math.random() * $selected.length)+1;
        let $needle = Math.floor(Math.random() * ($selected.length-$len))+1;
        return $selected.slice($needle - 1, $len + $needle - 1);
    }
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    it('should() - fetch brands that have name containing the given string value.',()=>{
        let $brands = [
            "Alfa Romeo",
            "Aston Martin",
            "Audi",
            "Bentley",
            "BMW",
            "Bugatti",
            "Buick",
            "Cadillac",
            "Chery",
            "Chevrolet",
            "Chrysler",
            "Citroën",
            "Dacia",
            "Daewoo",
            "Daihatsu",
            "Dodge",
            "Ferrari",
            "Fiat",
            "Ford",
            "Geely",
            "Honda",
            "Hyundai",
            "Infiniti",
            "Isuzu",
            "Iveco",
            "Jaguar",
            "Jeep",
            "Kia",
            "Lada",
            "Lamborghini",
            "Lancia",
            "Land Rover",
            "Lexus",
            "Lincoln",
            "Lotus",
            "Maserati",
            "Mazda",
            "McLaren",
            "Mercedes-Benz",
            "Mini",
            "Mitsubishi",
            "Nissan",
            "Opel",
            "Peugeot",
            "Porsche",
            "Proton",
            "Renault",
            "Rolls Royce",
            "Rover",
            "Saab",
            "Seat",
            "Skoda",
            "Smart",
            "SsangYong",
            "Subaru",
            "Suzuki",
            "Tata",
            "Tofaş",
            "Toyota",
            "Volkswagen",
            "Volvo",
            "DS AUTOMOBILES",
            "DFSK",
            "Gaz",
        ];
        let $type_string= getSubStringOfAnElement($brands);
        Cypress.env({
           'brand_substring':$type_string.toLowerCase()
        });
        cy.get('input.searchbar-input').type(Cypress.env('brand_substring')).then(()=>{
            cy.route('https://beta-api.minoto.com/v1/shared/*').as('cars');
            cy.wait('@cars').then(()=>{
                cy.get('div.searchbar-results').then(($container)=>{
                    expect($container.length).to.equal(1);
                    if($container.find('div.results-group').length === 3){

                        cy.get('div.searchbar-results div.results-group:nth-child(1) div.ScrollbarsCustom-Content div.group-item').should(($brand_div)=>{
                            expect($brand_div.find('a').text().toLowerCase()).to.contain(Cypress.env('brand_substring'));

                        });
                        let $found_brands = [];
                        cy.get('div.searchbar-results div.results-group:nth-child(1) div.ScrollbarsCustom-Content div.group-item').each(($brand_div)=>{
                            let $found_brand = $brand_div.find('a').text().split(">")[0];
                            console.log('brand: '+$found_brand);
                            $found_brands.push($found_brand)
                        }).then(()=>{
                            cy.get('div.searchbar-results div.results-group:nth-child(2)').should(($dealer_div)=>{
                                expect($dealer_div.find('.group-title').text()).to.equal('Bayi');
                            });
                            cy.get('div.searchbar-results div.results-group:nth-child(2) div.ScrollbarsCustom-Content div.group-item').should(($dealer_div)=>{
                                console.log($dealer_div.find('a').text());
                                console.log($found_brands[0]);
                                let $res=$found_brands.some(substring=>$dealer_div.find('a').text().includes(substring));
                                expect($res).to.equal(true);
                            })
                            cy.get('div.searchbar-results div.results-group:nth-child(3)').should(($dealer_div)=>{
                                expect($dealer_div.find('.group-title').text()).to.equal('Blog');
                            });
                        });
                    }else{
                        cy.get('div.searchbar-results div.results-group:nth-child(2)').should(($dealer_div)=>{
                            expect($dealer_div.find('.group-title').text()).to.equal('Blog');
                        });
                    }

                });

            });

        })
    })
});