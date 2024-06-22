import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Button, TextInput } from 'react-native-paper';
import GeneralHeader from '../GeneralHeader';
import FeedbackModal from '../FeedbackModal';
import ViewDetailsModal from '../ViewDetailsModal';
import { get, ref } from 'firebase/database';
import { db } from '../../Connection/DB';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const ListReport = ({ route, navigation }) => {
  const { uid } = route.params;
  console.log(uid);

  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [patientReports, setPatientReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('approved'); // Default filter
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReportsByStatus();
  }, [statusFilter, patientReports]);

  const fetchReports = () => {
    setRefreshing(true);
    get(ref(db, `patients/${uid}/reports`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const reports = [];
          snapshot.forEach((childSnapshot) => {
            reports.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          console.log(reports);
          setPatientReports(reports);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const searchReports = (query) => {
    if (query === '') {
      filterReportsByStatus();
      return;
    }

    setFilteredReports(
      patientReports.filter((report) => {
        return report.description.toLowerCase().includes(query.toLowerCase()) ||
          report.id.toString().includes(query);
      })
    );
  };



  const filterReportsByStatus = () => {
    setFilteredReports(
      patientReports.filter((report) =>
        statusFilter === 'approved'
          ? report.status.toLowerCase() === 'approved'
          : report.status.toLowerCase() !== 'approved'
      )
    );
  };

  const onRefresh = () => {
    fetchReports();
  };

  const handleFeedback = (reportTitle) => {
    console.log(`Feedback for ${reportTitle}`);
    setFeedbackModalVisible(true);
  };

  const handleViewDetails = (id, status, recommendation, feedback, pdf, image ) => {
    console.log(`View details for ${id}`);
    navigation.navigate('Show Details', { id: id, status: status, recommendation: recommendation, feedback: feedback, pdf: pdf, image: image });
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === 'approved' ? '#28A745' : '#DC3545';
  };

  return (
    <>
      <GeneralHeader title={'Reports'} />

      <TextInput
        mode='flat'
        // style={[tw`flex-1 p-0 h-10`]}
        placeholder="Search reports..."
        value={query}
        onChangeText={(text) => { setQuery(text); searchReports(text) }}
        onSubmitEditing={() => searchReports(query)}
      />
      <View style={styles.container}>

        <View style={[tw`flex-row mb-4`, { gap: 10 }]}>


          {/* <Button
            
            mode="elevated"
            onPress={() => searchReports(query)}
          >
            <Text style={tw`text-black`}>Search</Text>
          </Button> */}
        </View>
        {query === '' ?
          <View style={[tw`flex-row mb-4`, { gap: 10 }]}>
            <Button
              style={[
                tw`flex-1 p-0 h-10`,
                statusFilter === 'approved' ? tw`bg-purple-600` : tw`bg-white`
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
          : ''}
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredReports.length < 1 && <Text style={[tw`text-red-600 font-bold text-lg`, { "alignSelf": 'center' }]}> No Report Found</Text>}

          {filteredReports.map((report) => (
            <Card key={report.id} style={styles.card}>
              <Card.Title title={<Text> Report# {report.id} </Text>}
                left={(props) => <Image source={{ uri: report.image }} style={{ width: 50, height: 50, borderRadius: 20 }} />}


                right={(props) => (
                  <>
                    {report.status.toLowerCase() === 'approved' ? (
                      <Ionicons style={{ marginRight: 5 }} name="checkmark-circle" size={24} color="#28A745" />
                    ) : (
                      <Ionicons style={{ marginRight: 5 }} name="time" size={24} color="#DC3545" />
                    )}
                    {/* <Text style={{color: getStatusColor(report.status)}}>{report.status}</Text> */}
                  </>
                )}

              />
              <Card.Content>
                <View style={{ flexDirection: 'row' }}>
                  {/* <Image source={{ uri: report.image }} style={{ width: 50, height: 50, marginRight: 10 }} /> */}
                  <View>
                    <Text style={[styles.descriptionText, { fontWeight: 'bold' }]}> Description:  <Text style={{ fontWeight: 'normal' }}> {report.description} </Text> </Text>
                    <Text style={[styles.statusText, { fontWeight: 'bold', color: 'black' }]}>

                    </Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions >


                {report.status.toLowerCase() !== 'approved' ? (
                  <Button mode='contained-tonal'
                    icon={'image-search'}
                    onPress={() => navigation.navigate('Segmentation', { reportId: report.id, imageUrl: report.image, patientId: uid })}
                  >Process Report</Button>
                ) : <Button mode='contained-tonal' icon={'information'} onPress={() => handleViewDetails(report.id, report.status, report.recommendation, report.feedback, report.pdf, report.image)} >View Details</Button>}

                {/* { report.status.toLowerCase() === 'approved' ?  : "" } */}


                <Button
                  icon={'chat'}
                  onPress={() => navigation.navigate('Chat', { reportId: report.id, patientId: uid })}
                  textColor="#FFFFFF">Chat</Button>

              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
      </View>

      <FeedbackModal visible={feedbackModalVisible} onClose={() => setFeedbackModalVisible(false)} />
      <ViewDetailsModal visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
    elevation: 4,
    borderRadius: 8,
  },





  descriptionText: {
    fontSize: 16,

    color: '#495057',
  },
  statusText: {
    alignSelf: 'center',
    fontSize: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    color: '#FFFFFF',
    borderRadius: 5,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  // actions: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 10,
  // },
  button: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListReport;
