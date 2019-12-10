import React from 'react';
import { Button } from 'react-native';

const FetchLocation = props => {
    return(
        <Button title="Share Location" onPress={props.onGetLocation}/>
    );

};

export default FetchLocation;