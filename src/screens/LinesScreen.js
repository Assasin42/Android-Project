import React from "react";
import { View, FlatList } from "react-native";
import { busLines } from "../data/mockData";
import BusCard from "../components/busTime";
import Header from "../components/Header";
import { TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";


export default function LinesScreen() {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1,marginTop: 40}}>
      <Header title={t('lines.title')} />

      <FlatList
        data={busLines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusCard
            line={item}
            onPress={() => alert(item.name)}
          />
          
        )}
      />
    </View>
  );
}