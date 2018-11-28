import React, { Component } from 'react';
import axios from 'axios';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  Form, Item, Input, Label, Toast, Header, Left, Icon, Container, Content, Button as NBButton
} from 'native-base';
import {
  LoginManager, AccessToken, GraphRequest, GraphRequestManager
} from 'react-native-fbsdk';
import { GoogleSigninButton, GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';

import {
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  AsyncStorage,
  Text,
  ToastAndroid,
  ActivityIndicator,
  Modal
} from 'react-native';

import ipPort from '../components/ipConfig';
import sharedResources from '../components/SharedResources';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      username: '',
      password: '',
      userID: '',
      user: '',
      posts: [],
      modalVisible: false
    };
  }

  componentWillMount() {
    firebase.notifications().onNotificationDisplayed((notification) => {
      console.log('Notification in onNotificationDisplayed', notification);
      // Triggered when a particular notification has been displayed
    });
  }

  componentDidMount = () => {
    this.checkAsyncStorageInstance();
    this.hasPermission();
    // this.addRandomPost();
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

    onStackReset = () => {
      console.log('stack reset function');
      const { username, password, userID } = this.state;
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate(
            {
              routeName: 'UserProfile',
              params: { username, password, userID }
            }
          )
        ],
        key: null
      });
      return this.props.navigation.dispatch(resetAction);
    }

    onTokenRefreshListener = () => {
      console.log('On Refresh Token');
      firebase.messaging().onTokenRefresh((fcmToken) => {
        console.log('refresh token block');
        if (fcmToken) {
          console.log('Refresh Device Registration Token: ', fcmToken);
          ToastAndroid.show(`Device Registration Token: ${fcmToken}`, ToastAndroid.SHORT);
        } else {
          console.log('Token not found');
          ToastAndroid.show('Token not found', ToastAndroid.LONG);
        }
      });
    }

    onCollectionUpdate = (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        const { username, password, email } = doc.data();
        posts.push({
          key: doc.id, // Document ID
          doc, // DocumentSnapshot
          username,
          password,
          email,
        });
      });
      this.setState({
        posts,
      });
      console.log(this.state.posts);
      console.log('Length: ', this.state.posts.length);
    }

    onLogin = (user, pass) => {
      if (user.length > 0 && pass.length > 0) {
        this.setState(() => ({
          modalVisible: true
        }));
        console.log(`username: ${user}  password:${pass}`);
        axios.get(`https://${ipPort}/login/${user}/${pass}`)
          .then((response) => {
            console.log('Login Response -----> ', response);
            if (response.status == 200) {
              this.setState({
                userID: response.data,
                modalVisible: false
              });
              this.storeDataAsync();
              ToastAndroid.show(`Signed in as ${this.state.username}`, ToastAndroid.SHORT);
              sharedResources.setUsername(this.state.username);
              this.onStackReset();
            }
          }).catch((error) => {
            console.log('Login Error');
            console.log('Error Message ------------> ', error.message);
            if (error.message === 'Network Error') {
              Alert.alert(
                'Alert',
                'Server Unreachable',
                [
                  { text: 'Ok', onPress: () => console.log('Invalid Credentials') }
                ],
                { cancelable: true }
              );
            } else if (error.response.status == 401) {
              Alert.alert(
                'Alert',
                'Invalid Credentials',
                [
                  { text: 'Ok', onPress: () => console.log('Invalid Credentials') }
                ],
                { cancelable: true }
              );
            } else {
              Alert.alert(
                'Alert',
                `Error: ${error}`,
                [
                  { text: 'Ok', onPress: () => console.log('Invalid Credentials') }
                ],
                { cancelable: true }
              );
            }
          });
      } else {
        Alert.alert(
          'Alert',
          'Invalid Credentials',
          [
            { text: 'OK' }
          ],
          { cancelable: true }
        );
      }
    }

    getCurrentUser = async () => {
      try {
        const user = await GoogleSignin.currentUserAsync();
        this.setState({ user });
        console.log('user in getCurrentUser:', user);
        if (user == null) {
          this.signIn();
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAsyncStorageInstance = async () => {
      try {
        console.log('Checking Async Storage for existing user');
        const username = await AsyncStorage.getItem('@username');
        console.log(`username: ${username}`);
        if (username !== null) {
          const password = await AsyncStorage.getItem('@password');
          console.log(`password: ${password}`);
          this.setState({
            username,
            password
          });
          this.onLogin(username, password);
        } else {
          console.log('username doesn\'t exist');
        }
      } catch (error) {
        console.log('Error while component mounting', error);
      }
    }

    addRandomPost = () => {
      const user = {
        username: 'appu',
        password: 'helloBoy',
        email: 'akki@def.com'
      };
      this.ref.add(user);
      console.log(user);
    }

    androidChannelHousekeeping = () => {
      const channel = new firebase.notifications.Android.Channel('akki7164', 'Test Channel 7164', firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel');

        // Create the channel
      firebase.notifications().android.createChannel(channel);

      const notification = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle('My notification title')
        .setBody('My notification body');

      notification
        .android.setChannelId('testChannel123')
        .android.setSmallIcon('ic_launcher');

      firebase.notifications().displayNotification(notification);
    }

    storeDataAsync = async () => {
      try {
        if (await AsyncStorage.getItem('@username') == null) {
          await AsyncStorage.setItem('@username', `${this.state.username}`);
          await AsyncStorage.setItem('@password', `${this.state.password}`);
          console.log('successfully saved data');
        }
        console.log('user info already exists in database');
      } catch (error) {
        Alert.alert(
          'Alert',
          'Error saving data!',
          [
            { text: 'Ok', onPress: () => console.log('error saving data') }
          ],
          { cancelable: true }
        );
      }
    }

    facebookLogin = () => {
      ToastAndroid.show('Facebook login', ToastAndroid.SHORT);
      LoginManager.logInWithReadPermissions(['public_profile', 'email'])
        .then((result) => {
          if (result.isCancelled) {
            ToastAndroid.show('Login Cancelled', ToastAndroid.SHORT);
            console.log(result);
          } else if (result.grantedPermissions.length > 0) {
            AccessToken.getCurrentAccessToken()
              .then((data) => {
                console.log(`Data Access Token:: ${data.accessToken.toString()}`);
                const { accessToken } = data;

                const responseCallBack = (error, res) => {
                  if (error) {
                    console.log('Error in graph callback: ', error);
                  } else {
                    console.log('Graph Response:', res);
                  }
                };
                const infoRequest = new GraphRequest(
                  '/me',
                  {
                    accessToken,
                    parameters: {
                      fields: {
                        string: 'name, email, first_name, last_name, picture.type(large)'
                      }
                    }
                  },
                  responseCallBack
                );

                new GraphRequestManager().addRequest(infoRequest).start();
              }).catch((error) => {
                console.log(`Error: ${error}`);
              });
          } else {
            console.log(result);
          }
        }).catch((error) => {
          ToastAndroid.show(`Login fail with error: ${error}`, ToastAndroid.SHORT);
        });
    }

    signIn = async () => {
      try {
        const user = await GoogleSignin.signIn();
        this.setState({ user });
        console.log('user in signIn: ', user);
      } catch (error) {
        if (error.code === 'CANCELED') {
          console.log('user cancelled the login flow');
          ToastAndroid.show('Login Cancelled!', ToastAndroid.LONG);
        } else {
          console.log('some other error happened');
        }
      }
    };

    googleLogin = () => {
      GoogleSignin.hasPlayServices({ autoResolve: true })
        .then(() => {
          // play services are available. can now configure library
          ToastAndroid.show('Google Services found', ToastAndroid.LONG);
          GoogleSignin.configure({
            webClientId: '349348397159-2tq2ag6p3fug02r6p189l4mbmrbh3fpr.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: false
          }).then(() => {
            console.log('configure success');
            this.getCurrentUser();
          });
        })
        .catch((err) => {
          console.log('Play services error', err.code, err.message);
        });
    }

    hasPermission = () => {
      firebase.messaging().hasPermission()
        .then(async (enabled) => {
          if (enabled) {
            console.log('User has permission');
            // user has permissions
          } else {
            try {
              await firebase.messaging().requestPermission();
            } catch (error) {
              console.log(error);
            }
          }
        });
    }

    render() {
      return (
        <Container>
          <Header style={{ justifyContent: 'flex-start' }}>
            <Left>
              <TouchableOpacity>
                <Icon
                  type="Ionicons"
                  name="md-menu"
                  onPress={() => this.props.navigation.toggleDrawer()}
                  style={{ color: 'white' }}
                />
              </TouchableOpacity>
            </Left>
          </Header>
          {/* Content is same as View, but mandatory to use with Container */}
          <Content contentContainerStyle={styles.container}>
            <Modal
              animationType="slide"
              transparent
              visible={this.state.modalVisible}
              onRequestClose={() => {
              // alert('Modal has been closed.');
                this.setState({
                  modalVisible: false
                });
              }}
            >
              <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center' }}>
                <View
                  style={styles.modalView}
                >
                  <ActivityIndicator color="blue" size={50} animating />
                  <Text style={{ alignSelf: 'center', fontSize: 16 }}>
                  Fetching user details...
                  </Text>
                </View>
              </View>
            </Modal>
            <View style={styles.bodyContent}>
              <Image style={{ width: 150, height: 150, borderWidth: 10 }} source={require('../uploads/users.png')} />
              <Form style={{ borderWidth: 10, borderColor: '#e9e9ef' }}>
                <Item style={styles.inputFields}>
                  {/* <Label>Username</Label> */}
                  <Input onChangeText={username => this.setState({ username })} value={this.state.username} placeholder="username" />
                </Item>
                <Item style={styles.inputFields}>
                  {/* <Label>Password</Label> */}
                  <Input onChangeText={password => this.setState({ password })} value={this.state.password} secureTextEntry placeholder="password" />
                </Item>
              </Form>
              <View style={styles.loginView}>
                <Text style={{ color: 'blue', alignSelf: 'center' }}>
                    Forgot Password?
                </Text>
                <Button style={{}} onPress={() => this.onLogin(this.state.username, this.state.password)} title="Login" />
              </View>
              <View style={{ borderTopWidth: 10, borderTopColor: '#e9e9ef' }}>
                <NBButton iconLeft style={styles.facebookButton} onPress={this.facebookLogin}>
                  <Icon type="MaterialCommunityIcons" name="facebook" style={{ color: '#fff' }} />
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Log In using Facebook
                    {'  '}
                  </Text>
                </NBButton>
              </View>
              <View style={{ borderTopWidth: 10, borderTopColor: '#e9e9ef' }}>
                <GoogleSigninButton
                  style={{ width: 230, height: 48 }}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  onPress={this.googleLogin}
                />
              </View>
            </View>
          </Content>
        </Container>
      );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputFields: {
    width: '100%'
  },
  loginView: {
    borderWidth: 10,
    borderColor: '#e9e9ef',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
  },
  facebookButton: {
    backgroundColor: '#385899',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    elevation: 5,
    width: 230,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  bodyContent: {
    borderColor: 'blue',
    borderWidth: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    width: '80%'
  },
  modalView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    width: '70%',
    height: '12%',
    marginLeft: '15%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 5,
    marginTop: 10,
    elevation: 5,
  }
});
