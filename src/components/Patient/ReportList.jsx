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
import tw from 'twrnc';
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
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('approved'); // Default filter
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
          // console.log(fetchedReports);
          setReports(fetchedReports);
          setFilteredReports(fetchedReports);
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

  
  

  useEffect(() => {
    
    filterReportsByStatus();
    console.log("filteredReports", filteredReports  )
  }, [statusFilter, reports]);

  const filterReportsByStatus = () => {
    // console.log("---------------------------------------")
    setFilteredReports(
      reports.filter((report) =>
        statusFilter === 'approved'
          ? report.status.toLowerCase() == 'approved'
          : report.status.toLowerCase() != 'approved'
      )
    );
  }



  return (
    <>
     
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[tw`flex-row mb-4`, {gap: 10, margin :10}]}>
        <Button
            style={[
              tw`flex-1 p-0 h-10`,
              statusFilter === 'approved' ? tw`bg-purple-600` : tw`bg-white`,
              {elevation: 5}
            ]}
            mode="outlined"
            onPress={() => setStatusFilter('approved')}
          >
            <Text style={tw`text-center font-semibold ${statusFilter === 'approved' ? 'text-white' : 'text-black'}`}>
              Approved
            </Text>
          </Button>
          <Button
            style={[
              tw`flex-1 p-0 h-10`,
              statusFilter === 'pending' ? tw`bg-purple-600` : tw`bg-white`
            ]}
            mode="outlined"
            onPress={() => setStatusFilter('pending')}
          >
            <Text style={tw`text-center font-semibold ${statusFilter === 'pending' ? 'text-white' : 'text-black'}`}>
              Pending
            </Text>
          </Button>
        </View>


        <View>
          {refreshing ? (
            <ActivityIndicator
              animating={true}
             
              size="large"
              style={styles.indicator}
            />
          ) : reports.length > 0 ? (

            filteredReports.length === 0 ? <Text style={[tw`text-red-600 font-bold text-lg`, {"alignSelf": 'center'}]}> No Report Found</Text>  :  filteredReports.map((report) => <ReportCard key={report.id} report={report} uid={uid} />)
            
          ) : (
            <Text style={[tw`text-red-600 font-bold text-lg`, {"alignSelf": 'center'}]}> No Report Found</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default ReportList;
