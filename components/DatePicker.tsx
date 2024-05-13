import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

const DatePicker = (
  props: React.ComponentProps<typeof DateTimePicker> & {
    mode: "date" | "time" | "datetime";
  }
) => {
  const show = (currentMode: "time" | "date") => () => {
    DateTimePickerAndroid.open({
      value: props.value,
      onChange: props.onChange,
      mode: currentMode,
      minimumDate: props.minimumDate,
      maximumDate: props.maximumDate,
    });
  };

  return (
    <View style={styles.container}>
      {props.mode.includes("date") && (
        <View style={styles.dateWrapper}>
          <Pressable onPress={show("date")} style={styles.pressable}>
            <Text style={styles.subhead}>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(props.value)}
            </Text>
          </Pressable>
          <View style={styles.labelContainer}>
            <Text style={styles.caption}>Date</Text>
          </View>
        </View>
      )}
      {props.mode.includes("time") && (
        <View style={styles.dateWrapper}>
          <Pressable onPress={show("time")} style={styles.pressable}>
            <Text style={styles.subhead}>
              {new Intl.DateTimeFormat("en-US", {
                timeStyle: "short",
              }).format(props.value)}
            </Text>
          </Pressable>
          <View style={styles.labelContainer}>
            <Text style={styles.caption}>Time</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
  },
  dateWrapper: {
    position: "relative",
    paddingTop: 6,
    paddingHorizontal: 5,
  },
  pressable: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: "black",
    opacity: 1,
  },
  subhead: {
    color: "black",
    fontSize: 16,
  },
  labelContainer: {
    backgroundColor: "#f0f0f0",
    position: "absolute",
    left: 5,
    top: 0,
    paddingHorizontal: 2,
  },
  caption: {
    fontSize: 10,
    color: "#999",
    opacity: 0.6,
  },
});

export default DatePicker;
