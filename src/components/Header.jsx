import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native';

const Header = () => {

  const navigation = useNavigation();
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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

export default Header;
