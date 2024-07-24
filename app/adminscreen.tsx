import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import ModalComponent from "@/components/modal";
import Button from "@/components/Button";
import { db } from "@/services/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";

function MenuIcon() {
  return (
    <Link href="/adminmodal" asChild>
      <Pressable>
        {({ pressed }) => (
          <View>
            <Entypo name="menu" size={40} color="black" />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

type ModalVisibleState = { [key: string]: boolean };
type LeaveRequest = {
  id: string;
  subject: string;
  type: string;
  description: string;
  fromDate: string;
  toDate: string;
  status: string;
};

type User = {
  userId: string;
  name: string;
  email: string;
  leaveRequests: LeaveRequest[];
};

const AdminScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalsVisible, setModalsVisible] = useState<ModalVisibleState>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersQuery = collection(db, "users");
        const usersSnapshot = await getDocs(usersQuery);
        const usersData: User[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;

          const leaveRequestsQuery = collection(db, "users", userId, "leaves");
          const leaveRequestsSnapshot = await getDocs(leaveRequestsQuery);
          const leaveRequests: LeaveRequest[] = leaveRequestsSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              subject: doc.data().subject,
              type: doc.data().leaveType,
              description: doc.data().description,
              fromDate: doc.data().fromDate.toDate().toLocaleDateString(),
              toDate: doc.data().toDate.toDate().toLocaleDateString(),
              status: doc.data().status,
            })
          );

          usersData.push({
            userId,
            name: userData.Name,
            email: userData.Email,
            leaveRequests,
          });
        }

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();

    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const toggleModal = (userId: string, requestId: string) => {
    const key = `${userId}-${requestId}`;
    setModalsVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAccept = async (userId: string, requestId: string) => {
    const key = `${userId}-${requestId}`;
    if (actionLoading[key]) return;

    setActionLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const requestRef = doc(db, "users", userId, "leaves", requestId);
      await updateDoc(requestRef, { status: "Accepted" });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId
            ? {
                ...user,
                leaveRequests: user.leaveRequests.map((req) =>
                  req.id === requestId ? { ...req, status: "Accepted" } : req
                ),
              }
            : user
        )
      );
      Alert.alert("Success", "Leave request accepted");
    } catch (error) {
      console.error("Error updating leave request status: ", error);
      Alert.alert("Error", "Failed to accept leave request");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleReject = async (userId: string, requestId: string) => {
    const key = `${userId}-${requestId}`;
    if (actionLoading[key]) return;

    setActionLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const requestRef = doc(db, "users", userId, "leaves", requestId);
      await updateDoc(requestRef, { status: "Rejected" });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId
            ? {
                ...user,
                leaveRequests: user.leaveRequests.map((req) =>
                  req.id === requestId ? { ...req, status: "Rejected" } : req
                ),
              }
            : user
        )
      );
      Alert.alert("Success", "Leave request rejected");
    } catch (error) {
      console.error("Error updating leave request status: ", error);
      Alert.alert("Error", "Failed to reject leave request");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getStatusButtonStyle = (status: string) => {
    switch (status) {
      case "Accepted":
        return styles.acceptedButton;
      case "Rejected":
        return styles.rejectedButton;
      case "Pending":
      default:
        return styles.pendingButton;
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.bgColor}>
        <Text style={styles.Heading}>Admin Panel</Text>
        <View style={{ marginVertical: 20 }}>
          <MenuIcon />
        </View>
        <ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : users.length > 0 ? (
            users.map((user) => (
              <View key={user.userId} style={{ marginVertical: 10 }}>
                {user.leaveRequests.map((request) => {
                  const modalKey = `${user.userId}-${request.id}`;
                  return (
                    <View key={modalKey}>
                      <Button
                        title={` ${user.name} - (${request.status}) - ${request.fromDate} - ${request.toDate}`}
                        onPress={() => toggleModal(user.userId, request.id)}
                        style={getStatusButtonStyle(request.status)}
                      />
                      <ModalComponent
                        modalVisible={modalsVisible[modalKey] || false}
                        setModalVisible={(isVisible: boolean) =>
                          setModalsVisible((prev) => ({
                            ...prev,
                            [modalKey]: isVisible,
                          }))
                        }
                        title={request.type}
                        content1={`Subject - ${request.subject}`}
                        content2={`Description - ${request.description}`}
                        content3={`Leave Dates - ${request.fromDate} - ${request.toDate}`}
                        content4={
                          <View style={{ width: "100%", gap: 2 }}>
                            <Button
                              title={
                                actionLoading[modalKey]
                                  ? "Processing..."
                                  : "Accept"
                              }
                              onPress={() =>
                                handleAccept(user.userId, request.id)
                              }
                              style={styles.acceptButton}
                              disabled={
                                request.status !== "Pending" ||
                                actionLoading[modalKey]
                              }
                            />

                            <Button
                              title={
                                actionLoading[modalKey]
                                  ? "Processing..."
                                  : "Reject"
                              }
                              onPress={() =>
                                handleReject(user.userId, request.id)
                              }
                              style={styles.rejectButton}
                              disabled={
                                request.status !== "Pending" ||
                                actionLoading[modalKey]
                              }
                            />
                          </View>
                        }
                        buttonText="Close"
                      />
                    </View>
                  );
                })}
              </View>
            ))
          ) : (
            <Text style={styles.noRequestsText}>No Leave Requests</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: "#7dd3fc",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  Heading: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  userContainer: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  leaveRequestContainer: {
    marginBottom: 10,
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 5,
  },
  acceptedButton: {
    backgroundColor: "green",
  },
  rejectedButton: {
    backgroundColor: "red",
  },
  pendingButton: {
    backgroundColor: "blue",
  },
  acceptButton: {
    width: "100%",
    backgroundColor: "green",
  },
  rejectButton: {
    width: "100%",
    backgroundColor: "red",
  },
  noRequestsText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});
