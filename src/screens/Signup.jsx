import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import tw from 'twrnc';
import { auth, provider } from '../Connection/DB';
import { AuthErrorCodes, createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
const Signup = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // State to hold the error message

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('AddProfile');
      })
      .catch(error => {
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
          setError('That email address is already in use!');
        } else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
          setError('That email address is invalid!');
        } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
          setError('Password is too weak! Minimum Character Length is 8');
        }
        else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
          setError('Password is invalid! Minimum Character Length is 8');
        }
        else if (error.code === AuthErrorCodes.NETWORK_REQUEST_FAILED) {
          setError('Network request failed! Check your internet connection');
        }
        else if (error.code === AuthErrorCodes.USER_DISABLED) {
          setError('User account is disabled! Contact support');
        }
        else if (error.code === AuthErrorCodes.TOO_MANY_REQUESTS) {
          setError('Too many requests! Try again later');
        }
        else if (error.code === AuthErrorCodes.OPERATION_NOT_ALLOWED) {
          setError('Operation not allowed! Contact support');
        }
        
        else {
          setError(error.message);  // Generic error message
        }
      });
  };

  return (
    <SafeAreaView style={[tw`flex-1`, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={[tw`p-4 justify-center items-center flex-grow`,{backgroundColor: theme.colors.background}]}>
        
        <Image
          source={require('../../assets/login.png')}
          style={tw`w-[250px] h-[250px]`} // Adjust size as needed
        />

        {error !== '' && (
            <View style={tw`flex-row items-center mb-4`}>
              <Ionicons name="alert-circle-outline" size={24} color="red" style={tw`ml-2`} />
              <Text style={tw`text-red-600 font-bold text-lg`}>{error}</Text>
              
            </View>
          )}


        <TextInput
          mode='outlined'
          label={'Email'}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={[tw`w-full`, {backgroundColor: theme.colors.surface}]}
        />

        <TextInput
          mode='outlined'
          label={'Password'}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          style={[tw`w-full m-4`, {backgroundColor: theme.colors.surface}]}
        />

        
        <Button
          onPress={handleSignup}
          mode='contained'
          style={[tw`w-full`, {}]}
          icon={'account-plus'}
        >
          <Text style={[tw`text-center text-lg font-semibold`,{color: theme.colors.surface}]}>Signup</Text>
        </Button>

        <Button style={tw`m-2`} onPress={() => { navigation.navigate('Login') }} mode='text'>
          <Text style={tw`text-blue-600 mb-8 text-right py-4 m-2`}>Don't have an account? Signup</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
