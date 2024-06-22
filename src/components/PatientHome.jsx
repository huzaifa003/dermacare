import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Surface, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PatientHome = ({ navigation }) => {
  const features = [
    { name: 'Maps', icon: 'map', screen: 'Maps' },
    { name: 'Visual Search', icon: 'database-eye', screen: 'Visual Search' },
    { name: 'News', icon: 'newspaper', screen: 'News' },
    { name: 'Disease Info', icon: 'layers-search', screen: 'Disease Information' },
  ];

  const FeatureTile = ({ name, icon, navigateTo }) => (
    <Surface style={styles.tile}>
      <TouchableRipple
        style={styles.ripple}
        onPress={() => navigation.navigate(navigateTo)}
        rippleColor="rgba(0, 0, 0, .32)" // Optional: customize the ripple color
      >
        <View style={styles.content}>
          <MaterialCommunityIcons name={icon} size={40} color="#4287f5" />
          <Text style={styles.text}>{name}</Text>
        </View>
      </TouchableRipple>
    </Surface>
  );

  return (
    <View style={styles.container}>
      {features.map((feature, idx) => (
        <FeatureTile key={idx} name={feature.name} icon={feature.icon} navigateTo={feature.screen} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#f0f0f0', // Light grey background
  },
  tile: {
    margin: 5,
    height: 150,
    width: '45%', // nearly half the container width
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 8,
    overflow: 'hidden', // Ensures the ripple effect is contained within the tile's rounded corners
  },
  ripple: {
    width: '100%', // Ensure the TouchableRipple covers the whole Surface
    height: '100%', // Ensure the TouchableRipple covers the whole Surface
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PatientHome;
