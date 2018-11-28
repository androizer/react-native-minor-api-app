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
    Chat: {
      screen: ChatView,
      navigationOptions: ({ navigation }) => ({
        headerTitle: `${navigation.state.params.username}`,
        headerTitleStyle: {
          textAlign: 'center',
          flexGrow: 1
        }
      })
    }
  },
  {
    initialRouteName: 'Home',
  }
);

export default securedStackNavigator;
