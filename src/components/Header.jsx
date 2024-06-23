import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';


const Header = () => {
  const theme = useTheme();  
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc'
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 50,
      height: 50,
      borderRadius: 25,
      // color: theme.colors.tertiary,
      // backgroundColor: theme.colors.onBackground,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.tertiary,
      marginLeft: 10,
    },
    avatarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    }
  });

  return (

    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/Vector.png')}
          resizeMode="contain"
        />
        <Text style={styles.title}>DermaCare</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={styles.avatarContainer} >
        <View style={styles.avatarContainer} >
          <Image
            style={styles.avatar}
            source={auth.currentUser.photoURL ? { uri: auth.currentUser.photoURL } : require('../../assets/avatar.png')}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>

  )

  
}




export default Header;
