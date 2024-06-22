import React, { useEffect, useState } from 'react';
import { auth, db } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Card, Text, DefaultTheme } from 'react-native-paper';
import { ref, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3F51B5', // A soft indigo
        accent: '#FFC107', // Amber for contrast
        background: '#F5F5F6', // Light gray for general background
        surface: '#FFFFFF', // White for card surfaces
        text: '#333333', // Dark gray for text for better readability
        disabled: '#BDBDBD', // Grey for disabled elements
        placeholder: '#666666', // Dark grey for text input placeholders
    },
    fonts: {
        ...DefaultTheme.fonts,
        medium: {
            ...DefaultTheme.fonts.medium,
            fontSize: 18,
        },
    },
};

const AddProfile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [summary, setSummary] = useState('');
    const [uid, setUid] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUid(user.uid);
            }
        });
    }, []);

    const navigation = useNavigation();
    const handleAddProfile = () => {
        const dbref = ref(db, `patients/${uid}/profile/`);
        set(dbref, {
            name: name,
            age: age,
            summary: summary
        })
        .then(() => {
            navigation.navigate('Patient Home');
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
        
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaView style={tw`flex-1 bg-[#3e82f0]`}>
                <ScrollView contentContainerStyle={tw`w-full p-4 justify-center flex-grow`}>
                    <Card style={tw`mb-8`}>
                        <Card.Title title="Profile Information" titleStyle={{ fontSize: 24, color: theme.colors.primary }} />
                        <Card.Content>
                            <TextInput
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                            />
                            <TextInput
                                label="Age"
                                value={age}
                                onChangeText={setAge}
                                mode="outlined"
                            />
                            <TextInput
                                label="Summary"
                                value={summary}
                                onChangeText={setSummary}
                                mode="outlined"
                            />
                        </Card.Content>
                        <Card.Actions>
                            <Button mode="contained" onPress={handleAddProfile}>Add Profile</Button>
                        </Card.Actions>
                    </Card>
                    
                </ScrollView>
            </SafeAreaView>
        </PaperProvider>
    );
}

export default AddProfile;
