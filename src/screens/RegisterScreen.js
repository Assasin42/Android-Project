import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../api/firestore_api';
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import { doc, setDoc } from "firebase/firestore"; // Firestore işlemleri için ekledik
import { db } from "../firebase/firebase"; // Firestore referansı
import { loginSuccess } from "../redux/authSlice";
import { updateProfile } from "firebase/auth";  // updateProfile ekle
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

import { useTranslation } from "react-i18next";
 
export default function RegisterScreen({ setIsRegistering }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
 
  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert(t('register.fillRequired'));
      return;
    }
 
    setLoading(true);
    try {
      // Değişiklik burada: email ve password'ü ayrı, diğer verileri nesne olarak gönderiyoruz
      await registerUser(email, password, {
        name,
        surname,
        phone,
        role: "user",
      });
      
      alert(t('register.registerSuccess'));
      setIsRegistering(false);
    } catch (error) {
      console.log(error);
      alert(t('register.registerError'));
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <KeyboardAvoidingView style={styles.innerContainer} behavior="padding">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={require("../../assets/belediye_logo2.png")}
          style={styles.topImage}
          resizeMode="contain"
        />
 
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>{t('register.title')}</Text>
 
            <TextInput
              placeholder={t('register.name')}
              placeholderTextColor="#ccc"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
 
            <TextInput
              placeholder={t('register.surname')}
              placeholderTextColor="#ccc"
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
            />
 
            <TextInput
              placeholder={t('register.phone')}
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
 
            <TextInput
              placeholder={t('register.email')}
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
 
            <TextInput
              placeholder={t('register.password')}
              placeholderTextColor="#ccc"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
 
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{t('register.registerButton')}</Text>
              )}
            </TouchableOpacity>
 
            <TouchableOpacity onPress={() => setIsRegistering(false)}>
              <Text style={styles.link}>{t('register.alreadyAccount')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  innerContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  overlay: { paddingHorizontal: 25, paddingBottom: 40 },
  container: { flex: 1 },
  topImage: {
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
    color: "#504e4e",
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
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
    elevation: 5,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 15 },
  link: { color: "#524a4a", marginTop: 20, textAlign: "center", fontSize: 14 },
});