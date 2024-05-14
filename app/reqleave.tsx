import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Option from "@/components/options";
import { auth, db } from "@/services/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const Reqleave = () => {
  const [selectedOption, setSelectedOption] = useState<Options>("Annual Leave");
  const [status, setStatus] = useState<Status>("Pending");
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
  type Status = "Pending" | "Accepted" | "Rejected";

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
        status: status,
        subject,
        description,
        fromDate: selectedFromDate,
        toDate: selectedToDate,
      };
      await setDoc(doc(leaveRef, today), leavesData);
      setSelectedOption("Annual Leave");
      setSubject("");
      setDescription("");
      setSelectedFromDate(new Date());
      setSelectedToDate(new Date());
      setIsLoading(false);
      setIsButtonDisabled(false);
      alert("Request Submitted Successfully 🎉");
    } catch (error) {
      console.error("Error adding leavesData: ", error);
      setIsLoading(false);
      setIsButtonDisabled(false);
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
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            id="description"
            placeholder="Description"
            value={description}
            style={styles.input}
            onChangeText={setDescription}
          />
          <View style={styles.dateContainer}>
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
            title={isLoading ? "Submitting Request..." : "Request Leave"}
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    padding: 2,
    height: 50,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
  },
  datePicker: {
    borderColor: "blue",
    width: "100%",
    color: "blue",
  },
});
