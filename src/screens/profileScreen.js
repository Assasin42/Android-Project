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
import { AppColors } from "../styles/colors";
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

  // ✅ Menü öğeleri: hardcoded Türkçe yerine t() kullanıyor
  const menuItems = [
    { key: "notifications", label: t("profile.notificationSettings") },
    { key: "about",         label: t("profile.about") },
    { key: "feedback",      label: t("profile.feedback") },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cameraSection}>
          {!imageUri ? (
            <TouchableOpacity
              style={styles.primaryCaptureButton}
              onPress={handleOpenCamera}
            >
              <Ionicons
                name="camera-outline"
                size={24}
                color={AppColors.black}
                style={{ marginRight: 8 }}
              />
              {/* ✅ "Yeni Fotoğraf Çek" → t() */}
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
                  color={AppColors.light_orange}
                  style={{ marginRight: 5 }}
                />
                {/* ✅ "Fotoğrafı Güncelle" → t() */}
                <Text style={styles.updateButtonText}>
                  {t("profile.updatePhoto")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.header}>
          {/* ✅ "Kullanıcı" fallback → t() */}
          <Text style={styles.userName}>
            {user?.displayName || t("profile.defaultUser")}
          </Text>
          <Text style={styles.userPhone}>{user?.email || ""}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.key} style={styles.menuItem}>
              <Text style={styles.menuText}>{item.label}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          {/* ✅ "Oturumu Kapat" → t() */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>{t("profile.logout")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          {/* ✅ "Hesabı Sil" → t() */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.logoutText}>{t("profile.deleteAccount")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 5,
    justifyContent: "center",
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
  cameraSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingHorizontal: 25,
  },
  primaryCaptureButton: {
    flexDirection: "row",
    backgroundColor: AppColors.light_orange,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primaryCaptureText: {
    color: AppColors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: { alignItems: "center" },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: AppColors.light_orange,
    overflow: "hidden",
    marginBottom: 12,
  },
  avatarImage: { width: "100%", height: "100%" },
  updateButton: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: AppColors.light_orange,
    alignItems: "center",
  },
  updateButtonText: {
    color: AppColors.light_orange,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 5,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  userName: { fontSize: 26, fontWeight: "bold", color: colors.textPrimary },
  userPhone: { fontSize: 15, color: colors.textMuted, marginTop: 4 },
  menuSection: { paddingVertical: 10 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 16, color: colors.textPrimary, fontWeight: "500" },
  arrow: { fontSize: 24, color: AppColors.gray2 },
  footer: { paddingHorizontal: 25, marginTop: 5 },
  logoutButton: {
    backgroundColor: "#f2f2f7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#fff1f1",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: AppColors.light_red, fontSize: 16, fontWeight: "600" },
});