import { db, auth } from "../firebase/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// Kullanıcı verisini oku
export const getUser = async () => {
  const uid = auth.currentUser?.uid;
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
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
};

// Kullanıcı verisini sil
export const deleteUserData = async () => {
  const uid = auth.currentUser?.uid;
  await deleteDoc(doc(db, "users", uid));
};

// Otobüs hatlarını oku
export const getBusLines = async () => {
  const querySnapshot = await getDocs(collection(db, "busLines"));
  const list = [];
  querySnapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });
  return list;
};