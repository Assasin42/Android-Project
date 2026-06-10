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
import useTheme from "../hooks/useTheme";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();          
  const styles = createStyles(colors);   

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
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        current
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPass);
      alert(t("changePassword.success"));
      navigation.goBack();
    } catch (error) {
      console.log(error);
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
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("changePassword.title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{t("changePassword.current")}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          onChangeText={setCurrent}
          value={current}
        />

        <Text style={styles.label}>{t("changePassword.new")}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          onChangeText={setNewPass}
          value={newPass}
        />

        <Text style={styles.label}>{t("changePassword.confirm")}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          onChangeText={setConfirm}
          value={confirm}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {t("changePassword.update")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 60,
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    backButton: {
      width: 40,
      height: 40,
      backgroundColor: colors.surface,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    form: {
      padding: 25,
      marginTop: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textMuted,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.inputBg,
      borderRadius: 12,
      padding: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      color: colors.textPrimary,
    },
    saveButton: {
      backgroundColor: "#34C759",
      padding: 16,
      borderRadius: 15,
      alignItems: "center",
      marginTop: 10,
    },
    saveButtonText: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });