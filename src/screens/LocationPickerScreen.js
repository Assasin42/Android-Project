import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";


const FACULTY_LOCATION = {
  latitude: 40.4378,
  longitude: 39.5172,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function LocationPickerScreen({ navigation, route }) {
  const { colors } = useTheme();
  const mapRef = useRef(null);
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });
  };

  const handleConfirm = async () => {
    if (!selectedCoord) {
      Alert.alert("Uyarı", "Lütfen harita üzerinde bir konum seçin.");
      return;
    }
    setConfirming(true);
    
    navigation.navigate("HomeMain", { pickedLocation: selectedCoord });
    setConfirming(false);
  };

  const handleReset = () => setSelectedCoord(null);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

    
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            paddingTop:
              Platform.OS === "android" ? StatusBar.currentHeight + 8 : 52,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Konum Seç
          </Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            Haritaya dokunarak konumunuzu işaretleyin
          </Text>
        </View>
        {selectedCoord && (
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Ionicons name="refresh" size={20} color={colors.dangerRed} />
          </TouchableOpacity>
        )}
      </View>

      {/* Harita */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={FACULTY_LOCATION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {/* Fakülte işareti */}
        <Marker
          coordinate={{
            latitude: FACULTY_LOCATION.latitude,
            longitude: FACULTY_LOCATION.longitude,
          }}
          title="Müh. ve Doğa Bilimleri Fakültesi"
          description="Başlangıç Noktası"
          pinColor="#1A3263"
        />

        {/* Kullanıcının seçtiği konum */}
        {selectedCoord && (
          <Marker
            coordinate={selectedCoord}
            title="Seçilen Konum"
            description={`${selectedCoord.latitude.toFixed(5)}, ${selectedCoord.longitude.toFixed(5)}`}
          >
            <View style={styles.selectedMarker}>
              <Ionicons name="location" size={36} color="#e74c3c" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Alt Panel */}
      <View style={[styles.bottomPanel, { backgroundColor: colors.surface }]}>
        {selectedCoord ? (
          <>
            <View style={styles.coordRow}>
              <Ionicons
                name="location"
                size={18}
                color={colors.accentOrange}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.coordText, { color: colors.textPrimary }]}>
                {selectedCoord.latitude.toFixed(5)},{" "}
                {selectedCoord.longitude.toFixed(5)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                { backgroundColor: colors.accentOrange },
              ]}
              onPress={handleConfirm}
              disabled={confirming}
            >
              {confirming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.confirmBtnText}>Konumu Onayla</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.hintRow}>
            <Ionicons
              name="hand-left-outline"
              size={20}
              color={colors.textMuted}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.hintText, { color: colors.textMuted }]}>
              Haritaya dokunarak konumunuzu seçin
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 10,
  },
  backBtn: { padding: 4 },
  resetBtn: { padding: 8 },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  headerSub: { fontSize: 12, marginTop: 2 },
  map: { flex: 1 },
  selectedMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomPanel: {
    padding: 16,
    paddingBottom: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  coordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coordText: { fontSize: 13, fontWeight: "500" },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  hintText: { fontSize: 14 },
});