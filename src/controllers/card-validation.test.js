const cardValidation = require('./card-validation');

describe('check card type', () => {
    const masterCard = '5526080000000006\t';
    const visaCard = '4766620000000001';
    const faultyCard = '0000000000000000';

    test('Is card masterCard', () => {
        expect(cardValidation.getType(masterCard)).toMatchObject({"name": "mastercard"})
    });

    test('Is card visa', () => {
        expect(cardValidation.getType(visaCard)).toMatchObject({"name": "visa"})
    });

    test('Is card type valid', () => {
        expect(cardValidation.getType(faultyCard)).toBe(false)
    });
});

describe('Check card is valid', () => {
    const faultyCards = ['47666200000000012', '476662000000000', '476662000000s001', '', './-)+_!@#$%^&'];
    const visaCard = '4766620000000001';

    test('Is card valid == true', () => {
        expect(cardValidation.check(visaCard)).toBe(true)
    });

    test('Is card valid == false', () => {
        faultyCards.forEach(function (card, index) {
            expect(cardValidation.check(card)).toBe(false)
        });
    });
})
