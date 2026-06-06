import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";           
import { loginSuccess } from "../redux/authSlice";    

// DİKKAT: loginUser ve getUser birlikte import edildi
import { loginUser, getUser } from "../api/firestore_api";

export default function LoginScreen({ setIsRegistering }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth ile giriş yap (Şifre doğruluğunu Firebase kendisi kontrol eder)
      await loginUser(email, password);

      // 2. Giriş başarılıysa, giriş yapan kişinin Firestore'daki ekstra bilgilerini çek
      const userData = await getUser();

      if (userData) {
        // Veritabanında bilgileri varsa Redux'a kaydet (Uygulamaya giriş yapılır)
        dispatch(loginSuccess(userData));
      } else {
        // Eğer Firestore'da kaydı yoksa sadece e-posta ile giriş yapsın
        dispatch(loginSuccess({ email: email, role: "user" }));
      }

    } catch (error) {
      console.log("Hata:", error);
      alert(t('login.wrongCredentials')); // Yanlış şifre veya e-posta hatası
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.innerContainer} behavior="height">
      <Image
        source={require("../../assets/belediye_logo2.png")}
        style={styles.topImage}
        resizeMode="contain"
      />

      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title1}>{t('login.title')}</Text>
          <Text style={styles.title}>{t('login.subtitle')}</Text>

          <TextInput
            placeholder={t('login.email')}
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            placeholder={t('login.password')}
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('login.loginButton')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegistering(true)}>
            <Text style={styles.link}>{t('login.noAccount')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  innerContainer: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topImage: {
    width: 350,
    height: 250,
    alignSelf: "center",
    marginBottom: 50,
    marginTop: 90,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#504e4e",
  },
  title1: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    color: "#504e4e",
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#35393d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  link: { color: "#524a4a", marginTop: 20, textAlign: "center", fontSize: 14 },
});