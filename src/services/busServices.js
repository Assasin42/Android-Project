import { busLocations } from "../data/busLocations";

const STOP_TIME = 10; // Her durak arası artık 10 dakika
const START_TIME = 7 * 60; // Sabah 07:00 (Dakika cinsinden: 420)
const END_TIME = 23 * 60; // Akşam 23:00 (Dakika cinsinden: 1380)

// Zaman stringini dakikaya çeviren güvenli fonksiyon
export const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;
  const cleanTime = timeStr.replace(".", ":").trim();
  const parts = cleanTime.split(":");
  if (parts.length < 2) return null;
  
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  
  if (isNaN(hour) || isNaN(minute)) return null;
  return hour * 60 + minute;
};

// Kullanıcının seçtiği durağa otobüsün kaç dakika sonra geleceğini hesaplayan fonksiyon
export const getArrivalMinutes = (bus, selectedStop) => {
  if (!bus || !selectedStop) return null;

  // Kullanıcının telefonunun o anki saati
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Otobüsler sabah 7 ile akşam 11 arasında çalışıyor
  if (currentMinutes > END_TIME || currentMinutes < START_TIME) {
    return null; // Servis saatleri dışındaysa "Servis Yok" döner
  }

  // Otobüsün ilk kalkış saati (Örn: "07:00", "07:10", "07:20")
  const timeStr = bus.startTime || bus.time;
  const startMinutes = timeToMinutes(timeStr);
  if (startMinutes === null) return null;

  // Seçilen durağın indeksini buluyoruz
  const targetStopIndex = busLocations.findIndex(
    (stop) => stop.title === selectedStop
  );
  if (targetStopIndex === -1) return null;

  // Toplam 1 tam turun kaç dakika sürdüğü (Durak sayısı * 10 dk)
  const totalLoopTime = busLocations.length * STOP_TIME;
  
  // İlk seferde otobüsün hedef durağa varış süresi
  const firstArrivalAtTarget = targetStopIndex * STOP_TIME;
  
  // Otobüsün ilk hareketinden itibaren geçen toplam süre
  const elapsed = currentMinutes - startMinutes;

  // Eğer otobüsün bugünlük ilk hareket saati henüz gelmediyse
  if (elapsed < 0) {
    return (startMinutes - currentMinutes) + firstArrivalAtTarget;
  }

  /* KESİNTİSİZ DÖNGÜ (BAŞA DÖNME) MATEMATİĞİ:
    Hedef durağa ilk varış süresi ile geçen sürenin farkını alıp, 
    toplam tur süresine göre mod (%) hesabını yapıyoruz. 
    Böylece otobüs son durağa varıp başa dönse bile kalan dakika hep doğru çıkar.
  */
  let remainder = (firstArrivalAtTarget - elapsed) % totalLoopTime;
  
  // Mod sonucu negatif çıkarsa toplam tur süresini ekleyerek pozitife çeviriyoruz
  if (remainder < 0) {
    remainder += totalLoopTime;
  }

  return remainder;
};

// Otobüsün şu an haritada/atılan turlarda hangi durakta olduğunu bulan fonksiyon
export const getCurrentStop = (bus) => {
  if (!bus) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (currentMinutes > END_TIME || currentMinutes < START_TIME) return null;

  const timeStr = bus.startTime || bus.time;
  const startMinutes = timeToMinutes(timeStr);
  if (startMinutes === null || currentMinutes < startMinutes) return null;

  const elapsed = currentMinutes - startMinutes;
  if (!busLocations || busLocations.length === 0) return null;

  // Geçen süreyi 10'a bölüp durak sayısına göre modunu alarak kesintisiz döngüdeki durağı buluyoruz
  const currentStopIndex = Math.floor(elapsed / STOP_TIME) % busLocations.length;
  return busLocations[currentStopIndex];
};