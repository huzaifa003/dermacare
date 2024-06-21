import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Card, Button, Title, Paragraph, Avatar } from 'react-native-paper';

const PatientReportCard = ({ patient }) => {
  const navigation = useNavigation();
  return (
    <Card>
      <Card.Title
        title={patient.name}
        subtitle={`${patient.age} years old`}
        left={(props) => <Avatar.Image {...props} source={{ uri: patient.avatarUrl ? patient.avatarUrl : "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1224184972.1715126400&semt=ais" }} size={50} />}
      />
      <Card.Content>
        <Title>Summary:</Title>
        <Paragraph>{patient.summary}</Paragraph>
      </Card.Content>
      <Card.Content>
        <Paragraph style={{backgroundColor: '#84eab3', paddingLeft: 10, borderRadius: 10}}>Patient ID: {patient.id}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          icon="file-document"
          mode="contained"
          onPress={() => navigation.navigate('listreport', { uid: patient.id })}
        >
          View Report
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default PatientReportCard;
