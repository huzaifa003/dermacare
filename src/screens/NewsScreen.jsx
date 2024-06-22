import React, { useEffect, useState } from 'react';
import { ScrollView, View, Linking, StyleSheet, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Divider, useTheme } from 'react-native-paper';
import GeneralHeader from '../components/GeneralHeader';

const NewsScreen = () => {
  
  const [newsData, setNewsData] = useState([
    {
      name: "Pharmacist warns over eight tell-tale skin marks from a harmless midge bite to a dangerous spider wound",
      url: "https://www.msn.com/en-my/health/other/pharmacist-warns-over-eight-tell-tale-skin-marks-from-insect-bites/ar-BB1lR8Rj",
      description: "Leading pharmacist, George Sandhu, has warned Brits not to overlook insect bites as the summer season approaches as a bad reaction could prove life-threatening."
    },
    // Add more news items here
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const fetchNewsData = async () => {
    try {
      const response = await fetch('https://api.bing.microsoft.com/v7.0/news/search?q=dermatology&count=50&textdecorations=true', {
        headers: {
          'Ocp-Apim-Subscription-Key': 'd3f09dc9c39e47dba03f6be717280449'
        }
      });
      const data = await response.json();
      setNewsData(data.value);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNewsData().then(() => setRefreshing(false));
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
  }

  return (
    <>
    <GeneralHeader title="News" />
      <ScrollView
        style={[styles.container, {backgroundColor: colors.background}]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {

          newsData?.map((item, index) => (
            <>
              <Card key={index} style={styles.card}>
                {item.image?.thumbnail && (
                  <Card.Cover source={{ uri: item.image.thumbnail.contentUrl }} />
                )}
                <Card.Content key={index + " news"}>
                  <Title>{item.name}</Title>
                  <Paragraph>{item.description}</Paragraph>
                </Card.Content>
                <Card.Actions style={{ flex: 1, justifyContent: 'space-between' }}>

                  <Text style={{ 'marginRight': 'auto' }}> {formatDate(item.datePublished)} </Text>
                  <Button
                    icon="book-open-outline"
                    mode="contained"
                    onPress={() => Linking.openURL(item.url)}
                    color={colors.primary}
                  >
                    Read More
                  </Button>


                </Card.Actions>
              </Card>
              <Divider key={index + "divider"} />
            </>
          ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  card: {
    marginBottom: 10,
    elevation: 4  // Increased elevation for better shadow effect
  }
});

export default NewsScreen;
