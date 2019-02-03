import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class HomeScreen extends React.Component {

  constructor(){
    super();
    this._getSuggestion();
  }

  state = {
    dispSuggestion: false,
    suggested: '',
  }

  async _getSuggestion(){
    try {
      const value = await AsyncStorage.getItem('SuggestedRestaurants');
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.setState({suggested: JSON.parse(value), dispSuggestion: true});
      }
    } catch (error) {
      // Error retrieving data
    }

  }

  _returnToIntro(){
    this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Intro' }) 
              ],
            }));

  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{alignItems: 'center', justifyContent:'center'}}>
            <Text style={{fontSize: 27}} >{this.state.suggested[0]}</Text>
            <Text style={{fontSize: 27}} >{this.state.suggested[1]}</Text>
            <Text style={{fontSize: 27}} >{this.state.suggested[2]}</Text>
          </View>
        <Button
          title="Suggest again!"
          onPress={() => {this._returnToIntro()}}
        />
      </View>
    );
  }
}
