import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref as dbRef, set } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../Connection/DB';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../Loading';
import { useNavigation } from '@react-navigation/native';
import { Button, FAB, Modal, Portal, Provider, Surface, TextInput, useTheme } from 'react-native-paper';
import GeneralHeader from '../GeneralHeader';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';



const ReportPosting = () => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,

            backgroundColor: theme.colors.background, // Light gray background
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: theme.colors.primary, // Dark gray for better contrast
        },
        input: {
            justifyContent: 'center',
            alignContent: 'center',
            padding: 10,
            margin: 10,
            backgroundColor: theme.colors.surface, // White background for the input
        },
        button: {
            backgroundColor: '#5c67f2', // A soft blue for the button
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginBottom: 20,
        },
        buttonText: {
            color: '#fff', // White text on the button
            fontSize: 16,
            fontWeight: 'bold',
        },
        preview: {
            width: 300,
            height: 300,
            marginBottom: 20,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: '#ddd', // Adding border to the image
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            margin: 50,
            borderRadius: 10,
            alignItems: 'center',
        },
    });


    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [base64, setBase64] = useState(null);
    const [uid, setUid] = useState(''); // Add this line
    const [loading, setLoading] = useState(false);
    const [isSkin, setIsSkin] = useState(true);
    const navigation = useNavigation();


    const generative = new GoogleGenerativeAI("AIzaSyAmf5o7tzb0Nq9K9eS3m2HXX7nSrBZokwg");
    const model = generative.getGenerativeModel({ model: "gemini-1.5-flash" });

    const geminiContent = async () => {
        try {
            setLoading(true);
            const prompt = "Please detect any human skin in the image, if the image is of human skin the response should be true, else the response should be false.";
            const image = {
                inlineData: {
                    data: base64,
                    mimeType: 'image/jpeg'
                }
            }
            const response = await model.generateContent([prompt, image]);
            const result = await response.response.text();
            if (result.toLowerCase().includes("false")) {
                alert("Please upload an image of human skin");
                setIsSkin(false);
                return;
            }
            else {
                setIsSkin(true);
                await handleSendData();
            }


            console.log(result);
            return result;
        } catch (error) {
            console.error('Failed to fetch or generate response:', error);
            await handleSendData();
            return null;
        } finally {
            setLoading(false);
        }


    };

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            console.log(user)
            if (user) {
                setUid(user.uid);
            }
            else {
                setUid("perpHAw783g5Oc6AgVxxeSaY4F03"); //TODO: Remove this line
            }
        });
    }, []);

    const [modalVisible, setModalVisible] = useState(false);
    const handleCaptureImage = async () => {

        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        console.log('Camera permission:', permissionResult);

        if (permissionResult.granted === false) {
            Alert.alert('Permission required', 'Permission to access camera is required!', [{ text: 'OK' }]);
            return;
        }

        const pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });


        if (!pickerResult.canceled) {
            // console.log(pickerResult.assets[0]);
            setBase64(pickerResult.assets[0].base64);
            console.log('Image picker result:', pickerResult.assets[0].uri);
            setImage(pickerResult.assets[0].uri);
            setModalVisible(false); // Close the modal after capturing an image
        }
    };


    const handleChoosePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            "mediaTypes": "Images",
            "presentationStyle": "overFullScreen",
            base64: true,

            quality: 1,

        });

        if (!result.canceled) {
            setBase64(result.assets[0].base64);
            result.assets[0].mimeType = "image/jpeg";
            setImage(result.assets[0].uri);
        }
    };

    async function handleSendData() {

        console.log(uid);
        if (uid && image) {
            const curren = Date.now();
            const path = `images/${uid}/reports/${curren}/`;
            const imageStorageRef = storageRef(storage, path);
            console.log(imageStorageRef);
            try {

                const response = await fetch(image);


                const blob = await response.blob();
                console.log(blob);

                await uploadBytes(imageStorageRef, blob);
                console.log("Image uploaded successfully!");
                getDownloadURL(imageStorageRef).then((url) => {
                    console.log(url);
                    set(dbRef(db, `/patients/${uid}/reports/${curren}`), {
                        user: uid,
                        image: url,
                        status: "pending",
                        description: description,
                    })
                        .then(() => {
                            console.log("Successfully updated");
                            setLoading(false)
                            navigation.navigate('All Reports');
                        }
                        )
                        .catch((error) => {
                            console.log(error);
                            setLoading(false)
                        });
                }
                );
                // setimage(null);
            } catch (error) {
                console.error("Error during the upload or save process: ", error);
                Alert.alert('Upload Failed', 'An error occurred during the upload. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            console.error("Missing user or image data.");
            alert('Missing Data', 'Please ensure you are logged in and an image has been captured.');
        }
    }

    return (
        <>
            <GeneralHeader title="Report Posting" />
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <View>


                    {loading ? <Loading /> : null}

                    <TextInput
                        mode='outlined'
                        style={[styles.input]}
                        placeholder="Enter description.."
                        multiline={true}

                        onChangeText={setDescription}
                        value={description}
                    />

                    <View style={{ 'flexDirection': 'row', justifyContent: 'space-between', flexBasis: 'auto', alignContent: 'stretch' }}>
                        <Button style={{ width: '48%' }} icon={'image'} mode='elevated' onPress={handleChoosePhoto}>
                            Choose Photo
                        </Button>

                        <Button style={{ width: '48%' }} icon={'camera'} mode='elevated' onPress={handleCaptureImage}>
                            Take Photo
                        </Button>


                    </View>
                    <Text />

                    <TouchableOpacity  onPress={()=>{Keyboard.dismiss()}}>
                        {image && (
                            <Surface style={{ alignItems: 'center', padding: 10, margin: 10, borderRadius: 10, elevation: 5 }}>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.preview}
                                />
                            </Surface>
                        )}
                    </TouchableOpacity>


                    <Button icon={'send'} mode='contained' onPress={geminiContent}>
                        Submit Report
                    </Button>

                </View>
            </KeyboardAvoidingView>
        </>

    );
};



export default ReportPosting;
