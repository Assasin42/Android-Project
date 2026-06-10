import { openLanguageSheet } from "../components/LanguageSheet";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import useTheme from "../hooks/useTheme";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params || {};
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const settingsOptions = [
    {
      id: "notifications",
      name: t("settings.notifications"),
      icon: "notifications-outline",
      color: colors.accentOrange,
      bgColor: colors.surface,
    },
    {
      id: "changePassword",
      name: t("settings.changePassword"),
      icon: "shield-checkmark-outline",
      color: colors.successGreen,
      bgColor: colors.surface,
    },
    {
      id: "language",
      name: t("settings.language"),
      icon: "globe-outline",
      color: colors.purple,
      bgColor: colors.surface,
    },
    {
      id: "darkMode",
      name: t("settings.darkMode"),
      icon: "moon-outline",
      color: colors.primaryBlue,
      bgColor: colors.surface,
    },
    {
      id: "helpSupport",
      name: t("settings.helpSupport"),
      icon: "help-circle-outline",
      color: colors.pink,
      bgColor: colors.surface,
    },
  ];

  const handlePress = (itemId) => {
    switch (itemId) {
      case "notifications":
        // Bildirim Ayarları ekranına yönlendiriyoruz
        navigation.navigate("NotificationSettings");
        break;
      case "changePassword":
        navigation.navigate("ChangePassword");
        break;
      case "language":
        openLanguageSheet();
        break;
      case "darkMode":
        dispatch(toggleTheme());
        break;
      case "helpSupport":
        // Yardım ve Destek ekranına yönlendiriyoruz
        navigation.navigate("HelpSupport");
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
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
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
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>

                {item.id === "darkMode" ? (
                  <Switch
                    value={isDark}
                    onValueChange={() => dispatch(toggleTheme())}
                    trackColor={{
                      false: colors.iconMuted,
                      true: colors.primaryBlue,
                    }}
                    thumbColor={isDark ? colors.accentOrange : "#f4f3f4"}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.iconMuted}
                  />
                )}
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

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    content: {
      paddingHorizontal: 25,
      marginTop: 30,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
      marginTop: 30,
      marginBottom: 15,
    },
    card: {
      width: width * 0.9,
      alignSelf: "center",
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 10,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
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
    itemLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconCircle: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      justifyContent: "center",
      alignItems: "center",
      marginRight: scale(15),
    },
    itemText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    separator: {
      height: 1,
      backgroundColor: colors.separator,
      marginHorizontal: 15,
    },
  });