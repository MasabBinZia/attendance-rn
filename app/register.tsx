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
} from "react-native";
import logo from "../assets/images/logo.png";
import { router } from "expo-router";
import Button from "@/components/Button";

const RegisterScreen = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const onHandleSignup = async () => {
    setIsLoading(true);
    setIsButtonDisabled(true);
    await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsLoading(false);
        setDoc(doc(db, "users", user.uid), {
          Name: username,
          Email: email,
          CreatedAt: new Date().toUTCString(),
        });
      })
      .then(() => alert("Registered successfully 🎉"))
      .catch((err: any) => {
        alert(err.meassage);
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

        <View style={{ gap: 10 }}>
          <TextInput
            id="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              padding: 2,
              height: 50,
            }}
          />
          <TextInput
            id="username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              padding: 2,
              height: 50,
            }}
          />
          <TextInput
            id="Password"
            placeholder="Password"
            secureTextEntry
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              padding: 2,
              height: 50,
            }}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={{ gap: 10 }}>
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
});
