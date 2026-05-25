import React, { useState } from "react";
import { registerUser } from "../api/users_api.js";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function RegisterScreen({ setIsRegistering }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Lütfen zorunlu alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      const newUser = {
        name,
        surname,
        phone,
        email,
        password,
        createdAt: new Date().toISOString(),
        role: "user",
      };

      await registerUser(newUser);

      
      alert("Kayıt başarılı");
      setIsRegistering(false); 
      
    } catch (error) {
      console.log(error);
      alert("Hata oluştu");
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
            <Text style={styles.title}>Üye Ol</Text>

            <TextInput
              placeholder="Ad"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Soyad"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
            />

            <TextInput
              placeholder="Telefon"
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Şifre"
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
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(false)}>
              <Text style={styles.link}>Zaten hesabın var mı? Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  overlay: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
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