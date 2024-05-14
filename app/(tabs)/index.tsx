import { useColorScheme } from "@/hooks/useColorScheme.web";
import { auth, db } from "@/services/firebase";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import logo from "../../assets/images/logo.png";
import { FontAwesome } from "@expo/vector-icons";
import useDateTime from "@/hooks/DateTime";

export default function Home() {
  const colors = useColorScheme();
  const [clockText, setClockText] = useState("Clock In");
  const [loading, setLoading] = useState(true);
  const { currentTime, currentDate } = useDateTime();
  const [isClockedIn, setIsClockedIn] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not authenticated.");
      setLoading(false);
      return;
    }

    const userUuid = user.uid;
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    const fetchAttendanceData = async () => {
      try {
        const attendanceRef = doc(
          collection(db, "users", userUuid, "attendance"),
          today
        );
        const attendanceSnapshot = await getDoc(attendanceRef);

        if (attendanceSnapshot.exists()) {
          const data = attendanceSnapshot.data();
          if (data.clockIn && !data.clockOut) {
            setClockText("Clock Out");
            setIsClockedIn(true);
          } else if (data.clockIn && data.clockOut) {
            setClockText("Marked");
            setIsClockedIn(true);
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  const onPress = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not authenticated.");
      return;
    }

    const userUuid = user.uid;
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    try {
      const attendanceRef = doc(
        collection(db, "users", userUuid, "attendance"),
        today
      );
      const attendanceSnapshot = await getDoc(attendanceRef);

      if (attendanceSnapshot.exists()) {
        const data = attendanceSnapshot.data();
        if (data.clockIn && !data.clockOut) {
          await setDoc(
            attendanceRef,
            { clockOut: serverTimestamp() },
            { merge: true }
          );
          setClockText("Marked");
          setIsClockedIn(true);
        }
      } else {
        await setDoc(attendanceRef, { clockIn: serverTimestamp() });
        setClockText("Clock Out");
        setIsClockedIn(true);
      }
    } catch (error) {
      console.error("Error marking attendance: ", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.bgColor}>
        <View>
          <Image source={logo} style={styles.logo} />
        </View>
        <View>
          <Text style={{ fontSize: 40, textAlign: "center" }}>
            {currentTime}
          </Text>
          <Text style={{ fontSize: 40, textAlign: "center" }}>
            {currentDate}
          </Text>
          <Text style={{ fontSize: 20, textAlign: "center" }}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </Text>
        </View>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color={"blue"} />
          ) : (
            <Pressable
              onPress={onPress}
              disabled={isClockedIn && clockText === "Marked"}
              style={[
                styles.button,
                clockText === "Clock Out"
                  ? styles.buttonClockOut
                  : clockText === "Marked"
                  ? styles.buttonMarked
                  : null,
              ]}
            >
              {({ pressed }) => (
                <View>
                  <FontAwesome name="hand-pointer-o" size={80} color={colors} />
                  <Text style={styles.buttonText}>{clockText}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: "#7dd3fc",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  container: {
    alignItems: "center",
    paddingVertical: 30,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  buttonClockOut: {
    backgroundColor: "#22c55e",
  },
  buttonMarked: {
    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});
