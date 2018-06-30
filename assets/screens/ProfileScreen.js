import React, { Component } from 'react';

import {
    Text,
    StyleSheet
} from 'react-native';

import {Container, Content, Header, Left, Icon, Button} from 'native-base';

export default class Profile extends Component {
    render() {
        return(
            <Container>
                <Header style={{justifyContent: 'flex-start'}}>
                    <Left>
                        <Button iconLeft transparent>
                            <Icon type="Ionicons" name="md-menu"
                            style={{color: 'white'}}
                            onPress={() => this.props.navigation.toggleDrawer()}
                            />
                        </Button>
                    </Left>
                </Header>
                <Content contentContainerStyle={styles.container}>
                    <Text>Profile Screen</Text>
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
    }
})