import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOYbPpiK9n6j1qw_n1_s47_QVGGk3MsvU",
  authDomain: "android-bffc6.firebaseapp.com",
  projectId: "android-bffc6",
  storageBucket: "android-bffc6.appspot.com",
  messagingSenderId: "992748310324",
  appId: "1:992748310324:web:056829aad3e4e6ed52df61",
};

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);  // ✅ zaten başlatılmış, sadece al
}

export { auth };
export const db = getFirestore(app);