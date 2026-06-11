import { busLocations } from "../data/busLocations";

const STOP_TIME = 2; // Her durak arası 2 dakika
const START_TIME = 7 * 60; // 07:00
const END_TIME = 23 * 60; // 23:00
const MAX_WAIT_TIME = 60; // En fazla 60 dk göster

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

// Kullanıcının seçtiği durağa kaç dk sonra geleceğini hesaplar
export const getArrivalMinutes = (bus, selectedStop) => {
  if (!bus || !selectedStop) return null;

  const now = new Date();
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  if (
    currentMinutes > END_TIME ||
    currentMinutes < START_TIME
  ) {
    return null;
  }

  const timeStr = bus.startTime || bus.time;
  const startMinutes = timeToMinutes(timeStr);

  if (startMinutes === null) return null;

  const targetStopIndex = busLocations.findIndex(
    (stop) => stop.title === selectedStop
  );

  if (targetStopIndex === -1) return null;

  const totalLoopTime =
    busLocations.length * STOP_TIME;

  const firstArrivalAtTarget =
    targetStopIndex * STOP_TIME;

  const elapsed =
    currentMinutes - startMinutes;

  if (elapsed < 0) {
    const wait =
      (startMinutes - currentMinutes) +
      firstArrivalAtTarget;

    return Math.min(wait, MAX_WAIT_TIME);
  }

  let remainder =
    (firstArrivalAtTarget - elapsed) %
    totalLoopTime;

  if (remainder < 0) {
    remainder += totalLoopTime;
  }

  return Math.min(remainder, MAX_WAIT_TIME);
};

// Otobüs şu an hangi durakta
export const getCurrentStop = (bus) => {
  if (!bus) return null;

  const now = new Date();
  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  if (
    currentMinutes > END_TIME ||
    currentMinutes < START_TIME
  ) {
    return null;
  }

  const timeStr = bus.startTime || bus.time;
  const startMinutes =
    timeToMinutes(timeStr);

  if (
    startMinutes === null ||
    currentMinutes < startMinutes
  ) {
    return null;
  }

  const elapsed =
    currentMinutes - startMinutes;

  if (
    !busLocations ||
    busLocations.length === 0
  ) {
    return null;
  }

  const currentStopIndex =
    Math.floor(elapsed / STOP_TIME) %
    busLocations.length;

  return busLocations[currentStopIndex];
};