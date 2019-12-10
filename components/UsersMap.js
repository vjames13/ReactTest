import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

//import { selectLocationHandler } from '../App';



const usersMap = props => {
    let userLocationMarker = null;

    let usersRegion = null;

    if (props.mapRegion.latitude) {
        usersRegion = props.mapRegion
    }

    if (props.userLocation) {
        selectedLocation = {
            title: props.locationTitle,
            description: props.locationDescription,
            date: props.userLocation.date
          },
        userLocationMarker = <MapView.Marker 
            coordinate={{
                latitude: props.userLocation.latitude,
                longitude: props.userLocation.longitude
            }}
            title={props.locationTitle}
            description={props.locationDescription}
            onCalloutPress={() => props.selectLocationHandler(selectedLocation)} 
            />
    }
    const usersMarkers = props.usersPlaces.map(userPlace => <MapView.Marker coordinate={userPlace} key={userPlace.id} title={userPlace.title} description={userPlace.description} onCalloutPress={() => props.selectLocationHandler(userPlace)} />);
    return (
        <View style={styles.mapContainer}>
            <MapView
                initialRegion={{
                    latitude: 32.793369,
                    longitude: -79.944086,
                    latitudeDelta: 0.0010499999,
                    longitudeDelta: 0.07058,
                }}
                region={usersRegion}
                style={styles.map}>
                {userLocationMarker}
                {usersMarkers}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        /*width: '100%',
        height: 200,
        marginTop: 20*/
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        /*width: '100%',
        height: '100%'*/
    }
});

export default usersMap;
