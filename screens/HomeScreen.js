import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class HomeScreen extends React.Component {

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

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {!this.state.dispSuggestion
          ?
          <Button
            title="Tell me where to eat!"
            onPress={() => {this._getSuggestion()

            }}
          />
          :
          <View style={{alignItems: 'center', justifyContent:'center'}}>
            <Text style={{fontSize: 27}} >{this.state.suggested[0]}</Text>
            <Text style={{fontSize: 27}} >{this.state.suggested[1]}</Text>
            <Text style={{fontSize: 27}} >{this.state.suggested[2]}</Text>
          </View>
        }
      </View>
    );
  }
}
