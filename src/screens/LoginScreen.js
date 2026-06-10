import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { AppColors } from "../styles/colors";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";
import { loginUser, getUser } from "../api/firestore_api";
import { Platform } from "react-native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";

export default function LoginScreen({ setIsRegistering }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      alert(t("login.emailRequired"));
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
    } catch (error) {
      console.log(error);
      alert(t("login.wrongCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Image
        source={require("../../assets/belediye_logo2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>GÜMÜŞHANE</Text>
      <Text style={styles.subtitle}>AKILLI ULAŞIM SİSTEMİ</Text>

      <TextInput
        placeholder={t("login.email")}
        placeholderTextColor={colors.textMuted}
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder={t("login.password")}
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>{t("login.loginButton")}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegistering(true)}>
        <Text style={styles.link}>{t("login.noAccount")}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 25,
      justifyContent: "center",
    },
    logo: {
      width: 250,
      height: 150,
      alignSelf: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      color: colors.textPrimary,        
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      color: colors.textMuted,         
      marginBottom: 30,
    },
    input: {
      backgroundColor: colors.inputBg,  
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.inputBorder, 
      color: colors.textPrimary,        
      fontSize: 16,
    },
    button: {
      backgroundColor: colors.successGreen, 
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
      elevation: 5,
    },
    buttonText: {
      color: AppColors.white,               
      fontWeight: "bold",
      fontSize: 15,
    },
    link: {
      color: colors.textSecondary,       
      marginTop: 20,
      textAlign: "center",
      fontSize: 14,
    },
  });