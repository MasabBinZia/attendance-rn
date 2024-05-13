import Button from "@/components/Button";
import ModalComponent from "@/components/modal";
import { auth, db } from "@/services/firebase";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LeaveRequest = {
  subject: string;
  type: string;
  description: string;
  fromDate: string;
  toDate: string;
};
type ModalVisibleState = { [key: number]: boolean };

const data = [
  { leave: 10, type: "SICK", balance: 10 },
  { leave: 10, type: "CASUAL", balance: 20 },
  { leave: 20, type: "ANNUAL", balance: 20 },
];

const ManageLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalsVisible, setModalsVisible] = useState<ModalVisibleState>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated.");
      setLoading(false);
      return;
    }

    const fetchLeaveRequests = async () => {
      const userUuid = user.uid;
      const leaveRequestsQuery = query(
        collection(db, "users", userUuid, "leaves"),
        where("userId", "==", userUuid)
      );

      try {
        const querySnapshot = await getDocs(leaveRequestsQuery);
        const requests: LeaveRequest[] = querySnapshot.docs.map(
          (doc, index) => ({
            subject: doc.data().subject,
            type: doc.data().leaveType,
            description: doc.data().description,
            fromDate: doc.data().fromDate.toDate().toLocaleDateString(),
            toDate: doc.data().toDate.toDate().toLocaleDateString(),
          })
        );

        setLeaveRequests(requests);
        const initialModalsState: ModalVisibleState = ({} = {});
        requests.forEach((_, idx) => {
          initialModalsState[idx] = false;
        });
        setModalsVisible(initialModalsState);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave requests: ", error);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaves Balances</Text>
        {data.map((leave, idx) => (
          <View
            key={idx}
            style={{
              width: 300,
              height: 100,
              margin: 5,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#67e8f9",
            }}
          >
            <Text style={{ color: "black", fontSize: 30, fontWeight: "bold" }}>
              {leave.leave}
            </Text>
            <Text style={{ color: "black", fontSize: 10 }}>{leave.type}</Text>
            <Text style={{ color: "black", fontSize: 10 }}>
              {leave.balance} Leaves
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.requestsContainer}>
        <Text style={styles.requestsTitle}>Leave Requests</Text>
        <View style={styles.border} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : leaveRequests.length > 0 ? (
          leaveRequests.map((request, idx) => (
            <View key={idx}>
              <Button
                title={`${request.fromDate} - ${request.toDate}`}
                onPress={() =>
                  setModalsVisible((prev) => ({ ...prev, [idx]: !prev[idx] }))
                }
              />
              <ModalComponent
                modalVisible={modalsVisible[idx] || false}
                setModalVisible={(isVisible: any) =>
                  setModalsVisible((prev) => ({ ...prev, [idx]: isVisible }))
                }
                title={request.type}
                content1={`Subject - ${request.subject}`}
                content2={`Description - ${request.description}`}
                content3={`Leave Dates - ${request.fromDate} - ${request.toDate}`}
                buttonText="Close"
              />
            </View>
          ))
        ) : (
          <Text style={styles.noRequestsText}>No Leave Requests</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Request Leave"
          onPress={() => router.push("/reqleave")}
        />
      </View>
    </View>
  );
};

export default ManageLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7dd3fc",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  requestsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  requestsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  border: {
    borderBottomWidth: 1,
    borderColor: "black",
    marginBottom: 5,
  },
  noRequestsText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
