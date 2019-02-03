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
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center',
                        paddingTop: 8,
                        paddingBottom: 8,
                        borderBottomColor: '#000000'}}>
            <Text style={{fontSize: 20,}}>
              Rate the restaurants you've been to!
            </Text>
          </View>
          <ScrollView>
            <RestaurantList/>
          </ScrollView>
          <Button title='Continue'
                  onPress={() => {this._handleProceed(this)}}/>
        </View>
      )
    }
  }

  async _handleProceed(that){
    var selectedRestaurants = Restaurants.filter(item => item.isSelected);
    console.log(JSON.stringify(selectedRestaurants));

    try {
        await AsyncStorage.setItem('VisitedRestaurants', JSON.stringify(selectedRestaurants));

        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }

          if (request.status === 200) {
            console.log('success', request.responseText);
          } else {
            console.warn('error');
          }
        };

        request.open('POST', 'http://35.231.187.174:5000/info');
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(selectedRestaurants));

        that.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'Home' })
            ],
          }));
    } catch (error) {
        // Error saving data
        console.log('save failed ' + error);
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
    <RestaurantSelect key={item.alias} data={item}/>
  );
  return (
    listView
  )
}

class RestaurantSelect extends React.Component{

  state = {
    selectActive: false,
    rating: 0,
  }

  _initialSelect(){
    this.setState({selectActive: true});
    this.props.data.isSelected = true;
  }

  _cancelSelect(){
    this.setState({selectActive: false});
    this.props.data.isSelected = false;
  }

  _selectRating(rating){
    this.setState({rating: rating});
    this.props.data.rating = rating;
  }

  render(){
    return(
      <TouchableHighlight
              key={this.props.data.alias + 'ListItem'}
              onPress={() => {this._initialSelect()}}
              activeOpacity={1}
              underlayColor={'#fff'}
              style={this.state.selectActive ? styles.selectedRestaurant: styles.unselectedRestaurant }>
              {!this.state.selectActive
              ?
                <View key={this.props.data.alias + 'View'} style={{paddingTop: 10}}>
                  <Text key={this.props.data.alias + 'Name'}>{this.props.data.name}</Text>
                  <Text key={this.props.data.alias + 'Address'} style={{color: '#A9A9A9' }}>{this.props.data.location.address1}</Text>
                </View>
              :
                <View key={this.props.data.alias + 'Rate'}
                      style={{flexDirection: 'row',
                              paddingTop: 12}}>
                  <TouchableHighlight key={this.props.data.alias + '1Star'}
                                      activeOpacity={0}
                                      onPress={() => {this._selectRating(1)}}>
                    <Icon.Ionicons
                      key={this.props.data.alias + '1StarIcon'}
                      name={this.state.rating < 1 ? 'md-star-outline' : 'md-star'}
                      size={40}/>
                  </TouchableHighlight>
                  <TouchableHighlight key={this.props.data.alias + '2Star'}
                                      activeOpacity={0}
                                      onPress={() => {this._selectRating(2)}}>
                    <Icon.Ionicons
                      key={this.props.data.alias + '2StarIcon'}
                      name={this.state.rating < 2 ? 'md-star-outline' : 'md-star'}
                      size={40}/>
                  </TouchableHighlight>
                  <TouchableHighlight key={this.props.data.alias + '3Star'}
                                      activeOpacity={0}
                                      onPress={() => {this._selectRating(3)}}>
                    <Icon.Ionicons
                      key={this.props.data.alias + '3StarIcon'}
                      name={this.state.rating < 3 ? 'md-star-outline' : 'md-star'}
                      size={40}/>
                  </TouchableHighlight>
                  <TouchableHighlight key={this.props.data.alias + '4Star'}
                                      activeOpacity={0}
                                      onPress={() => {this._selectRating(4)}}>
                    <Icon.Ionicons
                      key={this.props.data.alias + '4StarIcon'}
                      name={this.state.rating < 4 ? 'md-star-outline' : 'md-star'}
                      size={40}/>
                  </TouchableHighlight>
                  <TouchableHighlight key={this.props.data.alias + '5Star'}
                                      activeOpacity={0}
                                      onPress={() => {this._selectRating(5)}}>
                    <Icon.Ionicons
                      key={this.props.data.alias + '5StarIcon'}
                      name={this.state.rating < 5 ? 'md-star-outline' : 'md-star'}
                      size={40}/>
                  </TouchableHighlight>
                  <TouchableHighlight key={this.props.data.alias + 'Cancel'}
                                      onPress={() => {this._cancelSelect()}}
                                      style={{marginLeft: 150}}>
                    <Icon.Ionicons
                      key={this.props.data.alias + 'Close'}
                      name='md-close'
                      size={40}/>
                  </TouchableHighlight>

                </View>
              }
      </TouchableHighlight>
    )
  }
}


const styles = StyleSheet.create({
  unselectedRestaurant: {
    height:70,
    paddingLeft: 40,
    backgroundColor: '#fff',
  },

  selectedRestaurant: {
    height:70,
    paddingLeft: 40,
    backgroundColor: '#a0c4ff',
  },

  ratingView: {

  }



})
