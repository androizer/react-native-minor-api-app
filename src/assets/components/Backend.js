import cryptoJS from 'crypto-js';
import firebase from './FirebaseConfig';

class Backend {
  uid = '';

  locationRef = null;

  messageRef = null;

  // initialize firebase Backend
  constructor() {
    console.log('<------------ Calling Firebase Backend ------------>');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('User', user.uid);
        this.setUid(user.uid);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
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

  // retrieve the locations from the Backend
  loadNewLocations(callback) {
    console.log('<------ LoadNewLocations ------>');
    this.locationRef = firebase.database().ref('locations');
    this.locationRef.off();
    const onReceive = (data) => {
      const location = data.val();
      console.log(location);
      callback({
        _id: data.key,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        uid: location.uid
      });
    };
    this.locationRef.limitToLast(20).on('child_added', onReceive);
  }

  loadUpdatedLocation(callback) {
    const onReceive = (data) => {
      const location = data.val();
      callback({
        _id: data.key,
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    };
    this.locationRef.limitToLast(20).on('child_changed', onReceive);
  }

  // send the location to the Backend.
  sendLocation(location, uniqueID) {
    console.log('UniqueID before hashing: ------> ', uniqueID);
    const hash = this.generateHash(uniqueID.toString());
    console.log('<---------- Hash:  ', hash, ' ---------->');
    // console.log('location to be sent ------> ', location);
    this.locationRef.child(hash).set({
      coords: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      status: 'active',
      uid: uniqueID
    });
  }

  // send the updated location to the Backend.
  updateLocation(location) {
    this.locationRef.child(`${location._id}/coords`).update({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  loadOffLocation(uniqueID) {
    const hash = this.generateHash(uniqueID);
    this.locationRef.child(hash).update({ status: 'inactive' });
  }

  // send the messages to the Backend.
  loadNewMessages(callback) {
    this.messageRef = firebase.database().ref('chats');
    this.messageRef.off();
    const onReceive = (data) => {
      const message = data.val();
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

  // close the connection to the Backend
  closeTracking() {
    if (this.locationRef) {
      this.locationRef.off();
    }
    if (this.messageRef) {
      this.messageRef.off();
    }
  }

  generateHash = key => cryptoJS.enc.Base64.stringify(cryptoJS.MD5(key.toString()))
}

export default new Backend();
