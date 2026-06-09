import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { AppColors } from "../styles/colors";

type Props = {
  label: string;
  theme?: "secondary";
  onPress: () => void; // ✅ EKLENDİ: Tıklama fonksiyonu tipi
};

export default function DrawerButton({ label, theme, onPress }: Props) {
  if (theme === "secondary") {
    return (
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { 
              backgroundColor: AppColors.white, 
              opacity: pressed ? 0.8 : 1 // Tıklanınca hafif solma efekti
            }
          ]}
          onPress={onPress} // ✅ EKLENDİ: Tetikleyici
        >
          <Text style={[styles.buttonLabel, { color: AppColors.black }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  // ✅ KRİTİK DÜZELTME: React bileşenleri boş kalırsa hata verir, null dönmek şarttır.
  return null; 
}

const styles = StyleSheet.create({
  buttonContainer: {
    // Menü butonu için sol üst köşeye sabitleme stilleri buraya alındı
    position: "absolute",
    top: 5, 
    left: -6,
    zIndex: 999, 
    elevation: 5,
    width: 50,  // Hamburger menü için kare bir buton daha şık durur
    height: 50,
  },
  button: {
    borderRadius: 25, // Kusursuz yuvarlak buton
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    // Hafif bir gölge efekti
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonLabel: {
    fontSize: 26, // ☰ simgesinin boyutu
    
    lineHeight: 30, // Çizgiyi dikeyde ortalamak için
  },
});