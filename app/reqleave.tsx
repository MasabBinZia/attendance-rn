import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Option from "@/components/options";
import { auth, db } from "@/services/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const Reqleave = () => {
  const [selectedOption, setSelectedOption] = useState<Options>("Annual Leave");
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [selectedFromDate, setSelectedFromDate] = useState<Date>(new Date());
  const [selectedToDate, setSelectedToDate] = useState<Date>(new Date());

  const handleDateChange = (date?: Date) => {
    if (date) {
      setSelectedFromDate(date);
      setSelectedToDate(date);
    }
  };

  type Options = "Annual Leave" | "Casual Leave" | "Sick Leave";

  const handleOptionChange = (option: Options) => {
    setSelectedOption(option);
  };

  const onPress = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not authenticated.");
      return;
    }

    if (!subject.trim() || !description.trim()) {
      alert("Please fill in both Subject and Description.");
      return;
    }

    setIsButtonDisabled(true);
    setIsLoading(true);

    const userUuid = user.uid;
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    try {
      const leaveRef = collection(db, "users", userUuid, "leaves");
      const leavesData = {
        userId: userUuid,
        leaveType: selectedOption,
        subject,
        description,
        fromDate: selectedFromDate,
        toDate: selectedToDate,
      };
      await setDoc(doc(leaveRef, today), leavesData);
      setSelectedOption("Annual Leave");
      setIsLoading(false);
      alert("Request Submitted Successfully 🎉");
    } catch (error) {
      console.error("Error adding leavesData: ", error);
      setIsLoading(false);
      alert("Error submitting request.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Leave Application</Text>

        <Option
          options={["Annual Leave", "Casual Leave", "Sick Leave"]}
          onChange={handleOptionChange}
        />
        <View style={{ gap: 30 }}>
          <TextInput
            id="subject"
            placeholder="Subject"
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              padding: 2,
              height: 50,
            }}
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            id="description"
            placeholder="Description"
            value={description}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              padding: 2,
              height: 50,
            }}
            onChangeText={setDescription}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              gap: 30,
              marginHorizontal: 30,
            }}
          >
            <View>
              <Text style={{ fontWeight: "bold" }}>Date From</Text>
              <DatePicker
                style={styles.datePicker}
                mode="date"
                textColor="black"
                value={selectedFromDate}
                onChange={(event, date) => handleDateChange(date)}
              />
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>Date To</Text>
              <DatePicker
                style={styles.datePicker}
                mode="date"
                textColor="black"
                value={selectedToDate}
                onChange={(event, date: any) => setSelectedToDate(date)}
              />
            </View>
          </View>
          <Button
            style={{ width: "100%" }}
            title={isLoading ? "Submiting Request..." : "Request Leave"}
            disabled={isLoading || isButtonDisabled}
            onPress={onPress}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Reqleave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7dd3fc",
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  textContainer: {
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  datePicker: {
    borderColor: "blue",
    width: "100%",
    color: "blue",
  },
});
