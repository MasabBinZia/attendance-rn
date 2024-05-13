import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const Button = ({ onPress, title, style }: any) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#4682b4",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
