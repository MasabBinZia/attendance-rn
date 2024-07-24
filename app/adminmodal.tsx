import Button from "@/components/Button";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function AdminModalScreen() {
  const handleLogout = async () => {
    try {
      console.log("User logged out successfully");
      router.replace("/landing");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Button style={{ width: "100%" }} title="LogOut" onPress={handleLogout} />
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
