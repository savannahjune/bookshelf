// Bookshelf.test.js
import React from 'react';
import Bookshelf from './Bookshelf';
import renderer from 'react-test-renderer';

test('Bookshelf renders', () => {
    const component = renderer.create(
      <Bookshelf />,
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});