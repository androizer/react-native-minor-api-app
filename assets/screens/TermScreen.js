import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';


export default class Term extends Component {
    render() {
        return(
            <View style={styles.container}>
                <Text>Terms and Condition</Text>
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
})