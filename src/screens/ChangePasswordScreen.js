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
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { AppColors } from "../styles/colors";
export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const dispatch = useDispatch();
  const handleChangePassword = async () => {
    if (!current || !newPass || !confirm) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    if (newPass !== confirm) {
      alert("Yeni şifreler eşleşmiyor.");
      return;
    }
    if (newPass.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;

      // Önce mevcut şifreyle kimlik doğrula
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, credential);

      // Sonra şifreyi güncelle
      await updatePassword(user, newPass);

      alert("Şifre başarıyla güncellendi!");

      await signOut(auth);
      dispatch(logout());
      navigation.goBack();
    } catch (error) {
      console.log(error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        alert("Mevcut şifre yanlış.");
      } else {
        alert("Şifre güncellenirken hata oluştu: " + error.message);
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
        <Text style={styles.headerTitle}>Şifre Değiştir</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Mevcut Şifre</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={AppColors.gray999}
          onChangeText={setCurrent}
        />

        <Text style={styles.label}>Yeni Şifre</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={AppColors.gray999}
          onChangeText={setNewPass}
        />

        <Text style={styles.label}>Yeni Şifre (Tekrar)</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={AppColors.gray999}
          onChangeText={setConfirm}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={AppColors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Şifreyi Güncelle</Text>
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
    borderColor: AppColors.white,
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
