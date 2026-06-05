import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';  // ✅
import { logout } from '../redux/authSlice';              // ✅
import { signOut, deleteUser } from 'firebase/auth';      // ✅
import { auth } from '../firebase/firebase';              // ✅
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";  // ✅
export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);  // Redux'tan kullanıcı

const handleLogout = async () => {
  try {
    await signOut(auth);          // Firebase oturumu kapat
    dispatch(logout());            // Redux state temizle (persist de silinir)
  } catch (error) {
    console.log(error);
    alert("Çıkış yapılamadı");
  }
};
  const handleDeleteAccount = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // ✅ Önce Firestore'daki veriyi sil
      await deleteDoc(doc(db, "users", currentUser.uid));
      
      // ✅ Sonra Firebase Auth'dan sil
      await deleteUser(currentUser);
    }
    dispatch(logout());
    alert('Hesabınız başarıyla silindi.');
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/requires-recent-login') {
      alert('Hesabı silmek için tekrar giriş yapmanız gerekiyor.');
    } else {
      alert('Hesap silinirken hata oluştu.');
    }
  }
};

  const displayData = {
    fullName: user?.displayName  || "Kullanıcı",
    email: user?.email || "",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.logoutText}>Hesabı Sil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { paddingHorizontal: 20, paddingTop: 70, paddingBottom: 5, justifyContent: 'center' },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  header: { paddingHorizontal: 25, paddingTop: 15, paddingBottom: 30, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  userPhone: { fontSize: 15, color: '#666', marginTop: 4 },
  menuSection: { paddingVertical: 10 },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 20, paddingHorizontal: 25, borderBottomWidth: 1, borderBottomColor: '#f9f9f9',
  },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  arrow: { fontSize: 24, color: '#ccc' },
  footer: { padding: 25, marginTop: 5 },
  logoutButton: { backgroundColor: '#fdf2f2', padding: 16, borderRadius: 12, alignItems: 'center' },
  deleteButton: { backgroundColor: '#fdf2f2', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#e74c3c', fontSize: 16, fontWeight: '600' },
});