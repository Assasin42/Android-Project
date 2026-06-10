import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import DrawerButton from "../components/drawerButton";

import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import ModalSelect from "../components/modalS";
import Button from "../components/button";
import { LinearGradient } from "expo-linear-gradient";
import LocationButton from "../components/locationButton";
import { BlurView } from "expo-blur";
import BusTime from "../components/busTime";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75;

export default function HomeScreen({ navigation }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showBus, setShowBus] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const { t } = useTranslation();
  const route = useRoute();
  const user = useSelector((state) => state.auth.user);
  const { colors, isDark } = useTheme();  // ✅ isDark de alınıyor
  const styles = createStyles(colors);

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

  const options = [
    { label: t("home.stops.semaDogan"),     value: "Sema Doğan" },
    { label: t("home.stops.hospital"),      value: "Hastane" },
    { label: t("home.stops.university"),    value: "Üniversite" },
    { label: t("home.stops.market"),        value: "Çarşı" },
    { label: t("home.stops.busStation"),    value: "Otogar" },
    { label: t("home.stops.zeynepAna"),     value: "Zeynep Ana" },
    { label: t("home.stops.tepeYurt"),      value: "Tepe Yurt" },
    { label: t("home.stops.teachersHouse"), value: "Öğretmen Evi" },
  ];

  
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
        </View>

        <View style={styles.buttonviewContainer}>
          <LocationButton
            label={t("home.selectFromLocation")}
            theme="primary"
            onPress={() => navigation.navigate("MapScreen")}
          />
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

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.getParent()?.navigate("Profile");
          }}
        >
          <Text style={styles.drawerItemText}>👤 {t("home.profile")}</Text>
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
      top: 240,
      left: 20,
      right: 20,
      backgroundColor: "rgba(0, 0, 0, 0.43)",
      padding: 10,
      borderRadius: 10,
    },
    headerText: {
      color: "#ffffff",
      fontSize: 28,
    },
    content: {
      marginTop: 10,
      width: "100%",
      alignItems: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 100,
    },
    // ✅ Drawer artık colors kullanıyor
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
    drawerItem: {
      backgroundColor: colors.inputBg,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },
    drawerItemText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "600",
    },
  });