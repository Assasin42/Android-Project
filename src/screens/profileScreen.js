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
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

 
export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { user: routeUser, setUserData } = route.params || {};
  const { t } = useTranslation();
 
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user");
    // setUserData(null) yerine Redux action'ını çalıştırıyoruz
    dispatch(logout()); 
  };
 
  const handleDeleteAccount = async () => {
    try {
      // 2. routeUser.id yerine auth.currentUser kullanıyoruz
      await deleteUser(auth.currentUser);
      await SecureStore.deleteItemAsync("user");
      // setUserData(null) yerine Redux action'ını çalıştırıyoruz
      dispatch(logout()); 
      alert(t('profile.deleteSuccess'));
    } catch (error) {
      console.log(error);
      alert(t('profile.deleteError'));
    }
  };
 
  const displayData = {
    fullName: routeUser?.name
      ? `${routeUser.name} ${routeUser?.surname || ''}`
      : t('profile.guestUser'),
    phone: routeUser?.phone || t('profile.phone'),
    email: routeUser?.email || "",
    memberSince: routeUser?.createdAt
      ? new Date(routeUser.createdAt).toLocaleDateString('tr-TR')
      : t('profile.unknown'),
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
          <Text style={styles.userPhone}>{displayData.phone}</Text>
          <Text style={styles.userPhone}>{displayData.email}</Text>
          <Text style={styles.memberDate}>
            {t('profile.memberSince')}: {displayData.memberSince}
          </Text>
        </View>
 
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>{t('profile.lineNotifications')}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
 
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>{t('profile.aboutApp')}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
 
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>{t('profile.feedback')}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
 
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>
 
        <View style={styles.footer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.logoutText}>{t('profile.deleteAccount')}</Text>
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
  userName: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', textTransform: 'capitalize' },
  userPhone: { fontSize: 15, color: '#666', marginTop: 4 },
  memberDate: { fontSize: 13, color: '#999', marginTop: 8 },
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