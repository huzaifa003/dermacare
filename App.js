import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavDerma from './src/components/BottomNavDerma';
import Onboarding from './src/screens/Onboarding';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import ListReport from './src/components/Derma/ListReport';
import LocationData from './src/screens/LocationData';
import AddProfile from './src/screens/AddProfile';
import PatientBottomMenu from './src/components/PatientBottomMenu';
import ReportList from './src/components/Patient/ReportList';
import Home from './src/components/Derma/Home';
import Chat from './src/screens/Chat';
import RAGChat from './src/screens/RAGChat';
// import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
import Segmentation from './src/components/Derma/Segmentation';
import Classification from './src/components/Derma/Classification';
import Feedback from './src/screens/Feedback';
import NewsScreen from './src/screens/NewsScreen';
import ReportPosting from './src/components/Patient/ReportPosting';
import VisualSearch from './src/components/Derma/VisualSearch';
import DiseaseInformationScreen from './src/screens/DiseaseInformationScreen';
import AskQuestions from './src/screens/AskQuestions';
import Settings from './src/components/Derma/Settings';
import ShowDetails from './src/screens/ShowDetails';
import Maps from './src/components/Derma/Maps';
import { PaperProvider } from 'react-native-paper';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useState } from 'react';
const Stack = createNativeStackNavigator();

import ThemeContext from './src/context/ThemeContext';
import { useEffect } from 'react';

const App = () => {
  const [isDark, setIsDark] = useState(true);
  const darkTheme = {
    ...MD3DarkTheme,

  };

  const lightTheme = {
    ...MD3LightTheme,

  };

  const setTheme = (isDark) => {
    if (isDark) {
      return darkTheme;
    } else {
      return lightTheme;
    }
  }




  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationTypeForReplace: 'pop',
            }}
          >

            {/* <Stack.Screen name="ReportList" component={ReportList} /> */}
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="AddProfile" component={AddProfile} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ReportPosting" component={ReportPosting} />
            <Stack.Screen name='Home' component={Home} />

            <Stack.Screen name="listreport" component={ListReport} />
            {/* <Stack.Screen name="All Reports" component={ReportList} /> */}
            <Stack.Screen name="Ask Questions" component={AskQuestions} />
            <Stack.Screen name="Disease Information" component={DiseaseInformationScreen} />
            <Stack.Screen name="Visual Search" component={VisualSearch} />

            <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Screen name="Derma" component={BottomNavDerma} />
            <Stack.Screen name='Segmentation' component={Segmentation} />
            <Stack.Screen name='Classify' component={Classification} />
            <Stack.Screen name="Feedback" component={Feedback} />
            <Stack.Screen name="Patient" component={PatientBottomMenu} />
            <Stack.Screen name='Chat with AI' component={RAGChat} />
            <Stack.Screen name='Show Details' component={ShowDetails} />
            <Stack.Screen name='Chat' component={Chat} />
            <Stack.Screen name="Maps" component={Maps} />
            {/* <Stack.Screen name="News" component={NewsScreen} /> */}






            <Stack.Screen name="locationData" component={LocationData} />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default App;
