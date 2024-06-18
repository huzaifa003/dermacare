import { ChatSession, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Text, Button, Appbar, useTheme } from 'react-native-paper';
import Loading from '../components/Loading';
import GeneralHeader from '../components/GeneralHeader';

const AskQuestions = ({ route }) => {

    console.log(route.params)
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const { colors } = useTheme();
    const [chatSession, setChatSession] = useState(null);
    const [loading, setLoading] = useState(false);

    const genAI = new GoogleGenerativeAI("AIzaSyAmf5o7tzb0Nq9K9eS3m2HXX7nSrBZokwg");
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", 'safetySettings': { threshold: HarmBlockThreshold.BLOCK_NONE, category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT } });

    useEffect(() => {
        console.log("Hello")
        async function startQuestion() {

            if (route.params) {
                console.log(route.params.disease)

                if (route.params.disease) {
                    setText("What are the symptoms, causes, and possible treaments of " + route.params.disease);
                }
            }
        }
        startQuestion();
    }), [];

    // useEffect(() => {
    //     const getSession = async () => {

    //     const session = await model.startChat();
    //     console.log(session)
    //     setChatSession(session);
    //     }
    //     getSession();
    // }, []);

    useEffect(() => {
        console.log(messages)
    }), [messages];
    const sendMessage = async () => {
        if (text.trim().length > 0) {
            console.log(text)

            // Simulate a response
            receiveMessage(text);
            setText('');
        }
    };

    const receiveMessage = async (text) => {
        try {
            // Assuming you might want to use 'text' to generate or fetch a response
            console.log(text);
            setLoading(true);

            const response = await model.generateContent("Do not answer questions that are not related to skin problems or it's treaments, causes or medications." + text);
            const result = await response.response.text();

            setMessages(prevMessages => [...prevMessages, { id: prevMessages.length, text, sender: 'user' }]);
            setMessages(prevMessages => [...prevMessages, { id: prevMessages.length, text: result, sender: 'bot' }]);
        } catch (error) {
            console.error('Failed to fetch or generate response:', error);
            // Optionally set an error state here
            // setErrorState(true); // You need to define setErrorState according to your state management
        } finally {
            setLoading(false);
        }
    }




    return (
        <>
            <GeneralHeader title="Chat with AI" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={{ flex: 1, backgroundColor: colors.background }}
                    contentContainerStyle={{ padding: 20 }}
                >
                    {messages.map(message => (
                        <View key={message.id} style={{ marginVertical: 4, alignItems: 'flex-end' }}>
                            {message.sender === 'user' ?
                                <View style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 20,
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    marginRight: 'auto'
                                }}>
                                    <Text style={{ color: 'white' }}>{message.text}</Text>
                                </View>
                                :
                                <View style={{
                                    backgroundColor: colors.secondary,
                                    borderRadius: 20,
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    marginLeft: 'auto'

                                }}>
                                    <Text style={{ color: 'white' }}>{message.text}</Text>
                                </View>

                            }


                        </View>

                    ))}
                </ScrollView>

                {loading ? <Loading /> : ''}
                <View style={{ flexDirection: 'row', padding: 8, height: 'auto' }}>
                    <TextInput
                        mode="outlined"
                        placeholder="Type your message..."
                        value={text}
                        onChangeText={setText}
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button
                        style={{ padding: 8, height: 'auto' }}
                        icon="send"
                        mode="contained"
                        onPress={sendMessage}
                        disabled={text.trim().length === 0}
                    >
                        Send
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </>
    );
};

export default AskQuestions;
