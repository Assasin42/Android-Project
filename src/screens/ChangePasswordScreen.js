import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useTranslation } from "react-i18next";
import { AppColors } from "../styles/colors";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChangePassword = async () => {
    if (!current || !newPass || !confirm) {
      alert(t("changePassword.fillAll"));
      return;
    }
    if (newPass !== confirm) {
      alert(t("changePassword.notMatch"));
      return;
    }

    setLoading(true);
    try {
      const firebaseUser = auth.currentUser;

      // ✅ Mevcut şifreyi Firebase ile doğrula (client-side karşılaştırma GÜVENSİZdir)
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        current
      );
      await reauthenticateWithCredential(firebaseUser, credential);

      // ✅ Firebase Auth üzerinden şifreyi güncelle
      await updatePassword(firebaseUser, newPass);

      alert(t("changePassword.success"));
      navigation.goBack();
    } catch (error) {
      console.log(error);
      // Yanlış mevcut şifre hatası
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert(t("changePassword.wrongCurrent"));
      } else {
        alert(t("changePassword.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={AppColors.black} />
        </TouchableOpacity>
        {/* ✅ Hardcoded "Şifre Değiştir" → t() ile değiştirildi */}
        <Text style={styles.headerTitle}>{t("changePassword.title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        {/* ✅ Tüm label ve button metinleri t() kullanıyor */}
        <Text style={styles.label}>{t("changePassword.current")}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={AppColors.gray999}
          onChangeText={setCurrent}
          value={current}
        />

        <Text style={styles.label}>{t("changePassword.new")}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={AppColors.gray999}
          onChangeText={setNewPass}
          value={newPass}
        />

        <Text style={styles.label}>{t("changePassword.confirm")}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={AppColors.gray999}
          onChangeText={setConfirm}
          value={confirm}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={AppColors.white} />
          ) : (
            <Text style={styles.saveButtonText}>{t("changePassword.update")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: AppColors.black },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: AppColors.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  form: { padding: 25, marginTop: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.gray999,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AppColors.whiteEa,
    color: AppColors.black,
  },
  saveButton: {
    backgroundColor: AppColors.light_green,
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: AppColors.white, fontWeight: "bold", fontSize: 16 },
});