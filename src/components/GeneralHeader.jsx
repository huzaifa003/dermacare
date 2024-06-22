import React from 'react';
import { View, Text } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; 


const GeneralHeader = ({ title }) => {
  const navigation = useNavigation(); 
  const theme = useTheme();
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background }}> 
      {navigation.canGoBack() && (
        <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.inverseSurface} />
      )}
      <Appbar.Content
        title={title || 'GeneralHeader'}
        titleStyle={{ color: theme.colors.inverseSurface, fontWeight: 'bold', fontSize: 20 }}
      />
    </Appbar.Header>
  );
};

export default GeneralHeader;
