import {apiPath, formatNumber, isDefined, seoFriendlyUrl, storageSpace} from "./helpers";
import {apiBase, storagePath} from "../config";
import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import {configure, shallow} from "enzyme";

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
    expect(seoFriendlyUrl('url to be this ü İ')).toBe('url-to-be-this-u-i');
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

test('Is api path valid', () => {
    expect(apiPath('samplePath')).toBe(`${apiBase}samplePath`);
});


export class TestForm extends React.Component {
    constructor(props) {
        super(props)
        this.onTest = this.onTest.bind(this);
    }

    onTest(e){
        console.log('test');
        console.log(e)
    }

    render() {

        return (
            <form onSubmit={this.onTest}>
                <input name='dname' value='test val'/>
                <input name='dname1' value='test val 1'/>
                <button type='submit'>Test Btn</button>
            </form>
        )
    }
}


describe('Form Is serialized', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<TestForm/>);
    });

    it('renders three  components', () => {
        const form = wrapper.find('form');
        form.find('form')
            .simulate('submit', { preventDefault () {} });
    });

});
