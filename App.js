import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import CreateGoal from './src/component/Create-Goal/Create-Goal';
import Dashboard from './src/component/Dashboard/Dashboard';
import HomePage from './src/component/Home-Page/Home-Page';


// entry point component for our app
const AppContainer = createAppContainer(
  createStackNavigator(
    {
      HomePage: { screen: HomePage },
      Dashboard: { screen: Dashboard },
      CreateGoal: { screen: CreateGoal },
    },
    {
      initialRouteName: 'HomePage',
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: 'orange',
        },
        headerTitle: 'Mobivate',
      },
    }
  )
);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
