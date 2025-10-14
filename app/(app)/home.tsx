import { View, Text, Button, ActivityIndicator, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

interface Assessment {
  id: string;
  assessmentName: string;
  selectedClass: string;
}

const Home = () => {
  const user = auth().currentUser;
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assessment[]>([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(user!.uid)
      .collection('assessments')
      .onSnapshot((snapshot) => {
        const assignmentsData: Assessment[] = [];
        snapshot.forEach((doc) => {
          assignmentsData.push({
            id: doc.id,
            assessmentName: doc.data().assessmentName,
            selectedClass: doc.data().selectedClass,
          });
        });
        setAssignments(assignmentsData);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Welcome back {user?.displayName}</Text>
      {assignments.length === 0 ? (
        <Text>No assignments found.</Text>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.assessmentName}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};
export default Home;
