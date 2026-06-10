import React from "react";
import { ScrollView, Text } from "react-native";
import StopItem from "../components/StopItem";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

export default function LineDetailScreen({ route }) {
  const { line } = route.params;
  const { t } = useTranslation();
  

  return (
    <ScrollView>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        {t('lineDetail.hat')}: {line.name}
      </Text>

      {line.stops.map((stop, index) => (
        <StopItem key={index} stop={stop} />
      ))}
    </ScrollView>
  );
}