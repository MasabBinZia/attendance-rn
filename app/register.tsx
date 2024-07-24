import { auth, db } from "@/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import logo from "../assets/images/logo.png";
import { router } from "expo-router";
import Button from "@/components/Button";
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onHandleSignup = async () => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsLoading(false);
        return setDoc(doc(db, "users", user.uid), {
          Name: username,
          Email: email,
          CreatedAt: new Date().toUTCString(),
        });
      })
      .then(() => {
        alert("Registered successfully 🎉");
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((err: any) => {
        alert(err.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);
      });
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
      <View style={styles.RegisterInputs}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.inputContainer}>
          <TextInput
            id="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            id="username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              id="Password"
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
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
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={{ width: "100%" }}
            title={isLoading ? "Registering..." : "Register"}
            onPress={onHandleSignup}
            disabled={isButtonDisabled || isLoading}
          />
          <Button
            style={{ width: "100%" }}
            title="Login"
            onPress={() => router.push("/login")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
  },
  RegisterInputs: {
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
  inputContainer: {
    gap: 10,
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
  buttonContainer: {
    gap: 10,
  },
});