import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Paragraph, Avatar, Button, useTheme } from 'react-native-paper';
import GeneralHeader from '../components/GeneralHeader';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import Markdown from 'react-native-markdown-display';
const ShowDetails = ({ route }) => {
  const { id, status, recommendation, feedback, pdf, image } = route.params;
  const { colors } = useTheme(); // Use theme for color adaptability

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    card: {
      margin: 10,
      elevation: 4,
      backgroundColor: colors.secondary,
    },
    cover: {
      height: 200,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.background,
    },
    subtitle: {
      fontSize: 18,
      marginTop: 10,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 10,
      color: colors.secondary,
    },
  });
  
  const handleDownloadPdf = () => {
    Linking.openURL(pdf); // Opens the PDF URL in the user's default web browser
  };

 const sharePdf = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not available on your device');
      return;
    }
    await Sharing.shareAsync(pdf); // Shares the PDF URL
  }
  

  return (
    <>
    <GeneralHeader  title="Report Details" />
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={`Report ID: ${id}`}
          left={(props) => <Ionicons name="document" size={24} color={colors.primary} />}
          titleStyle={styles.title}
        //   subtitle="Detailed View"
        />
        <Card.Cover source={{ uri: image }} style={styles.cover} />
        <Card.Content>
          <Title style={[styles.subtitle, {color: colors.primary}]}>Recommendation</Title>
          <Markdown  style={[styles.paragraph, {body: { color: colors.primary}}]}>{recommendation}</Markdown>
          <Title style={[styles.subtitle, {color: colors.primary}]}>Feedback</Title>
          <Paragraph style={styles.paragraph}>{feedback}</Paragraph>
        </Card.Content>
        <Card.Actions>
          {pdf ? (
            <Button icon="download" mode="contained" onPress={handleDownloadPdf} color={colors.primary}>
              Download PDF
            </Button>
          ) : (
            <Paragraph style={styles.paragraph}>PDF of this report is not yet generated.</Paragraph>
          )}
        </Card.Actions>
      </Card>
    </ScrollView>
    </>
  );
};



export default ShowDetails;
