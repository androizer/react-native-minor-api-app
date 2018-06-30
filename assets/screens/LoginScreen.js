import React, { Component } from 'react';
import axios from 'axios';
import {StackActions, NavigationActions} from 'react-navigation';
import {
    View,
    StyleSheet,
    TextInput,
    Button,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';

import {Header, Left, Icon, Container, Content} from 'native-base';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    onStackReset = () => {
        console.log('stack reset function');
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: 'UserProfile' })
            ],
            key: null
          });
        return this.props.navigation.dispatch(resetAction);
    }

    onLogin = () => {
        if (this.state.username.length > 0 && this.state.username.length > 0) {
            const {username, password} = this.state;
            console.log(`username: ${username}  password:${password}`)
            axios.get(`http://192.168.1.16:3000/login/${username}/${password}`)
            .then(response => {
                console.log(response.status);
                if (response.status == 200) {
                    Alert.alert(
                        'Alert',
                        'Signed In!',
                        [
                            {text: 'Ok' , onPress:() => this.onStackReset}
                        ],
                        {cancelable: true}
                    )
                    // this.onStackReset();
                }
            }).catch(error => {
                console.log('Error occured');
                console.log("Error Message ------------> ",error.message);
                if (error.message === 'Network Error') {
                    Alert.alert(
                        'Alert',
                        'Server Unreachable',
                        [
                            {text: 'Ok' , onPress: () => console.log('Invalid Credentials')}
                        ],
                        {cancelable: true}
                    )
                }
                else if (error.response.status == 401) {
                    Alert.alert(
                        'Alert',
                        'Invalid Credentials',
                        [
                            {text: 'Ok' , onPress: () => console.log('Invalid Credentials')}
                        ],
                        {cancelable: true}
                    )
                } else {
                    Alert.alert(
                        'Alert',
                        `Error: ${error}`,
                        [
                            {text: 'Ok' , onPress: () => console.log('Invalid Credentials')}
                        ],
                        {cancelable: true}
                    )
                }

            })
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
                        <TextInput onChangeText={username => this.setState({username})} value={this.state.username} style={styles.inputFields} placeholder="Enter email"/>
                        <TextInput onChangeText={password => this.setState({password})} value={this.state.password} secureTextEntry={true} style={styles.inputFields} placeholder="Enter password"/>
                        <View style={styles.loginView}>
                            <Button onPress={this.onLogin} title="Login"/>
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '70%'
    }
})