import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#4CAF50",
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  }
});