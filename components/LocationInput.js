import React from 'react';
import { Text, View, Button, Modal, Alert, TextInput } from 'react-native';

const LocationInput = props => {
    return(
        <Modal
          animationType="slide"
          transparent={false}
          visible={props.modalVisible}
          onRequestClose={()=> {
            Alert.alert('Changes were not saved');
          }}>
            <View style={{top: '50%'}}>
              <View>
                <Text style={{
                  fontSize: 18,
                  textAlign: 'center',

                }}>Enter some details about the event/location.</Text>
                <TextInput
                  style={{height: 40, borderStyle: 'solid'}}
                  placeholder="Enter a Title"
                  onChangeText={props.handleTitleChange}
                  value={props.locationTitle}
                />
                <TextInput
                  style={{height: 40, borderStyle: 'solid'}}
                  placeholder="Enter a Description"
                  onChangeText={props.handleDescChange}
                  value={props.locationDescription}
                />
                <View style={{marginTop: 20}}>
                  <Button title='Save and Share' onPress={props.endLocationModal}/>
                </View>
                <View style={{marginTop: 20}}>
                  <Button title='Cancel' onPress={props.cancelModal}/>
                </View>
              </View>
            </View>
          </Modal>
    );
}

/*

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={()=> {
            Alert.alert('Modal has been closed');
          }}>
            <View style={{top: '50%'}}>
              <View>
                <Text style={{
                  fontSize: 18,
                  textAlign: 'center',

                }}>Enter some details about the event/location.</Text>
                <TextInput
                  style={{height: 40, borderStyle: 'solid'}}
                  placeholder="Enter a Title"
                  onChangeText={this.handleTitleChange}
                  value={this.state.locationTitle}
                />
                <TextInput
                  style={{height: 40, borderStyle: 'solid'}}
                  placeholder="Enter a Description"
                  onChangeText={this.handleDescChange}
                  value={this.state.locationDescription}
                />
                <View style={{marginTop: 20}}>
                  <Button title='Save and Share' onPress={this.endLocationModal}/>
                </View>
                <View style={{marginTop: 20}}>
                  <Button title='Cancel' onPress={this.cancelModal}/>
                </View>
              </View>
            </View>
          </Modal>

*/

export default LocationInput;