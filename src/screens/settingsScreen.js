import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppColors } from "../styles/colors.js";
const { width, height } = Dimensions.get("window");

const settingsOptions = [
  {
    id: "1",
    name: "Bildirim Ayarları",
    icon: "notifications-outline",
    color: AppColors.orange,
    bgColor: AppColors.whiteEa,
  },
  {
    id: "2",
    name: "Şifre Değiştir",
    icon: "shield-checkmark-outline",
    color: AppColors.green,
    bgColor: AppColors.whiteEa,
  },
  {
    id: "3",
    name: "Dil Seçenekleri",
    icon: "globe-outline",
    color: AppColors.purple,
    bgColor: AppColors.whiteEa,
  },
  {
    id: "4",
    name: "Karanlık Mod",
    icon: "moon-outline",
    color: AppColors.gray1_0,
    bgColor: AppColors.whiteEa,
  },
  {
    id: "5",
    name: "Yardım ve Destek",
    icon: "help-circle-outline",
    color: AppColors.pink,
    bgColor: AppColors.whiteEa,
  },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Hesap ve Uygulama</Text>

        <View style={styles.card}>
          {settingsOptions.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.listItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.name === "Şifre Değiştir") {
                    navigation.navigate("ChangePassword");
                  } else {
                    console.log(`${item.name} tıklandı`);
                  }
                }}
              >
                <View style={styles.itemLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: item.bgColor },
                    ]}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>
                  <Text
                    style={[styles.itemText, { color: AppColors.black333 }]}
                  >
                    {item.name}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={AppColors.black0_5}
                />
              </TouchableOpacity>
              {index !== settingsOptions.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: { paddingHorizontal: 25, marginTop: 30 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.black333,
    marginTop: 30,
    marginBottom: 15,
  },
  card: {
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: AppColors.white,
    borderRadius: 20,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: AppColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(10),
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(15),
  },
  itemText: { fontSize: 15, color: AppColors.gray8E, fontWeight: "500" },
  separator: {
    height: 1,
    backgroundColor: AppColors.whiteEa,
    marginHorizontal: 15,
  },
});
