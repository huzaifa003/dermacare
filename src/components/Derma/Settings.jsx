import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, List, Button, Divider } from "react-native-paper";
import { auth, storage } from "../../Connection/DB";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from "firebase/auth";

const Settings = () => {
  const navigation = useNavigation()
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const getUserData = async () => {
      const email = await AsyncStorage.getItem('email');
      const uid = await AsyncStorage.getItem('uid');
      const userType = await AsyncStorage.getItem('userType');

      

      if (AsyncStorage.getItem('photoURL') !== null) {
        const photoURL = await AsyncStorage.getItem('photoURL');
        setUserData({
          name: email.split('@')[0],
          email: email,
          avatarUrl: photoURL,
        });
        return;
      }
      else {
        setUserData({
          name: email.split('@')[0],
          email: email,
          avatarUrl: "https://via.placeholder.com/150", // Placeholder for an avatar image,
        });
      }
    };
    getUserData();
  }
    , []);






  const handleLogout = () => {
    console.log("Logout action triggered");
    auth.signOut()
      .then(() => {
        AsyncStorage.removeItem('userType');
        AsyncStorage.removeItem('email');
        AsyncStorage.removeItem('uid');
        console.log('User signed out!');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      })
      .catch(error => {
        console.error(error);
      });

      
    // Implement your logout logic here
  };

  
const selectImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Sorry, we need camera roll permissions to make this work!');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({

    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    const response = await fetch(result.assets[0].uri);
    const blob = await response.blob();
    const uid = await AsyncStorage.getItem('uid');
    const pictureRef = ref(storage,`images/${uid}/profile.jpg`);

    console.log(response);

    console.log(blob);

    const res = await uploadBytes(pictureRef, blob);

    console.log(res);

    const downloadableLink = await getDownloadURL(pictureRef);
    console.log(downloadableLink);

    AsyncStorage.setItem('photoURL', downloadableLink);
    setUserData({
      ...userData,
      avatarUrl: downloadableLink,
    });

    updateProfile(auth.currentUser, {
      photoURL: downloadableLink,
    })
    .then(() => {
      console.log('Profile updated successfully');
    })
    .catch((error) => {
      console.error(error);
    });


    
  }
}



  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => selectImage()}>
          <Avatar.Image
            size={100}
            source={{ uri: userData.avatarUrl }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <List.Subheader style={styles.username}>{userData.name}</List.Subheader>
      </View>
      <Divider />
      <List.Section>
        <List.Subheader>User Settings</List.Subheader>
        {/* <List.Item
          title="Username"
          description={userData.name}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
        /> */}
        {/* <List.Item
          title="Change Password"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
          onPress={() => console.log("Change Password Pressed")}
        /> */}
        <List.Item
          title="Email"
          description={userData.email}
          left={(props) => <List.Icon {...props} icon="email" />}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <Button


          onPress={handleLogout}
          icon="logout"
          textColor="#0584fa" // Sets the background color of the button
          mode="elevated"
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    margin: 15,
  },
});

export default Settings;
