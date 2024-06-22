import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import tw from 'twrnc'; // Ensure twrnc is correctly configured
import { useNavigation } from '@react-navigation/native';
import { Button, useTheme } from 'react-native-paper';


const Onboarding = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <View style={[tw`flex-1 justify-center items-center px-4`, {backgroundColor : theme.colors.background}]}>
      {/* Animation container with increased size for visual impact */}
      <View style={tw`w-full max-w-[90%] h-[40%] justify-center items-center`}>
        <LottieView
          source={require('../../assets/dermaAnime.json')}
          loop={false}
          autoPlay
          style={tw`w-full h-full`}
        />
      </View>

      {/* Text content with improved styling for elegance and readability */}
      <View style={tw`w-full px-4`}>
        <Text style={[tw`text-2xl font-bold text-center pt-8 pb-2 text-gray-800`, {color: theme.colors.primary}]}>
          Welcome to DermaCare
        </Text>
        <Text style={[tw`text-lg text-center mb-10`, {color: theme.colors.secondary}]}>
          Your personalized skincare companion using AI
        </Text>
      </View>

      {/* Touchable button with shadow for depth */}
      <Button
        
        onPress={()=>{
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
        elevation={5}
        mode='contained'
        style={[tw`w-full  `, {backgroundColor: theme.colors.primary}]}
        icon={'arrow-right-bold-circle'}
      >
        <Text  style={tw`text-white text-center font-semibold text-lg`}>
          Get Started
        </Text>
      </Button>
    </View>
  );
};

export default Onboarding;
