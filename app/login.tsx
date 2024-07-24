import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Image,
  BackHandler,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import logo from "../assets/images/logo.png";
import { auth } from "@/services/firebase";
import Button from "@/components/Button";
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onHandleLogin = () => {
    if (email !== "" && password !== "" && !isLoading) {
      setIsButtonDisabled(true);
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("Login success");
          alert("Login successfully 😊");
          router.replace("/");
          setIsLoading(false);
          setEmail("");
          setPassword("");
        })
        .catch((err: any) => {
          Alert.alert("Login error", err.message);
          setIsLoading(false);
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
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
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="black" 
            />
          </TouchableOpacity>
        </View>
        <Button
          title={isLoading ? "Logging in..." : "Login"}
          onPress={onHandleLogin}
          style={{ width: "100%" }}
          disabled={isButtonDisabled || isLoading}
        />
        <Button
          title="Register"
          onPress={() => router.push("/register")}
          style={{ width: "100%" }}
        />
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

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
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    padding: 10,
    height: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    height: 50,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
});