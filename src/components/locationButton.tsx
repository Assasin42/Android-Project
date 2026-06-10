import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { AppColors } from "../styles/colors";
import { FontAwesome } from "@expo/vector-icons";
type Props = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};
export default function LocationButton({ label, theme, onPress }: Props) {
  if (theme == "primary") {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable
          style={[styles.button, { backgroundColor: AppColors.white }]}
          onPress={onPress}
        >
          <FontAwesome
            name="location-arrow"
            size={18}
            color={AppColors.dark_blue}
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: AppColors.black }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }
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
