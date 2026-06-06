import { db, auth } from "../firebase/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  setDoc
} from "firebase/firestore";
// DİKKAT: signInWithEmailAndPassword eklendi!
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; 

// ------------------------------------------
// AUTH & USER İŞLEMLERİ
// ------------------------------------------

// --- YENİ EKLENEN GİRİŞ YAPMA FONKSİYONU ---
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Giriş işlemi sırasında hata:", error);
    throw error;
  }
};

// Yeni Kullanıcı Kayıt Fonksiyonu
export const registerUser = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      ...additionalData,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error("Kayıt işlemi sırasında hata:", error);
    throw error;
  }
};

// Kullanıcı verisini oku
export const getUser = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null; 

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Kullanıcı verisini güncelle
export const updateUser = async (data) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Kullanıcı giriş yapmamış");

  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
};

// Kullanıcı verisini sil
export const deleteUserData = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Kullanıcı giriş yapmamış");

  await deleteDoc(doc(db, "users", uid));
};

// ------------------------------------------
// OTOBÜS (BUS LINES) İŞLEMLERİ
// ------------------------------------------

export const getBusLines = async () => {
  const querySnapshot = await getDocs(collection(db, "busLines"));
  const list = [];
  querySnapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
};