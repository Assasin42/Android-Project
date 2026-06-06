import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();

  // Bildirim switch durumları
  const [isAllNotificationsEnabled, setIsAllNotificationsEnabled] = useState(true);
  const [isBusApproachingEnabled, setIsBusApproachingEnabled] = useState(true);
  const [isLineChangesEnabled, setIsLineChangesEnabled] = useState(false);
  const [isFavoriteStopsEnabled, setIsFavoriteStopsEnabled] = useState(true);

  // Genel bildirim açma/kapatma fonksiyonu
  const toggleAllNotifications = (value) => {
    setIsAllNotificationsEnabled(value);
    if (!value) {
      setIsBusApproachingEnabled(false);
      setIsLineChangesEnabled(false);
      setIsFavoriteStopsEnabled(false);
    } else {
      setIsBusApproachingEnabled(true);
      setIsFavoriteStopsEnabled(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirim Ayarları</Text>
        <View style={{ width: 24 }} /> {/* Dengeli header duruşu için boş alan */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Ana Bildirim Ayarı */}
        <View style={[styles.settingRow, styles.mainRow]}>
          <View style={styles.settingInfo}>
            <Text style={styles.mainLabel}>Bildirimleri İzin Ver</Text>
            <Text style={styles.subLabel}>Uygulamadan gelen tüm bildirimleri yönetin</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#FF9500' }}
            thumbColor={isAllNotificationsEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={toggleAllNotifications}
            value={isAllNotificationsEnabled}
          />
        </View>

        <Text style={styles.sectionTitle}>Uygulama İçi Bildirim Türleri</Text>

        {/* 1. Otobüs Yaklaşma Bildirimi */}
        <View style={[styles.settingRow, !isAllNotificationsEnabled && styles.disabledRow]}>
          <View style={styles.settingInfo}>
            <Text style={styles.label}>Otobüs Yaklaşma Alarmı</Text>
            <Text style={styles.subLabel}>Beklediğiniz otobüs durağa yaklaşınca haber ver</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#FF9500' }}
            thumbColor={isBusApproachingEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={setIsBusApproachingEnabled}
            value={isBusApproachingEnabled}
            disabled={!isAllNotificationsEnabled}
          />
        </View>

        {/* 2. Hat ve Güzergah Değişiklikleri */}
        <View style={[styles.settingRow, !isAllNotificationsEnabled && styles.disabledRow]}>
          <View style={styles.settingInfo}>
            <Text style={styles.label}>Hat ve Sefer Değişiklikleri</Text>
            <Text style={styles.subLabel}>Güzergah değişiklikleri ve iptal edilen sefer duyuruları</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#FF9500' }}
            thumbColor={isLineChangesEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={setIsLineChangesEnabled}
            value={isLineChangesEnabled}
            disabled={!isAllNotificationsEnabled}
          />
        </View>

        {/* 3. Favori Durak Güncellemeleri */}
        <View style={[styles.settingRow, !isAllNotificationsEnabled && styles.disabledRow]}>
          <View style={styles.settingInfo}>
            <Text style={styles.label}>Favori Durak Özetleri</Text>
            <Text style={styles.subLabel}>Sık kullandığınız duraklardaki yoğunluk ve güncel durumlar</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#FF9500' }}
            thumbColor={isFavoriteStopsEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={setIsFavoriteStopsEnabled}
            value={isFavoriteStopsEnabled}
            disabled={!isAllNotificationsEnabled}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: scale(16),
    height: verticalScale(50),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  backButton: {
    padding: moderateScale(4),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: scale(24), // Geri butonu simetrisini korumak için
  },
  content: {
    padding: scale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: verticalScale(10),
    marginTop: verticalScale(20),
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mainRow: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  settingInfo: {
    flex: 1,
    paddingRight: scale(10),
  },
  mainLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#333',
  },
  subLabel: {
    fontSize: moderateScale(12),
    color: '#8E8E93',
    marginTop: verticalScale(2),
  },
  disabledRow: {
    opacity: 0.5,
  },
});