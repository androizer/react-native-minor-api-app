import React, { Component } from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TermScreen from '../screens/TermScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import {Container, Body, Header, Content, Icon} from 'native-base';
import {Image, StyleSheet} from 'react-native';


const DrawerCustomContentComponent = (props) => (
    <Container>
        <Header style={{height: 175}}>
            <Body style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                style={styles.drawerImage}
                source={require('../uploads/team.png')}
                />
            </Body>
        </Header>
        <Content>
            <DrawerItems {...props}/>
        </Content>
    </Container>
)

const UnSecuredDrawerNavigator = createDrawerNavigator(
    {
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                drawerIcon: (
                    <Icon type="MaterialCommunityIcons" name="login"/>
                )      
            }
        },
        Register: {
            screen: RegisterScreen,
            navigationOptions: {
                drawerIcon: (
                    <Icon type="FontAwesome" name="user-plus"/>
                )      
            }
        },
        Terms: {
            screen: TermScreen,
            navigationOptions: {
                drawerIcon: (
                    <Icon type="MaterialCommunityIcons" name="clipboard-text"/>
                )      
            }
        },
        Privacy: {
            screen: PrivacyScreen,
            navigationOptions: {
                drawerIcon: (
                    <Icon type="MaterialCommunityIcons" name="lock"/>
                )
            }
        }
    },
    {
        initialRouteName: 'Login',
        contentComponent: DrawerCustomContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle'
    }
);

const styles = StyleSheet.create({
    drawerImage: {
        height: 150,
        width: 150
    }
})

export default UnSecuredDrawerNavigator;