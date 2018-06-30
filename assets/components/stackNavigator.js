import React, { Component } from 'react';
// cretateStackNavigator always in '{}' else 'Object not a function' error.
import {createStackNavigator} from 'react-navigation';
import UnsecuredDrawerNavigator from './unSecuredDrawerNavigator';
import SecuredDrawerNavigator from './SecuredDrawerNavigator';

const stackNavigator = createStackNavigator(
    {
        Login: {
            screen: UnsecuredDrawerNavigator
        },
        UserProfile: {
            screen: SecuredDrawerNavigator
        }
    },
    {
        initialRouteName: 'Login',
        headerMode: 'none'
    }
);

export default stackNavigator;