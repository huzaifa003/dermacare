import React, { useEffect, useState } from 'react';
import { auth, db } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Card, useTheme } from 'react-native-paper';
import { ref, set } from 'firebase/database';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddProfile = () => {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [summary, setSummary] = useState('');
    const [uid, setUid] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUid(user.uid);
            }
        });
        return unsubscribe; // Detach the listener on component unmount
    }, []);

    const navigation = useNavigation();
    const handleAddProfile = () => {
        const dbref = ref(db, `patients/${uid}/profile/`);
        set(dbref, { name, age, summary })
            .then(() => navigation.navigate('Patient'))
            .catch(error => console.error('Error adding document: ', error));
    }

    return (
        
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    <Card style={{ marginBottom: 8, borderColor: theme.colors.accent, borderWidth: 1, shadowOpacity: 0.2 }}>
                        <Card.Title
                            title="Profile Information"
                            titleStyle={{ margin: 20, alignSelf: 'center', backgroundColor: theme.colors.primaryContainer, padding: 15, paddingTop: 25, borderRadius: 7, fontSize: 32, marginTop: 25, color: theme.colors.primary }}
                        />
                        <Card.Content>
                            <TextInput
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                style={{ marginBottom: 4, backgroundColor: theme.colors.surface }}
                            />
                            <TextInput
                                label="Age"
                                value={age}
                                onChangeText={setAge}
                                mode="outlined"
                                style={{ marginBottom: 4, backgroundColor: theme.colors.surface }}
                            />
                            <TextInput
                                label="Summary"
                                value={summary}
                                onChangeText={setSummary}
                                mode="outlined"
                                multiline={true}
                                numberOfLines={4}
                                style={{ marginBottom: 4, backgroundColor: theme.colors.surface }}
                            />
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                icon="account-plus"
                                mode="contained"
                                onPress={handleAddProfile}
                                style={{ width: '100%', justifyContent: 'center', backgroundColor: theme.colors.primary }}
                            >
                                Add Profile
                            </Button>
                        </Card.Actions>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        
    );
}

export default AddProfile;
