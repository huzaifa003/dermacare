import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import Home from './Derma/Home';
import Maps from './Derma/Maps';
import VisualSearch from './Derma/VisualSearch';
import Settings from './Derma/Settings';
import Header from './Header';
import RAGChat from '../screens/RAGChat';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const BottomNavDerma = () => {
  const theme = useTheme();
  return (
    <>
    <Header/>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Maps') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'AI Chat') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline'; // Assuming 'cog' is the icon for settings
          }else if (route.name === 'Visual Search') {
            iconName = focused ? 'database-eye' : 'database-eye';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      
        tabBarActiveTintColor: theme.colors.onPrimaryContainer,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle : {backgroundColor: theme.colors.background}
      })}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
      {/* <Tab.Screen options={{ headerShown: false }} name="Maps" component={Maps} /> */}
      <Tab.Screen options={{ headerShown: false }} name="AI Chat" component={RAGChat} />
      {/* <Tab.Screen options={{ headerShown: false }} name="Visual Search" component={VisualSearch} /> */}
      <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
    </Tab.Navigator>
    </>
  );
};

export default BottomNavDerma;
