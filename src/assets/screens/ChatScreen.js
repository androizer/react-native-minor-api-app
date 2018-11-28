import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Backend from '../components/MessagesBackend';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.user = params.uid;
    this.uniqueID = params.uniqueID;
    Backend.setMessageRef(this.user, this.uniqueID);
    this.state = {
      messages: []
    };
  }

  componentWillMount() {
    // function called and received message object as callback
    Backend.loadNewMessages((message) => {
      this.setState(prevState => ({
        messages: GiftedChat.append(prevState.messages, message),
      }));
    });

    Backend.loadRemovedMessages((message) => {
      // console.log("Deleted Message----------> ", message);
      const messages = this.state.messages.slice(0);
      for (const i in messages) {
        if (messages[i]._id === message._id) {
          messages.splice(i, 1);
          this.setState({
            messages
          });
        }
      }
    });
  }

  componentWillUnmount() {
    Backend.closeChat();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(message) => {
          Backend.sendMessage(message);
        }}
        user={{
          _id: Backend.getUid(),
          name: this.uniqueID
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
});
