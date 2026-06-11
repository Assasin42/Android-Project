import React, { useRef, useEffect, useState, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { busLocations } from "../data/busLocations";
import useTheme from "../hooks/useTheme";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

// Marker renkleri
const MARKER_COLORS = {
  start: "#4CAF50",
  stop: "#FF9500",
  selected: "#e74c3c",
  userLocation: "#1A3263",
};

export default function MapScreen({ navigation }) {
  const route = useRoute();
  const mapRef = useRef(null);
  const { colors, isDark } = useTheme();
  const { latitude, longitude } = route.params || {};

  // State
  const [searchText, setSearchText] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showStopList, setShowStopList] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Animasyonlar
  const searchAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const gumusHane = {
    latitude: 40.4378,
    longitude: 39.5172,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Rota için tüm koordinatlar
  const routeCoordinates = busLocations.map((loc) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
  }));

  // Tab bar'ı gizle/göster
  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: "none" } });
    }
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            backgroundColor: colors.black0_8 || "rgba(0,0,0,0.8)",
            position: "absolute",
            elevation: 0,
            borderTopWidth: 0,
          },
        });
      }
    };
  }, [navigation, colors]);

  // Kullanıcı konumunu al
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch (e) {
        // Konum alınamazsa devam et
      }
    };
    getLocation();
  }, []);

  // Gelen koordinata animasyonlu git
  useEffect(() => {
    if (latitude && longitude) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }, 600);
    }
  }, [latitude, longitude]);

  // Arama filtresi
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredLocations([]);
    } else {
      const filtered = busLocations.filter((loc) =>
        loc.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchText]);

  // Arama animasyonu
  const toggleSearch = useCallback(() => {
    const toValue = showSearch ? 0 : 1;
    setShowSearch(!showSearch);
    if (!showSearch) setSearchText("");
    Animated.spring(searchAnim, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [showSearch, searchAnim]);

  // Durak listesi animasyonu
  const toggleStopList = useCallback(() => {
    const toValue = showStopList ? 0 : 1;
    setShowStopList(!showStopList);
    Animated.spring(listAnim, {
      toValue,
      useNativeDriver: false,
      tension: 80,
      friction: 8,
    }).start();
  }, [showStopList, listAnim]);

  // Durağa git ve seç
  const goToStop = useCallback(
    (stop) => {
      setSelectedStop(stop);
      setSearchText("");
      setFilteredLocations([]);
      setShowStopList(false);
      mapRef.current?.animateToRegion(
        {
          latitude: stop.latitude,
          longitude: stop.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        800
      );
    },
    []
  );

  // Kullanıcı konumuna git
  const goToUserLocation = useCallback(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800
      );
    }
  }, [userLocation]);

  // Tüm güzergahı göster
  const fitAllMarkers = useCallback(() => {
    mapRef.current?.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 80, right: 40, bottom: 120, left: 40 },
      animated: true,
    });
  }, [routeCoordinates]);

  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 120],
  });

  const listHeight = listAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.4],
  });

  const mapStyle = isDark
    ? [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      {/* Harita */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={gumusHane}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={() => {
          setSelectedStop(null);
          setShowLegend(false);
        }}
      >
        {/* Güzergah Çizgisi */}
        {showRoute && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.accentOrange || "#FF9500"}
            strokeWidth={3}
            lineDashPattern={[1]}
          />
        )}

        {/* Durak Marker'ları */}
        {busLocations.map((location) => {
          const isSelected = selectedStop?.id === location.id;
          return (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.title}
              description={location.description || "Otobüs Durağı"}
              onPress={() => setSelectedStop(location)}
            >
              <View
                style={[
                  styles.markerContainer,
                  isSelected && styles.markerSelected,
                  {
                    backgroundColor: isSelected
                      ? MARKER_COLORS.selected
                      : location.isStart
                      ? MARKER_COLORS.start
                      : MARKER_COLORS.stop,
                    borderColor: isSelected ? "#fff" : "transparent",
                    borderWidth: isSelected ? 2 : 0,
                    transform: [{ scale: isSelected ? 1.3 : 1 }],
                  },
                ]}
              >
                {location.isStart ? (
                  <Ionicons name="flag" size={14} color="#fff" />
                ) : (
                  <FontAwesome5 name="bus" size={11} color="#fff" solid />
                )}
              </View>
              {isSelected && (
                <View
                  style={[
                    styles.markerPin,
                    { borderTopColor: MARKER_COLORS.selected },
                  ]}
                />
              )}
            </Marker>
          );
        })}
      </MapView>

      {/* Üst Bar */}
      <View style={[styles.topBar, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 52 }]}>
        {/* Geri Butonu */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surface }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Arama Alanı */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              width: searchWidth,
              backgroundColor: colors.surface,
              overflow: "hidden",
            },
          ]}
        >
          {showSearch && (
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Durak ara..."
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          )}
        </Animated.View>

        {/* Arama Butonu */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: showSearch
                ? colors.accentOrange || "#FF9500"
                : colors.surface,
            },
          ]}
          onPress={toggleSearch}
        >
          <Ionicons
            name={showSearch ? "close" : "search"}
            size={22}
            color={showSearch ? "#fff" : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Arama Sonuçları */}
      {filteredLocations.length > 0 && (
        <View
          style={[
            styles.searchResults,
            {
              top:
                Platform.OS === "android"
                  ? StatusBar.currentHeight + 68
                  : 112,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id.toString()}
            style={{ maxHeight: 200 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.searchResultItem,
                  { borderBottomColor: colors.separator },
                ]}
                onPress={() => goToStop(item)}
              >
                <Ionicons
                  name={item.isStart ? "flag" : "bus"}
                  size={16}
                  color={
                    item.isStart
                      ? MARKER_COLORS.start
                      : MARKER_COLORS.stop
                  }
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={[styles.searchResultText, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Seçili Durak Bilgi Kartı */}
      {selectedStop && (
        <View
          style={[
            styles.stopCard,
            { backgroundColor: colors.surface },
          ]}
        >
          <View style={styles.stopCardHeader}>
            <View
              style={[
                styles.stopIconBadge,
                {
                  backgroundColor: selectedStop.isStart
                    ? MARKER_COLORS.start
                    : MARKER_COLORS.stop,
                },
              ]}
            >
              {selectedStop.isStart ? (
                <Ionicons name="flag" size={18} color="#fff" />
              ) : (
                <FontAwesome5 name="bus" size={14} color="#fff" solid />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[styles.stopCardTitle, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {selectedStop.title}
              </Text>
              {selectedStop.description && (
                <Text
                  style={[
                    styles.stopCardDesc,
                    { color: colors.textMuted },
                  ]}
                >
                  {selectedStop.description}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setSelectedStop(null)}
              style={styles.closeCardBtn}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={[styles.stopCardDivider, { backgroundColor: colors.separator }]} />
          <View style={styles.stopCardCoords}>
            <Ionicons
              name="location"
              size={13}
              color={colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.stopCardCoordsText, { color: colors.textMuted }]}>
              {selectedStop.latitude.toFixed(5)},{" "}
              {selectedStop.longitude.toFixed(5)}
            </Text>
            <Text
              style={[styles.stopCardIndex, { color: colors.accentOrange || "#FF9500" }]}
            >
              Durak #{selectedStop.id}
            </Text>
          </View>
        </View>
      )}

      {/* Durak Listesi Paneli */}
      <Animated.View
        style={[
          styles.stopListPanel,
          {
            height: listHeight,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <FlatList
          data={busLocations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.stopListItem,
                selectedStop?.id === item.id && {
                  backgroundColor: colors.accentOrangeLight || "#FEF3E2",
                },
                { borderBottomColor: colors.separator },
              ]}
              onPress={() => goToStop(item)}
            >
              <View
                style={[
                  styles.stopListIcon,
                  {
                    backgroundColor: item.isStart
                      ? MARKER_COLORS.start
                      : MARKER_COLORS.stop,
                  },
                ]}
              >
                {item.isStart ? (
                  <Ionicons name="flag" size={12} color="#fff" />
                ) : (
                  <Text style={styles.stopListNumber}>{item.id}</Text>
                )}
              </View>
              <Text
                style={[styles.stopListText, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      {/* Sağ Taraf Araçlar */}
      <View style={styles.rightControls}>
        {/* Konum Butonu */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surface, marginBottom: 8 }]}
          onPress={goToUserLocation}
        >
          <Ionicons
            name="locate"
            size={22}
            color={colors.primaryBlue || "#1A3263"}
          />
        </TouchableOpacity>

        {/* Tüm Güzergahı Gör */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surface, marginBottom: 8 }]}
          onPress={fitAllMarkers}
        >
          <Ionicons
            name="expand-outline"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Rota Göster/Gizle */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: showRoute
                ? colors.accentOrange || "#FF9500"
                : colors.surface,
              marginBottom: 8,
            },
          ]}
          onPress={() => setShowRoute(!showRoute)}
        >
          <Ionicons
            name="git-branch-outline"
            size={22}
            color={showRoute ? "#fff" : colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Legend */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.surface }]}
          onPress={() => setShowLegend(!showLegend)}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Legend Kartı */}
      {showLegend && (
        <View
          style={[styles.legendCard, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.legendTitle, { color: colors.textPrimary }]}>
            Harita Göstergeleri
          </Text>
          <View style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: MARKER_COLORS.start }]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Başlangıç Noktası
            </Text>
          </View>
          <View style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: MARKER_COLORS.stop }]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Otobüs Durağı
            </Text>
          </View>
          <View style={styles.legendRow}>
            <View
              style={[styles.legendDot, { backgroundColor: MARKER_COLORS.selected }]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Seçili Durak
            </Text>
          </View>
          <View style={styles.legendRow}>
            <View
              style={[
                styles.legendLine,
                { backgroundColor: colors.accentOrange || "#FF9500" },
              ]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Güzergah
            </Text>
          </View>
          <Text style={[styles.legendCount, { color: colors.textMuted }]}>
            Toplam {busLocations.length} durak
          </Text>
        </View>
      )}

      {/* Alt Bar - Durak Listesi Butonu */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.stopListToggle,
            {
              backgroundColor: showStopList
                ? colors.accentOrange || "#FF9500"
                : colors.surface,
            },
          ]}
          onPress={toggleStopList}
        >
          <Ionicons
            name={showStopList ? "chevron-down" : "list"}
            size={18}
            color={showStopList ? "#fff" : colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.stopListToggleText,
              { color: showStopList ? "#fff" : colors.textPrimary },
            ]}
          >
            {showStopList ? "Kapat" : `Tüm Duraklar (${busLocations.length})`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Üst Bar
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 100,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchContainer: {
    height: 44,
    borderRadius: 22,
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    height: "100%",
  },

  // Arama Sonuçları
  searchResults: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 99,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchResultText: {
    fontSize: 14,
    flex: 1,
  },

  // Marker
  markerContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  markerSelected: {
    elevation: 6,
    shadowOpacity: 0.5,
  },
  markerPin: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    alignSelf: "center",
    marginTop: -2,
  },

  // Seçili Durak Kartı
  stopCard: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 50,
  },
  stopCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stopCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  stopCardDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  closeCardBtn: {
    padding: 4,
  },
  stopCardDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  stopCardCoords: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopCardCoordsText: {
    fontSize: 11,
    flex: 1,
  },
  stopCardIndex: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Sağ Kontroller
  rightControls: {
    position: "absolute",
    right: 16,
    top: "45%",
    zIndex: 50,
  },

  // Legend
  legendCard: {
    position: "absolute",
    right: 68,
    top: "42%",
    borderRadius: 12,
    padding: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    minWidth: 170,
    zIndex: 60,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  legendCount: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "right",
  },

  // Durak Listesi Paneli
  stopListPanel: {
    position: "absolute",
    bottom: 64,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 40,
  },
  stopListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stopListIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stopListNumber: {
    fontSize: 9,
    color: "#fff",
    fontWeight: "700",
  },
  stopListText: {
    fontSize: 14,
    flex: 1,
  },

  // Alt Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  stopListToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stopListToggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
});