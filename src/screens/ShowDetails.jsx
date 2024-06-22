import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { Card, Title, Paragraph, Avatar, Button, useTheme, Surface } from 'react-native-paper';
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
      backgroundColor: colors.background,
    },
    cover: {
      height: 200,
      
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.inversePrimary,
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

  const markdownStyles = StyleSheet.create({
    heading1: {
      fontSize: 32,
      color: colors.inverseSurface,
    },
    body : {
      color: colors.inverseSurface,
    },
    heading2: {
      fontSize: 24,
      color: colors.inverseSurface,
    },
    heading3: {
      fontSize: 18,
      color: colors.inverseSurface,
    },
    heading4: {
      fontSize: 16,
      color: colors.inverseSurface,
    },
    heading5: {
      fontSize: 13,
      color: colors.inverseSurface,
    },
    heading6: {
      fontSize: 11,
      color: colors.inverseSurface,
    }
  });


  const rules = {
    heading1: (node, children, parent, styles) =>
      <Text key={node.key} style={[styles.heading, styles.heading1]}>
        {children}
      </Text>,
    heading2: (node, children, parent, styles) =>
      <Text key={node.key} style={[styles.heading, styles.heading2]}>
        "{children}"
      </Text>,
    heading3: (node, children, parent, styles) =>
      <Text key={node.key} style={[styles.heading, styles.heading3]}>
       "{children}"
      </Text>,
};


  
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
        <Surface style={{backgroundColor: colors.background, padding: 5, margin: 5, borderRadius: 10}}><Card.Cover source={{ uri: image }} style={styles.cover} /></Surface>
        <Card.Content>
          <Title style={[styles.subtitle, {color: colors.inversePrimary}]}>Recommendation</Title>
          <Markdown  style={markdownStyles}>{recommendation}</Markdown>
          <Title style={[styles.subtitle, {color: colors.inversePrimary}]}>Feedback</Title>
          <Paragraph style={[styles.paragraph, {color: colors.inverseSurface}]}>{feedback}</Paragraph>
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
