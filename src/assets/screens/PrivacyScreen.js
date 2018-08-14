import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native';


export default class Privacy extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
            Privacy Panel
        </Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
