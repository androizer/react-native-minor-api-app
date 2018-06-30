import React, { Component } from 'react';
import axios from 'axios';

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    Alert
} from 'react-native';

import {Header, Left, Icon, Container, Content} from 'native-base';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            phone: '',
            password: '',
            confirmPassword: ''
        };
    }

    onLogin = () => {
        if (this.state.password == this.state.confirmPassword) {
            const {username,email,phone,password}  = this.state;
            let registerUser = {username,email,phone, password};
            console.log(registerUser);
            axios.post('http://localhost:3000/register', 
                registerUser
            ).then(response => {
                console.log(response.data)
            }).catch(err => {
                console.log(error)
            })
        } else {
            Alert.alert(
                'Alert',
                'Password mismatch',
                [
                    {text: 'Ok', onPress:() => console.log(`password: ${this.state.password} || confirmPassword: ${this.state.confirmPassword}`)}
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
                <Content contentContainerStyle={styles.container}>
                    <View style={styles.bodyContent}>
                        <Image style={{width: 125, height: 125}} source={require('../uploads/add-user.png')}/>
                        <TextInput onChangeText={email => this.setState({email})} value={this.state.email} style={styles.inputFields} placeholder="Enter email"/>
                        <TextInput onChangeText={username => this.setState({username})} value={this.state.username} style={styles.inputFields} placeholder="Enter username"/>
                        <TextInput onChangeText={phone => this.setState({phone})} value={this.state.phone} style={styles.inputFields} placeholder="Enter phone"/>
                        <TextInput onChangeText={password => this.setState({password})} value={this.state.password} secureTextEntry={true} style={styles.inputFields} placeholder="Enter password"/>
                        <TextInput onChangeText={confirmPassword => this.setState({confirmPassword})} value={this.state.confirmPassword} secureTextEntry={true} style={styles.inputFields} placeholder="Confirm password"/>
                        <View style={styles.loginView}>
                            <Button onPress={this.onLogin} title="Register"/>
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