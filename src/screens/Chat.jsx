import React, { useEffect, useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { Button, TextInput, Text, Card, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw, { style } from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, set, onValue, remove } from 'firebase/database';
import { db } from '../Connection/DB';
import { useNavigation } from '@react-navigation/native'; // Ensure you have react-navigation installed and set up
import GeneralHeader from '../components/GeneralHeader';

const Chat = ({ route }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { reportId, patientId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [username, setUsername] = useState('');
    useEffect(() => {
        AsyncStorage.getItem("userType").then(role => setUserRole(role || "derm"));

        const messagesRef = ref(db, `patients/${patientId}/reports/${reportId}/chat`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val() || {};
            const parsedMessages = Object.entries(data).map(([key, value]) => ({
                ...value,
                timestamp: new Date(key).toLocaleString(),
            }));
            setMessages(parsedMessages.sort().reverse());
        });

        get(ref(db, `patients/${patientId}/profile`)).then((snapshot) => {
            if (snapshot.exists()) {
                setUsername(snapshot.val().name);
            }
            console.log(snapshot.val())
        }
        );


        // return () => remove(messagesRef);
    }, []);

    const sendMessage = async () => {
        const timestamp = new Date();
        const messageRef = ref(db, `patients/${patientId}/reports/${reportId}/chat/${timestamp}`);
        set(messageRef, {
            message: newMessage,
            userId: patientId,
            role: await AsyncStorage.getItem("userType") || "derm",
        }).then(() => { console.log('Message sent!'); })
            .catch((error) => console.error(error))
            .finally(() => setNewMessage(''));
        setNewMessage('');
    };

    const renderMessage = (item) => {
        const isUserRole = item.role === userRole;
        const cardStyle = isUserRole ? 'bg-blue-100' : 'bg-gray-100';
        const textStyle = isUserRole ? 'text-blue-500 font-bold' : '';

        return (
            <Card style={tw`m-2 p-4 shadow-lg w-[60%] ${isUserRole ? 'bg-blue-200 rounded-tl-3xl rounded-tr-lg rounded-br-0 rounded-bl-lg self-end' : 'bg-gray-200 rounded-tl-lg rounded-tr-3xl rounded-bl-0 self-start'} ${cardStyle}`}>
                <View style={{
                    flexDirection: !isUserRole ? "row" : "row-reverse",
                    display: 'flex',
                    alignItems: "center",
                    gap: 10
                }}>

                    <Image style={tw`w-10 h-10 rounded-full `}
                        source={{ uri: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png" }}

                    />
                    <Text style={{color: theme.dark? theme.colors.background  :theme.colors.inverseSurface}}>{username}</Text>
                </View>
                <Text style={{color: theme.dark? theme.colors.background  :theme.colors.inverseSurface}}>{item.message}</Text>
                <Text style={{color: theme.dark? theme.colors.background  :theme.colors.inverseSurface}}>{item.timestamp}</Text>
                <Text style={{color: theme.dark? theme.colors.background  :theme.colors.inverseSurface}}>{item.role}</Text>
            </Card>
        );
    };

    return (
        <>
       
            <GeneralHeader title="Chat" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{backgroundColor: `${theme.colors.background}`, flex: 1}}>
                <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => renderMessage(item)}
                    contentContainerStyle={tw`flex-grow`}
                    showsVerticalScrollIndicator={false}
                    inverted
                    />
                <View style={tw`flex-row items-center p-2`}>
                    <TextInput
                        mode="outlined"
                        label="Type a message"
                        value={newMessage}
                        onChangeText={setNewMessage}
                        style={tw`flex-1`}
                        />
                    <Button icon="send" mode="contained" onPress={sendMessage} style={tw`ml-2`}>
                        Send
                    </Button>
                </View>
               
            </KeyboardAvoidingView>
   
                        </>
    );
};

export default Chat;
