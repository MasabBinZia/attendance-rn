import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect } from "react";

const adminscreen = () => {
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.bgColor}>
        <Text style={styles.Heading}>Admin Panel</Text>

        <ScrollView>
          <Text>adminscreen</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default adminscreen;

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: "#7dd3fc",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingVertical: 40,
  },
  Heading: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
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
