import { useState, useRef } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
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
import { AppColors } from "../styles/colors";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.75; 

export default function HomeScreen({ navigation }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showBus, setShowBus] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

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
    if (selectedValue == null) alert("Lütfen bir durak seçiniz.");
    else {
      setShowBus(true);
      selectedValue(null);
    }
  };

  const route = useRoute();
  const user = useSelector((state) => state.auth.user);
  
  const options = [
    { label: "Sema Doğan", value: "Sema Doğan" },
    { label: "Hastane", value: "Hastane" },
    { label: "Üniversite", value: "Üniversite" },
    { label: "Çarşı", value: "Çarşı" },
    { label: "Otogar", value: "Otogar" },
    { label: "Zeynep Ana", value: "Zeynep Ana" },
    { label: "Tepe Yurt", value: "Tepe Yurt" },
    { label: "Öğretmen Evi", value: "Öğretmen Evi" },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* ANA EKRAN İÇERİĞİ */}
      <ImageBackground
        source={require("../../assets/guDag.jpeg")}
        style={styles.container}
      >
        <LinearGradient
          colors={[AppColors.black0_6, "transparent"]}
          style={StyleSheet.absoluteFill}
        />

        {/* DÜZELTİLDİ: Stil menuButton olarak değiştirildi, böylece sol üste sabitlendi */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={toggleDrawer}
          activeOpacity={0.7}
        >
         {/* ✅ YENİ DÜZELTİLMİŞ BUTONUMUZ */}
  <DrawerButton 
    label="☰" 
    theme="secondary" 
    onPress={toggleDrawer} 
  />
        </TouchableOpacity>

        <BlurView intensity={10} borderRadius={30} style={styles.header}>
          <Text style={styles.headerText}>
            Hoşgeldiniz {user?.displayName || "Yolcu"}
          </Text>
        </BlurView>

        <View style={styles.content}>
          <View style={styles.modalContainer}>
            <ModalSelect
              options={options}
              value={selectedValue}
              onSelect={(value) => setSelectedValue(value)}
            />
          </View>

          <View style={styles.buttonviewContainer}>
            <Button label="Seç" theme="primary" onPress={secButton} />
          </View>
          {showBus && <BusTime />}
        </View>
        <View style={styles.buttonviewContainer}>
          <LocationButton
            label="Konumdan Seç"
            theme="primary"
            onPress={() => navigation.navigate("MapScreen")}
          />
        </View>
      </ImageBackground>

      {/* ARKA PLAN KARARTMASI */}
      {isDrawerOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleDrawer} 
        />
      )}

      {/* AÇILIR PANEL (DRAWER) */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Menü</Text>
        </View>
        
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.getParent()?.navigate("Profile");
          }}
        >
          <Text style={styles.drawerItemText}>👤 Profile</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    top: 60, // Çizgilerin yukarı kaymaması için ideal güvenli alan boşluğu
    left: 25,
    zIndex: 99, // Katman sırası en üste çekildi
    elevation: 5, // Android dokunma hassasiyeti için eklendi
    padding: 10,
  },
  menuIcon: {
    fontSize: 34, // İkon boyutu daha net okunması için hafif büyütüldü
    color: '#fff',
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 240,
    left: 20,
    right: 20,
    backgroundColor: AppColors.black0_3,
    padding: 10,
    borderRadius: 10,
  },
  headerText: {
    color: AppColors.light_orange,
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
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#1c1c1e", 
    zIndex: 101,
    paddingTop: 80,
    paddingHorizontal: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3c",
    paddingBottom: 15,
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff9500", 
  },
  drawerItem: {
    backgroundColor: "#2c2c2e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  drawerItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});