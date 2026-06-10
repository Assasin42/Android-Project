import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    if (user?.photoURL) setImageUri(user.photoURL);
  }, [user]);

  const handleOpenCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        t("profile.cameraPermRequired"),
        t("profile.cameraPermMessage")
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      alert(t("profile.photoUpdateSuccess"));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.log(error);
      alert(t("profile.logoutError"));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteDoc(doc(db, "users", currentUser.uid));
        await deleteUser(currentUser);
      }
      dispatch(logout());
      alert(t("profile.deleteSuccess"));
    } catch (error) {
      console.log(error);
      if (error.code === "auth/requires-recent-login") {
        alert(t("profile.reauthRequired"));
      } else {
        alert(t("profile.deleteError"));
      }
    }
  };

  const menuItems = [
    { key: "notifications", label: t("profile.notificationSettings") },
    { key: "about",         label: t("profile.about") },
    { key: "feedback",      label: t("profile.feedback") },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={colors.isDark ? "light" : "dark"} />

      {/* Üst bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Fotoğraf bölümü */}
        <View style={styles.cameraSection}>
          {!imageUri ? (
            <TouchableOpacity
              style={styles.primaryCaptureButton}
              onPress={handleOpenCamera}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color={colors.accentOrange}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryCaptureText}>
                {t("profile.takePhoto")}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.avatarContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.avatarImage} />
              </View>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleOpenCamera}
              >
                <Ionicons
                  name="refresh-outline"
                  size={18}
                  color={colors.accentOrange}
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.updateButtonText}>
                  {t("profile.updatePhoto")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Kullanıcı bilgisi */}
        <View style={styles.header}>
          <Text style={styles.userName}>
            {user?.displayName || t("profile.defaultUser")}
          </Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>

        {/* Menü */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.key} style={styles.menuItem}>
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.iconMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Çıkış butonu */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.dangerRed}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.logoutText}>{t("profile.logout")}</Text>
          </TouchableOpacity>
        </View>

        {/* Hesap sil butonu */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={colors.dangerRed}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.deleteText}>{t("profile.deleteAccount")}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,      // ✅ #fff / #000
    },

    // --- Üst bar ---
    topBar: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 5,
      justifyContent: "center",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,         // ✅ #f2f2f7 / #1c1c1e
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: colors.isDark ? 0.4 : 0.1,
      shadowRadius: 2,
    },

    // --- Kamera bölümü ---
    cameraSection: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
      paddingHorizontal: 25,
    },
    primaryCaptureButton: {
      flexDirection: "row",
      backgroundColor: colors.accentOrangeLight, // ✅ #FEF3E2 / #3d2400
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 25,
      alignItems: "center",
      elevation: 3,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    primaryCaptureText: {
      color: colors.accentOrange,               // ✅ turuncu — her iki temada uyumlu
      fontSize: 16,
      fontWeight: "bold",
    },
    avatarContainer: {
      alignItems: "center",
    },
    imageWrapper: {
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 3,
      borderColor: colors.accentOrange,         // ✅ #FF9500
      overflow: "hidden",
      marginBottom: 12,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    updateButton: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.accentOrange,         // ✅ #FF9500
      alignItems: "center",
      backgroundColor: colors.accentOrangeLight,
    },
    updateButtonText: {
      color: colors.accentOrange,
      fontSize: 14,
      fontWeight: "600",
    },

    // --- Başlık (kullanıcı adı) ---
    header: {
      paddingHorizontal: 25,
      paddingTop: 5,
      paddingBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,      // ✅ #EAEAEA / #3a3a3c
      alignItems: "center",
    },
    userName: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.textPrimary,                // ✅ #000 / #fff
    },
    userEmail: {
      fontSize: 15,
      color: colors.textMuted,                  // ✅ #999 / #8E8E93
      marginTop: 4,
    },

    // --- Menü ---
    menuSection: {
      paddingVertical: 10,
      marginHorizontal: 20,
      marginTop: 15,
      backgroundColor: colors.surface,          // ✅ #f2f2f7 / #1c1c1e
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.surfaceBorder,        // ✅ #EAEAEA / #3a3a3c
    },
    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.separator,      // ✅ #EAEAEA / #3a3a3c
    },
    menuText: {
      fontSize: 16,
      color: colors.textPrimary,                // ✅ #000 / #fff
      fontWeight: "500",
    },

    // --- Footer butonlar ---
    footer: {
      paddingHorizontal: 20,
      marginTop: 12,
    },
    logoutButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.surface,          // ✅ #f2f2f7 / #1c1c1e
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    logoutText: {
      color: colors.dangerRed,                  // ✅ #e74c3c / #ff453a
      fontSize: 16,
      fontWeight: "600",
    },
    deleteButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.isDark
        ? "rgba(255,69,58,0.12)"                // koyu kırmızı şeffaf — dark
        : "rgba(231,76,60,0.08)",               // açık kırmızı şeffaf — light
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.dangerRed + "40",     // %25 opaklık
    },
    deleteText: {
      color: colors.dangerRed,                  // ✅ #e74c3c / #ff453a
      fontSize: 16,
      fontWeight: "600",
    },
  });