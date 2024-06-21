import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import tw from 'twrnc';
import { auth, storage } from '../Connection/DB';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import GeneralHeader from '../components/GeneralHeader';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { getDownloadURL, ref } from 'firebase/storage';
import { set } from 'firebase/database';
const Login = () => {
  const [isDermaLogin, setIsDermaLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mtn, setMtn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()

  const handleLogin = () => {
    setError('');
    setLoading(true);
    if (isDermaLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          AsyncStorage.setItem('userType', 'derma');
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem("uid", auth.currentUser.uid);
          if (auth.currentUser.photoURL !== null) {
            AsyncStorage.setItem('photoURL', auth.currentUser.photoURL);
          }

          navigation.navigate('Derma')


        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setError('That email address is already in use!');
            console.log('That email address is already in use!');
          }
          else if (error.code === 'auth/invalid-email') {
            setError('That email address is invalid!');
            console.log('That email address is invalid!');
          }
          else if (error.code === 'auth/user-not-found') {
            setError('User not found');
            console.log('User not found');

          }
          else if (error.code === 'auth/wrong-password') {
            setError('Wrong password');
            console.log('Wrong password');
          }
          else {
            setError('Something went wrong' + error);
            console.error(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });



    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {

          console.log('Patient login');
          AsyncStorage.setItem('userType', 'patient');
          AsyncStorage.setItem('email', email);
          AsyncStorage.setItem("uid", auth.currentUser.uid);
          navigation.navigate('Patient');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            setError('That email address is already in use!');
            console.log('That email address is already in use!');
          }
          else if (error.code === 'auth/invalid-email') {
            setError('That email address is invalid!');
            console.log('That email address is invalid!');
          }
          else if (error.code === 'auth/user-not-found') {
            setError('User not found');
            console.log('User not found');

          }
          else if (error.code === 'auth/wrong-password') {
            setError('Wrong password');
            console.log('Wrong password');
          }
          else {
            setError('Something went wrong' + error);
            console.error(error);
          }
        })
        .finally(() => {
          setLoading(false);
        });

    }
  };

  return (
    <SafeAreaView style={tw`flex-1 `}>
      {/* <GeneralHeader title={'Login'} /> */}
      <KeyboardAvoidingView behavior='padding' style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`p-4 justify-center items-center flex-grow bg-white`}>

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
          {/* Toggle Button */}
          <View style={tw`flex-row mb-4`}>
            <Button
              style={tw`flex-1 ${isDermaLogin ? 'bg-purple-600' : 'bg-white'} p-0 h-10 `}
              onPress={() => setIsDermaLogin(true)}
            >
              <Text style={tw`${isDermaLogin ? 'text-white' : 'text-purple-600'} text-center font-semibold`}>
                Login as Derma
              </Text>
            </Button>
            <Button
              style={tw`flex-1 ${!isDermaLogin ? 'bg-purple-600' : 'bg-white'} p-0 h-10 `}
              onPress={() => setIsDermaLogin(false)}
            >
              <Text style={tw`${isDermaLogin ? 'text-purple-600' : 'text-white'} text-center font-semibold`}>
                Login as Patient
              </Text>
            </Button>
          </View>

          {/* ... rest of your login form */}

          {isDermaLogin && (
            <View style={{ width: '100%', marginBottom: 20 }}>
              <TextInput

                mode='outlined'
                label={'MTN'}
                value={mtn}
                onChangeText={setMtn}
                placeholder="MTN"
                keyboardType="email-address"
                autoCapitalize="none"
                style={tw`bg-white w-full `}
              />
              <AntDesign
                name={mtn === "derm123" || mtn === "DERM123" ? "checkcircle" : "closecircle"}
                size={24}
                color={mtn === "derm123" || mtn === "DERM123" ? "green" : "red"}
                style={tw`absolute right-3 top-5`}  // Position the icon inside the TextInput
              />
            </View>
          )}

          {(mtn === "derm123" || mtn === "DERM123") && (isDermaLogin) && (
            <>
              <TextInput
                mode='outlined'
                label={'Email'}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={tw`bg-white w-full mb-4  `}
              />
              <View style={tw`flex-row mb-4`}>
                <TextInput
                  mode='outlined'
                  label={'Password'}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry={passwordVisible}
                  autoCapitalize="none"
                  style={tw`bg-white w-full mb-4  `}
                />

                

                  <IconButton
                    icon={passwordVisible ? 'eye' : 'eye-off'}
                    size={24}
                    color={mtn === "derm123" || mtn === "DERM123" ? "green" : "red"}
                    style={[tw`absolute right-0 top-2`, { zIndex: 5, alignSelf:'center' }]}  // Position the icon inside the TextInput
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                


              </View>


            </>






          )}


          {(!isDermaLogin) && (
            <>
              <TextInput
                mode='outlined'
                label={'Email'}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={tw`bg-white w-full mb-4 `}
              />

              <TextInput
                mode='outlined'
                label={'Password'}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={true}
                autoCapitalize="none"
                style={tw`bg-white w-full mb-4 `}
              />
            </>






          )}



          <TouchableOpacity className='self-end' onPress={() => { sendPasswordResetEmail(auth, email).then(() => { alert("Email Reset Link Sent To Email") }).catch((err) => alert("There was an error in resetting the password" + err)); }}>
            <Text style={tw`text-blue-600 mb-8 text-right`}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            icon={isDermaLogin ? 'doctor' : 'account'}
            loading={loading}
            mode='contained'
            onPress={handleLogin}
            style={tw` w-full rounded-lg`}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>Login</Text>
          </Button>
          <Button onPress={() => { navigation.navigate('Signup') }} mode='text'>
            <Text style={tw`text-blue-600 mb-8 text-right py-4`}>Dont have account ? Signup</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
