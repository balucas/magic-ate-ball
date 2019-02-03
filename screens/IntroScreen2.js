import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, ScrollView, TouchableHighlight } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { AppLoading, Asset, Font, Icon } from 'expo';

export default class IntroScreen2 extends React.Component {

  async _test(){
    try {
      const value = await AsyncStorage.getItem('VisitedRestaurants');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
      console.log('error: ' + error);
    }

  }
  render(){
    return(
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center',
                      paddingTop: 8,
                      paddingBottom: 8,
                      borderBottomColor: '#000000'}}>
          <Text style={{fontSize: 20,}}>
            Pick your food preferences!
          </Text> 
        </View>
        <ScrollView>
        </ScrollView>
        <Button title='Continue'
                onPress={() => {this._test()}}/>
      </View>
    )
  }
}
