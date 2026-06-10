import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSelector } from "react-redux";
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
import GpsButton from "../components/GpsButton";
import { LinearGradient } from "expo-linear-gradient";
import LocationButton from "../components/locationButton";
import { BlurView } from "expo-blur";
import BusTime from "../components/busTime";
import { useRoute } from "@react-navigation/native";
import { AppColors } from "../styles/colors";
import * as Location from "expo-location";
import { busLocations } from "../data/busLocations";
export default function HomeScreen({ navigation }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [showBus, setShowBus] = useState(false);
  const route = useRoute();
  useEffect(() => {
    if (route.params?.nearestStop) {
      setSelectedValue(route.params?.nearestStop);
    }
  }, [route.params?.nearestStop]);

  const openMap = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Konum İzni Gerekli");
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      navigation.navigate("MapScreen", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch {
      const location = await Location.getLastKnownPositionAsync({});
      if (location) {
        navigation.navigate("MapScreen", {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        navigation.navigate("MapScreen", {
          latitude: 40.4378,
          longitude: 39.5172,
        });
      }
    }
  };
  const secButton = () => {
    if (selectedValue == null) alert("Lütfen bir durak seçiniz.");
    else {
      setShowBus(true);

      setSelectedValue(null);
    }
  };
  const options = busLocations.map((location) => ({
    label: location.title,
    value: location.title,
  }));
  const user = useSelector((state) => state.auth.user);
  return (
    <ImageBackground
      source={require("../../assets/guDag.jpeg")}
      style={styles.container}
    >
      <LinearGradient
        colors={[AppColors.black0_6, "transparent"]}
        style={StyleSheet.absoluteFill}
      />

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
    color: AppColors.black,
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
  gpsbutton: {
    position: "absolute",
    bottom: 90,
    right: 10,
  },
});
