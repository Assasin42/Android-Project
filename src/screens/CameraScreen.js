import { storage, db, auth } from "../firebase/firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-native";

export default function CameraScreen() {
  const [uploading, setUploading] = useState(false);

  const uploadImageAndSaveToFirestore = async (imageUri) => {
    if (!imageUri) return;

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Hata", "Oturum açmış bir kullanıcı bulunamadı.");
      return;
    }

    setUploading(true);

    try {
      // 1. Yerel URI'yi Blob formatına çevir
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // 2. Firebase Storage için benzersiz bir dosya yolu oluştur
      const filename = `users/${userId}/photos/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      // 3. Storage'a yükle
      await uploadBytes(storageRef, blob);

      // 4. Kalıcı internet URL'ini al
      const downloadURL = await getDownloadURL(storageRef);

      // 5. Kurallarına TAM UYGUN ŞEKİLDE alt koleksiyona (subcollection) kaydet
      // users -> KULLANICI_ID -> photos yoluna ekleme yapıyoruz
      await addDoc(collection(db, "users", userId, "photos"), {
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Başarılı!", "Fotoğrafınız kalıcı olarak kaydedildi.");
    } catch (error) {
      console.error("Yükleme hatası: ", error);
      Alert.alert("Hata", "Fotoğraf kaydedilirken bir sorun oluştu.");
    } finally {
      setUploading(false);
    }
  };
}