import React from 'react';

export default function getRestaurants(location){
  var longitude = location.longitude;
  var latitude = location.latitude;

  return fetch('https://api.yelp.com/v3/businesses/search?latitude=' + latitude + '&longitude=' + longitude + '&categories=restaurants&open_now=true', {
                method: 'GET',
                headers:  { 'Postman-Token': '84c78f1d-1acc-443b-8646-3b9cae19ac81',
                            'cache-control': 'no-cache',
                            Authorization: 'Bearer 8wyFu-zWCjFkOelM4pLLDIt4ZWH0IMtv1zJMQORCBd1zx1UfTbpiyhtKGekwM4m-LhD3gonIdaRSf6cfdmd5nvHhVOivnny2R2YGAaUd8pRRbzC0CpS2iv3hpbtVXHYx' } }
              ).then((response) => {
                // console.log(( JSON.stringify(JSON.parse(response._bodyText).businesses)));
                return JSON.parse(response._bodyText).businesses;
              });
}

//export const Restaurants = getRestaurants();
