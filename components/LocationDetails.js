import React from 'react';
import { Text, View, Button, Modal, Alert } from 'react-native';

const LocationDetails = props => {
    return(
        <Modal
          animationType="slide"
          transparent={false}
          visible={props.infoModalVisible}
          onRequestClose={()=> {
            Alert.alert('Modal has been closed');
          }}>
            <View style={{top: '30%'}}>
              <View>
                <Text style={{
                  fontSize: 18,
                  textAlign: 'center',

                }}>Event Info</Text>
                
                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',

                }}>{props.locationTitle}</Text>
                
                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',

                }}>{props.locationDescription}</Text>

                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',

                }}>{props.locationDate}</Text>

                <View style={{marginTop: 20}}>
                  <Button title='Close' onPress={props.cancelModal}/>
                </View>
              </View>
            </View>  
          </Modal>
    );
}

export default LocationDetails;