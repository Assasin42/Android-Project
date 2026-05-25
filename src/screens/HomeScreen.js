

import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import ModalSelect from "../components/modalS";
import Button from "../components/button";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import BusTime from "../components/busTime";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showBus, setShowBus] = useState(false);
  const secButton = () => {
    if (selectedValue == null) alert("Lütfen bir durak seçiniz.");
    else {
      setShowBus(true);

      setSelectedValue(null);
    }
  };
  const route = useRoute();
  const { name } = route.params || {};
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
        <Text style={styles.headerText}>Hoşgeldiniz {name} </Text>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#0000",
    position: "absolute",
    top: 30,
    left: 20,
    fontFamily: "Roboto",
  },
  modalContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonviewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    position: "absolute",
    top: 130,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    borderRadius: 10,
  },

  headerText: {
    color: "#FEF3E2",
    fontSize: 28,
  },
  content: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
});