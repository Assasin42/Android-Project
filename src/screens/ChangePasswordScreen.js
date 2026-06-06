import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';


export default function ChangePasswordScreen({ route }) {
  const navigation = useNavigation();
  const { user } = route.params || {};
 
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const { t } = useTranslation();

  const handleChangePassword = async () => {
    if (!current || !newPass || !confirm) {
      alert(t('changePassword.fillAll'));
      return;
    }
    if (newPass !== confirm) {
      alert(t('changePassword.notMatch'));
      return;
    }
    if (String(current) !== String(user?.password)) {
      alert(t('changePassword.wrongCurrent'));
      return;
    }

    setLoading(true);
    try {
      await updateUser(user.id, { password: newPass });
      alert(t('changePassword.updateSuccess'));
      navigation.goBack();
    } catch (error) {
      console.log(error);
      alert(t('changePassword.updateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('changePassword.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{t('changePassword.currentPassword')}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#999"
          onChangeText={setCurrent}
        />

        <Text style={styles.label}>{t('changePassword.newPassword')}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#999"
          onChangeText={setNewPass}
        />

        <Text style={styles.label}>{t('changePassword.confirmPassword')}</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#999"
          onChangeText={setConfirm}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{t('changePassword.updateButton')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  backButton: {
    width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  form: { padding: 25, marginTop: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 20,
    borderWidth: 1, borderColor: '#EFEFEF', color: '#000',
  },
  saveButton: {
    backgroundColor: '#34C759', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});