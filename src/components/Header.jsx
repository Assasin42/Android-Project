import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppColors } from "../styles/colors.js";
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
    backgroundColor: AppColors.green,
    alignItems: "center",
  },
  text: {
    color: AppColors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
});
