import React, { Component } from 'react';
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';
import {Form, Item, Input, Label} from 'native-base';
import ipPort from '../components/ipConfig';

import {
    View,
    StyleSheet,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    Alert,
    AsyncStorage
} from 'react-native';

import {Header, Left, Icon, Container, Content} from 'native-base';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            userID: ''
        };
    }

    onStackReset = () => {
        console.log('stack reset function');
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'UserProfile', params: this.state })
            ],
            key: null
          });
        return this.props.navigation.dispatch(resetAction);
    }

    componentDidMount = async () => {
        console.log('componentDidMount called');
        try {
            const username = await AsyncStorage.getItem('@username');
            console.log(`username: ${username}`)
            if (username !== null) {
                const password = await AsyncStorage.getItem('@password');
                console.log(`password: ${password}`)
                this.setState({
                    username,
                    password
                })
                this.onLogin(username, password);
            }
        } catch(error) {
            console.log("Error while component mounting", error)
        }
    }

    storeDataAsync = async () => {
        try {
            if (await AsyncStorage.getItem('@username') == null) {
                await AsyncStorage.setItem('@username', `${this.state.username}`);
                await AsyncStorage.setItem('@password', `${this.state.password}`);
                console.log('successfully saved data');
            }
            console.log('user info already exists in database');
        } catch(error) {
            Alert.alert(
                'Alert',
                'Error saving data!',
                [
                    {text: 'Ok' , onPress:() => console.log('error saving data')}
                ],
                {cancelable: true}
            );
        }
    }

    onLogin = (user, pass) => {
        if (user.length > 0 && pass.length > 0) {
            // const {username, password} = this.state;
            console.log(`username: ${user}  password:${pass}`)
            axios.get(`http://${ipPort}/login/${user}/${pass}`)
            .then(response => {
                console.log(response);
                if (response.status == 200) {
                    this.setState({
                        userID: response.data
                    });
                    this.storeDataAsync();
                    Alert.alert(
                        'Alert',
                        'Signed In!',
                        [
                            {text: 'Ok' , onPress:() => this.onStackReset()}
                        ],
                        {cancelable: true}
                    );
                }
            }).catch(error => {
                console.log('Error occurred');
                console.log("Error Message ------------> ",error.message);
                if (error.message === 'Network Error') {
                    Alert.alert(
                        'Alert',
                        'Server Unreachable',
                        [
                            {text: 'Ok' , onPress: () => console.log('Invalid Credentials')}
                        ],
                        {cancelable: true}
                    );
                }
                else if (error.response.status == 401) {
                    Alert.alert(
                        'Alert',
                        'Invalid Credentials',
                        [
                            {text: 'Ok' , onPress: () => console.log('Invalid Credentials')}
                        ],
                        {cancelable: true}
                    );
                } else {
                    Alert.alert(
                        'Alert',
                        `Error: ${error}`,
                        [
                            {text: 'Ok' , onPress: () => console.log('Invalid Credentials')}
                        ],
                        {cancelable: true}
                    );
                }
            });
        } else {
            Alert.alert(
                'Alert',
                'Invalid Credentials',
                [
                    {title: 'OK'}
                ],
                {cancelable: true}
            )
        }
    }
    
    render() {
        return(
            <Container>
                <Header style={{justifyContent: 'flex-start'}}>
                    <Left>
                        <TouchableOpacity>
                            <Icon type="Ionicons" name="md-menu" 
                                onPress={() => this.props.navigation.toggleDrawer()}
                                style={{color: 'white'}}
                            />
                        </TouchableOpacity>
                    </Left>
                </Header>
                {/* Content is same as View, but mandatory to use with Container */}
                <Content contentContainerStyle={styles.container}>
                    <View style={styles.bodyContent}>
                        <Image style={{width: 150, height: 150}} source={require('../uploads/users.png')}/>
                        <Form style={{borderColor: 'black', borderWidth: 0}}>
                            <Item style={styles.inputFields}>
                                {/* <Label>Username</Label> */}
                                <Input onChangeText={username => this.setState({username})} value={this.state.username} placeholder='username' />
                            </Item>
                            <Item style={styles.inputFields} last>
                                {/* <Label>Password</Label> */}
                                <Input onChangeText={password => this.setState({password})} value={this.state.password} secureTextEntry={true} placeholder='password' />
                            </Item>
                        </Form>
                        <View style={styles.loginView}>
                            <Button onPress={() => this.onLogin(this.state.username, this.state.password)} title="Login"/>
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
        alignItems: 'center',
    },
    bgImage: {
        height: '100%', 
        width: '100%', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    inputFields: {
        width: '100%'
    },
    loginView: {
        borderColor: 'red',
        borderWidth: 0,
        width: '30%',
        height: '20%',
        alignSelf: 'flex-end',
    },
    bodyContent: {
        borderColor: 'red',
        borderWidth: 0,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
        width: '70%'
    }
})