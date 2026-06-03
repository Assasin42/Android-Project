import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useDispatch } from "react-redux";
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

export default function RegisterScreen({ setIsRegistering }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRegister = async () => {
  if (!email || !password) {
    alert("Email ve şifre zorunlu");
    return;
  }

  try {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    // ✅ Login ekranına at, otomatik giriş yapma
    setIsRegistering(false);

  } catch (error) {
    console.log(error);
    alert("Kayıt başarısız: " + error.message);
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

        <Text style={styles.title}>Üye Ol</Text>

        <TextInput
          placeholder="Ad"
          placeholderTextColor="#999"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Soyad"
          placeholderTextColor="#999"
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          placeholder="Telefon"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(false)}>
          <Text style={styles.link}>Zaten hesabın var mı? Giriş Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#504e4e",
  },
  input: {
    backgroundColor: "#fff",
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
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  link: {
    color: "#524a4a",
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
});