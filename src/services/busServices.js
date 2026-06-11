// src/services/busService.js
import { busLocations } from "../data/busLocations";

const STOP_TIME = 2; // duraklar arası 2 dk
const END_TIME = 23 * 60; // 23:00 son servis saati

// Zamanı güvenli bir şekilde dakikaya çeviren fonksiyon (NaN önleyici)
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;

  // Kullanıcı kazara "07.00" yazdıysa "07:00" formatına çevirir
  const cleanTime = timeStr.replace(".", ":").trim();
  const parts = cleanTime.split(":");

  if (parts.length < 2) return null;

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  // Dönüşüm başarısızsa NaN yerine null fırlat
  if (isNaN(hour) || isNaN(minute)) return null;

  return hour * 60 + minute;
};

// Otobüsün şu anki durağını bulan fonksiyon
export const getCurrentStop = (bus) => {
  if (!bus) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Firestore'dan 'time', yerel veriden 'startTime' gelebilir. İkisini de kontrol et.
  const timeStr = bus.startTime || bus.time;
  const startMinutes = timeToMinutes(timeStr);

  if (startMinutes === null || currentMinutes > END_TIME) return null;
  if (currentMinutes < startMinutes) return null; // Otobüs henüz kalkmadıysa

  const elapsed = currentMinutes - startMinutes;
  
  if (!busLocations || busLocations.length === 0) return null;
  
  const currentStopIndex = Math.floor(elapsed / STOP_TIME) % busLocations.length;

  return busLocations[currentStopIndex];
};

// Kalan süreyi hesaplayan fonksiyon
export const getArrivalMinutes = (bus, selectedStop) => {
  if (!bus || !selectedStop) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentMinutes > END_TIME) return null;

  const timeStr = bus.startTime || bus.time;
  const startMinutes = timeToMinutes(timeStr);

  // Veri bozuksa veya henüz gelmediyse "Servis Yok" durumuna düşür (NaN yerine)
  if (startMinutes === null) return null;

  if (currentMinutes < startMinutes) {
    return startMinutes - currentMinutes; // Gelecek otobüsün kalkmasına kalan süre
  }

  const elapsed = currentMinutes - startMinutes;

  if (!busLocations || busLocations.length === 0) return null;

  const currentStopIndex = Math.floor(elapsed / STOP_TIME) % busLocations.length;

  const targetStopIndex = busLocations.findIndex(
    (stop) => stop.title === selectedStop
  );

  if (targetStopIndex === -1) return null; // Seçilen durak listede yoksa

  let stopDiff = targetStopIndex - currentStopIndex;

  // Eğer otobüs durağı geçmişse bir sonraki tur döngüsünü hesapla
  if (stopDiff < 0) {
    stopDiff += busLocations.length;
  }

  return stopDiff * STOP_TIME;
};