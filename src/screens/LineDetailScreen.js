import React from "react";
import { ScrollView, Text } from "react-native";
import StopItem from "../components/StopItem";

export default function LineDetailScreen({ route }) {
  const { line } = route.params;

  return (
    <ScrollView>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Hat: {line.name}
      </Text>

      {line.stops.map((stop, index) => (
        <StopItem key={index} stop={stop} />
      ))}
    </ScrollView>
  );
}