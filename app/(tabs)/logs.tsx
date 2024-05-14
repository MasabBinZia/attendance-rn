import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MarkAbleCalendar from "@/components/MarkAbleCalendar";
import Octicons from "@expo/vector-icons/Octicons";
import { auth, db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Logs() {
  const [markedDates, setMarkedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toISOString().split("T")[0];

  const monthMap: any = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const convertToDate = (dateString: any) => {
    const [dayName, monthName, day] = dateString.split(" ");
    const month: any = monthMap[monthName];
    const dayFormatted = day.replace(",", "").padStart(2, "0");
    const year = new Date().getFullYear();
    return `${year}-${month}-${dayFormatted}`;
  };

  useEffect(() => {
    const fetchMarkedDates = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("User not authenticated.");
          setLoading(false);
          return;
        }

        const userUuid = user.uid;
        const attendanceCollection = collection(
          db,
          "users",
          userUuid,
          "attendance"
        );
        const attendanceSnapshot = await getDocs(attendanceCollection);

        const fetchedMarkedDates: any = attendanceSnapshot.docs.map((doc) => {
          const data = doc.data();
          const date = convertToDate(doc.id);
          return {
            date,
            selected: true,
            marked: true,
            selectedColor: data.clockIn && data.clockOut ? "green" : "red",
          };
        });

        setMarkedDates(fetchedMarkedDates);
        console.log(fetchedMarkedDates);
      } catch (error) {
        console.error("Error fetching marked dates: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkedDates();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Octicons name="check-circle-fill" size={50} color="green" />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <Octicons name="x-circle-fill" size={50} color="red" />
          <Text style={styles.legendText}>Absent</Text>
        </View>
      </View>
      <MarkAbleCalendar markedDates={markedDates} currentDate={currentDate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7dd3fc",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  legendItem: {
    marginHorizontal: 20,
    alignItems: "center",
  },
  legendText: {
    fontSize: 20,
  },
});
