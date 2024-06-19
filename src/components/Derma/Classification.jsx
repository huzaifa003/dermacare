import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native';
import GeneralHeader from '../GeneralHeader';
import PieComponent from '../PieChart';
import LottieView from 'lottie-react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';


export default function Classification({ route }) {
    const [contentCards, setContentCards] = useState([]);
    function parseContent(apiResponse) {
  const cards = [];
  const splitSections = apiResponse.split('**').filter(text => text.trim() !== '');

  for (let i = 0; i < splitSections.length; i += 2) {
    const title = splitSections[i].trim();
    const content = splitSections[i + 1] ? splitSections[i + 1].split('\n').map(line => line.trim()).filter(line => line !== '') : [];

    // Handle bulleted items
    const formattedContent = content.map(line => {
      if (line.startsWith('*')) {
        return line.substring(1).trim();  // Remove the bullet point
      }
      return line;
    });
    console.log(formattedContent)
    cards.push({
      title,
      content: formattedContent
    });
  }

  return cards;
}

      

    const navigation = useNavigation();

    const genAI = new GoogleGenerativeAI("AIzaSyAmf5o7tzb0Nq9K9eS3m2HXX7nSrBZokwg");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { image, segmented, patientId, reportId } = route.params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [highest, setHighest] = useState();
    const [recommendations, setRecommendations] = useState();
    const [flag, setFlag] = useState(false);
    const [recommenderLoading , setRecommenderLoading] = useState(false);
    console.log(route.params);

    const GOOGLE_API_KEY = 'AIzaSyAmf5o7tzb0Nq9K9eS3m2HXX7nSrBZokwg'; // Replace with your 
    const apiKey = `${GOOGLE_API_KEY}`; // Replace with your actual API key


    async function streamGeminiContent(prompt, content) {
        console.log(prompt + content);
        try {
            setRecommenderLoading(true);
            const result = await model.generateContent(prompt + " " + content);
            const response =  result.response;
            const text =  response.text();
            console.log(text)
            setContentCards(parseContent(text));
            setRecommendations(text);
            setRecommenderLoading(false);
        } catch (error) {
            console.error(error);
        }
    


    }
    function generateRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hex number
        return '#' + randomColor.padStart(6, '0'); // Pad with leading zeros if necessary
    }


    function mergeAndSortData(samplePieData, additionalData) {
        const convertedData = additionalData.map(item => {
            const label = Object.keys(item)[0];
            const value = item[label];
            console.log(value);
            return {

                value: parseFloat(value.toFixed(2)),
                label: label,
                color: generateRandomColor(),
                gradientCenterColor: generateRandomColor()
            };
        });

        const combinedData = [...samplePieData, ...convertedData];
        combinedData.sort((a, b) => b.value - a.value);
        combinedData[0].focused = true; // Focus on the highest value
        setHighest(combinedData[0].label);
        console.log(highest)
        return combinedData;
    }

    useEffect(() => {
        const classify = async () => {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', {
                uri: route.params.image,
                name: 'photo.jpg',
                type: 'image/jpeg'
            });

            try {
                let response = await fetch('https://kitten-tight-optionally.ngrok-free.app/classify', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'responseType': 'json',
                    },
                });

                if (!response.ok) throw new Error('Network response was not ok.' + response);
                console.log(response)
                let content = await response.json();

                setData(mergeAndSortData([], content));
            } catch (error) {
                console.error('There was an error!', error.message);
                // Simulated fallback data in case of an error
                setData(mergeAndSortData([], [{ 'acne': 12.918820977210999 }, { 'dermatomyositis': 82.23594522476196 }, { 'pediculosis lids': 5.845235288143158 }]));
            } finally {
                setLoading(false);
            }
        };

        classify();
    }, [route.params.image]);

    return (
        <ScrollView style={styles.container}>
            <GeneralHeader title="Classification" />
            {loading ? (
                <View style={styles.splashScreen}>
                    <LottieView
                        style={{ width: 200, height: 200 }}

                        source={require('../../../assets/loadingAnim.json')} // Ensure the path to your Lottie file is correct
                        autoPlay
                        loop={true}

                    />
                    <Text style={styles.loadingText}>Analyzing Image...</Text>
                </View>
            ) : (
                <PieComponent pieData={data} />
            )}

            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}> {highest}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <Button icon='magic-staff' mode="elevated" onPress={async () => await streamGeminiContent("Suggest medications, treatments, lifestyle modifications for a patient who has", highest)}>
                    Recommendation
                </Button>

                <Button icon={'grease-pencil'} mode="elevated" onPress={() => navigation.navigate('Feedback', { patientId: patientId, reportId: reportId, image: image, segmented: segmented, recommendation: recommendations, highest: highest })}>
                    Feedback
                </Button>


            </View>
            <ScrollView>
                {contentCards?.length === 0 && recommenderLoading && <ActivityIndicator size="large" color="#0000ff" />}
                {contentCards?.map((card, index) => (
                    <Card key={index} style={{ margin: 10 }}>
                        
                        {console.log(card.content[0] ==="")}
                         {card.content[0] === ""?  <Card.Title titleStyle={styles.cardTitle} title={card.title} /> : <Card.Title title={card.title} />}
                        <Card.Content>
                            {card.content === ""? '' : <Text>{card.content}</Text>}
                        </Card.Content>
                    </Card>
                ))}

            
            </ScrollView>
            {flag && <Text>{recommendations}</Text>}
            <TouchableOpacity onPress={() => setFlag(!flag)}><Text style={{ textAlign: 'center', color: 'gray', fontSize: 10, marginTop: 10 }}>Parse Text</Text></TouchableOpacity> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    splashScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
    },
    card: {
        margin: 10,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      cardItem: {
        fontSize: 16,
        marginBottom: 5,
      },
      cardTitle: {
        fontSize: 20,  // Larger font size
        fontWeight: 'bold',  // Bold text
        color: '#007bff',  // A vibrant color, adjust as needed
        alignSelf: 'center',  // Center the title
        alignItems: 'center',  // Center the title
        justifyContent: 'center',  // Center the title
        paddingTop:40
        
      },

});
