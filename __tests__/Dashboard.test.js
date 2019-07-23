import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import Dashboard from '../src/component/Dashboard/Dashboard';
Enzyme.configure({ adapter: new Adapter() });

describe('Home Page', () => {
  describe('Rendering', () => {
    beforeEach(() => {
      const dummyData = [
        [
          {
              "goal_id": 1,
              "goal_user_id": "1149045194530017300",
              "goal_name": "hiking",
              "goal_start": "4414",
              "goal_end": "675",
              "frequency": "weekly",
              "progress_id": 1,
              "progress_user_id": "1149045194530017300",
              "progress_goal_id": 1,
              "streak": "0",
              "num_of_completed_goals": 0,
              "num_of_total_goals": 0,
              "next_due_date": "0"
          }
      ]
    ];
    global.fetch = jest.fn(() => Promise.resolve(dummyData));
    });
    test('Should follow snapshot', () => {
      const navigation = { 
        navigate: jest.fn(), 
        getParam: jest.fn(),
      };
      const snapshot = renderer.create(<Dashboard navigation = { navigation }/>).toJSON();
      expect(snapshot).toMatchSnapshot();
    });
    test('Should have 1 child to render', () => {
      const navigation = { navigate: jest.fn() };
      const tree = renderer.create(<Dashboard navigation = { navigation }/>).toJSON();
      console.log(tree.children.length);
      expect(tree.children.length).toBe(1);
    });
  });
});
