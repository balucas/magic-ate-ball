import React from 'react';
import { View, Text, Button } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import IntroScreen from './screens/IntroScreen';
import IntroScreen2 from './screens/IntroScreen2';
import HomeScreen from './screens/HomeScreen';

export default class App extends React.Component {
  render(){
    return(
      <AppContainer/>
    )
  }
}

const AppNavigator = createStackNavigator({
  Intro: {
    screen: IntroScreen,
  },
  Intro2: {
    screen: IntroScreen2,
  },
  Home: {
      screen: HomeScreen,
  },
}, {
    initialRouteName: 'Intro',
});

const AppContainer = createAppContainer(AppNavigator);
