import {formatNumber, isDefined, isExact, seoFriendlyUrl, storageSpace} from "./helpers";
import {storagePath} from "../config";

describe('is number formatted', () => {

    test('Show Decimal == False', () => {
        expect(formatNumber(255000,)).toBe('255.000');
    });

    test('Show Decimal == True', () => {
        expect(formatNumber(255000, {showDecimals: true})).toBe('255.000,00');
    });
});

describe('is defined', () => {
    test('Is Defined == True', () => {
        let test = 1;
        expect(isDefined(test)).toBe(true);
    });
    test('Show Decimal == False', () => {
        let test;
        expect(isDefined(test)).toBe(false);
    });
});

test('Is url seo friendly', () => {
    expect(seoFriendlyUrl('url to be this ü İ')).toBe('url-to-be-this-u-i');
});


test('Storage Space', () => {
    expect(storageSpace('images', 'media.png')).toBe(`${storagePath}images/media.png.png`);
});
