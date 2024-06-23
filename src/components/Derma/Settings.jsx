import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, List, Button, Divider, TextInput, useTheme, Switch } from "react-native-paper";
import { auth, db, storage } from "../../Connection/DB";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { updatePassword, updateProfile } from "firebase/auth";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { update, ref as databaseRef } from "firebase/database";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
const Settings = () => {

  const { isDark, setIsDark } = useContext(ThemeContext);
  const navigation = useNavigation()
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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

  

  useEffect(() => {




    const getUserData = async () => {
      const email = await AsyncStorage.getItem('email');
      const uid = await AsyncStorage.getItem('uid');
      const userType = await AsyncStorage.getItem('userType');
      const image = await AsyncStorage.getItem('photoURL');
      
      console.log(image)
      
      if (image !== null || image !== undefined) {
        const photoURL =image
        setUserData({
          name: email.split('@')[0],
          email: email,
          avatarUrl: photoURL,
        });
        
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
      const pictureRef = ref(storage, `images/${uid}/profile.jpg`);

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

      const refStorage = databaseRef(db, `patients/${uid}/profile`);
      update(refStorage, {
        avatarUrl: downloadableLink,
      }).then(() => {
        console.log('Profile updated successfully in realtime');
      })
      .catch((error) => {
        console.error(error);
      })
    }



  }

  const changePassword = () => {
    // Implement your change password logic here
    updatePassword(auth.currentUser, password)
      .then(() => {
        console.log(password)
        alert('Password updated successfully');
        console.log('Password updated successfully');
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred while updating your password');
      });

  }


  const toggleTheme = () => {
    setIsDark(!isDark);
    // Additional implementation may be needed to apply theme changes
  };


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
        <List.Item
          title="Username"
          description={userData.name}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
        />


        <List.Item
          title="Email"
          description={userData.email}
          left={(props) => <List.Icon {...props} icon="email" />}
        />

        <List.Item
          title="Change Password"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}

        />

        <TextInput
          style={{ marginHorizontal: 20 }}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={passwordVisibility}
          mode="outlined"
          right={<TextInput.Icon name="menu-down" onPress={togglePasswordVisibility} />} // Ensures the icon is clickable to open the menu
        />

        <Button


          onPress={changePassword}
          icon="lock-reset"
          // textColor="#0584fa" // Sets the background color of the button
          mode='contained'
          style={styles.logoutButton}
        >
          Change Password
        </Button>

        <List.Item
          title="Dark Theme"
          left={(props) => <List.Icon {...props} icon={isDark ? "brightness-7" : "brightness-4"} />}
          right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
        />

      </List.Section>
      <Divider />
      <List.Section>

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


export default Settings;
