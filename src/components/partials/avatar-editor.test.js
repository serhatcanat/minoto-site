import MyAvatar from './avatar-editor'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import {shallow,configure} from "enzyme";

configure({ adapter: new Adapter() });

describe('<MyAvatar />', () => {
    it('renders an editor area', () => {
        const editor = shallow(<MyAvatar/>);
        expect(editor.debug()).toMatchSnapshot();
    })
})
