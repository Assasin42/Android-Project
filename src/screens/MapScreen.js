import React, { useRef, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { AppColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { busLocations } from "../data/busLocations";
export default function App({ navigation }) {
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const findNearestStop = (latitude, longitude) => {
    let nearest = null;
    let minDistance = Infinity;
    busLocations.forEach((location) => {
      const distance = getDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude,
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });
    return { nearest, distance: minDistance };
  };
  const route = useRoute();
  const mapRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const clearSelectedLocation = () => {
    setSelectedLocation(null);
  };
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

  const handleLongPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    const { nearest, distance } = findNearestStop(latitude, longitude);

    Alert.alert(
      "En Yakın Durak",
      `${nearest.title}\n${(distance * 1000).toFixed(0)} metre uzaklıkta`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Seç",
          onPress: () =>
            navigation.navigate("Duraklar", {
              screen: "HomeMain",
              params: { nearestStop: nearest.title },
            }),
        },
      ],
    );
  };

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
        onLongPress={handleLongPress}
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
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Seçilen Konum"
            description={`${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)}`}
            pinColor="blue"
          />
        )}
      </MapView>
      {selectedLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            {selectedLocation.latitude.toFixed(5)},
            {selectedLocation.longitude.toFixed(5)}
          </Text>
          <TouchableOpacity onPress={clearSelectedLocation}>
            <Ionicons name="close-circle" size={24} color={AppColors.red} />
          </TouchableOpacity>
        </View>
      )}
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
  locationInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },

  locationText: {
    fontSize: 14,
  },
});
