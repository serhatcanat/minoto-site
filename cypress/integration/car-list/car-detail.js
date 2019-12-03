context('Car Filter', () => {
    beforeEach(() => {
        cy.visit('localhost:3000')
    });
    describe('test the car detail urls',()=>{
        it('.should() - check a sample of car detail urls and look if there is % in them',()=>{
            cy.get("div.listing-content ul.content-results li.results-item").each(($li)=>{
                let $regex = /^\S*$/;
                console.log($li.find("div.contentbox .contentbox-innerwrap").attr("href"));
                let $href = $li.find("div.contentbox .contentbox-innerwrap").attr("href")
                expect($href).to.match($regex);
            })
        })
    })
});