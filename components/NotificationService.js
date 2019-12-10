import React, { Component, useEffect, Fragment } from 'react';
import { Platform, StyleSheet, Text, View, Button, Modal, Alert, TextInput } from 'react-native';
//import BadgeNumberAndroid from 'react-native-shortcut-badger';

import firebase from 'react-native-firebase';
//import FetchLocation from './components/FetchLocation';
//import UsersMap from './components/UsersMap';
//import LocationDetails from './components/LocationDetails';
//import DateTimePicker from 'react-native-modal-datetime-picker';
//import DateTimePicker from 'react-native-modal-datetime-picker';
//import moment from './moment';


var index = 0;

showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
}

getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
}

requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
        // User has rejected permissions
    }
}

export async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
    } else {
        this.requestPermission();
    }
}

export function createNotificationChannel() {
  // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
        "reminder", // channelId
        "Reminders Channel", // channel name
        firebase.notifications.Android.Importance.High // channel importance
    ).setDescription("Used for getting reminder notification"); // channel description
    // Create the android notification channel
    firebase.notifications().android.createChannel(channel);
};


