import React, { Component } from 'react';
import axios from 'axios';
import ipPort from '../components/ipConfig';

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

import {Header, Left, Icon, Container, Content, Form, Item, InputGroup, Input} from 'native-base';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            phone: '',
            password: '',
            confirmPassword: '',
            userSuccess: false,
            userError: false,
            emailSuccess: false,
            emailError: false
        };
    }

    onLogin = () => {
        if (this.state.password == this.state.confirmPassword) {
            const {username,email,phone,password}  = this.state;
            let registerUser = {username,email,phone, password};
            console.log(registerUser);
            axios.post(`http://${ipPort}/register`, 
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

    checkUserAvail = () => {
        console.log('checkUserAvail api');
        console.log(this.state.username);
        axios.get(`http://${ipPort}/useravail/${this.state.username}`)
        .then(response => {
            console.log(response)
            if (response.data === false) {
                console.log('User doesn\'t exist, proceed.');
                // User doesn't exist, proceed.
                this.setState({
                    inputSuccess: true,
                    inputError: false
                })
            } else if (response.data === true) {
                // User exist, use another user name.
                console.log('User exist, use another user name')
                this.setState({
                    inputSuccess: false,
                    inputError: true
                })
            }
        }).catch(error => {
            console.log("Error-----> ", error)
        })
    }

    checkEmailAvail = () => {
        console.log('checkUserAvail api');
        console.log(this.state.username);
        axios.get(`http://${ipPort}/emailavail/${this.state.email}`)
        .then(response => {
            console.log(response)
            if (response.data === false) {
                console.log('Email doesn\'t exist, proceed.');
                // User doesn't exist, proceed.
                this.setState({
                    emailSuccess: true,
                    emailError: false
                })
            } else if (response.data === true) {
                // User exist, use another user name.
                console.log('Email exist, use another email address')
                this.setState({
                    emailSuccess: false,
                    emailError: true
                })
            }
        }).catch(error => {
            console.log("Error-----> ", error)
        })
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
                        <Form>
                            <Item style={styles.inputFields}>
                                <Input  onBlur={() => this.checkUserAvail()} placeholder='username' onChangeText={username => this.setState({username})} value={this.state.username}/>
                                {this.state.inputSuccess?<Icon style={{color: 'green'}} name='checkmark-circle' /> : null}
                                {this.state.inputError?<Icon style={{color: 'red'}} name='close-circle' /> : null}
                            </Item>
                            <Item style={styles.inputFields}>
                                <Input onBlur={() => this.checkEmailAvail()} placeholder='email' onChangeText={email => this.setState({email})} value={this.state.email}/>
                                {this.state.emailSuccess?<Icon style={{color: 'green'}} name='checkmark-circle' /> : null}
                                {this.state.emailError?<Icon style={{color: 'red'}} name='close-circle' /> : null}
                            </Item>
                            <Item style={styles.inputFields}>
                                <Input placeholder='phone' onChangeText={phone => this.setState({phone})} value={this.state.phone}/>
                            </Item>
                            <Item style={styles.inputFields}>
                                <Input placeholder='password' onChangeText={password => this.setState({password})} value={this.state.password} secureTextEntry={true}/>
                                {this.state.password && this.state.confirmPassword && (this.state.password == this.state.confirmPassword) ? <Icon style={{color: 'green'}} name='checkmark-circle' /> : null}
                                {this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword ? <Icon style={{color: 'red'}} name='close-circle' /> : null}
                            </Item>
                            <Item style={styles.inputFields}>
                                <Input placeholder='confirm password' onChangeText={confirmPassword => this.setState({confirmPassword})} value={this.state.confirmPassword} secureTextEntry={true}/>
                                {this.state.password && this.state.confirmPassword && (this.state.password == this.state.confirmPassword) ? <Icon style={{color: 'green'}} name='checkmark-circle' /> : null}
                                {this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword ? <Icon style={{color: 'red'}} name='close-circle' /> : null}
                            </Item>
                        </Form>
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
        width: '70%'
    }
})

{/* <TextInput onChangeText={email => this.setState({email})} value={this.state.email} style={styles.inputFields} placeholder="Enter email"/>
<TextInput onChangeText={username => this.setState({username})} value={this.state.username} style={styles.inputFields} placeholder="Enter username"/>
<TextInput onChangeText={phone => this.setState({phone})} value={this.state.phone} style={styles.inputFields} placeholder="Enter phone"/>
<TextInput onChangeText={password => this.setState({password})} value={this.state.password} secureTextEntry={true} style={styles.inputFields} placeholder="Enter password"/>
<TextInput onChangeText={confirmPassword => this.setState({confirmPassword})} value={this.state.confirmPassword} secureTextEntry={true} style={styles.inputFields} placeholder="Confirm password"/> */}