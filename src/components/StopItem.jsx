import React from "react";
import { Text, StyleSheet } from "react-native";

export default function StopItem({ stop }) {
  return <Text style={styles.stop}>• {stop}</Text>;
}

const styles = StyleSheet.create({
  stop: {
    marginLeft: 10,
    marginTop: 5
  }
});