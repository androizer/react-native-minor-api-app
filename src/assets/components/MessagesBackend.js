import cryptoJS from 'crypto-js';
import firebase from './FirebaseConfig';

class Backend {
    uid = '';

    messageRef = null;

    messagesLocation = null;

    // initialize firebase Backend
    constructor() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setUid(user.uid);
        } else {
          firebase.auth().signInAnonymously().catch((error) => {
            console.log(error.message);
          });
        }
      });
    }

    setUid(value) {
      this.uid = value;
    }

    getUid() {
      return this.uid;
    }

    setMessageRef = (uid, uniqueID) => {
      // console.log('uid: ', uid, 'uniqueID: ', uniqueID);
      const userID = parseInt(uid, 16);
      const myID = parseInt(uniqueID, 16);
      const key = userID + myID;
      // console.log('Sum is: ', key);
      this.messagesLocation = this.generateHash(key.toString(16));
      console.log('messagesLocation: ------> ', this.messagesLocation);
      this.messageRef = firebase.database().ref('chat').child(this.messagesLocation);
    }

    // retrieve the messages from the Backend
    loadNewMessages(callback) {
      console.log('LoadNewMessage');
      this.messageRef = firebase.database().ref('chat').child(this.messagesLocation);
      this.messageRef.off();
      const onReceive = (data) => {
        const message = data.val();
        // callback will be send back to the calling object.
        console.log('OnRecieve-------> ', message, data.key);
        callback({
          _id: data.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.user._id,
            name: message.user.name
          }
        });
      };
      this.messageRef.limitToLast(20).on('child_added', onReceive);
    }

    loadRemovedMessages(callback) {
      this.messageRef = firebase.database().ref('chat').child(this.messagesLocation);
      const onDelete = (data) => {
        console.log('Data------> ', data);
        const message = data.val();
        console.log(`Message: ${message}    Key: ${data.key}`);
        callback({
          _id: data.key,
          text: message.text,
          createdAt: new Date(message.createdAt),
          messageId: message.messageId,
          user: {
            _id: message.user._id,
            name: message.user.name
          }
        });
      };
      this.messageRef.limitToLast(20).on('child_removed', onDelete);
      return callback;
    }

    // send the message to the Backend
    sendMessage(message) {
      message.map((element) => {
        console.log('Message Object Before Pushing -----> ', element);
      });
      for (let i = 0; i < message.length; i += 1) {
        this.messageRef.push({
          text: message[i].text,
          user: message[i].user,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        });
      }
    }

    // close the connection to the Backend
    closeChat() {
      if (this.messageRef) {
        this.messageRef.off();
      }
    }

    generateHash = key => cryptoJS.enc.Base64.stringify(cryptoJS.MD5(key))
}

export default new Backend();
