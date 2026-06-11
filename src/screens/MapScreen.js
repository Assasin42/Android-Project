import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useRoute, useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { busLocations as localBusLocations } from "../data/busLocations";
import { AppColors } from "../styles/colors";
import { BlurView } from "expo-blur";
import { haversineDistance, findNearestStop } from "../utils/haversine";


const BUS_LINES_COLLECTION = "busLines";

 
const RESERVED_FIELDS = new Set(["id", "name", "time", "routeId", "lineId"]);

function extractStopsFromDoc(docId, docData) {
  const stops = [];

  // --- Yol A: Adlandırılmış map alanı ---
  const mapField =
    docData.stops ??
    docData.duraklar ??
    docData.stations ??
    null;

  if (
    mapField &&
    typeof mapField === "object" &&
    typeof mapField.latitude === "undefined" // GeoPoint'in kendisi değil, map olmalı
  ) {
    Object.entries(mapField).forEach(([stopName, geopoint]) => {
      if (typeof geopoint?.latitude === "number") {
        stops.push({
          id: `${docId}__${stopName}`,
          title: stopName,
          latitude: geopoint.latitude,
          longitude: geopoint.longitude,
        });
      }
    });
    if (stops.length > 0) return stops;
  }

  // --- Yol B: Dokümanın kendisindeki GeoPoint alanları ---
  Object.entries(docData).forEach(([key, value]) => {
    if (
      !RESERVED_FIELDS.has(key) &&
      typeof value?.latitude === "number" &&
      typeof value?.longitude === "number"
    ) {
      stops.push({
        id: `${docId}__${key}`,
        title: key,
        latitude: value.latitude,
        longitude: value.longitude,
      });
    }
  });

  return stops;
}

export default function MapScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const { latitude, longitude } = route.params;

  const [stops, setStops] = useState([]);
  const [nearestResult, setNearestResult] = useState(null); // { stop, distanceMeters }
  const [selectedStop, setSelectedStop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── 1. Durakları Yükle ───────────────────────────────────────────────────
  useEffect(() => {
    loadStops();
  }, []);
useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [navigation]);
useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
  });
  const loadStops = async () => {
    setLoading(true);
    setError(null);

    try {
      // busLines koleksiyonunu oku (rules'da izni var: auth != null)
      const snapshot = await getDocs(collection(db, BUS_LINES_COLLECTION));

      let fetchedStops = [];
      snapshot.forEach((doc) => {
        const stopsFromDoc = extractStopsFromDoc(doc.id, doc.data());
        fetchedStops.push(...stopsFromDoc);
      });

      // Aynı isimli durakları tekrar çıkar (birden fazla busLine varsa)
      const seen = new Set();
      fetchedStops = fetchedStops.filter((stop) => {
        if (seen.has(stop.title)) return false;
        seen.add(stop.title);
        return true;
      });

      if (fetchedStops.length === 0) {
        console.warn("Firestore'dan durak gelmedi, yerel veri kullanılıyor.");
        fetchedStops = localBusLocations.filter(
          (l) => typeof l.latitude === "number"
        );
      }

      setStops(fetchedStops);

      // ─── 2. Haversine ile en yakın durağı bul ────────────────────────────
      const result = findNearestStop(latitude, longitude, fetchedStops);
      setNearestResult(result);
      setSelectedStop(result?.stop ?? null);
    } catch (err) {
      console.error("Durak yüklenirken hata:", err.code, err.message);
      setError(`Firestore: ${err.code ?? err.message}`);

      const fallback = localBusLocations.filter(
        (l) => typeof l.latitude === "number"
      );
      setStops(fallback);
      const result = findNearestStop(latitude, longitude, fallback);
      setNearestResult(result);
      setSelectedStop(result?.stop ?? null);
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. Haritayı en yakın durağa odakla ─────────────────────────────────
  useEffect(() => {
    if (!nearestResult || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: nearestResult.stop.latitude,
        longitude: nearestResult.stop.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  }, [nearestResult]);

  // ─── 4. Seçili durağu HomeScreen'e gönder ────────────────────────────────
  const handleConfirmStop = () => {
    if (!selectedStop) return;
    navigation.navigate("HomeMain", { nearestStop: selectedStop.title });
  };

  const selectedDistance = selectedStop
    ? haversineDistance(
        latitude,
        longitude,
        selectedStop.latitude,
        selectedStop.longitude
      )
    : null;

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Kullanıcı etrafı 500m halkası */}
        <Circle
          center={{ latitude, longitude }}
          radius={500}
          fillColor="rgba(255,140,0,0.08)"
          strokeColor={AppColors.light_orange}
          strokeWidth={1.5}
        />

        {stops.map((stop, index) => {
          const isSelected = selectedStop?.title === stop.title;
          const isNearest = nearestResult?.stop?.title === stop.title;
          return (
            <Marker
              key={stop.id ?? index}
              coordinate={{
                latitude: stop.latitude,
                longitude: stop.longitude,
              }}
              title={stop.title}
              pinColor={
                isSelected
                  ? AppColors.light_orange
                  : isNearest
                  ? "#FFA040"
                  : "#4A90E2"
              }
              onPress={() => setSelectedStop(stop)}
            />
          );
        })}
      </MapView>

      {/* Yükleniyor */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppColors.light_orange} />
          <Text style={styles.loadingText}>Duraklar yükleniyor…</Text>
        </View>
      )}

      {/* Hata bandı */}
      {error && !loading && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠ {error}</Text>
        </View>
      )}

      {/* Alt kart */}
      {!loading && selectedStop && (
        <BlurView intensity={60} tint="dark" style={styles.card}>
          <Text style={styles.cardLabel}>
            {selectedStop.title === nearestResult?.stop?.title
              ? "📍 En Yakın Durak"
              : "🚌 Seçili Durak"}
          </Text>

          <Text style={styles.cardName}>{selectedStop.title}</Text>

          <Text style={styles.cardDistance}>
            ~{selectedDistance?.toLocaleString("tr-TR")} metre uzaklıkta
          </Text>

          {selectedStop.title !== nearestResult?.stop?.title &&
            nearestResult?.stop && (
              <TouchableOpacity
                style={styles.nearestHint}
                onPress={() => setSelectedStop(nearestResult.stop)}
              >
                <Text style={styles.nearestHintText}>
                  En yakın: {nearestResult.stop.title} (
                  {nearestResult.distanceMeters?.toLocaleString("tr-TR")} m) →
                </Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmStop}
          >
            <Text style={styles.confirmButtonText}>Bu Durağı Seç</Text>
          </TouchableOpacity>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  loadingText: { color: "#fff", marginTop: 12, fontSize: 15 },
  errorBanner: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(200,50,50,0.85)",
    borderRadius: 10,
    padding: 10,
  },
  errorText: { color: "#fff", fontSize: 13, textAlign: "center" },
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  cardLabel: {
    color: AppColors.light_orange,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardName: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  cardDistance: { color: "#aaa", fontSize: 14, marginBottom: 14 },
  nearestHint: { marginBottom: 12 },
  nearestHintText: {
    color: AppColors.light_orange,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  confirmButton: {
    backgroundColor: AppColors.light_orange,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});