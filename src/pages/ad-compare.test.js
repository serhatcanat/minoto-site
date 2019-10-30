import {AdCompare} from "./ad-compare";

describe('is number formatted', () => {

    test('Show Decimal == False', () => {
        expect(formatNumber(255000,)).toBe('255.000');
    });

    test('Show Decimal == True', () => {
        expect(formatNumber(255000, {showDecimals: true})).toBe('255.000,00');
    });
});

