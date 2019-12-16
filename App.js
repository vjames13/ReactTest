import React, { Component, useEffect, Fragment } from 'react';
import { Platform, StyleSheet, Text, View, Button, Modal, Alert, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import LocationDetails from './components/LocationDetails';
import moment from './moment';
import { checkPermission, createNotificationChannel } from './components/NotificationService';
import LocationInput from './components/LocationInput';

var BadgeAndroid = require('react-native-android-badge');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default class App extends Component {


  //set initial state
  state = {
    userLocation: null,
    usersPlaces: [],
    modalVisible: false,
    infoModalVisible: false,
    locationTitle: '',
    locationDescription: '',
    selectedLocation: {
      title: 'default',
      description: 'default',
      date: 'default'
      //id: null
    },
    mapRegion: {
      latitude: null,
      longitude: null,
      latitudeDelta: 0.00010499999,
      longitudeDelta: 0.007058
    }
  };

  //load loacation markers from firebase
  componentWillMount(){
    firebase.messaging().subscribeToTopic("location");
  }

  componentDidMount() {
    // Create notification channel required for Android devices and load locations from firebase
    checkPermission();
    createNotificationChannel();
    this.getUserPlacesHandler();
    this.messageListener();
  }

  //method to refresh map
  update() {
    this.getUserPlacesHandler();
    this.forceUpdate();
  }

//listen for FCM remote messages and handle depending on status of app
messageListener = async () => {
    //when app is running and open (might be redundant)
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      this.update();

      firebase.notifications().displayNotification(builtNotif);
    });
  
    //when the notification was clicked
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.update();
        const data = notificationOpen.notification.data


        const location = {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            date: data.date,
            title: data.title,
            description: data.description
        };

        this.setLocationState(location);
        this.selectLocationHandler(location);

    });
    //when the app was opened by clicking on a notification
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        this.update();
        const data = notificationOpen.notification.data;

        const location = {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            date: data.date,
            title: data.title,
            description: data.description
        };

        this.setLocationState(location);
        this.selectLocationHandler(location);
    }
    //when the app is open (might create the redundancy from earlier)
    this.messageListener = firebase.messaging().onMessage((message) => {
      const title = Platform.OS === 'android' ? message.data.title : '';
      const notification = new firebase.notifications.Notification()
      .setNotificationId('1')
      .setTitle('A new location was just posted!')
      .setBody(title)
      .setData({
        title: message.data.title,
        description: message.data.description,
        date: message.data.date,
        latitude: message.data.latitude,
        longitude: message.data.longitude
      })
      .android.setPriority(firebase.notifications.Android.Priority.High)
      .android.setChannelId('reminder')
      .android.setSmallIcon("@drawable/notification_icon")
      .android.setLargeIcon("@drawable/notification_icon")
      .android.setAutoCancel(true);


      firebase.notifications().displayNotification(notification);
      console.log(JSON.stringify(message));
    });

}

  //handlers
  handlePlaceChange = (title, value) => {
    this.setState({[title]: value});
  }

  setModalVisible(modal, visible) {
    this.setState({
      [modal]: visible
    });
  }
  
  //close location entry and upload to firebase
  endLocationModal = () => {
    this.setModalVisible('modalVisible', false);
    this.getUserLocationHandler();
  }
  //when user clicks on an already existing location marker
  selectLocation = async (userPlace) => {
    this.setState({
      selectedLocation: {
        title: userPlace.title,
        description: userPlace.description,
        date: userPlace.date
        //id: userPlace.id
      }
    },()=>{
      this.setModalVisible('infoModalVisible', true)
    })
  }

  selectLocationHandler = async (userPlace) => {
    this.setLocationState(userPlace);
     await this.selectLocation(userPlace);
  }
  //update map region to currently selected marker
  setLocationState = (location) => {
    this.setState({
          mapRegion: {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            latitudeDelta: 0.00010499999,
            longitudeDelta: 0.007058
          }
        });
  }

  //handler to retrieve current location using gps
  getUserLocationHandler = () => {
    this.update();
    let now = moment().format("MM-DD-YYYY HH:mm");
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,
          date: now
          //title: "this is a test title",
          //description: "this is a test description"
        },
        mapRegion: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00010499999,
          longitudeDelta: 0.007058
        }
      })
      //post to firebase
      fetch('https://reactnativetest-258018.firebaseio.com/places.json',{
        method: 'POST',
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          title: this.state.locationTitle,
          description: this.state.locationDescription,
          date: this.state.userLocation.date
        })
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
      console.log(position);
    }, err => console.log(err), {'maximumAge':0});
  }

  //load set locations from firebase
  getUserPlacesHandler = () => {
    fetch('https://reactnativetest-258018.firebaseio.com/places.json')
      .then(res => res.json())
      .then(parsedRes => {
        const placesArray = [];
        for (const key in parsedRes) {
          placesArray.push({
            latitude: parsedRes[key].latitude,
            longitude: parsedRes[key].longitude,
            title: parsedRes[key].title,
            description: parsedRes[key].description,
            date: parsedRes[key].date,
            id: key
          })
        }
        this.setState({
          usersPlaces: placesArray
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
    <View style={styles.container}>
        <UsersMap 
          userLocation={this.state.userLocation}
          usersPlaces={this.state.usersPlaces}
          locationTitle={this.state.locationTitle}
          locationDescription={this.state.locationDescription}
          selectLocationHandler={this.selectLocationHandler}
          mapRegion={this.state.mapRegion}
        />
        <View
        style={{
          position: 'absolute',
          bottom: '0%',
          alignSelf: 'center',
          marginBottom: 20
        }}>
          <FetchLocation onGetLocation={() => {
            this.setModalVisible('modalVisible', true);
          }}/>
        </View>
        <View>
          <LocationInput 
            modalVisible={this.state.modalVisible}
            cancelModal={() => this.setModalVisible('modalVisible', false)}
            handleTitleChange={(text) => this.handlePlaceChange('locationTitle',text)}
            locationTitle={this.state.locationTitle}
            locationDescription={this.state.locationDescription}
            handleDescChange={(text) => this.handlePlaceChange('locationDescription',text)}
            endLocationModal={this.endLocationModal} />
          <LocationDetails 
            infoModalVisible={this.state.infoModalVisible}
            cancelModal={() => this.setModalVisible('infoModalVisible', false)}
            locationTitle={this.state.selectedLocation.title}
            locationDescription={this.state.selectedLocation.description}
            locationDate={this.state.selectedLocation.date} />
        </View>
      </View>
      );
  }
}