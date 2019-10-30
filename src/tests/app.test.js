import React from 'react';
import renderer from 'react-test-renderer';

export function SampleComponent() {
   return(
       <h1>{this.props.title}</h1>
   )
}

export function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

it('renders correctly', () => {
    const tree = renderer
        .create(<SampleComponent src="http://www.facebook.com">Facebook</SampleComponent>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
