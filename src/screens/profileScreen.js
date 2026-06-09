import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image, // Eklendi: Fotoğrafı göstermek için
  Alert, // Eklendi
} from "react-native";
import React, { useState, useEffect } from "react"; // useState ve useEffect eklendi
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux"; 
import { logout } from "../redux/authSlice"; 
import { signOut, deleteUser } from "firebase/auth"; 
import { auth } from "../firebase/firebase"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase/firebase";
import { AppColors } from "../styles/colors"; 
import { doc, deleteDoc } from "firebase/firestore"; 
import * as ImagePicker from "expo-image-picker"; // Eklendi: Kamera kütüphanesi

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 

  // Fotoğraf URI tanımı
  const [imageUri, setImageUri] = useState(null);

  // Sayfa yüklendiğinde yerel veritabanından veya Firestore'dan mevcut profil resmini çekmek için:
  useEffect(() => {
    // Örnek: if (user?.photoURL) setImageUri(user.photoURL);
    // Veya yerel SQLite/AsyncStorage'dan çekebilirsin.
  }, [user]);

  // HOCANIN İSTEDİĞİ KAMERA AÇMA VE KIRPMA FONKSİYONU
  const handleOpenCamera = async () => {
    // 1. Kamera İzni İsteği
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Kamerayı kullanabilmek için izin vermelisiniz.");
      return;
    }

    // 2. Kamerayı Aç ve Kırpma Özelliğini Aktif Et
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // KURAL: Kırpma/seçme alanını açar
      aspect: [1, 1],      // Bire bir (Kare) kırpma alanı sunar
      quality: 0.7,        // Firestore için optimize edilmiş kalite
    });

    // 3. Fotoğraf Çekildiyse ve Onaylandıysa
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImageUri(selectedImage); // Ekranda göstermek için state güncelle
      // -------------------------------------------------------------
      // 📌 KURAL: HAZIRLADIĞIN VERİTABANI İŞLEMLERİNİ BURADA ÇAĞIRACAKSIN
      // -------------------------------------------------------------
      // Örnek:
      // uploadToFirestore(selectedImage);
      // saveToLocalDatabase(selectedImage);
      
      Alert.alert("Başarılı", "Profil fotoğrafı başarıyla kaydedildi!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      dispatch(logout()); 
    } catch (error) {
      console.log(error);
      alert("Çıkış yapılamadı");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteDoc(doc(db, "users", currentUser.uid));
        await deleteUser(currentUser);
      }
      dispatch(logout());
      alert("Hesabınız başarıyla silindi.");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/requires-recent-login") {
        alert("Hesabı silmek için tekrar giriş yapmanız gerekiyor.");
      } else {
        alert("Hesap silinirken hata oluştu.");
      }
    }
  };

  const displayData = {
    fullName: user?.displayName || "Kullanıcı",
    email: user?.email || "",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ==================== KAMERA VE PROFIL RESMI ALANI ==================== */}
        <View style={styles.cameraSection}>
          {!imageUri ? (
            /* KURAL: Daha önce fotoğraf çekilmemişse YALNIZCA bu buton gösterilir */
            <TouchableOpacity style={styles.primaryCaptureButton} onPress={handleOpenCamera}>
              <Ionicons name="camera-outline" size={24} color={AppColors.white} style={{ marginRight: 8 }} />
              <Text style={styles.primaryCaptureText}>Yeni Fotoğraf Çek</Text>
            </TouchableOpacity>
          ) : (
            /* KURAL: Fotoğraf tamamlanınca alan gösterilir ve altında Güncelle butonu yer alır */
            <View style={styles.avatarContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.avatarImage} />
              </View>
              
              <TouchableOpacity style={styles.updateButton} onPress={handleOpenCamera}>
                <Ionicons name="refresh-outline" size={18} color={AppColors.light_orange} style={{ marginRight: 5 }} />
                <Text style={styles.updateButtonText}>Fotoğrafı Güncelle</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* ======================================================================= */}

        <View style={styles.header}>
          <Text style={styles.userName}>{displayData.fullName}</Text>
          <Text style={styles.userPhone}>{displayData.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Hat Bildirim Ayarları</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Uygulama Hakkında</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Bize Ulaşın / Geri Bildirim</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Oturumu Kapat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.logoutText}>Hesabı Sil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.white },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 20, // Tasarımın yukarı kaymaması için ideal boyuta çekildi
    paddingBottom: 5,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // YENİ EKLENEN KAMERA VE AVATAR STİLLERİ
  cameraSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingHorizontal: 25,
  },
  primaryCaptureButton: {
    flexDirection: "row",
    backgroundColor: AppColors.light_orange, // Projenin ana rengine sadık kaldık
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  primaryCaptureText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70, // Kusursuz bir yuvarlak profil resmi
    borderWidth: 3,
    borderColor: AppColors.light_orange,
    overflow: "hidden",
    marginBottom: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  updateButton: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: AppColors.light_orange,
    alignItems: "center",
  },
  updateButtonText: {
    color: AppColors.light_orange,
    fontSize: 14,
    fontWeight: "600",
  },
  // MEVCUT STİLLERİN DEVAMI
  header: {
    paddingHorizontal: 25,
    paddingTop: 5,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Çizgi belirginleştirildi
    alignItems: "center", // Yazılar ortalandı
  },
  userName: { fontSize: 26, fontWeight: "bold", color: AppColors.black },
  userPhone: { fontSize: 15, color: AppColors.gray999, marginTop: 4 },
  menuSection: { paddingVertical: 10 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { fontSize: 16, color: AppColors.black333, fontWeight: "500" },
  arrow: { fontSize: 24, color: AppColors.gray2 },
  footer: { paddingHorizontal: 25, marginTop: 5 },
  logoutButton: {
    backgroundColor: "#f2f2f7", // Arka plan hafif gri yapıldı buton gibi durması için
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#fff1f1", // Silme butonuna hafif kırmızımsı bir ton
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: AppColors.light_red, fontSize: 16, fontWeight: "600" },
});