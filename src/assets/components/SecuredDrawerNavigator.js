import React, { Component } from 'react';
import {
  createDrawerNavigator, DrawerItems, StackActions, NavigationActions
} from 'react-navigation';
import {
  Icon, Container, Header, Body, Content, Button, Text
} from 'native-base';
import {
  Image, StyleSheet, View, AsyncStorage
} from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MapViewScreen from '../screens/MapView';

const DrawerCustomContentComponent = props => (
  <Container>
    <Header style={{ height: 175 }}>
      <Body style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={styles.drawerImage}
          source={require('../uploads/profile.png')}
        />
      </Body>
    </Header>
    <Content contentContainerStyle={{ borderColor: 'black', borderWidth: 0 }}>
      <DrawerItems {...props} />
    </Content>
    <View style={{
      borderColor: 'red', borderWidth: 0, borderTopColor: '#CED0CE', borderTopWidth: 1
    }}
    >
      <Button iconLeft transparent onPress={() => onStackReset(props)}>
        <Icon type="SimpleLineIcons" name="logout" style={{ color: 'black' }} />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingLeft: 20 }}>
          logout
        </Text>
      </Button>
    </View>
  </Container>
);

const SecuredDrawerNavigator = createDrawerNavigator(
  {
    MapView: {
      screen: MapViewScreen,
      navigationOptions: {
        drawerIcon: (
          <Icon type="MaterialCommunityIcons" name="google-maps" style={{ fontSize: 26 }} />
        )
      }
    },
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: {
        drawerIcon: (
          <Icon type="FontAwesome" name="dashboard" style={{ fontSize: 23 }} />
        )
      }
    }
  },
  {
    initialRouteName: 'MapView',
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
});

const onStackReset = async (props) => {
  await AsyncStorage.removeItem('@username');
  const resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Login' })
    ],
    key: null
  });
  return props.navigation.dispatch(resetAction);
};

export default SecuredDrawerNavigator;
