import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Image,
  BackHandler,
  ScrollView,
  TextInput,
} from "react-native";
import logo from "../assets/images/logo.png";
import Button from "@/components/Button";

const AdminLoginScreen = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const hardcodedUserName = "zaeem";
  const hardcodedPassword = "zaeem123";

  const onHandleLogin = () => {
    if (userName !== "" && password !== "" && !isLoading) {
      setIsButtonDisabled(true);
      setIsLoading(true);

      if (userName === hardcodedUserName && password === hardcodedPassword) {
        console.log("Login success");
        Alert.alert("Login successfully 😊");
        router.replace("/adminscreen");
      } else {
        Alert.alert("Login error", "Invalid User Name or password");
      }

      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginInputs}>
        <Image source={logo} style={styles.logo} />
        <TextInput
          placeholder="UserName"
          value={userName}
          onChangeText={setUserName}
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            width: "100%",
            padding: 2,
            height: 50,
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            width: "100%",
            padding: 2,
            height: 50,
          }}
          secureTextEntry
        />
        <Button
          title={isLoading ? "Logging in..." : "Login"}
          onPress={onHandleLogin}
          style={{ width: "100%" }}
          disabled={isButtonDisabled || isLoading}
        />
      </View>
    </ScrollView>
  );
};

export default AdminLoginScreen;

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
  },
  loginInputs: {
    paddingHorizontal: 10,
    justifyContent: "center",
    display: "flex",
    gap: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#7dd3fc",
    justifyContent: "center",
  },
});
