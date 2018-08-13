import React, { Component } from 'react';

import {
    Text,
    StyleSheet
} from 'react-native';

import {Container, Content, Header, Left, Icon, Button} from 'native-base';

export default class Dashboard extends Component {
    render() {
        return(
            <Container>
                <Header style={{justifyContent: 'flex-start'}}>
                    <Left>
                        <Button iconLeft transparent>
                            <Icon type="Ionicons" name="md-menu"
                            onPress={() => this.props.navigation.toggleDrawer()}
                            style={{color: 'white'}}
                            />
                        </Button>
                    </Left>
                </Header>
                <Content contentContainerStyle={styles.container}>
                    <Text>Dashboard Screen</Text>
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