import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const seedBusLines = async () => {
  const busLines = [
    { id: "1", name: "1A", stops: ["Merkez", "Üniversite", "Hastane", "Stadyum"],time: "5dk" },
    { id: "2", name: "2A", stops: ["Otogar", "Merkez", "Stadyum"], time: "5dk" },
    { id: "3", name: "3A", stops: ["Üniversite", "Otogar", "Hastane"], time: "5dk" },
  ];

  for (const line of busLines) {
    await setDoc(doc(db, "busLines", line.id), line);
  }

  alert("Otobüs verileri yüklendi!");
};