import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';

const DiseaseInformation = ({ disease, image }) => {
    const navigation = useNavigation();
    
    return (
        <Card style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{disease}</Text>
            </View>
            <Card.Cover style={styles.cover} source={image} />
            <Card.Actions style={styles.actions}>
                <Button
                    icon="chat-question-outline"
                    mode="contained"
                    onPress={() => navigation.navigate("Ask Questions", { disease: disease })}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}>
                    Ask Questions
                </Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        elevation: 4,
    },
    header: {
        backgroundColor: '#8a4f9e',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    cover: {
        height: 200,
        borderRadius: 0,
    },
    actions: {
        justifyContent: 'center',
        padding: 10,
    },
    button: {
        // backgroundColor: '#6c63ff',
        paddingVertical: 8,
    },
    buttonLabel: {
        color: '#ffffff',
        fontSize: 18,
    }
});

export default DiseaseInformation;
