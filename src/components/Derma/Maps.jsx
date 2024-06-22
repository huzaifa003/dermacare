import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import GeneralHeader from '../GeneralHeader';


const Maps = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation()
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleButtonPress = () => {
    
    console.log('Overlay button pressed');
    navigation.navigate('locationData', {location: location.coords})
    
  };

  return (
    <>
    <GeneralHeader title="Maps" />
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here"
          />
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Overlay Button */}
      <TouchableOpacity style={styles.overlayButton} onPress={handleButtonPress}>
        <Text style={styles.overlayButtonText}>View Live Weather Data</Text>
      </TouchableOpacity>
    </View>
    </>
  );
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
  },
  overlayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Maps;
