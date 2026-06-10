import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";

type Props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

export default function LocationButton({ label, theme, onPress }: Props) {
  const { colors } = useTheme();

  if (theme === "primary") {
    return (
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.background }]}
          onPress={onPress}
        >
          <FontAwesome
            name="location-arrow"
            size={18}
            color={colors.primaryBlue}
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: colors.textPrimary }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: 48,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 60,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
