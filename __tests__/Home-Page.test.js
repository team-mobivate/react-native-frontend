import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import HomePage from '../src/component/Home-Page/Home-Page';
Enzyme.configure({ adapter: new Adapter() });

describe('Home Page', () => {
  describe('Rendering', () => {
    test('Should follow snapshot', () => {
      const navigation = { navigate: jest.fn() };
      const snapshot = renderer.create(<HomePage navigation = { navigation }/>).toJSON();
      expect(snapshot).toMatchSnapshot();
    });
    test('Should have no children to render', () => {
      const navigation = { navigate: jest.fn() };
      const tree = renderer.create(<HomePage navigation = { navigation }/>).toJSON();
      expect(tree.children).toBeNull();
    });
  });
});