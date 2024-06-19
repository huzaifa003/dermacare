import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Image, StyleSheet, Alert, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-paper';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system';
import GeneralHeader from '../GeneralHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Segmentation = ({ route, navigation }) => {
  const { imageUrl, patientId, reportId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [returnedImageUrl, setReturnedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async () => {
    setIsLoading(true);
    setError(null);
    const interval = setInterval(() => {
      setProgress(prevProgress => prevProgress >= 100 ? 100 : prevProgress + 1);
    }, 100);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUrl,
      name: `photo.jpg`,
      type: `image/jpeg`
    });

    try {
        const response = await fetch('https://tidy-octopus-diverse.ngrok-free.app/segment', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',

            },
        });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const content = await response.blob();
      const filePath = `${FileSystem.cacheDirectory}responseImage_${Date.now()}.jpg`;

      const blobData = new FileReader();
      blobData.onload = async () => {
        await FileSystem.writeAsStringAsync(filePath, blobData.result.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });
        setReturnedImageUrl(`${filePath}`);
        setIsLoading(false);
        clearInterval(interval);
        setProgress(0);
      };
      blobData.onerror = () => {
        setError('Failed to process the image.');
        setIsLoading(false);
        clearInterval(interval);
        setProgress(0);
      };
      blobData.readAsDataURL(content);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      clearInterval(interval);
      setProgress(0);
    }
  };

  return (
    <>
      <GeneralHeader title={'Segmentation'} />
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Disease Classification Report</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          {returnedImageUrl && (
            <Image source={{ uri: returnedImageUrl }} style={styles.image} />
          )}
          <View style={styles.buttonContainer}>
            <Button
              mode='contained'
              icon={'image-size-select-large'}
              
              onPress={uploadImage}
              
            >Generate Segmentation</Button>

            
            {/*returnedImageUrl */ true && (
              <Button icon={'arrow-right'} mode='contained-tonal' onPress={() => navigation.navigate('Classify', { 'image': imageUrl, 'segmented': returnedImageUrl, "patientId": patientId , 'reportId': reportId})}>
                <Text>Proceed to Next Step</Text>
              </Button>
            )}
          </View>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading... {progress}%</Text>
            </View>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
    margin: 10
    
  },

  nextButtonText: {
    color: '#ffffff',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Segmentation;
