import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import GeneralHeader from '../GeneralHeader';
import { useTheme } from 'react-native-paper';
import WebView from 'react-native-webview';


const Maps = () => {

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    overlayButton: {
      position: 'absolute',
      bottom: 20,
      backgroundColor: theme.colors.primaryContainer,
      padding: 10,
      borderRadius: 10,
    },
    overlayButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });


  const [location, setLocation] = useState({ latitude: 31.5656822, longitude: 74.3141829 });
  const [errorMsg, setErrorMsg] = useState(null);
  const [reload, setReload] = useState(0)
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
    navigation.navigate('locationData', { location: { latitude: 31.5656822, longitude: 74.3141829 } })

  };

  return (
    <>
      <GeneralHeader title="Maps" />
      
      <View style={styles.container}>
        {location ? (
          <WebView
          key={reload}
          style={{ height: 500, width: 400, overflow: 'visible' }}
          source={{
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Map</title>
              </head>
              <body style="display: flex; justify-content: center">
                <iframe width="100%" height="1000" style="border:0" loading="lazy" allowfullscreen
                src="https://www.google.com/maps/embed/v1/search?q=dermatologist%20near%20Lahore%2C%20Pakistan&key=AIzaSyCBgTE9IhhWBWg6BQl8Cird2f57TK4UdF8"></iframe>
              </body>
              </html>
            `
          }}
          
        />
        ) : (
          <Text>Loading...</Text>
        )}

        {/* Overlay Button */}
        <TouchableOpacity style={styles.overlayButton} onPress={handleButtonPress}>
          <Text style={styles.overlayButtonText}>View Live Weather Data</Text>
        </TouchableOpacity>
        <Text/>
        <TouchableOpacity style={[styles.overlayButton, {marginBottom : 50}]} onPress={()=>{setReload(reload+1)}}>
          <Text style={styles.overlayButtonText}>Reload Maps</Text>
        </TouchableOpacity>
      </View>
    </>
  );

};




export default Maps;
