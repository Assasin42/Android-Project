import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { PROVIDER_GOOGLE } from "react-native-maps";
export default function App() {
  const GumusHane = {
    latitude: 40.4608,
    longitude: 39.4817,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={GumusHane}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
