import React from 'react';
import { View, Text, Button } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import IntroScreen from './screens/IntroScreen';
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
  Home: {
      screen: HomeScreen,
  },
}, {
    initialRouteName: 'Intro',
});

const AppContainer = createAppContainer(AppNavigator);
