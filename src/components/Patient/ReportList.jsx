import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  StyleSheet,
  Image,
  Button as NativeButton
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Colors
} from 'react-native-paper';
import { auth, db } from '../../Connection/DB';
import { get, ref } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import GeneralHeader from '../GeneralHeader';

// Reusable Report Card Component
const ReportCard = ({ report, uid }) => {
  const navigation = useNavigation();

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Report ${report.id}`}
        subtitle={`Status: ${report.status}`}
        left={(props) => (
          <Image
            source={{ uri: report.image }}
            style={styles.image}
            {...props}
          />
        )}
      />
      <Card.Content>
        <Paragraph>{report.description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Details', { reportId: report.id })}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          View Details
        </Button>
        <Button
          mode="contained"
          onPress={() => console.log('Download PDF')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Download PDF
        </Button>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate('Chat', { reportId: report.id, patientId: uid })
          }
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Chat
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    overflow: 'hidden',
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
    
  },
  content: {
    flexDirection: 'row',
    padding: 8,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 8,
  },
  button: {
    
    marginHorizontal: 0,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  indicator: {
    marginVertical: 20,
  },
  noData: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

// Main Component that uses the Report Card
const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [uid, setUid] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      } else {
        // Set a default user ID or handle user not found scenario
        setUid('perpHAw783g5Oc6AgVxxeSaY4F03');
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  useEffect(() => {
    if (uid) {
      loadReports(); // Load reports when UID is set or changed
    }
  }, [uid]);


  const loadReports = () => {
    if (!uid) return; // If no UID, exit the function
    setRefreshing(true);
    console.log('Loading reports for user', uid);
    get(ref(db, `patients/${uid}/reports/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const fetchedReports = [];
          snapshot.forEach((childSnapshot) => {
            fetchedReports.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          console.log(fetchedReports);
          setReports(fetchedReports);
        } else {
          console.log('No data available');
          setReports([]); // Clear reports if none found
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    loadReports(); // Refresh reports data
  };

  return (
    <>
     
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          {refreshing ? (
            <ActivityIndicator
              animating={true}
             
              size="large"
              style={styles.indicator}
            />
          ) : reports.length > 0 ? (
            reports.map((report) => <ReportCard key={report.id} report={report} uid={uid} />)
          ) : (
            <Text style={styles.noData}>No reports available.</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default ReportList;
