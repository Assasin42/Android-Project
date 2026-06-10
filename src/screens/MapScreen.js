import React, { useRef, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { busLocations } from "../data/busLocations";
export default function App({ navigation }) {
  const route = useRoute();
  const mapRef = useRef(null);
  const { latitude, longitude } = route.params || {};
  const GumusHane = {
    latitude: 40.4378,
    longitude: 39.5172,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0421,
  };
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: AppColors.black0_8,
          position: "absolute",
          elevation: 0,
          borderTopWidth: 0,
        },
      });
    };
  }, []);
  useEffect(() => {
    if (latitude && longitude) {
      setTimeout(() => {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          },
          1000,
        );
      }, 500);
    }
  }, [latitude, longitude]);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={GumusHane}
      >
        {busLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            description={location.description}
          >
            {location.isStart ? (
              <Ionicons name="flag" size={30} color={AppColors.green} />
            ) : (
              <Ionicons name="bus" size={24} color={AppColors.black} />
            )}
          </Marker>
        ))}
      </MapView>
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
  back: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 999,
    padding: 10,
    borderRadius: 20,
  },
});
