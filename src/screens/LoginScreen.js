import React, { useState } from "react";

import { getUsers } from "../api/users_api.js";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Image,
} from "react-native";

export default function LoginScreen({ setUserData, setIsRegistering }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  


 const handleLogin = async () => {
  try {
    const response = await getUsers();

    const users = response.data; 

    if (!Array.isArray(users)) {
      console.error("Hata: Gelen veri bir liste (array) değil!", users);
      alert("Sunucu verisi hatalı formatta.");
      return;
    }

    const foundUser = users.find(
      (user) => 
        user.email.trim().toLowerCase() === email.trim().toLowerCase() && 
        String(user.password) === String(password)
    );

    if (foundUser) {
      setUserData(foundUser); 
    } else {
      alert("Email veya şifre yanlış");
    }
  } catch (error) {
    console.log("Hata:", error);
    alert("Bağlantı hatası.");
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
            <Text style={styles.title1}>GÜMÜŞHANE</Text>
          <Text style={styles.title}>AKILLI ULAŞIM SİSTEMİ</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            style={styles.input}
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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegistering(true)}>
            <Text style={styles.link}>Hesabın yok mu? Üye Ol</Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
 background: {
  flex: 1,
},
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // biraz daha premium karanlık
    justifyContent: "center",
    paddingHorizontal: 25,
  },

 container: {
  flex: 1,
  backgroundColor: "#FFFFFF", 
},
innerContainer: {
  flex: 1,

},
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

    // gölge (çok fark yaratır)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  link: {
    color: "#524a4a",
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
});