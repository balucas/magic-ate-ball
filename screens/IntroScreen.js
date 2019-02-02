import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, ScrollView, TouchableHighlight } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { AppLoading, Asset, Font, Icon } from 'expo';
import Restaurants from '../data/Restaurants';

export default class IntroScreen extends React.Component {

state = {
  isLoadingComplete: true,
  isFirstLoad: false,
};

  render() {
    if(!this.state.isLoadingComplete){
      return (
        <View>
          <AppLoading/>
        </View>
    );
    }else{
      return (
        <View>
          <Text>This is Intro Screenio</Text>
          <Button
            title="Go to Home"
            onPress={() => {
              this._navHome();
              }}
          />
          <RestaurantList/>
        </View>
      )
    }
  }

  _navHome(){
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ],
    }))
  }
}

function RestaurantList(props){
  var list = Restaurants;

  const listView = list.map((item) =>
    <RestaurantSelect data={item}/>
  );
  return (
    listView
  )
}

class RestaurantSelect extends React.Component{

  state = {
    buttonPressed: false,
    // buttonStyle: styles.exerciseButton,
  }

  _buttonPressed(){
    // this.setState({buttonStyle: styles.exerciseButtonSelected});
  }

  render(){
    return(
      <TouchableHighlight
              key={this.props.data.alias}
              onPress={() => {this._buttonPressed();}}
              style={{}}>

              <Text>{this.props.data.alias}</Text>


      </TouchableHighlight>
    )
  }

}
