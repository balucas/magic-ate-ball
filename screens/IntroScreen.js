import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, ScrollView, TouchableHighlight, Image } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { AppLoading, Asset, Font, Icon, Permissions, Location } from 'expo';
import getRestaurants from '../data/YelpData';

export default class IntroScreen extends React.Component {
constructor(){
  super();
  this.getLocationAsync().then((response) => {
    console.log(response.coords);
    this.setState({location: response.coords});
    console.log(this.state.location);
    getRestaurants(this.state.location).then((response) => {

      this.getExistingRestaurantList().then((exresponse) => {
        if(exresponse != null){
          console.log('ex rest list: ' + exresponse);
          response.forEach(function(item) {
            var restId = item.id;
            // for(var key in exresponse) {
            //   console.log(key);
            //   console.log(exresponse[key]);
            // }
            if(exresponse[restId] != null){
              // consol.log("haiiiiiiiiiiiiiiiiiiii")
              response[restId] = exresponse[restId];
            }
          });
        }
      });
      this.setState({isLoadingComplete: true, restaurants: response});
    });
  });
}

state = {
  isLoadingComplete: false,
  isFirstLoad: false,
  restaurants: [],
  locationPermissions: false,
  location: {}
};

  render() {
      return (
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center',
                        paddingTop: 8,
                        paddingBottom: 8,
                        borderBottomColor: '#000000'}}>
            <Text style={{fontSize: 20,}}>
              Rate the restaurants you have been to!
            </Text>
          </View>
          <ScrollView>
            {this.state.isLoadingComplete?
            <RestaurantList that={this}/>
            :
            <View style={{alignItems: 'center', justifyContent:'center'}}>
              <Image style={{height: 200, width:200}} source={require('../assets/magicateball.png')}/>
            </View>
            }
          </ScrollView>
          {this.state.isLoadingComplete
            ?
          <Button title='Tell me where to eat!'
                  onPress={() => {this._handleProceed(this)}}/>
            :
          <Text>Loading</Text>

          }
        </View>
      )
  }

  async getLocationAsync() {
    const { Location, Permissions } = Expo;
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      this.setState({locationPermissions: true});
      return Location.getCurrentPositionAsync({enableHighAccuracy: true});

    } else {
      throw new Error('Location permission not granted');
    }
  }

  async getExistingRestaurantList(){
    try {
      const value = await AsyncStorage.getItem('SelectedRestaurants');
      if (value !== null) {
        // We have data!!
        console.log(value);
        return value;
      }else{
        return null;
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  async _saveSuggestion(suggestion){

    await AsyncStorage.setItem('SuggestedRestaurants', suggestion);
  }

  async _handleProceed(that){
    var selectedRestaurants = this.state.restaurants.filter(item => item.isSelected && item.rating != 0);
    console.log(JSON.stringify(selectedRestaurants));
    var selectedRestaurantMap = {};
    selectedRestaurants.forEach(function(item){
      selectedRestaurantMap[item.id] = item;
    });
    try {
        await AsyncStorage.setItem('SelectedRestaurants', JSON.stringify(selectedRestaurantMap));

        // if (isEmpty(selectedRestaurantMap)) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = (e) => {
          if (request.readyState !== 4) {
            return;
          }

          if (request.status === 200) {
            console.log('success', request.responseText);
            this._saveSuggestion(request.responseText);
          } else {
            // console.warn('error');
          }
        };
      // }
        console.log(this.state.restaurants);
        var payload = { "longitude" : this.state.location.longitude,
                        "latitude" : this.state.location.latitude,
                        "selectedRestaurants" : selectedRestaurants,
                        "allRestaurants" : this.state.restaurants
                      };

        request.open('POST', 'http://35.231.187.174:5000/info');
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(payload));

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
  var list = props.that.state.restaurants;
  const listView = list.map((item) =>
    <RestaurantSelect key={item.alias} data={item}/>
  );
  return (
    listView
  )
}

class RestaurantSelect extends React.Component{
  constructor(){
    super();
    this._initState().then(response =>{
      if(this.props.data.isSelected){
        this.setState({selectActive: true, rating: this.props.data.rating});
      }
    });
  }

  state = {
    selectActive: false,
    rating: 0,
  }

  _initialSelect(){
    console.log(this.props.data)
    if (this.props.data.isSelected) {
      this.setState({selectActive: true, rating: this.props.data.rating});
    } else {
      this.setState({selectActive: true});
      this.props.data.isSelected = true;
    }
  }

  _cancelSelect(){
    this.setState({selectActive: false});
    this.props.data.isSelected = false;
  }

  _selectRating(rating){
    this.setState({rating: rating});
    this.props.data.rating = rating;
  }

  async _initState(){
    setTimeout(function(){

    }, 200);
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
                <View>
                  <View key={this.props.data.alias + 'View'} style={{paddingTop: 10}}>
                    <Text key={this.props.data.alias + 'Name'}>{this.props.data.name}</Text>
                  </View>
                  <View key={this.props.data.alias + 'Rate'}
                        style={{flexDirection: 'row',
                                paddingTop: 0,
                                paddingLeft: 20}}>
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
    height:100,
    paddingLeft: 40,
    backgroundColor: '#a0c4ff',
  },

  ratingView: {

  }



})
