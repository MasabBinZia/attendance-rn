import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, Tabs, router } from "expo-router";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";


export default function TabLayout() {
  const [isLoading, setIsLoading] = useState(true);

  getAuth().onAuthStateChanged((user) => {
    setIsLoading(false);
    if (!user) {
      router.replace("/landing");
    }
  });
  if (isLoading)
    return (
      <ActivityIndicator size="large" style={styles.Loader} color="black" />
    );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => <MenuIcon />,
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
          headerRight: () => <MenuIcon />,
        }}
      />
    </Tabs>
  );
}

function MenuIcon() {
  return (
    <Link href="/modal" asChild>
      <Pressable>
        {({ pressed }) => (
          <View>
            <Entypo name="menu" size={40} color="black" />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  Loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for the loader
    zIndex: 999, // Ensures the loader is on top of other content
  },
});
