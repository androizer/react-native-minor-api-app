import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import MapView from '../screens/MapView';
import ChatView from '../screens/ChatScreen';

const securedStackNavigator = createStackNavigator(
  {
    Home: {
      screen: MapView,
      navigationOptions: {
        header: null
      }
    },
    Chat: ChatView,
  },
  {
    initialRouteName: 'Home',
  }
);

export default securedStackNavigator;
