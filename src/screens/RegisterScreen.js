import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { loginSuccess } from "../redux/authSlice";
import { updateProfile } from "firebase/auth";
import { AppColors } from "../styles/colors";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import useTheme from "../hooks/useTheme";

export default function RegisterScreen({ setIsRegistering }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRegister = async () => {
    if (!email || !password) {
      alert(t("register.emailRequired"));
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert(t("register.registerSuccess"));
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        surname: surname,
        phone: phone,
        email: email,
        createdAt: new Date().toISOString(),
      });

      setIsRegistering(false);
    } catch (error) {
      console.log("HATA KODU:", error.code);
      console.log("HATA MESAJI:", error.message);
      alert(t("register.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={require("../../assets/belediye_logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>{t("register.title")}</Text>

        <TextInput
          placeholder={t("register.name")}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder={t("register.surname")}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          placeholder={t("login.phone") || "Telefon"}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          placeholder={t("login.email") || "Email"}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder={t("login.password") || "Parola"}
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>{t("register.registerButton")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(false)}>
          <Text style={styles.link}>{t("register.alreadyAccount")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,   
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 25,
      paddingBottom: 40,
    },
    logo: {
      width: 250,
      height: 150,
      alignSelf: "center",
      marginTop: 60,
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: colors.textPrimary,           
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
      color: "#ffffff",                     
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