import Button from "@/components/Button";
import { auth } from "@/services/firebase";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

type LogoutError = {
  message: string;
  code?: string;
};

export default function ModalScreen() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully");
      router.replace("/landing");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Button style={{ width: "100%" }} title="LogOut" onPress={handleLogout} />

      <Button
        title="Request Leave"
        onPress={() => router.push("/reqleave")}
        style={{ width: "100%" }}
      />
      <Button
        title="Manage Leaves"
        style={{ width: "100%" }}
        onPress={() => router.push("/manageleave")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7dd3fc",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 30,
    padding: 20,
  },
});
