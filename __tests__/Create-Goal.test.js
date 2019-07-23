import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import CreateGoal from '../src/component/Create-Goal/Create-Goal';
Enzyme.configure({ adapter: new Adapter() });

describe('Home Page', () => {
  describe('Rendering', () => {
    test('Should follow snapshot', () => {
      const navigation = { navigate: jest.fn(), getParam: jest.fn() };
      const snapshot = renderer.create(<CreateGoal navigation = { navigation }/>).toJSON();
      expect(snapshot).toMatchSnapshot();
    });
    test('Should have 4 children to render', () => {
      const navigation = { navigate: jest.fn() };
      const tree = renderer.create(<CreateGoal navigation = { navigation }/>).toJSON();
      expect(tree.children.length).toBe(4);
    });
  });
});