import Button from "@/components/Button";
import MarkableCalendar from "@/components/MarkableCalendar";
import Octicons from "@expo/vector-icons/Octicons";
import { useState } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";

export default function Logs() {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <View style={{ marginHorizontal: 20, alignItems: "center" }}>
          <Octicons name="check-circle-fill" size={50} color="green" />
          <Text style={{ fontSize: 20 }}>Present</Text>
        </View>
        <View style={{ marginHorizontal: 20, alignItems: "center" }}>
          <Octicons name="x-circle-fill" size={50} color="red" />
          <Text style={{ fontSize: 20 }}>Absent</Text>
        </View>
      </View>
      {/* <MarkableCalendar /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7dd3fc",
    justifyContent: "center",
  },
});
