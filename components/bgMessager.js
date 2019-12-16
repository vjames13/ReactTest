// @flow
import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

var index = 0;

export default async (message: RemoteMessage) => {
    // handle your message
    index = index + 1;
    const title = Platform.OS === 'android' ? message.data.title : '';
    const notification = new firebase.notifications.Notification()
    .setNotificationId(index.toString())
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

    return Promise.resolve();
}