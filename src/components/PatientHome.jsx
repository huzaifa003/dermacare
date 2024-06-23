import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Surface, TouchableRipple, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const PatientHome = ({ navigation }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 10,
      backgroundColor: theme.colors.background, // Light grey background
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
      color: theme.colors.primary, // Use the default text color from the theme
    },
    animation: {
      backgroundColor: theme.colors.background,
      width: '100%',
      height: 200,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
  
  });



  const features = [
    
    { name: 'Add Report', icon: 'file-plus', screen: 'ReportPosting' },
    { name: 'Disease Info', icon: 'layers-search', screen: 'Disease Information' },
    { name: 'News', icon: 'newspaper', screen: 'News' },
    { name: 'Maps', icon: 'map', screen: 'Maps' },
    
  ];

  const FeatureTile = ({ name, icon, navigateTo }) => (
    <Surface style={styles.tile}>
      <TouchableRipple
        style={styles.ripple}
        onPress={() => navigation.navigate(navigateTo)}
        rippleColor="rgba(0, 0, 0, .32)" // Optional: customize the ripple color
      >
        <View style={styles.content}>
          <MaterialCommunityIcons name={icon} size={40} color={theme.colors.primary} />
          <Text style={styles.text}>{name}</Text>
        </View>
      </TouchableRipple>
    </Surface>
  );

  return (
    <>
      <LottieView
        source={require('../../assets/HomeScreenAnimation.json')} // Path to your Lottie file
        autoPlay={true}
        loop={true}
        style={styles.animation}
        speed={0.5}
      />
      <Text style={styles.headerText}>Welcome to Dermassist</Text>
      <View style={styles.container}>

        {features.map((feature, idx) => (
          <FeatureTile key={idx} name={feature.name} icon={feature.icon} navigateTo={feature.screen} />
        ))}
      </View>
    </>
  );
};



export default PatientHome;
