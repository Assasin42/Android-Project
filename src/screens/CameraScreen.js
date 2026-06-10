import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import Button from "../components/button";

export default function CameraScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Ekran açıldığında daha önce fotoğraf çekilip çekilmediğini kontrol et
  useEffect(() => {
    const checkExistingPhoto = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        // 1. Önce AsyncStorage'dan kontrol et
        const localPhoto = await AsyncStorage.getItem(`profile_photo_${user.uid}`);

        if (localPhoto) {
          setPhotoUri(localPhoto);
        } else {
          // 2. AsyncStorage'da yoksa Firestore'dan kontrol et
          const docRef = doc(db, "users", user.uid, "photos", "profile");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const firestoreUri = docSnap.data().uri;
            setPhotoUri(firestoreUri);
            // AsyncStorage'ı da güncelle
            await AsyncStorage.setItem(`profile_photo_${user.uid}`, firestoreUri);
          }
        }
      } catch (error) {
        console.log("Fotoğraf kontrol hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingPhoto();
  }, [user?.uid]);

  // Fotoğraf Çekme ve Kırpma Fonksiyonu
  const openCameraAndCrop = async () => {
    // Kamera izni iste
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        t("camera.permissionRequired"),
        t("camera.permissionMessage")
      );
      return;
    }

    // Kamera aç, çek ve kırp
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhotoUri = result.assets[0].uri;
      savePhotoToDatabases(selectedPhotoUri);
    }
  };

  // Hem AsyncStorage hem Firestore'a kaydet
  const savePhotoToDatabases = async (uri) => {
    if (!user?.uid) return;
    try {
      setLoading(true);

      // 1. AsyncStorage'a kaydet
      await AsyncStorage.setItem(`profile_photo_${user.uid}`, uri);

      // 2. Firestore'a kaydet
      const docRef = doc(db, "users", user.uid, "photos", "profile");
      await setDoc(docRef, {
        uri: uri,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // State'i güncelle
      setPhotoUri(uri);
      Alert.alert(
        t("camera.success"),
        t("camera.uploadSuccess")
      );
    } catch (error) {
      console.log("Veritabanı kayıt hatası:", error);
      Alert.alert(
        t("camera.error"),
        t("camera.uploadError")
      );
    } finally {
      setLoading(false);
    }
  };

  // Yükleme ekranı
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accentOrange} />
          <Text style={styles.loadingText}>{t("camera.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Üst bar - Geri butonu */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <View style={styles.content}>
        {!photoUri ? (
          // Fotoğraf yoksa - Yeni Fotoğraf Çek butonu
          <View style={styles.emptyState}>
            <Ionicons
              name="camera-outline"
              size={80}
              color={colors.textMuted}
            />
            <Text style={styles.infoText}>
              {t("camera.noPhoto")}
            </Text>
            <Button
              label={t("camera.takePhoto")}
              theme="primary"
              onPress={openCameraAndCrop}
            />
          </View>
        ) : (
          // Fotoğraf varsa - Önizleme ve Güncelle butonu
          <View style={styles.photoLayout}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            </View>

            <View style={styles.updateButtonWrapper}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={openCameraAndCrop}
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color={colors.accentOrange}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.updateButtonText}>
                  {t("camera.updatePhoto")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Başarı mesajı */}
            <View style={styles.successMessage}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.successText}>
                {t("camera.photoSaved")}
              </Text>
            </View>
          </View>
        )}
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
    topBar: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 5,
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
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: colors.textMuted,
      fontSize: 16,
      marginTop: 12,
    },
    // Fotoğraf yokken
    emptyState: {
      alignItems: "center",
      width: "100%",
    },
    infoText: {
      color: colors.textMuted,
      fontSize: 16,
      marginTop: 20,
      marginBottom: 30,
      textAlign: "center",
    },
    // Fotoğraf varken
    photoLayout: {
      alignItems: "center",
      width: "100%",
    },
    imageWrapper: {
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 3,
      borderColor: colors.accentOrange,
      overflow: "hidden",
      marginBottom: 30,
      backgroundColor: colors.inputBg,
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    updateButtonWrapper: {
      width: "100%",
      alignItems: "center",
      marginBottom: 20,
    },
    updateButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.accentOrangeLight,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.accentOrange,
    },
    updateButtonText: {
      color: colors.accentOrange,
      fontSize: 16,
      fontWeight: "600",
    },
    successMessage: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.isDark
        ? "rgba(52, 199, 89, 0.15)"
        : "rgba(52, 199, 89, 0.1)",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginTop: 10,
    },
    successText: {
      color: colors.success,
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 8,
    },
  });