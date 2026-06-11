import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ─── Tip Tanımları ────────────────────────────────────────────────────────────
// Kendi RootStackParamList'ine göre uyarla
export type LocationData = {
  latitude: number;
  longitude: number;
  previewUrl: string;
};

type RootStackParamList = {
  MapSelection: undefined;
  CameraScreen: { locationData?: LocationData }; // kamera ekranının adı ne ise değiştir
};

type Nav = NativeStackNavigationProp<RootStackParamList, 'MapSelection'>;

// ─── Sabitler ─────────────────────────────────────────────────────────────────

// Gümüşhane Üniversitesi Mühendislik ve Doğa Bilimleri Fakültesi
const FACULTY_REGION: Region = {
  latitude: 40.4603,
  longitude: 39.4835,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

// Google Maps API key → kendi key'inle değiştir
// Aynı key'i hem AndroidManifest.xml'de hem burada kullan
const MAPS_API_KEY = 'AIzaSyAwl__phBaEFZ9I6rYCo5KY36K3j9lxXow';

/** Seçilen koordinat için static harita önizleme URL'si üretir */
export function generateStaticMapUrl(lat: number, lng: number): string {
  const center = `${lat},${lng}`;
  const marker = `color:red|${lat},${lng}`;
  return (
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${center}&zoom=16&size=600x300` +
    `&markers=${encodeURIComponent(marker)}` +
    `&key=${MAPS_API_KEY}`
  );
}

// ─── Bileşen ──────────────────────────────────────────────────────────────────

export default function MapSelectionScreen() {
  const navigation = useNavigation<Nav>();

  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  /** Haritaya dokunulduğunda marker güncelle */
  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });
  };

  /** Onayla → önceki ekrana konum + önizleme URL'si gönder */
  const handleConfirm = () => {
    if (!selectedCoord) {
      Alert.alert('Uyarı', 'Lütfen haritadan bir konum seçin.');
      return;
    }
    const previewUrl = generateStaticMapUrl(
      selectedCoord.latitude,
      selectedCoord.longitude,
    );
    // ► Kendi kamera/photo ekranının route adını kullan
    navigation.navigate('CameraScreen', {
      locationData: {
        latitude: selectedCoord.latitude,
        longitude: selectedCoord.longitude,
        previewUrl,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Harita */}
      <MapView
        style={styles.map}
        initialRegion={FACULTY_REGION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Fakülte başlangıç noktası — mavi */}
        <Marker
          coordinate={{
            latitude: FACULTY_REGION.latitude,
            longitude: FACULTY_REGION.longitude,
          }}
          title="Mühendislik ve Doğa Bilimleri Fakültesi"
          description="Başlangıç noktası"
          pinColor="blue"
        />

        {/* Kullanıcının seçtiği konum — kırmızı */}
        {selectedCoord && (
          <Marker
            coordinate={selectedCoord}
            title="Seçilen Konum"
            description={`${selectedCoord.latitude.toFixed(5)}, ${selectedCoord.longitude.toFixed(5)}`}
            pinColor="red"
          />
        )}
      </MapView>

      {/* Üst ipucu bandı */}
      <View style={styles.hintBanner} pointerEvents="none">
        <Text style={styles.hintText}>
          {selectedCoord
            ? `📍 Konum seçildi: ${selectedCoord.latitude.toFixed(4)}, ${selectedCoord.longitude.toFixed(4)}`
            : 'Konumunuzu seçmek için haritaya dokunun'}
        </Text>
      </View>

      {/* Alt butonlar */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnCancel]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>İptal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnConfirm, !selectedCoord && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={!selectedCoord}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Konumu Onayla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Stiller ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
  },
  hintBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 8,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  hintText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#9E9E9E',
  },
  btnConfirm: {
    backgroundColor: '#1976D2',
  },
  btnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});