import { openLanguageSheet } from "../components/LanguageSheet"; // ✅ import edildi
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
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next"; // ✅ eklendi
import { AppColors } from "../styles/colors.js";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};
  const { t } = useTranslation(); // ✅ eklendi

  
  const settingsOptions = [
    {
      id: "notifications",
      name: t("settings.notifications"),
      icon: "notifications-outline",
      color: AppColors.orange,
      bgColor: AppColors.whiteEa,
    },
    {
      id: "changePassword",
      name: t("settings.changePassword"),
      icon: "shield-checkmark-outline",
      color: AppColors.green,
      bgColor: AppColors.whiteEa,
    },
    {
      id: "language",
      name: t("settings.language"),
      icon: "globe-outline",
      color: AppColors.purple,
      bgColor: AppColors.whiteEa,
    },
    {
      id: "darkMode",
      name: t("settings.darkMode"),
      icon: "moon-outline",
      color: AppColors.gray1_0,
      bgColor: AppColors.whiteEa,
    },
    {
      id: "helpSupport",
      name: t("settings.helpSupport"),
      icon: "help-circle-outline",
      color: AppColors.pink,
      bgColor: AppColors.whiteEa,
    },
  ];


  const handlePress = (itemId) => {
    switch (itemId) {
      case "changePassword":
        navigation.navigate("ChangePassword");
        break;
      case "language":
        openLanguageSheet(); 
        break;
      default:
        console.log(`${itemId} tıklandı`);
    }
  };

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
        {/* ✅ Hardcoded Türkçe yerine t() kullanılıyor */}
        <Text style={styles.sectionTitle}>{t("settings.sectionTitle")}</Text>

        <View style={styles.card}>
          {settingsOptions.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.listItem}
                activeOpacity={0.7}
                onPress={() => handlePress(item.id)} 
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
                  <Text style={[styles.itemText, { color: AppColors.black333 }]}>
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