/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ToastAndroid
} from 'react-native';
import firebase from 'react-native-firebase';


import StackNavigator from './assets/components/stackNavigator';

export default class App extends Component {

  
  componentWillMount() {
    console.log('componentDidMount called');
    this.getDeviceRegistrationToken();
    const channel = new firebase.notifications.Android.Channel(
      'qaz741wsx852edc963',
      'Default Channel',
      firebase.notifications.Android.Importance.Max
    ).setDescription('A natural description of the channel');

    firebase.notifications().android.createChannel(channel);

    firebase.notifications().onNotification(notification => {
      console.log("onNotification Notification: ", notification);
      const localNotification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true
      })
      .setNotificationId(notification.notificationId)
      .setTitle(notification.title)
      .setSubtitle(notification.subtitle)
      .setBody(notification.body)
      .setData(notification.data)
      .android.setChannelId('qaz741wsx852edc963')
      .android.setPriority(firebase.notifications.Android.Priority.Max);

      firebase.notifications()
      .displayNotification(localNotification)
      .catch(error => {
        console.error(error);
      });
    });
  }


  getDeviceRegistrationToken () {
    console.log('On Device Registration Token');
    firebase.messaging().getToken()
    .then(fcmToken => {
        if (fcmToken) {
            console.log("Device Registration Token: ", fcmToken)
            ToastAndroid.show(`Device Registration Token: ${fcmToken}`, ToastAndroid.SHORT);
        } else {
            console.log('Token not found');
            ToastAndroid.show('Token not found', ToastAndroid.LONG);
        } 
    });
  }

  render() {
    return (
      <StackNavigator/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
