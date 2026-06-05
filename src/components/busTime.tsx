import { StyleSheet, View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { getBusLines } from "../api/firestore_api";


type BusLine = {
  id: string;
  name: string;
  time?: string;
  stops?: string[];
};

// useState'i şöyle güncelle:

export default function BusTime() {
  const [busList, setBusList] = useState<BusLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusLines = async () => {
      try {
        const data = await getBusLines();
        setBusList(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusLines();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#1A3263" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {busList.map((bus, index) => (
          <View key={index} style={styles.Abuttons}>
            <Pressable style={styles.busTimeButton}>
              <Text style={styles.buttonText}>{bus.name}</Text>
              <View style={styles.timeContainer}>
                <Feather name="clock" size={18} color={"#1A3263"} />
                <Text style={styles.buttonText}>{bus.time ?? "-"}</Text>
              </View>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  busTimeButton: {
    borderRadius: 2,
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "#FEF3E2",
  },
  buttonText: {
    color: "#1A3263",
    fontSize: 16,
  },
  Abuttons: {
    paddingBottom: 30,
  },
  timeContainer: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  scroll: {
    maxHeight: 300,
    width: "90%",
  },
  scrollContent: {
    paddingBottom: 10,
  },
});