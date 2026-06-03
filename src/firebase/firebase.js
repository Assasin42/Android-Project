import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCOYbPpiK9n6j1qw_n1_s47_QVGGk3MsvU",
  authDomain: "android-bffc6.firebaseapp.com",
  projectId: "android-bffc6",
  storageBucket: "android-bffc6.appspot.com",
  messagingSenderId: "992748310324",
  appId: "1:992748310324:web:056829aad3e4e6ed52df61",
};

// Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);