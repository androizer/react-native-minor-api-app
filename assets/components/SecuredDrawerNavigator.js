import React, { Component } from 'react';
import {createDrawerNavigator, DrawerItems} from 'react-navigation';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import {Icon, Container, Header, Body, Content, Button} from 'native-base';
import {Image, StyleSheet} from 'react-native';

const DrawerCustomContentComponent = (props) => (
    <Container>
        <Header style={{height: 175}}>
            <Body style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                style={styles.drawerImage}
                source={require('../uploads/profile.png')}
                />
            </Body>
        </Header>
        <Content>
            <DrawerItems {...props}/>
        </Content>
    </Container>
)

const SecuredDrawerNavigator = createDrawerNavigator(
    {
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                drawerIcon: (
                    <Icon type="MaterialCommunityIcons" name="face-profile" style={{fontSize: 26}}/>
                )
            }
        },
        Dashboard: {
            screen: DashboardScreen,
            navigationOptions: {
                drawerIcon: (
                    <Icon type="FontAwesome" name="dashboard" style={{fontSize: 23}}/>
                )
            }
        }
    },
    {
        initialRouteName: 'Profile',
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

export default SecuredDrawerNavigator;