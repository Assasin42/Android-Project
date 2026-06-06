import { useState } from "react";
import { useDispatch } from "react-redux";          
import { logout } from "../redux/authSlice";        
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,                                 
} from "react-native";
import ModalSelect from "../components/modalS";
import Button from "../components/button";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import BusTime from "../components/busTime";
import { useRoute } from "@react-navigation/native";

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showBus, setShowBus] = useState(false);
  const route = useRoute();
  const { name } = route.params || {};
  const { t } = useTranslation();

  const secButton = () => {
    if (selectedValue == null) alert(t('home.selectStop'));
    else {
      setShowBus(true);
      setSelectedValue(null);
    }
  };

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
    <ImageBackground
      source={require("../../assets/guDag.jpeg")}
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={StyleSheet.absoluteFill}
      />
      <BlurView intensity={10} borderRadius={30} style={styles.header}>
        <Text style={styles.headerText}>
          {t('home.welcome')} {name}
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
          <Button label={t('home.select')} theme="primary" onPress={secButton} />
        </View>
        {showBus && <BusTime />}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", flex: 1, alignItems: "center" },
  modalContainer: { alignItems: "center", marginBottom: 20 },
  buttonviewContainer: { alignItems: "center", marginBottom: 20 },
  header: {
    position: "absolute",
    top: 130,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 10,
  },
  headerText: { color: "#FEF3E2", fontSize: 28 },
  content: { marginTop: 10, width: "100%", alignItems: "center" },
});