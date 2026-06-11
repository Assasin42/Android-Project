import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import DrawerButton from "../components/drawerButton";
import GpsButton from "../components/GpsButton"; 
import * as Location from "expo-location";       
import MapView, { Marker } from "react-native-maps"; // 1. Harita bileşenleri eklendi

import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import ModalSelect from "../components/modalS";
import { busLocations } from "../data/busLocations";
import Button from "../components/button";
import { LinearGradient } from "expo-linear-gradient";
import LocationButton from "../components/locationButton";
import { BlurView } from "expo-blur";
import BusTime from "../components/busTime";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

export default function HomeScreen({ navigation }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [firebasePhoto, setFirebasePhoto] = useState(null);
  const [showBus, setShowBus] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 2. Önizleme haritası için konum state'i (Varsayılan olarak Gümüşhane koordinatları ayarlandı)
  const [previewRegion, setPreviewRegion] = useState({
    latitude: 40.4378,
    longitude: 39.5172,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const { t } = useTranslation();
  const route = useRoute();
  const user = useSelector((state) => state.auth.user);
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  // 3. Uygulama açıldığında veya sayfa odaklandığında önizleme konumunu sessizce güncelle
  useFocusEffect(
    useCallback(() => {
      async function getSilentLocation() {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            setPreviewRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            });
          }
        } catch (error) {
          console.log("Önizleme konum güncelleme hatası:", error);
        }
      }
      getSilentLocation();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (route.params?.nearestStop) {
        setSelectedValue(route.params.nearestStop);
        navigation.setParams({ nearestStop: undefined }); 
      }
    }, [route.params?.nearestStop])
  );

  const openMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t("home.locationPermission"));
        return;
      }

      let enabled = false;
      try {
        enabled = await Location.hasServicesEnabledAsync();
      } catch (e) {}
      if (!enabled) {
        Alert.alert(t("home.enableLocation"));
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Büyük haritaya giderken state'teki önizlemeyi de güncel tutalım
      setPreviewRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      });

      navigation.navigate("MapScreen", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert(t("home.locationError"), error.message);
    }
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    } else {
      setIsDrawerOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const secButton = () => {
    if (selectedValue == null) alert(t("home.noStop"));
    else {
      setShowBus(true);
      setSelectedValue(null);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("home.logout"),
      t("home.logoutConfirm"),
      [
        { text: t("home.cancel"), style: "cancel" },
        {
          text: t("home.logout"),
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              console.log(t("home.logoutError"), error);
            }
          },
        },
      ]
    );
  };

  const options = busLocations.map((location) => ({
    label: location.title,
    value: location.title,
  }));

  const gradientColors = isDark
    ? ["rgba(0,0,0,1)", "rgba(0,0,0,0.2)"]
    : ["rgba(0,0,0,0.4)", "transparent"];

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/guDag.jpeg")}
        style={styles.container}
      >
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFill}
        />

        <TouchableOpacity
          style={styles.menuButton}
          onPress={toggleDrawer}
          activeOpacity={0.7}
        >
          <DrawerButton label="☰" theme="secondary" onPress={toggleDrawer} />
        </TouchableOpacity>

        <BlurView intensity={10} borderRadius={30} style={styles.header}>
          <Text style={styles.headerText}>
            {t("home.welcome")}{" "}
            {user?.displayName || t("home.passenger")}
          </Text>
        </BlurView>

        <View style={styles.content}>
          <View style={styles.modalContainer}>
            <ModalSelect
              options={options}
              value={selectedValue}
              onSelect={(value) => setSelectedValue(value)}
              placeholder={t("home.selectStopPlaceholder")}
            />
          </View>

          <View style={styles.buttonviewContainer}>
            <Button
              label={t("home.select")}
              theme="primary"
              onPress={secButton}
            />
          </View>

          {showBus && <BusTime />}

          {/* 4. Konum Önizleme Kartı (Harita) */}
          <TouchableOpacity 
            style={styles.mapPreviewCard} 
            activeOpacity={0.9}
            onPress={openMap} // Üzerine tıklanınca tam ekran haritaya atsın
          >
            <MapView
              style={styles.miniMap}
              region={previewRegion}
              scrollEnabled={false} // Kart formunda kalması için el hareketlerini kapatıyoruz
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker 
                coordinate={{ 
                  latitude: previewRegion.latitude, 
                  longitude: previewRegion.longitude 
                }} 
                pinColor={colors.accentOrange || "red"}
              />
            </MapView>
            <View style={styles.mapOverlayLabel}>
              <Ionicons name="map-outline" size={14} color="#fff" style={{ marginRight: 5 }} />
              <Text style={styles.mapOverlayText}>Konumunu Önizlemek İçin Tıkla</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonviewContainer}>
          <LocationButton
            label={t("home.selectFromLocation")}
            theme="primary"
            onPress={() =>
              navigation.navigate("MapScreen", {
                latitude: 40.4378,
                longitude: 39.5172,
              })
            }
          />
        </View>

        <View style={styles.gpsbutton}>
          <GpsButton onPress={openMap} />
        </View>
      </ImageBackground>

      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        />
      )}

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>{t("home.menu")}</Text>
        </View>

        <View style={styles.drawerPhotoContainer}>
          <TouchableOpacity
            onPress={() => {
              toggleDrawer();
              navigation.navigate("CameraScreen");
            }}
            style={styles.drawerImageWrapper}
          >
            {firebasePhoto ? (
              <Image
                source={{ uri: firebasePhoto }}
                style={styles.drawerImage}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Ionicons
                  name="person"
                  size={40}
                  color={colors.textSecondary}
                />
              </View>
            )}
            <View style={styles.cameraIconOverlay}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.drawerUserName}>
            {user?.displayName || t("home.passenger")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate("Profile");
          }}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={colors.textPrimary}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.drawerItemText}>{t("home.profile")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.getParent()?.navigate("Ayarlar");
          }}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={colors.textPrimary}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.drawerItemText}>{t("home.settings")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            handleLogout();
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.dangerRed}
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.drawerItemText, { color: colors.dangerRed }]}>
            {t("home.logout")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      flex: 1,
      alignItems: "center",
    },
    modalContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    buttonviewContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    menuButton: {
      position: "absolute",
      top: 60,
      left: 25,
      zIndex: 99,
      elevation: 5,
      padding: 10,
    },
    header: {
      position: "absolute",
      top: 60,
      left: 100,
      right: 40,
      backgroundColor: "rgba(0, 0, 0, 0.43)",
      padding: 10,
      borderRadius: 10,
    },
    headerText: {
      color: "#ffffff",
      fontSize: 28,
    },
    content: {
      marginTop: 80, // Harita kartına yer açmak için üst mesafeyi hafif açtık
      width: "100%",
      alignItems: "center",
    },
    
    // 5. Harita Önizleme Stilleri Eklendi
    mapPreviewCard: {
      width: width * 0.85,
      height: 140,
      borderRadius: 20,
      overflow: "hidden",
      marginVertical: 15,
      borderWidth: 2,
      borderColor: colors.surfaceBorder || "rgba(255,255,255,0.2)",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    miniMap: {
      width: "100%",
      height: "100%",
    },
    mapOverlayLabel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingVertical: 6,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    mapOverlayText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },

    gpsbutton: {
      position: "absolute",
      bottom: 90,
      right: 10,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 100,
    },
    drawer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: DRAWER_WIDTH,
      backgroundColor: colors.surface,
      zIndex: 101,
      paddingTop: 80,
      paddingHorizontal: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    drawerHeader: {
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
      paddingBottom: 15,
      marginBottom: 20,
    },
    drawerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.accentOrange,
    },
    drawerPhotoContainer: {
      alignItems: "center",
      marginBottom: 25,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
    },
    drawerImageWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: "hidden",
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.accentOrange,
      position: "relative",
    },
    drawerImage: {
      width: "100%",
      height: "100%",
    },
    cameraIconOverlay: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.accentOrange,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.surface,
    },
    placeholderAvatar: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.inputBg,
    },
    drawerUserName: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
    drawerItem: {
      backgroundColor: colors.inputBg,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    drawerItemText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
  });