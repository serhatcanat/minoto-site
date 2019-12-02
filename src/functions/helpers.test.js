import {apiPath, formatMoney, formatNumber, isDefined, seoFriendlyUrl, storageSpace} from "./helpers";
import {apiBase, storagePath} from "../config";
import Adapter from 'enzyme-adapter-react-16';
import {configure} from "enzyme";

configure({adapter: new Adapter()});

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
    expect(seoFriendlyUrl('url to be this ü İ ç ı')).toBe('url-to-be-this-u-i-c-i');
});

describe('Storage space', () => {

    test('Storage Space folder with valid parameters', () => {
        expect(storageSpace('images', 'media.png')).toBe(`${storagePath}images/media.png.png`);
    });

    const faildeOptions = [null,''];

    faildeOptions.forEach(function (value) {
        test(`Storage Space folder file == ${value}`, () => {
            expect(storageSpace('media.png',value)).toBe(false);
        });
    });
});

describe('Format money', () => {
    test('Billion with decimal', () => {
        expect(formatMoney(3000000,2,'.',',')).toBe('3,000,000.00');
    });

    test('Billion without decimal', () => {
        expect(formatMoney(3000000,0,'.',',')).toBe('3,000,000');
    });
});

test('Is api path valid', () => {
    expect(apiPath('samplePath')).toBe(`${apiBase}samplePath`);
});



