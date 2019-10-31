import {formatNumber, productDetailUrl} from "./helpers";

describe('is number formatted', () => {

    test('Show Decimal == False', () => {
        expect(formatNumber(255000,)).toBe('255.000');
    });

    test('Show Decimal == True', () => {
        expect(formatNumber(255000, {showDecimals: true})).toBe('255.000,00');
    });
});

describe('is url contain special chars', () => {
    test('', () => {
        expect(productDetailUrl('Citroen C4 Cactus Feel 1.2 Puretech 110 HP EAT6', 'otosay-otomotiv', 'M5235290'))
            .toBe('255.000');
    });
});

