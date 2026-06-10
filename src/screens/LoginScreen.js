import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { AppColors } from "../styles/colors";

import { useTranslation } from "react-i18next";
          
  

// DİKKAT: loginUser ve getUser birlikte import edildi
import { loginUser, getUser } from "../api/firestore_api";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      alert(t('login.emailRequired'));
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Redux'a kullanıcı bilgisini kaydet (persist ile saklanacak)
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      );
    } catch (error) {
      console.log(error);
      alert(t('login.wrongCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require("../../assets/belediye_logo2.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>GÜMÜŞHANE</Text>
      <Text style={styles.subtitle}>AKILLI ULAŞIM SİSTEMİ</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={AppColors.gray999}
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Şifre"
        placeholderTextColor={AppColors.gray999}
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
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegistering(true)}>
        <Text style={styles.link}>Hesabın yok mu? Üye Ol</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
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
    color: AppColors.gray1_0,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: AppColors.brown2,
    marginBottom: 30,
  },
  input: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.white,
    fontSize: 16,
  },
  button: {
    backgroundColor: AppColors.gray1_0,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  link: {
    color: AppColors.brown,
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
});
