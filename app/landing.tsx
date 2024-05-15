import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  BackHandler,
} from "react-native";
import logo from "../assets/images/logo.png";
import Button from "@/components/Button";

const Landing = () => {
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
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Empower Your Workforce with Agri Time Technology
        </Text>
        <Text style={styles.subtitle}>Attendance, Efficiency, and Beyond!</Text>
      </View>
      <View style={{ width: "100%", gap: 10 }}>
        <Button
          title="Login"
          onPress={() => router.push("/login")}
          style={{ width: "100%" }}
        />
        <Button
          title="Register"
          onPress={() => router.push("/register")}
          style={{ width: "100%" }}
        />
        <Button
          title="Login for HR / Admin"
          onPress={() => router.push("/admin")}
          style={{ width: "100%" }}
        />
         {/* <Button
          title="Admin"
          onPress={() => router.push("/adminscreen")}
          style={{ width: "100%" }}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#7dd3fc",
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
});
