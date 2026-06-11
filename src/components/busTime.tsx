import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { buses } from "../data/buses";
import { getArrivalMinutes } from "../services/busServices";
import useTheme from "../hooks/useTheme";

interface BusTimeProps {
  stop: string | null;
}

interface Bus {
  id: string;
  name: string;
  startTime: string;
}

interface ThemeColors {
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentOrange?: string;
}

type Minutes = number | null;

function getMinutesDisplay(
  minutes: Minutes,
  colors: ThemeColors
): { timeLabel: string; badgeColor: string; isHere: boolean; noService: boolean } {
  const isHere = minutes === 0;
  const noService = minutes === null;

  if (noService) {
    return { timeLabel: "Servis Saati Dışı", badgeColor: "#888", isHere, noService };
  }
  if (isHere) {
    return { timeLabel: "Şu An Burada!", badgeColor: "#4CAF50", isHere, noService };
  }
  return {
    timeLabel: `${minutes} dakika sonra`,
    badgeColor: colors.accentOrange || "#FF6B35",
    isHere,
    noService,
  };
}

export default function BusTime({ stop }: BusTimeProps) {
  const [_tick, setTick] = useState(0);
  const { colors } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  if (!stop) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.stopTitle}>📍 {stop}</Text>

      {buses.map((bus: Bus) => {
        const minutes = getArrivalMinutes(bus, stop);
        const { timeLabel, badgeColor, isHere, noService } = getMinutesDisplay(
          minutes,
          colors
        );

        return (
          <View
            key={bus.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface || "rgba(255,255,255,0.12)",
                borderColor: isHere
                  ? "#4CAF50"
                  : colors.surfaceBorder || "rgba(255,255,255,0.2)",
              },
            ]}
          >
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Ionicons name="bus" size={18} color="#fff" />
              <Text style={styles.badgeText}>{bus.id}</Text>
            </View>

            <View style={styles.info}>
              <Text style={[styles.timeText, { color: colors.textPrimary || "#fff" }]}>
                {noService ? "⛔ " : isHere ? "✅ " : "🕐 "}
                {timeLabel}
              </Text>
              <Text style={[styles.subText, { color: colors.textSecondary || "#aaa" }]}>
                Kalkış: {bus.startTime} · 07:00–23:00
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: 8,
  },
  stopTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.85,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  badge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 2,
  },
  info: {
    flex: 1,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },
  subText: {
    fontSize: 11,
  },
});