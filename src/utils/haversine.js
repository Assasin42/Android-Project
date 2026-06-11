/**
 * Haversine Formülü
 * İki GPS koordinatı arasındaki düz mesafeyi metre cinsinden hesaplar.
 *
 * Nasıl çalışır:
 * Dünya bir küre olarak modellenir (R = 6.371.000 m).
 * İki nokta arasındaki açısal fark alınır, kürenin yüzeyine yansıtılır.
 * Sonuç: kuş uçuşu mesafe (metre).
 */

const EARTH_RADIUS_METERS = 6_371_000;

/**
 * @param {number} lat1 - Başlangıç enlemi (derece)
 * @param {number} lon1 - Başlangıç boylamı (derece)
 * @param {number} lat2 - Bitiş enlemi (derece)
 * @param {number} lon2 - Bitiş boylamı (derece)
 * @returns {number} Mesafe (metre, tam sayıya yuvarlanmış)
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Verilen durak listesinden kullanıcıya en yakın durağı bulur.
 *
 * @param {number} userLat
 * @param {number} userLon
 * @param {Array<{title: string, latitude: number, longitude: number}>} stops
 * @returns {{ stop: object, distanceMeters: number } | null}
 */
export function findNearestStop(userLat, userLon, stops) {
  if (!stops || stops.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  for (const stop of stops) {
    const dist = haversineDistance(userLat, userLon, stop.latitude, stop.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = stop;
    }
  }

  return { stop: nearest, distanceMeters: minDistance };
}